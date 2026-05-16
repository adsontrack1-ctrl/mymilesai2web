/*
 * MyMilesAI - Copyright (c) 2025-2026 Harijas LLC. All rights reserved.
 * Confidential and proprietary. Unauthorized use prohibited.
 * MyMilesAI is a trademark of Harijas LLC.
 * MyMilesAI is a recordkeeping tool - not tax advice.
 * See LICENSE for full terms. harijasllc@outlook.com
 */

/*
 * outbox.js — IndexedDB-backed offline write queue for /app/.
 *
 * Mirrors the iOS engine's outbox pattern (src/engine/tripOutbox.ts) so a
 * web user who logs a trip with no network — or who closes the laptop
 * before sync completes — does not lose the trip. On next page load (or
 * next online event, or next tab focus) the queue is drained against
 * Supabase via the same idempotent UPSERT(trip_uid) the foreground save
 * uses. Re-sending the same row is a no-op (per the global
 * trips_trip_uid_unique constraint shipped in migration
 * 20260515000000_trips_trip_uid_unique_tracked.sql).
 *
 * Why IndexedDB (not localStorage):
 *   - Survives laptop shutdown + browser close + cookie-only clears
 *   - Async, doesn't block the main thread on bursts
 *   - Reachable from Service Worker scope (future-proofs Background Sync)
 *   - localStorage caps at ~5MB sync and blocks the renderer thread.
 *
 * Records are keyed by trip_uid so concurrent edits to the same queued
 * trip merge instead of duplicating. Filtering by user_id on read
 * prevents an account-switch on the same browser from leaking the
 * previous user's queued trips.
 */

(function () {
  'use strict';

  const DB_NAME = 'mmai';
  const DB_VERSION = 1;
  const STORE = 'trip_outbox';

  let _dbPromise = null;

  function openDb() {
    if (_dbPromise) return _dbPromise;
    _dbPromise = new Promise((resolve, reject) => {
      try {
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = () => {
          const db = req.result;
          if (!db.objectStoreNames.contains(STORE)) {
            const store = db.createObjectStore(STORE, { keyPath: 'trip_uid' });
            store.createIndex('by_user_id', 'user_id', { unique: false });
            store.createIndex('by_queued_at', '_queued_at', { unique: false });
          }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      } catch (err) {
        // Some private-browsing modes throw synchronously on indexedDB.open
        reject(err);
      }
    });
    return _dbPromise;
  }

  function tx(mode) {
    return openDb().then((db) => {
      const t = db.transaction(STORE, mode);
      return { t, store: t.objectStore(STORE) };
    });
  }

  function promisify(req) {
    return new Promise((resolve, reject) => {
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  // ───────── public API ─────────

  /**
   * Put a trip into the outbox. If the trip_uid already exists, it is
   * replaced — supports "user edits a queued trip before it syncs".
   *
   * @param {object} row     Trip row (must include trip_uid + user_id).
   * @returns {Promise<object>}  The stored record with metadata fields.
   */
  async function put(row) {
    if (!row || !row.trip_uid || !row.user_id) {
      throw new Error('outbox.put: trip_uid and user_id are required');
    }
    const existing = await get(row.trip_uid).catch(() => null);
    const enriched = Object.assign({}, row, {
      _queued_at: existing ? existing._queued_at : Date.now(),
      _attempts: existing ? existing._attempts : 0,
      _last_attempt: existing ? existing._last_attempt : null,
      _last_error: null, // clear on re-queue; new attempt should not inherit old error
    });
    const { t, store } = await tx('readwrite');
    store.put(enriched);
    await new Promise((res, rej) => {
      t.oncomplete = res;
      t.onerror = () => rej(t.error);
      t.onabort = () => rej(t.error || new Error('outbox.put aborted'));
    });
    return enriched;
  }

  async function get(trip_uid) {
    const { store } = await tx('readonly');
    return promisify(store.get(trip_uid));
  }

  /**
   * Remove a trip from the outbox by trip_uid. Used both on successful
   * sync and on user-deletes-queued-trip-before-sync.
   */
  async function remove(trip_uid) {
    const { t, store } = await tx('readwrite');
    store.delete(trip_uid);
    await new Promise((res, rej) => {
      t.oncomplete = res;
      t.onerror = () => rej(t.error);
    });
  }

  /**
   * List all queued trips for a user, oldest first. user_id filter is
   * mandatory so the drain loop never tries to sync a previous account
   * holder's trips after a user-switch on the same browser.
   */
  async function listForUser(user_id) {
    if (!user_id) return [];
    const { store } = await tx('readonly');
    const idx = store.index('by_user_id');
    return new Promise((resolve, reject) => {
      const req = idx.getAll(IDBKeyRange.only(user_id));
      req.onsuccess = () => {
        const rows = (req.result || []).slice().sort(
          (a, b) => (a._queued_at || 0) - (b._queued_at || 0),
        );
        resolve(rows);
      };
      req.onerror = () => reject(req.error);
    });
  }

  /**
   * Count for UI ("3 trips queued") — fast, no row return.
   */
  async function countForUser(user_id) {
    const rows = await listForUser(user_id);
    return rows.length;
  }

  /**
   * Increment attempt counter + record failure metadata. Used by the
   * drain loop on a non-fatal error so backoff can kick in next time.
   */
  async function markAttemptFailed(trip_uid, errMessage) {
    const cur = await get(trip_uid);
    if (!cur) return;
    cur._attempts = (cur._attempts || 0) + 1;
    cur._last_attempt = Date.now();
    cur._last_error = String(errMessage || 'unknown');
    const { t, store } = await tx('readwrite');
    store.put(cur);
    await new Promise((res, rej) => {
      t.oncomplete = res;
      t.onerror = () => rej(t.error);
    });
    return cur;
  }

  /**
   * Exponential backoff: 1s, 2s, 4s, ... capped at 60s.
   * The drain loop skips a row whose previous attempt is within the
   * backoff window so a 503-storm doesn't hammer Supabase.
   */
  function isReadyToRetry(row) {
    if (!row._last_attempt) return true;
    const attempts = row._attempts || 0;
    const wait = Math.min(60_000, 1000 * Math.pow(2, attempts));
    return Date.now() - row._last_attempt >= wait;
  }

  // ───────── drain loop ─────────

  let _draining = false;
  /**
   * Attempt to sync every queued trip for the current user. Idempotent
   * (`upsert(onConflict: 'trip_uid')`) so a duplicate run is safe. Uses
   * a module-level lock to prevent concurrent drains stepping on each
   * other when multiple triggers fire at the same time (e.g. `online`
   * and `visibilitychange` both fire on tab focus).
   *
   * Returns a summary so callers can decide whether to flash a toast.
   */
  async function drain(supabase, session) {
    if (_draining) return { skipped: 'already-draining', synced: 0, failed: 0 };
    if (!navigator.onLine) return { skipped: 'offline', synced: 0, failed: 0 };
    if (!supabase || !session) return { skipped: 'no-session', synced: 0, failed: 0 };
    _draining = true;
    let synced = 0;
    let failed = 0;
    let skipped = 0;
    try {
      const queued = await listForUser(session.user.id);
      for (const row of queued) {
        if (!isReadyToRetry(row)) { skipped++; continue; }
        // Strip our metadata fields before sending to Supabase.
        const payload = Object.assign({}, row);
        delete payload._queued_at;
        delete payload._attempts;
        delete payload._last_attempt;
        delete payload._last_error;
        try {
          const { error } = await supabase
            .from('trips')
            .upsert(payload, { onConflict: 'trip_uid', ignoreDuplicates: false });
          if (error) throw new Error(error.message);
          await remove(row.trip_uid);
          synced++;
        } catch (err) {
          await markAttemptFailed(row.trip_uid, err && err.message ? err.message : String(err));
          failed++;
          console.warn('[outbox] sync failed for', row.trip_uid, err);
          // Continue draining the rest; one bad row should not block the others.
        }
      }
    } finally {
      _draining = false;
    }
    return { synced, failed, skipped };
  }

  // ───────── expose ─────────
  window.MMAIOutbox = {
    put,
    get,
    remove,
    listForUser,
    countForUser,
    drain,
    // Test hooks (used by manual QA, not by app code):
    _markAttemptFailed: markAttemptFailed,
    _isReadyToRetry: isReadyToRetry,
  };
})();

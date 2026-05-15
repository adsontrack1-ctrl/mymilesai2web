# Launch-Readiness Migration

Closes the residual backend gaps identified by inspecting the live
Supabase project (`dxpuuiqibtizewbbffjk`) on 2026-05-15. The original
five-section plan was trimmed after the live DB turned out to be in
much better shape than the production assessment claimed.

## Already done in the live DB (do **not** re-apply)

| Item | Where it was closed |
|---|---|
| `trips_trip_uid_unique` (globally unique on `trip_uid`) | Earlier migration; observed in `pg_constraint` |
| `cron.job` `delete-expired-accounts-daily` | Scheduled via Dashboard (see `20260427_apple_maps_followups.sql:104-126`) |
| `subscriptions` UPDATE self-promote policy dropped | `20260509000003_security_audit_hardening.sql` |
| `app_errors` admin email → `profiles.is_admin` | Same hardening migration |
| `trips` membership in `supabase_realtime` publication | Dashboard toggle |

## What this migration installs

| Section | Change | Why |
|---|---|---|
| 1 | CHECK on `trips.miles`, `trips.type`, `trips.deductible` | Front-line validation. Live data verified clean (0 negative miles, 0 unknown types, 0 out-of-range deductibles) — installs without rejecting any current row. |
| 2 | Three composite indexes on `trips` (active-chrono, deleted-chrono, endpoint) | At 475 rows today these are no-ops; they start mattering at ~10k trips per user. Installing now means no perf cliff to manage later. |
| 3 | Add `vehicles` + `profiles` to `supabase_realtime` publication | Web `wireRealtime` subscribes to all three tables; without membership the channel emits no events for vehicle/profile changes. |

Idempotent (every change wrapped in `DO $$` + `IF NOT EXISTS`).

## Apply

```bash
cp migrations/launch-readiness/20260515000000_launch_readiness.sql \
   ~/MyMilesAi-2/supabase/migrations/
cd ~/MyMilesAi-2 && supabase db push
```

The migration ends with three verification `SELECT`s. After push, run
them in the SQL Editor — each should return rows confirming the
section landed.

## iOS code impact

**None.** iOS keeps using its try-update-then-insert pattern in
`tripsRepo.upsert`; the new CHECK constraints don't bite because
client-side values are already valid; the indexes are transparent to
clients; iOS doesn't subscribe to Realtime, so the new publication
members are also invisible.

Optional later cleanup (touches the locked trip-saving zone — needs
explicit sign-off): the stale comment at `src/lib/repos/trips.ts:249-254`
about "can't guarantee UNIQUE" can be removed; the `trips_trip_uid_unique`
constraint has existed for a while.

## Companion: web client change in this PR

`assets/js/app.js` manual-log `openLogTripModal` now uses
`.upsert(row, { onConflict: 'trip_uid' })` to match the live constraint
shape (a single-column UNIQUE on `trip_uid`, not the compound
`(user_id, trip_uid)` the earlier draft of this PR assumed).

## Diagnostic kept for record

`00_report_trip_uid_duplicates.sql` is read-only and was run on
2026-05-15 — result: 0 duplicate pairs across all 475 trips. Kept in
this directory for operators who need to re-check before any future
constraint tightening.

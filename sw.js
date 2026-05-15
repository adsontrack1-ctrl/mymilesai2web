/*
 * MyMilesAI - Copyright (c) 2025-2026 Harijas LLC. All rights reserved.
 *
 * sw.js — minimal offline shell for mymilesai.com.
 *
 * Strategy:
 *  - Pre-cache the static skeleton (HTML + brand assets) on install so a
 *    cold open from the lock screen has something to render even with no
 *    network.
 *  - Network-first for HTML so the freshest copy wins when online; falls
 *    back to the cached shell on failure and finally to /offline.html.
 *  - Cache-first for compiled JS, CSS, fonts and images — these are
 *    fingerprinted by ?v= cache-bust so a new release invalidates by URL.
 *  - Never cache the Supabase REST/auth endpoints (they live on
 *    *.supabase.co — different origin, automatically bypassed).
 *  - Self-update on every load: a new SW takes control within seconds.
 */

const CACHE_VERSION = 'mmai-v1-2026-05-14';
const PRECACHE = [
  '/',
  '/offline.html',
  '/favicon.svg',
  '/manifest.webmanifest',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

function isHtmlRequest(req) {
  return req.mode === 'navigate' ||
    (req.headers.get('accept') || '').includes('text/html');
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  // Bypass cross-origin (Supabase, fonts, etc.) — let the browser handle.
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Never cache the authenticated /app/ shell or the /auth-callback/ — they
  // need fresh JWT + URL fragment handling every time.
  if (url.pathname.startsWith('/app/') || url.pathname.startsWith('/auth-callback')) return;

  if (isHtmlRequest(req)) {
    event.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE_VERSION).then((cache) => cache.put(req, copy));
        return res;
      }).catch(() => caches.match(req).then((m) => m || caches.match('/offline.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((m) => m || fetch(req).then((res) => {
      const copy = res.clone();
      if (res.status === 200) {
        caches.open(CACHE_VERSION).then((cache) => cache.put(req, copy));
      }
      return res;
    }))
  );
});

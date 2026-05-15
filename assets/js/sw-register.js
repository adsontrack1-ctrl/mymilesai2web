/*
 * MyMilesAI - Copyright (c) 2025-2026 Harijas LLC. All rights reserved.
 *
 * sw-register.js — registers the service worker after page load so
 * the marketing site gets an offline shell + install-to-home-screen.
 *
 * Kept defensive: catches every failure so a SW outage never bricks
 * the page. Skipped entirely on /app/ and /auth-callback/ — those
 * paths need fresh JWT/URL fragment handling and the SW bypasses
 * them anyway.
 */
(function () {
  'use strict';
  if (!('serviceWorker' in navigator)) return;
  if (location.pathname.startsWith('/app/') || location.pathname.startsWith('/auth-callback')) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch((err) => {
      console.warn('[mmai] service worker registration failed:', err);
    });
  });
})();

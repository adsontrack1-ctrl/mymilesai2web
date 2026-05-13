/*
 * MyMilesAI – locale module (window.MM)
 * Copyright (c) 2025-2026 Harijas LLC. All rights reserved.
 *
 * Shared by marketing pages (ms-parts1/sol-parts) and /app/.
 * localStorage key: mm_region ('US' | 'CA')
 * Dispatches CustomEvent('mm-locale-change', { detail: { locale } }) on set().
 */
(function () {
  'use strict';

  const KEY = 'mm_region';
  const SUPPORTED = ['US', 'CA'];

  // Subset of tax presets relevant to the US/CA locale toggle.
  // Full 9-country set with authority/refDoc detail lives in app.js.
  const PRESETS = {
    US: {
      rate: 0.725, symbol: '$',   unit: 'mi', currency: 'USD',
      authority: 'Standard', method: 'Standard mileage rate', taxYear: '2026',
    },
    CA: {
      rate: 0.72,  symbol: 'CA$', unit: 'km', currency: 'CAD',
      authority: 'Standard', method: 'Reasonable per-km allowance', taxYear: '2025',
    },
  };

  function read() {
    try { return localStorage.getItem(KEY) || 'US'; } catch (_e) { return 'US'; }
  }

  function write(cc) {
    const code = SUPPORTED.includes(String(cc).toUpperCase())
      ? String(cc).toUpperCase()
      : 'US';
    try { localStorage.setItem(KEY, code); } catch (_e) {}
    try {
      document.dispatchEvent(
        new CustomEvent('mm-locale-change', { detail: { locale: code } })
      );
    } catch (_e) {}
    return code;
  }

  function presetFor(cc) {
    return PRESETS[String(cc || '').toUpperCase()] || PRESETS.US;
  }

  // Detect country from browser locale — no network call, no geolocation.
  // Returns 'US' or 'CA' (the only two supported locales); defaults to 'US'.
  function detectCountry() {
    try {
      const lang = navigator.language || 'en-US';
      const loc = new Intl.Locale(lang).maximize();
      const r = loc.region || null;
      return SUPPORTED.includes(r) ? r : 'US';
    } catch (_e) {
      return 'US';
    }
  }

  window.MM = {
    get:          read,
    set:          write,
    presets:      PRESETS,
    presetFor,
    detectCountry,
    // Stubs for sol-parts.jsx compatibility — locale copy TBD in a future session.
    strings:  { US: {}, CA: {} },
    personas: {},
  };
})();

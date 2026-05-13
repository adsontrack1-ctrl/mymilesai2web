/*
 * MyMilesAI - Copyright (c) 2025-2026 Harijas LLC. All rights reserved.
 * Confidential and proprietary. Unauthorized use prohibited.
 * MyMilesAI is a trademark of Harijas LLC.
 * MyMilesAI is a recordkeeping tool - not tax advice.
 * See LICENSE for full terms. harijasllc@outlook.com
 */

/* App shell — Supabase auth guard + live dashboard wiring.
   Expects window.__MMAI_CONFIG__ set inline before this script loads,
   and the Supabase UMD bundle loaded before this script. */

(function () {
  'use strict';

  const cfg = window.__MMAI_CONFIG__;
  if (!cfg || !cfg.SUPABASE_URL || !cfg.SUPABASE_ANON_KEY) {
    console.error('[mmai] missing __MMAI_CONFIG__');
    return;
  }

  // Default IRS standard mileage rate for business use, 2026.
  // profile.mileage_rate overrides this when set.
  const IRS_RATE_2026 = 0.725;

  // Effective per-mile / per-km rate for a given profile. Order:
  //   1. user override (profile.mileage_rate, when > 0)
  //   2. country preset (TAX_PRESETS — declared later but in-scope when
  //      effectiveRate is called from boot/render code)
  //   3. IRS 2026 fallback ($0.725 / mi)
  function effectiveRate(profile) {
    const u = Number(profile && profile.mileage_rate);
    if (Number.isFinite(u) && u > 0) return u;
    try {
      const cc = String((profile && profile.country) || 'US').toUpperCase();
      const p = TAX_PRESETS[cc];
      if (p && Number.isFinite(p.rate) && p.rate > 0) return p.rate;
    } catch (_e) { /* TAX_PRESETS not yet in scope — fall through */ }
    return IRS_RATE_2026;
  }

  // Active display locale — may differ from profile.country when the user
  // toggles the region pill. Reads mm_region from localStorage via window.MM.
  function getActiveLocale() {
    if (window.MM) return window.MM.get();
    return ((_profileRef && _profileRef.country) || 'US').toUpperCase();
  }

  // Temporarily patches _profileRef to reflect the active locale for the
  // duration of fn(), then restores the original values. This lets all existing
  // render functions that read _profileRef.country see the toggled locale
  // without permanently mutating the stored profile.
  function withActiveLocale(fn) {
    const active = getActiveLocale();
    const savedCountry = _profileRef.country;
    const savedRate = _profileRef.mileage_rate;
    if (active !== ((savedCountry) || 'US').toUpperCase()) {
      _profileRef.country = active;
      _profileRef.mileage_rate = 0; // use locale default rate, not user override
    }
    try { return fn(); }
    finally {
      _profileRef.country = savedCountry;
      _profileRef.mileage_rate = savedRate;
    }
  }

  const { createClient } = window.supabase;
  const _sb = createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });

  // Closure state for the trips page filter pills.
  let _allTrips = [];
  let _profileRef = {};
  let _vehiclesList = [];
  let _tripsFilter = 'all';
  let _session = null;

  let _openClassifyDropdown = null;
  let _hoveredTripId = null;

  // Sentinel for trips with no vehicle_id assigned. Used as a pseudo-vehicle
  // option in the Reports page vehicle filter so users can see those trips
  // explicitly instead of wondering why their per-vehicle filter is empty.
  const UNASSIGNED_VID = '__unassigned__';

  // ───────── Auth guard ─────────
  async function guard() {
    const { data } = await _sb.auth.getSession();
    if (!data.session) {
      location.replace('/signin/');
      return null;
    }
    return data.session;
  }

  // ───────── DOM helpers ─────────
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);
  const setText = (sel, text) => {
    const el = $(sel);
    if (el && text != null) el.textContent = text;
  };
  const setAll = (sel, text) => {
    $$(sel).forEach((el) => { el.textContent = text; });
  };
  const escapeHtml = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  // ───────── Page switcher ─────────
  function wirePageSwitcher() {
    function go(name) {
      $$('.page').forEach((p) => p.classList.remove('on'));
      const pg = document.getElementById('p-' + name);
      if (pg) pg.classList.add('on');
      $$('.nav-item').forEach((n) => n.classList.remove('active'));
      const s = document.getElementById('nav-' + name);
      if (s) s.classList.add('active');
      $$('.tabs button').forEach((b) => b.classList.remove('on'));
      const order = ['dashboard', 'trips', 'places', 'reports', 'vehicles', 'settings'];
      const idx = order.indexOf(name);
      $$('.tabs button').forEach((b, i) => { if (i === idx) b.classList.add('on'); });
      const main = $('.main');
      if (main) main.scrollTop = 0;
    }
    window.mmaiGo = go;
    // Settings sub-nav
    $$('.set-nav .snav').forEach((n) => {
      n.addEventListener('click', () => {
        const target = n.getAttribute('data-sp');
        $$('.set-nav .snav').forEach((x) => x.classList.remove('on'));
        n.classList.add('on');
        $$('.sp').forEach((p) => p.classList.remove('on'));
        const panel = document.getElementById('sp-' + target);
        if (panel) panel.classList.add('on');
      });
    });
    // Manage-plan jump-to-billing
    $$('[data-jump]').forEach((b) => {
      b.addEventListener('click', () => {
        const t = b.getAttribute('data-jump');
        const nav = document.querySelector('.set-nav .snav[data-sp="' + t + '"]');
        if (nav) nav.click();
      });
    });
  }

  // ───────── Data loaders ─────────
  async function loadProfile(userId) {
    const cols = [
      'name', 'email', 'phone', 'plan', 'subscription_tier',
      'subscription_started_at', 'subscription_expires_at', 'subscription_canceled_at',
      'trial_ends_at', 'billing_interval', 'has_payment_method', 'mileage_rate',
      'timezone', 'locale', 'country', 'unit', 'unit_preference', 'currency',
      'company_name', 'home_address', 'work_address',
      'default_vehicle_id', 'total_trips', 'total_miles', 'named_locations',
      'onboarding_completed', 'account_status', 'auto_detect',
    ].join(',');
    const { data, error } = await _sb.from('profiles').select(cols).eq('id', userId).single();
    if (error) {
      console.warn('[mmai] profiles load:', error.message);
      return {};
    }
    return data || {};
  }

  async function loadTripsYtd(userId) {
    const year = new Date().getFullYear();
    const cols = 'id,from_addr,to_addr,miles,type,purpose,trip_purpose,client,notes,trip_date,trip_time,duration_mins,deductible,vehicle_id';
    const { data, error } = await _sb
      .from('trips')
      .select(cols)
      .eq('user_id', userId)
      .gte('trip_date', `${year}-01-01`)
      .is('deleted_at', null)
      .order('trip_date', { ascending: false })
      .order('trip_time', { ascending: false });
    if (error) {
      console.warn('[mmai] trips load:', error.message);
      return [];
    }
    return data || [];
  }

  async function loadVehicles(userId) {
    const { data, error } = await _sb
      .from('vehicles')
      .select('id,name,make,model,year,license_plate,odometer_start,is_default,created_at')
      .eq('user_id', userId)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });
    if (error) {
      console.warn('[mmai] vehicles load:', error.message);
      return [];
    }
    return data || [];
  }

  // ───────── Classification helpers ─────────
  // iOS app uses 'biz'/'pers'/'uncl'; some legacy rows use 'business'/'personal'.
  // Anything unclassified or unknown counts toward needs-review.
  function isBusiness(t) { return t === 'biz' || t === 'business'; }
  function isPersonal(t) { return t === 'pers' || t === 'personal'; }

  function computeKpis(trips, profile) {
    const tripCount = trips.length;
    let businessMiles = 0;
    let personalMiles = 0;
    let needsReview = 0;
    for (const t of trips) {
      const mi = Number(t.miles) || 0;
      if (isBusiness(t.type)) businessMiles += mi;
      else if (isPersonal(t.type)) personalMiles += mi;
      else needsReview += 1;
    }
    const totalMiles = businessMiles + personalMiles;
    const businessPct = totalMiles > 0 ? Math.round((businessMiles / totalMiles) * 100) : 0;
    const rate = effectiveRate(profile);
    const ytdDeduction = businessMiles * rate;
    return { tripCount, businessMiles, personalMiles, totalMiles, businessPct, needsReview, ytdDeduction, rate };
  }

  function computeQuarter(trips, kpis) {
    const now = new Date();
    const q = Math.floor(now.getMonth() / 3); // 0..3
    const qStart = new Date(now.getFullYear(), q * 3, 1);
    const qEndExcl = new Date(now.getFullYear(), q * 3 + 3, 1);
    let qBusiness = 0;
    for (const t of trips) {
      if (!isBusiness(t.type)) continue;
      const d = new Date(t.trip_date);
      if (d >= qStart && d < qEndExcl) qBusiness += Number(t.miles) || 0;
    }
    return {
      qLabel: ['Q1', 'Q2', 'Q3', 'Q4'][q],
      qBusiness,
      qDeduction: qBusiness * kpis.rate,
    };
  }

  // ───────── Format helpers ─────────
  function greetingFor(date = new Date()) {
    const h = date.getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  }

  function formatDollars(n) {
    let sym = '$';
    try { sym = taxPresetForCountry(getActiveLocale()).symbol; } catch (_e) {}
    return sym + (Math.round(n * 100) / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function formatDateLong(date = new Date()) {
    return date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
  }

  function formatDateShort(s) {
    if (!s) return '—';
    const d = new Date(s + 'T00:00:00');
    if (isNaN(d.getTime())) return s;
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }

  function formatTime(t) {
    if (!t) return '';
    const m = String(t).match(/^(\d{1,2}):(\d{2})/);
    if (!m) return t;
    let h = parseInt(m[1], 10);
    const ampm = h >= 12 ? 'pm' : 'am';
    h = h % 12 || 12;
    return `${h}:${m[2]}${ampm}`;
  }

  function deriveName(session, profile) {
    const md = session.user.user_metadata || {};
    return (
      profile.name ||
      md.display_name ||
      md.full_name ||
      md.name ||
      (session.user.email ? session.user.email.split('@')[0] : 'there')
    );
  }

  function classTag(type) {
    if (isBusiness(type)) return { cls: 'biz', label: 'Business' };
    if (isPersonal(type)) return { cls: 'pers', label: 'Personal' };
    return { cls: 'unreviewed', label: 'Review' };
  }

  function shortAddr(addr) {
    if (!addr) return '—';
    const s = String(addr).split(',')[0].trim();
    return s.length > 32 ? s.slice(0, 32) + '…' : s;
  }

  function initialsOf(name) {
    if (!name) return 'A';
    return name.split(/\s+/).map((s) => s[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || 'A';
  }

  // ───────── Renderers ─────────
  function renderHeader(session, profile, kpis) {
    const name = deriveName(session, profile);
    const first = name.split(' ')[0];
    setText('[data-mmai="eyebrow-date"]', formatDateLong());
    setText('[data-mmai="greeting-name"]', `${greetingFor()}, ${first} —`);
    setText('[data-mmai="greeting-count"]', String(kpis.needsReview));
    setText('[data-mmai="profile-name"]', name);
    const yr = new Date().getFullYear();
    const tier = profile.plan || profile.subscription_tier || 'Free';
    setText('[data-mmai="profile-plan"]', `${tier} · ${yr}`);
    const av = $('[data-mmai="profile-initial"]');
    if (av) av.textContent = first.slice(0, 1).toUpperCase();
  }

  function renderKpis(kpis) {
    setText('[data-mmai="ytd-deduction"]', formatDollars(kpis.ytdDeduction));
    setText('[data-mmai="miles-total"]', kpis.totalMiles.toLocaleString(undefined, { maximumFractionDigits: 0 }));
    setText('[data-mmai="business-pct"]', `${kpis.businessPct}%`);
    setText('[data-mmai="business-of-total"]', `${Math.round(kpis.businessMiles).toLocaleString()} of ${Math.round(kpis.totalMiles).toLocaleString()} mi`);
    setText('[data-mmai="needs-review"]', kpis.needsReview);
    setAll('[data-mmai="trips-count"]', kpis.tripCount.toLocaleString());
  }

  function renderRecentTrips(trips) {
    const root = $('[data-mmai="recent-trips"]');
    if (!root) return;
    if (!trips.length) {
      root.innerHTML = '<div class="empty">No trips this year yet. Tap "+ Log trip" to add one, or open the iOS app to auto-track.</div>';
      return;
    }
    const recent = trips.slice(0, 5);
    root.innerHTML = recent.map((t) => {
      const tag = classTag(t.type);
      const dot = tag.cls === 'unreviewed' ? '<span style="width:6px;height:6px;border-radius:50%;background:#C9A96E;display:inline-block;margin-right:6px"></span>' : (tag.cls === 'biz' ? '✓ ' : '');
      return `<div class="trip">
        <div class="time">${escapeHtml(formatDateShort(t.trip_date))}${t.trip_time ? ' · ' + escapeHtml(formatTime(t.trip_time)) : ''}</div>
        <div>
          <div class="from">${escapeHtml(shortAddr(t.from_addr))} → ${escapeHtml(shortAddr(t.to_addr))}</div>
          <div class="to">${t.duration_mins ? escapeHtml(t.duration_mins + ' min') : (t.purpose ? escapeHtml(t.purpose) : '—')}</div>
        </div>
        <div class="mi">${(Number(t.miles) || 0).toFixed(1)}<span style="font-size:11px;color:#6B6862"> mi</span></div>
        <div class="tag ${tag.cls}">${dot}${tag.label}</div>
      </div>`;
    }).join('');
  }

  function tripMatchesFilter(t, filter) {
    if (filter === 'biz') return isBusiness(t.type);
    if (filter === 'pers') return isPersonal(t.type);
    if (filter === 'unc') return !isBusiness(t.type) && !isPersonal(t.type);
    return true; // 'all'
  }

  // ───────── Date bucket helpers ─────────
  function bucketDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tripDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const diffDays = Math.round((today - tripDay) / 86400000);
    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'yesterday';
    if (diffDays <= 7) return 'week';
    if (d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()) return 'month';
    return 'earlier';
  }

  function renderGroupedTripRows(trips, profile) {
    const root = $('[data-mmai="trips-table-body"]');
    if (!root) return;
    if (!trips.length) {
      root.innerHTML = '<div class="empty">No trips match this filter.</div>';
      return;
    }
    const rate = effectiveRate(profile);
    const preset = taxPresetForCountry(getActiveLocale());
    const BUCKET_ORDER = ['today', 'yesterday', 'week', 'month', 'earlier'];
    const BUCKET_LABELS = { today: 'Today', yesterday: 'Yesterday', week: 'This week', month: 'Earlier this month', earlier: 'Earlier' };
    const groups = {};
    for (const t of trips) {
      const b = bucketDate(t.trip_date);
      if (!groups[b]) groups[b] = [];
      groups[b].push(t);
    }
    let html = '';
    for (const bucket of BUCKET_ORDER) {
      const group = groups[bucket];
      if (!group || !group.length) continue;
      const tw = group.length === 1 ? 'trip' : 'trips';
      html += `<div class="tt-group-header">${BUCKET_LABELS[bucket]} · ${group.length} ${tw}</div>`;
      for (const t of group) {
        const tag = classTag(t.type);
        const value = isBusiness(t.type)
          ? preset.symbol + (Number(t.miles) * rate).toFixed(2)
          : '—';
        const needsReview = tag.cls === 'unreviewed';
        const rowStyle = needsReview ? ' style="background:rgba(201,169,110,0.06)"' : '';
        const purText = t.purpose
          ? escapeHtml(t.purpose)
          : (needsReview ? '— Needs purpose' : tag.label);
        const purStyle = needsReview && !t.purpose ? ' style="color:#C9A96E"' : '';
        const tid = escapeHtml(String(t.id));
        html += `<div class="tt-row" data-trip-id="${tid}"${rowStyle}>
          <div class="dt">${escapeHtml(formatDateShort(t.trip_date)).toUpperCase()}${t.trip_time ? ' · ' + escapeHtml(formatTime(t.trip_time)).toUpperCase() : ''}</div>
          <div>
            <div class="from">${escapeHtml(shortAddr(t.from_addr))} → ${escapeHtml(shortAddr(t.to_addr))}</div>
            <div class="to">${t.duration_mins ? escapeHtml(String(t.duration_mins) + ' min') : '—'}</div>
          </div>
          <div class="pur"${purStyle}>${purText}</div>
          <div class="mi">${(Number(t.miles) || 0).toFixed(1)}<span style="font-size:10px;color:#6B6862;margin-left:2px">${escapeHtml(preset.unit)}</span></div>
          <div class="val">${value}</div>
          <div style="text-align:center">
            <button class="cls-pill cls-${tag.cls}" data-trip-id="${tid}">${tag.cls === 'biz' ? '✓ ' : ''}${tag.label}</button>
          </div>
          <div><button class="more" data-trip-id="${tid}">⋯</button></div>
        </div>`;
      }
    }
    root.innerHTML = html;
  }

  function applyTripsFilter(filter) {
    _tripsFilter = filter;
    $$('.pill[data-trips-filter]').forEach((p) => {
      p.classList.toggle('on', p.getAttribute('data-trips-filter') === filter);
    });
    const filtered = _allTrips.filter((t) => tripMatchesFilter(t, filter));
    renderTripRows(filtered, _profileRef);
  }

  function wireTripsFilters() {
    $$('.pill[data-trips-filter]').forEach((p) => {
      p.addEventListener('click', () => {
        applyTripsFilter(p.getAttribute('data-trips-filter'));
      });
    });
  }

  function recomputeAndRenderCounts() {
    let bizCount = 0, persCount = 0, uncCount = 0;
    for (const t of _allTrips) {
      if (isBusiness(t.type)) bizCount++;
      else if (isPersonal(t.type)) persCount++;
      else uncCount++;
    }
    setText('[data-mmai="trips-filter-biz"]', bizCount);
    setText('[data-mmai="trips-filter-pers"]', persCount);
    setText('[data-mmai="trips-filter-unc"]', uncCount);
    setText('[data-mmai="trips-eyebrow-review"]', `${_allTrips.length} trips · ${uncCount} need review`);
    setText('[data-mmai="needs-review"]', uncCount);
    setText('[data-mmai="greeting-count"]', String(uncCount));
  }

  function renderTripsTable(trips, profile) {
    const root = $('[data-mmai="trips-table-body"]');
    if (!root) return;

    recomputeAndRenderCounts();

    if (!trips.length) {
      root.innerHTML = '<div class="empty">No trips this year yet.</div>';
      return;
    }
    renderGroupedTripRows(trips.filter((t) => tripMatchesFilter(t, _tripsFilter)), profile);
  }

  function renderQuarter(trips, kpis) {
    const q = computeQuarter(trips, kpis);
    const preset = taxPresetForCountry(_profileRef.country);
    setText('[data-mmai="quarter-label"]', `${q.qLabel} deduction`);
    setText('[data-mmai="quarter-deduction"]', formatDollars(q.qDeduction));
    setText('[data-mmai="quarter-business-miles"]', Math.round(q.qBusiness).toLocaleString());
    setText('[data-mmai="quarter-rate"]', preset.symbol + kpis.rate.toFixed(3) + ' / ' + preset.unit);
    setText('[data-mmai="quarter-tax-saved"]', formatDollars(q.qDeduction * 0.24));
  }

  function renderSettings(profile, session) {
    const name = deriveName(session, profile);
    setText('[data-mmai="set-avatar"]', initialsOf(name));
    setText('[data-mmai="set-name"]', name);

    const tier = (profile.plan || profile.subscription_tier || 'Free').toUpperCase();
    let line;
    const now = new Date();
    if (profile.subscription_expires_at) {
      const exp = new Date(profile.subscription_expires_at);
      line = `${tier} · RENEWS ${exp.toLocaleDateString(undefined, { month: 'short', year: 'numeric' }).toUpperCase()}`;
    } else if (profile.trial_ends_at && new Date(profile.trial_ends_at) > now) {
      const exp = new Date(profile.trial_ends_at);
      line = `${tier} TRIAL · ENDS ${exp.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }).toUpperCase()}`;
    } else if (profile.subscription_started_at) {
      line = `${tier} · ACTIVE`;
    } else {
      line = `${tier}`;
    }
    setText('[data-mmai="set-plan-line"]', line);

    setText('[data-mmai="set-fullname"]', profile.name || '—');
    setText('[data-mmai="set-email"]', session.user.email || '—');
    setText('[data-mmai="set-phone"]', profile.phone || '—');
    setText('[data-mmai="edit-timezone"]', profile.timezone ? profile.timezone.replace(/_/g, ' ') : '—');
    setText('[data-mmai="set-language"]', profile.locale ? profile.locale.toUpperCase() : '—');
    setText('[data-mmai="set-workspace"]', profile.company_name || '—');
    setText('[data-mmai="edit-country"]', profile.country || '—');
  }

  function renderBilling(profile) {
    const tierRaw = profile.plan || profile.subscription_tier || 'Free';
    const tier = tierRaw.charAt(0).toUpperCase() + tierRaw.slice(1).toLowerCase();
    setText('[data-mmai="bill-plan"]', tier);

    let renewLine = '—';
    const now = new Date();
    if (profile.subscription_expires_at) {
      renewLine = `Renews ${new Date(profile.subscription_expires_at).toLocaleDateString()}`;
    } else if (profile.trial_ends_at && new Date(profile.trial_ends_at) > now) {
      renewLine = `Trial ends ${new Date(profile.trial_ends_at).toLocaleDateString()}`;
    } else if (profile.subscription_started_at) {
      renewLine = `Active since ${new Date(profile.subscription_started_at).toLocaleDateString()}`;
    } else {
      renewLine = profile.billing_interval ? `${profile.billing_interval[0].toUpperCase() + profile.billing_interval.slice(1)} billing` : 'Free plan';
    }
    setText('[data-mmai="bill-renew-line"]', renewLine);

    setText('[data-mmai="bill-payment-method"]', profile.has_payment_method ? 'Card on file' : 'No payment method');
    setText('[data-mmai="bill-payment-detail"]', profile.has_payment_method
      ? 'Payment details are managed in the iOS app'
      : 'Add a card in the iOS app to upgrade');
  }

  function renderVehicles(vehicles) {
    setAll('[data-mmai="vehicles-count"]', vehicles.length);
    const root = $('[data-mmai="vehicles-list"]');
    if (!root) return;
    if (!vehicles.length) {
      root.innerHTML = '<div class="empty">No vehicles yet. Tap "+ Add vehicle" above to start tracking trips by car.</div>';
      return;
    }
    root.innerHTML = vehicles.map((v) => {
      const yr = v.year || '';
      const sub = [v.make, v.model].filter(Boolean).join(' ') || '—';
      const plate = v.license_plate ? ` · ${escapeHtml(v.license_plate)}` : '';
      const odo = v.odometer_start != null ? `<div class="vstat"><div><div class="k">Starting odometer</div><div class="v">${Number(v.odometer_start).toLocaleString()} mi</div></div></div>` : '';
      const added = v.created_at ? new Date(v.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }).toUpperCase() : '';
      return `<div class="vcard">
        ${v.is_default ? '<div class="vbadge">● PRIMARY</div>' : ''}
        <div class="vhead">${escapeHtml(yr ? yr + ' ' : '')}${escapeHtml(v.name || 'Vehicle')}</div>
        <div class="vsub">${escapeHtml(sub.toUpperCase())}${plate}</div>
        ${odo}
        <div class="vfoot"><span>${added ? 'ADDED ' + added : ''}</span><span style="opacity:0.4">EDIT IN APP</span></div>
      </div>`;
    }).join('');
  }

  // Normalise an address for de-dup comparison: trim, lowercase, collapse
  // whitespace. Two entries with the same normalised address collapse into
  // one card; their visits sum.
  function normAddr(a) {
    return String(a || '').trim().toLowerCase().replace(/\s+/g, ' ');
  }
  function dedupePlaces(raw) {
    const byKey = new Map();
    for (const p of raw) {
      if (!p || typeof p !== 'object') continue;
      const key = normAddr(p.address) || ('id:' + p.id);
      const existing = byKey.get(key);
      if (!existing) {
        byKey.set(key, { ...p, visits: Number(p.visits) || 0 });
      } else {
        // Same address — keep the first label/id, sum visits across copies.
        existing.visits += Number(p.visits) || 0;
      }
    }
    return Array.from(byKey.values());
  }
  function renderPlaces(profile) {
    const raw = Array.isArray(profile.named_locations) ? profile.named_locations : [];
    const places = dedupePlaces(raw);
    setAll('[data-mmai="places-count"]', places.length);
    const root = $('[data-mmai="places-list"]');
    if (!root) return;
    if (!places.length) {
      root.innerHTML = '<div class="empty">No saved places yet. Tap "+ Add place" above to save a frequent destination.</div>';
      return;
    }
    root.innerHTML = places.map((p) => {
      const visits = Number.isFinite(p.visits) ? p.visits : 0;
      const coords = (p.lat != null && p.lng != null) ? `${Number(p.lat).toFixed(4)}, ${Number(p.lng).toFixed(4)}` : '';
      return `<div class="pcard">
        <div class="ph">${escapeHtml(p.label || 'Place')}</div>
        <div class="pa">${escapeHtml(p.address || coords || '—')}</div>
        <div class="prow"><span>Visits</span><span class="v">${visits}</span></div>
      </div>`;
    }).join('');
  }

  // ───────── Reports ─────────
  // Client-side mileage-log PDF generator. No backend.
  // PDFs are produced directly via jsPDF + autoTable (vendored) so the
  // user gets a one-tap download instead of a browser print dialog.
  const _reportState = {
    period: 'quarter',
    classification: 'biz',
    format: 'pdf',
    vehicle: '', // '' = all vehicles, otherwise a vehicle UUID (radio, single-select)
  };

  function periodRange(key) {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    const d = now.getDate();
    switch (key) {
      case 'week': {
        const start = new Date(y, m, d - 6);
        const end = new Date(y, m, d + 1);
        return [start, end];
      }
      case 'month':
        return [new Date(y, m, 1), new Date(y, m + 1, 1)];
      case 'quarter': {
        const q = Math.floor(m / 3);
        return [new Date(y, q * 3, 1), new Date(y, q * 3 + 3, 1)];
      }
      case 'ytd':
        return [new Date(y, 0, 1), new Date(y, 11, 31, 23, 59, 59)];
      case 'lastyear':
        return [new Date(y - 1, 0, 1), new Date(y, 0, 1)];
      default:
        return [new Date(y, 0, 1), new Date(y, 11, 31, 23, 59, 59)];
    }
  }

  function periodLabel(key) {
    const now = new Date();
    switch (key) {
      case 'week': return 'Last 7 Days';
      case 'month': return now.toLocaleString(undefined, { month: 'long', year: 'numeric' });
      case 'quarter': return `Q${Math.floor(now.getMonth() / 3) + 1} ${now.getFullYear()}`;
      case 'ytd': return `${now.getFullYear()} YTD`;
      case 'lastyear': return `${now.getFullYear() - 1} Annual`;
      default: return '';
    }
  }

  function tripsForReport() {
    const [start, end] = periodRange(_reportState.period);
    const cls = _reportState.classification;
    const wantVid = _reportState.vehicle; // '' = all
    const defaultVid = _profileRef.default_vehicle_id || null;
    return _allTrips.filter((t) => {
      const d = new Date(t.trip_date + 'T00:00:00');
      if (d < start || d >= end) return false;
      if (cls === 'biz' && !isBusiness(t.type)) return false;
      if (cls === 'bizpers' && !isBusiness(t.type) && !isPersonal(t.type)) return false;
      if (wantVid === UNASSIGNED_VID) {
        // "Unassigned" pseudo-vehicle: only trips with null vehicle_id.
        if (t.vehicle_id) return false;
      } else if (wantVid) {
        if (t.vehicle_id) {
          if (t.vehicle_id !== wantVid) return false;
        } else if (defaultVid && defaultVid === wantVid) {
          // Trip is unassigned but the user's default vehicle is the one they
          // picked: attribute the trip to the default vehicle.
        } else {
          return false;
        }
      }
      return true;
    });
  }

  function computeVehicleCounts() {
    // Count trips per vehicle for the current period + classification (but
    // ignoring the vehicle filter — that's what we're trying to summarize).
    const [start, end] = periodRange(_reportState.period);
    const cls = _reportState.classification;
    const counts = { [UNASSIGNED_VID]: 0, total: 0 };
    for (const v of _vehiclesList) counts[v.id] = 0;
    for (const t of _allTrips) {
      const d = new Date(t.trip_date + 'T00:00:00');
      if (d < start || d >= end) continue;
      if (cls === 'biz' && !isBusiness(t.type)) continue;
      if (cls === 'bizpers' && !isBusiness(t.type) && !isPersonal(t.type)) continue;
      counts.total++;
      const key = t.vehicle_id || UNASSIGNED_VID;
      counts[key] = (counts[key] || 0) + 1;
    }
    return counts;
  }

  function renderReportVehicleChecks() {
    const root = $('[data-mmai="rep-vehicles-list"]');
    if (!root) return;
    if (!_vehiclesList.length) {
      root.innerHTML = '<div class="empty" style="text-align:left;padding:16px;background:#F8F9FB;border:1px solid #E5E7EB;border-radius:10px">No vehicles yet. Open the Vehicles tab and tap "+ Add vehicle" to filter reports by vehicle.</div>';
      return;
    }

    const counts = computeVehicleCounts();
    const current = _reportState.vehicle;
    const tripWord = (n) => `${n} trip${n === 1 ? '' : 's'}`;

    const allRow = `<div class="vcheck${current === '' ? ' on' : ''}" data-rep-vehicle="">
      <div class="cb"></div>
      <div><strong style="font-weight:500">All vehicles</strong> · ${tripWord(counts.total)}</div>
    </div>`;

    const veh = _vehiclesList.map((v) => {
      const sub = [v.year, v.make, v.model].filter(Boolean).join(' ');
      const isDefault = _profileRef.default_vehicle_id === v.id;
      const cnt = counts[v.id] || 0;
      const onClass = current === v.id ? ' on' : '';
      return `<div class="vcheck${onClass}" data-rep-vehicle="${escapeHtml(v.id)}">
        <div class="cb"></div>
        <div><strong style="font-weight:500">${escapeHtml(v.name || 'Vehicle')}</strong>${sub ? ' · ' + escapeHtml(sub) : ''}${isDefault ? ' · DEFAULT' : ''} · ${tripWord(cnt)}</div>
      </div>`;
    }).join('');

    let unassignedRow = '';
    if (counts[UNASSIGNED_VID] > 0) {
      const onClass = current === UNASSIGNED_VID ? ' on' : '';
      unassignedRow = `<div class="vcheck${onClass}" data-rep-vehicle="${UNASSIGNED_VID}">
        <div class="cb"></div>
        <div><strong style="font-weight:500">Unassigned</strong> · trips with no vehicle tag · ${tripWord(counts[UNASSIGNED_VID])}</div>
      </div>`;
    }

    let notice = '';
    if (counts[UNASSIGNED_VID] > 0 && !_profileRef.default_vehicle_id) {
      notice = `<div class="vehicle-notice">Set a default vehicle in the iOS app to attribute past unassigned trips automatically.</div>`;
    } else if (counts[UNASSIGNED_VID] > 0 && _profileRef.default_vehicle_id) {
      notice = `<div class="vehicle-notice">${tripWord(counts[UNASSIGNED_VID])} unassigned — included when "Default" vehicle is selected.</div>`;
    }

    root.innerHTML = allRow + veh + unassignedRow + notice;

    $$('.vcheck[data-rep-vehicle]').forEach((el) => {
      el.addEventListener('click', () => {
        const vid = el.getAttribute('data-rep-vehicle');
        _reportState.vehicle = vid;
        $$('.vcheck[data-rep-vehicle]').forEach((x) => x.classList.toggle('on', x === el));
        renderReportPreview();
      });
    });
  }

  function renderReportPreview() {
    const trips = tripsForReport();
    const profile = _profileRef;
    const rate = effectiveRate(profile);
    const totalMi = trips.reduce((s, t) => s + (Number(t.miles) || 0), 0);
    const bizMi = trips.filter((t) => isBusiness(t.type)).reduce((s, t) => s + (Number(t.miles) || 0), 0);
    const deduction = bizMi * rate;

    setText('[data-mmai="rep-period-title"]', periodLabel(_reportState.period) + ' Mileage Log');
    setText('[data-mmai="rep-total-deduction"]', formatDollars(deduction));
    const preset = taxPresetForCountry(_profileRef.country);
    setText('[data-mmai="rep-totals-line"]',
      `${trips.length} trip${trips.length === 1 ? '' : 's'} · ${totalMi.toFixed(0)} ${preset.unit} · ${preset.authority} rate ${preset.symbol}${rate.toFixed(3)}`);

    const summary = $('[data-mmai="rep-summary"]');
    if (!summary) return;
    if (!trips.length) {
      // Build an actionable hint based on what's currently selected.
      let hint = '';
      const v = _reportState.vehicle;
      const c = _reportState.classification;
      if (v && v !== UNASSIGNED_VID) {
        hint = 'Try a different vehicle, "All vehicles", or pick "Unassigned" if your trips don\'t have a vehicle tag.';
      } else if (c === 'biz') {
        hint = 'Try Classification: "All trips" — your trips may be unclassified ("Needs review").';
      } else {
        hint = 'Try a wider period (YTD or Last year).';
      }
      summary.innerHTML = `<div style="padding:14px 0;color:#6B6862;font-size:11px;line-height:1.5">No trips match this filter.<br><span style="color:#0B0F0E">${escapeHtml(hint)}</span></div>`;
      return;
    }
    const top = trips.slice(0, 6);
    const more = trips.length > top.length ? `<div class="pdf-row" style="color:#6B6862;font-style:italic">… and ${trips.length - top.length} more</div>` : '';
    summary.innerHTML = top.map((t) => {
      const fa = (t.from_addr || '').split(',')[0];
      const ta = (t.to_addr || '').split(',')[0];
      const ded = isBusiness(t.type) ? '$' + (Number(t.miles) * rate).toFixed(2) : '—';
      return `<div class="pdf-row">
        <div>${escapeHtml(t.trip_date.slice(5))}</div>
        <div style="color:#0B0F0E">${escapeHtml(fa.slice(0, 24))} → ${escapeHtml(ta.slice(0, 24))}</div>
        <div style="text-align:right">${(Number(t.miles) || 0).toFixed(1)}</div>
        <div style="text-align:right;color:${isBusiness(t.type) ? '#1B5E3F' : '#6B6862'}">${ded.replace('$', '')}</div>
      </div>`;
    }).join('') + more;
  }

  function csvLine(arr) {
    return arr.map((s) => {
      const v = String(s == null ? '' : s);
      return /[,"\n\r]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
    }).join(',');
  }

  function genCSV(trips, profile) {
    const rate = effectiveRate(profile);
    const out = [csvLine(['Date', 'Time', 'From Address', 'To Address', 'Miles', 'Type', 'Purpose', 'Duration (min)', 'Vehicle ID', 'Deduction (USD)'])];
    for (const t of trips) {
      out.push(csvLine([
        t.trip_date,
        t.trip_time || '',
        t.from_addr || '',
        t.to_addr || '',
        (Number(t.miles) || 0).toFixed(2),
        t.type || '',
        t.purpose || '',
        t.duration_mins || '',
        t.vehicle_id || '',
        isBusiness(t.type) ? (Number(t.miles) * rate).toFixed(2) : '',
      ]));
    }
    return out.join('\r\n');
  }

  function genQuickBooksCSV(trips, profile) {
    // QuickBooks Online expense-import CSV: Date, Description, Vendor, Amount, Account, Class.
    // Only business trips emit rows (mileage isn't a personal QB expense).
    const rate = effectiveRate(profile);
    const out = [csvLine(['Date', 'Description', 'Vendor', 'Amount', 'Account', 'Class'])];
    for (const t of trips) {
      if (!isBusiness(t.type)) continue;
      const fa = (t.from_addr || '').split(',')[0];
      const ta = (t.to_addr || '').split(',')[0];
      const desc = `Business mileage: ${fa} → ${ta}${t.purpose ? ' · ' + t.purpose : ''}${t.client ? ' · ' + t.client : ''} (${(Number(t.miles) || 0).toFixed(1)} mi)`;
      out.push(csvLine([
        t.trip_date,
        desc,
        'MyMilesAI Mileage',
        (Number(t.miles) * rate).toFixed(2),
        'Travel - Auto/Mileage',
        '',
      ]));
    }
    return out.join('\r\n');
  }

  function genXeroCSV(trips, profile) {
    // Xero Bills CSV import format. Account code 461 is a common Travel-Domestic
    // code; users may need to remap to their chart of accounts.
    const rate = effectiveRate(profile);
    const contact = profile.name || 'Driver';
    const out = [csvLine(['*ContactName', '*InvoiceNumber', '*InvoiceDate', '*DueDate', '*Description', '*Quantity', '*UnitAmount', '*AccountCode'])];
    let n = 1;
    for (const t of trips) {
      if (!isBusiness(t.type)) continue;
      const fa = (t.from_addr || '').split(',')[0];
      const ta = (t.to_addr || '').split(',')[0];
      const desc = `Business mileage: ${fa} → ${ta}${t.purpose ? ' · ' + t.purpose : ''}`;
      const invNo = `MILE-${t.trip_date.replace(/-/g, '')}-${String(n++).padStart(3, '0')}`;
      out.push(csvLine([
        contact,
        invNo,
        t.trip_date,
        t.trip_date,
        desc,
        (Number(t.miles) || 0).toFixed(2),
        rate.toFixed(3),
        '461',
      ]));
    }
    return out.join('\r\n');
  }

  function downloadFile(filename, mime, content) {
    const blob = new Blob([content], { type: mime + ';charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  // Build a real PDF (Blob) using vendored jsPDF + autoTable. No print
  // dialog, no new tab — caller passes the Blob to triggerDownload().
  function genPDF(trips, profile, label) {
    if (!window.jspdf || !window.jspdf.jsPDF) {
      alert('PDF library failed to load. Please refresh the page and try again.');
      return null;
    }
    const { jsPDF } = window.jspdf;
    const rate = effectiveRate(profile);
    const totalMi = trips.reduce((s, t) => s + (Number(t.miles) || 0), 0);
    const bizMi = trips.filter((t) => isBusiness(t.type)).reduce((s, t) => s + (Number(t.miles) || 0), 0);
    const persMi = trips.filter((t) => isPersonal(t.type)).reduce((s, t) => s + (Number(t.miles) || 0), 0);
    const deduction = bizMi * rate;
    const drvName = profile.name || 'Driver';

    const doc = new jsPDF({ unit: 'pt', format: 'letter' });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 36; // 0.5in

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(11, 15, 14);
    doc.text('Mileage Log', margin, margin + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(85, 85, 85);
    doc.text(`${label} · Driver: ${drvName} · Generated ${new Date().toLocaleString()}`, margin, margin + 24);

    // PUB 463 badge (top-right)
    const badgeText = 'VERIFIED';
    const badgeW = doc.getTextWidth(badgeText) + 14;
    const badgeX = pageW - margin - badgeW;
    const badgeY = margin;
    doc.setFillColor(27, 94, 63);
    doc.roundedRect(badgeX, badgeY, badgeW, 16, 3, 3, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text(badgeText, badgeX + 7, badgeY + 11);

    // Underline
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(1.5);
    doc.line(margin, margin + 32, pageW - margin, margin + 32);

    // Trip rows
    const body = trips.map((t) => {
      const tag = classTag(t.type);
      const ded = isBusiness(t.type) ? '$' + (Number(t.miles) * rate).toFixed(2) : '—';
      const fa = (t.from_addr || '').split(',')[0];
      const ta = (t.to_addr || '').split(',')[0];
      return [
        t.trip_date || '',
        `${fa} → ${ta}`,
        t.purpose || (tag.cls === 'unreviewed' ? 'Unclassified' : ''),
        (Number(t.miles) || 0).toFixed(1),
        tag.label,
        ded,
      ];
    });

    doc.autoTable({
      head: [['Date', 'Route (Destination)', 'Business Purpose', 'Miles', 'Class', 'Deduction']],
      body: body.length ? body : [['—', 'No trips in this period match the filter.', '', '', '', '']],
      startY: margin + 42,
      margin: { left: margin, right: margin },
      styles: { font: 'helvetica', fontSize: 8.5, cellPadding: 4, overflow: 'linebreak' },
      headStyles: { fillColor: [245, 245, 245], textColor: [51, 51, 51], fontStyle: 'bold', fontSize: 7.5, lineWidth: { bottom: 1.5 }, lineColor: [153, 153, 153] },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 110 },
        3: { halign: 'right', cellWidth: 38 },
        4: { cellWidth: 50 },
        5: { halign: 'right', cellWidth: 55 },
      },
      didParseCell: (data) => {
        if (data.section !== 'body' || !trips[data.row.index]) return;
        const tag = classTag(trips[data.row.index].type);
        if (tag.cls === 'biz') data.cell.styles.fillColor = [240, 247, 244];
        else if (tag.cls === 'pers') data.cell.styles.fillColor = [253, 245, 249];
      },
    });

    // Footer (totals + notice). May need a new page if too tall.
    let y = (doc.lastAutoTable && doc.lastAutoTable.finalY) ? doc.lastAutoTable.finalY + 18 : margin + 200;
    if (y > pageH - 160) { doc.addPage(); y = margin; }

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(1.2);
    doc.line(margin, y, pageW - margin, y);
    y += 14;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    const totals = [
      ['Total trips', String(trips.length)],
      ['Total miles (all classes)', `${totalMi.toFixed(1)} mi`],
      ['Business miles', `${bizMi.toFixed(1)} mi`],
      ['Personal miles', `${persMi.toFixed(1)} mi`],
      ['Standard mileage rate', `$${rate.toFixed(3)} / mi`],
    ];
    for (const [k, v] of totals) {
      doc.text(k, margin, y);
      doc.text(v, pageW - margin, y, { align: 'right' });
      y += 14;
    }

    // Total deduction (highlighted)
    y += 4;
    doc.setDrawColor(153, 153, 153);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageW - margin, y);
    y += 16;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Total deduction (business × rate)', margin, y);
    doc.text('$' + deduction.toFixed(2), pageW - margin, y, { align: 'right' });
    y += 26;

    // Notice
    if (y > pageH - 80) { doc.addPage(); y = margin; }
    doc.setDrawColor(221, 221, 221);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageW - margin, y);
    y += 12;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(102, 102, 102);
    const notice = 'Method: Standard mileage rate. This log records the four required elements for each business trip: date, destination, business purpose, and miles driven. Vehicle records and odometer readings are maintained separately by the driver. Personal trips are listed for completeness but do not contribute to the deduction. MyMilesAI is a recordkeeping tool, not a tax preparer or tax-advice service — consult a qualified CPA or tax professional before filing.';
    const lines = doc.splitTextToSize(notice, pageW - margin * 2);
    doc.text(lines, margin, y);

    return doc.output('blob');
  }

  function triggerDownload(blob, filename) {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  function generateReport() {
    const trips = tripsForReport();
    const profile = _profileRef;
    const label = periodLabel(_reportState.period);
    const slug = _reportState.period;
    const stamp = new Date().toISOString().slice(0, 10);
    switch (_reportState.format) {
      case 'pdf':
        return triggerDownload(genPDF(trips, profile, label), `mileage-${slug}-${stamp}.pdf`);
      case 'csv':
        return downloadFile(`mileage-${slug}-${stamp}.csv`, 'text/csv', genCSV(trips, profile));
      case 'quickbooks':
        return downloadFile(`mileage-${slug}-${stamp}-quickbooks.csv`, 'text/csv', genQuickBooksCSV(trips, profile));
      case 'xero':
        return downloadFile(`mileage-${slug}-${stamp}-xero.csv`, 'text/csv', genXeroCSV(trips, profile));
    }
  }

  // Quick PDF/CSV exports from the Dashboard "Export for your CPA" card —
  // YTD, business-only PDF; YTD, all-trips CSV. No filter UI; one tap.
  function quickPdfExport() {
    if (!_allTrips || !_allTrips.length) {
      alert('No trips to export yet. Log trips in the iOS app first.');
      return;
    }
    const yr = new Date().getFullYear();
    const trips = _allTrips.filter((t) => isBusiness(t.type) && new Date(t.trip_date).getFullYear() === yr);
    const stamp = new Date().toISOString().slice(0, 10);
    triggerDownload(genPDF(trips, _profileRef, `Year-to-date ${yr}`), `mileage-ytd-${yr}-${stamp}.pdf`);
  }

  function quickCsvExport() {
    if (!_allTrips || !_allTrips.length) {
      alert('No trips to export yet. Log trips in the iOS app first.');
      return;
    }
    const yr = new Date().getFullYear();
    const trips = _allTrips.filter((t) => new Date(t.trip_date).getFullYear() === yr);
    const stamp = new Date().toISOString().slice(0, 10);
    downloadFile(`mileage-ytd-${yr}-${stamp}.csv`, 'text/csv', genCSV(trips, _profileRef));
  }

  // Trips-tab exports: respect the active filter (All / Business / Personal /
  // Needs review) so the download matches what the user is currently viewing.
  function tripsTabExport(format) {
    if (!_allTrips || !_allTrips.length) {
      alert('No trips to export yet. Log trips in the iOS app first.');
      return;
    }
    const trips = _allTrips.filter((t) => tripMatchesFilter(t, _tripsFilter));
    const stamp = new Date().toISOString().slice(0, 10);
    const filterLabel = _tripsFilter === 'all' ? 'all' : _tripsFilter;
    if (format === 'pdf') {
      triggerDownload(genPDF(trips, _profileRef, `Trips · ${filterLabel}`), `mileage-trips-${filterLabel}-${stamp}.pdf`);
    } else {
      downloadFile(`mileage-trips-${filterLabel}-${stamp}.csv`, 'text/csv', genCSV(trips, _profileRef));
    }
  }

  function wireReports() {
    $$('.pill[data-rep-period]').forEach((p) => {
      p.addEventListener('click', () => {
        _reportState.period = p.getAttribute('data-rep-period');
        $$('.pill[data-rep-period]').forEach((x) => x.classList.toggle('on', x === p));
        renderReportVehicleChecks();
        renderReportPreview();
      });
    });
    $$('.pill[data-rep-class]').forEach((p) => {
      p.addEventListener('click', () => {
        _reportState.classification = p.getAttribute('data-rep-class');
        $$('.pill[data-rep-class]').forEach((x) => x.classList.toggle('on', x === p));
        renderReportVehicleChecks();
        renderReportPreview();
      });
    });
    $$('.pill[data-rep-format]').forEach((p) => {
      p.addEventListener('click', () => {
        _reportState.format = p.getAttribute('data-rep-format');
        $$('.pill[data-rep-format]').forEach((x) => x.classList.toggle('on', x === p));
      });
    });
    const btn = $('[data-mmai="rep-generate"]');
    if (btn) btn.addEventListener('click', generateReport);

    // Dashboard quick exports
    const qpdf = $('[data-mmai="quick-pdf-export"]');
    if (qpdf) qpdf.addEventListener('click', quickPdfExport);
    const qcsv = $('[data-mmai="quick-csv-export"]');
    if (qcsv) qcsv.addEventListener('click', quickCsvExport);

    // Trips-tab exports
    const tcsv = $('[data-mmai="trips-export-csv"]');
    if (tcsv) tcsv.addEventListener('click', () => tripsTabExport('csv'));
    const tpdf = $('[data-mmai="trips-export-pdf"]');
    if (tpdf) tpdf.addEventListener('click', () => tripsTabExport('pdf'));
  }

  // ───────── Modal helper ─────────
  // Single shared overlay (#mmai-overlay) re-used for every form. Caller
  // describes title/body/onSave; helper renders, focuses first field,
  // wires Esc/cancel/save, and closes.
  let _modalOnSave = null;
  function openModal(opts) {
    const overlay = document.getElementById('mmai-overlay');
    if (!overlay) return;
    document.getElementById('mmai-modal-title').textContent = opts.title || '';
    const sub = document.getElementById('mmai-modal-sub');
    if (opts.sub) { sub.textContent = opts.sub; sub.hidden = false; } else { sub.hidden = true; }
    const body = document.getElementById('mmai-modal-body');
    body.innerHTML = opts.bodyHtml || '';
    const saveBtn = document.getElementById('mmai-modal-save');
    saveBtn.textContent = opts.saveLabel || 'Save';
    saveBtn.disabled = false;
    _modalOnSave = opts.onSave || null;
    overlay.hidden = false;
    if (opts.afterOpen) opts.afterOpen(body);
    const first = body.querySelector('input, select, textarea, button');
    if (first) first.focus();
  }
  function closeModal() {
    const overlay = document.getElementById('mmai-overlay');
    if (overlay) overlay.hidden = true;
    _modalOnSave = null;
  }
  function modalShowError(msg) {
    const body = document.getElementById('mmai-modal-body');
    if (!body) return;
    let er = body.querySelector('.mmai-error');
    if (!er) {
      er = document.createElement('div');
      er.className = 'mmai-error';
      body.appendChild(er);
    }
    er.textContent = msg;
  }
  function wireModal() {
    const overlay = document.getElementById('mmai-overlay');
    if (!overlay) return;
    document.getElementById('mmai-modal-close').addEventListener('click', closeModal);
    document.getElementById('mmai-modal-cancel').addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !overlay.hidden) closeModal(); });
    document.getElementById('mmai-modal-save').addEventListener('click', async () => {
      if (!_modalOnSave) return closeModal();
      const saveBtn = document.getElementById('mmai-modal-save');
      saveBtn.disabled = true;
      try {
        await _modalOnSave();
      } catch (err) {
        console.error('[mmai] modal save:', err);
        modalShowError(err && err.message ? err.message : 'Save failed. Please try again.');
        saveBtn.disabled = false;
      }
    });
  }

  // ───────── Search ─────────
  // Live filter on Trips page (address, purpose, notes, dates as text).
  // Dashboard search filters the Recent-trips panel only — it is not full-text.
  let _tripsSearch = '';
  let _dashSearch = '';
  function tripMatchesSearch(t, q) {
    if (!q) return true;
    const hay = [t.from_addr, t.to_addr, t.purpose, t.trip_purpose, t.trip_date, t.type]
      .filter(Boolean).join(' ').toLowerCase();
    return hay.includes(q);
  }
  function reapplyTripsView() {
    const filtered = _allTrips
      .filter((t) => tripMatchesFilter(t, _tripsFilter))
      .filter((t) => tripMatchesSearch(t, _tripsSearch));
    renderGroupedTripRows(filtered, _profileRef);
  }
  function reapplyDashboardRecent() {
    const filtered = _dashSearch
      ? _allTrips.filter((t) => tripMatchesSearch(t, _dashSearch))
      : _allTrips;
    renderRecentTrips(filtered);
  }
  function wireSearch() {
    const ts = document.querySelector('[data-mmai="trips-search"]');
    if (ts) {
      ts.addEventListener('input', () => {
        _tripsSearch = ts.value.trim().toLowerCase();
        reapplyTripsView();
      });
    }
    const ds = document.querySelector('[data-mmai="dash-search"]');
    if (ds) {
      ds.addEventListener('input', () => {
        _dashSearch = ds.value.trim().toLowerCase();
        reapplyDashboardRecent();
      });
    }
  }

  // Make applyTripsFilter use the search filter too.
  applyTripsFilter = function (filter) {
    _tripsFilter = filter;
    $$('.pill[data-trips-filter]').forEach((p) => {
      p.classList.toggle('on', p.getAttribute('data-trips-filter') === filter);
    });
    reapplyTripsView();
  };

  // ───────── Re-render after data change ─────────
  async function refreshAfterMutation(session) {
    const [profile, trips, vehicles] = await Promise.all([
      loadProfile(session.user.id),
      loadTripsYtd(session.user.id),
      loadVehicles(session.user.id),
    ]);
    _allTrips = trips;
    _profileRef = profile;
    _vehiclesList = vehicles;
    const kpis = computeKpis(trips, profile);
    renderHeader(session, profile, kpis);
    renderKpis(kpis);
    reapplyDashboardRecent();
    renderTripsTable(trips, profile);
    reapplyTripsView();
    renderQuarter(trips, kpis);
    renderSettings(profile, session);
    renderBilling(profile);
    renderVehicles(vehicles);
    renderPlaces(profile);
    renderReportVehicleChecks();
    renderReportPreview();
    renderTaxPanel();
  }

  // ───────── + Log trip ─────────
  function genTripUid() {
    if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
    return 'web-' + Date.now() + '-' + Math.random().toString(36).slice(2, 10);
  }
  function todayIso() { return new Date().toISOString().slice(0, 10); }
  function nowHm() {
    const d = new Date();
    return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  }

  function openLogTripModal(session) {
    const vehOpts = _vehiclesList.map((v) => {
      const sel = _profileRef.default_vehicle_id === v.id ? ' selected' : '';
      const label = [v.year, v.make, v.model].filter(Boolean).join(' ') || v.name || 'Vehicle';
      return `<option value="${escapeHtml(v.id)}"${sel}>${escapeHtml(v.name || 'Vehicle')} · ${escapeHtml(label)}</option>`;
    }).join('');
    const bodyHtml = `
      <div class="mmai-field-row">
        <div class="mmai-field"><label for="lt-date">Date</label><input id="lt-date" type="date" value="${todayIso()}"></div>
        <div class="mmai-field"><label for="lt-time">Time</label><input id="lt-time" type="time" value="${nowHm()}"></div>
      </div>
      <div class="mmai-field"><label for="lt-from">From address</label><input id="lt-from" type="text" placeholder="123 Main St, Houston, TX" autocomplete="off"></div>
      <div class="mmai-field"><label for="lt-to">To address</label><input id="lt-to" type="text" placeholder="456 Market St, Houston, TX" autocomplete="off"></div>
      <div class="mmai-field-row">
        <div class="mmai-field"><label for="lt-miles">Miles</label><input id="lt-miles" type="number" min="0" step="0.1" placeholder="12.5"></div>
        <div class="mmai-field"><label for="lt-duration">Duration (min)</label><input id="lt-duration" type="number" min="0" step="1" placeholder="22"></div>
      </div>
      <div class="mmai-field">
        <label>Classification</label>
        <div class="mmai-class-pills">
          <span class="pill on" data-lt-type="biz">Business</span>
          <span class="pill" data-lt-type="pers">Personal</span>
          <span class="pill" data-lt-type="uncl">Needs review</span>
        </div>
      </div>
      <div class="mmai-field"><label for="lt-purpose">Purpose</label><input id="lt-purpose" type="text" placeholder="Client meeting, supply run, etc."></div>
      ${_vehiclesList.length ? `<div class="mmai-field"><label for="lt-vehicle">Vehicle</label><select id="lt-vehicle"><option value="">— No vehicle —</option>${vehOpts}</select></div>` : ''}
      <div class="mmai-field"><label for="lt-notes">Notes (optional)</label><textarea id="lt-notes" rows="2" placeholder="Anything to remember about this trip"></textarea></div>
    `;
    let chosenType = 'biz';
    openModal({
      title: '+ Log trip',
      sub: 'Manual trips you log here appear instantly across the dashboard, trips, and reports.',
      bodyHtml,
      saveLabel: 'Log trip',
      afterOpen: (body) => {
        body.querySelectorAll('[data-lt-type]').forEach((p) => {
          p.addEventListener('click', () => {
            chosenType = p.getAttribute('data-lt-type');
            body.querySelectorAll('[data-lt-type]').forEach((x) => x.classList.toggle('on', x === p));
          });
        });
      },
      onSave: async () => {
        const date = document.getElementById('lt-date').value;
        const time = document.getElementById('lt-time').value;
        const from = document.getElementById('lt-from').value.trim();
        const to = document.getElementById('lt-to').value.trim();
        const miles = parseFloat(document.getElementById('lt-miles').value);
        const dur = parseInt(document.getElementById('lt-duration').value, 10);
        const purpose = document.getElementById('lt-purpose').value.trim();
        const notes = document.getElementById('lt-notes').value.trim();
        const vehSel = document.getElementById('lt-vehicle');
        const vehicleId = vehSel ? vehSel.value : '';
        if (!date) return modalShowError('Date is required.');
        if (!from || !to) return modalShowError('From and To addresses are required.');
        if (!Number.isFinite(miles) || miles <= 0) return modalShowError('Miles must be a positive number.');
        const row = {
          trip_uid: genTripUid(),
          user_id: session.user.id,
          trip_date: date,
          trip_time: time ? time + ':00' : '00:00:00',
          miles,
          duration_mins: Number.isFinite(dur) ? dur : 0,
          type: chosenType,
          from_addr: from,
          to_addr: to,
          purpose: purpose || null,
          notes: notes || null,
          source: 'web',
        };
        if (vehicleId) row.vehicle_id = vehicleId;
        const { error } = await _sb.from('trips').insert(row);
        if (error) throw new Error(error.message);
        closeModal();
        await refreshAfterMutation(session);
      },
    });
  }

  function wireLogTripButtons(session) {
    $$('[data-mmai="open-log-trip"]').forEach((b) => {
      b.addEventListener('click', () => openLogTripModal(session));
    });
  }

  // ───────── Trip row context menu ─────────
  let _openMenu = null;
  function closeRowMenu() {
    if (_openMenu) { _openMenu.remove(); _openMenu = null; }
  }
  function openTripRowMenu(anchor, trip, session) {
    closeRowMenu();
    const menu = document.createElement('div');
    menu.className = 'mmai-rowmenu';
    const del = document.createElement('div');
    del.className = 'mmai-rowmenu-item danger';
    del.textContent = '🗑  Delete trip';
    del.addEventListener('click', async () => {
      if (!confirm('Delete this trip? It will be hidden from reports and KPIs.')) return;
      try {
        const { error } = await _sb.from('trips')
          .update({ deleted_at: new Date().toISOString() })
          .eq('id', trip.id);
        if (error) throw new Error(error.message);
        closeRowMenu();
        await refreshAfterMutation(session);
      } catch (err) {
        console.error('[mmai] delete:', err);
        alert('Could not delete trip: ' + (err.message || err));
      }
    });
    menu.appendChild(del);

    document.body.appendChild(menu);
    const r = anchor.getBoundingClientRect();
    const mw = menu.offsetWidth || 200;
    let left = r.right + window.scrollX - mw;
    let top = r.bottom + window.scrollY + 4;
    if (left < 8) left = 8;
    if (left + mw > window.innerWidth - 8) left = window.innerWidth - mw - 8;
    menu.style.left = left + 'px';
    menu.style.top = top + 'px';
    _openMenu = menu;
    setTimeout(() => {
      const onDoc = (e) => {
        if (_openMenu && !_openMenu.contains(e.target)) {
          closeRowMenu();
          document.removeEventListener('click', onDoc, true);
        }
      };
      document.addEventListener('click', onDoc, true);
    }, 0);
  }

  // ───────── Classify trip (optimistic) ─────────
  async function classifyTrip(tripId, newType, session) {
    const idx = _allTrips.findIndex((t) => String(t.id) === tripId);
    if (idx < 0) return;
    const trip = _allTrips[idx];
    const oldType = trip.type;
    const oldDeductible = trip.deductible;
    const rate = effectiveRate(_profileRef);
    const newDeductible = newType === 'biz'
      ? Math.round(Number(trip.miles) * rate * 100) / 100
      : null;
    trip.type = newType;
    trip.deductible = newDeductible;
    recomputeAndRenderCounts();
    reapplyTripsView();
    try {
      const { error } = await _sb.from('trips')
        .update({ type: newType, deductible: newDeductible })
        .eq('id', tripId);
      if (error) throw new Error(error.message);
    } catch (err) {
      console.error('[mmai] classify:', err);
      trip.type = oldType;
      trip.deductible = oldDeductible;
      recomputeAndRenderCounts();
      reapplyTripsView();
      showToast("Couldn't update — try again");
    }
  }

  function showToast(msg) {
    const prev = document.querySelector('.mmai-toast');
    if (prev) prev.remove();
    const el = document.createElement('div');
    el.className = 'mmai-toast';
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => { if (el.parentNode) el.remove(); }, 3000);
  }

  // ───────── Classify dropdown ─────────
  function closeClassifyDropdown() {
    if (_openClassifyDropdown) { _openClassifyDropdown.remove(); _openClassifyDropdown = null; }
  }

  function showClassifyDropdown(pill, tripId, session) {
    closeClassifyDropdown();
    closeRowMenu();
    const trip = _allTrips.find((t) => String(t.id) === tripId);
    if (!trip) return;
    const currentCls = classTag(trip.type).cls;
    const OPTIONS = [
      { label: '✓ Business',    type: 'biz',  cls: 'biz' },
      { label: 'Personal',      type: 'pers', cls: 'pers' },
      { label: '? Needs review', type: 'uncl', cls: 'unreviewed' },
    ];
    const dropdown = document.createElement('div');
    dropdown.className = 'cls-dropdown';
    for (const opt of OPTIONS) {
      const btn = document.createElement('button');
      btn.className = 'cls-option' + (opt.cls === currentCls ? ' active' : '');
      btn.textContent = opt.label;
      btn.addEventListener('click', async () => {
        closeClassifyDropdown();
        await classifyTrip(tripId, opt.type, session);
      });
      dropdown.appendChild(btn);
    }
    document.body.appendChild(dropdown);
    const r = pill.getBoundingClientRect();
    const dw = dropdown.offsetWidth || 170;
    let left = r.left;
    if (left + dw > window.innerWidth - 8) left = window.innerWidth - dw - 8;
    dropdown.style.left = left + 'px';
    dropdown.style.top = (r.bottom + 4) + 'px';
    _openClassifyDropdown = dropdown;
    setTimeout(() => {
      const onDoc = (e) => {
        if (_openClassifyDropdown && !_openClassifyDropdown.contains(e.target)) {
          closeClassifyDropdown();
          document.removeEventListener('click', onDoc, true);
        }
      };
      document.addEventListener('click', onDoc, true);
    }, 0);
  }

  function wireClassifyDropdowns(session) {
    const root = $('[data-mmai="trips-table-body"]');
    if (!root) return;
    root.addEventListener('click', (e) => {
      const pill = e.target.closest('.cls-pill');
      if (!pill) return;
      e.stopPropagation();
      const tripId = pill.dataset.tripId;
      if (tripId) showClassifyDropdown(pill, tripId, session);
    });
  }

  function wireTripRowMenu(session) {
    const root = $('[data-mmai="trips-table-body"]');
    if (!root) return;
    root.addEventListener('click', (e) => {
      const more = e.target.closest('.more');
      if (!more) return;
      const tripId = more.dataset.tripId;
      const trip = _allTrips.find((t) => String(t.id) === tripId);
      if (!trip) return;
      openTripRowMenu(more, trip, session);
    });
  }

  // ───────── + Add vehicle ─────────
  function openAddVehicleModal(session) {
    const bodyHtml = `
      <div class="mmai-field"><label for="av-name">Nickname</label><input id="av-name" type="text" placeholder="Daily driver"></div>
      <div class="mmai-field-row">
        <div class="mmai-field"><label for="av-year">Year</label><input id="av-year" type="number" min="1900" max="2100" placeholder="${new Date().getFullYear()}"></div>
        <div class="mmai-field"><label for="av-make">Make</label><input id="av-make" type="text" placeholder="Toyota"></div>
      </div>
      <div class="mmai-field-row">
        <div class="mmai-field"><label for="av-model">Model</label><input id="av-model" type="text" placeholder="RAV4"></div>
        <div class="mmai-field"><label for="av-plate">License plate</label><input id="av-plate" type="text" placeholder="ABC-1234"></div>
      </div>
      <div class="mmai-field"><label for="av-odo">Starting odometer (mi)</label><input id="av-odo" type="number" min="0" step="1" placeholder="0"></div>
      <div class="mmai-field" style="flex-direction:row;align-items:center;gap:10px"><input id="av-default" type="checkbox" style="width:auto"><label for="av-default" style="margin:0;text-transform:none;letter-spacing:0;font-family:inherit;font-size:13px;font-weight:500;color:#0B0F0E">Set as default vehicle</label></div>
    `;
    openModal({
      title: '+ Add vehicle',
      sub: 'Used to attribute trips and filter reports.',
      bodyHtml,
      saveLabel: 'Add vehicle',
      onSave: async () => {
        const name = document.getElementById('av-name').value.trim();
        const year = parseInt(document.getElementById('av-year').value, 10);
        const make = document.getElementById('av-make').value.trim();
        const model = document.getElementById('av-model').value.trim();
        const plate = document.getElementById('av-plate').value.trim();
        const odo = parseFloat(document.getElementById('av-odo').value);
        const isDefault = document.getElementById('av-default').checked;
        if (!name) return modalShowError('Nickname is required.');
        // Demote previous default if user is setting a new one.
        if (isDefault) {
          const prev = _vehiclesList.find((v) => v.is_default);
          if (prev) {
            await _sb.from('vehicles').update({ is_default: false }).eq('id', prev.id);
          }
        }
        const row = {
          user_id: session.user.id,
          name,
          make: make || null,
          model: model || null,
          year: Number.isFinite(year) ? year : null,
          license_plate: plate || null,
          odometer_start: Number.isFinite(odo) ? odo : null,
          is_default: !!isDefault,
        };
        const { data, error } = await _sb.from('vehicles').insert(row).select().single();
        if (error) throw new Error(error.message);
        // If marked default, also write profile.default_vehicle_id.
        if (isDefault && data) {
          await _sb.from('profiles').update({ default_vehicle_id: data.id }).eq('id', session.user.id);
        }
        closeModal();
        await refreshAfterMutation(session);
      },
    });
  }
  function wireAddVehicleButton(session) {
    $$('[data-mmai="open-add-vehicle"]').forEach((b) => {
      b.addEventListener('click', () => openAddVehicleModal(session));
    });
  }

  // ───────── + Add place ─────────
  function openAddPlaceModal(session) {
    const bodyHtml = `
      <div class="mmai-field"><label for="ap-label">Label</label><input id="ap-label" type="text" placeholder="Home, Office, Client A"></div>
      <div class="mmai-field"><label for="ap-address">Address</label><input id="ap-address" type="text" placeholder="123 Main St, Houston, TX"></div>
      <div class="mmai-field-row">
        <div class="mmai-field"><label for="ap-lat">Latitude (optional)</label><input id="ap-lat" type="number" step="any" placeholder="29.7604"></div>
        <div class="mmai-field"><label for="ap-lng">Longitude (optional)</label><input id="ap-lng" type="number" step="any" placeholder="-95.3698"></div>
      </div>
      <div class="mmai-field-help">Coordinates let MyMilesAI snap trip endpoints to this place automatically. You can leave them blank — they're filled in automatically when you tag the location from the iOS app.</div>
    `;
    openModal({
      title: '+ Add place',
      sub: 'Saved places appear in the Places tab and help auto-classify recurring routes.',
      bodyHtml,
      saveLabel: 'Add place',
      onSave: async () => {
        const label = document.getElementById('ap-label').value.trim();
        const address = document.getElementById('ap-address').value.trim();
        const lat = parseFloat(document.getElementById('ap-lat').value);
        const lng = parseFloat(document.getElementById('ap-lng').value);
        if (!label) return modalShowError('Label is required.');
        if (!address) return modalShowError('Address is required.');
        const existing = Array.isArray(_profileRef.named_locations) ? _profileRef.named_locations.slice() : [];
        const key = normAddr(address);
        const dupIdx = existing.findIndex((e) => normAddr(e && e.address) === key);
        let next;
        if (dupIdx >= 0) {
          // Same address already saved — update label / coords on the existing
          // entry instead of appending a duplicate row.
          const prev = existing[dupIdx];
          existing[dupIdx] = {
            ...prev,
            label,
            address,
            lat: Number.isFinite(lat) ? lat : (prev.lat || 0),
            lng: Number.isFinite(lng) ? lng : (prev.lng || 0),
          };
          next = existing;
        } else {
          const entry = {
            id: 'loc-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
            label,
            address,
            lat: Number.isFinite(lat) ? lat : 0,
            lng: Number.isFinite(lng) ? lng : 0,
            visits: 0,
          };
          next = existing.concat([entry]);
        }
        const { error } = await _sb.from('profiles')
          .update({ named_locations: next })
          .eq('id', session.user.id);
        if (error) throw new Error(error.message);
        closeModal();
        await refreshAfterMutation(session);
      },
    });
  }
  function wireAddPlaceButton(session) {
    $$('[data-mmai="open-add-place"]').forEach((b) => {
      b.addEventListener('click', () => openAddPlaceModal(session));
    });
  }

  // ───────── Time zone helpers ─────────
  function detectDeviceTimezone() {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      return tz || null;
    } catch (_e) {
      return null;
    }
  }
  function listTimeZones() {
    try {
      if (typeof Intl.supportedValuesOf === 'function') {
        return Intl.supportedValuesOf('timeZone');
      }
    } catch (_e) {}
    // Curated fallback for browsers without Intl.supportedValuesOf.
    return [
      'UTC',
      'America/New_York', 'America/Chicago', 'America/Denver', 'America/Phoenix',
      'America/Los_Angeles', 'America/Anchorage', 'Pacific/Honolulu',
      'America/Toronto', 'America/Vancouver', 'America/Mexico_City',
      'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Madrid',
      'Asia/Dubai', 'Asia/Kolkata', 'Asia/Singapore', 'Asia/Tokyo',
      'Australia/Sydney', 'Pacific/Auckland',
    ];
  }
  // First-install auto-set: if profile.timezone is empty, write the device's
  // resolved IANA zone so trip timestamps and report cutoffs are correct from
  // day one. Idempotent — only fires when the column is null/empty.
  async function ensureProfileTimezone(session) {
    if (_profileRef.timezone) return;
    const tz = detectDeviceTimezone();
    if (!tz) return;
    const { error } = await _sb.from('profiles').update({ timezone: tz }).eq('id', session.user.id);
    if (error) {
      console.warn('[mmai] auto-set timezone:', error.message);
      return;
    }
    _profileRef.timezone = tz;
  }

  // ───────── Country-specific tax presets ─────────
  // Per-country defaults for the Tax preferences panel and rate editor.
  // The user's profile.mileage_rate (when set) always wins — these only
  // populate the suggested default and the displayed unit/symbol/authority.
  // Falls back to US for any country not in this map.
  const TAX_PRESETS = {
    US: { rate: 0.725, symbol: '$',  unit: 'mi', authority: 'Standard',                  method: 'Standard mileage rate',          refDoc: 'Standard rates',    taxYear: '2026',     noteLine: 'Overrides the standard mileage rate ($0.725 / mi for 2026 business use).' },
    GB: { rate: 0.45,  symbol: '£',  unit: 'mi', authority: 'HMRC',                      method: 'Approved Mileage Allowance',     refDoc: 'AMAP rates',        taxYear: '2025/26',  noteLine: 'Overrides the HMRC default (£0.45/mi first 10,000 mi/year, £0.25/mi after).' },
    CA: { rate: 0.72,  symbol: 'CA$',unit: 'km', authority: 'Standard',                  method: 'Reasonable per-km allowance',    refDoc: 'Standard rates',    taxYear: '2025',     noteLine: 'Overrides the standard per-km rate (CA$0.72/km first 5,000 km, CA$0.66/km after).' },
    AU: { rate: 0.88,  symbol: 'A$', unit: 'km', authority: 'ATO',                       method: 'Cents per kilometre',            refDoc: 'Cents-per-km',      taxYear: '2024-25',  noteLine: 'Overrides the ATO default (A$0.88/km, capped at 5,000 km/year).' },
    DE: { rate: 0.30,  symbol: '€',  unit: 'km', authority: 'Bundesfinanzministerium',   method: 'Entfernungspauschale',           refDoc: 'EStG § 9',          taxYear: '2026',     noteLine: 'Overrides the Pendlerpauschale default (€0.30/km up to 20 km, €0.38/km thereafter).' },
    FR: { rate: 0.529, symbol: '€',  unit: 'km', authority: 'DGFiP',                     method: 'Barème kilométrique',            refDoc: 'Barème BIC-BNC',    taxYear: '2025',     noteLine: 'Overrides the DGFiP barème (varies by engine fiscal horsepower and distance).' },
    IE: { rate: 0.41,  symbol: '€',  unit: 'km', authority: 'Revenue',                   method: 'Civil service kilometric rates', refDoc: 'Civil service',     taxYear: '2025',     noteLine: 'Overrides the Revenue civil service rate (€0.41/km first 1,500 km).' },
    NL: { rate: 0.23,  symbol: '€',  unit: 'km', authority: 'Belastingdienst',           method: 'Onbelaste km-vergoeding',        refDoc: 'Belastingdienst',   taxYear: '2025',     noteLine: 'Overrides the Belastingdienst tax-free allowance (€0.23/km).' },
    IN: { rate: 0,     symbol: '₹',  unit: 'km', authority: 'Income Tax India',          method: 'Conveyance allowance',           refDoc: 'Employer policy',   taxYear: '2025-26',  noteLine: 'India has no statutory per-km tax rate — set per your employer’s policy.' },
  };
  function taxPresetForCountry(country) {
    if (!country) return TAX_PRESETS.US;
    return TAX_PRESETS[String(country).toUpperCase()] || TAX_PRESETS.US;
  }

  // ───────── Country helpers ─────────
  function detectDeviceCountry() {
    try {
      const lang = navigator.language || 'en-US';
      const loc = new Intl.Locale(lang).maximize();
      return loc.region || null; // 'US', 'GB', 'IN', ...
    } catch (_e) {
      return null;
    }
  }
  function listCountries() {
    // ISO 3166-1 alpha-2 codes. `Intl.supportedValuesOf` doesn't expose
    // regions, so we hard-code the canonical list (stable since 2013).
    // Display names are localized by Intl.DisplayNames at render time.
    const codes = [
      'AD','AE','AF','AG','AI','AL','AM','AO','AQ','AR','AS','AT','AU','AW','AX','AZ',
      'BA','BB','BD','BE','BF','BG','BH','BI','BJ','BL','BM','BN','BO','BQ','BR','BS','BT','BV','BW','BY','BZ',
      'CA','CC','CD','CF','CG','CH','CI','CK','CL','CM','CN','CO','CR','CU','CV','CW','CX','CY','CZ',
      'DE','DJ','DK','DM','DO','DZ',
      'EC','EE','EG','EH','ER','ES','ET',
      'FI','FJ','FK','FM','FO','FR',
      'GA','GB','GD','GE','GF','GG','GH','GI','GL','GM','GN','GP','GQ','GR','GS','GT','GU','GW','GY',
      'HK','HM','HN','HR','HT','HU',
      'ID','IE','IL','IM','IN','IO','IQ','IR','IS','IT',
      'JE','JM','JO','JP',
      'KE','KG','KH','KI','KM','KN','KP','KR','KW','KY','KZ',
      'LA','LB','LC','LI','LK','LR','LS','LT','LU','LV','LY',
      'MA','MC','MD','ME','MF','MG','MH','MK','ML','MM','MN','MO','MP','MQ','MR','MS','MT','MU','MV','MW','MX','MY','MZ',
      'NA','NC','NE','NF','NG','NI','NL','NO','NP','NR','NU','NZ',
      'OM',
      'PA','PE','PF','PG','PH','PK','PL','PM','PN','PR','PS','PT','PW','PY',
      'QA',
      'RE','RO','RS','RU','RW',
      'SA','SB','SC','SD','SE','SG','SH','SI','SJ','SK','SL','SM','SN','SO','SR','SS','ST','SV','SX','SY','SZ',
      'TC','TD','TF','TG','TH','TJ','TK','TL','TM','TN','TO','TR','TT','TV','TW','TZ',
      'UA','UG','UM','US','UY','UZ',
      'VA','VC','VE','VG','VI','VN','VU',
      'WF','WS',
      'XK',
      'YE','YT',
      'ZA','ZM','ZW',
    ];
    let dn = null;
    try { dn = new Intl.DisplayNames(['en'], { type: 'region' }); } catch (_e) {}
    return codes
      .map((c) => ({ code: c, name: (dn && dn.of(c)) || c }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }
  // First-install auto-set country from the browser's resolved locale.
  // Idempotent — only writes if profiles.country is null/empty.
  async function ensureProfileCountry(session) {
    if (_profileRef.country) return;
    const cc = detectDeviceCountry();
    if (!cc) return;
    const { error } = await _sb.from('profiles').update({ country: cc }).eq('id', session.user.id);
    if (error) {
      console.warn('[mmai] auto-set country:', error.message);
      return;
    }
    _profileRef.country = cc;
  }

  // ───────── Settings · editable fields ─────────
  function openProfileEditModal(session, opts) {
    const bodyHtml = `<div class="mmai-field"><label for="pe-val">${escapeHtml(opts.label)}</label>${opts.input || ''}</div>${opts.help ? `<div class="mmai-field-help">${escapeHtml(opts.help)}</div>` : ''}`;
    openModal({
      title: opts.title,
      bodyHtml,
      saveLabel: 'Save',
      onSave: async () => {
        const input = document.getElementById('pe-val');
        const raw = input ? input.value : '';
        const value = opts.parse ? opts.parse(raw) : raw.trim();
        if (opts.validate) {
          const err = opts.validate(value);
          if (err) return modalShowError(err);
        }
        const update = { [opts.column]: value === '' ? null : value };
        const { error } = await _sb.from('profiles').update(update).eq('id', session.user.id);
        if (error) throw new Error(error.message);
        closeModal();
        await refreshAfterMutation(session);
        if (opts.onAfterSave) opts.onAfterSave(value);
      },
    });
  }
  function wireSettingsEdits(session) {
    const link = (sel, opts) => {
      const el = document.querySelector(sel);
      if (!el) return;
      el.addEventListener('click', () => openProfileEditModal(session, opts));
    };
    link('[data-mmai="edit-name"]', {
      title: 'Edit full name', label: 'Full name', column: 'name',
      input: `<input id="pe-val" type="text" value="${escapeHtml(_profileRef.name || '')}" placeholder="Your name">`,
      validate: (v) => v.length === 0 ? 'Name cannot be empty.' : null,
    });
    link('[data-mmai="edit-phone"]', {
      title: 'Edit phone', label: 'Phone', column: 'phone',
      input: `<input id="pe-val" type="tel" value="${escapeHtml(_profileRef.phone || '')}" placeholder="+1 555 123 4567">`,
    });
    link('[data-mmai="edit-workspace"]', {
      title: 'Edit company name', label: 'Company name', column: 'company_name',
      input: `<input id="pe-val" type="text" value="${escapeHtml(_profileRef.company_name || '')}" placeholder="Acme LLC">`,
    });
    link('[data-mmai="edit-timezone"]', {
      title: 'Set time zone',
      label: 'Time zone',
      column: 'timezone',
      input: (() => {
        const cur = _profileRef.timezone || detectDeviceTimezone() || 'UTC';
        const zones = listTimeZones();
        const opts = zones.map((z) => `<option value="${escapeHtml(z)}"${z === cur ? ' selected' : ''}>${escapeHtml(z.replace(/_/g, ' '))}</option>`).join('');
        return `<select id="pe-val">${opts}</select>`;
      })(),
      help: 'Pick from your device’s available time zones. Used for trip timestamps and report cutoffs.',
    });
    link('[data-mmai="edit-country"]', {
      title: 'Set country',
      label: 'Country',
      column: 'country',
      input: (() => {
        const cur = _profileRef.country || detectDeviceCountry() || 'US';
        const opts = listCountries().map((c) => `<option value="${escapeHtml(c.code)}"${c.code === cur ? ' selected' : ''}>${escapeHtml(c.name)} · ${escapeHtml(c.code)}</option>`).join('');
        return `<select id="pe-val">${opts}</select>`;
      })(),
      help: 'Sets tax-rate defaults and report locale conventions.',
      onAfterSave: (v) => { window.MM && window.MM.set(v || 'US'); },
    });
    link('[data-mmai="edit-rate"]', (() => {
      const preset = taxPresetForCountry(_profileRef.country);
      const cur = Number(_profileRef.mileage_rate) > 0 ? Number(_profileRef.mileage_rate) : preset.rate;
      const unitWord = preset.unit === 'mi' ? 'mile' : 'kilometre';
      return {
        title: 'Edit mileage rate',
        label: `Per-${unitWord} rate (${preset.symbol})`,
        column: 'mileage_rate',
        input: `<input id="pe-val" type="number" step="0.001" min="0" max="5" value="${cur}" placeholder="${preset.rate}">`,
        help: `${preset.authority} default: ${preset.symbol}${preset.rate.toFixed(3)} / ${preset.unit} (${preset.method}). Override only if you use a different rate.`,
        parse: (v) => {
          const n = parseFloat(v);
          return Number.isFinite(n) ? n : null;
        },
        validate: (v) => (v == null || v < 0 || v > 5) ? `Enter a rate between ${preset.symbol}0.000 and ${preset.symbol}5.000.` : null,
      };
    })());
  }

  // Render the Tax preferences panel — labels, units, currency, and authority
  // are pulled from TAX_PRESETS by profile.country. The user's mileage_rate
  // override (when set) takes precedence over the preset's default rate.
  function renderTaxPanel() {
    const preset = taxPresetForCountry(_profileRef.country);
    const r = Number(_profileRef.mileage_rate) > 0 ? Number(_profileRef.mileage_rate) : preset.rate;
    const rateLabel = preset.unit === 'mi' ? 'Per-mile' : 'Per-kilometre';

    setText('[data-mmai="edit-rate"]', preset.symbol + r.toFixed(3) + ' / ' + preset.unit);
    setText('[data-mmai="rate-description"]',
      `${rateLabel} rate applied to business trips. ${preset.noteLine}`);
  }

  // ───────── Help ─────────
  // ───────── Locale toggle ─────────
  function renderLocaleToggle() {
    const active = getActiveLocale();
    $$('[data-mmai="locale-toggle"] [data-locale]').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-locale') === active);
    });
  }

  function wireLocaleToggle() {
    const toggle = $('[data-mmai="locale-toggle"]');
    if (!toggle) return;
    renderLocaleToggle();
    toggle.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-locale]');
      if (!btn || !window.MM) return;
      window.MM.set(btn.getAttribute('data-locale'));
    });
  }

  function wireHelp() {
    $$('[data-mmai="open-help"]').forEach((el) => {
      el.addEventListener('click', () => {
        openModal({
          title: 'Help & support',
          sub: 'A few quick pointers — and how to reach us.',
          bodyHtml: `
            <div class="mmai-field-help" style="font-size:13px;line-height:1.55;color:#0B0F0E">
              <p style="margin-bottom:10px"><strong>+ Log trip</strong> — manually record a trip from any tab. Saves to your account instantly.</p>
              <p style="margin-bottom:10px"><strong>Classify inline</strong> — click the Business / Personal / Needs review pill on any row to reclassify it instantly. Updates save automatically.</p>
              <p style="margin-bottom:10px"><strong>Trip ⋯ menu</strong> — click the ⋯ on any row to delete it.</p>
              <p style="margin-bottom:10px"><strong>Reports</strong> — pick a period, classification, vehicle, and format, then click <em>Generate report</em> for a one-click PDF or CSV.</p>
              <p style="margin-bottom:10px"><strong>Search</strong> — the search box on Dashboard and Trips filters by address, purpose, or date instantly.</p>
              <p style="margin-bottom:10px">Need a hand? Email <a href="mailto:support@mymilesai.com" style="color:#1B4DDB">support@mymilesai.com</a>.</p>
            </div>
          `,
          saveLabel: 'Got it',
          onSave: async () => { closeModal(); },
        });
      });
    });
  }

  // ───────── Sign-out ─────────
  function wireSignOut() {
    $$('[data-mmai="signout"]').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        try { await _sb.auth.signOut(); } catch (_e) {}
        location.replace('/signin/');
      });
    });
  }

  // ───────── Boot ─────────
  async function boot() {
    wirePageSwitcher();
    wireSignOut();
    wireTripsFilters();
    wireReports();
    wireModal();
    wireSearch();
    wireHelp();

    const session = await guard();
    if (!session) return;

    const [profile, trips, vehicles] = await Promise.all([
      loadProfile(session.user.id),
      loadTripsYtd(session.user.id),
      loadVehicles(session.user.id),
    ]);

    _allTrips = trips;
    _profileRef = profile;
    _vehiclesList = vehicles;
    _session = session;

    // First-install auto-set time zone + country so timestamps, cutoffs, and
    // tax-rate defaults match the user's device from day one. Both are
    // idempotent — only write when the column is null/empty.
    await ensureProfileTimezone(session);
    await ensureProfileCountry(session);

    // Seed active locale from profile country on first visit (no mm_region set yet).
    // Write directly to localStorage to avoid firing mm-locale-change before render.
    if (window.MM && !localStorage.getItem('mm_region')) {
      try { localStorage.setItem('mm_region', _profileRef.country || 'US'); } catch (_e) {}
    }

    // Locale-sensitive renders use withActiveLocale so the region toggle
    // applies from first paint.
    withActiveLocale(() => {
      const kpis = computeKpis(_allTrips, _profileRef);
      renderHeader(session, _profileRef, kpis);
      renderKpis(kpis);
      renderRecentTrips(_allTrips);
      renderTripsTable(_allTrips, _profileRef);
      renderQuarter(_allTrips, kpis);
      renderReportPreview();
      renderTaxPanel();
    });
    renderSettings(_profileRef, session);
    renderBilling(_profileRef);
    renderVehicles(_vehiclesList);
    renderPlaces(_profileRef);
    renderReportVehicleChecks();

    // Mutation wiring needs the session — wire after it's available.
    wireLogTripButtons(session);
    wireClassifyDropdowns(session);
    wireTripRowMenu(session);
    wireAddVehicleButton(session);
    wireAddPlaceButton(session);
    wireSettingsEdits(session);
    wireLocaleToggle();

    // Re-render locale-sensitive panels when the region pill is toggled.
    document.addEventListener('mm-locale-change', () => {
      if (!_session) return;
      withActiveLocale(() => {
        const kpis = computeKpis(_allTrips, _profileRef);
        renderKpis(kpis);
        renderRecentTrips(_allTrips);
        renderTripsTable(_allTrips, _profileRef);
        renderQuarter(_allTrips, kpis);
        renderReportPreview();
        renderTaxPanel();
      });
      renderLocaleToggle();
    });

    document.body.classList.add('mmai-ready');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

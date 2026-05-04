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

  const { createClient } = window.supabase;
  const _sb = createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });

  // Closure state for the trips page filter pills.
  let _allTrips = [];
  let _profileRef = {};
  let _tripsFilter = 'all';

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
      'goal_amount', 'company_name', 'home_address', 'work_address',
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
    const cols = 'id,from_addr,to_addr,miles,type,purpose,trip_purpose,trip_date,trip_time,duration_mins,deductible,vehicle_id';
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
    const rate = Number(profile.mileage_rate) > 0 ? Number(profile.mileage_rate) : IRS_RATE_2026;
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
    return '$' + (Math.round(n * 100) / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
      root.innerHTML = '<div class="empty">No trips this year yet. Open the iOS app to start auto-tracking.</div>';
      return;
    }
    const recent = trips.slice(0, 5);
    root.innerHTML = recent.map((t) => {
      const tag = classTag(t.type);
      const dot = tag.cls === 'unreviewed' ? '<span style="width:6px;height:6px;border-radius:50%;background:#DA0A7F;display:inline-block;margin-right:6px"></span>' : (tag.cls === 'biz' ? '✓ ' : '');
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

  function renderTripRows(trips, profile) {
    const root = $('[data-mmai="trips-table-body"]');
    if (!root) return;
    if (!trips.length) {
      root.innerHTML = '<div class="empty">No trips match this filter.</div>';
      return;
    }
    const rate = Number(profile.mileage_rate) > 0 ? Number(profile.mileage_rate) : IRS_RATE_2026;
    root.innerHTML = trips.map((t) => {
      const tag = classTag(t.type);
      const value = isBusiness(t.type) ? '$' + (Number(t.miles) * rate).toFixed(2) : '—';
      const rowStyle = tag.cls === 'unreviewed' ? ' style="background:rgba(218,10,127,0.04)"' : '';
      const purText = t.purpose
        ? escapeHtml(t.purpose)
        : (tag.cls === 'unreviewed' ? '— Needs purpose' : tag.label);
      const purStyle = tag.cls === 'unreviewed' && !t.purpose ? ' style="color:#DA0A7F"' : '';
      return `<div class="tt-row"${rowStyle}>
        <div class="dt">${escapeHtml(formatDateShort(t.trip_date)).toUpperCase()}${t.trip_time ? ' · ' + escapeHtml(formatTime(t.trip_time)).toUpperCase() : ''}</div>
        <div>
          <div class="from">${escapeHtml(shortAddr(t.from_addr))} → ${escapeHtml(shortAddr(t.to_addr))}</div>
          <div class="to">${t.duration_mins ? escapeHtml(t.duration_mins + ' min') : '—'}</div>
        </div>
        <div class="pur"${purStyle}>${purText}</div>
        <div class="mi">${(Number(t.miles) || 0).toFixed(1)}</div>
        <div class="val">${value}</div>
        <div style="text-align:center"><span class="tag ${tag.cls}">${tag.label}</span></div>
        <div class="more">⋯</div>
      </div>`;
    }).join('');
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

  function renderTripsTable(trips, profile) {
    const root = $('[data-mmai="trips-table-body"]');
    if (!root) return;

    // Always recompute counts from the full list — counts don't change with filter.
    let bizCount = 0, persCount = 0, uncCount = 0;
    for (const t of trips) {
      if (isBusiness(t.type)) bizCount++;
      else if (isPersonal(t.type)) persCount++;
      else uncCount++;
    }
    setText('[data-mmai="trips-filter-biz"]', bizCount);
    setText('[data-mmai="trips-filter-pers"]', persCount);
    setText('[data-mmai="trips-filter-unc"]', uncCount);
    setText('[data-mmai="trips-eyebrow-review"]', `${trips.length} trips · ${uncCount} need review`);

    if (!trips.length) {
      root.innerHTML = '<div class="empty">No trips this year yet.</div>';
      return;
    }
    renderTripRows(trips.filter((t) => tripMatchesFilter(t, _tripsFilter)), profile);
  }

  function renderQuarter(trips, kpis, profile) {
    const q = computeQuarter(trips, kpis);
    setText('[data-mmai="quarter-label"]', `${q.qLabel} deduction progress`);
    setText('[data-mmai="quarter-deduction"]', formatDollars(q.qDeduction));
    setText('[data-mmai="quarter-business-miles"]', Math.round(q.qBusiness).toLocaleString());
    setText('[data-mmai="quarter-rate"]', '$' + kpis.rate.toFixed(3));
    setText('[data-mmai="quarter-tax-saved"]', formatDollars(q.qDeduction * 0.24));

    const annualGoal = Number(profile.goal_amount) || 0;
    const quarterGoal = annualGoal > 0 ? annualGoal / 4 : 0;
    const pct = quarterGoal > 0 ? Math.min(100, Math.round((q.qDeduction / quarterGoal) * 100)) : 0;
    setText('[data-mmai="quarter-goal"]', quarterGoal > 0 ? formatDollars(quarterGoal) : '—');
    setText('[data-mmai="quarter-progress-pct"]', annualGoal > 0 ? `${pct}% OF ${q.qLabel} GOAL` : 'NO GOAL SET');
    const bar = $('[data-mmai="quarter-progress-bar"]');
    if (bar) bar.style.width = `${pct}%`;
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
    setText('[data-mmai="set-timezone"]', profile.timezone ? profile.timezone.replace(/_/g, ' ') : '—');
    setText('[data-mmai="set-language"]', profile.locale ? profile.locale.toUpperCase() : '—');
    setText('[data-mmai="set-workspace"]', profile.company_name || `${(name.split(' ')[0] || 'Personal')} workspace`);
    setText('[data-mmai="set-country"]', profile.country || '—');
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
      root.innerHTML = '<div class="empty">No vehicles yet. Add one in the iOS app to start tracking trips by car.</div>';
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

  function renderPlaces(profile) {
    const places = Array.isArray(profile.named_locations) ? profile.named_locations : [];
    setAll('[data-mmai="places-count"]', places.length);
    const root = $('[data-mmai="places-list"]');
    if (!root) return;
    if (!places.length) {
      root.innerHTML = '<div class="empty">No saved places yet. Tag locations in the iOS app to see them here.</div>';
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
  // Client-side IRS Pub 463 mileage-log generator. No backend, no PDF
  // library — uses browser's native print pipeline for PDF.
  const _reportState = {
    period: 'quarter',
    classification: 'biz',
    format: 'pdf',
    vehicles: new Set(), // empty = all
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
    const filterVehicles = _reportState.vehicles.size > 0;
    const defaultVid = _profileRef.default_vehicle_id || null;
    return _allTrips.filter((t) => {
      const d = new Date(t.trip_date + 'T00:00:00');
      if (d < start || d >= end) return false;
      if (cls === 'biz' && !isBusiness(t.type)) return false;
      if (cls === 'bizpers' && !isBusiness(t.type) && !isPersonal(t.type)) return false;
      if (filterVehicles) {
        if (t.vehicle_id) {
          if (!_reportState.vehicles.has(t.vehicle_id)) return false;
        } else if (defaultVid) {
          // Trip has no vehicle assigned: attribute to the user's default.
          if (!_reportState.vehicles.has(defaultVid)) return false;
        } else {
          // No default vehicle set and trip is unassigned — exclude from
          // per-vehicle filter. The notice below tells the user why.
          return false;
        }
      }
      return true;
    });
  }

  function renderReportVehicleChecks(vehicles) {
    const root = $('[data-mmai="rep-vehicles-list"]');
    if (!root) return;
    if (!vehicles.length) {
      root.innerHTML = '<div class="empty" style="text-align:left;padding:16px;background:#F8F9FB;border:1px solid #E5E7EB;border-radius:10px">No vehicles. Add one in the iOS app to filter reports by vehicle.</div>';
      return;
    }
    const allRow = `<div class="vcheck on" data-rep-vehicle="">
      <div class="cb">✓</div>
      <div><strong style="font-weight:500">All vehicles</strong> · ${vehicles.length}</div>
    </div>`;
    const veh = vehicles.map((v) => {
      const sub = [v.year, v.make, v.model].filter(Boolean).join(' ');
      const isDefault = _profileRef.default_vehicle_id === v.id;
      return `<div class="vcheck" data-rep-vehicle="${escapeHtml(v.id)}">
        <div class="cb"></div>
        <div><strong style="font-weight:500">${escapeHtml(v.name || 'Vehicle')}</strong>${sub ? ' · ' + escapeHtml(sub) : ''}${isDefault ? ' · DEFAULT' : ''}</div>
      </div>`;
    }).join('');

    // If any YTD trips have null vehicle_id and there's no default vehicle,
    // per-vehicle filtering will exclude those trips. Tell the user why.
    const unassignedCount = _allTrips.filter((t) => !t.vehicle_id).length;
    let notice = '';
    if (unassignedCount > 0 && !_profileRef.default_vehicle_id) {
      notice = `<div class="vehicle-notice"><strong>Note:</strong> ${unassignedCount} of your trips don't have a vehicle assigned. Per-vehicle filters will exclude those trips. Set a default vehicle in the iOS app to attribute past unassigned trips.</div>`;
    } else if (unassignedCount > 0) {
      notice = `<div class="vehicle-notice">${unassignedCount} unassigned trip${unassignedCount === 1 ? '' : 's'} are attributed to your default vehicle.</div>`;
    }
    root.innerHTML = allRow + veh + notice;

    $$('.vcheck[data-rep-vehicle]').forEach((el) => {
      el.addEventListener('click', () => {
        const vid = el.getAttribute('data-rep-vehicle');
        const allEl = $('.vcheck[data-rep-vehicle=""]');
        if (vid === '') {
          _reportState.vehicles.clear();
          $$('.vcheck[data-rep-vehicle]').forEach((x) => x.classList.remove('on'));
          el.classList.add('on');
        } else {
          if (allEl) allEl.classList.remove('on');
          if (_reportState.vehicles.has(vid)) {
            _reportState.vehicles.delete(vid);
            el.classList.remove('on');
          } else {
            _reportState.vehicles.add(vid);
            el.classList.add('on');
          }
          if (_reportState.vehicles.size === 0 && allEl) allEl.classList.add('on');
        }
        renderReportPreview();
      });
    });
  }

  function renderReportPreview() {
    const trips = tripsForReport();
    const profile = _profileRef;
    const rate = Number(profile.mileage_rate) > 0 ? Number(profile.mileage_rate) : IRS_RATE_2026;
    const totalMi = trips.reduce((s, t) => s + (Number(t.miles) || 0), 0);
    const bizMi = trips.filter((t) => isBusiness(t.type)).reduce((s, t) => s + (Number(t.miles) || 0), 0);
    const deduction = bizMi * rate;

    setText('[data-mmai="rep-period-title"]', periodLabel(_reportState.period) + ' Mileage Log');
    setText('[data-mmai="rep-total-deduction"]', formatDollars(deduction));
    setText('[data-mmai="rep-totals-line"]',
      `${trips.length} trip${trips.length === 1 ? '' : 's'} · ${totalMi.toFixed(0)} mi · IRS rate $${rate.toFixed(3)}`);

    const summary = $('[data-mmai="rep-summary"]');
    if (!summary) return;
    if (!trips.length) {
      summary.innerHTML = '<div style="padding:14px 0;color:#6B6862;font-size:11px">No trips in this period match the filter.</div>';
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
    const rate = Number(profile.mileage_rate) > 0 ? Number(profile.mileage_rate) : IRS_RATE_2026;
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
    const rate = Number(profile.mileage_rate) > 0 ? Number(profile.mileage_rate) : IRS_RATE_2026;
    const out = [csvLine(['Date', 'Description', 'Vendor', 'Amount', 'Account', 'Class'])];
    for (const t of trips) {
      if (!isBusiness(t.type)) continue;
      const fa = (t.from_addr || '').split(',')[0];
      const ta = (t.to_addr || '').split(',')[0];
      const desc = `Business mileage: ${fa} → ${ta}${t.purpose ? ' · ' + t.purpose : ''} (${(Number(t.miles) || 0).toFixed(1)} mi)`;
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
    const rate = Number(profile.mileage_rate) > 0 ? Number(profile.mileage_rate) : IRS_RATE_2026;
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

  function openPrintableReport(trips, profile, label) {
    const rate = Number(profile.mileage_rate) > 0 ? Number(profile.mileage_rate) : IRS_RATE_2026;
    const totalMi = trips.reduce((s, t) => s + (Number(t.miles) || 0), 0);
    const bizMi = trips.filter((t) => isBusiness(t.type)).reduce((s, t) => s + (Number(t.miles) || 0), 0);
    const persMi = trips.filter((t) => isPersonal(t.type)).reduce((s, t) => s + (Number(t.miles) || 0), 0);
    const deduction = bizMi * rate;
    const drvName = profile.name || 'Driver';

    const rowsHtml = trips.map((t) => {
      const tag = classTag(t.type);
      const ded = isBusiness(t.type) ? '$' + (Number(t.miles) * rate).toFixed(2) : '—';
      const fa = (t.from_addr || '').split(',')[0];
      const ta = (t.to_addr || '').split(',')[0];
      const rowCls = tag.cls === 'biz' ? 'biz' : (tag.cls === 'pers' ? 'pers' : '');
      return `<tr class="${rowCls}">
        <td>${escapeHtml(t.trip_date)}</td>
        <td>${escapeHtml(fa)} → ${escapeHtml(ta)}</td>
        <td>${escapeHtml(t.purpose || (tag.cls === 'unreviewed' ? 'Unclassified' : ''))}</td>
        <td class="num">${(Number(t.miles) || 0).toFixed(1)}</td>
        <td>${tag.label}</td>
        <td class="num">${ded}</td>
      </tr>`;
    }).join('');

    const html = `<!doctype html><html><head><meta charset="utf-8">
<title>Mileage Log · ${escapeHtml(label)}</title>
<style>
@page { margin: 0.5in; size: letter; }
* { box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif; color: #000; font-size: 9.5pt; line-height: 1.35; margin: 0; padding: 0; }
.head { border-bottom: 2px solid #000; padding-bottom: 10pt; margin-bottom: 14pt; display: flex; justify-content: space-between; align-items: flex-start; }
h1 { font-size: 18pt; margin: 0 0 4pt; letter-spacing: -0.01em; font-weight: 700; }
.compliance { display: inline-block; padding: 3pt 7pt; background: #1B5E3F; color: #fff; font-size: 7.5pt; letter-spacing: 0.08em; border-radius: 3pt; font-weight: 600; }
.meta { color: #555; font-size: 9pt; margin-top: 4pt; }
table { width: 100%; border-collapse: collapse; }
th, td { padding: 4.5pt 6pt; text-align: left; border-bottom: 1px solid #e8e8e8; vertical-align: top; }
th { background: #f5f5f5; font-size: 7.5pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #333; border-bottom: 1.5px solid #999; }
tr.biz td { background: rgba(27,94,63,0.05); }
tr.pers td { background: rgba(218,10,127,0.03); }
.num { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }
.footer { margin-top: 18pt; padding-top: 10pt; border-top: 2px solid #000; font-size: 10pt; }
.footer .row { display: flex; justify-content: space-between; padding: 3pt 0; }
.footer .total { font-size: 14pt; font-weight: 700; padding-top: 8pt; margin-top: 6pt; border-top: 1px solid #999; }
.notice { font-size: 8pt; color: #666; margin-top: 22pt; line-height: 1.5; padding-top: 10pt; border-top: 1px solid #ddd; }
@media print {
  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .noprint { display: none; }
}
.noprint { padding: 12px 16px; background: #FEF3C7; border: 1px solid #F59E0B; border-radius: 6px; margin-bottom: 16px; font-size: 12px; line-height: 1.5; }
.noprint button { margin-left: 12px; padding: 6px 12px; background: #0B0F0E; color: #fff; border: none; border-radius: 4px; font-size: 12px; cursor: pointer; }
</style></head><body>
<div class="noprint">
  <strong>Print preview ready.</strong> Use your browser's Print dialog and choose <strong>"Save as PDF"</strong> as the destination, then save.
  <button onclick="window.print()">Open Print Dialog</button>
</div>
<div class="head">
  <div>
    <h1>Mileage Log</h1>
    <div class="meta">${escapeHtml(label)} · Driver: <strong>${escapeHtml(drvName)}</strong> · Generated ${new Date().toLocaleString()}</div>
  </div>
  <span class="compliance">IRS PUB 463</span>
</div>
<table>
  <thead><tr>
    <th style="width:13%">Date</th>
    <th style="width:33%">Route (Destination)</th>
    <th style="width:24%">Business Purpose</th>
    <th style="width:9%" class="num">Miles</th>
    <th style="width:10%">Class</th>
    <th style="width:11%" class="num">Deduction</th>
  </tr></thead>
  <tbody>
    ${rowsHtml || '<tr><td colspan="6" style="text-align:center;padding:24pt;color:#666">No trips in this period match the filter.</td></tr>'}
  </tbody>
</table>
<div class="footer">
  <div class="row"><span>Total trips</span><span>${trips.length}</span></div>
  <div class="row"><span>Total miles (all classes)</span><span>${totalMi.toFixed(1)} mi</span></div>
  <div class="row"><span>Business miles</span><span>${bizMi.toFixed(1)} mi</span></div>
  <div class="row"><span>Personal miles</span><span>${persMi.toFixed(1)} mi</span></div>
  <div class="row"><span>Standard mileage rate</span><span>$${rate.toFixed(3)} / mi</span></div>
  <div class="row total"><span>Total deduction (business × rate)</span><span>$${deduction.toFixed(2)}</span></div>
</div>
<div class="notice">
  <strong>Method:</strong> Standard mileage rate (IRS Publication 463). This log records the four IRS-required elements for each business trip: <em>date, destination, business purpose, and miles driven</em>. Vehicle records and odometer readings are maintained separately by the driver. Personal trips are listed for completeness but do not contribute to the deduction.
</div>
</body></html>`;

    const w = window.open('', '_blank');
    if (!w) {
      alert('Pop-up blocked. Please allow pop-ups for this site to generate the PDF report — the print dialog opens in a new tab.');
      return;
    }
    w.document.open();
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => { try { w.print(); } catch (_e) {} }, 500);
  }

  function generateReport() {
    const trips = tripsForReport();
    const profile = _profileRef;
    const label = periodLabel(_reportState.period);
    const slug = _reportState.period;
    const stamp = new Date().toISOString().slice(0, 10);
    switch (_reportState.format) {
      case 'pdf':
        return openPrintableReport(trips, profile, label);
      case 'csv':
        return downloadFile(`mileage-${slug}-${stamp}.csv`, 'text/csv', genCSV(trips, profile));
      case 'quickbooks':
        return downloadFile(`mileage-${slug}-${stamp}-quickbooks.csv`, 'text/csv', genQuickBooksCSV(trips, profile));
      case 'xero':
        return downloadFile(`mileage-${slug}-${stamp}-xero.csv`, 'text/csv', genXeroCSV(trips, profile));
    }
  }

  function wireReports() {
    $$('.pill[data-rep-period]').forEach((p) => {
      p.addEventListener('click', () => {
        _reportState.period = p.getAttribute('data-rep-period');
        $$('.pill[data-rep-period]').forEach((x) => x.classList.toggle('on', x === p));
        renderReportPreview();
      });
    });
    $$('.pill[data-rep-class]').forEach((p) => {
      p.addEventListener('click', () => {
        _reportState.classification = p.getAttribute('data-rep-class');
        $$('.pill[data-rep-class]').forEach((x) => x.classList.toggle('on', x === p));
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

    const session = await guard();
    if (!session) return;

    const [profile, trips, vehicles] = await Promise.all([
      loadProfile(session.user.id),
      loadTripsYtd(session.user.id),
      loadVehicles(session.user.id),
    ]);

    _allTrips = trips;
    _profileRef = profile;

    const kpis = computeKpis(trips, profile);

    renderHeader(session, profile, kpis);
    renderKpis(kpis);
    renderRecentTrips(trips);
    renderTripsTable(trips, profile);
    renderQuarter(trips, kpis, profile);
    renderSettings(profile, session);
    renderBilling(profile);
    renderVehicles(vehicles);
    renderPlaces(profile);
    renderReportVehicleChecks(vehicles);
    renderReportPreview();

    document.body.classList.add('mmai-ready');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

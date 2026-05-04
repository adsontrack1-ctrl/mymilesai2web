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

  function renderTripsTable(trips, profile) {
    const root = $('[data-mmai="trips-table-body"]');
    if (!root) return;
    if (!trips.length) {
      root.innerHTML = '<div class="empty">No trips yet.</div>';
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

    // Filter row counts
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

    const session = await guard();
    if (!session) return;

    const [profile, trips, vehicles] = await Promise.all([
      loadProfile(session.user.id),
      loadTripsYtd(session.user.id),
      loadVehicles(session.user.id),
    ]);

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

    document.body.classList.add('mmai-ready');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

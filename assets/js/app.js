/* App shell — Supabase auth guard + live KPIs.
   Expects window.__MMAI_CONFIG__ set inline on the page before this script loads,
   and the Supabase UMD bundle loaded via <script src="…@supabase/supabase-js@2"> */

(function () {
  'use strict';

  const cfg = window.__MMAI_CONFIG__;
  if (!cfg || !cfg.SUPABASE_URL || !cfg.SUPABASE_ANON_KEY) {
    console.error('[mmai] missing __MMAI_CONFIG__');
    return;
  }

  const IRS_RATE_2026 = 0.725; // IRS standard mileage rate for business use, 2026.
  // Source: https://www.irs.gov/newsroom/irs-sets-2026-business-standard-mileage-rate-at-725-cents-per-mile-up-25-cents

  const { createClient } = window.supabase;
  const _sb = createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });
  // Closure-only — never expose on `window`. Any extension or console
  // attacker who got that handle would have full session privileges.

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

  // ───────── Page switcher ─────────
  function wirePageSwitcher() {
    window.mmaiGo = function (name) {
      $$('.page').forEach((p) => p.classList.remove('on'));
      const pg = document.getElementById('p-' + name);
      if (pg) pg.classList.add('on');
      $$('.nav-item').forEach((n) => n.classList.remove('active'));
      const s = document.getElementById('nav-' + name);
      if (s) s.classList.add('active');
      const main = document.querySelector('.main');
      if (main) main.scrollTop = 0;
    };
  }

  // ───────── Data loaders ─────────
  async function loadProfile(userId) {
    try {
      const { data, error } = await _sb
        .from('profiles')
        .select('plan, display_name')
        .eq('id', userId)
        .single();
      if (error) {
        // If the profiles row hasn't been created yet, don't crash — fall back.
        console.warn('[mmai] profiles load:', error.message);
        return { plan: 'Free', display_name: null };
      }
      return data || { plan: 'Free', display_name: null };
    } catch (e) {
      console.warn('[mmai] profiles fetch failed:', e);
      return { plan: 'Free', display_name: null };
    }
  }

  async function loadTripsYtd(userId) {
    const year = new Date().getFullYear();
    try {
      const { data, error } = await _sb
        .from('trips')
        .select('miles, trip_date, type')
        .eq('user_id', userId)
        .gte('trip_date', `${year}-01-01`)
        .is('deleted_at', null);
      if (error) {
        console.warn('[mmai] trips load:', error.message);
        return [];
      }
      return data || [];
    } catch (e) {
      console.warn('[mmai] trips fetch failed:', e);
      return [];
    }
  }

  function computeKpis(trips) {
    const tripCount = trips.length;
    let businessMiles = 0;
    let personalMiles = 0;
    let needsReview = 0;
    for (const t of trips) {
      const mi = Number(t.miles) || 0;
      if (t.type === 'business') businessMiles += mi;
      else if (t.type === 'personal') personalMiles += mi;
      else needsReview += 1;
    }
    const totalMiles = businessMiles + personalMiles;
    const businessPct = totalMiles > 0 ? Math.round((businessMiles / totalMiles) * 100) : 0;
    const ytdDeduction = businessMiles * IRS_RATE_2026;
    return { tripCount, businessMiles, personalMiles, totalMiles, businessPct, needsReview, ytdDeduction };
  }

  // ───────── Render helpers ─────────
  function greetingFor(date = new Date()) {
    const h = date.getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  }

  function formatDollars(n) {
    return '$' + (Math.round(n * 100) / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function formatDate(date = new Date()) {
    return date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
  }

  function deriveName(session, profile) {
    const md = session.user.user_metadata || {};
    return (
      profile.display_name ||
      md.display_name ||
      md.full_name ||
      md.name ||
      (session.user.email ? session.user.email.split('@')[0] : 'there')
    );
  }

  function renderHeader(session, profile, kpis) {
    const name = deriveName(session, profile);
    const first = name.split(' ')[0];
    setText('[data-mmai="eyebrow-date"]', `${formatDate().split(',')[0]} · ${formatDate().split(',').slice(1).join(',').trim()}`);
    setText('[data-mmai="greeting-name"]', `${greetingFor()}, ${first} —`);
    setText('[data-mmai="greeting-count"]', kpis.needsReview
      ? `you have ${kpis.needsReview} ${kpis.needsReview === 1 ? 'trip' : 'trips'} to review.`
      : `you're all caught up.`);
    setText('[data-mmai="profile-name"]', name);
    setText('[data-mmai="profile-plan"]', `${profile.plan || 'Free'} · ${new Date().getFullYear()}`);

    // Sidebar avatar initial
    const av = $('[data-mmai="profile-initial"]');
    if (av) av.textContent = first.slice(0, 1).toUpperCase();
  }

  function renderKpis(kpis) {
    setText('[data-mmai="ytd-deduction"]', formatDollars(kpis.ytdDeduction));
    setText('[data-mmai="miles-total"]', kpis.totalMiles.toLocaleString(undefined, { maximumFractionDigits: 0 }));
    setText('[data-mmai="business-pct"]', `${kpis.businessPct}%`);
    setText('[data-mmai="business-of-total"]', `${kpis.businessMiles.toFixed(0)} of ${kpis.totalMiles.toFixed(0)} mi`);
    setText('[data-mmai="needs-review"]', kpis.needsReview);
    setText('[data-mmai="trips-count"]', kpis.tripCount.toLocaleString());
  }

  // ───────── Sign-out ─────────
  function wireSignOut() {
    const btn = $('[data-mmai="signout"]');
    if (!btn) return;
    btn.addEventListener('click', async () => {
      await _sb.auth.signOut();
      location.replace('/signin/');
    });
  }

  // ───────── Boot ─────────
  async function boot() {
    wirePageSwitcher();
    wireSignOut();

    const session = await guard();
    if (!session) return;

    const [profile, trips] = await Promise.all([
      loadProfile(session.user.id),
      loadTripsYtd(session.user.id),
    ]);

    const kpis = computeKpis(trips);
    renderHeader(session, profile, kpis);
    renderKpis(kpis);

    // Fade in once data is loaded
    document.body.classList.add('mmai-ready');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

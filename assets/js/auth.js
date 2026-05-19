/*
 * MyMilesAI - Copyright (c) 2025-2026 Harijas LLC. All rights reserved.
 * Confidential and proprietary. Unauthorized use prohibited.
 * MyMilesAI is a trademark of Harijas LLC.
 * MyMilesAI is a recordkeeping tool - not tax advice.
 * See LICENSE for full terms. harijasllc@outlook.com
 */

/* Shared auth handlers for signin / signup / auth-callback.
   Requires window.__MMAI_CONFIG__ + window.supabase (UMD) loaded before this. */

(function () {
  'use strict';

  const cfg = window.__MMAI_CONFIG__;
  if (!cfg || !cfg.SUPABASE_URL || !cfg.SUPABASE_ANON_KEY) {
    console.error('[auth] missing __MMAI_CONFIG__');
    return;
  }

  const { createClient } = window.supabase;
  const _sb = createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });
  // Closure-only reference. Earlier debug code attached this to window which
  // let any console attacker / extension call _sb.auth.* with full session
  // privileges. Keep it private.

  const CALLBACK_URL = 'https://mymilesai.com/auth-callback/';
  const TURNSTILE_SITE_KEY = (cfg.TURNSTILE_SITE_KEY || '').trim();
  const TURNSTILE_SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=__mmaiTurnstileReady';

  // ──────── helpers ────────
  const $ = (sel, root) => (root || document).querySelector(sel);
  const msg = (sel, text, tone) => {
    const el = $(sel);
    if (!el) return;
    el.textContent = text || '';
    el.className = 'auth-msg' + (tone ? ' ' + tone : '');
  };

  // ──────── Cloudflare Turnstile (CAPTCHA) ────────
  // No-op when TURNSTILE_SITE_KEY is empty — signup/signin behave exactly
  // as they did before the captcha was added. When the key is set:
  // 1. The widget mounts inside #captcha-mount.
  // 2. signUp / signInWithPassword / signInWithOAuth / resetPasswordForEmail
  //    all pass `options.captchaToken` to Supabase.
  // 3. Supabase verifies the token server-side against Cloudflare's API
  //    (config in Supabase Dashboard → Auth → Bot & Abuse Protection).
  // Tokens are single-use; the widget auto-rotates on `expired-callback`
  // and we explicitly reset after each submission attempt.
  const captcha = (function () {
    const enabled = !!TURNSTILE_SITE_KEY;
    let widgetId = null;
    let lastToken = null;
    let loadPromise = null;

    function loadScript() {
      if (!enabled) return Promise.resolve();
      if (loadPromise) return loadPromise;
      loadPromise = new Promise((resolve, reject) => {
        window.__mmaiTurnstileReady = () => resolve();
        const s = document.createElement('script');
        s.src = TURNSTILE_SCRIPT;
        s.async = true;
        s.defer = true;
        s.onerror = () => reject(new Error('turnstile script failed to load'));
        document.head.appendChild(s);
      });
      return loadPromise;
    }

    function mount() {
      if (!enabled) return;
      const el = document.getElementById('captcha-mount');
      if (!el) return;
      loadScript().then(() => {
        if (widgetId !== null) return;
        try {
          widgetId = window.turnstile.render(el, {
            sitekey: TURNSTILE_SITE_KEY,
            theme: 'light',
            size: 'normal',
            callback: (token) => { lastToken = token; },
            'expired-callback': () => { lastToken = null; },
            'error-callback': () => { lastToken = null; },
          });
        } catch (e) {
          console.warn('[auth] turnstile render:', e && e.message);
        }
      }).catch((e) => console.warn('[auth] turnstile load:', e && e.message));
    }

    function token() { return enabled ? lastToken : undefined; }

    function reset() {
      if (!enabled || widgetId === null || !window.turnstile) return;
      try { window.turnstile.reset(widgetId); } catch (_e) {}
      lastToken = null;
    }

    return { enabled, mount, token, reset };
  })();

  // ──────── Password strength meter (signup only) ────────
  // Scoring is a conservative length × character-class entropy estimate.
  // Bucket cutoffs (entropy bits): <28 weak, 28-39 fair, 40-59 good, 60+ strong.
  // We block submit at "weak" but allow "fair" so we don't add unnecessary
  // friction for users who chose a passphrase the meter underestimates.
  const pwMeter = (function () {
    function score(pw) {
      if (!pw) return { level: 0, label: 'Enter a password', bits: 0 };
      let charset = 0;
      if (/[a-z]/.test(pw)) charset += 26;
      if (/[A-Z]/.test(pw)) charset += 26;
      if (/[0-9]/.test(pw)) charset += 10;
      if (/[^A-Za-z0-9]/.test(pw)) charset += 32;
      const bits = pw.length * Math.log2(Math.max(charset, 2));
      let level = 1, label = 'Weak';
      if (bits >= 60) { level = 4; label = 'Strong'; }
      else if (bits >= 40) { level = 3; label = 'Good'; }
      else if (bits >= 28) { level = 2; label = 'Fair'; }
      return { level, label, bits: Math.round(bits) };
    }
    function attach() {
      const pw = document.getElementById('password');
      if (!pw) return null;
      const bar = document.querySelector('.pw-strength-bar');
      const fill = document.getElementById('pw-strength-fill');
      const label = document.getElementById('pw-strength-label');
      if (!bar || !fill || !label) return null;
      const update = () => {
        const s = score(pw.value);
        const pct = Math.min(100, (s.level / 4) * 100);
        fill.style.width = pct + '%';
        bar.className = 'pw-strength-bar ' + ['', 's-weak', 's-fair', 's-good', 's-strong'][s.level];
        label.textContent = s.label + (s.bits ? ' · ' + s.bits + ' bits' : '');
      };
      pw.addEventListener('input', update);
      update();
      return { check: () => score(pw.value) };
    }
    return { attach };
  })();

  // ──────── already-signed-in redirect ────────
  async function bounceIfSignedIn() {
    const { data } = await _sb.auth.getSession();
    if (data.session) location.replace('/app/');
  }

  // ──────── Email/password ────────
  function wireEmailForm(formSel, mode /* 'signin' | 'signup' */, meter) {
    const form = $(formSel);
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = $('[name=email]', form).value.trim();
      const password = $('[name=password]', form).value;
      const btn = $('button[type=submit]', form);

      // Block weak passwords at signup time. Fair+ is allowed.
      if (mode === 'signup' && meter) {
        const s = meter.check();
        if (s.level <= 1) {
          msg('#auth-msg', 'Please choose a stronger password (mix upper, lower, number, or 12+ characters).', 'err');
          return;
        }
      }

      if (captcha.enabled && !captcha.token()) {
        msg('#auth-msg', 'Please complete the human-check below.', 'err');
        return;
      }

      if (btn) { btn.disabled = true; btn.dataset._orig = btn.textContent; btn.textContent = '…'; }

      const captchaToken = captcha.token();
      let result;
      if (mode === 'signup') {
        result = await _sb.auth.signUp({
          email, password,
          options: { emailRedirectTo: CALLBACK_URL, captchaToken },
        });
      } else {
        result = await _sb.auth.signInWithPassword({
          email, password,
          options: { captchaToken },
        });
      }

      if (btn) { btn.disabled = false; btn.textContent = btn.dataset._orig; }
      // Turnstile tokens are single-use; rotate so the next attempt has a fresh one.
      captcha.reset();

      if (result.error) {
        msg('#auth-msg', result.error.message, 'err');
        return;
      }

      if (mode === 'signup' && !result.data.session) {
        // Email confirmation required.
        msg('#auth-msg', 'Check your inbox for a confirmation link.', 'ok');
        return;
      }

      // New web signups land on the welcome page first.
      const dest = (mode === 'signup') ? '/welcome/' : '/app/';
      location.replace(dest);
    });
  }

  // ──────── OAuth (Google + Apple) ────────
  async function oauth(provider) {
    // Flag checked by handleCallback to route new signups to /welcome/.
    if (document.body.dataset.authPage === 'signup') {
      try { localStorage.setItem('mmai_after_auth', 'welcome'); } catch (_e) {}
    }
    const captchaToken = captcha.token();
    const { error } = await _sb.auth.signInWithOAuth({
      provider,
      options: { redirectTo: CALLBACK_URL, captchaToken },
    });
    if (error) msg('#auth-msg', error.message, 'err');
  }

  function wireOAuthButtons() {
    const apple = $('[data-oauth="apple"]');
    const google = $('[data-oauth="google"]');
    if (apple) apple.addEventListener('click', () => oauth('apple'));
    if (google) google.addEventListener('click', () => oauth('google'));
  }

  // ──────── Forgot password ────────
  function wireForgot() {
    const link = $('[data-forgot]');
    if (!link) return;
    link.addEventListener('click', async (e) => {
      e.preventDefault();
      const emailField = $('[name=email]');
      const email = emailField ? emailField.value.trim() : '';
      if (!email) {
        msg('#auth-msg', 'Enter your email above first, then click reset password.', 'err');
        emailField && emailField.focus();
        return;
      }
      const captchaToken = captcha.token();
      const { error } = await _sb.auth.resetPasswordForEmail(email, { redirectTo: CALLBACK_URL, captchaToken });
      captcha.reset();
      if (error) msg('#auth-msg', error.message, 'err');
      else msg('#auth-msg', 'Reset link sent. Check your email.', 'ok');
    });
  }

  // ──────── Password recovery (in-page form) ────────
  // When Supabase delivers a recovery link, the URL fragment includes
  // `type=recovery`. We must NOT bounce to /app/ — we need to let the user
  // set a new password first.
  function isRecoveryFlow() {
    const hash = new URLSearchParams((location.hash || '').replace(/^#/, ''));
    if (hash.get('type') === 'recovery') return true;
    const qs = new URLSearchParams(location.search || '');
    return qs.get('type') === 'recovery';
  }

  function showRecoveryForm() {
    const card = $('.callback-box');
    if (!card) return;
    const heading = card.querySelector('h1');
    const sub = card.querySelector('.sub');
    const spin = card.querySelector('.spinner');
    if (spin) spin.style.display = 'none';
    if (heading) heading.textContent = 'Set a new password';
    if (sub) sub.textContent = 'Choose a new password for your MyMilesAI account.';
    // Build form (CSP-safe — no innerHTML with user data).
    const form = document.createElement('form');
    form.id = 'pw-reset-form';
    form.autocomplete = 'off';
    form.style.cssText = 'display:flex;flex-direction:column;gap:12px;margin-top:18px;text-align:left';

    const mkInput = (name, label) => {
      const wrap = document.createElement('label');
      wrap.style.cssText = 'display:flex;flex-direction:column;gap:6px;font-size:13px';
      const lab = document.createElement('span');
      lab.textContent = label;
      const inp = document.createElement('input');
      inp.type = 'password';
      inp.name = name;
      inp.required = true;
      inp.minLength = 8;
      inp.autocomplete = 'new-password';
      inp.style.cssText = 'padding:12px 14px;border-radius:10px;border:1px solid #E5E7EB;font-size:15px;font-family:inherit';
      wrap.appendChild(lab);
      wrap.appendChild(inp);
      return { wrap, inp };
    };

    const { wrap: w1, inp: pw1 } = mkInput('password', 'New password (8+ characters)');
    const { wrap: w2, inp: pw2 } = mkInput('confirm', 'Confirm new password');
    const submit = document.createElement('button');
    submit.type = 'submit';
    submit.className = 'btn-primary';
    submit.textContent = 'Update password';
    submit.style.cssText = 'margin-top:8px;width:100%';

    form.appendChild(w1);
    form.appendChild(w2);
    form.appendChild(submit);
    card.appendChild(form);

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (pw1.value !== pw2.value) {
        msg('#auth-msg', 'Passwords do not match.', 'err');
        return;
      }
      submit.disabled = true;
      submit.textContent = '…';
      const { error } = await _sb.auth.updateUser({ password: pw1.value });
      if (error) {
        submit.disabled = false;
        submit.textContent = 'Update password';
        msg('#auth-msg', error.message, 'err');
        return;
      }
      msg('#auth-msg', 'Password updated. Redirecting…', 'ok');
      setTimeout(() => location.replace('/app/'), 800);
    });
  }

  // ──────── Auth callback ────────
  async function handleCallback() {
    // Supabase JS v2 auto-handles session from URL when detectSessionInUrl=true.
    // We just need to wait for the session, then redirect — UNLESS this is a
    // password-recovery link, in which case we render the set-password form.
    try {
      const recovery = isRecoveryFlow();
      // Try up to ~5 seconds for the session to settle (Apple/Google redirects land with fragment).
      for (let i = 0; i < 25; i++) {
        const { data } = await _sb.auth.getSession();
        if (data.session) {
          if (recovery) {
            showRecoveryForm();
            return;
          }
          let dest = '/app/';
          try {
            if (localStorage.getItem('mmai_after_auth') === 'welcome') {
              localStorage.removeItem('mmai_after_auth');
              dest = '/welcome/';
            }
          } catch (_e) {}
          location.replace(dest);
          return;
        }
        await new Promise((r) => setTimeout(r, 200));
      }
      const errText = new URLSearchParams(location.hash.replace(/^#/, '')).get('error_description') ||
                      new URLSearchParams(location.search).get('error_description') ||
                      'Sign-in did not complete. Please try again.';
      msg('#auth-msg', errText, 'err');
      const retry = $('[data-retry]');
      if (retry) retry.style.display = 'inline-block';
    } catch (e) {
      msg('#auth-msg', (e && e.message) || 'Unexpected error.', 'err');
    }
  }

  // ──────── Router ────────
  const page = document.body.dataset.authPage;
  if (page === 'signin' || page === 'signup') {
    bounceIfSignedIn();
    const meter = (page === 'signup') ? pwMeter.attach() : null;
    wireEmailForm('#auth-form', page, meter);
    wireOAuthButtons();
    wireForgot();
    captcha.mount();
  } else if (page === 'callback') {
    handleCallback();
  }
})();

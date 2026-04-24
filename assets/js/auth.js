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
  window._sb = _sb;

  const CALLBACK_URL = 'https://mymilesai.com/auth-callback/';

  // ──────── helpers ────────
  const $ = (sel, root) => (root || document).querySelector(sel);
  const msg = (sel, text, tone) => {
    const el = $(sel);
    if (!el) return;
    el.textContent = text || '';
    el.className = 'auth-msg' + (tone ? ' ' + tone : '');
  };

  // ──────── already-signed-in redirect ────────
  async function bounceIfSignedIn() {
    const { data } = await _sb.auth.getSession();
    if (data.session) location.replace('/app/');
  }

  // ──────── Email/password ────────
  function wireEmailForm(formSel, mode /* 'signin' | 'signup' */) {
    const form = $(formSel);
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = $('[name=email]', form).value.trim();
      const password = $('[name=password]', form).value;
      const btn = $('button[type=submit]', form);
      if (btn) { btn.disabled = true; btn.dataset._orig = btn.textContent; btn.textContent = '…'; }

      let result;
      if (mode === 'signup') {
        result = await _sb.auth.signUp({
          email, password,
          options: { emailRedirectTo: CALLBACK_URL },
        });
      } else {
        result = await _sb.auth.signInWithPassword({ email, password });
      }

      if (btn) { btn.disabled = false; btn.textContent = btn.dataset._orig; }

      if (result.error) {
        msg('#auth-msg', result.error.message, 'err');
        return;
      }

      if (mode === 'signup' && !result.data.session) {
        // Email confirmation required.
        msg('#auth-msg', 'Check your inbox for a confirmation link.', 'ok');
        return;
      }

      location.replace('/app/');
    });
  }

  // ──────── OAuth (Google + Apple) ────────
  async function oauth(provider) {
    const { error } = await _sb.auth.signInWithOAuth({
      provider,
      options: { redirectTo: CALLBACK_URL },
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
        msg('#auth-msg', 'Enter your email above first, then tap reset password.', 'err');
        emailField && emailField.focus();
        return;
      }
      const { error } = await _sb.auth.resetPasswordForEmail(email, { redirectTo: CALLBACK_URL });
      if (error) msg('#auth-msg', error.message, 'err');
      else msg('#auth-msg', 'Reset link sent. Check your email.', 'ok');
    });
  }

  // ──────── Auth callback ────────
  async function handleCallback() {
    // Supabase JS v2 auto-handles session from URL when detectSessionInUrl=true.
    // We just need to wait for the session, then redirect.
    try {
      // Try up to ~5 seconds for the session to settle (Apple/Google redirects land with fragment).
      for (let i = 0; i < 25; i++) {
        const { data } = await _sb.auth.getSession();
        if (data.session) {
          location.replace('/app/');
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
    wireEmailForm('#auth-form', page);
    wireOAuthButtons();
    wireForgot();
  } else if (page === 'callback') {
    handleCallback();
  }
})();

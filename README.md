# mymilesai2web

Marketing + logged-in app shell for **mymilesai.com**. Plain static HTML/CSS/JS
deployed to GitHub Pages. Origin of authority for `mymilesai.com` — the iOS app
and any future native client load through the same auth and data plane behind it.

## Structure

```
/
├── index.html              Landing — design A (plain HTML, no framework)
├── app/index.html          Post-login app shell — design B
├── signin/index.html       Email + Apple + Google
├── signup/index.html       Email + Apple + Google
├── auth-callback/index.html OAuth redirect landing
├── privacy/index.html      Pulled from the iOS in-app modal verbatim
├── terms/index.html        Pulled from the iOS in-app modal verbatim
├── assets/
│   ├── css/  tokens.css · marketing.css · app.css · auth.css
│   ├── js/   marketing.js · app.js · auth.js
│   └── img/  fonts/
├── tools/
│   ├── gen-apple-client-secret.mjs   Zero-dep ES256 JWT generator for Apple
│   └── README.md                     Apple Developer setup walkthrough
├── CNAME                             mymilesai.com
├── robots.txt  sitemap.xml  .gitignore
└── README.md
```

## Stack decisions

- **No build step, no npm.** Pages serves the repo root directly. Plain HTML/CSS/JS.
- **Fonts:** Google Fonts (`Inter`, `Instrument Serif`, `JetBrains Mono`) + Fontshare (`Satoshi` for the logo wordmark on landing).
- **Supabase JS v2** via jsdelivr CDN on the auth + app pages only.
- **No React on the landing.** The original design bundle used React+Babel standalone from unpkg (~175KB gzipped dev build) — rewritten as plain HTML to hit **FCP < 1.2s on 3G**.
- **Auth providers:** email+password, Google OAuth, Apple Sign-In. All three funnel through Supabase `signInWithOAuth` / `signInWithPassword`, so the web and iOS clients resolve to the same `auth.users` identity.

## Before deploy

1. Replace the placeholder `SB_ANON_KEY_PLACEHOLDER` in:
   - `app/index.html`
   - `signin/index.html`
   - `signup/index.html`
   - `auth-callback/index.html`

   with the **publishable / anon key** from Supabase → Project Settings → API
   (prefixed `sb_publishable_…`). **Never commit `service_role`.**

2. Run the `profiles.plan` migration in Supabase SQL Editor:
   ```sql
   BEGIN;
   ALTER TABLE public.profiles
     ADD COLUMN IF NOT EXISTS plan text NOT NULL DEFAULT 'Free';
   UPDATE public.profiles SET plan = CASE subscription_tier
     WHEN 'pro'      THEN 'Pro'
     WHEN 'business' THEN 'Pro'
     ELSE 'Free'
   END;
   ALTER TABLE public.profiles
     ADD CONSTRAINT profiles_plan_check
     CHECK (plan IN ('Free','Pro','Pro Trial','Teams'));
   COMMIT;
   ```

3. Set Supabase → Authentication → URL Configuration:
   - **Site URL:** `https://mymilesai.com`
   - **Redirect URLs** (append, keep existing):
     - `https://mymilesai.com/auth-callback/`
     - `https://mymilesai.com/app/`

4. Enable Apple provider (see [tools/README.md](tools/README.md) for the full walkthrough).

## Deploy (Phase 4)

```bash
git add .
git commit -m "Initial scaffold: landing + app shell + auth + legal"
git push origin main
```

On GitHub → repo → **Settings → Pages**:
- Source: **Deploy from branch**
- Branch: `main` / `/` (root)
- **Custom domain: LEAVE EMPTY** for now (Phase 4 verifies default URL before the domain cutover in Phase 6)

Default URL goes live at `https://adsontrack1-ctrl.github.io/mymilesai2web/`.

## IRS rates

The YTD deduction display uses **`IRS_RATE_2026 = 0.725`** (72.5 ¢/mi), set in
[assets/js/app.js](assets/js/app.js). Source:
[IRS — IR-2025-132, Dec 29 2025](https://www.irs.gov/newsroom/irs-sets-2026-business-standard-mileage-rate-at-725-cents-per-mile-up-25-cents) and
[Notice 2026-10](https://www.irs.gov/pub/irs-drop/n-26-10.pdf).
Update both the constant AND the display copy in `app/index.html` (search
`0.725` and `$0.725`) when the IRS publishes a new rate.

## Trip schema note

The KPI loader in `assets/js/app.js` reads from the real columns on `public.trips`:
- `miles` (not `distance_mi`)
- `trip_date` (not `started_at`)
- `type` in `('business','personal','unclassified')`
- filter `deleted_at IS NULL`

This mirrors the write path used by the RN v2 iOS app (`~/Developer/MyMilesAi-2/src/lib/repos/trips.ts`).

## DNS cutover

Deliberately **not** part of this deploy. The current live `mymilesai.com` is
served by the `mile-tracker-1` repo's GitHub Pages custom domain. Switching is
a separate, gated phase:

- Phase 5: Cloudflare zone create → mirror GoDaddy records → flip nameservers at GoDaddy. 24-48 hr propagation window.
- Phase 6: Remove custom domain from `mile-tracker-1`, add it here, verify cert provisioning. Leave Cloudflare proxy **grey / DNS-only** until the Pages cert is issued; then optionally flip to orange.

Record mirror set (GoDaddy → Cloudflare):

```
A     @     185.199.108.153 / 109.153 / 110.153 / 111.153   DNS only
CNAME www   adsontrack1-ctrl.github.io                      DNS only
MX    @     0 mymilesai-com.mail.protection.outlook.com     (proxy N/A)
TXT   @     "NETORGFT20431510.onmicrosoft.com"
TXT   @     "v=spf1 include:secureserver.net -all"
```

Missing MX/TXT = broken email. Verify mail routing after NS flip before Phase 6.

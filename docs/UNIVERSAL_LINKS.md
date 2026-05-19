# Universal Links — operator handover

This doc covers the web ↔ iOS deep-link contract and the **iOS-side**
work required to make Universal Links actually open the app.

## Web side (this repo) — done

| Item | State |
|---|---|
| `/.well-known/apple-app-site-association` | ✅ Present, JSON content |
| App ID | `UPU6GJ5B68.com.harijasllc.mymilesaiapp` (Team ID · Bundle ID) |
| Paths claimed | `/app/*`, `/app`, `/welcome/*`, `/auth-callback/*` |
| `webcredentials` | ✅ Set so Apple's autofill can suggest saved passwords |
| Cloudflare `_headers` | ✅ Forces `Content-Type: application/json` on AASA (post-cutover) |
| Cloudflare `_redirects` | ✅ Mirrors `/apple-app-site-association` → `/.well-known/...` |

## iOS side (NOT in this repo) — required before AASA goes live

The web file is necessary but not sufficient. The iOS app must:

### 1. Enable the Associated Domains entitlement

File: `~/MyMilesAi-2/ios/MyMilesAI/MyMilesAI.entitlements`

Current content (verified 2026-05-18):

```xml
<dict>
  <key>aps-environment</key>
  <string>production</string>
  <key>com.apple.developer.applesignin</key>
  <array>
    <string>Default</string>
  </array>
</dict>
```

Add an `applinks` entry **and** `webcredentials`:

```xml
<key>com.apple.developer.associated-domains</key>
<array>
  <string>applinks:mymilesai.com</string>
  <string>webcredentials:mymilesai.com</string>
</array>
```

### 2. Enable Associated Domains capability in Apple Developer

Apple Developer → Certificates, IDs & Profiles → Identifiers →
select the `com.harijasllc.mymilesaiapp` App ID → Capabilities →
check **Associated Domains** → save. Then re-generate the
provisioning profile and download it; Xcode auto-pulls it.

### 3. Handle the inbound URL in the app

In the React Native / Expo entry, add a `Linking.addEventListener('url', …)`
handler that:
- parses `event.url`
- if path starts with `/auth-callback/`, hands off to Supabase auth-session
- if path starts with `/app/` or `/welcome/`, navigates to that screen
- otherwise opens the URL in Safari (fallback)

### 4. Verify

After the next TestFlight build:

1. Tap a `https://mymilesai.com/app/` link in Mail → it should open
   MyMilesAI directly (no Safari intermediate).
2. Tap-and-hold the same link → context menu should show **"Open in
   MyMilesAI"** as a primary action.
3. Apple's diagnostic tool:
   `swcutil dl -d mymilesai.com` (run from iOS device console) →
   should show `applinks:mymilesai.com` with status `verified`.
4. Apple's AASA validator:
   <https://search.developer.apple.com/appsearch-validation-tool/>
   → enter `mymilesai.com` → expect `applinks` block present and
   valid (200, JSON, single `appIDs` entry).

## Cache caveat

iOS caches the AASA result for **~7 days** (longer in some versions).
After the first successful fetch, changes to `apple-app-site-association`
may not take effect on existing installs until the cache expires or the
app is reinstalled. Plan AASA changes accordingly.

## Production launch gate

Universal Links should be **disabled** (don't deploy the iOS entitlement)
until the public App Store release. While the app is TestFlight-only,
universal-link clicks from non-invitees would fail to open anything.
The AASA file on the web is harmless during this period — Apple just
silently ignores it for users who don't have the matching app.

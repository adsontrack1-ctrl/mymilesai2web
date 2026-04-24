# tools/

## `gen-apple-client-secret.mjs`

Generates a signed ES256 JWT that Supabase uses as the Apple "client secret" when
a user taps **Sign in with Apple** on the web. Apple enforces a **6-month max
lifetime** on this token — regenerate before expiry or OAuth breaks.

### Prerequisites (one-time)

Complete Phase 7A of the runbook:

1. **Apple Developer → Identifiers → Services IDs → +**
   - Description: `MyMilesAI Web Auth`
   - Identifier: `com.harijasllc.mymilesaiapp.signin`  *(distinct from the iOS App ID)*
   - Enable **Sign in with Apple** → Configure:
     - Primary App ID: `com.harijasllc.mymilesaiapp`
     - Domains: `mymilesai.com`, `www.mymilesai.com`
     - Return URLs: `https://dxpuuiqibtizewbbffjk.supabase.co/auth/v1/callback`

2. **Apple Developer → Keys → +**
   - Name: `MyMilesAI Supabase Apple Auth Key`
   - Enable **Sign in with Apple** → Configure → Primary App ID `com.harijasllc.mymilesaiapp`
   - Continue → Register → **Download `AuthKey_XXXXXXXXXX.p8`** *(one-time download)*
   - Note the **Key ID** (10-char) printed on the page
   - Note your **Team ID** (10-char, top-right of the console)

3. Save the `.p8` file OUTSIDE this repo:
   ```
   mkdir -p ~/Developer/MyMilesAI-Backups/apple-auth/
   mv ~/Downloads/AuthKey_XXXXXXXXXX.p8 ~/Developer/MyMilesAI-Backups/apple-auth/
   ```
   (`.gitignore` excludes `*.p8` and `AuthKey_*.p8` as a second line of defense.)

### Generate the JWT

```bash
node tools/gen-apple-client-secret.mjs \
  --team-id     UPU6GJ5B68 \
  --key-id      <your Key ID from Apple> \
  --services-id com.harijasllc.mymilesaiapp.signin \
  --p8-path     ~/Developer/MyMilesAI-Backups/apple-auth/AuthKey_<Key ID>.p8 \
  --ttl-days    180
```

The JWT prints to `stdout`. Metadata (expiry, IDs) prints to `stderr` so you can
pipe cleanly: `node … | pbcopy`.

### Paste into Supabase

Supabase dashboard → **Authentication → Providers → Apple**

- Enable: ON
- Services ID: `com.harijasllc.mymilesaiapp.signin`
- Secret Key (for OAuth flow): *(paste the JWT)*
- Save

### Renewal reminder

Apple rejects expired tokens silently from the user's perspective — sign-in just
starts failing. Set a calendar reminder **5 months after generation** to rerun
this script. The expiry date is printed to stderr on generation.

### Why a custom generator?

Zero npm dependencies. Supabase's dashboard has a built-in generator, but it
requires uploading the `.p8`, which is a one-time-downloadable private key we'd
rather keep on disk. This script signs locally and only the resulting JWT
leaves the machine.

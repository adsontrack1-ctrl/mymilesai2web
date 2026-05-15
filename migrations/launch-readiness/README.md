# Launch-Readiness Migrations

These SQL files are authored in the web repo to keep the launch-readiness
PR self-contained — every backend change required by the web-side
launch fixes lives next to the client-side code that depends on it.

## How to apply

Migrations are owned by the iOS repo (`~/MyMilesAi-2/supabase/migrations/`).
To ship them, copy each `.sql` file into that directory under the same
timestamp prefix, then push via the Supabase CLI from the iOS repo:

```bash
cp migrations/launch-readiness/20260514210000_launch_readiness.sql \
   ~/MyMilesAi-2/supabase/migrations/

cd ~/MyMilesAi-2 && supabase db push
```

Every statement is **idempotent** — wrapped in `DO $$` blocks with
`IF NOT EXISTS` / `IF EXISTS` checks. Safe to re-run.

## What's in this bundle

| File | What it does | Closes assessment item |
|---|---|---|
| `20260514210000_launch_readiness.sql` | UNIQUE on `trips(user_id, trip_uid)`; CHECK on `miles`/`type`/`deductible`; composite indexes; Realtime publication; pg_cron schedule for `delete-expired-accounts` | Blockers #2, #11, #14, #18, #19 |

## Already shipped upstream (do **not** re-apply)

Two assessment-flagged P0s were resolved earlier in
`20260509000003_security_audit_hardening.sql`:

- `subscriptions` UPDATE policy (self-promote prevention) — done
- `app_errors` admin policy moved from hardcoded email to `profiles.is_admin` — done

## Post-apply verification

The migration ends with five copy-pasteable SELECT statements. Run them
in the Supabase SQL editor; each should return one or more rows
matching the new constraint / index / publication / cron job.

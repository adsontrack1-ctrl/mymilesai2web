# Launch-Readiness Migrations

Authored here so the launch-readiness PR carries the full backend
story alongside the client-side fixes that depend on it. Migrations
live (canonically) in the iOS repo's `supabase/migrations/`; this
directory is the staging copy for review.

## Files

| File | Type | What it does |
|---|---|---|
| `00_report_trip_uid_duplicates.sql` | **READ-ONLY diagnostic** | Counts duplicate `(user_id, trip_uid)` pairs and shows samples. Run this first. Does not modify any data. |
| `20260515000000_launch_readiness.sql` | Migration | Adds the `trip_uid` UNIQUE, CHECK constraints, indexes, Realtime publication membership, and `pg_cron` schedule for `delete-expired-accounts`. Fail-loud on duplicates by default. |

## Apply order

### Step 1 — Run the report

Open the Supabase SQL Editor and run **`00_report_trip_uid_duplicates.sql`**
in full. Read the four result sets:

- Query 1: `duplicate_pairs` headline number
- Query 2: which users are affected and how badly
- Query 3: sample rows so you can eyeball whether they're obvious
  retries (same `created_at` to the second) or genuinely different
  ingestion paths
- Query 4: age distribution — clustered or chronic?

The bottom of the report file has a decision guide.

### Step 2 — Apply the migration

Copy the migration into the iOS repo and push:

```bash
cp migrations/launch-readiness/20260515000000_launch_readiness.sql \
   ~/MyMilesAi-2/supabase/migrations/

cd ~/MyMilesAi-2 && supabase db push
```

**If duplicates exist** the migration will abort with a clear error.
Two options:

- Clean up by hand (write targeted `DELETE` per case), re-run the
  report until it returns 0, then re-apply.
- Edit the migration: in Section 1, change
  `DESTRUCTIVE := false` to `DESTRUCTIVE := true`. The migration will
  keep the most-recently-updated row of each pair and delete the
  rest before installing the UNIQUE constraint.

### Step 3 — Verify

The migration ends with five `SELECT` statements covering each of
the five sections. Run them in the SQL Editor; every one should
return at least one row.

## Already shipped upstream (do not re-apply)

These two assessment-flagged blockers were closed earlier in
`20260509000003_security_audit_hardening.sql`:

- `subscriptions` UPDATE policy (no more self-promote to enterprise)
- `app_errors` admin policy → `profiles.is_admin` (no more hardcoded email)

## Why each item is here

| Section | Why it matters |
|---|---|
| **1. UNIQUE on `(user_id, trip_uid)`** | Lets clients use a clean `ON CONFLICT` upsert path. Removes the silent-duplicate failure mode when retries race. iOS today uses try-update-then-insert defensively; it still works after this lands. |
| **2. CHECK on miles/type/deductible** | Front-line validation. Today's clients write only valid values, so this is a guardrail for future regressions, not a fix for current data. |
| **3. Composite chrono indexes** | The dashboard YTD query is the #1 DB read hotspot. Index keeps it bounded; without it, seq-scan + sort at 5k+ DAU. |
| **4. Realtime publication membership** | The web app subscribes to `postgres_changes` on these tables. Without membership the subscription succeeds but emits no events (silent failure). |
| **5. `pg_cron` for delete-expired-accounts** | GDPR purge. The April migration documents that this was deployed out-of-band; this block is a safety net — no-op if already scheduled. |

## iOS code impact

**None required for launch.** iOS keeps using its try-update-then-insert
pattern in `tripsRepo.upsert` and is unaffected by every other change.

Optional cleanup for a later iOS build (touches `src/lib/repos/trips.ts`
which is part of the locked trip-saving zone — needs explicit sign-off):

- Remove the comment at lines 249-254 that says "we can't guarantee
  UNIQUE" — the guarantee now holds.
- Optionally simplify the upsert to one round trip:
  `.upsert(row, { onConflict: 'user_id,trip_uid' }).select().single()`.

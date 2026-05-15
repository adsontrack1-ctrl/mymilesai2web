-- =============================================================================
-- MyMilesAI — Launch readiness migration (2026-05-14)
-- =============================================================================
--
-- Closes the remaining backend launch blockers identified in the
-- production assessment. Two items from that assessment (subscriptions
-- UPDATE self-promote and the hardcoded admin email) were already
-- resolved in 20260509000003_security_audit_hardening.sql; they are NOT
-- re-applied here.
--
-- This migration is authored in the web repo (mymilesai2web) so the
-- launch-readiness PR carries the full backend story for review. It is
-- intended to be copied into the iOS repo's supabase/migrations/ as
--   20260514210000_launch_readiness.sql
-- and applied via `supabase db push` from that repo. Apply order is
-- explicit per-section; every statement is idempotent (IF NOT EXISTS /
-- IF EXISTS / DO blocks).
--
-- Sections:
--   1. trips.trip_uid UNIQUE (user_id, trip_uid)
--   2. CHECK constraints on trips.miles, trips.type, trips.deductible
--   3. Composite index on trips for the dashboard/YTD query
--   4. Realtime publication for trips, vehicles, profiles
--   5. pg_cron schedule for delete-expired-accounts
-- =============================================================================

BEGIN;

-- ── 1. UNIQUE (user_id, trip_uid) ─────────────────────────────────────
-- Prevents duplicate trip ingestion from:
--   - iOS outbox drain racing the foreground upsert (the try-update-
--     then-insert dance in src/lib/repos/trips.ts becomes a real
--     ON CONFLICT instead of a best-effort)
--   - Web manual-log "Save" double-tap (app.js now uses upsert with
--     onConflict: 'user_id,trip_uid')
--   - Future native clients writing concurrently to the same user
--
-- The constraint is partial-scoped per user_id so the same trip_uid
-- value can theoretically appear across different users (defense-in-
-- depth — should never happen because trip_uid contains a per-device
-- random seed, but the index is cheap insurance).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'trips_user_trip_uid_unique'
      AND conrelid = 'public.trips'::regclass
  ) THEN
    -- Defensive: a corrupt prior state could already have a duplicate.
    -- We can't add UNIQUE while one exists, so delete the older copy
    -- of any (user_id, trip_uid) pair, keeping the most recently
    -- updated row.
    DELETE FROM public.trips a
    USING public.trips b
    WHERE a.user_id   = b.user_id
      AND a.trip_uid  = b.trip_uid
      AND a.ctid     <> b.ctid
      AND COALESCE(a.updated_at, a.created_at) < COALESCE(b.updated_at, b.created_at);

    ALTER TABLE public.trips
      ADD CONSTRAINT trips_user_trip_uid_unique UNIQUE (user_id, trip_uid);
  END IF;
END $$;

COMMENT ON CONSTRAINT trips_user_trip_uid_unique ON public.trips IS
  'Enforced 2026-05-14 to prevent duplicate trip ingestion under flaky network/outbox-race conditions. Clients must use ON CONFLICT (user_id, trip_uid) DO UPDATE — naked INSERT is a bug.';


-- ── 2. CHECK constraints — miles, type, deductible ───────────────────
-- Catches client bugs at the DB boundary instead of in monthly reports.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'trips_miles_nonneg'
      AND conrelid = 'public.trips'::regclass
  ) THEN
    -- Backfill any legacy negative rows to NULL before adding the
    -- constraint so the ALTER doesn't trip.
    UPDATE public.trips SET miles = NULL WHERE miles IS NOT NULL AND miles < 0;
    ALTER TABLE public.trips
      ADD CONSTRAINT trips_miles_nonneg
      CHECK (miles IS NULL OR miles >= 0);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'trips_type_known'
      AND conrelid = 'public.trips'::regclass
  ) THEN
    -- Allowed: short codes used by iOS app and web app.js, plus the
    -- long-form spellings that legacy rows carry, plus NULL/empty
    -- (which means "needs review").
    ALTER TABLE public.trips
      ADD CONSTRAINT trips_type_known
      CHECK (
        type IS NULL
        OR type IN ('biz', 'pers', 'med', 'char', 'uncl',
                    'business', 'personal', 'medical', 'charity', 'unclassified')
      );
  END IF;

  -- The deductible column has accepted boolean-ish strings from a long
  -- defunct client code path. 20260506000000_deductible_numeric.sql
  -- already converted the column type; this constraint guarantees the
  -- numeric domain forward.
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'trips_deductible_sane'
      AND conrelid = 'public.trips'::regclass
  ) THEN
    ALTER TABLE public.trips
      ADD CONSTRAINT trips_deductible_sane
      CHECK (deductible IS NULL OR (deductible >= 0 AND deductible < 100000));
  END IF;
END $$;


-- ── 3. Composite index for dashboard / YTD query ──────────────────────
-- The query that scales worst, hit on every web dashboard load AND every
-- iOS useTrips.refresh():
--
--   SELECT * FROM trips
--   WHERE user_id = $1 AND deleted_at IS NULL
--   ORDER BY trip_date DESC, trip_time DESC
--   LIMIT 500;
--
-- Without an index Postgres falls back to seq-scan + sort, which gets
-- linear in trip count. At 50k DAU × 100 trips this is the #1 DB CPU
-- hotspot. Partial index (WHERE deleted_at IS NULL) keeps the index
-- compact since deleted trips are <2% of the table in practice.
CREATE INDEX IF NOT EXISTS trips_user_active_chrono_idx
  ON public.trips (user_id, trip_date DESC, trip_time DESC)
  WHERE deleted_at IS NULL;

-- A second index covering the Recently Deleted panel query (web
-- loadDeletedTrips):
--
--   SELECT * FROM trips
--   WHERE user_id = $1 AND deleted_at IS NOT NULL AND deleted_at >= cutoff
--   ORDER BY deleted_at DESC;
CREATE INDEX IF NOT EXISTS trips_user_deleted_idx
  ON public.trips (user_id, deleted_at DESC)
  WHERE deleted_at IS NOT NULL;

-- Index supporting the route_memory cell-aware sibling matching used by
-- iOS bulk-apply. Already partially covered by the existing user_id
-- index, but adding the (end_lat, end_lng) tail keeps Layer-2 history
-- lookups bounded as trip count grows.
CREATE INDEX IF NOT EXISTS trips_user_endpoint_idx
  ON public.trips (user_id, end_lat, end_lng)
  WHERE deleted_at IS NULL AND end_lat IS NOT NULL AND end_lng IS NOT NULL;


-- ── 4. Realtime publication for trips, vehicles, profiles ────────────
-- The web app subscribes to postgres_changes on these tables for
-- cross-device sync (assets/js/app.js wireRealtime). Supabase's
-- supabase_realtime publication must include the tables before the
-- channel will emit events.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime'
  ) THEN
    -- Bootstrap the publication. Supabase Cloud usually pre-creates
    -- this, but local dev / fresh tenants may not have it.
    CREATE PUBLICATION supabase_realtime;
  END IF;

  -- Idempotent membership. Postgres has no "ADD TABLE IF NOT EXISTS"
  -- for publications, so we check pg_publication_tables first.
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'trips'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.trips;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'vehicles'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.vehicles;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'profiles'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
  END IF;
END $$;


-- ── 5. pg_cron schedule for delete-expired-accounts ──────────────────
-- The edge function supabase/functions/delete-expired-accounts/index.ts
-- exists but the cron entry was only documented in a comment, not
-- actually scheduled. Without this, a user who requests deletion stays
-- in the "soft-deleted" state past the GDPR 30-day window — a real
-- compliance risk.
--
-- Runs daily at 04:17 UTC (slightly off-the-hour to avoid contention).
-- Posts to the function with the CRON_TOKEN secret stored in Vault.
-- The function is idempotent — re-running with no eligible rows is a
-- no-op.
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

DO $$
DECLARE
  -- Pull project ref from current_setting if available so the URL is
  -- portable across staging/prod, otherwise hard-code per the live
  -- project (dxpuuiqibtizewbbffjk).
  proj_ref text := COALESCE(
    current_setting('app.project_ref', true),
    'dxpuuiqibtizewbbffjk'
  );
BEGIN
  -- Drop any prior schedule with the same job name so the migration is
  -- safely re-runnable.
  PERFORM cron.unschedule('delete-expired-accounts-daily')
  WHERE EXISTS (
    SELECT 1 FROM cron.job WHERE jobname = 'delete-expired-accounts-daily'
  );

  PERFORM cron.schedule(
    'delete-expired-accounts-daily',
    '17 4 * * *',  -- daily 04:17 UTC
    format(
      $cmd$
      SELECT net.http_post(
        url := 'https://%s.functions.supabase.co/delete-expired-accounts',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'CRON_TOKEN')
        ),
        body := '{}'::jsonb,
        timeout_milliseconds := 30000
      );
      $cmd$,
      proj_ref
    )
  );
END $$;

COMMENT ON EXTENSION pg_cron IS
  'Scheduled jobs. Used by 20260514210000_launch_readiness.sql to run delete-expired-accounts daily for GDPR compliance.';

COMMIT;

-- =============================================================================
-- Post-apply verification queries (run manually):
--
--   -- 1. Confirm UNIQUE is enforced.
--   SELECT conname FROM pg_constraint
--   WHERE conname = 'trips_user_trip_uid_unique';
--
--   -- 2. Confirm CHECK constraints.
--   SELECT conname FROM pg_constraint
--   WHERE conrelid = 'public.trips'::regclass
--     AND contype = 'c'
--   ORDER BY conname;
--
--   -- 3. Confirm indexes exist + size.
--   SELECT indexname, pg_size_pretty(pg_relation_size(indexname::regclass))
--   FROM pg_indexes
--   WHERE schemaname = 'public' AND tablename = 'trips'
--     AND indexname IN (
--       'trips_user_active_chrono_idx',
--       'trips_user_deleted_idx',
--       'trips_user_endpoint_idx'
--     );
--
--   -- 4. Confirm realtime publication membership.
--   SELECT tablename FROM pg_publication_tables
--   WHERE pubname = 'supabase_realtime' AND schemaname = 'public'
--   ORDER BY tablename;
--
--   -- 5. Confirm cron schedule.
--   SELECT jobname, schedule, command FROM cron.job
--   WHERE jobname = 'delete-expired-accounts-daily';
-- =============================================================================

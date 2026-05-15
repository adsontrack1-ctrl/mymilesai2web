-- =============================================================================
-- MyMilesAI — Launch readiness migration (2026-05-15)
-- =============================================================================
--
-- Closes the remaining backend launch blockers from the production
-- assessment. Two items (subscriptions UPDATE self-promote and the
-- hardcoded admin email) were already resolved in
-- 20260509000003_security_audit_hardening.sql and are NOT re-applied.
--
-- This migration is authored in the web repo (mymilesai2web) so the
-- launch-readiness PR carries the full backend story for review. To
-- ship, copy into the iOS repo's supabase/migrations/ and apply:
--
--   cp migrations/launch-readiness/20260515000000_launch_readiness.sql \
--      ~/MyMilesAi-2/supabase/migrations/
--   cd ~/MyMilesAi-2 && supabase db push
--
-- BEFORE applying: run 00_report_trip_uid_duplicates.sql in the SQL
-- Editor. If it returns duplicate_pairs > 0 you must either fix them
-- by hand OR set DESTRUCTIVE = true below (Section 1).
--
-- Sections:
--   1. trips: UNIQUE (user_id, trip_uid)  -- fail-loud by default
--   2. trips: CHECK constraints on miles, type, deductible
--   3. trips: composite indexes for the dashboard + recently-deleted queries
--   4. Realtime publication: trips, vehicles, profiles
--   5. pg_cron schedule: delete-expired-accounts (no-op if already scheduled)
-- =============================================================================

BEGIN;

-- ── 1. UNIQUE (user_id, trip_uid) — fail-loud, opt-in cleanup ────────
--
-- Pre-check refuses to install the constraint if any duplicates exist.
-- The user is expected to have run 00_report_trip_uid_duplicates.sql
-- first and either (a) confirmed zero dupes, or (b) reviewed the sample
-- output, decided dupes are safe to lose, and flipped DESTRUCTIVE to
-- true below.
--
-- DESTRUCTIVE behavior keeps the most recently updated row of each
-- (user_id, trip_uid) pair and deletes the rest. The "most recently
-- updated" tiebreaker is COALESCE(updated_at, created_at) so newly-
-- minted rows that haven't been updated yet still get a sensible
-- ordering.
DO $$
DECLARE
  DESTRUCTIVE  boolean := false;        -- ← FLIP ONLY AFTER REVIEWING THE REPORT
  dup_count    integer;
BEGIN
  -- Idempotent — no-op if the constraint is already present.
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'trips_user_trip_uid_unique'
      AND conrelid = 'public.trips'::regclass
  ) THEN
    RAISE NOTICE 'trips_user_trip_uid_unique already present — skipping';
  ELSE
    SELECT COUNT(*) INTO dup_count
    FROM (
      SELECT user_id, trip_uid
      FROM public.trips
      GROUP BY user_id, trip_uid
      HAVING COUNT(*) > 1
    ) d;

    IF dup_count > 0 AND NOT DESTRUCTIVE THEN
      RAISE EXCEPTION
        'Refusing to add UNIQUE (user_id, trip_uid): % duplicate trip_uid pairs exist. '
        'Run 00_report_trip_uid_duplicates.sql, decide on cleanup, then either '
        'fix manually and re-run, or set DESTRUCTIVE := true at the top of this DO block.',
        dup_count;
    END IF;

    IF dup_count > 0 AND DESTRUCTIVE THEN
      RAISE NOTICE 'DESTRUCTIVE mode: deleting % duplicate row(s), keeping most recently updated', dup_count;
      DELETE FROM public.trips a
      USING public.trips b
      WHERE a.user_id   = b.user_id
        AND a.trip_uid  = b.trip_uid
        AND a.ctid     <> b.ctid
        AND COALESCE(a.updated_at, a.created_at) < COALESCE(b.updated_at, b.created_at);
    END IF;

    ALTER TABLE public.trips
      ADD CONSTRAINT trips_user_trip_uid_unique UNIQUE (user_id, trip_uid);
  END IF;
END $$;

COMMENT ON CONSTRAINT trips_user_trip_uid_unique ON public.trips IS
  'Added 2026-05-15. Enables clients to use ON CONFLICT (user_id, trip_uid) DO UPDATE for true idempotent upsert. iOS tripsRepo.upsert may still use the try-update-then-insert pattern; both are safe against this constraint.';


-- ── 2. CHECK constraints — miles, type, deductible ───────────────────
-- Front-line validation. iOS + web both write only valid values today,
-- so these CHECKs catch future regressions, not current data.
DO $$
BEGIN
  -- miles >= 0. Defensive backfill: NULL out any pre-existing negatives
  -- (none expected) so the ALTER doesn't trip on legacy garbage.
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'trips_miles_nonneg' AND conrelid = 'public.trips'::regclass
  ) THEN
    UPDATE public.trips SET miles = NULL WHERE miles IS NOT NULL AND miles < 0;
    ALTER TABLE public.trips
      ADD CONSTRAINT trips_miles_nonneg
      CHECK (miles IS NULL OR miles >= 0);
  END IF;

  -- type allowlist: iOS short codes + legacy long-form + NULL = "needs review".
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'trips_type_known' AND conrelid = 'public.trips'::regclass
  ) THEN
    ALTER TABLE public.trips
      ADD CONSTRAINT trips_type_known
      CHECK (
        type IS NULL
        OR type IN ('biz', 'pers', 'med', 'char', 'uncl',
                    'business', 'personal', 'medical', 'charity', 'unclassified')
      );
  END IF;

  -- deductible numeric range. 20260506000000_deductible_numeric.sql
  -- already converted the column type; this constraint guarantees the
  -- numeric domain forward.
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'trips_deductible_sane' AND conrelid = 'public.trips'::regclass
  ) THEN
    ALTER TABLE public.trips
      ADD CONSTRAINT trips_deductible_sane
      CHECK (deductible IS NULL OR (deductible >= 0 AND deductible < 100000));
  END IF;
END $$;


-- ── 3. Composite indexes ──────────────────────────────────────────────
-- The hot query on every web dashboard + every iOS useTrips.refresh:
--
--   SELECT * FROM trips
--   WHERE user_id = $1 AND deleted_at IS NULL
--   ORDER BY trip_date DESC, trip_time DESC
--   LIMIT 500;
--
-- Partial index keeps the on-disk size small (deleted_at IS NULL is
-- ~98% of rows in practice). Skips a seq-scan + sort at any size and
-- avoids the perf cliff the assessment predicted at 5k+ DAU.
CREATE INDEX IF NOT EXISTS trips_user_active_chrono_idx
  ON public.trips (user_id, trip_date DESC, trip_time DESC)
  WHERE deleted_at IS NULL;

-- Recently Deleted panel (web loadDeletedTrips):
--   SELECT * FROM trips
--   WHERE user_id = $1 AND deleted_at IS NOT NULL AND deleted_at >= cutoff
--   ORDER BY deleted_at DESC;
CREATE INDEX IF NOT EXISTS trips_user_deleted_idx
  ON public.trips (user_id, deleted_at DESC)
  WHERE deleted_at IS NOT NULL;

-- Cell-aware sibling matching used by iOS bulk-apply (route_signatures
-- already has its own index; this complements it for raw-trip lookups).
CREATE INDEX IF NOT EXISTS trips_user_endpoint_idx
  ON public.trips (user_id, end_lat, end_lng)
  WHERE deleted_at IS NULL AND end_lat IS NOT NULL AND end_lng IS NOT NULL;


-- ── 4. Realtime publication membership ───────────────────────────────
-- The web app subscribes to postgres_changes on these tables. The
-- publication must include them or the channel emits no events.
-- Supabase Cloud usually pre-creates the publication; the membership
-- toggle lives in Dashboard → Database → Replication. Adding it here
-- via SQL is equivalent and idempotent.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime'
  ) THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'trips'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.trips;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'vehicles'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.vehicles;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'profiles'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
  END IF;
END $$;


-- ── 5. pg_cron schedule for delete-expired-accounts (idempotent) ────
-- 20260427_apple_maps_followups.sql:104-126 documents that this cron
-- was deployed out-of-band via dashboard. This block is a safety net:
-- if (and only if) no schedule with this name exists yet, register it.
-- If a schedule is already present, this is a no-op.
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

DO $$
DECLARE
  proj_ref text := COALESCE(
    current_setting('app.project_ref', true),
    'dxpuuiqibtizewbbffjk'
  );
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM cron.job WHERE jobname = 'delete-expired-accounts-daily'
  ) THEN
    PERFORM cron.schedule(
      'delete-expired-accounts-daily',
      '17 4 * * *',                                  -- daily 04:17 UTC
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
    RAISE NOTICE 'Scheduled delete-expired-accounts-daily (was missing)';
  ELSE
    RAISE NOTICE 'delete-expired-accounts-daily already scheduled — skipping';
  END IF;
END $$;

COMMIT;

-- =============================================================================
-- Post-apply verification queries
-- =============================================================================
--
-- 1. UNIQUE installed?
SELECT conname FROM pg_constraint
WHERE conrelid = 'public.trips'::regclass AND conname = 'trips_user_trip_uid_unique';

-- 2. CHECK constraints in place?
SELECT conname FROM pg_constraint
WHERE conrelid = 'public.trips'::regclass AND contype = 'c'
ORDER BY conname;

-- 3. Indexes + sizes.
SELECT indexname, pg_size_pretty(pg_relation_size(indexname::regclass)) AS size
FROM pg_indexes
WHERE schemaname = 'public' AND tablename = 'trips'
  AND indexname IN (
    'trips_user_active_chrono_idx',
    'trips_user_deleted_idx',
    'trips_user_endpoint_idx'
  )
ORDER BY indexname;

-- 4. Realtime publication membership.
SELECT schemaname, tablename FROM pg_publication_tables
WHERE pubname = 'supabase_realtime' AND schemaname = 'public'
  AND tablename IN ('trips', 'vehicles', 'profiles')
ORDER BY tablename;

-- 5. Cron schedule.
SELECT jobname, schedule, active FROM cron.job
WHERE jobname = 'delete-expired-accounts-daily';
-- =============================================================================

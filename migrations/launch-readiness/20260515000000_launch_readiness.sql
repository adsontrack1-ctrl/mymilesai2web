-- =============================================================================
-- MyMilesAI — Launch readiness migration (2026-05-15)
-- =============================================================================
--
-- Trimmed scope after live-DB inspection on 2026-05-15. The original
-- five-section plan from the production assessment proved over-broad:
-- three of the five items were already done or harmless to defer.
--
-- Already present in the live schema and intentionally NOT re-applied:
--   * `trips_trip_uid_unique` (globally unique on `trip_uid`) — present
--     since an earlier migration; iOS `tripsRepo.upsert`'s comment about
--     "can't guarantee UNIQUE" is stale but the code is harmless.
--   * `cron.job` entry `delete-expired-accounts-daily` — scheduled via
--     the Supabase Dashboard per the comment in
--     `20260427_apple_maps_followups.sql:104-126`.
--   * `subscriptions` UPDATE self-promote policy — closed by
--     `20260509000003_security_audit_hardening.sql`.
--   * `app_errors` admin email policy → `profiles.is_admin` — closed by
--     the same hardening migration.
--
-- This migration installs the three things that ARE still missing:
--   1. CHECK constraints on trips.miles, trips.type, trips.deductible
--      (front-line validation; live data is already clean).
--   2. Composite chronological indexes for the web dashboard / Recently
--      Deleted queries and the AI Layer-2 endpoint lookup.
--   3. Realtime publication membership for `vehicles` and `profiles`
--      (`trips` is already a member; the web Realtime channel needs all
--      three to fire cross-table events).
--
-- Apply order:
--   cp migrations/launch-readiness/20260515000000_launch_readiness.sql \
--      ~/MyMilesAi-2/supabase/migrations/
--   cd ~/MyMilesAi-2 && supabase db push
--
-- Every statement is idempotent (DO $$ + IF NOT EXISTS), so re-running
-- is safe.
-- =============================================================================

BEGIN;

-- ── 1. CHECK constraints — miles, type, deductible ───────────────────
-- Live data validated 2026-05-15: 0 negative miles, 0 unknown types,
-- 0 out-of-range deductibles. Installing these CHECKs catches future
-- regressions without rejecting any current row.
DO $$
BEGIN
  -- miles >= 0.
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'trips_miles_nonneg' AND conrelid = 'public.trips'::regclass
  ) THEN
    ALTER TABLE public.trips
      ADD CONSTRAINT trips_miles_nonneg
      CHECK (miles IS NULL OR miles >= 0);
  END IF;

  -- type allowlist: iOS short codes + legacy long-form + NULL.
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

  -- deductible numeric range. `20260506000000_deductible_numeric.sql`
  -- already converted the column type; this constraint locks the
  -- domain forward (0 ≤ deductible < 100_000).
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'trips_deductible_sane' AND conrelid = 'public.trips'::regclass
  ) THEN
    ALTER TABLE public.trips
      ADD CONSTRAINT trips_deductible_sane
      CHECK (deductible IS NULL OR (deductible >= 0 AND deductible < 100000));
  END IF;
END $$;


-- ── 2. Composite chronological indexes ───────────────────────────────
-- At 475 rows today these are no-ops at runtime (Postgres seq-scans).
-- They start mattering at ~10k trips per user; installing them now
-- means no perf cliff to manage later.
--
-- (a) The dashboard YTD query (web `loadTripsYtd`, iOS `useTrips.refresh`):
--     SELECT * FROM trips
--     WHERE user_id = $1 AND deleted_at IS NULL
--     ORDER BY trip_date DESC, trip_time DESC
--     LIMIT 500;
-- Partial WHERE keeps the on-disk size small (deleted rows are ~17% in
-- practice — 80/475 in current DB).
CREATE INDEX IF NOT EXISTS trips_user_active_chrono_idx
  ON public.trips (user_id, trip_date DESC, trip_time DESC)
  WHERE deleted_at IS NULL;

-- (b) Recently Deleted panel (web `loadDeletedTrips`):
--     SELECT * FROM trips
--     WHERE user_id = $1 AND deleted_at IS NOT NULL AND deleted_at >= cutoff
--     ORDER BY deleted_at DESC;
CREATE INDEX IF NOT EXISTS trips_user_deleted_idx
  ON public.trips (user_id, deleted_at DESC)
  WHERE deleted_at IS NOT NULL;

-- (c) Endpoint lookup for AI Layer-2 sibling matching in bulk-apply.
-- Complements the existing `trips_user_id_start_idx` (origin) with an
-- equivalent for destinations.
CREATE INDEX IF NOT EXISTS trips_user_endpoint_idx
  ON public.trips (user_id, end_lat, end_lng)
  WHERE deleted_at IS NULL AND end_lat IS NOT NULL AND end_lng IS NOT NULL;


-- ── 3. Realtime publication — vehicles + profiles ────────────────────
-- `trips` is already a member of `supabase_realtime` (added via the
-- Dashboard). Web `wireRealtime` also subscribes to vehicles and
-- profiles; without membership those subscriptions succeed silently
-- but emit no events. Adding both via SQL is equivalent to flipping
-- the Database → Replication toggle in the Dashboard.
DO $$
BEGIN
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

COMMIT;

-- =============================================================================
-- Post-apply verification
-- =============================================================================
--
-- 1. CHECK constraints landed.
SELECT conname, pg_get_constraintdef(oid) AS def
FROM pg_constraint
WHERE conrelid = 'public.trips'::regclass
  AND conname IN ('trips_miles_nonneg', 'trips_type_known', 'trips_deductible_sane')
ORDER BY conname;

-- 2. Indexes landed (sizes small for now; will grow with the table).
SELECT indexname, pg_size_pretty(pg_relation_size(indexname::regclass)) AS size
FROM pg_indexes
WHERE schemaname = 'public' AND tablename = 'trips'
  AND indexname IN (
    'trips_user_active_chrono_idx',
    'trips_user_deleted_idx',
    'trips_user_endpoint_idx'
  )
ORDER BY indexname;

-- 3. Realtime publication now covers all three tables.
SELECT schemaname, tablename
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime' AND schemaname = 'public'
  AND tablename IN ('trips', 'vehicles', 'profiles')
ORDER BY tablename;
-- Expected: three rows — profiles, trips, vehicles.
-- =============================================================================

-- =============================================================================
-- 00_report_trip_uid_duplicates.sql — READ-ONLY DIAGNOSTIC
-- =============================================================================
--
-- Run this in the Supabase SQL Editor BEFORE applying the launch_readiness
-- migration. It does not modify any data. It tells you whether any users
-- currently have duplicate `trip_uid` rows so you can decide what to do
-- before adding the UNIQUE constraint.
--
-- The launch_readiness migration's UNIQUE on (user_id, trip_uid) will
-- ABORT loudly if any duplicates exist. This report lets you eyeball
-- the count first and choose whether to clean them up manually
-- (preserving the rows you want to keep) or let the migration delete
-- the older copies for you (toggle in the migration file).
-- =============================================================================

-- ── 1. Total duplicate count, per user ───────────────────────────────
-- A user with N duplicate trip_uids contributes (N - 1) extra rows.
-- "Affected users" is the headline number; the per-user breakdown
-- below tells you whether dupes are concentrated (one user with many)
-- or spread out (many users with one each).
WITH dupes AS (
  SELECT user_id, trip_uid, COUNT(*) AS copies
  FROM public.trips
  GROUP BY user_id, trip_uid
  HAVING COUNT(*) > 1
)
SELECT
  COUNT(*)                                    AS duplicate_pairs,
  COUNT(DISTINCT user_id)                     AS affected_users,
  COALESCE(SUM(copies - 1), 0)                AS extra_rows_to_remove
FROM dupes;

-- ── 2. Per-user breakdown (top 20 most-affected users) ──────────────
SELECT
  user_id,
  COUNT(*)            AS duplicate_trip_uids,
  SUM(copies - 1)     AS extra_rows
FROM (
  SELECT user_id, trip_uid, COUNT(*) AS copies
  FROM public.trips
  GROUP BY user_id, trip_uid
  HAVING COUNT(*) > 1
) d
GROUP BY user_id
ORDER BY extra_rows DESC
LIMIT 20;

-- ── 3. Sample dupes for inspection (up to 20 trip_uids) ─────────────
-- Shows actual rows so you can spot-check: are these obviously bogus
-- retries (same created_at within seconds), or genuinely two saves
-- minutes apart that might represent real different ingestion paths?
SELECT
  user_id,
  trip_uid,
  id,
  trip_date,
  trip_time,
  miles,
  type,
  from_addr,
  to_addr,
  source,
  created_at,
  updated_at,
  deleted_at
FROM public.trips
WHERE (user_id, trip_uid) IN (
  SELECT user_id, trip_uid
  FROM public.trips
  GROUP BY user_id, trip_uid
  HAVING COUNT(*) > 1
  LIMIT 20
)
ORDER BY user_id, trip_uid, created_at;

-- ── 4. Age distribution — when did the dupes arrive? ────────────────
-- If they're all clustered in a single week, you probably have a
-- specific outbox/retry bug to investigate before adding UNIQUE.
-- If they're spread evenly, it's been a chronic low-rate issue.
SELECT
  DATE_TRUNC('week', created_at)::date AS week,
  COUNT(*)                              AS duplicate_rows
FROM public.trips
WHERE (user_id, trip_uid) IN (
  SELECT user_id, trip_uid
  FROM public.trips
  GROUP BY user_id, trip_uid
  HAVING COUNT(*) > 1
)
GROUP BY 1
ORDER BY 1 DESC
LIMIT 12;

-- =============================================================================
-- DECISION GUIDE
-- =============================================================================
-- Result of query #1                              → Next step
-- -----------------------------------------------------------------------------
-- duplicate_pairs = 0                             → Apply launch_readiness
--                                                   migration as-is (DESTRUCTIVE
--                                                   = false). UNIQUE will install
--                                                   cleanly.
--
-- duplicate_pairs > 0 AND obvious retries         → Apply launch_readiness
-- (same created_at within seconds in query #3)      migration with DESTRUCTIVE
--                                                   = true. It will keep the most
--                                                   recently updated row of each
--                                                   pair and delete the rest.
--
-- duplicate_pairs > 0 AND ambiguous (sample        → DO NOT toggle DESTRUCTIVE.
-- rows look semantically different)                 Clean up by hand — write a
--                                                   targeted DELETE per case —
--                                                   then re-run this report
--                                                   until query #1 = 0, then
--                                                   apply launch_readiness with
--                                                   DESTRUCTIVE = false.
-- =============================================================================

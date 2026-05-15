# iOS follow-up — `tripsRepo.upsert` tidy-up

> **Scope:** one optional, ~5-minute code cleanup in
> `~/MyMilesAi-2/src/lib/repos/trips.ts`, lines 246-272.
>
> **Locked-zone status:** this file is part of the **locked
> trip-saving zone**. Do **not** apply without explicit sign-off
> from the locked-zone owner (you). The change is behaviour-preserving
> (covered below), but the rule is the rule.
>
> **Blocking?** No. The current code keeps working forever against
> the live schema. This is housekeeping, not a fix.

---

## Why

The backend migration we just applied confirmed that
`trips_trip_uid_unique` exists on the live DB (globally unique on
`trip_uid`). The existing iOS comment at lines 249-254 says the
opposite:

```
// Try-update-then-insert. Avoids supabase-js's `.upsert(..., { onConflict })`
// path — that requires the conflict column to have a UNIQUE/PK constraint,
// which we can't guarantee for `trip_uid` in the live schema. Without
// that constraint, the v2 default upsert tries to INSERT every time
// (silent duplicates) or throws, depending on what other constraints
// exist. The two-step works regardless of schema state.
```

That guarantee now holds. Future readers will trust this comment
and design around an assumption that's wrong. Two clean-ups are
available, smallest to largest:

---

## Option A (minimum, ~30 seconds) — fix the comment, keep the code

Behaviour unchanged. Just update the comment so it doesn't lie.

**Before** (`src/lib/repos/trips.ts:246-272`):

```ts
  async upsert(trip: Trip, userId: string): Promise<Trip> {
    if (!supabase) return trip;
    const row = toDb(trip, userId);
    // Try-update-then-insert. Avoids supabase-js's `.upsert(..., { onConflict })`
    // path — that requires the conflict column to have a UNIQUE/PK constraint,
    // which we can't guarantee for `trip_uid` in the live schema. Without
    // that constraint, the v2 default upsert tries to INSERT every time
    // (silent duplicates) or throws, depending on what other constraints
    // exist. The two-step works regardless of schema state.
    const { data: updated, error: updErr } = await supabase
      .from('trips')
      .update(row)
      .eq('trip_uid', trip.tripUid)
      .select()
      .maybeSingle();
    if (updErr) throw updErr;
    if (updated) return fromDb(updated as DbTrip);

    // No existing row matched — fresh trip → insert.
    const { data: inserted, error: insErr } = await supabase
      .from('trips')
      .insert(row)
      .select()
      .single();
    if (insErr) throw insErr;
    return fromDb(inserted as DbTrip);
  },
```

**After**:

```ts
  async upsert(trip: Trip, userId: string): Promise<Trip> {
    if (!supabase) return trip;
    const row = toDb(trip, userId);
    // Two-step update-then-insert. The live schema now has
    // `trips_trip_uid_unique` (single-column UNIQUE on trip_uid),
    // so a one-shot `.upsert(row, { onConflict: 'trip_uid' })` is
    // equivalent and one fewer round trip. Kept as-is for now
    // because the two-step is also safe under arbitrary RLS shapes
    // and gives us a clean "updated vs inserted" branch if we ever
    // want to log either side separately.
    const { data: updated, error: updErr } = await supabase
      .from('trips')
      .update(row)
      .eq('trip_uid', trip.tripUid)
      .select()
      .maybeSingle();
    if (updErr) throw updErr;
    if (updated) return fromDb(updated as DbTrip);

    // No existing row matched — fresh trip → insert.
    const { data: inserted, error: insErr } = await supabase
      .from('trips')
      .insert(row)
      .select()
      .single();
    if (insErr) throw insErr;
    return fromDb(inserted as DbTrip);
  },
```

**Risk:** zero. No runtime behaviour change.

**Verification:** none required beyond `npm run preflight` passing.

---

## Option B (full collapse, ~5 minutes) — single round trip

One write instead of two. Saves ~1 RTT per trip save (~50-150 ms
on cellular). Matches the pattern the web app now uses in
`app.js openLogTripModal` after the migration landed.

**Before:** same as Option A's "before."

**After**:

```ts
  async upsert(trip: Trip, userId: string): Promise<Trip> {
    if (!supabase) return trip;
    const row = toDb(trip, userId);
    // Idempotent upsert keyed on the live `trips_trip_uid_unique`
    // constraint (single-column UNIQUE on trip_uid). A retry, a
    // foreground/outbox race, or a duplicate save with the same
    // tripUid is a no-op update rather than a duplicate row.
    const { data, error } = await supabase
      .from('trips')
      .upsert(row, { onConflict: 'trip_uid', ignoreDuplicates: false })
      .select()
      .single();
    if (error) throw error;
    return fromDb(data as DbTrip);
  },
```

**Risk** — three things to know:

1. **Conflict-column shape must match the live constraint exactly.**
   The constraint is `trips_trip_uid_unique` on `trip_uid` (single
   column). `onConflict: 'trip_uid'` is correct. Do not write
   `'user_id,trip_uid'` — Postgres will throw `42P10: there is no
   unique or exclusion constraint matching the ON CONFLICT
   specification`.

2. **RLS posture.** `.upsert()` is internally an `INSERT … ON
   CONFLICT … DO UPDATE`. For the UPDATE half to apply, the row
   must already be visible to the caller under SELECT RLS. The
   existing trips RLS policies allow the owner to SELECT/UPDATE
   their own rows, so this is fine for normal user writes. Worth
   re-checking if you ever add a "shared trip" feature.

3. **CHECK constraints can now reject writes.** The migration
   added `trips_miles_nonneg`, `trips_type_known`, and
   `trips_deductible_sane`. Live data is clean today (verified
   pre-apply: 0 violations across 475 trips), so `toDb` outputs
   nothing that violates them. If `toDb` ever changes to emit a
   negative `miles` or a new `type` enum value, the upsert will
   throw with a `23514` SQL state. Surface it distinctly from
   network / RLS errors in any future error UI.

**Verification:**

- `npm run preflight` clean.
- Manual save a trip end-to-end on TestFlight, confirm the row
  lands.
- Force a retry: airplane mode → save → restore network → confirm
  the second attempt updates rather than inserts a duplicate.
  Query `select count(*) from trips where trip_uid = '<the uid>'`
  in the SQL editor — must return 1.
- Verify `pending` set in `useTrips` clears as before.

---

## Recommendation

**Option A.** It removes the misleading comment without changing
the save path. The save path is the most-trafficked + highest-
consequence iOS code; collapsing it for one RTT of latency isn't
worth re-validating under every edge case (replay, outbox drain,
two-device race, RLS edge) on a launch-week change.

Revisit Option B in a quieter sprint after launch, when the engine
has weeks of telemetry showing the upsert path is stable, and
TestFlight has phased-rollout coverage for the new shape.

---

## Pull the migration into the iOS repo

Independent of which option you pick, copy the SQL file into the
canonical migrations directory so a future `supabase db reset`
doesn't lose it:

```bash
cp ~/Code/mymilesai2web/migrations/launch-readiness/20260515000000_launch_readiness.sql \
   ~/MyMilesAi-2/supabase/migrations/

cd ~/MyMilesAi-2 && git add supabase/migrations/20260515000000_launch_readiness.sql
git commit -m "supabase: trim launch-readiness migration (CHECKs + indexes + realtime)"
```

The migration is already applied on the live DB (verified during
this session — see the README in this folder). The commit is just
to keep the migrations directory in sync with reality.

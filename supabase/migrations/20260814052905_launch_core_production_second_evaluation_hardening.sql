-- 20260814052905 · WO-LAUNCH-CORE-04 second fresh-evaluator pass: 2
-- findings.
-- Corrective, additive-only migration over
-- 20260814051819_launch_core_production_artifact_canonical_identity. Does
-- not reset or drop the production schema; does not edit any previously
-- applied migration file.
--
-- FINDING A (high confidence, deterministic — not a race) — the previous
-- migration's Artifact canonical-identity index folded product_version_id
-- into the uniqueness key alongside journey_anchor_id. But
-- validate_artifact_scope() only cross-checks a Journey's own pinned
-- Version against the Artifact's claimed Version when BOTH sides are
-- non-null. That let two ordinary, non-adversarial, sequential inserts —
-- (person, product, NULL version, journey J) then
-- (person, product, V1, journey J), same real Journey J both times —
-- collide on two DIFFERENT index keys (sentinel vs V1) and both succeed,
-- reproducing the exact "two canonical Artifacts for one logical target"
-- outcome the previous migration's own comment says it prevents.
--
-- ROOT CAUSE, not a narrow patch: Product Version should never have been
-- part of an Artifact's OWN identity in the first place. When a Journey
-- exists, it is the correct sole identity anchor — the Journey's own
-- pinned Version (if any) is the authoritative version context, and an
-- Artifact re-asserting its own possibly-absent version claim as part of
-- ITS identity is exactly what created the gap. Product Version remains a
-- coherence-checked, informational field on artifacts (unchanged,
-- validate_artifact_scope still requires it agree with the Journey's
-- pinned Version when both are supplied) — it is simply no longer part
-- of what makes two Artifacts "the same logical thing". The corrected
-- identity is (Person, Product, Journey) — with "no Journey" itself being
-- one single collapsed scope per Person/Product (not further split by
-- Version), matching the WO's own framing that ONE Artifact accumulates
-- multiple Versions over time, potentially against different Product
-- Versions as the underlying template evolves.
--
-- FINDING B (reasoned from standard Postgres MVCC/locking semantics) —
-- validate_job_attempt_creation()'s terminal-Job check was still a plain,
-- non-locking SELECT, unlike its two sibling checks (one-running,
-- one-succeeded) which were explicitly given atomic partial-unique-index
-- backstops in migrations 2 and 3 for exactly this reason. Under
-- READ COMMITTED, a concurrent UPDATE cancelling the Job (uncommitted at
-- the moment of the SELECT) is invisible to this check, and the
-- FK-required row lock (FOR KEY SHARE) does not conflict with that
-- concurrent UPDATE — the check can pass, an Attempt can be inserted as
-- running, and only afterward does the cascade's own locking UPDATE
-- observe the now-committed cancellation and silently no-op (WHERE
-- status = 'pending' matches 0 rows) rather than raise — leaving a stray
-- running Attempt permanently attached to a terminal Job. This cannot
-- fabricate a false success (the existing terminal seal still blocks that
-- attempt from ever reaching succeeded), but it is a genuine breach of
-- the named, repeated "must not be creatable on an already-terminal Job"
-- invariant. FIX: SELECT ... FOR UPDATE on the Job row, the same
-- explicit-locking technique already reasoned through and accepted for
-- this schema's design — this row lock is acquired before the Attempt's
-- own INSERT proceeds, is reused (not reacquired) by the same
-- transaction's later AFTER-trigger cascade, and cannot deadlock against
-- a concurrent explicit Job-status UPDATE, which simply blocks on this
-- lock until the Attempt-creation transaction finishes.

-- =========================================================================
-- FINDING A
-- =========================================================================

drop index if exists production.artifacts_unique_canonical_scope_idx;

create unique index artifacts_unique_canonical_scope_idx
  on production.artifacts (
    person_id,
    product_id,
    coalesce(journey_anchor_id, '00000000-0000-0000-0000-000000000000'::uuid)
  );

comment on index production.artifacts_unique_canonical_scope_idx is
  'Artifact canonical identity: at most one Artifact may exist per (Person, Product, Journey Anchor) scope — including "no Journey", one single collapsed scope per Person/Product, not further split by Version (null Journey coalesced to a fixed sentinel so unscoped rows still collide with each other). Product Version deliberately does NOT participate in identity: when a Journey exists, its own pinned Version (if any) is the authoritative version context; when there is no Journey, Version does not meaningfully distinguish two "different" logical targets — a later production run against an updated Product Version is a new Artifact Version of the SAME Artifact, not a new Artifact.';

-- =========================================================================
-- FINDING B
-- =========================================================================

create or replace function production.validate_job_attempt_creation()
returns trigger
language plpgsql
set search_path = pg_catalog, production
as $$
declare
  v_job_status text;
  v_already_succeeded boolean;
begin
  if NEW.status is distinct from 'running' then
    raise exception 'JOB_ATTEMPT_MUST_START_RUNNING';
  end if;

  -- FOR UPDATE: locks the Job row before this Attempt is allowed to
  -- proceed, closing the time-of-check-to-time-of-use race a plain
  -- SELECT would leave open against a concurrent Job status change.
  select status into v_job_status from production.jobs where id = NEW.job_id for update;
  if v_job_status is null then
    raise exception 'JOB_ATTEMPT_JOB_NOT_FOUND';
  end if;
  if v_job_status in ('succeeded', 'failed', 'cancelled') then
    raise exception 'JOB_ATTEMPT_CANNOT_START_ON_TERMINAL_JOB';
  end if;

  select exists (
    select 1 from production.job_attempts where job_id = NEW.job_id and status = 'succeeded'
  ) into v_already_succeeded;
  if v_already_succeeded then
    raise exception 'JOB_ATTEMPT_CANNOT_START_AFTER_SUCCESS';
  end if;

  return NEW;
end;
$$;

comment on function production.validate_job_attempt_creation() is
  'A new Attempt must start running, must not be creatable on an already-terminal Job, and must not be creatable once any Attempt of the same Job has already succeeded. The terminal-Job check now takes an explicit row lock (FOR UPDATE) on the Job before proceeding, closing a time-of-check-to-time-of-use race a plain SELECT left open against a concurrent Job status change — the same explicit-locking technique already used for this schema''s cross-table checks, applied consistently to this one too.';

-- 20260814050321 · WO-LAUNCH-CORE-04 architecture integrity hardening:
-- P07 independent review — 4 named outcomes, all closed at their common
-- root cause.
-- Corrective, additive-only migration over
-- 20260814035522_launch_core_production_job_attempt_creation_guard. Does
-- not reset or drop the production schema; does not edit any previously
-- applied migration file.
--
-- P07's four findings are one architecture problem: individually valid
-- rows/checks that never closed every relational triangle between Job,
-- Attempt, Artifact, and their originating context. Each fix below closes
-- exactly one missing edge in that graph — none is a narrow patch of the
-- one reproduced example.
--
-- OUTCOME A — JOB <-> ATTEMPT AGGREGATE COHERENCE. reject_job_rewrite()
-- already required a successful Attempt before Job could read succeeded,
-- but never checked the REVERSE direction — nothing stopped a Job from
-- being explicitly marked failed/cancelled even after an Attempt had
-- already succeeded. Rather than add a second manual check (which would
-- need explicit row locking on both sides to be race-safe, risking
-- deadlock), Job.status is now made to AUTOMATICALLY track Attempt
-- progress within the SAME transaction as the Attempt change:
--   - a new Attempt being created cascades the Job pending -> running;
--   - an Attempt reaching succeeded cascades the Job running -> succeeded.
-- Once cascaded, the Job's PRE-EXISTING terminal seal
-- (JOB_TERMINAL_STATUS_IMMUTABLE, unchanged, already applied) makes any
-- later contradictory transition — in EITHER direction — structurally
-- impossible: a late "mark Job failed" after a real success sees
-- OLD.status = 'succeeded' and is rejected by the existing seal; an
-- attempt trying to succeed after the Job was already explicitly failed
-- causes its own cascade UPDATE to hit the same existing seal, aborting
-- the WHOLE transaction (the Attempt's own success included) — no new
-- locking, no deadlock risk, and no new failure mode to explain.
--
-- OUTCOME B — ARTIFACT REQUIRES A VALID PRODUCTION ORIGIN.
-- validate_artifact_version_scope() never checked the referenced Job
-- Attempt's own status at all — an Artifact Version could be registered
-- citing a failed or still-running Attempt as its origin. A valid
-- production origin is now defined precisely as: the cited Attempt's
-- status must be 'succeeded'. Provider callback existing (an Attempt row
-- existing) is explicitly NOT equated with valid production success —
-- only the Attempt's own already-governed succeeded state is.
--
-- OUTCOME C — ARTIFACT <-> JOB/JOURNEY LINEAGE CLOSURE.
-- validate_artifact_version_scope() closed Person/Product/Version between
-- the Artifact and its originating Job, but never closed the Journey
-- dimension — the exact missing edge P07 reproduced (Artifact scoped to
-- Journey A, originating Job scoped to Journey B, both individually valid
-- Person/Product/Version). Extended with the same optional-both-sides
-- coherence rule already used for Version.
--
-- OUTCOME D — OUTPUT REGISTRATION IS REPLAY-SAFE. The logical identity of
-- "this produced output registration" is the (Artifact, Attempt) pair — a
-- single Attempt registering output for a single Artifact is one logical
-- event. A new unique constraint on (artifact_id, job_attempt_id) makes a
-- replayed registration request hit unique_violation instead of silently
-- minting a second canonical Artifact Version under a different
-- version_number. Deliberately scoped narrower than a bare
-- unique(job_attempt_id) — a single Attempt legitimately producing
-- multiple DIFFERENT Artifacts (e.g. a document and a media file from one
-- execution) remains possible; only re-registering the SAME
-- (Artifact, Attempt) pair is blocked.

-- =========================================================================
-- OUTCOME A
-- =========================================================================

create or replace function production.cascade_job_running_from_attempt()
returns trigger
language plpgsql
set search_path = pg_catalog, production
as $$
begin
  update production.jobs set status = 'running' where id = NEW.job_id and status = 'pending';
  return NEW;
end;
$$;

comment on function production.cascade_job_running_from_attempt() is
  'Job.status auto-tracks Attempt progress: the first Attempt of a Job cascades it pending -> running in the same transaction, removing the need for a separate explicit app step (and the divergence window that step could create).';

revoke all on function production.cascade_job_running_from_attempt() from public, anon, authenticated;

create trigger production_job_attempts_cascade_running
  after insert on production.job_attempts
  for each row execute function production.cascade_job_running_from_attempt();

create or replace function production.cascade_job_succeeded_from_attempt()
returns trigger
language plpgsql
set search_path = pg_catalog, production
as $$
begin
  if NEW.status = 'succeeded' and OLD.status is distinct from 'succeeded' then
    update production.jobs set status = 'succeeded' where id = NEW.job_id and status <> 'succeeded';
  end if;
  return NEW;
end;
$$;

comment on function production.cascade_job_succeeded_from_attempt() is
  'Job.status auto-tracks Attempt progress: a real Attempt success cascades the Job to succeeded within the SAME transaction. Combined with the pre-existing terminal-status seal on production.jobs, this makes Job/Attempt divergence structurally impossible in both directions — a Job already sealed failed/cancelled causes this cascade UPDATE to hit that existing seal and abort the whole transaction (the Attempt success included); a Job already sealed succeeded makes this cascade a harmless no-op (WHERE status <> succeeded).';

revoke all on function production.cascade_job_succeeded_from_attempt() from public, anon, authenticated;

create trigger production_job_attempts_cascade_succeeded
  after update on production.job_attempts
  for each row execute function production.cascade_job_succeeded_from_attempt();

-- =========================================================================
-- OUTCOME B + C — both live in the same validation function.
-- =========================================================================

create or replace function production.validate_artifact_version_scope()
returns trigger
language plpgsql
set search_path = pg_catalog, production
as $$
declare
  v_artifact_person uuid;
  v_artifact_product uuid;
  v_artifact_version uuid;
  v_artifact_journey uuid;
  v_job_person uuid;
  v_job_product uuid;
  v_job_version uuid;
  v_job_journey uuid;
  v_attempt_status text;
begin
  select person_id, product_id, product_version_id, journey_anchor_id
    into v_artifact_person, v_artifact_product, v_artifact_version, v_artifact_journey
  from production.artifacts where id = NEW.artifact_id;
  if v_artifact_person is null then
    raise exception 'ARTIFACT_VERSION_ARTIFACT_NOT_FOUND';
  end if;

  select person_id, product_id, product_version_id, journey_anchor_id
    into v_job_person, v_job_product, v_job_version, v_job_journey
  from production.jobs where id = NEW.job_id;
  if v_job_person is null then
    raise exception 'ARTIFACT_VERSION_JOB_NOT_FOUND';
  end if;

  if v_job_person is distinct from v_artifact_person or v_job_product is distinct from v_artifact_product then
    raise exception 'ARTIFACT_VERSION_JOB_SCOPE_MISMATCH';
  end if;

  if v_job_version is not null
     and v_artifact_version is not null
     and v_job_version is distinct from v_artifact_version then
    raise exception 'ARTIFACT_VERSION_JOB_VERSION_MISMATCH';
  end if;

  -- Outcome C: the missing edge — Journey coherence between the Artifact
  -- and the Job that produced this Version.
  if v_job_journey is not null
     and v_artifact_journey is not null
     and v_job_journey is distinct from v_artifact_journey then
    raise exception 'ARTIFACT_VERSION_JOB_JOURNEY_MISMATCH';
  end if;

  -- Outcome B: a valid production origin requires the cited Attempt to
  -- have genuinely succeeded — a provider callback existing (a row
  -- existing at all) is not equated with production success.
  select status into v_attempt_status from production.job_attempts where id = NEW.job_attempt_id;
  if v_attempt_status is null then
    raise exception 'ARTIFACT_VERSION_ATTEMPT_NOT_FOUND';
  end if;
  if v_attempt_status is distinct from 'succeeded' then
    raise exception 'ARTIFACT_VERSION_REQUIRES_SUCCESSFUL_ATTEMPT';
  end if;

  return NEW;
end;
$$;

comment on function production.validate_artifact_version_scope() is
  'Provenance coherence at insert time, closing every relational edge between an Artifact Version, its Artifact, and its originating Job/Attempt: Person/Product must match; any Version claimed on both sides must agree; any Journey claimed on both sides must agree (the edge P07 found missing); and the cited Job Attempt must have genuinely reached succeeded — a valid production origin, not merely a callback/row existing.';

-- =========================================================================
-- OUTCOME D
-- =========================================================================

alter table production.artifact_versions
  add constraint artifact_versions_unique_artifact_attempt unique (artifact_id, job_attempt_id);

comment on constraint artifact_versions_unique_artifact_attempt on production.artifact_versions is
  'The logical identity of "register this produced output" is the (Artifact, Attempt) pair. Replaying the same registration request hits unique_violation instead of minting a second canonical Version under a different version_number. Scoped to (artifact_id, job_attempt_id) rather than job_attempt_id alone — a single Attempt legitimately producing multiple DIFFERENT Artifacts remains possible.';

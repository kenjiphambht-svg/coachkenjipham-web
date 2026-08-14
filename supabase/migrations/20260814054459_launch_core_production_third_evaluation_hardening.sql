-- 20260814054459 · WO-LAUNCH-CORE-04 third fresh-evaluator pass: 2
-- findings.
-- Corrective, additive-only migration over
-- 20260814052905_launch_core_production_second_evaluation_hardening.
-- Does not reset or drop the production schema; does not edit any
-- previously applied migration file.
--
-- FINDING 1 (confirmed by live execution) — validate_artifact_version_scope()'s
-- Journey check only fires when BOTH the Artifact and the originating Job
-- supply a Journey. Since 20260814052905 made Journey the Artifact's SOLE
-- identity anchor, that symmetric-optional pattern (correct for the now
-- purely-informational Version field) left an omission bypass open: a Job
-- that simply leaves journey_anchor_id NULL sails straight through,
-- letting a Journey-scoped Artifact register a Version whose origin has
-- zero verified connection to that Journey. Same bug class as the
-- disagreement case already closed in 20260814050321 — this is the
-- omission variant of the same gap. FIX: when the Artifact itself claims
-- a Journey, the originating Job's Journey must equal it — no longer
-- optional on the Job side. When the Artifact has no Journey (unscoped),
-- no Journey constraint is imposed on the Job (unchanged).
--
-- FINDING 2 (reasoned from Postgres MVCC/locking semantics, not executed
-- under true two-session concurrency) — the FOR UPDATE lock added in
-- 20260814052905 to close a TOCTOU race introduced a NEW lock-order
-- inversion: creating a new Attempt now locks the Job row BEFORE the
-- Attempt row's own unique-index checks resolve, while marking an
-- existing Attempt succeeded locks the Attempt row first and only reaches
-- the Job row afterward (via the cascade trigger). Two transactions
-- taking these paths on the same Job/Attempt pair concurrently — a
-- worker reporting success while a caller starts a retry for the same
-- Job — can form a genuine wait cycle (creation waits on the succeeding
-- transaction's uncommitted index entry; the succeeding transaction's
-- cascade waits on the Job row lock creation already holds), which
-- Postgres's deadlock detector would resolve by aborting one side. FIX:
-- move validate_job_attempt_creation() from BEFORE INSERT to AFTER
-- INSERT. This lets the Attempt row's own unique-index contention resolve
-- FIRST (the same wait that already existed before the FOR UPDATE fix,
-- and was never itself the problem), and only afterward does this
-- function acquire the Job row lock — by which point nothing this
-- transaction might be waiting on could also be waiting on it. The
-- original TOCTOU gap remains closed (a concurrent Job cancellation,
-- whether it commits before or during this transaction's checks, is
-- still correctly observed via the same FOR UPDATE lock), just without
-- reintroducing a cross-transaction wait cycle.

-- =========================================================================
-- FINDING 1
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

  -- Finding 1: Journey is the Artifact's SOLE identity anchor (since
  -- 20260814052905) — when the Artifact claims one, the originating Job
  -- MUST also claim the exact same one. Omitting it on the Job side is no
  -- longer treated as "nothing to compare" — it is treated as a mismatch,
  -- since v_job_journey is distinct from v_artifact_journey is true when
  -- v_job_journey is null and v_artifact_journey is not. When the
  -- Artifact itself has no Journey, no constraint is imposed on the Job.
  if v_artifact_journey is not null
     and v_job_journey is distinct from v_artifact_journey then
    raise exception 'ARTIFACT_VERSION_JOB_JOURNEY_MISMATCH';
  end if;

  -- Finding B (self-review): a valid production origin requires the cited
  -- Attempt to have genuinely succeeded.
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
  'Provenance coherence at insert time: Person/Product must match; any Version claimed on both sides must agree (Version is informational, not identity-defining, since the Artifact canonical-identity index dropped it); when the Artifact claims a Journey, the originating Job MUST claim the exact same one — Journey is the Artifact''s sole identity anchor, so omitting it on the Job side is a mismatch, not something to skip; and the cited Job Attempt must have genuinely reached succeeded.';

-- =========================================================================
-- FINDING 2
-- =========================================================================

drop trigger if exists production_job_attempts_validate_creation on production.job_attempts;

create trigger production_job_attempts_validate_creation
  after insert on production.job_attempts
  for each row execute function production.validate_job_attempt_creation();

comment on function production.validate_job_attempt_creation() is
  'A new Attempt must start running, must not be creatable on an already-terminal Job, and must not be creatable once any Attempt of the same Job has already succeeded. Fires AFTER INSERT (moved from BEFORE INSERT) so this function''s FOR UPDATE lock on the Job row is acquired only after the Attempt row''s own unique-index contention (job_attempts_one_running_per_job_idx / _one_succeeded_per_job_idx) has already resolved — avoiding a lock-order inversion against the AFTER-trigger cascade on a concurrent success (which locks the Attempt row first, then the Job row) that could otherwise deadlock. The TOCTOU protection this FOR UPDATE lock provides is unaffected by the timing change — a concurrent Job status change is still correctly observed before this Attempt is allowed to stand.';

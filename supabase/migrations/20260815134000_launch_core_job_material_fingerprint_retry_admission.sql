-- 20260815134000 · WO-P07-B5-BACKEND-FINGERPRINT-01
-- Canonical Job material fingerprint + retry admission.
--
-- BOUNDED SCOPE:
--   * adds one canonical immutable material fingerprint to production.jobs;
--   * adds one non-canonical Attempt admission-evidence fingerprint used only
--     to prove a Retry is still the same material before the Attempt may stand;
--   * preserves every existing Job/Attempt/Artifact/ArtifactVersion identity,
--     one-running/one-success/terminal/replay/history guard unchanged.
--
-- LEGACY POLICY:
-- Existing Jobs are deliberately left NULL. There is NO backfill, inference,
-- or reuse of idempotency/audit/provider/failure/artifact-digest fields.
-- New Jobs must supply a structurally valid full SHA-256 fingerprint.
-- A Retry (attempt_number > 1) against a legacy NULL fingerprint fails closed.
--
-- RECOVERY POLICY:
-- This migration is additive. Once new-contract Jobs exist, provenance must
-- not be removed by a destructive rollback; forward recovery is required.
-- The paired down file therefore refuses to drop the new evidence whenever
-- any fingerprint evidence exists.

alter table production.jobs
  add column input_fingerprint text;

alter table production.jobs
  add constraint jobs_input_fingerprint_sha256
  check (input_fingerprint is null or input_fingerprint ~ '^[0-9a-f]{64}$');

comment on column production.jobs.input_fingerprint is
  'Canonical immutable material-input SHA-256 for this Production Job. NULL is permitted only to preserve pre-WO-P07-B5 legacy Jobs; every new Job is required by trigger to provide a lowercase 64-hex digest. It is not idempotency, provider, failure, audit, Artifact content, entitlement, publication, access, or delivery truth.';

alter table production.job_attempts
  add column admission_input_fingerprint text;

alter table production.job_attempts
  add constraint job_attempts_admission_input_fingerprint_sha256
  check (admission_input_fingerprint is null or admission_input_fingerprint ~ '^[0-9a-f]{64}$');

comment on column production.job_attempts.admission_input_fingerprint is
  'Non-canonical retry-admission evidence: the material SHA-256 proposed when admitting this Attempt. For attempt_number > 1 it must exactly equal the parent Job canonical input_fingerprint. It never defines Job identity and never replaces production.jobs.input_fingerprint.';

-- Every NEW Job must be born with canonical material evidence. Existing rows
-- remain NULL and historically intact because this is an INSERT-only guard,
-- not a NOT NULL rewrite/backfill.
create or replace function production.require_new_job_input_fingerprint()
returns trigger
language plpgsql
set search_path = pg_catalog, production
as $$
begin
  if NEW.input_fingerprint is null then
    raise exception 'JOB_INPUT_FINGERPRINT_REQUIRED';
  end if;
  return NEW;
end;
$$;

revoke all on function production.require_new_job_input_fingerprint() from public, anon, authenticated;

create trigger production_jobs_require_input_fingerprint
  before insert on production.jobs
  for each row execute function production.require_new_job_input_fingerprint();

-- Canonical Job fingerprint can never be written or filled in after creation,
-- including on a legacy NULL row. Any later backfill would require a separate
-- explicitly-authorized migration, never an application UPDATE.
create or replace function production.reject_job_input_fingerprint_rewrite()
returns trigger
language plpgsql
set search_path = pg_catalog, production
as $$
begin
  if NEW.input_fingerprint is distinct from OLD.input_fingerprint then
    raise exception 'JOB_INPUT_FINGERPRINT_IMMUTABLE';
  end if;
  return NEW;
end;
$$;

revoke all on function production.reject_job_input_fingerprint_rewrite() from public, anon, authenticated;

create trigger production_jobs_block_input_fingerprint_rewrite
  before update on production.jobs
  for each row execute function production.reject_job_input_fingerprint_rewrite();

-- Attempt admission evidence is immutable too: an admitted retry cannot later
-- be relabelled as having run against different material.
create or replace function production.reject_job_attempt_input_fingerprint_rewrite()
returns trigger
language plpgsql
set search_path = pg_catalog, production
as $$
begin
  if NEW.admission_input_fingerprint is distinct from OLD.admission_input_fingerprint then
    raise exception 'JOB_ATTEMPT_INPUT_FINGERPRINT_IMMUTABLE';
  end if;
  return NEW;
end;
$$;

revoke all on function production.reject_job_attempt_input_fingerprint_rewrite() from public, anon, authenticated;

create trigger production_job_attempts_block_input_fingerprint_rewrite
  before update on production.job_attempts
  for each row execute function production.reject_job_attempt_input_fingerprint_rewrite();

-- Retry-specific admission gate. This is deliberately a separate trigger so
-- the already-proven validate_job_attempt_creation(), one-running partial
-- unique index, one-success partial unique index, terminal seals, and cascade
-- functions remain byte-for-byte untouched.
--
-- The read here intentionally takes NO additional lock: Job fingerprint is
-- immutable, while concurrent Job-state races remain serialized/rechecked by
-- the existing AFTER INSERT validate_job_attempt_creation() guard. That avoids
-- introducing a new lock order or weakening the established race proof.
create or replace function production.validate_retry_input_fingerprint()
returns trigger
language plpgsql
set search_path = pg_catalog, production
as $$
declare
  v_job_status text;
  v_canonical_fingerprint text;
  v_already_succeeded boolean;
begin
  if NEW.attempt_number <= 1 then
    return NEW;
  end if;

  select status, input_fingerprint
    into v_job_status, v_canonical_fingerprint
  from production.jobs
  where id = NEW.job_id;

  -- Let the existing FK / canonical attempt-creation guard own not-found.
  if v_job_status is null then
    return NEW;
  end if;

  -- Preserve existing terminal/success authority and error semantics. The
  -- existing AFTER INSERT guard rechecks this state under its established
  -- row-lock strategy, closing any race after this non-locking read.
  if v_job_status in ('succeeded', 'failed', 'cancelled') then
    return NEW;
  end if;

  select exists (
    select 1
    from production.job_attempts
    where job_id = NEW.job_id and status = 'succeeded'
  ) into v_already_succeeded;

  if v_already_succeeded then
    return NEW;
  end if;

  if v_canonical_fingerprint is null then
    raise exception 'JOB_RETRY_CANONICAL_INPUT_FINGERPRINT_MISSING';
  end if;

  if NEW.admission_input_fingerprint is null then
    raise exception 'JOB_RETRY_INPUT_FINGERPRINT_REQUIRED';
  end if;

  if NEW.admission_input_fingerprint is distinct from v_canonical_fingerprint then
    raise exception 'JOB_RETRY_INPUT_FINGERPRINT_MISMATCH_REVISION_REQUIRED';
  end if;

  return NEW;
end;
$$;

revoke all on function production.validate_retry_input_fingerprint() from public, anon, authenticated;

create trigger production_job_attempts_validate_retry_input_fingerprint
  before insert on production.job_attempts
  for each row execute function production.validate_retry_input_fingerprint();

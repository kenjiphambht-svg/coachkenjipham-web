-- Scoped rollback for WO-P07-B5-BACKEND-FINGERPRINT-01.
--
-- SAFE ONLY BEFORE ADOPTION. Once any canonical Job fingerprint or Attempt
-- admission fingerprint exists, dropping these columns would silently destroy
-- provenance. In that state this rollback intentionally ABORTS and forward
-- recovery is required instead. No rows are rewritten, inferred, or backfilled.

DO $$
begin
  if exists (
    select 1 from production.jobs where input_fingerprint is not null
  ) or exists (
    select 1 from production.job_attempts where admission_input_fingerprint is not null
  ) then
    raise exception 'JOB_FINGERPRINT_ROLLBACK_REQUIRES_FORWARD_RECOVERY';
  end if;
end;
$$;

drop trigger if exists production_job_attempts_validate_retry_input_fingerprint on production.job_attempts;
drop trigger if exists production_job_attempts_block_input_fingerprint_rewrite on production.job_attempts;
drop trigger if exists production_jobs_block_input_fingerprint_rewrite on production.jobs;
drop trigger if exists production_jobs_require_input_fingerprint on production.jobs;

drop function if exists production.validate_retry_input_fingerprint();
drop function if exists production.reject_job_attempt_input_fingerprint_rewrite();
drop function if exists production.reject_job_input_fingerprint_rewrite();
drop function if exists production.require_new_job_input_fingerprint();

alter table production.job_attempts
  drop constraint if exists job_attempts_admission_input_fingerprint_sha256;
alter table production.job_attempts
  drop column if exists admission_input_fingerprint;

alter table production.jobs
  drop constraint if exists jobs_input_fingerprint_sha256;
alter table production.jobs
  drop column if exists input_fingerprint;

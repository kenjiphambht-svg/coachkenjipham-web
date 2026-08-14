-- Manual rollback for 20260815030000 · WO-LAUNCH-CORE-04 self-review
-- hardening: reject Attempt creation after a genuine success.
-- Restores validate_job_attempt_creation() to its exact pre-this-migration
-- body (no already-succeeded check). Does not touch identity, commerce,
-- entitlement, or knowledge, and does not drop the production schema.

create or replace function production.validate_job_attempt_creation()
returns trigger
language plpgsql
set search_path = pg_catalog, production
as $$
declare
  v_job_status text;
begin
  if NEW.status is distinct from 'running' then
    raise exception 'JOB_ATTEMPT_MUST_START_RUNNING';
  end if;
  select status into v_job_status from production.jobs where id = NEW.job_id;
  if v_job_status is null then
    raise exception 'JOB_ATTEMPT_JOB_NOT_FOUND';
  end if;
  if v_job_status in ('succeeded', 'failed', 'cancelled') then
    raise exception 'JOB_ATTEMPT_CANNOT_START_ON_TERMINAL_JOB';
  end if;
  return NEW;
end;
$$;

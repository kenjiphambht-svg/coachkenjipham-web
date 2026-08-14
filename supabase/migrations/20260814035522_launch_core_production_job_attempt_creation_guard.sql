-- 20260814035522 · WO-LAUNCH-CORE-04 self-review hardening: reject Attempt
-- creation after a genuine success, at creation time.
-- Corrective, additive-only migration over
-- 20260814035327_launch_core_production_job_single_success_guard. Does
-- not reset or drop the production schema; does not edit any previously
-- applied migration file.
--
-- GAP found by LIVE testing the previous migration (not by static
-- reasoning): the one-succeeded-Attempt-per-Job partial unique index
-- only fires when a row's OWN status transitions to 'succeeded' — it
-- does NOT fire when a NEW Attempt is inserted as 'running' (its default,
-- required starting status), even if a prior Attempt for the same Job
-- has already succeeded. That still allowed a second, pointless Attempt
-- to be created after a genuine success (it could never itself reach
-- 'succeeded' — the index still fully protects the core safety property
-- — but it could sit as a stray 'running' row that never resolves).
-- Extends validate_job_attempt_creation() with an explicit check so the
-- common case is rejected immediately, clearly, at creation time — the
-- unique index from the previous migration remains the true atomic
-- backstop for the actual safety property even under a race.

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
  select status into v_job_status from production.jobs where id = NEW.job_id;
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
  'A new Attempt must start running, must not be creatable on an already-terminal Job, and must not be creatable once any Attempt of the same Job has already succeeded — further production work after a genuine success is a new logical Job, not another Attempt of this one. This is a clear, early rejection for the common case; job_attempts_one_succeeded_per_job_idx remains the true atomic backstop for the underlying safety property even under a race between this check and a concurrent transaction.';

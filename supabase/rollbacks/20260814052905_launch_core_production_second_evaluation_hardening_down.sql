-- Manual rollback for 20260816020000 · WO-LAUNCH-CORE-04 second
-- fresh-evaluator pass.
-- Restores the Artifact canonical-identity index to its exact
-- previous-migration form (person, product, version, journey) and
-- validate_job_attempt_creation() to its body without the FOR UPDATE
-- lock. Does not touch identity, commerce, entitlement, or knowledge, and
-- does not drop the production schema.

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

drop index if exists production.artifacts_unique_canonical_scope_idx;

create unique index artifacts_unique_canonical_scope_idx
  on production.artifacts (
    person_id,
    product_id,
    coalesce(product_version_id, '00000000-0000-0000-0000-000000000000'::uuid),
    coalesce(journey_anchor_id, '00000000-0000-0000-0000-000000000000'::uuid)
  );

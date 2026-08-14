-- Manual rollback for 20260816030000 · WO-LAUNCH-CORE-04 third
-- fresh-evaluator pass.
-- Restores validate_artifact_version_scope() to its exact
-- pre-this-migration body (symmetric-optional Journey check) and restores
-- the production_job_attempts_validate_creation trigger to BEFORE INSERT.
-- Does not touch identity, commerce, entitlement, or knowledge, and does
-- not drop the production schema.

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

  if v_job_journey is not null
     and v_artifact_journey is not null
     and v_job_journey is distinct from v_artifact_journey then
    raise exception 'ARTIFACT_VERSION_JOB_JOURNEY_MISMATCH';
  end if;

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

drop trigger if exists production_job_attempts_validate_creation on production.job_attempts;

create trigger production_job_attempts_validate_creation
  before insert on production.job_attempts
  for each row execute function production.validate_job_attempt_creation();

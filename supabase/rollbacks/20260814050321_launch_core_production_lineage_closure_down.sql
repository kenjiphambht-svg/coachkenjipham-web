-- Manual rollback for 20260816000000 · WO-LAUNCH-CORE-04 architecture
-- integrity hardening (P07 independent review — 4 named outcomes).
-- Restores validate_artifact_version_scope() to its exact
-- pre-this-migration body, drops the two new cascade triggers/functions,
-- and drops the new unique constraint. Does not touch identity, commerce,
-- entitlement, or knowledge, and does not drop the production schema.

alter table production.artifact_versions
  drop constraint if exists artifact_versions_unique_artifact_attempt;

create or replace function production.validate_artifact_version_scope()
returns trigger
language plpgsql
set search_path = pg_catalog, production
as $$
declare
  v_artifact_person uuid;
  v_artifact_product uuid;
  v_artifact_version uuid;
  v_job_person uuid;
  v_job_product uuid;
  v_job_version uuid;
begin
  select person_id, product_id, product_version_id
    into v_artifact_person, v_artifact_product, v_artifact_version
  from production.artifacts where id = NEW.artifact_id;
  if v_artifact_person is null then
    raise exception 'ARTIFACT_VERSION_ARTIFACT_NOT_FOUND';
  end if;

  select person_id, product_id, product_version_id
    into v_job_person, v_job_product, v_job_version
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

  return NEW;
end;
$$;

drop trigger if exists production_job_attempts_cascade_succeeded on production.job_attempts;
drop function if exists production.cascade_job_succeeded_from_attempt();

drop trigger if exists production_job_attempts_cascade_running on production.job_attempts;
drop function if exists production.cascade_job_running_from_attempt();

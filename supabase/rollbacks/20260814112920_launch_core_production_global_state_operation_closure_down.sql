-- Scoped rollback for 20260817010000_launch_core_production_global_state_operation_closure.
-- Restores reject_job_rewrite(), validate_artifact_scope(),
-- validate_artifact_version_scope() to their exact pre-migration bodies;
-- restores production.artifacts.product_version_id (nullable, with its
-- two FK constraints); restores production.artifact_reviews.
-- review_correlation_reference to nullable with the original CHECK, and
-- drops the new unique-event constraint. Touches no other object, no
-- other schema.

-- ---------------- Finding C rollback ----------------

alter table production.artifact_reviews
  drop constraint if exists artifact_reviews_unique_event;

alter table production.artifact_reviews
  drop constraint if exists artifact_reviews_review_correlation_reference_check;
alter table production.artifact_reviews
  add constraint artifact_reviews_review_correlation_reference_check
  check (
    (review_correlation_reference is null)
    or (char_length(review_correlation_reference) >= 1 and char_length(review_correlation_reference) <= 300)
  );

alter table production.artifact_reviews
  alter column review_correlation_reference drop not null;

-- ---------------- Finding B rollback ----------------

alter table production.artifacts add column if not exists product_version_id uuid;

alter table production.artifacts
  add constraint artifacts_product_version_id_fkey
  foreign key (product_version_id) references commerce.product_versions(id) on delete restrict;

alter table production.artifacts
  add constraint artifacts_version_belongs_to_product
  foreign key (product_version_id, product_id) references commerce.product_versions(id, product_id);

create or replace function production.validate_artifact_scope()
returns trigger
language plpgsql
set search_path = pg_catalog, production, commerce
as $$
declare
  v_journey_person uuid;
  v_journey_product uuid;
  v_journey_version uuid;
begin
  if NEW.journey_anchor_id is not null then
    select person_id, product_id, product_version_id
      into v_journey_person, v_journey_product, v_journey_version
    from commerce.product_journey_anchors where id = NEW.journey_anchor_id;
    if v_journey_person is null then
      raise exception 'ARTIFACT_JOURNEY_NOT_FOUND';
    end if;
    if v_journey_person is distinct from NEW.person_id or v_journey_product is distinct from NEW.product_id then
      raise exception 'ARTIFACT_JOURNEY_SCOPE_MISMATCH';
    end if;
    if v_journey_version is not null
       and NEW.product_version_id is not null
       and v_journey_version is distinct from NEW.product_version_id then
      raise exception 'ARTIFACT_JOURNEY_VERSION_MISMATCH';
    end if;
    if v_journey_version is null and NEW.product_version_id is not null then
      raise exception 'ARTIFACT_JOURNEY_VERSION_NOT_YET_PINNED';
    end if;
  end if;
  return NEW;
end;
$$;

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

  if v_artifact_journey is not null
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

-- ---------------- Finding A rollback ----------------

create or replace function production.reject_job_rewrite()
returns trigger
language plpgsql
set search_path = pg_catalog, production
as $$
declare
  v_succeeded_attempts int;
begin
  if NEW.person_id is distinct from OLD.person_id then
    raise exception 'JOB_PERSON_IMMUTABLE';
  end if;
  if NEW.product_id is distinct from OLD.product_id then
    raise exception 'JOB_PRODUCT_IMMUTABLE';
  end if;
  if NEW.product_version_id is distinct from OLD.product_version_id then
    raise exception 'JOB_PRODUCT_VERSION_IMMUTABLE';
  end if;
  if NEW.journey_anchor_id is distinct from OLD.journey_anchor_id then
    raise exception 'JOB_JOURNEY_ANCHOR_IMMUTABLE';
  end if;
  if NEW.order_id is distinct from OLD.order_id then
    raise exception 'JOB_ORDER_IMMUTABLE';
  end if;
  if NEW.idempotency_key is distinct from OLD.idempotency_key then
    raise exception 'JOB_IDEMPOTENCY_KEY_IMMUTABLE';
  end if;

  if OLD.status in ('succeeded', 'failed', 'cancelled') and NEW.status is distinct from OLD.status then
    raise exception 'JOB_TERMINAL_STATUS_IMMUTABLE';
  end if;

  if NEW.status is distinct from OLD.status then
    if not (
      (OLD.status = 'pending' and NEW.status in ('running', 'cancelled'))
      or (OLD.status = 'running' and NEW.status in ('succeeded', 'failed', 'cancelled'))
    ) then
      raise exception 'JOB_STATUS_TRANSITION_INVALID';
    end if;
  end if;

  if NEW.status = 'succeeded' and OLD.status is distinct from 'succeeded' then
    select count(*) into v_succeeded_attempts
    from production.job_attempts where job_id = NEW.id and status = 'succeeded';
    if v_succeeded_attempts = 0 then
      raise exception 'JOB_SUCCEEDED_REQUIRES_SUCCESSFUL_ATTEMPT';
    end if;
  end if;

  return NEW;
end;
$$;

-- Scoped rollback for 20260816050000_launch_core_production_fifth_evaluation_hardening.
-- Restores validate_job_scope() to its exact pre-fix body from
-- 20260814060704_launch_core_production_fourth_evaluation_hardening
-- (the immediately preceding round). Touches no other object, no other
-- schema, and does not touch validate_artifact_scope() since this round
-- did not modify it.

create or replace function production.validate_job_scope()
returns trigger
language plpgsql
set search_path = pg_catalog, production, commerce
as $$
declare
  v_journey_person uuid;
  v_journey_product uuid;
  v_journey_version uuid;
  v_order_person uuid;
  v_order_product uuid;
  v_order_version uuid;
begin
  if NEW.journey_anchor_id is not null then
    select person_id, product_id, product_version_id
      into v_journey_person, v_journey_product, v_journey_version
    from commerce.product_journey_anchors where id = NEW.journey_anchor_id;
    if v_journey_person is null then
      raise exception 'JOB_JOURNEY_NOT_FOUND';
    end if;
    if v_journey_person is distinct from NEW.person_id or v_journey_product is distinct from NEW.product_id then
      raise exception 'JOB_JOURNEY_SCOPE_MISMATCH';
    end if;
    if v_journey_version is not null
       and NEW.product_version_id is not null
       and v_journey_version is distinct from NEW.product_version_id then
      raise exception 'JOB_JOURNEY_VERSION_MISMATCH';
    end if;
    if v_journey_version is null and NEW.product_version_id is not null then
      raise exception 'JOB_JOURNEY_VERSION_NOT_YET_PINNED';
    end if;
  end if;

  if NEW.order_id is not null then
    select buyer_person_id, product_id, product_version_id
      into v_order_person, v_order_product, v_order_version
    from commerce.orders where id = NEW.order_id;
    if v_order_person is null then
      raise exception 'JOB_ORDER_NOT_FOUND';
    end if;
    if v_order_person is distinct from NEW.person_id or v_order_product is distinct from NEW.product_id then
      raise exception 'JOB_ORDER_SCOPE_MISMATCH';
    end if;
    if NEW.product_version_id is not null
       and v_order_version is distinct from NEW.product_version_id then
      raise exception 'JOB_ORDER_VERSION_MISMATCH';
    end if;
  end if;

  if NEW.journey_anchor_id is not null and NEW.order_id is not null
     and v_journey_version is not null and v_order_version is not null
     and v_journey_version is distinct from v_order_version then
    raise exception 'JOB_JOURNEY_ORDER_VERSION_MISMATCH';
  end if;

  return NEW;
end;
$$;

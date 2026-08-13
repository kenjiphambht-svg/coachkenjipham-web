-- Manual rollback for 20260814050000 · WO-LAUNCH-CORE-03 second self-review
-- round: Journey vs Order direct version-agreement check.
-- Restores entitlement.validate_entitlement_scope() to its exact
-- pre-this-migration body from 20260813165456 (no Journey-vs-Order direct
-- version comparison). Does not touch identity, commerce, or knowledge.

create or replace function entitlement.validate_entitlement_scope()
returns trigger
language plpgsql
set search_path = pg_catalog, entitlement, commerce
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
      raise exception 'ENTITLEMENT_JOURNEY_NOT_FOUND';
    end if;
    if v_journey_person is distinct from NEW.person_id or v_journey_product is distinct from NEW.product_id then
      raise exception 'ENTITLEMENT_JOURNEY_SCOPE_MISMATCH';
    end if;
    if v_journey_version is not null
       and NEW.product_version_id is not null
       and v_journey_version is distinct from NEW.product_version_id then
      raise exception 'ENTITLEMENT_JOURNEY_VERSION_MISMATCH';
    end if;
  end if;
  if NEW.order_id is not null then
    select buyer_person_id, product_id, product_version_id
      into v_order_person, v_order_product, v_order_version
    from commerce.orders where id = NEW.order_id;
    if v_order_person is null then
      raise exception 'ENTITLEMENT_ORDER_NOT_FOUND';
    end if;
    if v_order_person is distinct from NEW.person_id or v_order_product is distinct from NEW.product_id then
      raise exception 'ENTITLEMENT_ORDER_SCOPE_MISMATCH';
    end if;
    if NEW.product_version_id is not null
       and v_order_version is distinct from NEW.product_version_id then
      raise exception 'ENTITLEMENT_ORDER_VERSION_MISMATCH';
    end if;
  end if;
  return NEW;
end;
$$;

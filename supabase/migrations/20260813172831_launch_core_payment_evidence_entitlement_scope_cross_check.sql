-- 20260813172831 · WO-LAUNCH-CORE-03 second self-review round: Journey vs
-- Order direct version-agreement check.
-- Corrective, additive-only migration over
-- 20260813165456_launch_core_payment_evidence_entitlement_hardening. Does
-- not reset or drop the entitlement schema; does not edit either previously
-- applied migration file. Replaces only the body of
-- entitlement.validate_entitlement_scope() — the existing trigger already
-- points at this function name, so no trigger drop/recreate is needed.
--
-- Gap found during a second adversarial self-review pass (not one of the
-- five originally named findings): the hardening migration checks the
-- Entitlement's OWN product_version_id against the Journey it references,
-- and separately against the Order it references — but only when the
-- Entitlement itself makes a version claim (product_version_id is not
-- null). If an Entitlement references BOTH a Journey (pinned to Version A)
-- and an Order (pinned to Version B, A != B) while leaving its own
-- product_version_id unscoped (null), both individual checks are skipped
-- and the row is accepted even though the Journey and Order it anchors to
-- directly disagree with each other. This closes that gap by comparing
-- the Journey's pinned version and the Order's pinned version to each
-- other directly, independent of what the Entitlement itself claims.

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
  -- Second self-review addition: even when the Entitlement itself makes no
  -- version claim, a Journey and an Order it anchors to simultaneously
  -- must not silently disagree about which Version they each pin.
  if NEW.journey_anchor_id is not null and NEW.order_id is not null
     and v_journey_version is not null and v_order_version is not null
     and v_journey_version is distinct from v_order_version then
    raise exception 'ENTITLEMENT_JOURNEY_ORDER_VERSION_MISMATCH';
  end if;
  return NEW;
end;
$$;

comment on function entitlement.validate_entitlement_scope() is
  'Scope integrity at insert time: Journey/Order referenced must belong to the same person_id/product_id being granted, and any Version they each pin must not contradict the Entitlement''s own claimed product_version_id, nor contradict each other (Journey pinned to Version A and Order pinned to Version B on the same Entitlement is rejected even if the Entitlement itself claims no version).';

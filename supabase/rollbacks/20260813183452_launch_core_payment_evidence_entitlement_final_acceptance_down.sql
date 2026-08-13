-- Manual rollback for 20260814150000 · WO-LAUNCH-CORE-03 final acceptance
-- hardening (P07 review round 3).
-- Restores every replaced function/constraint/grant to its exact
-- pre-this-migration state from 20260813180023, and drops the genuinely
-- new objects this migration added. Does not touch identity, commerce, or
-- knowledge, and does not drop the entitlement schema.

-- OUTCOME 3 rollback — restore full UPDATE on payment_evidence, drop the
-- controlled transition RPC, restore the non-provenance logging trigger,
-- drop the new provenance columns.
revoke update (superseded_by) on entitlement.payment_evidence from service_role;
grant update on entitlement.payment_evidence to service_role;

drop function if exists entitlement.record_payment_evidence_verification(uuid, text, text, text);

create or replace function entitlement.log_payment_evidence_verification_event()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, entitlement
as $$
begin
  if NEW.verification_status is distinct from OLD.verification_status then
    insert into entitlement.payment_evidence_verification_events (
      payment_evidence_id, from_status, to_status
    ) values (
      NEW.id, OLD.verification_status, NEW.verification_status
    );
  end if;
  return NEW;
end;
$$;

alter table entitlement.payment_evidence_verification_events
  drop constraint if exists payment_evidence_verification_events_source_kind_check,
  drop column if exists transition_correlation_reference,
  drop column if exists transition_source_kind;

-- OUTCOME 2 rollback — restore the pre-outcome-2-round-3 constraint
-- (revoke_reason optional).
alter table entitlement.entitlements
  drop constraint if exists entitlements_revocation_consistency;

alter table entitlement.entitlements
  add constraint entitlements_revocation_consistency check (
    (status = 'revoked' and revoked_at is not null and revoke_source is not null)
    or (
      status = 'active'
      and revoked_at is null
      and revoke_reason is null
      and revoke_source is null
      and revoke_evidence_id is null
    )
  );

-- OUTCOME 1 rollback — restore has_active_entitlement without the
-- Journey-vs-caller-Version coherence check.
create or replace function entitlement.has_active_entitlement(
  p_person_id uuid,
  p_product_id uuid,
  p_journey_anchor_id uuid default null,
  p_product_version_id uuid default null
)
returns boolean
language plpgsql
stable
set search_path = pg_catalog, entitlement, commerce
as $$
declare
  v_journey_person uuid;
  v_journey_product uuid;
  v_version_product uuid;
begin
  if p_journey_anchor_id is not null then
    select person_id, product_id into v_journey_person, v_journey_product
    from commerce.product_journey_anchors where id = p_journey_anchor_id;
    if v_journey_person is null
       or v_journey_person is distinct from p_person_id
       or v_journey_product is distinct from p_product_id then
      return false;
    end if;
  end if;

  if p_product_version_id is not null then
    select product_id into v_version_product
    from commerce.product_versions where id = p_product_version_id;
    if v_version_product is null or v_version_product is distinct from p_product_id then
      return false;
    end if;
  end if;

  return exists (
    select 1 from entitlement.entitlements
    where person_id = p_person_id
      and product_id = p_product_id
      and status = 'active'
      and valid_from <= now()
      and (valid_until is null or valid_until > now())
      and (journey_anchor_id is null or journey_anchor_id = p_journey_anchor_id)
      and (product_version_id is null or product_version_id = p_product_version_id)
  );
end;
$$;

revoke all on function entitlement.has_active_entitlement(uuid, uuid, uuid, uuid) from public, anon, authenticated;
grant execute on function entitlement.has_active_entitlement(uuid, uuid, uuid, uuid) to service_role;

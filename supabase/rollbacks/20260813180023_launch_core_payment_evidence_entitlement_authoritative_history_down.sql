-- Manual rollback for 20260814090000 · WO-LAUNCH-CORE-03 final hardening
-- (P07 review round 2 + third self-review pass).
-- Restores every replaced function/constraint/grant to its exact
-- pre-this-migration state from 20260813172831. Does not touch identity,
-- commerce, or knowledge, and does not drop the entitlement schema.

-- OUTCOME 3 rollback — re-grant direct INSERT, restore non-SECURITY-DEFINER
-- verification-event logger.
grant insert on entitlement.audit_events to service_role;
grant insert on entitlement.payment_evidence_verification_events to service_role;

create or replace function entitlement.log_payment_evidence_verification_event()
returns trigger
language plpgsql
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

-- OUTCOME 2 rollback — restore the pre-outcome-2 (revoke_source optional)
-- revocation consistency constraint.
alter table entitlement.entitlements
  drop constraint if exists entitlements_revocation_consistency;

alter table entitlement.entitlements
  add constraint entitlements_revocation_consistency check (
    (status = 'revoked' and revoked_at is not null)
    or (
      status = 'active'
      and revoked_at is null
      and revoke_reason is null
      and revoke_source is null
      and revoke_evidence_id is null
    )
  );

-- OUTCOME 1 rollback — restore has_active_entitlement to its pre-outcome-1
-- body (plain SQL, no caller-context coherence pre-check).
create or replace function entitlement.has_active_entitlement(
  p_person_id uuid,
  p_product_id uuid,
  p_journey_anchor_id uuid default null,
  p_product_version_id uuid default null
)
returns boolean
language sql
stable
set search_path = pg_catalog, entitlement
as $$
  select exists (
    select 1 from entitlement.entitlements
    where person_id = p_person_id
      and product_id = p_product_id
      and status = 'active'
      and valid_from <= now()
      and (valid_until is null or valid_until > now())
      and (journey_anchor_id is null or journey_anchor_id = p_journey_anchor_id)
      and (product_version_id is null or product_version_id = p_product_version_id)
  );
$$;

revoke all on function entitlement.has_active_entitlement(uuid, uuid, uuid, uuid) from public, anon, authenticated;
grant execute on function entitlement.has_active_entitlement(uuid, uuid, uuid, uuid) to service_role;

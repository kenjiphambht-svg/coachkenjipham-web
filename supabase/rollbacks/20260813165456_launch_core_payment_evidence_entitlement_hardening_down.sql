-- Manual rollback for 20260813190000 · WO-LAUNCH-CORE-03 hardening.
-- Restores every replaced function/constraint/function-signature to its
-- exact pre-hardening body from 20260813135325, and drops the genuinely
-- new objects this migration added. Safe only while no later migration
-- depends on any object touched here. Does not touch identity, commerce,
-- or knowledge, and does not drop the entitlement schema itself.

-- D — drop the external-identity dedup index.
drop index if exists entitlement.payment_evidence_external_identity_idx;

-- C — drop the verification-history log (trigger, function, table).
drop trigger if exists payment_evidence_log_verification_event on entitlement.payment_evidence;
drop function if exists entitlement.log_payment_evidence_verification_event();
drop table if exists entitlement.payment_evidence_verification_events;

-- E1/E2 — restore validate_entitlement_scope to its pre-hardening body
-- (no product_version_id cross-check against Journey/Order).
create or replace function entitlement.validate_entitlement_scope()
returns trigger
language plpgsql
set search_path = pg_catalog, entitlement, commerce
as $$
declare
  v_journey_person uuid;
  v_journey_product uuid;
  v_order_person uuid;
  v_order_product uuid;
begin
  if NEW.journey_anchor_id is not null then
    select person_id, product_id into v_journey_person, v_journey_product
    from commerce.product_journey_anchors where id = NEW.journey_anchor_id;
    if v_journey_person is null then
      raise exception 'ENTITLEMENT_JOURNEY_NOT_FOUND';
    end if;
    if v_journey_person is distinct from NEW.person_id or v_journey_product is distinct from NEW.product_id then
      raise exception 'ENTITLEMENT_JOURNEY_SCOPE_MISMATCH';
    end if;
  end if;
  if NEW.order_id is not null then
    select buyer_person_id, product_id into v_order_person, v_order_product
    from commerce.orders where id = NEW.order_id;
    if v_order_person is null then
      raise exception 'ENTITLEMENT_ORDER_NOT_FOUND';
    end if;
    if v_order_person is distinct from NEW.person_id or v_order_product is distinct from NEW.product_id then
      raise exception 'ENTITLEMENT_ORDER_SCOPE_MISMATCH';
    end if;
  end if;
  return NEW;
end;
$$;

-- E3/E4 — restore reject_payment_evidence_rewrite to its pre-hardening
-- body (no supersession same-Order / cycle check).
create or replace function entitlement.reject_payment_evidence_rewrite()
returns trigger
language plpgsql
set search_path = pg_catalog, entitlement
as $$
begin
  if NEW.order_id is distinct from OLD.order_id then
    raise exception 'PAYMENT_EVIDENCE_ORDER_IMMUTABLE';
  end if;
  if NEW.source_kind is distinct from OLD.source_kind then
    raise exception 'PAYMENT_EVIDENCE_SOURCE_KIND_IMMUTABLE';
  end if;
  if NEW.provider_key is distinct from OLD.provider_key then
    raise exception 'PAYMENT_EVIDENCE_PROVIDER_KEY_IMMUTABLE';
  end if;
  if NEW.external_reference is distinct from OLD.external_reference then
    raise exception 'PAYMENT_EVIDENCE_EXTERNAL_REFERENCE_IMMUTABLE';
  end if;
  if NEW.idempotency_key is distinct from OLD.idempotency_key then
    raise exception 'PAYMENT_EVIDENCE_IDEMPOTENCY_KEY_IMMUTABLE';
  end if;
  if NEW.observed_at is distinct from OLD.observed_at then
    raise exception 'PAYMENT_EVIDENCE_OBSERVED_AT_IMMUTABLE';
  end if;
  if NEW.recorded_at is distinct from OLD.recorded_at then
    raise exception 'PAYMENT_EVIDENCE_RECORDED_AT_IMMUTABLE';
  end if;
  if NEW.amount is distinct from OLD.amount then
    raise exception 'PAYMENT_EVIDENCE_AMOUNT_IMMUTABLE';
  end if;
  if NEW.currency is distinct from OLD.currency then
    raise exception 'PAYMENT_EVIDENCE_CURRENCY_IMMUTABLE';
  end if;
  if NEW.payload_digest is distinct from OLD.payload_digest then
    raise exception 'PAYMENT_EVIDENCE_PAYLOAD_DIGEST_IMMUTABLE';
  end if;
  if NEW.metadata is distinct from OLD.metadata then
    raise exception 'PAYMENT_EVIDENCE_METADATA_IMMUTABLE';
  end if;
  if OLD.verification_status = 'invalidated'
     and NEW.verification_status is distinct from OLD.verification_status then
    raise exception 'PAYMENT_EVIDENCE_INVALIDATED_TERMINAL';
  end if;
  if OLD.verification_status = 'verified' and NEW.verification_status = 'recorded' then
    raise exception 'PAYMENT_EVIDENCE_STATUS_CANNOT_REVERT';
  end if;
  if OLD.superseded_by is not null and NEW.superseded_by is distinct from OLD.superseded_by then
    raise exception 'PAYMENT_EVIDENCE_SUPERSEDED_BY_IMMUTABLE';
  end if;
  return NEW;
end;
$$;

-- Self-review addition — restore reject_entitlement_rewrite to its
-- pre-hardening body (no revoke_evidence_id same-Order check).
create or replace function entitlement.reject_entitlement_rewrite()
returns trigger
language plpgsql
set search_path = pg_catalog, entitlement
as $$
begin
  if NEW.person_id is distinct from OLD.person_id then
    raise exception 'ENTITLEMENT_PERSON_IMMUTABLE';
  end if;
  if NEW.product_id is distinct from OLD.product_id then
    raise exception 'ENTITLEMENT_PRODUCT_IMMUTABLE';
  end if;
  if NEW.product_version_id is distinct from OLD.product_version_id then
    raise exception 'ENTITLEMENT_PRODUCT_VERSION_IMMUTABLE';
  end if;
  if NEW.journey_anchor_id is distinct from OLD.journey_anchor_id then
    raise exception 'ENTITLEMENT_JOURNEY_ANCHOR_IMMUTABLE';
  end if;
  if NEW.order_id is distinct from OLD.order_id then
    raise exception 'ENTITLEMENT_ORDER_IMMUTABLE';
  end if;
  if NEW.grant_key is distinct from OLD.grant_key then
    raise exception 'ENTITLEMENT_GRANT_KEY_IMMUTABLE';
  end if;
  if NEW.valid_from is distinct from OLD.valid_from then
    raise exception 'ENTITLEMENT_VALID_FROM_IMMUTABLE';
  end if;
  if NEW.valid_until is distinct from OLD.valid_until then
    raise exception 'ENTITLEMENT_VALID_UNTIL_IMMUTABLE';
  end if;
  if OLD.status = 'revoked' and NEW.status = 'active' then
    raise exception 'ENTITLEMENT_CANNOT_UNREVOKE';
  end if;
  if OLD.status = 'revoked' and (
       NEW.revoked_at is distinct from OLD.revoked_at
       or NEW.revoke_reason is distinct from OLD.revoke_reason
       or NEW.revoke_source is distinct from OLD.revoke_source
       or NEW.revoke_evidence_id is distinct from OLD.revoke_evidence_id
     ) then
    raise exception 'ENTITLEMENT_REVOCATION_RECORD_IMMUTABLE';
  end if;
  return NEW;
end;
$$;

-- B — restore the original (asymmetric) revoked_requires_revoked_at check.
alter table entitlement.entitlements
  drop constraint if exists entitlements_revocation_consistency;

alter table entitlement.entitlements
  add constraint entitlements_revoked_requires_revoked_at check (
    (status = 'revoked' and revoked_at is not null) or status = 'active'
  );

-- A — restore the original 2-argument has_active_entitlement.
drop function if exists entitlement.has_active_entitlement(uuid, uuid, uuid, uuid);

create or replace function entitlement.has_active_entitlement(p_person_id uuid, p_product_id uuid)
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
  );
$$;

revoke all on function entitlement.has_active_entitlement(uuid, uuid) from public, anon, authenticated;
grant execute on function entitlement.has_active_entitlement(uuid, uuid) to service_role;

-- 20260813180023 · WO-LAUNCH-CORE-03 final hardening: P07 independent
-- review, round 2 (3 named outcomes) + third builder self-review pass.
-- Corrective, additive-only migration over
-- 20260813172831_launch_core_payment_evidence_entitlement_scope_cross_check.
-- Does not reset or drop the entitlement schema; does not edit any
-- previously applied migration file.
--
-- OUTCOME 1 — AUTHORIZATION COHERENCE. has_active_entitlement rewritten to
-- validate that any caller-supplied Journey/Version context is itself
-- canonically real and belongs to the exact Person/Product being checked,
-- BEFORE matching it against a stored grant. Previously, an unscoped
-- (product-wide) grant would return TRUE even if the caller supplied a
-- Journey belonging to a different Person/Product entirely — the grant's
-- own scope was checked, but the caller's claimed context never was.
--
-- OUTCOME 2 — REVOCATION PROVENANCE. entitlements_revocation_consistency
-- tightened: a revoked Entitlement must now carry revoke_source (not just
-- revoked_at) — "what source/system/actor recorded this" is the minimum
-- fact needed to explain a revocation. revoke_reason and revoke_evidence_id
-- remain optional (a revocation is not required to be payment-related).
--
-- OUTCOME 3 — AUTHORITATIVE VERIFICATION HISTORY. Both
-- entitlement.payment_evidence_verification_events and
-- entitlement.audit_events (self-review addition — same root cause, same
-- schema) previously granted INSERT directly to service_role in addition
-- to being populated by a trigger. This meant any normal application path
-- using service_role could bypass the trigger and insert a fabricated
-- history row disconnected from any real state transition. Both logging
-- functions are declared SECURITY DEFINER (log_audit_event() already was;
-- log_payment_evidence_verification_event() is now made so too) and
-- direct INSERT is revoked from service_role on both tables — the ONLY
-- remaining path to a new row is the trigger firing on a genuine
-- transition.

-- =========================================================================
-- OUTCOME 1
-- =========================================================================

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
  -- Fail closed: a supplied Journey context must really belong to the
  -- exact Person/Product being checked. A non-existent or mismatched
  -- Journey makes the entire check meaningless, regardless of whether the
  -- underlying grant is scoped or unscoped.
  if p_journey_anchor_id is not null then
    select person_id, product_id into v_journey_person, v_journey_product
    from commerce.product_journey_anchors where id = p_journey_anchor_id;
    if v_journey_person is null
       or v_journey_person is distinct from p_person_id
       or v_journey_product is distinct from p_product_id then
      return false;
    end if;
  end if;

  -- Fail closed: a supplied Version context must really belong to the
  -- exact Product being checked.
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

comment on function entitlement.has_active_entitlement(uuid, uuid, uuid, uuid) is
  'Fail-closed object-level access check, two layers. First: any supplied Journey/Version context must be canonically real and belong to the exact Person/Product being checked — a mismatched or non-existent context returns false immediately, before any grant is consulted. Second: the stored grant''s own scope must match (a scoped Entitlement only authorizes its exact scope; an unscoped Entitlement authorizes any coherent scope, including none).';

revoke all on function entitlement.has_active_entitlement(uuid, uuid, uuid, uuid) from public, anon, authenticated;
grant execute on function entitlement.has_active_entitlement(uuid, uuid, uuid, uuid) to service_role;

-- =========================================================================
-- OUTCOME 2
-- =========================================================================

alter table entitlement.entitlements
  drop constraint entitlements_revocation_consistency;

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

comment on constraint entitlements_revocation_consistency on entitlement.entitlements is
  'active and revoked are mutually exclusive AND complete. active status can carry no revocation provenance at all. revoked status must carry at minimum revoked_at (when) and revoke_source (what system/actor recorded it) — a revocation can never exist as unexplained historical truth. revoke_reason and revoke_evidence_id remain optional: not every revocation is payment-related.';

-- =========================================================================
-- OUTCOME 3
-- =========================================================================

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

comment on function entitlement.log_payment_evidence_verification_event() is
  'SECURITY DEFINER: runs with the privileges of its owner, not the invoking role. Combined with revoking direct INSERT on payment_evidence_verification_events from service_role, this is the ONLY path that can create a row — a normal application path cannot fabricate lifecycle history disconnected from a real verification_status transition.';

revoke all on function entitlement.log_payment_evidence_verification_event() from public, anon, authenticated;

revoke insert on entitlement.payment_evidence_verification_events from service_role;

-- Self-review addition: entitlement.audit_events has the identical
-- fabrication-bypass shape (log_audit_event() is already SECURITY
-- DEFINER from the original foundation migration; only the direct INSERT
-- grant needs revoking here).
revoke insert on entitlement.audit_events from service_role;

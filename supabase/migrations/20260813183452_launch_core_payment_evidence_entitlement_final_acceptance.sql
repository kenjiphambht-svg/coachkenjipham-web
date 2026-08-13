-- 20260813183452 · WO-LAUNCH-CORE-03 final acceptance hardening: P07
-- independent review round 3 (3 outcomes).
-- Corrective, additive-only migration over
-- 20260813180023_launch_core_payment_evidence_entitlement_authoritative_history.
-- Does not reset or drop the entitlement schema; does not edit any
-- previously applied migration file.
--
-- OUTCOME 1 — CANONICAL ACCESS CONTEXT COHERENCE. has_active_entitlement
-- previously validated Journey-belongs-to-Person/Product and
-- Version-belongs-to-Product independently, but never checked whether a
-- caller-supplied Journey and a caller-supplied Version AGREE with each
-- other. A Journey pinned to Version 1 plus a caller-supplied Version 2
-- (itself a valid Version of the same Product) passed both individual
-- checks while contradicting each other. Fixed by comparing the Journey's
-- own pinned Version against the caller-supplied Version directly.
--
-- OUTCOME 2 — REVOCATION MUST ANSWER WHEN + SOURCE + WHY.
-- entitlements_revocation_consistency required revoked_at and
-- revoke_source but left revoke_reason optional — a revocation could
-- record WHO/WHAT and WHEN without ever recording WHY. revoke_reason is
-- now also required when revoked. revoke_evidence_id remains optional (a
-- revocation is not required to be payment-related).
--
-- OUTCOME 3 — AUTHORITATIVE, PROVENANCE-CARRYING VERIFICATION HISTORY.
-- The prior hardening correctly stopped service_role from inserting a
-- fabricated row directly into payment_evidence_verification_events, but
-- verification_status could still be changed via a plain UPDATE carrying
-- NO required technical provenance about what caused the transition. This
-- migration:
--   (a) adds transition_source_kind (reusing payment_evidence's own
--       source_kind vocabulary — no new business taxonomy invented) and
--       an optional transition_correlation_reference to
--       payment_evidence_verification_events;
--   (b) revokes column-level UPDATE on verification_status from
--       service_role, so a raw UPDATE can no longer change it at all;
--   (c) introduces entitlement.record_payment_evidence_verification(), a
--       SECURITY DEFINER controlled transition function that requires
--       transition_source_kind and is the ONLY remaining path that can
--       change verification_status;
--   (d) the logging trigger now requires the provenance to be present
--       (defense in depth beyond the column-level revoke).
-- No human actor identity is fabricated — transition_source_kind is a
-- truthful, provider-neutral technical fact the caller must declare, not
-- an invented identity the system cannot actually know.

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
  v_journey_version uuid;
  v_version_product uuid;
begin
  if p_journey_anchor_id is not null then
    select person_id, product_id, product_version_id
      into v_journey_person, v_journey_product, v_journey_version
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

  -- Outcome 1: the caller-supplied context must be coherent AS A WHOLE —
  -- if the Journey is pinned to a specific Version, a different
  -- caller-supplied Version directly contradicts it, regardless of
  -- whether either individually passed its own belongs-to check.
  if v_journey_version is not null
     and p_product_version_id is not null
     and v_journey_version is distinct from p_product_version_id then
    return false;
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
  'Fail-closed object-level access check, three layers. First: any supplied Journey/Version context must be canonically real and belong to the exact Person/Product being checked. Second: if a Journey is pinned to a Version, a different caller-supplied Version directly contradicts it and fails closed, even if each individually belonged to the right Product — the caller-supplied context must be coherent as a whole, not just piecewise valid. Third: the stored grant''s own scope must independently match.';

revoke all on function entitlement.has_active_entitlement(uuid, uuid, uuid, uuid) from public, anon, authenticated;
grant execute on function entitlement.has_active_entitlement(uuid, uuid, uuid, uuid) to service_role;

-- =========================================================================
-- OUTCOME 2
-- =========================================================================

alter table entitlement.entitlements
  drop constraint entitlements_revocation_consistency;

alter table entitlement.entitlements
  add constraint entitlements_revocation_consistency check (
    (status = 'revoked' and revoked_at is not null and revoke_source is not null and revoke_reason is not null)
    or (
      status = 'active'
      and revoked_at is null
      and revoke_reason is null
      and revoke_source is null
      and revoke_evidence_id is null
    )
  );

comment on constraint entitlements_revocation_consistency on entitlement.entitlements is
  'active and revoked are mutually exclusive AND complete. active status can carry no revocation provenance at all. revoked status must answer WHEN (revoked_at), WHAT SOURCE/ACTOR (revoke_source), and WHY (revoke_reason) — a revocation can never exist as unexplained historical truth. revoke_evidence_id remains optional: not every revocation is payment-related.';

-- =========================================================================
-- OUTCOME 3
-- =========================================================================

alter table entitlement.payment_evidence_verification_events
  add column transition_source_kind text not null,
  add column transition_correlation_reference text
    check (transition_correlation_reference is null or char_length(transition_correlation_reference) between 1 and 300),
  add constraint payment_evidence_verification_events_source_kind_check check (
    transition_source_kind in (
      'manual_report', 'bank_statement', 'provider_webhook',
      'provider_api_confirmation', 'admin_attestation'
    )
  );

comment on column entitlement.payment_evidence_verification_events.transition_source_kind is
  'What technical source caused/recorded THIS specific transition — reuses payment_evidence.source_kind''s exact vocabulary (a verification decision can have a different technical source than the original evidence, e.g. evidence recorded via bank_statement, later verified via admin_attestation). Required on every row: never NULL.';

comment on column entitlement.payment_evidence_verification_events.transition_correlation_reference is
  'Optional pointer/reference correlating this transition to external technical evidence when applicable — bounded free text, no raw payload.';

create or replace function entitlement.log_payment_evidence_verification_event()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, entitlement
as $$
declare
  v_source_kind text;
  v_correlation_reference text;
begin
  if NEW.verification_status is distinct from OLD.verification_status then
    v_source_kind := nullif(current_setting('entitlement.verification_transition_source_kind', true), '');
    v_correlation_reference := nullif(current_setting('entitlement.verification_transition_correlation_reference', true), '');
    if v_source_kind is null then
      raise exception 'PAYMENT_EVIDENCE_VERIFICATION_PROVENANCE_REQUIRED';
    end if;
    insert into entitlement.payment_evidence_verification_events (
      payment_evidence_id, from_status, to_status, transition_source_kind, transition_correlation_reference
    ) values (
      NEW.id, OLD.verification_status, NEW.verification_status, v_source_kind, v_correlation_reference
    );
  end if;
  return NEW;
end;
$$;

comment on function entitlement.log_payment_evidence_verification_event() is
  'SECURITY DEFINER trigger. Reads the required transition provenance from transaction-local settings populated by entitlement.record_payment_evidence_verification() and raises PAYMENT_EVIDENCE_VERIFICATION_PROVENANCE_REQUIRED if missing — a defense-in-depth backstop behind the column-level UPDATE revoke on verification_status.';

revoke all on function entitlement.log_payment_evidence_verification_event() from public, anon, authenticated;

-- The ONLY remaining path that can change verification_status. Requires
-- transition_source_kind; correlation reference is optional.
create function entitlement.record_payment_evidence_verification(
  p_payment_evidence_id uuid,
  p_new_status text,
  p_transition_source_kind text,
  p_transition_correlation_reference text default null
)
returns entitlement.payment_evidence
language plpgsql
security definer
set search_path = pg_catalog, entitlement
as $$
declare
  v_row entitlement.payment_evidence;
begin
  if p_transition_source_kind is null then
    raise exception 'PAYMENT_EVIDENCE_VERIFICATION_SOURCE_KIND_REQUIRED';
  end if;

  perform set_config('entitlement.verification_transition_source_kind', p_transition_source_kind, true);
  perform set_config('entitlement.verification_transition_correlation_reference', coalesce(p_transition_correlation_reference, ''), true);

  update entitlement.payment_evidence
  set verification_status = p_new_status
  where id = p_payment_evidence_id
  returning * into v_row;

  if v_row.id is null then
    raise exception 'PAYMENT_EVIDENCE_NOT_FOUND';
  end if;

  return v_row;
end;
$$;

comment on function entitlement.record_payment_evidence_verification(uuid, text, text, text) is
  'Controlled transition path — the ONLY way verification_status can change, since direct column-level UPDATE is revoked from service_role. Requires transition_source_kind (truthful technical fact, not a fabricated actor identity); all existing lifecycle guards (one-directional transition, invalidated terminal, etc.) still apply via the pre-existing rewrite-guard trigger on the underlying UPDATE. Every real transition is therefore both authoritative (cannot be bypassed) and provenance-carrying (cannot omit its technical source).';

revoke all on function entitlement.record_payment_evidence_verification(uuid, text, text, text) from public, anon, authenticated;
grant execute on function entitlement.record_payment_evidence_verification(uuid, text, text, text) to service_role;

-- Lock verification_status to the controlled path only; superseded_by
-- remains directly updatable (its own trigger already fully governs it).
revoke update on entitlement.payment_evidence from service_role;
grant update (superseded_by) on entitlement.payment_evidence to service_role;

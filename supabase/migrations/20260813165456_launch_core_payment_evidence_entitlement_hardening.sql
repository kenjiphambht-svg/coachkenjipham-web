-- 20260813165456 · WO-LAUNCH-CORE-03 hardening: architecture/security review
-- round 2 (5 named finding classes + builder self-review).
-- Corrective, additive-only migration over
-- 20260813135325_launch_core_payment_evidence_entitlement_foundation. Does
-- not reset or drop the entitlement schema; does not edit the previously
-- applied migration file. Every object below either replaces the body of an
-- existing function (trigger already points at the same name, so no
-- trigger drop/recreate is needed) or is a genuinely new, additive object.
--
-- Fixes, one section per finding:
--   A. ACCESS SCOPE           — entitlement.has_active_entitlement rescoped
--   B. REVOCATION CONSISTENCY — symmetric active/revoked check constraint
--   C. PAYMENT VERIFICATION HISTORY — dedicated, insert-only lifecycle log
--   D. EXTERNAL EVENT DEDUPLICATION — canonical (provider_key,
--      external_reference) dedup, scoped so manual evidence is unconstrained
--   E. CROSS-REFERENCE CONSISTENCY — Order/Journey pinned-version agreement,
--      supersession same-Order requirement, supersession cycle rejection,
--      revoke_evidence_id same-Order requirement (self-review addition)

-- =========================================================================
-- A. ACCESS SCOPE — a Journey- or Version-scoped grant must never silently
-- authorize a different Journey, a different Version, or unscoped
-- Product-wide access. The caller must now state exactly what it is
-- checking; a scoped Entitlement only matches an identical scope, an
-- unscoped (product-wide) Entitlement still matches any scope. The old
-- 2-argument signature is replaced outright (pre-merge, no live caller
-- depends on it) rather than kept as a permissive default, so a caller
-- that forgets to pass journey/version context gets the narrower,
-- fail-closed behavior rather than silently falling back to product-wide.
-- =========================================================================

drop function if exists entitlement.has_active_entitlement(uuid, uuid);

create function entitlement.has_active_entitlement(
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
      -- Scope match: an Entitlement scoped to a specific Journey only
      -- satisfies a check for that exact Journey (or is irrelevant to a
      -- generic/no-journey check); an unscoped Entitlement (journey_anchor_id
      -- is null) satisfies any Journey, including no Journey specified.
      and (journey_anchor_id is null or journey_anchor_id = p_journey_anchor_id)
      -- Same rule for Product Version scope.
      and (product_version_id is null or product_version_id = p_product_version_id)
  );
$$;

comment on function entitlement.has_active_entitlement(uuid, uuid, uuid, uuid) is
  'Fail-closed object-level access check. A Journey- or Version-scoped Entitlement only authorizes that exact Journey/Version (or an unspecified check that supplies no journey/version context does NOT match a scoped grant) — a scoped grant can never be mistaken for Product-wide access. An unscoped (fully Product-wide) Entitlement matches any Journey/Version, including none.';

revoke all on function entitlement.has_active_entitlement(uuid, uuid, uuid, uuid) from public, anon, authenticated;
grant execute on function entitlement.has_active_entitlement(uuid, uuid, uuid, uuid) to service_role;

-- =========================================================================
-- B. REVOCATION CONSISTENCY — an Entitlement must never simultaneously
-- read status = 'active' while also carrying revocation provenance. The
-- original constraint only checked the revoked -> needs revoked_at
-- direction; this replaces it with a symmetric constraint so a direct
-- INSERT (bypassing the normal grant flow) cannot create a contradictory
-- row either. The existing UPDATE-time seal
-- (ENTITLEMENT_REVOCATION_RECORD_IMMUTABLE, already in the applied
-- migration) still guarantees revoked provenance cannot change once set;
-- this closes the INSERT-time gap the seal does not cover.
-- =========================================================================

alter table entitlement.entitlements
  drop constraint entitlements_revoked_requires_revoked_at;

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

comment on constraint entitlements_revocation_consistency on entitlement.entitlements is
  'active and revoked are mutually exclusive AND complete: active status can carry no revocation provenance at all; revoked status must carry at least revoked_at. Prevents a row from ever reading as simultaneously active and revoked.';

-- =========================================================================
-- C. PAYMENT VERIFICATION HISTORY — the generic audit_events row (just
-- "payment_evidence.update", operation=UPDATE) cannot answer what
-- transition occurred, when, or what supported it. This adds a dedicated,
-- insert-only lifecycle log: one row per actual verification_status
-- transition, populated automatically by an AFTER UPDATE trigger. Rows are
-- immutable — the same reject-mutation discipline as every other
-- history/evidence table in this schema.
-- =========================================================================

create table entitlement.payment_evidence_verification_events (
  id uuid primary key default gen_random_uuid(),
  payment_evidence_id uuid not null references entitlement.payment_evidence(id) on delete restrict,
  from_status text not null check (from_status in ('recorded', 'verified', 'invalidated')),
  to_status text not null check (to_status in ('recorded', 'verified', 'invalidated')),
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

comment on table entitlement.payment_evidence_verification_events is
  'Immutable, insert-only log of every actual verification_status transition on a Payment Evidence row (from_status -> to_status, occurred_at). Populated automatically by trigger — never written to directly. Exists specifically so the verification lifecycle can be independently reconstructed; a generic audit row recording only that an UPDATE happened is not sufficient for this.';

create index payment_evidence_verification_events_evidence_idx
  on entitlement.payment_evidence_verification_events(payment_evidence_id, occurred_at);

create trigger payment_evidence_verification_events_block_update
  before update on entitlement.payment_evidence_verification_events
  for each row execute function entitlement.reject_audit_mutation();
create trigger payment_evidence_verification_events_block_delete
  before delete on entitlement.payment_evidence_verification_events
  for each row execute function entitlement.reject_audit_mutation();

create function entitlement.log_payment_evidence_verification_event()
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

revoke all on function entitlement.log_payment_evidence_verification_event() from public, anon, authenticated;

create trigger payment_evidence_log_verification_event
  after update on entitlement.payment_evidence
  for each row execute function entitlement.log_payment_evidence_verification_event();

alter table entitlement.payment_evidence_verification_events enable row level security;
alter table entitlement.payment_evidence_verification_events force row level security;
revoke all on entitlement.payment_evidence_verification_events from public, anon, authenticated;
grant select, insert on entitlement.payment_evidence_verification_events to service_role;

-- =========================================================================
-- D. EXTERNAL EVENT DEDUPLICATION — idempotency_key alone only stops a
-- retry that reuses the same application-supplied key. Two different
-- idempotency_keys can still describe the exact same real-world external
-- payment event. This adds a canonical-identity dedup on
-- (provider_key, external_reference), scoped by a partial index so it only
-- applies when a real external identity is present — manual evidence
-- (provider_key/external_reference both null) is left completely
-- unconstrained by this rule, as required.
-- =========================================================================

create unique index payment_evidence_external_identity_idx
  on entitlement.payment_evidence(provider_key, external_reference)
  where provider_key is not null and external_reference is not null;

comment on index entitlement.payment_evidence_external_identity_idx is
  'Canonical external-identity dedup: the same (provider_key, external_reference) cannot be recorded twice, regardless of idempotency_key. Only applies when both are present — manual evidence with no external identity is unconstrained by this index.';

-- =========================================================================
-- E. CROSS-REFERENCE CONSISTENCY
-- =========================================================================

-- E1/E2 — an Entitlement's own product_version_id must not contradict the
-- Order it references (Order already pins a Version, not-null by
-- commerce.orders' own contract) or the Journey it references (Journey may
-- optionally pin a Version). Extends the existing scope-validation trigger
-- rather than adding a second one, so all scope checks stay in one place.
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

-- E3/E4 — a Payment Evidence correction (superseded_by) must stay within
-- the same Order's evidence lineage, and can never form a cycle. Both
-- checks only run at the one legal transition (superseded_by: null -> a
-- value); it is already sealed immutable afterward by the existing
-- PAYMENT_EVIDENCE_SUPERSEDED_BY_IMMUTABLE check.
create or replace function entitlement.reject_payment_evidence_rewrite()
returns trigger
language plpgsql
set search_path = pg_catalog, entitlement
as $$
declare
  v_target_order uuid;
  v_walk uuid;
  v_depth integer := 0;
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
  if NEW.superseded_by is not null and OLD.superseded_by is null then
    select order_id into v_target_order
    from entitlement.payment_evidence where id = NEW.superseded_by;
    if v_target_order is null then
      raise exception 'PAYMENT_EVIDENCE_SUPERSEDED_BY_NOT_FOUND';
    end if;
    if v_target_order is distinct from NEW.order_id then
      raise exception 'PAYMENT_EVIDENCE_SUPERSEDED_BY_ORDER_MISMATCH';
    end if;
    v_walk := NEW.superseded_by;
    while v_walk is not null and v_depth < 50 loop
      if v_walk = NEW.id then
        raise exception 'PAYMENT_EVIDENCE_SUPERSEDED_BY_CYCLE';
      end if;
      select superseded_by into v_walk from entitlement.payment_evidence where id = v_walk;
      v_depth := v_depth + 1;
    end loop;
    if v_depth >= 50 then
      raise exception 'PAYMENT_EVIDENCE_SUPERSEDED_BY_CHAIN_TOO_DEEP';
    end if;
  end if;
  return NEW;
end;
$$;

-- Self-review addition — revoke_evidence_id is a provenance pointer from an
-- Entitlement to the Payment Evidence that justified revoking it. Nothing
-- previously checked that this evidence actually belongs to the same
-- Order the Entitlement itself references, so a revoke could technically
-- cite evidence from a completely unrelated Order. Only checked when
-- Entitlement.order_id is set — if it is null there is no Order context to
-- compare against, and the pointer is left unconstrained (matching the
-- "must not over-constrain manual/no-context evidence" principle from D).
create or replace function entitlement.reject_entitlement_rewrite()
returns trigger
language plpgsql
set search_path = pg_catalog, entitlement
as $$
declare
  v_evidence_order uuid;
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
  if NEW.revoke_evidence_id is not null
     and OLD.revoke_evidence_id is null
     and NEW.order_id is not null then
    select order_id into v_evidence_order
    from entitlement.payment_evidence where id = NEW.revoke_evidence_id;
    if v_evidence_order is distinct from NEW.order_id then
      raise exception 'ENTITLEMENT_REVOKE_EVIDENCE_ORDER_MISMATCH';
    end if;
  end if;
  return NEW;
end;
$$;

comment on function entitlement.reject_entitlement_rewrite() is
  'Locks grant scope immutable; allows only one-directional active -> revoked; seals revocation provenance once set. Also requires (self-review addition) that when both revoke_evidence_id and order_id are present, the cited evidence actually belongs to the same Order — prevents a revoke citing evidence from an unrelated Order.';

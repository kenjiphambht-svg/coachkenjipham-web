-- 20260813135325 · WO-LAUNCH-CORE-03: Payment Evidence + Entitlement Foundation
-- Minimum provider-neutral substrate for two DIFFERENT canonical truths:
-- (A) Payment Evidence — a factual record that a payment-related event was
--     observed, with a technical recorded/verified/invalidated lifecycle.
-- (B) Entitlement — the canonical access-right truth, grant/expire/revoke.
-- Payment Evidence existing NEVER automatically grants Entitlement in this
-- WO — that orchestration rule waits for an approved Product/Payment
-- business contract. No price, refund, tax, checkout, or provider
-- activation is introduced here. Built on top of the merged identity and
-- commerce schemas; does not modify either.

create schema if not exists entitlement;

revoke all on schema entitlement from public, anon, authenticated;
grant usage on schema entitlement to service_role;

create or replace function entitlement.set_updated_at()
returns trigger
language plpgsql
set search_path = pg_catalog, entitlement
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function entitlement.set_updated_at() from public, anon, authenticated;

-- Shared delete guard, reused by every history/evidence/entitlement table
-- below. No ordinary DELETE grant is issued anywhere in this schema either,
-- so this is defense in depth, not the only protection.
create or replace function entitlement.reject_delete()
returns trigger
language plpgsql
set search_path = pg_catalog, entitlement
as $$
begin
  raise exception 'ENTITLEMENT_ROW_DELETE_REJECTED: %', TG_TABLE_NAME;
end;
$$;

revoke all on function entitlement.reject_delete() from public, anon, authenticated;

-- Dedicated audit-row guard (same naming/shape as identity.reject_audit_mutation
-- and commerce.reject_immutable_mutation): raised on either UPDATE or DELETE,
-- kept separate from reject_delete() so the error code stays accurate for an
-- audit-row mutation attempt rather than reusing a delete-specific message.
create or replace function entitlement.reject_audit_mutation()
returns trigger
language plpgsql
set search_path = pg_catalog, entitlement
as $$
begin
  raise exception 'ENTITLEMENT_AUDIT_EVENTS_IMMUTABLE';
end;
$$;

revoke all on function entitlement.reject_audit_mutation() from public, anon, authenticated;

-- =========================================================================
-- Audit substrate (defined first, same insert-only/immutable shape as
-- identity.audit_events and commerce.audit_events, kept schema-local).
-- =========================================================================

create table entitlement.audit_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null check (char_length(event_type) between 1 and 200),
  entity_type text not null check (char_length(entity_type) between 1 and 100),
  entity_id uuid,
  actor_type text not null default 'system' check (actor_type in (
    'system', 'service', 'founder', 'authenticated_user', 'anonymous'
  )),
  actor_id uuid,
  occurred_at timestamptz not null default now(),
  correlation_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

comment on table entitlement.audit_events is
  'Immutable operational audit substrate for sensitive payment-evidence/entitlement mutations. Rows are insert-only: update and delete are rejected by trigger regardless of role. metadata must never contain secrets, raw tokens, raw provider payload, or child-sensitive content.';

create index entitlement_audit_events_entity_idx on entitlement.audit_events(entity_type, entity_id);
create index entitlement_audit_events_occurred_idx on entitlement.audit_events(occurred_at desc);

create trigger entitlement_audit_events_block_update
  before update on entitlement.audit_events
  for each row execute function entitlement.reject_audit_mutation();
create trigger entitlement_audit_events_block_delete
  before delete on entitlement.audit_events
  for each row execute function entitlement.reject_audit_mutation();

create or replace function entitlement.log_audit_event()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, entitlement
as $$
declare
  v_entity_type text := TG_TABLE_NAME;
  v_entity_id uuid;
begin
  v_entity_id := coalesce((to_jsonb(new)->>'id')::uuid, (to_jsonb(old)->>'id')::uuid);
  insert into entitlement.audit_events (event_type, entity_type, entity_id, actor_type, metadata)
  values (
    v_entity_type || '.' || lower(TG_OP), v_entity_type, v_entity_id, 'service',
    jsonb_build_object('operation', TG_OP)
  );
  return coalesce(new, old);
end;
$$;

revoke all on function entitlement.log_audit_event() from public, anon, authenticated;

-- =========================================================================
-- A. Payment Evidence — provider-neutral, history-preserving factual record.
-- Every factual field is immutable after creation. Only verification_status
-- may transition, one-directionally: recorded -> verified -> invalidated,
-- or recorded -> invalidated directly. invalidated is terminal. A
-- correction is a NEW evidence row with superseded_by pointing forward from
-- the old (now invalidated) row — the old row's substance is never edited.
-- =========================================================================

create table entitlement.payment_evidence (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references commerce.orders(id) on delete restrict,
  source_kind text not null check (source_kind in (
    'manual_report', 'bank_statement', 'provider_webhook',
    'provider_api_confirmation', 'admin_attestation'
  )),
  provider_key text check (provider_key is null or provider_key ~ '^[a-z][a-z0-9_]{1,79}$'),
  external_reference text check (external_reference is null or char_length(external_reference) between 1 and 300),
  idempotency_key text not null unique check (char_length(idempotency_key) between 1 and 300),
  observed_at timestamptz not null,
  recorded_at timestamptz not null default now(),
  amount numeric(12, 2) check (amount is null or amount >= 0),
  currency text check (currency is null or currency ~ '^[A-Z]{3}$'),
  payload_digest text check (payload_digest is null or char_length(payload_digest) between 1 and 128),
  metadata jsonb not null default '{}'::jsonb,
  verification_status text not null default 'recorded' check (verification_status in (
    'recorded', 'verified', 'invalidated'
  )),
  superseded_by uuid references entitlement.payment_evidence(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint payment_evidence_amount_currency_pair check ((amount is null) = (currency is null)),
  constraint payment_evidence_metadata_bounded check (octet_length(metadata::text) <= 4000),
  constraint payment_evidence_no_self_supersede check (superseded_by is distinct from id),
  constraint payment_evidence_superseded_requires_invalidated check (
    superseded_by is null or verification_status = 'invalidated'
  )
);

comment on table entitlement.payment_evidence is
  'Provider-neutral factual evidence that a payment-related event was observed for an Order. Not business revenue truth by itself. No raw payment secret/token and no full raw provider payload is stored — payload_digest is a safe pointer/hash only, and metadata is bounded to 4KB. All factual fields are immutable after creation; only verification_status may progress recorded -> verified -> invalidated (invalidated is terminal). A correction inserts a new row and sets superseded_by on the old, now-invalidated row.';

create index payment_evidence_order_idx on entitlement.payment_evidence(order_id);
create index payment_evidence_status_idx on entitlement.payment_evidence(verification_status);

create trigger payment_evidence_set_updated_at
  before update on entitlement.payment_evidence
  for each row execute function entitlement.set_updated_at();

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

revoke all on function entitlement.reject_payment_evidence_rewrite() from public, anon, authenticated;

create trigger payment_evidence_block_rewrite
  before update on entitlement.payment_evidence
  for each row execute function entitlement.reject_payment_evidence_rewrite();
create trigger payment_evidence_block_delete
  before delete on entitlement.payment_evidence
  for each row execute function entitlement.reject_delete();
create trigger payment_evidence_audit
  after insert or update on entitlement.payment_evidence
  for each row execute function entitlement.log_audit_event();

-- =========================================================================
-- B. Entitlement — canonical access-right truth. Grant scope (who/what) is
-- fixed at creation; only status/revocation fields may transition, and only
-- one-directionally (active -> revoked). Existing Payment Evidence rows are
-- never auto-consumed to create an Entitlement — grants happen through an
-- explicit, separate call.
-- =========================================================================

create table entitlement.entitlements (
  id uuid primary key default gen_random_uuid(),
  person_id uuid not null references identity.persons(id) on delete restrict,
  product_id uuid not null references commerce.products(id) on delete restrict,
  product_version_id uuid references commerce.product_versions(id) on delete restrict,
  journey_anchor_id uuid references commerce.product_journey_anchors(id) on delete restrict,
  order_id uuid references commerce.orders(id) on delete restrict,
  grant_key text not null unique check (char_length(grant_key) between 1 and 300),
  status text not null default 'active' check (status in ('active', 'revoked')),
  valid_from timestamptz not null default now(),
  valid_until timestamptz check (valid_until is null or valid_until > valid_from),
  revoked_at timestamptz,
  revoke_reason text check (revoke_reason is null or char_length(revoke_reason) between 1 and 300),
  revoke_source text check (revoke_source is null or char_length(revoke_source) between 1 and 200),
  revoke_evidence_id uuid references entitlement.payment_evidence(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint entitlements_revoked_requires_revoked_at check (
    (status = 'revoked' and revoked_at is not null) or status = 'active'
  ),
  constraint entitlements_version_belongs_to_product
    foreign key (product_version_id, product_id) references commerce.product_versions(id, product_id)
);

comment on table entitlement.entitlements is
  'Canonical access-right truth: who (person_id) may access what (product_id, optionally scoped to a Product Version and/or a Product Journey Anchor), from when, until when, and current status. Grant scope is immutable after creation; only status/revocation may transition, and only active -> revoked (never back). Payment Evidence existing does not by itself create or imply an Entitlement.';

create index entitlements_person_idx on entitlement.entitlements(person_id);
create index entitlements_product_idx on entitlement.entitlements(product_id);
create index entitlements_journey_idx on entitlement.entitlements(journey_anchor_id);
create index entitlements_order_idx on entitlement.entitlements(order_id);
create index entitlements_active_scope_idx
  on entitlement.entitlements(person_id, product_id) where status = 'active';

create trigger entitlements_set_updated_at
  before update on entitlement.entitlements
  for each row execute function entitlement.set_updated_at();

-- Scope integrity: if a Journey Anchor or Order is referenced, it must
-- really belong to the same person_id/product_id being granted. Checked at
-- insert time via explicit lookups rather than altering the already-applied
-- commerce tables with new composite keys.
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

revoke all on function entitlement.validate_entitlement_scope() from public, anon, authenticated;

create trigger entitlements_validate_scope
  before insert on entitlement.entitlements
  for each row execute function entitlement.validate_entitlement_scope();

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

revoke all on function entitlement.reject_entitlement_rewrite() from public, anon, authenticated;

create trigger entitlements_block_rewrite
  before update on entitlement.entitlements
  for each row execute function entitlement.reject_entitlement_rewrite();
create trigger entitlements_block_delete
  before delete on entitlement.entitlements
  for each row execute function entitlement.reject_delete();
create trigger entitlements_audit
  after insert or update on entitlement.entitlements
  for each row execute function entitlement.log_audit_event();

-- Read model: expiry/active status computed at read time from the time
-- boundary, so nothing needs a background job to "expire" a row.
create view entitlement.entitlement_access as
select
  e.*,
  (
    e.status = 'active'
    and e.valid_from <= now()
    and (e.valid_until is null or e.valid_until > now())
  ) as is_currently_active
from entitlement.entitlements e;

comment on view entitlement.entitlement_access is
  'Read model computing current access from the stored time boundary and status — expiry and revocation are both reflected without any background job. service_role only.';

revoke all on entitlement.entitlement_access from public, anon, authenticated;
grant select on entitlement.entitlement_access to service_role;

-- Fail-closed object-level access check: any non-matching case (wrong
-- person, wrong product, expired, revoked, or no row at all) returns false.
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

-- =========================================================================
-- Security: deny-by-default RLS on every table, no browser-role grants.
-- No DELETE is granted anywhere in this schema; payment_evidence,
-- entitlements, and audit_events are additionally hard-blocked by trigger.
-- =========================================================================

alter table entitlement.payment_evidence enable row level security;
alter table entitlement.payment_evidence force row level security;
alter table entitlement.entitlements enable row level security;
alter table entitlement.entitlements force row level security;
alter table entitlement.audit_events enable row level security;
alter table entitlement.audit_events force row level security;

revoke all on entitlement.payment_evidence, entitlement.entitlements, entitlement.audit_events
  from public, anon, authenticated;

grant select, insert, update on entitlement.payment_evidence to service_role;
grant select, insert, update on entitlement.entitlements to service_role;
grant select, insert on entitlement.audit_events to service_role;

-- =========================================================================
-- C. Product & Services read model — extend commerce.product_summary only
-- with counts whose semantics are already proven by this migration. No
-- revenue/profit/refund/conversion metric is added.
-- =========================================================================

create or replace view commerce.product_summary as
select
  p.id as product_id,
  p.product_key,
  p.display_name,
  count(distinct o.id) as order_count,
  count(distinct pja.id) as journey_count,
  count(distinct pja.id) filter (where pja.status = 'open') as open_journey_count,
  count(distinct verified.order_id) as orders_with_verified_payment_evidence_count,
  count(distinct active_ent.id) as active_entitlement_count
from commerce.products p
left join commerce.orders o on o.product_id = p.id
left join commerce.product_journey_anchors pja on pja.product_id = p.id
left join lateral (
  select distinct pe.order_id
  from entitlement.payment_evidence pe
  join commerce.orders o2 on o2.id = pe.order_id
  where o2.product_id = p.id
    and pe.verification_status = 'verified'
    and pe.superseded_by is null
) verified on true
left join entitlement.entitlements active_ent
  on active_ent.product_id = p.id
  and active_ent.status = 'active'
  and active_ent.valid_from <= now()
  and (active_ent.valid_until is null or active_ent.valid_until > now())
group by p.id, p.product_key, p.display_name;

comment on view commerce.product_summary is
  'Backend read model for the future Founder Product & Services View: identity/name, order_count, journey_count, open_journey_count, orders_with_verified_payment_evidence_count, active_entitlement_count. Deliberately excludes revenue/profit/refund/conversion metrics — those require an approved business contract. service_role only; not exposed to any browser role.';

revoke all on commerce.product_summary from public, anon, authenticated;
grant select on commerce.product_summary to service_role;

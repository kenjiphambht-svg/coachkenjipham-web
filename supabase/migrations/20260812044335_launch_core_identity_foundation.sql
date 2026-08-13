-- 20260812044335 · WO-LAUNCH-CORE-01: Identity + Relationship Foundation
-- Minimum operational-core substrate: a canonical Person is not the same thing as an
-- auth account, a customer, or a child/subject. This migration only answers who a
-- person is, which auth account maps to them, what customer relationship (if any)
-- ESSENCE has with them, what person-to-person relationships exist, minimal
-- consent/evidence, and an immutable audit trail for sensitive mutations.
-- No order/payment/entitlement/product state, no child profile payload, no
-- Founder Console, no browser/authenticated grants are introduced here.

create schema if not exists identity;

revoke all on schema identity from public, anon, authenticated;
grant usage on schema identity to service_role;

create or replace function identity.set_updated_at()
returns trigger
language plpgsql
set search_path = pg_catalog, identity
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function identity.set_updated_at() from public, anon, authenticated;

-- =========================================================================
-- A. Person — canonical human entity known to ESSENCE.
-- Deliberately minimal: no auth coupling, no product/customer state, no
-- child-sensitive profile payload. A person may exist before any account,
-- relationship, or customer status is attached.
-- =========================================================================

create table identity.persons (
  id uuid primary key default gen_random_uuid(),
  display_label text check (display_label is null or char_length(display_label) between 1 and 200),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table identity.persons is
  'Canonical human entity known to ESSENCE. Not coupled to an auth account, a customer relationship, or child-sensitive profile content. A person may exist before any account or relationship is attached. display_label is an optional, non-sensitive internal reference label only.';

create trigger persons_set_updated_at
  before update on identity.persons
  for each row execute function identity.set_updated_at();

-- =========================================================================
-- B. Account Link — maps a Supabase Auth identity to a Person.
-- auth.users.id is never treated as the Person primary key. A person can
-- change auth accounts over time without changing their canonical identity.
-- =========================================================================

create table identity.account_links (
  id uuid primary key default gen_random_uuid(),
  person_id uuid not null references identity.persons(id) on delete restrict,
  auth_user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'revoked')),
  linked_at timestamptz not null default now(),
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint account_links_revoked_at_requires_status check (
    (status = 'revoked' and revoked_at is not null)
    or (status = 'active' and revoked_at is null)
  )
);

comment on table identity.account_links is
  'Server-controlled mapping between auth.users.id and a canonical Person. auth.users.id is never the Person primary key, so an account can change without changing identity. Mutation is service-role only in this WO.';

-- Prevents accidentally binding one auth account, or one person, to more than
-- one ACTIVE link at the same time. Historical (revoked) links are allowed to
-- accumulate for audit/recovery.
create unique index account_links_one_active_per_auth_user_idx
  on identity.account_links(auth_user_id) where status = 'active';
create unique index account_links_one_active_per_person_idx
  on identity.account_links(person_id) where status = 'active';
create index account_links_person_idx on identity.account_links(person_id);

create trigger account_links_set_updated_at
  before update on identity.account_links
  for each row execute function identity.set_updated_at();

-- =========================================================================
-- C. Customer Relationship — history-aware fact of a customer relationship,
-- not a boolean flag on Person. A person can be a customer at one point in
-- time and not a customer later; history is preserved, not overwritten.
-- =========================================================================

create table identity.customer_relationships (
  id uuid primary key default gen_random_uuid(),
  person_id uuid not null references identity.persons(id) on delete restrict,
  status text not null default 'active' check (status in ('active', 'ended')),
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  source_reference text check (source_reference is null or char_length(source_reference) between 1 and 300),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint customer_relationships_ended_at_requires_status check (
    (status = 'ended' and ended_at is not null and ended_at >= started_at)
    or (status = 'active' and ended_at is null)
  )
);

comment on table identity.customer_relationships is
  'History-aware record of a customer relationship ESSENCE has or had with a Person. There is no is_customer boolean on Person by design; a person can move in and out of customer status over time. source_reference is a free-text evidence pointer only, not a product/order model.';

-- A person can have many historical (ended) customer relationships, but only
-- one ACTIVE one at a time — the impossible-lifecycle guard.
create unique index customer_relationships_one_active_per_person_idx
  on identity.customer_relationships(person_id) where status = 'active';
create index customer_relationships_person_idx on identity.customer_relationships(person_id);

create trigger customer_relationships_set_updated_at
  before update on identity.customer_relationships
  for each row execute function identity.set_updated_at();

-- =========================================================================
-- D. Person Relationship — constrained, directional person-to-person
-- relationship substrate. Only parent_or_guardian is enabled in this WO;
-- additional kinds require a future migration, not free text.
-- =========================================================================

create table identity.person_relationships (
  id uuid primary key default gen_random_uuid(),
  from_person_id uuid not null references identity.persons(id) on delete restrict,
  to_person_id uuid not null references identity.persons(id) on delete restrict,
  relationship_kind text not null check (relationship_kind in ('parent_or_guardian')),
  status text not null default 'active' check (status in ('active', 'ended')),
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint person_relationships_no_self_relation check (from_person_id <> to_person_id),
  constraint person_relationships_ended_at_requires_status check (
    (status = 'ended' and ended_at is not null and ended_at >= started_at)
    or (status = 'active' and ended_at is null)
  ),
  unique (from_person_id, to_person_id, relationship_kind)
);

comment on table identity.person_relationships is
  'Directional, kind-constrained person-to-person relationship substrate. For relationship_kind = parent_or_guardian, from_person_id holds the guardian role and to_person_id is the subject. No child-sensitive profile content is stored here — this table only records that a relationship exists.';

create index person_relationships_from_idx on identity.person_relationships(from_person_id);
create index person_relationships_to_idx on identity.person_relationships(to_person_id);

create trigger person_relationships_set_updated_at
  before update on identity.person_relationships
  for each row execute function identity.set_updated_at();

-- =========================================================================
-- E. Consent / Evidence — minimal substrate to prove who gave consent, for
-- what scope, when, with what evidence, and its current lifecycle state.
-- No Hạt Mầm Safe Form business fields or consent wording are defined here;
-- product contracts define exact requirements later.
-- =========================================================================

create table identity.consent_records (
  id uuid primary key default gen_random_uuid(),
  person_id uuid not null references identity.persons(id) on delete restrict,
  scope_kind text not null check (char_length(scope_kind) between 1 and 100),
  scope_reference text check (scope_reference is null or char_length(scope_reference) between 1 and 300),
  given_at timestamptz not null default now(),
  evidence_kind text not null check (evidence_kind in (
    'form_submission', 'verbal_recorded', 'written_record', 'system_generated'
  )),
  evidence_reference text check (evidence_reference is null or char_length(evidence_reference) between 1 and 300),
  status text not null default 'active' check (status in ('active', 'revoked')),
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint consent_records_revoked_at_requires_status check (
    (status = 'revoked' and revoked_at is not null)
    or (status = 'active' and revoked_at is null)
  )
);

comment on table identity.consent_records is
  'Minimal consent/evidence primitive: who (person_id), for what scope (scope_kind/scope_reference), when (given_at), what evidence (evidence_kind/evidence_reference), and lifecycle (active/revoked). Records evidence only — exact consent wording and business requirements are defined by product contracts, not by this schema.';

create index consent_records_person_idx on identity.consent_records(person_id);

create trigger consent_records_set_updated_at
  before update on identity.consent_records
  for each row execute function identity.set_updated_at();

-- =========================================================================
-- F. Audit Event Foundation — immutable operational audit substrate for
-- sensitive identity/relationship mutations. Rows cannot be updated or
-- deleted through triggers, regardless of role grants.
-- =========================================================================

create table identity.audit_events (
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

comment on table identity.audit_events is
  'Immutable operational audit substrate for sensitive identity/relationship mutations. Rows are insert-only: update and delete are rejected by trigger regardless of role. metadata must never contain secrets, raw tokens, password material, or unnecessary child-sensitive content.';

create index audit_events_entity_idx on identity.audit_events(entity_type, entity_id);
create index audit_events_occurred_idx on identity.audit_events(occurred_at desc);

create or replace function identity.reject_audit_mutation()
returns trigger
language plpgsql
set search_path = pg_catalog, identity
as $$
begin
  raise exception 'AUDIT_EVENTS_IMMUTABLE';
end;
$$;

revoke all on function identity.reject_audit_mutation() from public, anon, authenticated;

create trigger audit_events_block_update
  before update on identity.audit_events
  for each row execute function identity.reject_audit_mutation();
create trigger audit_events_block_delete
  before delete on identity.audit_events
  for each row execute function identity.reject_audit_mutation();

-- Generic mutation logger for the sensitive tables above. Pure plumbing: it
-- records that a row of a given type changed, not any business meaning.
create or replace function identity.log_audit_event()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, identity
as $$
declare
  v_entity_type text := TG_TABLE_NAME;
  v_entity_id uuid;
begin
  v_entity_id := coalesce((to_jsonb(new)->>'id')::uuid, (to_jsonb(old)->>'id')::uuid);
  insert into identity.audit_events (event_type, entity_type, entity_id, actor_type, metadata)
  values (
    v_entity_type || '.' || lower(TG_OP), v_entity_type, v_entity_id, 'service',
    jsonb_build_object('operation', TG_OP)
  );
  return coalesce(new, old);
end;
$$;

revoke all on function identity.log_audit_event() from public, anon, authenticated;

create trigger account_links_audit
  after insert or update on identity.account_links
  for each row execute function identity.log_audit_event();
create trigger customer_relationships_audit
  after insert or update on identity.customer_relationships
  for each row execute function identity.log_audit_event();
create trigger person_relationships_audit
  after insert or update on identity.person_relationships
  for each row execute function identity.log_audit_event();
create trigger consent_records_audit
  after insert or update on identity.consent_records
  for each row execute function identity.log_audit_event();

-- =========================================================================
-- Security: deny-by-default RLS on every table, no browser-role grants.
-- service_role bypasses RLS at the Postgres role level (Supabase default)
-- and is the only role with table privileges in this WO. Future customer
-- access must go through explicit safe interfaces/views/RPCs, not direct
-- table grants — none are added here.
-- =========================================================================

alter table identity.persons enable row level security;
alter table identity.persons force row level security;
alter table identity.account_links enable row level security;
alter table identity.account_links force row level security;
alter table identity.customer_relationships enable row level security;
alter table identity.customer_relationships force row level security;
alter table identity.person_relationships enable row level security;
alter table identity.person_relationships force row level security;
alter table identity.consent_records enable row level security;
alter table identity.consent_records force row level security;
alter table identity.audit_events enable row level security;
alter table identity.audit_events force row level security;

revoke all on identity.persons, identity.account_links, identity.customer_relationships,
  identity.person_relationships, identity.consent_records, identity.audit_events
  from public, anon, authenticated;

grant select, insert, update, delete on identity.persons, identity.account_links,
  identity.customer_relationships, identity.person_relationships, identity.consent_records
  to service_role;

-- Audit rows are insert/read only for every role, including service_role.
-- Update/delete are further rejected by trigger above regardless of grant.
grant select, insert on identity.audit_events to service_role;

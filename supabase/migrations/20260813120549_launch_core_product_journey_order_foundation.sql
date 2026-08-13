-- 20260813120549 · WO-LAUNCH-CORE-02: Product + Journey + Order Foundation
-- Minimum operational-core substrate for what ESSENCE sells, that a Person is
-- on a shared journey with a product, and that an order was placed — nothing
-- about payment, refund, entitlement, price, tax, or product-specific state
-- machines (Lặng/Hạt Mầm) is introduced here. Built on top of the merged
-- identity schema (WO-LAUNCH-CORE-01); does not modify it.

create schema if not exists commerce;

revoke all on schema commerce from public, anon, authenticated;
grant usage on schema commerce to service_role;

create or replace function commerce.set_updated_at()
returns trigger
language plpgsql
set search_path = pg_catalog, commerce
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function commerce.set_updated_at() from public, anon, authenticated;

-- Shared immutability guard, reused by every table below that must never be
-- edited or removed after creation. Raises with the offending table name so
-- one function serves all of them without per-table duplication.
create or replace function commerce.reject_immutable_mutation()
returns trigger
language plpgsql
set search_path = pg_catalog, commerce
as $$
begin
  raise exception 'COMMERCE_ROW_IMMUTABLE: %', TG_TABLE_NAME;
end;
$$;

revoke all on function commerce.reject_immutable_mutation() from public, anon, authenticated;

-- =========================================================================
-- F (foundation for the audit substrate, defined first so every domain
-- table below can be audited from creation — this is the lesson carried
-- over from the WO-LAUNCH-CORE-01 review, where Person auditing had to be
-- added after the fact). Same shape and immutability model as
-- identity.audit_events, kept schema-local rather than shared cross-schema.
-- =========================================================================

create table commerce.audit_events (
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

comment on table commerce.audit_events is
  'Immutable operational audit substrate for sensitive product/journey/order mutations. Rows are insert-only: update and delete are rejected by trigger regardless of role. metadata must never contain secrets, raw tokens, or child-sensitive content.';

create index commerce_audit_events_entity_idx on commerce.audit_events(entity_type, entity_id);
create index commerce_audit_events_occurred_idx on commerce.audit_events(occurred_at desc);

create trigger commerce_audit_events_block_update
  before update on commerce.audit_events
  for each row execute function commerce.reject_immutable_mutation();
create trigger commerce_audit_events_block_delete
  before delete on commerce.audit_events
  for each row execute function commerce.reject_immutable_mutation();

-- Generic mutation logger for the domain tables below. Pure plumbing: it
-- records that a row of a given type changed, not any business meaning.
create or replace function commerce.log_audit_event()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, commerce
as $$
declare
  v_entity_type text := TG_TABLE_NAME;
  v_entity_id uuid;
begin
  v_entity_id := coalesce((to_jsonb(new)->>'id')::uuid, (to_jsonb(old)->>'id')::uuid);
  insert into commerce.audit_events (event_type, entity_type, entity_id, actor_type, metadata)
  values (
    v_entity_type || '.' || lower(TG_OP), v_entity_type, v_entity_id, 'service',
    jsonb_build_object('operation', TG_OP)
  );
  return coalesce(new, old);
end;
$$;

revoke all on function commerce.log_audit_event() from public, anon, authenticated;

-- =========================================================================
-- A. Product — generic catalog substrate. A stable product_key identifies a
-- product across time even if display_name changes. This table does not
-- enumerate any specific product names/kinds — new products are new rows,
-- never new schema.
-- =========================================================================

create table commerce.products (
  id uuid primary key default gen_random_uuid(),
  product_key text not null unique check (product_key ~ '^[a-z][a-z0-9_]{1,79}$'),
  display_name text not null check (char_length(display_name) between 1 and 200),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table commerce.products is
  'Generic catalog substrate. product_key is a stable, product-agnostic identity; display_name is the only descriptive field. No price, offer, or product-specific business rule lives here. Products are never hardcoded in schema.';

create trigger products_set_updated_at
  before update on commerce.products
  for each row execute function commerce.set_updated_at();
create trigger products_audit
  after insert or update on commerce.products
  for each row execute function commerce.log_audit_event();

-- =========================================================================
-- B. Product Version — immutable version identity tied to a Product.
-- Every version that ever existed remains queryable forever; nothing about
-- price, refund, or offer terms is recorded here.
-- =========================================================================

create table commerce.product_versions (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references commerce.products(id) on delete restrict,
  version_label text not null check (char_length(version_label) between 1 and 100),
  created_at timestamptz not null default now(),
  unique (product_id, version_label),
  -- lets other tables enforce "this version really belongs to this product"
  -- via a composite foreign key, without a trigger.
  unique (id, product_id)
);

comment on table commerce.product_versions is
  'Immutable version identity for a Product. Insert-only: update and delete are rejected by trigger, so every historical version stays reproducible. No price/refund/offer terms are stored here.';

create index product_versions_product_idx on commerce.product_versions(product_id);

create trigger product_versions_block_update
  before update on commerce.product_versions
  for each row execute function commerce.reject_immutable_mutation();
create trigger product_versions_block_delete
  before delete on commerce.product_versions
  for each row execute function commerce.reject_immutable_mutation();
create trigger product_versions_audit
  after insert on commerce.product_versions
  for each row execute function commerce.log_audit_event();

-- =========================================================================
-- C. Product Journey Anchor — canonical reference connecting a Person to a
-- Product (and optionally a specific Product Version), carrying only shared
-- open/closed lifecycle evidence. No Lặng- or Hạt Mầm-specific state, and no
-- mega customer_status: this is deliberately the smallest possible anchor.
-- =========================================================================

create table commerce.product_journey_anchors (
  id uuid primary key default gen_random_uuid(),
  person_id uuid not null references identity.persons(id) on delete restrict,
  product_id uuid not null references commerce.products(id) on delete restrict,
  product_version_id uuid references commerce.product_versions(id) on delete restrict,
  status text not null default 'open' check (status in ('open', 'closed')),
  opened_at timestamptz not null default now(),
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint product_journey_anchors_closed_at_requires_status check (
    (status = 'closed' and closed_at is not null and closed_at >= opened_at)
    or (status = 'open' and closed_at is null)
  ),
  constraint product_journey_anchors_version_belongs_to_product
    foreign key (product_version_id, product_id) references commerce.product_versions(id, product_id)
);

comment on table commerce.product_journey_anchors is
  'Canonical shared anchor connecting a Person to a Product (and optionally a specific Product Version). Only generic open/closed lifecycle evidence is recorded — no Lặng/Hạt Mầm state machine and no mega customer_status. Product-specific journey detail belongs to a later, product-scoped WO.';

-- Only one OPEN journey per person+product at a time; unlimited historical
-- (closed) ones — same active-only discipline as the identity schema.
create unique index product_journey_anchors_one_open_per_person_product_idx
  on commerce.product_journey_anchors(person_id, product_id) where status = 'open';
create index product_journey_anchors_person_idx on commerce.product_journey_anchors(person_id);
create index product_journey_anchors_product_idx on commerce.product_journey_anchors(product_id);

create trigger product_journey_anchors_set_updated_at
  before update on commerce.product_journey_anchors
  for each row execute function commerce.set_updated_at();
create trigger product_journey_anchors_audit
  after insert or update on commerce.product_journey_anchors
  for each row execute function commerce.log_audit_event();

-- =========================================================================
-- D. Order — canonical, idempotent record that a buyer Person ordered a
-- specific Product Version. No payment, refund, provider, price, or
-- entitlement logic. Insert-only: an order is not edited after creation in
-- this WO (order-level lifecycle, if any, is a later WO once real payment
-- evidence exists).
-- =========================================================================

create table commerce.orders (
  id uuid primary key default gen_random_uuid(),
  buyer_person_id uuid not null references identity.persons(id) on delete restrict,
  product_id uuid not null references commerce.products(id) on delete restrict,
  product_version_id uuid not null references commerce.product_versions(id) on delete restrict,
  idempotency_key text not null unique check (char_length(idempotency_key) between 1 and 300),
  created_at timestamptz not null default now(),
  constraint orders_version_belongs_to_product
    foreign key (product_version_id, product_id) references commerce.product_versions(id, product_id)
);

comment on table commerce.orders is
  'Canonical, idempotent record that a buyer Person ordered a specific Product Version. idempotency_key is unique so a retried request cannot create a duplicate order. No payment/refund/provider/price/entitlement field exists here or anywhere in this WO.';

create index orders_buyer_idx on commerce.orders(buyer_person_id);
create index orders_product_idx on commerce.orders(product_id);
create index orders_product_version_idx on commerce.orders(product_version_id);

create trigger orders_block_update
  before update on commerce.orders
  for each row execute function commerce.reject_immutable_mutation();
create trigger orders_block_delete
  before delete on commerce.orders
  for each row execute function commerce.reject_immutable_mutation();
create trigger orders_audit
  after insert on commerce.orders
  for each row execute function commerce.log_audit_event();

-- =========================================================================
-- E. Immutable Order Snapshot — preserves exactly what was recorded at
-- order time. product/product_version identity is reached through order_id
-- (itself immutable), so it is not duplicated here; snapshot is a bounded,
-- versioned JSON bucket for configuration only. Never a place for secrets,
-- raw PII, or child-sensitive payload.
-- =========================================================================

create table commerce.order_snapshots (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references commerce.orders(id) on delete restrict,
  snapshot_schema_version integer not null default 1 check (snapshot_schema_version >= 1),
  snapshot jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint order_snapshots_bounded_payload check (octet_length(snapshot::text) <= 8000)
);

comment on table commerce.order_snapshots is
  'Immutable, one-per-order snapshot of order-time configuration. Insert-only: update and delete are rejected by trigger. Bounded to 8KB and versioned via snapshot_schema_version. Must never contain secrets, raw tokens, or child-sensitive payload — this is a structural bucket, not a place to dump arbitrary data.';

create trigger order_snapshots_block_update
  before update on commerce.order_snapshots
  for each row execute function commerce.reject_immutable_mutation();
create trigger order_snapshots_block_delete
  before delete on commerce.order_snapshots
  for each row execute function commerce.reject_immutable_mutation();
create trigger order_snapshots_audit
  after insert on commerce.order_snapshots
  for each row execute function commerce.log_audit_event();

-- =========================================================================
-- F. Product Summary — backend read model preparing the counts a future
-- Founder Product & Services View will need. No paid_count/revenue/profit:
-- those require Payment Evidence, which does not exist until WO-03.
-- =========================================================================

create view commerce.product_summary as
select
  p.id as product_id,
  p.product_key,
  p.display_name,
  count(distinct o.id) as order_count,
  count(distinct pja.id) as journey_count,
  count(distinct pja.id) filter (where pja.status = 'open') as open_journey_count
from commerce.products p
left join commerce.orders o on o.product_id = p.id
left join commerce.product_journey_anchors pja on pja.product_id = p.id
group by p.id, p.product_key, p.display_name;

comment on view commerce.product_summary is
  'Backend read model for the future Founder Product & Services View: identity/name, order_count, journey_count, open_journey_count only. Deliberately excludes paid_count/revenue/profit, which require Payment Evidence from WO-03. service_role only; not exposed to any browser role.';

-- =========================================================================
-- Security: deny-by-default RLS on every table, no browser-role grants.
-- service_role bypasses RLS at the Postgres role level (Supabase default),
-- same pattern as the identity and knowledge schemas. No DELETE is granted
-- anywhere in this WO: order/journey/version/snapshot truth (and products,
-- for consistency) cannot be ordinarily hard-deleted.
-- =========================================================================

alter table commerce.products enable row level security;
alter table commerce.products force row level security;
alter table commerce.product_versions enable row level security;
alter table commerce.product_versions force row level security;
alter table commerce.product_journey_anchors enable row level security;
alter table commerce.product_journey_anchors force row level security;
alter table commerce.orders enable row level security;
alter table commerce.orders force row level security;
alter table commerce.order_snapshots enable row level security;
alter table commerce.order_snapshots force row level security;
alter table commerce.audit_events enable row level security;
alter table commerce.audit_events force row level security;

revoke all on commerce.products, commerce.product_versions,
  commerce.product_journey_anchors, commerce.orders, commerce.order_snapshots,
  commerce.audit_events
  from public, anon, authenticated;

grant select, insert, update on commerce.products to service_role;
grant select, insert on commerce.product_versions to service_role;
grant select, insert, update on commerce.product_journey_anchors to service_role;
grant select, insert on commerce.orders to service_role;
grant select, insert on commerce.order_snapshots to service_role;
grant select, insert on commerce.audit_events to service_role;

revoke all on commerce.product_summary from public, anon, authenticated;
grant select on commerce.product_summary to service_role;

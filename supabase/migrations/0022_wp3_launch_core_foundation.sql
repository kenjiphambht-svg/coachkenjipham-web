-- 0022 · WP3 Launch Core foundation
-- Additive only. Reuses canonical Lặng/Hạt Mầm orders, snapshots, payment
-- requests, publications and audit_log. No provider is connected and every
-- release flag below starts OFF.

create table customer_identities (
  id uuid primary key default gen_random_uuid(),
  identity_code text not null unique check (identity_code ~ '^[A-Z0-9-]{8,64}$'),
  verified_email_hash text unique check (verified_email_hash is null or verified_email_hash ~ '^[a-f0-9]{64}$'),
  status text not null default 'pending_verification' check (status in ('pending_verification','active','suspended','deleted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table customer_identities is 'WP3 customer identity foundation. No raw email, child name or Admin role is stored here.';

create table customer_identity_links (
  id uuid primary key default gen_random_uuid(),
  customer_identity_id uuid not null references customer_identities(id) on delete cascade,
  auth_user_id uuid unique references auth.users(id) on delete cascade,
  linked_at timestamptz not null default now(),
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  unique(customer_identity_id, auth_user_id)
);
comment on table customer_identity_links is 'Future verified Auth binding. Admin identity remains only in admin_users.';

create table publication_versions (
  id uuid primary key default gen_random_uuid(),
  publication_id uuid not null references publications(id) on delete cascade,
  version_number integer not null check (version_number > 0),
  status text not null default 'draft' check (status in ('draft','review_pending','revision_requested','approved','superseded','revoked')),
  content_checksum_sha256 text check (content_checksum_sha256 is null or content_checksum_sha256 ~ '^[a-f0-9]{64}$'),
  template_version text,
  approved_at timestamptz,
  approved_by uuid references admin_users(id),
  delivered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(publication_id, version_number),
  constraint publication_version_approval check ((status = 'approved' and approved_at is not null and approved_by is not null) or status <> 'approved')
);
comment on table publication_versions is 'Immutable approved Hạt Mầm publication versions. Content/template version references are separate.';

create table publication_reviews (
  id uuid primary key default gen_random_uuid(),
  publication_version_id uuid not null references publication_versions(id) on delete cascade,
  reviewer_admin_id uuid not null references admin_users(id),
  decision text not null check (decision in ('request_revision','approve','revoke')),
  safe_note text,
  created_at timestamptz not null default now()
);

create table revision_requests (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references hatmam_orders(id) on delete cascade,
  publication_version_id uuid references publication_versions(id) on delete set null,
  status text not null default 'requested' check (status in ('requested','accepted','rejected','completed','expired')),
  requested_at timestamptz not null default now(),
  deadline_at timestamptz not null,
  safe_reason_code text not null default 'content_revision',
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint revision_deadline_after_request check (deadline_at >= requested_at)
);

create table product_entitlements (
  id uuid primary key default gen_random_uuid(),
  customer_identity_id uuid not null references customer_identities(id) on delete restrict,
  subject subject_type not null,
  subject_id uuid not null,
  publication_version_id uuid references publication_versions(id) on delete restrict,
  status text not null default 'pending' check (status in ('pending','active','suspended','expired','revoked','pending_deletion','deleted')),
  granted_at timestamptz,
  expires_at timestamptz,
  revoked_at timestamptz,
  revoke_reason_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(customer_identity_id, subject, subject_id),
  constraint entitlement_active_has_grant check ((status = 'active' and granted_at is not null) or status <> 'active'),
  constraint entitlement_expiry_after_grant check (expires_at is null or granted_at is null or expires_at > granted_at)
);
comment on table product_entitlements is 'Item-specific private access. A random publication token alone is never an entitlement.';

create table entitlement_status_history (
  id uuid primary key default gen_random_uuid(),
  entitlement_id uuid not null references product_entitlements(id) on delete cascade,
  from_status text,
  to_status text not null,
  actor text not null,
  reason_code text,
  created_at timestamptz not null default now()
);

create table lang_payment_evidence (
  id uuid primary key default gen_random_uuid(),
  payment_request_id uuid not null unique references lang_payment_requests(id) on delete cascade,
  evidence_kind text not null check (evidence_kind in ('synthetic_receipt','manual_receipt_metadata')),
  receipt_sha256 text not null unique check (receipt_sha256 ~ '^[a-f0-9]{64}$'),
  reported_amount_vnd bigint not null check (reported_amount_vnd >= 0),
  transfer_reference text not null,
  created_at timestamptz not null default now()
);
comment on table lang_payment_evidence is 'Manual-payment metadata only. No bank image/content/credential is stored.';

create table payment_confirmations (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid not null unique references payments(id) on delete restrict,
  subject subject_type not null,
  subject_id uuid not null,
  evidence_sha256 text not null unique check (evidence_sha256 ~ '^[a-f0-9]{64}$'),
  transfer_reference text not null,
  confirmed_by uuid not null references admin_users(id),
  confirmed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique(subject, subject_id)
);
comment on table payment_confirmations is 'Atomic manual confirmation evidence; a receipt checksum can confirm one order only.';

create table support_requests (
  id uuid primary key default gen_random_uuid(),
  customer_identity_id uuid references customer_identities(id) on delete set null,
  entitlement_id uuid references product_entitlements(id) on delete set null,
  subject subject_type not null,
  subject_id uuid not null,
  category text not null check (category in ('access','display','pdf','clarification','revision','wrong_recipient','deletion')),
  status text not null default 'received' check (status in ('received','in_review','resolved','closed')),
  safe_summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table release_flags (
  key text primary key check (key in ('lang_intake_enabled','lang_payment_enabled','lang_booking_provider_enabled','hatmam_intake_enabled','hatmam_payment_enabled','hatmam_production_enabled','private_storage_ready','customer_auth_ready','private_reading_room_enabled','pdf_generation_ready','email_provider_ready','deletion_workflow_ready','launch_core_public_enabled')),
  enabled boolean not null default false,
  updated_by uuid references admin_users(id),
  updated_at timestamptz not null default now(),
  constraint launch_core_flags_off check (enabled = false)
);
comment on table release_flags is 'WP3 fail-closed release flags. The check intentionally prevents activation in this migration.';
insert into release_flags(key) values
  ('lang_intake_enabled'),('lang_payment_enabled'),('lang_booking_provider_enabled'),
  ('hatmam_intake_enabled'),('hatmam_payment_enabled'),('hatmam_production_enabled'),
  ('private_storage_ready'),('customer_auth_ready'),('private_reading_room_enabled'),
  ('pdf_generation_ready'),('email_provider_ready'),('deletion_workflow_ready'),('launch_core_public_enabled')
on conflict (key) do nothing;

create index product_entitlements_access_idx on product_entitlements(customer_identity_id, status, expires_at);
create index publication_versions_resolution_idx on publication_versions(publication_id, status, version_number desc);
create index support_requests_subject_idx on support_requests(subject, subject_id, status);
create index revision_requests_order_idx on revision_requests(order_id, status, deadline_at);

create trigger set_updated_at before update on customer_identities for each row execute function set_updated_at();
create trigger set_updated_at before update on publication_versions for each row execute function set_updated_at();
create trigger set_updated_at before update on revision_requests for each row execute function set_updated_at();
create trigger set_updated_at before update on product_entitlements for each row execute function set_updated_at();
create trigger set_updated_at before update on support_requests for each row execute function set_updated_at();

alter table customer_identities enable row level security;
alter table customer_identities force row level security;
alter table customer_identity_links enable row level security;
alter table customer_identity_links force row level security;
alter table publication_versions enable row level security;
alter table publication_versions force row level security;
alter table publication_reviews enable row level security;
alter table publication_reviews force row level security;
alter table revision_requests enable row level security;
alter table revision_requests force row level security;
alter table product_entitlements enable row level security;
alter table product_entitlements force row level security;
alter table entitlement_status_history enable row level security;
alter table entitlement_status_history force row level security;
alter table lang_payment_evidence enable row level security;
alter table lang_payment_evidence force row level security;
alter table payment_confirmations enable row level security;
alter table payment_confirmations force row level security;
alter table support_requests enable row level security;
alter table support_requests force row level security;
alter table release_flags enable row level security;
alter table release_flags force row level security;

revoke all on customer_identities, customer_identity_links, publication_versions, publication_reviews,
  revision_requests, product_entitlements, entitlement_status_history, lang_payment_evidence,
  payment_confirmations, support_requests, release_flags from anon, authenticated;
grant select on customer_identities, customer_identity_links, publication_versions, publication_reviews,
  revision_requests, product_entitlements, entitlement_status_history, lang_payment_evidence,
  payment_confirmations, support_requests, release_flags to authenticated;

create policy wp3_customer_identities_admin_aal2 on customer_identities for select to authenticated using (app_private.is_admin() and (select auth.jwt()->>'aal') = 'aal2');
create policy wp3_customer_identity_links_admin_aal2 on customer_identity_links for select to authenticated using (app_private.is_admin() and (select auth.jwt()->>'aal') = 'aal2');
create policy wp3_publication_versions_admin_aal2 on publication_versions for select to authenticated using (app_private.is_admin() and (select auth.jwt()->>'aal') = 'aal2');
create policy wp3_publication_reviews_admin_aal2 on publication_reviews for select to authenticated using (app_private.is_admin() and (select auth.jwt()->>'aal') = 'aal2');
create policy wp3_revision_requests_admin_aal2 on revision_requests for select to authenticated using (app_private.is_admin() and (select auth.jwt()->>'aal') = 'aal2');
create policy wp3_entitlements_admin_aal2 on product_entitlements for select to authenticated using (app_private.is_admin() and (select auth.jwt()->>'aal') = 'aal2');
create policy wp3_entitlement_history_admin_aal2 on entitlement_status_history for select to authenticated using (app_private.is_admin() and (select auth.jwt()->>'aal') = 'aal2');
create policy wp3_lang_payment_evidence_admin_aal2 on lang_payment_evidence for select to authenticated using (app_private.is_admin() and (select auth.jwt()->>'aal') = 'aal2');
create policy wp3_payment_confirmations_admin_aal2 on payment_confirmations for select to authenticated using (app_private.is_admin() and (select auth.jwt()->>'aal') = 'aal2');
create policy wp3_support_requests_admin_aal2 on support_requests for select to authenticated using (app_private.is_admin() and (select auth.jwt()->>'aal') = 'aal2');
create policy wp3_release_flags_admin_aal2 on release_flags for select to authenticated using (app_private.is_admin() and (select auth.jwt()->>'aal') = 'aal2');

-- No customer policy is granted yet: a future customer session must prove the
-- verified identity link and active entitlement before it receives one.

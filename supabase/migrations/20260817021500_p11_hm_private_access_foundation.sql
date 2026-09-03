-- 20260817021500 · WO-P11-HM-SYNTHETIC-PRIVATE-TEST-01
-- P07 bounded BUILD for FD-2026-033.
--
-- SYNTHETIC / LOCAL / STAGING ONLY.
-- This migration adds the smallest provider-neutral private-access and
-- delivery-evidence substrate needed for the Founder synthetic Hạt Mầm test.
-- It does NOT activate Production, storage/provider, public delivery, payment,
-- email, care automation, Machine 02/03, or any customer-facing promise.
--
-- Core invariants:
--   URL / locator != authority.
--   Machine success != P11 Product Acceptance != access != delivery != confirmation.
--   Access is re-evaluated against exact Person + exact Entitlement + exact current
--   Artifact Version + latest exact-version P11 APPROVED/VERIFIED evidence.
--   A newer Artifact Version makes an older version stale for new access/delivery.
--   Delivery Succeeded and Customer Confirmed are separate append-only truths.
--   All ordinary browser roles are denied; the interface is service-side only.

create schema if not exists delivery;

revoke all on schema delivery from public, anon, authenticated;
grant usage on schema delivery to service_role;

-- =========================================================================
-- Shared helpers
-- =========================================================================

create or replace function delivery.set_updated_at()
returns trigger
language plpgsql
set search_path = pg_catalog
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function delivery.set_updated_at() from public, anon, authenticated;

create or replace function delivery.reject_immutable_mutation()
returns trigger
language plpgsql
set search_path = pg_catalog
as $$
begin
  raise exception 'DELIVERY_ROW_IMMUTABLE: %', TG_TABLE_NAME;
end;
$$;

revoke all on function delivery.reject_immutable_mutation() from public, anon, authenticated;

-- =========================================================================
-- A. Exact-version private access evidence
-- =========================================================================

create table delivery.private_artifact_access (
  id uuid primary key default gen_random_uuid(),
  person_id uuid not null references identity.persons(id) on delete restrict,
  entitlement_id uuid not null references entitlement.entitlements(id) on delete restrict,
  artifact_version_id uuid not null references production.artifact_versions(id) on delete restrict,
  access_contract_version text not null default '0.1'
    check (access_contract_version = '0.1'),
  environment_scope text not null default 'synthetic_staging'
    check (environment_scope = 'synthetic_staging'),
  access_correlation_reference text not null unique
    check (char_length(access_correlation_reference) between 1 and 300),
  status text not null default 'active' check (status in ('active', 'revoked')),
  valid_from timestamptz not null default now(),
  valid_until timestamptz,
  revoked_at timestamptz,
  revoke_source text check (revoke_source is null or char_length(revoke_source) between 1 and 200),
  revoke_reason text check (revoke_reason is null or char_length(revoke_reason) between 1 and 500),
  revocation_correlation_reference text
    check (revocation_correlation_reference is null or char_length(revocation_correlation_reference) between 1 and 300),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint private_artifact_access_time_order check (
    valid_until is null or valid_until > valid_from
  ),
  constraint private_artifact_access_revocation_complete check (
    (
      status = 'active'
      and revoked_at is null
      and revoke_source is null
      and revoke_reason is null
      and revocation_correlation_reference is null
    )
    or (
      status = 'revoked'
      and revoked_at is not null
      and revoke_source is not null
      and revoke_reason is not null
      and revocation_correlation_reference is not null
    )
  )
);

comment on table delivery.private_artifact_access is
  'Revocable/expirable exact-version private access evidence for the synthetic Hạt Mầm Founder test. id may be used as a locator but is never authority: every read must re-evaluate canonical Person, Entitlement, current Artifact Version and exact P11 APPROVED/VERIFIED evidence. environment_scope is intentionally locked to synthetic_staging under FD-2026-033.';

create unique index delivery_private_access_one_active_person_version_idx
  on delivery.private_artifact_access(person_id, artifact_version_id)
  where status = 'active';

create unique index delivery_private_access_revocation_correlation_idx
  on delivery.private_artifact_access(revocation_correlation_reference)
  where revocation_correlation_reference is not null;

create index delivery_private_access_entitlement_idx
  on delivery.private_artifact_access(entitlement_id);
create index delivery_private_access_version_idx
  on delivery.private_artifact_access(artifact_version_id);

create trigger delivery_private_access_set_updated_at
  before update on delivery.private_artifact_access
  for each row execute function delivery.set_updated_at();

create or replace function delivery.validate_private_access_rewrite()
returns trigger
language plpgsql
set search_path = pg_catalog
as $$
begin
  if new.person_id is distinct from old.person_id then
    raise exception 'PRIVATE_ACCESS_PERSON_IMMUTABLE';
  end if;
  if new.entitlement_id is distinct from old.entitlement_id then
    raise exception 'PRIVATE_ACCESS_ENTITLEMENT_IMMUTABLE';
  end if;
  if new.artifact_version_id is distinct from old.artifact_version_id then
    raise exception 'PRIVATE_ACCESS_ARTIFACT_VERSION_IMMUTABLE';
  end if;
  if new.access_contract_version is distinct from old.access_contract_version then
    raise exception 'PRIVATE_ACCESS_CONTRACT_IMMUTABLE';
  end if;
  if new.environment_scope is distinct from old.environment_scope then
    raise exception 'PRIVATE_ACCESS_ENVIRONMENT_IMMUTABLE';
  end if;
  if new.access_correlation_reference is distinct from old.access_correlation_reference then
    raise exception 'PRIVATE_ACCESS_CORRELATION_IMMUTABLE';
  end if;
  if new.valid_from is distinct from old.valid_from then
    raise exception 'PRIVATE_ACCESS_VALID_FROM_IMMUTABLE';
  end if;
  if new.valid_until is distinct from old.valid_until then
    raise exception 'PRIVATE_ACCESS_VALID_UNTIL_IMMUTABLE';
  end if;

  if old.status = 'revoked' and new.status is distinct from old.status then
    raise exception 'PRIVATE_ACCESS_CANNOT_UNREVOKE';
  end if;
  if old.status = 'revoked' and (
    new.revoked_at is distinct from old.revoked_at
    or new.revoke_source is distinct from old.revoke_source
    or new.revoke_reason is distinct from old.revoke_reason
    or new.revocation_correlation_reference is distinct from old.revocation_correlation_reference
  ) then
    raise exception 'PRIVATE_ACCESS_REVOCATION_IMMUTABLE';
  end if;
  if old.status = 'active' and new.status = 'active' and (
    new.revoked_at is not null
    or new.revoke_source is not null
    or new.revoke_reason is not null
    or new.revocation_correlation_reference is not null
  ) then
    raise exception 'PRIVATE_ACCESS_ACTIVE_CANNOT_HAVE_REVOCATION';
  end if;
  if old.status = 'active' and new.status = 'revoked' and (
    new.revoked_at is null
    or new.revoke_source is null
    or new.revoke_reason is null
    or new.revocation_correlation_reference is null
  ) then
    raise exception 'PRIVATE_ACCESS_REVOCATION_PROVENANCE_REQUIRED';
  end if;

  return new;
end;
$$;

revoke all on function delivery.validate_private_access_rewrite() from public, anon, authenticated;

create trigger delivery_private_access_block_rewrite
  before update on delivery.private_artifact_access
  for each row execute function delivery.validate_private_access_rewrite();

create trigger delivery_private_access_block_delete
  before delete on delivery.private_artifact_access
  for each row execute function delivery.reject_immutable_mutation();

-- Insert/update lifecycle evidence is trigger-owned so an ordinary service path
-- cannot fabricate an access-issued or access-revoked history row.
create table delivery.private_access_events (
  id uuid primary key default gen_random_uuid(),
  private_access_id uuid not null references delivery.private_artifact_access(id) on delete restrict,
  event_kind text not null check (event_kind in ('issued', 'revoked')),
  correlation_reference text not null
    check (char_length(correlation_reference) between 1 and 300),
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (event_kind, correlation_reference)
);

comment on table delivery.private_access_events is
  'Trigger-owned immutable lifecycle evidence for exact-version private access issuance/revocation. Contains only bounded IDs/state/correlation; never raw token, signed URL, secret, private content or unnecessary PII.';

create trigger delivery_private_access_events_block_update
  before update on delivery.private_access_events
  for each row execute function delivery.reject_immutable_mutation();
create trigger delivery_private_access_events_block_delete
  before delete on delivery.private_access_events
  for each row execute function delivery.reject_immutable_mutation();

create or replace function delivery.log_private_access_event()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog
as $$
begin
  if tg_op = 'INSERT' then
    insert into delivery.private_access_events (
      private_access_id, event_kind, correlation_reference, occurred_at
    ) values (
      new.id, 'issued', new.access_correlation_reference, new.created_at
    );
  elsif tg_op = 'UPDATE' and new.status is distinct from old.status and new.status = 'revoked' then
    insert into delivery.private_access_events (
      private_access_id, event_kind, correlation_reference, occurred_at
    ) values (
      new.id, 'revoked', new.revocation_correlation_reference, new.revoked_at
    );
  end if;
  return new;
end;
$$;

revoke all on function delivery.log_private_access_event() from public, anon, authenticated;

create trigger delivery_private_access_audit_insert
  after insert on delivery.private_artifact_access
  for each row execute function delivery.log_private_access_event();
create trigger delivery_private_access_audit_update
  after update on delivery.private_artifact_access
  for each row execute function delivery.log_private_access_event();

-- =========================================================================
-- B. Canonical fail-closed deliverability evaluation
-- =========================================================================

create or replace function delivery._evaluate_deliverable_version(
  p_person_id uuid,
  p_entitlement_id uuid,
  p_artifact_version_id uuid
)
returns jsonb
language plpgsql
stable
security definer
set search_path = pg_catalog
as $$
declare
  v_version production.artifact_versions%rowtype;
  v_artifact production.artifacts%rowtype;
  v_job production.jobs%rowtype;
  v_entitlement entitlement.entitlements%rowtype;
  v_review production.artifact_reviews%rowtype;
  v_html production.artifact_version_representations%rowtype;
begin
  select * into v_version
  from production.artifact_versions
  where id = p_artifact_version_id;
  if not found then
    return jsonb_build_object('eligible', false, 'reason_code', 'ARTIFACT_VERSION_NOT_FOUND');
  end if;

  select * into v_artifact
  from production.artifacts
  where id = v_version.artifact_id;
  if not found then
    return jsonb_build_object('eligible', false, 'reason_code', 'ARTIFACT_NOT_FOUND');
  end if;

  if v_artifact.person_id is distinct from p_person_id then
    return jsonb_build_object('eligible', false, 'reason_code', 'ARTIFACT_PERSON_MISMATCH');
  end if;

  -- Closed Pilot contract: a stale/superseded version is not deliverable.
  if exists (
    select 1
    from production.artifact_versions newer
    where newer.artifact_id = v_version.artifact_id
      and newer.version_number > v_version.version_number
  ) then
    return jsonb_build_object('eligible', false, 'reason_code', 'ARTIFACT_VERSION_STALE');
  end if;

  select * into v_job
  from production.jobs
  where id = v_version.job_id;
  if not found then
    return jsonb_build_object('eligible', false, 'reason_code', 'PRODUCTION_JOB_NOT_FOUND');
  end if;

  select * into v_entitlement
  from entitlement.entitlements
  where id = p_entitlement_id;
  if not found then
    return jsonb_build_object('eligible', false, 'reason_code', 'ENTITLEMENT_NOT_FOUND');
  end if;

  if v_entitlement.person_id is distinct from p_person_id
     or v_entitlement.product_id is distinct from v_artifact.product_id then
    return jsonb_build_object('eligible', false, 'reason_code', 'ENTITLEMENT_SCOPE_MISMATCH');
  end if;

  if v_entitlement.status <> 'active'
     or v_entitlement.valid_from > now()
     or (v_entitlement.valid_until is not null and v_entitlement.valid_until <= now()) then
    return jsonb_build_object('eligible', false, 'reason_code', 'ENTITLEMENT_NOT_EFFECTIVE');
  end if;

  if v_entitlement.journey_anchor_id is not null
     and v_entitlement.journey_anchor_id is distinct from v_artifact.journey_anchor_id then
    return jsonb_build_object('eligible', false, 'reason_code', 'ENTITLEMENT_JOURNEY_MISMATCH');
  end if;

  if v_entitlement.product_version_id is not null
     and v_entitlement.product_version_id is distinct from v_job.product_version_id then
    return jsonb_build_object('eligible', false, 'reason_code', 'ENTITLEMENT_PRODUCT_VERSION_MISMATCH');
  end if;

  if v_entitlement.order_id is not null
     and v_entitlement.order_id is distinct from v_job.order_id then
    return jsonb_build_object('eligible', false, 'reason_code', 'ENTITLEMENT_ORDER_MISMATCH');
  end if;

  -- Current P11 truth for this exact Artifact Version is the latest canonical
  -- P11 event appended to review history. A new PENDING/NEEDS_CHANGES/REJECTED
  -- event therefore fails closed even if an older APPROVED event exists.
  select * into v_review
  from production.artifact_reviews
  where artifact_version_id = p_artifact_version_id
    and review_source = 'P11_PRODUCT_ACCEPTANCE'
  order by created_at desc, id desc
  limit 1;

  if not found then
    return jsonb_build_object('eligible', false, 'reason_code', 'P11_REVIEW_MISSING');
  end if;

  if v_review.review_state <> 'approved' then
    return jsonb_build_object('eligible', false, 'reason_code', 'P11_REVIEW_NOT_APPROVED');
  end if;

  if v_review.acceptance_contract_version is distinct from '0.1'
     or v_review.provenance_status is distinct from 'VERIFIED'
     or v_review.production_job_id is distinct from v_version.job_id
     or v_review.job_attempt_id is distinct from v_version.job_attempt_id
     or v_review.produced_version_identity is distinct from v_version.produced_version_identity
     or v_review.review_content_digest is distinct from v_version.content_digest
     or v_review.review_build_identity is distinct from v_version.build_identity then
    return jsonb_build_object('eligible', false, 'reason_code', 'P11_REVIEW_BINDING_INVALID');
  end if;

  select * into v_html
  from production.artifact_version_representations
  where artifact_version_id = p_artifact_version_id
    and representation_role = 'customer_html';

  if not found then
    return jsonb_build_object('eligible', false, 'reason_code', 'CUSTOMER_HTML_REPRESENTATION_MISSING');
  end if;

  return jsonb_build_object(
    'eligible', true,
    'reason_code', 'DELIVERABLE_VERSION_OK',
    'person_id', p_person_id,
    'entitlement_id', p_entitlement_id,
    'artifact_id', v_artifact.id,
    'artifact_version_id', v_version.id,
    'artifact_version_number', v_version.version_number,
    'production_job_id', v_version.job_id,
    'job_attempt_id', v_version.job_attempt_id,
    'p11_review_id', v_review.id,
    'customer_html_representation_id', v_html.id,
    'customer_html_storage_reference', v_html.storage_reference,
    'customer_html_checksum_sha256', v_html.checksum_sha256
  );
end;
$$;

comment on function delivery._evaluate_deliverable_version(uuid, uuid, uuid) is
  'Internal server-side fail-closed evaluation of exact Person + exact Entitlement + exact current Artifact Version + latest exact-version P11 APPROVED/VERIFIED evidence + customer HTML representation. It grants no access by itself and is not callable by browser roles.';

revoke all on function delivery._evaluate_deliverable_version(uuid, uuid, uuid)
  from public, anon, authenticated, service_role;

create or replace function delivery._evaluate_private_access(
  p_private_access_id uuid,
  p_person_id uuid
)
returns jsonb
language plpgsql
stable
security definer
set search_path = pg_catalog
as $$
declare
  v_access delivery.private_artifact_access%rowtype;
  v_eval jsonb;
begin
  select * into v_access
  from delivery.private_artifact_access
  where id = p_private_access_id;
  if not found then
    return jsonb_build_object('authorized', false, 'reason_code', 'PRIVATE_ACCESS_NOT_FOUND');
  end if;

  if v_access.person_id is distinct from p_person_id then
    return jsonb_build_object('authorized', false, 'reason_code', 'PRIVATE_ACCESS_PERSON_MISMATCH');
  end if;
  if v_access.status <> 'active' then
    return jsonb_build_object('authorized', false, 'reason_code', 'PRIVATE_ACCESS_REVOKED');
  end if;
  if v_access.valid_from > now() then
    return jsonb_build_object('authorized', false, 'reason_code', 'PRIVATE_ACCESS_NOT_STARTED');
  end if;
  if v_access.valid_until is not null and v_access.valid_until <= now() then
    return jsonb_build_object('authorized', false, 'reason_code', 'PRIVATE_ACCESS_EXPIRED');
  end if;
  if v_access.environment_scope <> 'synthetic_staging' then
    return jsonb_build_object('authorized', false, 'reason_code', 'PRIVATE_ACCESS_ENVIRONMENT_DENIED');
  end if;

  v_eval := delivery._evaluate_deliverable_version(
    v_access.person_id,
    v_access.entitlement_id,
    v_access.artifact_version_id
  );

  if coalesce((v_eval->>'eligible')::boolean, false) is not true then
    return jsonb_build_object(
      'authorized', false,
      'reason_code', coalesce(v_eval->>'reason_code', 'DELIVERABILITY_UNKNOWN')
    );
  end if;

  return (v_eval - 'eligible') || jsonb_build_object(
    'authorized', true,
    'private_access_id', v_access.id,
    'access_contract_version', v_access.access_contract_version,
    'environment_scope', v_access.environment_scope,
    'access_valid_until', v_access.valid_until
  );
end;
$$;

comment on function delivery._evaluate_private_access(uuid, uuid) is
  'Internal exact-person private-access evaluation. Locator id is insufficient: access lifecycle plus canonical deliverability are re-evaluated on every call.';

revoke all on function delivery._evaluate_private_access(uuid, uuid)
  from public, anon, authenticated, service_role;

-- =========================================================================
-- C. Service-side access interface
-- =========================================================================

create or replace function delivery.issue_private_artifact_access(
  p_person_id uuid,
  p_entitlement_id uuid,
  p_artifact_version_id uuid,
  p_access_correlation_reference text,
  p_valid_until timestamptz default null
)
returns delivery.private_artifact_access
language plpgsql
security definer
set search_path = pg_catalog
as $$
declare
  v_existing delivery.private_artifact_access%rowtype;
  v_created delivery.private_artifact_access%rowtype;
  v_eval jsonb;
begin
  if p_access_correlation_reference is null
     or char_length(p_access_correlation_reference) not between 1 and 300 then
    raise exception 'PRIVATE_ACCESS_CORRELATION_INVALID';
  end if;
  if p_valid_until is not null and p_valid_until <= now() then
    raise exception 'PRIVATE_ACCESS_EXPIRY_INVALID';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(
    'p11-private-access:' || p_access_correlation_reference, 0
  ));

  select * into v_existing
  from delivery.private_artifact_access
  where access_correlation_reference = p_access_correlation_reference;

  if found then
    if v_existing.person_id is distinct from p_person_id
       or v_existing.entitlement_id is distinct from p_entitlement_id
       or v_existing.artifact_version_id is distinct from p_artifact_version_id
       or v_existing.valid_until is distinct from p_valid_until then
      raise exception 'PRIVATE_ACCESS_CORRELATION_CONFLICT';
    end if;
    return v_existing;
  end if;

  v_eval := delivery._evaluate_deliverable_version(
    p_person_id, p_entitlement_id, p_artifact_version_id
  );
  if coalesce((v_eval->>'eligible')::boolean, false) is not true then
    raise exception 'PRIVATE_ACCESS_NOT_DELIVERABLE: %', coalesce(v_eval->>'reason_code', 'UNKNOWN');
  end if;

  insert into delivery.private_artifact_access (
    person_id, entitlement_id, artifact_version_id,
    access_correlation_reference, valid_until
  ) values (
    p_person_id, p_entitlement_id, p_artifact_version_id,
    p_access_correlation_reference, p_valid_until
  ) returning * into v_created;

  return v_created;
end;
$$;

comment on function delivery.issue_private_artifact_access(uuid, uuid, uuid, text, timestamptz) is
  'Service-side idempotent issuance for synthetic/staging only. Refuses issuance unless the exact version is currently deliverable under the locked Closed Pilot contract. Exact correlation replay returns the same access row; conflicting replay fails closed.';

revoke all on function delivery.issue_private_artifact_access(uuid, uuid, uuid, text, timestamptz)
  from public, anon, authenticated;
grant execute on function delivery.issue_private_artifact_access(uuid, uuid, uuid, text, timestamptz)
  to service_role;

create or replace function delivery.revoke_private_artifact_access(
  p_private_access_id uuid,
  p_revocation_correlation_reference text,
  p_revoke_source text,
  p_revoke_reason text
)
returns delivery.private_artifact_access
language plpgsql
security definer
set search_path = pg_catalog
as $$
declare
  v_access delivery.private_artifact_access%rowtype;
begin
  if coalesce(char_length(p_revocation_correlation_reference), 0) not between 1 and 300
     or coalesce(char_length(p_revoke_source), 0) not between 1 and 200
     or coalesce(char_length(p_revoke_reason), 0) not between 1 and 500 then
    raise exception 'PRIVATE_ACCESS_REVOCATION_PROVENANCE_INVALID';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(
    'p11-private-access-revoke:' || p_private_access_id::text, 0
  ));

  select * into v_access
  from delivery.private_artifact_access
  where id = p_private_access_id
  for update;

  if not found then
    raise exception 'PRIVATE_ACCESS_NOT_FOUND';
  end if;

  if v_access.status = 'revoked' then
    if v_access.revocation_correlation_reference is distinct from p_revocation_correlation_reference
       or v_access.revoke_source is distinct from p_revoke_source
       or v_access.revoke_reason is distinct from p_revoke_reason then
      raise exception 'PRIVATE_ACCESS_REVOCATION_CONFLICT';
    end if;
    return v_access;
  end if;

  update delivery.private_artifact_access
  set status = 'revoked',
      revoked_at = now(),
      revoke_source = p_revoke_source,
      revoke_reason = p_revoke_reason,
      revocation_correlation_reference = p_revocation_correlation_reference
  where id = p_private_access_id
  returning * into v_access;

  return v_access;
end;
$$;

revoke all on function delivery.revoke_private_artifact_access(uuid, text, text, text)
  from public, anon, authenticated;
grant execute on function delivery.revoke_private_artifact_access(uuid, text, text, text)
  to service_role;

create or replace function delivery.authorize_private_artifact_access(
  p_authenticated_auth_user_id uuid,
  p_private_access_id uuid
)
returns jsonb
language plpgsql
stable
security definer
set search_path = pg_catalog
as $$
declare
  v_person_id uuid;
begin
  -- The caller is a trusted server-side boundary and MUST derive this value
  -- from a verified Supabase session, never from an arbitrary request-body id.
  select person_id into v_person_id
  from identity.account_links
  where auth_user_id = p_authenticated_auth_user_id
    and status = 'active';

  if v_person_id is null then
    return jsonb_build_object('authorized', false, 'reason_code', 'AUTH_ACCOUNT_NOT_LINKED');
  end if;

  return delivery._evaluate_private_access(p_private_access_id, v_person_id);
end;
$$;

comment on function delivery.authorize_private_artifact_access(uuid, uuid) is
  'Service-side authorization interface for P04. First argument must come from the verified authenticated session. Maps auth account -> canonical Person, then re-evaluates exact access, entitlement, current Artifact Version and P11 approval. The access id/URL is only a locator.';

revoke all on function delivery.authorize_private_artifact_access(uuid, uuid)
  from public, anon, authenticated;
grant execute on function delivery.authorize_private_artifact_access(uuid, uuid)
  to service_role;

-- =========================================================================
-- D. Separate append-only Delivery Succeeded and Customer Confirmed truths
-- =========================================================================

create table delivery.delivery_succeeded_events (
  id uuid primary key default gen_random_uuid(),
  private_access_id uuid not null references delivery.private_artifact_access(id) on delete restrict,
  person_id uuid not null references identity.persons(id) on delete restrict,
  artifact_version_id uuid not null references production.artifact_versions(id) on delete restrict,
  delivery_correlation_reference text not null unique
    check (char_length(delivery_correlation_reference) between 1 and 300),
  delivery_path_kind text not null default 'private_access'
    check (delivery_path_kind = 'private_access'),
  delivered_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

comment on table delivery.delivery_succeeded_events is
  'Append-only evidence that one exact deliverable Artifact Version was successfully made available to the correct Person through the approved private-access path. Does not imply Customer Confirmed.';

create table delivery.customer_confirmed_events (
  id uuid primary key default gen_random_uuid(),
  delivery_succeeded_event_id uuid not null references delivery.delivery_succeeded_events(id) on delete restrict,
  private_access_id uuid not null references delivery.private_artifact_access(id) on delete restrict,
  person_id uuid not null references identity.persons(id) on delete restrict,
  artifact_version_id uuid not null references production.artifact_versions(id) on delete restrict,
  confirmation_correlation_reference text not null unique
    check (char_length(confirmation_correlation_reference) between 1 and 300),
  confirmation_source text not null
    check (char_length(confirmation_source) between 1 and 200),
  confirmed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

comment on table delivery.customer_confirmed_events is
  'Separate append-only evidence that the correct authenticated Person confirmed/received a previously recorded Delivery Succeeded event. Never auto-created from delivery success.';

create trigger delivery_succeeded_events_block_update
  before update on delivery.delivery_succeeded_events
  for each row execute function delivery.reject_immutable_mutation();
create trigger delivery_succeeded_events_block_delete
  before delete on delivery.delivery_succeeded_events
  for each row execute function delivery.reject_immutable_mutation();
create trigger customer_confirmed_events_block_update
  before update on delivery.customer_confirmed_events
  for each row execute function delivery.reject_immutable_mutation();
create trigger customer_confirmed_events_block_delete
  before delete on delivery.customer_confirmed_events
  for each row execute function delivery.reject_immutable_mutation();

create index delivery_succeeded_access_idx
  on delivery.delivery_succeeded_events(private_access_id, delivered_at);
create index customer_confirmed_delivery_idx
  on delivery.customer_confirmed_events(delivery_succeeded_event_id, confirmed_at);

create or replace function delivery.record_delivery_succeeded(
  p_private_access_id uuid,
  p_delivery_correlation_reference text
)
returns delivery.delivery_succeeded_events
language plpgsql
security definer
set search_path = pg_catalog
as $$
declare
  v_access delivery.private_artifact_access%rowtype;
  v_existing delivery.delivery_succeeded_events%rowtype;
  v_event delivery.delivery_succeeded_events%rowtype;
  v_eval jsonb;
begin
  if coalesce(char_length(p_delivery_correlation_reference), 0) not between 1 and 300 then
    raise exception 'DELIVERY_CORRELATION_INVALID';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(
    'p11-delivery:' || p_delivery_correlation_reference, 0
  ));

  select * into v_existing
  from delivery.delivery_succeeded_events
  where delivery_correlation_reference = p_delivery_correlation_reference;

  if found then
    if v_existing.private_access_id is distinct from p_private_access_id then
      raise exception 'DELIVERY_CORRELATION_CONFLICT';
    end if;
    return v_existing;
  end if;

  select * into v_access
  from delivery.private_artifact_access
  where id = p_private_access_id;
  if not found then
    raise exception 'PRIVATE_ACCESS_NOT_FOUND';
  end if;

  v_eval := delivery._evaluate_private_access(v_access.id, v_access.person_id);
  if coalesce((v_eval->>'authorized')::boolean, false) is not true then
    raise exception 'DELIVERY_NOT_AUTHORIZED: %', coalesce(v_eval->>'reason_code', 'UNKNOWN');
  end if;

  insert into delivery.delivery_succeeded_events (
    private_access_id, person_id, artifact_version_id,
    delivery_correlation_reference
  ) values (
    v_access.id, v_access.person_id, v_access.artifact_version_id,
    p_delivery_correlation_reference
  ) returning * into v_event;

  return v_event;
end;
$$;

revoke all on function delivery.record_delivery_succeeded(uuid, text)
  from public, anon, authenticated;
grant execute on function delivery.record_delivery_succeeded(uuid, text)
  to service_role;

create or replace function delivery.record_customer_confirmed(
  p_authenticated_auth_user_id uuid,
  p_delivery_succeeded_event_id uuid,
  p_confirmation_correlation_reference text,
  p_confirmation_source text
)
returns delivery.customer_confirmed_events
language plpgsql
security definer
set search_path = pg_catalog
as $$
declare
  v_person_id uuid;
  v_delivery delivery.delivery_succeeded_events%rowtype;
  v_existing delivery.customer_confirmed_events%rowtype;
  v_event delivery.customer_confirmed_events%rowtype;
begin
  if coalesce(char_length(p_confirmation_correlation_reference), 0) not between 1 and 300
     or coalesce(char_length(p_confirmation_source), 0) not between 1 and 200 then
    raise exception 'CUSTOMER_CONFIRMATION_PROVENANCE_INVALID';
  end if;

  select person_id into v_person_id
  from identity.account_links
  where auth_user_id = p_authenticated_auth_user_id
    and status = 'active';
  if v_person_id is null then
    raise exception 'AUTH_ACCOUNT_NOT_LINKED';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(
    'p11-customer-confirmed:' || p_confirmation_correlation_reference, 0
  ));

  select * into v_existing
  from delivery.customer_confirmed_events
  where confirmation_correlation_reference = p_confirmation_correlation_reference;

  if found then
    if v_existing.delivery_succeeded_event_id is distinct from p_delivery_succeeded_event_id
       or v_existing.person_id is distinct from v_person_id then
      raise exception 'CUSTOMER_CONFIRMATION_CORRELATION_CONFLICT';
    end if;
    return v_existing;
  end if;

  select * into v_delivery
  from delivery.delivery_succeeded_events
  where id = p_delivery_succeeded_event_id;
  if not found then
    raise exception 'DELIVERY_SUCCEEDED_EVENT_NOT_FOUND';
  end if;

  if v_delivery.person_id is distinct from v_person_id then
    raise exception 'CUSTOMER_CONFIRMATION_PERSON_MISMATCH';
  end if;

  insert into delivery.customer_confirmed_events (
    delivery_succeeded_event_id, private_access_id, person_id,
    artifact_version_id, confirmation_correlation_reference,
    confirmation_source
  ) values (
    v_delivery.id, v_delivery.private_access_id, v_delivery.person_id,
    v_delivery.artifact_version_id, p_confirmation_correlation_reference,
    p_confirmation_source
  ) returning * into v_event;

  return v_event;
end;
$$;

revoke all on function delivery.record_customer_confirmed(uuid, uuid, text, text)
  from public, anon, authenticated;
grant execute on function delivery.record_customer_confirmed(uuid, uuid, text, text)
  to service_role;

-- =========================================================================
-- E. Founder Test trace interface — bounded IDs/state only
-- =========================================================================

create or replace function delivery.get_founder_test_trace(p_private_access_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = pg_catalog
as $$
declare
  v_access delivery.private_artifact_access%rowtype;
  v_version production.artifact_versions%rowtype;
  v_artifact production.artifacts%rowtype;
  v_job production.jobs%rowtype;
  v_attempt production.job_attempts%rowtype;
  v_entitlement entitlement.entitlements%rowtype;
  v_review production.artifact_reviews%rowtype;
  v_delivery jsonb;
  v_confirmation jsonb;
  v_payment jsonb;
begin
  select * into v_access
  from delivery.private_artifact_access
  where id = p_private_access_id;
  if not found then
    return jsonb_build_object('found', false, 'reason_code', 'PRIVATE_ACCESS_NOT_FOUND');
  end if;

  select * into v_version from production.artifact_versions where id = v_access.artifact_version_id;
  select * into v_artifact from production.artifacts where id = v_version.artifact_id;
  select * into v_job from production.jobs where id = v_version.job_id;
  select * into v_attempt from production.job_attempts where id = v_version.job_attempt_id;
  select * into v_entitlement from entitlement.entitlements where id = v_access.entitlement_id;

  select * into v_review
  from production.artifact_reviews
  where artifact_version_id = v_version.id
    and review_source = 'P11_PRODUCT_ACCEPTANCE'
  order by created_at desc, id desc
  limit 1;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', d.id,
    'delivery_correlation_reference', d.delivery_correlation_reference,
    'delivered_at', d.delivered_at
  ) order by d.delivered_at), '[]'::jsonb)
  into v_delivery
  from delivery.delivery_succeeded_events d
  where d.private_access_id = v_access.id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id,
    'delivery_succeeded_event_id', c.delivery_succeeded_event_id,
    'confirmation_correlation_reference', c.confirmation_correlation_reference,
    'confirmation_source', c.confirmation_source,
    'confirmed_at', c.confirmed_at
  ) order by c.confirmed_at), '[]'::jsonb)
  into v_confirmation
  from delivery.customer_confirmed_events c
  where c.private_access_id = v_access.id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', pe.id,
    'source_kind', pe.source_kind,
    'verification_status', pe.verification_status,
    'observed_at', pe.observed_at
  ) order by pe.recorded_at), '[]'::jsonb)
  into v_payment
  from entitlement.payment_evidence pe
  where v_entitlement.order_id is not null
    and pe.order_id = v_entitlement.order_id;

  return jsonb_build_object(
    'found', true,
    'person_id', v_access.person_id,
    'order_id', v_entitlement.order_id,
    'payment_evidence', v_payment,
    'entitlement', jsonb_build_object(
      'id', v_entitlement.id,
      'status', v_entitlement.status,
      'valid_from', v_entitlement.valid_from,
      'valid_until', v_entitlement.valid_until
    ),
    'production', jsonb_build_object(
      'job_id', v_job.id,
      'job_status', v_job.status,
      'attempt_id', v_attempt.id,
      'attempt_status', v_attempt.status,
      'producer_machine_id', v_version.producer_machine_id,
      'machine_git_sha', v_version.machine_git_sha
    ),
    'artifact', jsonb_build_object(
      'artifact_id', v_artifact.id,
      'artifact_version_id', v_version.id,
      'version_number', v_version.version_number,
      'content_digest', v_version.content_digest
    ),
    'p11_acceptance', case when v_review.id is null then null else jsonb_build_object(
      'review_id', v_review.id,
      'review_state', v_review.review_state,
      'provenance_status', v_review.provenance_status,
      'reviewed_at', v_review.reviewed_at
    ) end,
    'private_access', jsonb_build_object(
      'id', v_access.id,
      'status', v_access.status,
      'valid_from', v_access.valid_from,
      'valid_until', v_access.valid_until,
      'environment_scope', v_access.environment_scope
    ),
    'delivery_succeeded_events', v_delivery,
    'customer_confirmed_events', v_confirmation
  );
end;
$$;

comment on function delivery.get_founder_test_trace(uuid) is
  'Service-side Founder Test trace: bounded canonical IDs, state and correlation evidence from business eligibility through production/P11/access/delivery/confirmation. No raw private content, raw token, signed URL, secret or customer/child profile payload.';

revoke all on function delivery.get_founder_test_trace(uuid)
  from public, anon, authenticated;
grant execute on function delivery.get_founder_test_trace(uuid)
  to service_role;

-- =========================================================================
-- F. Security: deny by default; writes only through controlled functions
-- =========================================================================

alter table delivery.private_artifact_access enable row level security;
alter table delivery.private_artifact_access force row level security;
alter table delivery.private_access_events enable row level security;
alter table delivery.private_access_events force row level security;
alter table delivery.delivery_succeeded_events enable row level security;
alter table delivery.delivery_succeeded_events force row level security;
alter table delivery.customer_confirmed_events enable row level security;
alter table delivery.customer_confirmed_events force row level security;

revoke all on
  delivery.private_artifact_access,
  delivery.private_access_events,
  delivery.delivery_succeeded_events,
  delivery.customer_confirmed_events
  from public, anon, authenticated, service_role;

grant select on
  delivery.private_artifact_access,
  delivery.private_access_events,
  delivery.delivery_succeeded_events,
  delivery.customer_confirmed_events
  to service_role;

-- Trigger/history helpers and internal evaluators must not become public API.
revoke all on function delivery.set_updated_at() from service_role;
revoke all on function delivery.reject_immutable_mutation() from service_role;
revoke all on function delivery.validate_private_access_rewrite() from service_role;
revoke all on function delivery.log_private_access_event() from service_role;

-- Explicitly restate the five intended service-side entry points after table
-- privilege lockdown. SECURITY DEFINER owns the controlled writes.
grant execute on function delivery.issue_private_artifact_access(uuid, uuid, uuid, text, timestamptz) to service_role;
grant execute on function delivery.revoke_private_artifact_access(uuid, text, text, text) to service_role;
grant execute on function delivery.authorize_private_artifact_access(uuid, uuid) to service_role;
grant execute on function delivery.record_delivery_succeeded(uuid, text) to service_role;
grant execute on function delivery.record_customer_confirmed(uuid, uuid, text, text) to service_role;
grant execute on function delivery.get_founder_test_trace(uuid) to service_role;

-- 20260814034500 · WO-LAUNCH-CORE-04: Production Job + Artifact + QA
-- Foundation.
-- Shared technical bridge between Product Journey and reviewable
-- production output. Built on the merged identity/commerce/entitlement
-- schemas; does not modify any of them.
--
-- Hard separation preserved throughout this migration:
--   ARTIFACT EXISTS  !=  ARTIFACT APPROVED  !=  PUBLISHED
--                     !=  CUSTOMER MAY ACCESS  !=  DELIVERY SUCCEEDED
-- No table/trigger/function in this schema ever touches
-- entitlement.entitlements, and no "publication" or "delivery" concept is
-- introduced. Generator/provider integration remains OFF — only
-- provider-neutral, nullable free-text pointer fields exist for future
-- correlation.
--
-- Design applies every hardening lesson already proven necessary in
-- WO-03 (access-scope coherence, revocation/terminal-state sealing,
-- authoritative provenance-carrying history, creation-time lifecycle
-- lock) from the first pass, rather than discovering them over several
-- review rounds again:
--   A. PRODUCTION JOB   — canonical work request, cross-reference
--      coherence (Person/Product/Version/Journey/Order) validated at
--      insert time, all three pairwise version comparisons (like WO-03's
--      E1/E2 + the later Journey-vs-Order finding), terminal-state seal,
--      creation locked to the one non-terminal starting state.
--   B. JOB ATTEMPT      — separate canonical truth from Job; retry
--      history; cannot be created on an already-terminal Job; terminal
--      seal; creation locked to 'running'.
--   C. ARTIFACT / ARTIFACT VERSION — Artifact is the stable logical
--      thing; Artifact Version is fully immutable production history,
--      insert-only, never overwritten; version provenance (originating
--      Job/Attempt) must cohere with the Artifact's own canonical
--      context.
--   D. QA / REVIEW EVIDENCE — factual, version-specific, insert-only
--      event log. No QA criteria/scoring invented; only a generic,
--      provider-neutral review-workflow vocabulary.
--   E. AUDIT/HISTORY FABRICATION — every derived history log
--      (job_status_events, audit_events) is populated ONLY by a
--      SECURITY DEFINER trigger with direct INSERT revoked from
--      service_role, applying the WO-03 lesson that a normal
--      application path must not be able to fabricate history
--      disconnected from a real transition.

create schema if not exists production;

revoke all on schema production from public, anon, authenticated;
grant usage on schema production to service_role;

create or replace function production.set_updated_at()
returns trigger
language plpgsql
set search_path = pg_catalog, production
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function production.set_updated_at() from public, anon, authenticated;

-- Shared delete guard for tables that allow controlled UPDATE but never
-- DELETE (jobs, job_attempts). No ordinary DELETE grant is issued either,
-- so this is defense in depth.
create or replace function production.reject_delete()
returns trigger
language plpgsql
set search_path = pg_catalog, production
as $$
begin
  raise exception 'PRODUCTION_ROW_DELETE_REJECTED: %', TG_TABLE_NAME;
end;
$$;

revoke all on function production.reject_delete() from public, anon, authenticated;

-- Shared guard for tables that are fully immutable after creation —
-- neither UPDATE nor DELETE is ever legitimate (artifacts,
-- artifact_versions, artifact_reviews, job_status_events, audit_events).
-- Naming matches the precedent set by commerce.reject_immutable_mutation.
create or replace function production.reject_immutable_mutation()
returns trigger
language plpgsql
set search_path = pg_catalog, production
as $$
begin
  raise exception 'PRODUCTION_ROW_IMMUTABLE: %', TG_TABLE_NAME;
end;
$$;

revoke all on function production.reject_immutable_mutation() from public, anon, authenticated;

-- =========================================================================
-- Audit substrate (schema-local, same insert-only/immutable shape as
-- identity/commerce/entitlement audit_events). SECURITY DEFINER logging
-- function with direct INSERT revoked from service_role from the start —
-- applying the WO-03 lesson proactively instead of discovering the
-- fabrication-bypass gap in a later review round.
-- =========================================================================

create table production.audit_events (
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

comment on table production.audit_events is
  'Immutable operational audit substrate for Production Job/Artifact/QA mutations. Rows are insert-only, and direct INSERT is revoked from service_role — only the SECURITY DEFINER log_audit_event trigger can write. metadata must never contain secrets, raw provider payload, or child-sensitive content.';

create index production_audit_events_entity_idx on production.audit_events(entity_type, entity_id);
create index production_audit_events_occurred_idx on production.audit_events(occurred_at desc);

create trigger production_audit_events_block_update
  before update on production.audit_events
  for each row execute function production.reject_immutable_mutation();
create trigger production_audit_events_block_delete
  before delete on production.audit_events
  for each row execute function production.reject_immutable_mutation();

create or replace function production.log_audit_event()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, production
as $$
declare
  v_entity_type text := TG_TABLE_NAME;
  v_entity_id uuid;
begin
  v_entity_id := coalesce((to_jsonb(new)->>'id')::uuid, (to_jsonb(old)->>'id')::uuid);
  insert into production.audit_events (event_type, entity_type, entity_id, actor_type, metadata)
  values (
    v_entity_type || '.' || lower(TG_OP), v_entity_type, v_entity_id, 'service',
    jsonb_build_object('operation', TG_OP)
  );
  return coalesce(new, old);
end;
$$;

revoke all on function production.log_audit_event() from public, anon, authenticated;

-- =========================================================================
-- A. PRODUCTION JOB — canonical work request. Minimum necessary
-- reference: Person + Product are required; Product Version, Journey
-- Anchor, and Order are optional but must be canonically coherent with
-- each other and with the Job whenever supplied — no individually valid
-- combination may tell a contradictory story.
-- =========================================================================

create table production.jobs (
  id uuid primary key default gen_random_uuid(),
  person_id uuid not null references identity.persons(id) on delete restrict,
  product_id uuid not null references commerce.products(id) on delete restrict,
  product_version_id uuid references commerce.product_versions(id) on delete restrict,
  journey_anchor_id uuid references commerce.product_journey_anchors(id) on delete restrict,
  order_id uuid references commerce.orders(id) on delete restrict,
  idempotency_key text not null unique check (char_length(idempotency_key) between 1 and 300),
  status text not null default 'pending' check (status in (
    'pending', 'running', 'succeeded', 'failed', 'cancelled'
  )),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint jobs_version_belongs_to_product
    foreign key (product_version_id, product_id) references commerce.product_versions(id, product_id)
);

comment on table production.jobs is
  'Canonical production work request — the logical unit of "produce something for this Person/Product". Never the same thing as a Generator/provider execution: this table is backend truth, an external engine is only a replaceable execution boundary behind it. A Job is not itself a customer entitlement, publication, or delivery outcome.';

create index production_jobs_person_idx on production.jobs(person_id);
create index production_jobs_product_idx on production.jobs(product_id);
create index production_jobs_journey_idx on production.jobs(journey_anchor_id);
create index production_jobs_order_idx on production.jobs(order_id);
create index production_jobs_status_idx on production.jobs(status);

create trigger production_jobs_set_updated_at
  before update on production.jobs
  for each row execute function production.set_updated_at();

-- Creation-time lifecycle lock (WO-03 lesson applied from day one): a new
-- Job can only ever be born pending. verified/succeeded/etc. must always
-- be reached afterward through a real, auditable transition.
create or replace function production.reject_job_initial_status()
returns trigger
language plpgsql
set search_path = pg_catalog, production
as $$
begin
  if NEW.status is distinct from 'pending' then
    raise exception 'JOB_MUST_START_PENDING';
  end if;
  return NEW;
end;
$$;

revoke all on function production.reject_job_initial_status() from public, anon, authenticated;

-- Cross-reference coherence at insert time. Checks, in order: Journey
-- belongs to Person/Product; Journey's pinned Version (if any) agrees
-- with the Job's own claimed Version (if any); Order belongs to
-- Person/Product; Order's pinned Version agrees with the Job's own
-- claimed Version; and — the lesson WO-03 only found on a second
-- self-review pass — Journey's pinned Version and Order's pinned Version
-- must agree with EACH OTHER directly, even when the Job itself claims no
-- Version.
create or replace function production.validate_job_scope()
returns trigger
language plpgsql
set search_path = pg_catalog, production, commerce
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
      raise exception 'JOB_JOURNEY_NOT_FOUND';
    end if;
    if v_journey_person is distinct from NEW.person_id or v_journey_product is distinct from NEW.product_id then
      raise exception 'JOB_JOURNEY_SCOPE_MISMATCH';
    end if;
    if v_journey_version is not null
       and NEW.product_version_id is not null
       and v_journey_version is distinct from NEW.product_version_id then
      raise exception 'JOB_JOURNEY_VERSION_MISMATCH';
    end if;
  end if;

  if NEW.order_id is not null then
    select buyer_person_id, product_id, product_version_id
      into v_order_person, v_order_product, v_order_version
    from commerce.orders where id = NEW.order_id;
    if v_order_person is null then
      raise exception 'JOB_ORDER_NOT_FOUND';
    end if;
    if v_order_person is distinct from NEW.person_id or v_order_product is distinct from NEW.product_id then
      raise exception 'JOB_ORDER_SCOPE_MISMATCH';
    end if;
    if NEW.product_version_id is not null
       and v_order_version is distinct from NEW.product_version_id then
      raise exception 'JOB_ORDER_VERSION_MISMATCH';
    end if;
  end if;

  if NEW.journey_anchor_id is not null and NEW.order_id is not null
     and v_journey_version is not null and v_order_version is not null
     and v_journey_version is distinct from v_order_version then
    raise exception 'JOB_JOURNEY_ORDER_VERSION_MISMATCH';
  end if;

  return NEW;
end;
$$;

revoke all on function production.validate_job_scope() from public, anon, authenticated;

create trigger production_jobs_block_bad_initial_status
  before insert on production.jobs
  for each row execute function production.reject_job_initial_status();
create trigger production_jobs_validate_scope
  before insert on production.jobs
  for each row execute function production.validate_job_scope();

-- Lock grant-scope fields immutable; allow only the legal forward status
-- transitions; seal every terminal status permanently; require an actual
-- successful Attempt to exist before a Job may ever read as succeeded —
-- a canonical claim of "succeeded" must always be technically backed,
-- exactly mirroring the WO-03 principle that a verified/active claim
-- cannot be self-declared without corresponding evidence.
create or replace function production.reject_job_rewrite()
returns trigger
language plpgsql
set search_path = pg_catalog, production
as $$
declare
  v_succeeded_attempts int;
begin
  if NEW.person_id is distinct from OLD.person_id then
    raise exception 'JOB_PERSON_IMMUTABLE';
  end if;
  if NEW.product_id is distinct from OLD.product_id then
    raise exception 'JOB_PRODUCT_IMMUTABLE';
  end if;
  if NEW.product_version_id is distinct from OLD.product_version_id then
    raise exception 'JOB_PRODUCT_VERSION_IMMUTABLE';
  end if;
  if NEW.journey_anchor_id is distinct from OLD.journey_anchor_id then
    raise exception 'JOB_JOURNEY_ANCHOR_IMMUTABLE';
  end if;
  if NEW.order_id is distinct from OLD.order_id then
    raise exception 'JOB_ORDER_IMMUTABLE';
  end if;
  if NEW.idempotency_key is distinct from OLD.idempotency_key then
    raise exception 'JOB_IDEMPOTENCY_KEY_IMMUTABLE';
  end if;

  if OLD.status in ('succeeded', 'failed', 'cancelled') and NEW.status is distinct from OLD.status then
    raise exception 'JOB_TERMINAL_STATUS_IMMUTABLE';
  end if;

  if NEW.status is distinct from OLD.status then
    if not (
      (OLD.status = 'pending' and NEW.status in ('running', 'cancelled'))
      or (OLD.status = 'running' and NEW.status in ('succeeded', 'failed', 'cancelled'))
    ) then
      raise exception 'JOB_STATUS_TRANSITION_INVALID';
    end if;
  end if;

  if NEW.status = 'succeeded' and OLD.status is distinct from 'succeeded' then
    select count(*) into v_succeeded_attempts
    from production.job_attempts where job_id = NEW.id and status = 'succeeded';
    if v_succeeded_attempts = 0 then
      raise exception 'JOB_SUCCEEDED_REQUIRES_SUCCESSFUL_ATTEMPT';
    end if;
  end if;

  return NEW;
end;
$$;

revoke all on function production.reject_job_rewrite() from public, anon, authenticated;

create trigger production_jobs_block_rewrite
  before update on production.jobs
  for each row execute function production.reject_job_rewrite();
create trigger production_jobs_block_delete
  before delete on production.jobs
  for each row execute function production.reject_delete();
create trigger production_jobs_audit
  after insert or update on production.jobs
  for each row execute function production.log_audit_event();

-- =========================================================================
-- Job status history — dedicated, insert-only lifecycle log, same shape
-- as entitlement.payment_evidence_verification_events. A generic audit
-- row alone ("jobs.update happened") cannot answer what transitioned or
-- when; this can. Populated only by trigger; direct INSERT is revoked
-- from service_role.
-- =========================================================================

create table production.job_status_events (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references production.jobs(id) on delete restrict,
  from_status text not null check (from_status in ('pending', 'running', 'succeeded', 'failed', 'cancelled')),
  to_status text not null check (to_status in ('pending', 'running', 'succeeded', 'failed', 'cancelled')),
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

comment on table production.job_status_events is
  'Immutable, insert-only log of every actual Job status transition. Populated automatically by trigger — direct INSERT is revoked from service_role, so this can never be fabricated by a normal application path.';

create index production_job_status_events_job_idx on production.job_status_events(job_id, occurred_at);

create trigger production_job_status_events_block_update
  before update on production.job_status_events
  for each row execute function production.reject_immutable_mutation();
create trigger production_job_status_events_block_delete
  before delete on production.job_status_events
  for each row execute function production.reject_immutable_mutation();

create or replace function production.log_job_status_event()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, production
as $$
begin
  if NEW.status is distinct from OLD.status then
    insert into production.job_status_events (job_id, from_status, to_status)
    values (NEW.id, OLD.status, NEW.status);
  end if;
  return NEW;
end;
$$;

revoke all on function production.log_job_status_event() from public, anon, authenticated;

create trigger production_jobs_log_status_event
  after update on production.jobs
  for each row execute function production.log_job_status_event();

-- =========================================================================
-- B. JOB ATTEMPT — separate canonical truth from Job. One logical Job may
-- require multiple Attempts; a retry never silently creates a second
-- canonical Job. Attempt history/failure provenance is preserved because
-- each Attempt is its own row, never overwritten in place.
-- =========================================================================

create table production.job_attempts (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references production.jobs(id) on delete restrict,
  attempt_number integer not null check (attempt_number >= 1),
  status text not null default 'running' check (status in ('running', 'succeeded', 'failed')),
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  failure_reason text check (failure_reason is null or char_length(failure_reason) between 1 and 500),
  provider_execution_reference text check (provider_execution_reference is null or char_length(provider_execution_reference) between 1 and 300),
  idempotency_key text not null unique check (char_length(idempotency_key) between 1 and 300),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint job_attempts_unique_number unique (job_id, attempt_number),
  constraint job_attempts_unique_id_job unique (id, job_id),
  constraint job_attempts_finished_requires_status check (
    (status = 'running' and finished_at is null)
    or (status in ('succeeded', 'failed') and finished_at is not null)
  ),
  constraint job_attempts_failed_requires_reason check (
    status is distinct from 'failed' or failure_reason is not null
  )
);

comment on table production.job_attempts is
  'One execution attempt of a logical Production Job. attempt_number is unique per Job and gives explicit retry provenance. provider_execution_reference is an optional, provider-neutral pointer for future correlation — no real Generator/provider is integrated in this WO.';

create index production_job_attempts_job_idx on production.job_attempts(job_id);
create index production_job_attempts_status_idx on production.job_attempts(status);

create trigger production_job_attempts_set_updated_at
  before update on production.job_attempts
  for each row execute function production.set_updated_at();

-- A new Attempt must start running, and must not be creatable on a Job
-- that has already reached a terminal status — otherwise a second
-- canonical output could be attempted against an already-decided Job.
create or replace function production.validate_job_attempt_creation()
returns trigger
language plpgsql
set search_path = pg_catalog, production
as $$
declare
  v_job_status text;
begin
  if NEW.status is distinct from 'running' then
    raise exception 'JOB_ATTEMPT_MUST_START_RUNNING';
  end if;
  select status into v_job_status from production.jobs where id = NEW.job_id;
  if v_job_status is null then
    raise exception 'JOB_ATTEMPT_JOB_NOT_FOUND';
  end if;
  if v_job_status in ('succeeded', 'failed', 'cancelled') then
    raise exception 'JOB_ATTEMPT_CANNOT_START_ON_TERMINAL_JOB';
  end if;
  return NEW;
end;
$$;

revoke all on function production.validate_job_attempt_creation() from public, anon, authenticated;

create trigger production_job_attempts_validate_creation
  before insert on production.job_attempts
  for each row execute function production.validate_job_attempt_creation();

create or replace function production.reject_job_attempt_rewrite()
returns trigger
language plpgsql
set search_path = pg_catalog, production
as $$
begin
  if NEW.job_id is distinct from OLD.job_id then
    raise exception 'JOB_ATTEMPT_JOB_IMMUTABLE';
  end if;
  if NEW.attempt_number is distinct from OLD.attempt_number then
    raise exception 'JOB_ATTEMPT_NUMBER_IMMUTABLE';
  end if;
  if NEW.started_at is distinct from OLD.started_at then
    raise exception 'JOB_ATTEMPT_STARTED_AT_IMMUTABLE';
  end if;
  if NEW.provider_execution_reference is distinct from OLD.provider_execution_reference then
    raise exception 'JOB_ATTEMPT_PROVIDER_REFERENCE_IMMUTABLE';
  end if;
  if NEW.idempotency_key is distinct from OLD.idempotency_key then
    raise exception 'JOB_ATTEMPT_IDEMPOTENCY_KEY_IMMUTABLE';
  end if;

  if OLD.status in ('succeeded', 'failed') and NEW.status is distinct from OLD.status then
    raise exception 'JOB_ATTEMPT_TERMINAL_STATUS_IMMUTABLE';
  end if;
  if OLD.status in ('succeeded', 'failed') and (
       NEW.finished_at is distinct from OLD.finished_at
       or NEW.failure_reason is distinct from OLD.failure_reason
     ) then
    raise exception 'JOB_ATTEMPT_TERMINAL_RECORD_IMMUTABLE';
  end if;

  if NEW.status is distinct from OLD.status
     and not (OLD.status = 'running' and NEW.status in ('succeeded', 'failed')) then
    raise exception 'JOB_ATTEMPT_STATUS_TRANSITION_INVALID';
  end if;

  return NEW;
end;
$$;

revoke all on function production.reject_job_attempt_rewrite() from public, anon, authenticated;

create trigger production_job_attempts_block_rewrite
  before update on production.job_attempts
  for each row execute function production.reject_job_attempt_rewrite();
create trigger production_job_attempts_block_delete
  before delete on production.job_attempts
  for each row execute function production.reject_delete();
create trigger production_job_attempts_audit
  after insert or update on production.job_attempts
  for each row execute function production.log_audit_event();

-- =========================================================================
-- C. ARTIFACT / ARTIFACT VERSION — Artifact is the stable logical produced
-- thing; nothing about its own row ever changes after creation. Artifact
-- Version is fully immutable production history — a revision always
-- means a NEW version row, never an edit of an old one.
-- =========================================================================

create table production.artifacts (
  id uuid primary key default gen_random_uuid(),
  person_id uuid not null references identity.persons(id) on delete restrict,
  product_id uuid not null references commerce.products(id) on delete restrict,
  product_version_id uuid references commerce.product_versions(id) on delete restrict,
  journey_anchor_id uuid references commerce.product_journey_anchors(id) on delete restrict,
  created_at timestamptz not null default now(),
  constraint artifacts_version_belongs_to_product
    foreign key (product_version_id, product_id) references commerce.product_versions(id, product_id)
);

comment on table production.artifacts is
  'Stable logical produced thing for a Person/Product (optionally scoped to a Product Version and/or Journey). Fully immutable after creation — all real production history lives on artifact_versions, never on this row. Existing does not by itself imply QA approval, publication, or customer access.';

create index production_artifacts_person_idx on production.artifacts(person_id);
create index production_artifacts_product_idx on production.artifacts(product_id);
create index production_artifacts_journey_idx on production.artifacts(journey_anchor_id);

create or replace function production.validate_artifact_scope()
returns trigger
language plpgsql
set search_path = pg_catalog, production, commerce
as $$
declare
  v_journey_person uuid;
  v_journey_product uuid;
  v_journey_version uuid;
begin
  if NEW.journey_anchor_id is not null then
    select person_id, product_id, product_version_id
      into v_journey_person, v_journey_product, v_journey_version
    from commerce.product_journey_anchors where id = NEW.journey_anchor_id;
    if v_journey_person is null then
      raise exception 'ARTIFACT_JOURNEY_NOT_FOUND';
    end if;
    if v_journey_person is distinct from NEW.person_id or v_journey_product is distinct from NEW.product_id then
      raise exception 'ARTIFACT_JOURNEY_SCOPE_MISMATCH';
    end if;
    if v_journey_version is not null
       and NEW.product_version_id is not null
       and v_journey_version is distinct from NEW.product_version_id then
      raise exception 'ARTIFACT_JOURNEY_VERSION_MISMATCH';
    end if;
  end if;
  return NEW;
end;
$$;

revoke all on function production.validate_artifact_scope() from public, anon, authenticated;

create trigger production_artifacts_validate_scope
  before insert on production.artifacts
  for each row execute function production.validate_artifact_scope();
create trigger production_artifacts_block_rewrite
  before update on production.artifacts
  for each row execute function production.reject_immutable_mutation();
create trigger production_artifacts_block_delete
  before delete on production.artifacts
  for each row execute function production.reject_immutable_mutation();
create trigger production_artifacts_audit
  after insert on production.artifacts
  for each row execute function production.log_audit_event();

create table production.artifact_versions (
  id uuid primary key default gen_random_uuid(),
  artifact_id uuid not null references production.artifacts(id) on delete restrict,
  version_number integer not null check (version_number >= 1),
  job_id uuid not null references production.jobs(id) on delete restrict,
  job_attempt_id uuid not null references production.job_attempts(id) on delete restrict,
  output_kind text not null check (output_kind in (
    'document', 'report', 'media', 'dataset', 'other'
  )),
  build_identity text check (build_identity is null or char_length(build_identity) between 1 and 300),
  content_digest text check (content_digest is null or char_length(content_digest) between 1 and 128),
  created_at timestamptz not null default now(),
  constraint artifact_versions_unique_number unique (artifact_id, version_number),
  constraint artifact_versions_attempt_belongs_to_job
    foreign key (job_attempt_id, job_id) references production.job_attempts(id, job_id)
);

comment on table production.artifact_versions is
  'Immutable production history: one produced output of an Artifact, tied to the exact Job/Attempt that produced it. version_number is unique per Artifact and never reused. A revision is always a NEW row — older versions are never overwritten. No raw generated file is stored here; build_identity/content_digest are bounded pointers only. This row existing does NOT mean it has been QA-reviewed, published, or is customer-accessible.';

create index production_artifact_versions_artifact_idx on production.artifact_versions(artifact_id, version_number);
create index production_artifact_versions_job_idx on production.artifact_versions(job_id);
create index production_artifact_versions_attempt_idx on production.artifact_versions(job_attempt_id);

-- Provenance coherence: the originating Job's Person/Product (and Version,
-- when both sides claim one) must agree with the Artifact's own canonical
-- context. job_attempt_id -> job_id agreement is already enforced by the
-- composite FK above.
create or replace function production.validate_artifact_version_scope()
returns trigger
language plpgsql
set search_path = pg_catalog, production
as $$
declare
  v_artifact_person uuid;
  v_artifact_product uuid;
  v_artifact_version uuid;
  v_job_person uuid;
  v_job_product uuid;
  v_job_version uuid;
begin
  select person_id, product_id, product_version_id
    into v_artifact_person, v_artifact_product, v_artifact_version
  from production.artifacts where id = NEW.artifact_id;
  if v_artifact_person is null then
    raise exception 'ARTIFACT_VERSION_ARTIFACT_NOT_FOUND';
  end if;

  select person_id, product_id, product_version_id
    into v_job_person, v_job_product, v_job_version
  from production.jobs where id = NEW.job_id;
  if v_job_person is null then
    raise exception 'ARTIFACT_VERSION_JOB_NOT_FOUND';
  end if;

  if v_job_person is distinct from v_artifact_person or v_job_product is distinct from v_artifact_product then
    raise exception 'ARTIFACT_VERSION_JOB_SCOPE_MISMATCH';
  end if;

  if v_job_version is not null
     and v_artifact_version is not null
     and v_job_version is distinct from v_artifact_version then
    raise exception 'ARTIFACT_VERSION_JOB_VERSION_MISMATCH';
  end if;

  return NEW;
end;
$$;

revoke all on function production.validate_artifact_version_scope() from public, anon, authenticated;

create trigger production_artifact_versions_validate_scope
  before insert on production.artifact_versions
  for each row execute function production.validate_artifact_version_scope();
create trigger production_artifact_versions_block_rewrite
  before update on production.artifact_versions
  for each row execute function production.reject_immutable_mutation();
create trigger production_artifact_versions_block_delete
  before delete on production.artifact_versions
  for each row execute function production.reject_immutable_mutation();
create trigger production_artifact_versions_audit
  after insert on production.artifact_versions
  for each row execute function production.log_audit_event();

-- Read model: the current (highest-numbered) version per Artifact,
-- computed at read time so nothing needs a background job or a mutable
-- "is_current" flag that could ever drift from the truth.
create view production.artifact_current_version as
select distinct on (av.artifact_id) av.*
from production.artifact_versions av
order by av.artifact_id, av.version_number desc;

comment on view production.artifact_current_version is
  'The highest-numbered (most recent) Artifact Version per Artifact, computed at read time — service_role only.';

revoke all on production.artifact_current_version from public, anon, authenticated;
grant select on production.artifact_current_version to service_role;

-- =========================================================================
-- D. QA / REVIEW EVIDENCE — factual technical substrate only. Each review
-- action is its own immutable event row (never a single mutable "current
-- review" field), so review history can never be silently rewritten. No
-- Hạt Mầm/Lặng-specific QA criteria, scoring, or delivery-worthiness
-- semantics are invented here — review_state is a generic, provider- and
-- product-neutral review-workflow vocabulary; P11 owns what it actually
-- means for a given product.
-- =========================================================================

create table production.artifact_reviews (
  id uuid primary key default gen_random_uuid(),
  artifact_version_id uuid not null references production.artifact_versions(id) on delete restrict,
  review_state text not null check (review_state in (
    'pending', 'approved', 'rejected', 'needs_changes'
  )),
  reviewed_at timestamptz not null default now(),
  review_source text not null check (char_length(review_source) between 1 and 200),
  review_correlation_reference text check (review_correlation_reference is null or char_length(review_correlation_reference) between 1 and 300),
  created_at timestamptz not null default now()
);

comment on table production.artifact_reviews is
  'Insert-only, immutable event log of review/QA evidence for a specific Artifact Version. Each row is a factual review event — WHAT Artifact Version, WHAT technical review_state, WHEN, WHAT source. review_source is required so a review can never exist as unexplained history. This substrate is technical only: it does not decide, and by itself does not imply, delivery or customer access. Provider execution success recorded on job_attempts is a completely separate fact from any row here.';

create index production_artifact_reviews_version_idx on production.artifact_reviews(artifact_version_id, reviewed_at);

create trigger production_artifact_reviews_block_rewrite
  before update on production.artifact_reviews
  for each row execute function production.reject_immutable_mutation();
create trigger production_artifact_reviews_block_delete
  before delete on production.artifact_reviews
  for each row execute function production.reject_immutable_mutation();
create trigger production_artifact_reviews_audit
  after insert on production.artifact_reviews
  for each row execute function production.log_audit_event();

-- =========================================================================
-- Security: deny-by-default RLS on every table, no browser-role grants.
-- No DELETE is granted anywhere in this schema; jobs/job_attempts are
-- additionally hard-blocked by trigger. artifacts/artifact_versions/
-- artifact_reviews/job_status_events/audit_events get no UPDATE grant at
-- all (fully immutable) and job_status_events/audit_events get no INSERT
-- grant either (SECURITY DEFINER trigger only).
-- =========================================================================

alter table production.jobs enable row level security;
alter table production.jobs force row level security;
alter table production.job_attempts enable row level security;
alter table production.job_attempts force row level security;
alter table production.job_status_events enable row level security;
alter table production.job_status_events force row level security;
alter table production.artifacts enable row level security;
alter table production.artifacts force row level security;
alter table production.artifact_versions enable row level security;
alter table production.artifact_versions force row level security;
alter table production.artifact_reviews enable row level security;
alter table production.artifact_reviews force row level security;
alter table production.audit_events enable row level security;
alter table production.audit_events force row level security;

revoke all on
  production.jobs, production.job_attempts, production.job_status_events,
  production.artifacts, production.artifact_versions, production.artifact_reviews,
  production.audit_events
  from public, anon, authenticated;

grant select, insert, update on production.jobs to service_role;
grant select, insert, update on production.job_attempts to service_role;
grant select on production.job_status_events to service_role;
grant select, insert on production.artifacts to service_role;
grant select, insert on production.artifact_versions to service_role;
grant select, insert on production.artifact_reviews to service_role;
grant select on production.audit_events to service_role;

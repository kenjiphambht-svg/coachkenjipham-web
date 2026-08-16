-- 20260816143000 · WO-P07-GEN-BACKEND-INTEGRATION-01
-- Synthetic/staging-only canonical Generator -> Backend registration bridge.
--
-- This migration closes exactly four gaps without introducing a second Job,
-- Attempt, Artifact, workflow, provider, storage, entitlement, publication,
-- access, delivery, or customer-confirmation authority:
--   G1: immutable HTML/PDF representation evidence;
--   G2: bounded Machine/contract provenance on Artifact Version;
--   G3: exact-version P11/B6 review evidence on the existing review history;
--   G4: one idempotent, provider-neutral SECURITY DEFINER registration RPC.
--
-- Legacy Artifact Versions and reviews remain historically valid. New Machine
-- registrations are complete as a unit and are only writable through the RPC.

-- =========================================================================
-- G2 · Producer / Machine provenance on the canonical produced occurrence.
-- =========================================================================

alter table production.artifact_versions
  add column producer_machine_id text,
  add column machine_git_sha text,
  add column machine_contract_version text,
  add column result_manifest_version text,
  add column source_input_fingerprint text,
  add column registration_evidence_sha256 text,
  add column registration_correlation_reference text,
  add column produced_version_identity text;

alter table production.artifact_versions
  add constraint artifact_versions_machine_id_bounded
    check (producer_machine_id is null or char_length(producer_machine_id) between 1 and 100),
  add constraint artifact_versions_machine_git_sha_full
    check (machine_git_sha is null or machine_git_sha ~ '^[0-9a-f]{40}$'),
  add constraint artifact_versions_machine_contract_bounded
    check (machine_contract_version is null or char_length(machine_contract_version) between 1 and 50),
  add constraint artifact_versions_manifest_contract_bounded
    check (result_manifest_version is null or char_length(result_manifest_version) between 1 and 50),
  add constraint artifact_versions_source_fingerprint_sha256
    check (source_input_fingerprint is null or source_input_fingerprint ~ '^[0-9a-f]{64}$'),
  add constraint artifact_versions_registration_evidence_sha256
    check (registration_evidence_sha256 is null or registration_evidence_sha256 ~ '^[0-9a-f]{64}$'),
  add constraint artifact_versions_registration_correlation_bounded
    check (registration_correlation_reference is null or char_length(registration_correlation_reference) between 1 and 300),
  add constraint artifact_versions_produced_identity_b6
    check (produced_version_identity is null or produced_version_identity ~ '^b6-pv1:[0-9a-f]{64}$'),
  add constraint artifact_versions_machine_registration_complete
    check (
      registration_correlation_reference is null
      or (
        producer_machine_id is not null
        and machine_git_sha is not null
        and machine_contract_version is not null
        and result_manifest_version is not null
        and source_input_fingerprint is not null
        and registration_evidence_sha256 is not null
        and produced_version_identity is not null
        and build_identity is not null
        and content_digest is not null
      )
    );

create unique index production_artifact_versions_registration_correlation_idx
  on production.artifact_versions (registration_correlation_reference)
  where registration_correlation_reference is not null;

comment on column production.artifact_versions.producer_machine_id is
  'Bounded producer identity for a Machine-originated Artifact Version. HAT_MAM_MACHINE_01 for this bridge; no provider or execution authority.';
comment on column production.artifact_versions.machine_git_sha is
  'Immutable full Generator commit SHA asserted by the accepted Result Manifest.';
comment on column production.artifact_versions.machine_contract_version is
  'Accepted Generator Machine contract version. It does not define Backend or P11 state.';
comment on column production.artifact_versions.result_manifest_version is
  'Accepted Result Manifest schema version supplied by the trusted registration caller.';
comment on column production.artifact_versions.source_input_fingerprint is
  'Immutable material binding copied from the canonical Job and accepted Generator evidence; never an idempotency key.';
comment on column production.artifact_versions.registration_evidence_sha256 is
  'Backend-computed SHA-256 of the canonical Job Envelope + Result Manifest contract evidence (P11 review excluded). It detects same-correlation material conflict without retaining a raw JSON payload.';
comment on column production.artifact_versions.registration_correlation_reference is
  'Caller-owned immutable registration occurrence identity. Exact replay returns the existing row; conflicting replay fails closed.';
comment on column production.artifact_versions.produced_version_identity is
  'B6 produced-version identity derived from exact Job, Attempt, build identity, and content digest. It binds review evidence to this occurrence and grants no downstream authority.';

-- =========================================================================
-- G1 · One Artifact Version, exactly two bounded file representations.
-- =========================================================================

create table production.artifact_version_representations (
  id uuid primary key default gen_random_uuid(),
  artifact_version_id uuid not null references production.artifact_versions(id) on delete restrict,
  representation_role text not null check (representation_role in ('customer_html', 'a5_pdf')),
  mime_type text not null,
  byte_size bigint not null check (byte_size > 0),
  checksum_sha256 text not null check (checksum_sha256 ~ '^[0-9a-f]{64}$'),
  storage_reference text not null check (
    char_length(storage_reference) between 8 and 500
    and storage_reference ~ '^repo://[^/[:space:]][^[:space:]]*$'
    and storage_reference !~ '(^repo://\.\.(/|$)|/\.\.(/|$))'
  ),
  generated_at timestamptz not null,
  created_at timestamptz not null default now(),
  constraint artifact_version_representations_unique_role
    unique (artifact_version_id, representation_role),
  constraint artifact_version_representations_role_mime
    check (
      (representation_role = 'customer_html' and mime_type = 'text/html; charset=utf-8')
      or (representation_role = 'a5_pdf' and mime_type = 'application/pdf')
    )
);

comment on table production.artifact_version_representations is
  'Immutable bounded evidence for the customer HTML and A5 PDF representations of one canonical Artifact Version. Stores no raw file content and activates no storage/provider. Existing does not imply P11 approval, entitlement, publication, access, delivery, or customer confirmation.';

create index production_artifact_version_representations_version_idx
  on production.artifact_version_representations (artifact_version_id);

create trigger production_artifact_version_representations_block_update
  before update on production.artifact_version_representations
  for each row execute function production.reject_immutable_mutation();
create trigger production_artifact_version_representations_block_delete
  before delete on production.artifact_version_representations
  for each row execute function production.reject_immutable_mutation();
create trigger production_artifact_version_representations_audit
  after insert on production.artifact_version_representations
  for each row execute function production.log_audit_event();

alter table production.artifact_version_representations enable row level security;
alter table production.artifact_version_representations force row level security;
revoke all on production.artifact_version_representations from public, anon, authenticated;
grant select on production.artifact_version_representations to service_role;

-- =========================================================================
-- G3 · Legacy-safe, exact-version P11/B6 evidence on existing review rows.
-- =========================================================================

alter table production.artifact_reviews
  add column acceptance_contract_version text,
  add column production_job_id uuid references production.jobs(id) on delete restrict,
  add column job_attempt_id uuid,
  add column produced_version_identity text,
  add column review_content_digest text,
  add column review_build_identity text,
  add column provenance_status text,
  add column review_reason text,
  add column check_evidence text[],
  add column review_contract_guarded boolean not null default false,
  add constraint artifact_reviews_attempt_belongs_to_job
    foreign key (job_attempt_id, production_job_id) references production.job_attempts(id, job_id),
  add constraint artifact_reviews_acceptance_contract_bounded
    check (acceptance_contract_version is null or char_length(acceptance_contract_version) between 1 and 50),
  add constraint artifact_reviews_produced_identity_b6
    check (produced_version_identity is null or produced_version_identity ~ '^b6-pv1:[0-9a-f]{64}$'),
  add constraint artifact_reviews_content_digest_sha256
    check (review_content_digest is null or review_content_digest ~ '^[0-9a-f]{64}$'),
  add constraint artifact_reviews_build_identity_bounded
    check (review_build_identity is null or char_length(review_build_identity) between 1 and 300),
  add constraint artifact_reviews_provenance_state
    check (provenance_status is null or provenance_status in ('VERIFIED', 'INCOMPLETE', 'UNKNOWN', 'STALE', 'MISMATCHED')),
  add constraint artifact_reviews_reason_bounded
    check (review_reason is null or char_length(review_reason) between 1 and 2000),
  add constraint artifact_reviews_check_evidence_bounded
    check (check_evidence is null or cardinality(check_evidence) <= 100),
  add constraint artifact_reviews_p11_contract_complete
    check (
      not review_contract_guarded
      or review_source <> 'P11_PRODUCT_ACCEPTANCE'
      or (
        acceptance_contract_version = '0.1'
        and production_job_id is not null
        and job_attempt_id is not null
        and produced_version_identity is not null
        and review_content_digest is not null
        and review_build_identity is not null
        and provenance_status is not null
        and review_reason is not null
        and check_evidence is not null
      )
    );

alter table production.artifact_reviews
  alter column review_contract_guarded set default true;

comment on column production.artifact_reviews.review_contract_guarded is
  'Legacy-safe compatibility marker. FALSE identifies rows predating this bridge; TRUE is forced for every new row. New P11_PRODUCT_ACCEPTANCE rows must carry complete B6 binding evidence.';

-- Extend the existing replay trigger: generic review behavior remains intact;
-- new P11 rows additionally prove exact Artifact Version/Job/Attempt/material.
create or replace function production.validate_artifact_review_replay()
returns trigger
language plpgsql
set search_path = pg_catalog, production
as $$
declare
  v_version_job uuid;
  v_version_attempt uuid;
  v_version_identity text;
  v_version_digest text;
  v_version_build text;
begin
  if NEW.review_correlation_reference is null then
    raise exception 'REVIEW_CORRELATION_REFERENCE_REQUIRED';
  end if;

  NEW.review_replay_guarded := true;
  NEW.review_contract_guarded := true;

  if NEW.review_source = 'P11_PRODUCT_ACCEPTANCE' then
    select job_id, job_attempt_id, produced_version_identity, content_digest, build_identity
      into v_version_job, v_version_attempt, v_version_identity, v_version_digest, v_version_build
    from production.artifact_versions
    where id = NEW.artifact_version_id;

    if v_version_job is null then
      raise exception 'P11_ARTIFACT_VERSION_NOT_FOUND';
    end if;
    if NEW.acceptance_contract_version is distinct from '0.1' then
      raise exception 'P11_ACCEPTANCE_CONTRACT_INVALID';
    end if;
    if NEW.production_job_id is distinct from v_version_job then
      raise exception 'P11_JOB_BINDING_MISMATCH';
    end if;
    if NEW.job_attempt_id is distinct from v_version_attempt then
      raise exception 'P11_ATTEMPT_BINDING_MISMATCH';
    end if;
    if NEW.produced_version_identity is distinct from v_version_identity then
      raise exception 'P11_VERSION_BINDING_MISMATCH';
    end if;
    if NEW.review_content_digest is distinct from v_version_digest then
      raise exception 'P11_DIGEST_BINDING_MISMATCH';
    end if;
    if NEW.review_build_identity is distinct from v_version_build then
      raise exception 'P11_BUILD_BINDING_MISMATCH';
    end if;
    if NEW.review_state <> 'pending' and NEW.provenance_status <> 'VERIFIED' then
      raise exception 'P11_PROVENANCE_NOT_VERIFIED';
    end if;
    if NEW.review_state <> 'pending' and cardinality(NEW.check_evidence) = 0 then
      raise exception 'P11_NON_PENDING_EVIDENCE_REQUIRED';
    end if;
    if exists (
      select 1 from unnest(NEW.check_evidence) item where btrim(item) = ''
    ) or cardinality(NEW.check_evidence) <> (
      select count(distinct item) from unnest(NEW.check_evidence) item
    ) then
      raise exception 'P11_CHECK_EVIDENCE_INVALID';
    end if;
  end if;

  if exists (
    select 1
    from production.artifact_reviews existing
    where existing.artifact_version_id = NEW.artifact_version_id
      and existing.review_source = NEW.review_source
      and existing.review_correlation_reference = NEW.review_correlation_reference
  ) then
    raise exception 'REVIEW_EVENT_REPLAY';
  end if;

  return NEW;
end;
$$;

revoke all on function production.validate_artifact_review_replay() from public, anon, authenticated;

-- =========================================================================
-- G4 · One bounded atomic registration adapter.
-- =========================================================================

create or replace function production.register_generator_result(p_evidence jsonb)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, production
as $$
declare
  v_mode text;
  v_correlation text;
  v_envelope jsonb;
  v_manifest jsonb;
  v_review jsonb;
  v_job production.jobs%rowtype;
  v_attempt production.job_attempts%rowtype;
  v_artifact_id uuid;
  v_artifact_version_id uuid;
  v_version_number integer;
  v_existing production.artifact_versions%rowtype;
  v_registration_status text;
  v_review_status text := 'NO_REVIEW';
  v_machine_sha text;
  v_build_identity text;
  v_content_digest text;
  v_input_fingerprint text;
  v_registration_evidence_sha text;
  v_expected_produced_identity text;
  v_html jsonb;
  v_pdf jsonb;
  v_review_state text;
  v_reviewed_at timestamptz;
  v_check_evidence text[];
  v_existing_review production.artifact_reviews%rowtype;
  v_review_id uuid;
begin
  if jsonb_typeof(p_evidence) <> 'object'
     or not (p_evidence ?& array[
       'registration_mode', 'registration_correlation_reference',
       'result_manifest_version', 'job_envelope', 'result_manifest', 'p11_review'
     ])
     or p_evidence - array[
       'registration_mode', 'registration_correlation_reference',
       'result_manifest_version', 'job_envelope', 'result_manifest', 'p11_review'
     ] <> '{}'::jsonb then
    raise exception 'GENERATOR_REGISTRATION_BUNDLE_INVALID';
  end if;

  v_mode := p_evidence->>'registration_mode';
  v_correlation := p_evidence->>'registration_correlation_reference';
  v_envelope := p_evidence->'job_envelope';
  v_manifest := p_evidence->'result_manifest';
  v_review := p_evidence->'p11_review';

  if v_mode not in ('REGISTER', 'RECONCILE') then
    raise exception 'GENERATOR_REGISTRATION_MODE_INVALID';
  end if;
  if v_correlation is null or char_length(v_correlation) not between 1 and 300 then
    raise exception 'GENERATOR_REGISTRATION_CORRELATION_INVALID';
  end if;
  if p_evidence->>'result_manifest_version' <> '0.2' then
    raise exception 'GENERATOR_RESULT_MANIFEST_VERSION_INVALID';
  end if;

  -- Serialize identical correlation and canonical Artifact-scope operations.
  perform pg_advisory_xact_lock(hashtextextended('gbi-registration:' || v_correlation, 0));

  -- Exact accepted Job Envelope v0.2 surface.
  if jsonb_typeof(v_envelope) <> 'object'
     or not (v_envelope ?& array[
       'production_job_id', 'job_attempt_id', 'job_attempt_number',
       'job_idempotency_key', 'attempt_idempotency_key', 'person_id',
       'product_id', 'machine_contract_version', 'requested_output_roles',
       'input_bundle_reference', 'input_fingerprint'
     ])
     or v_envelope - array[
       'production_job_id', 'job_attempt_id', 'job_attempt_number',
       'job_idempotency_key', 'attempt_idempotency_key', 'person_id',
       'product_id', 'product_version_id', 'journey_anchor_id', 'order_id',
       'machine_contract_version', 'requested_output_roles',
       'input_bundle_reference', 'input_fingerprint'
     ] <> '{}'::jsonb then
    raise exception 'GENERATOR_JOB_ENVELOPE_INVALID';
  end if;

  if v_envelope->>'machine_contract_version' <> '0.2'
     or jsonb_typeof(v_envelope->'requested_output_roles') <> 'array'
     or jsonb_array_length(v_envelope->'requested_output_roles') <> 2
     or (select count(*) from jsonb_array_elements_text(v_envelope->'requested_output_roles') as roles(role)
         where role in ('customer_html', 'a5_pdf')) <> 2
     or (select count(distinct role) from jsonb_array_elements_text(v_envelope->'requested_output_roles') as roles(role)) <> 2
     or jsonb_typeof(v_envelope->'job_attempt_number') <> 'number'
     or coalesce(v_envelope->>'job_attempt_number', '') !~ '^[1-9][0-9]*$'
     or coalesce(v_envelope->>'input_bundle_reference', '') !~ '^repo://[^/[:space:]][^[:space:]]*$'
     or coalesce(v_envelope->>'input_bundle_reference', '') ~ '(^repo://\.\.(/|$)|/\.\.(/|$))'
     or lower(coalesce(v_envelope->>'input_fingerprint', '')) !~ '^[0-9a-f]{64}$' then
    raise exception 'GENERATOR_JOB_ENVELOPE_CONTRACT_INVALID';
  end if;

  v_input_fingerprint := lower(v_envelope->>'input_fingerprint');

  select * into v_job
  from production.jobs
  where id = (v_envelope->>'production_job_id')::uuid
  for update;
  if not found then
    raise exception 'GENERATOR_REGISTRATION_JOB_NOT_FOUND';
  end if;

  if v_job.id::text is distinct from v_envelope->>'production_job_id'
     or v_job.person_id::text is distinct from v_envelope->>'person_id'
     or v_job.product_id::text is distinct from v_envelope->>'product_id'
     or v_job.product_version_id::text is distinct from v_envelope->>'product_version_id'
     or v_job.journey_anchor_id::text is distinct from v_envelope->>'journey_anchor_id'
     or v_job.order_id::text is distinct from v_envelope->>'order_id'
     or v_job.idempotency_key is distinct from v_envelope->>'job_idempotency_key'
     or v_job.input_fingerprint is distinct from v_input_fingerprint then
    raise exception 'GENERATOR_REGISTRATION_JOB_BINDING_MISMATCH';
  end if;
  if v_job.status <> 'succeeded' then
    raise exception 'GENERATOR_REGISTRATION_JOB_NOT_SUCCEEDED';
  end if;

  select * into v_attempt
  from production.job_attempts
  where id = (v_envelope->>'job_attempt_id')::uuid;
  if not found then
    raise exception 'GENERATOR_REGISTRATION_ATTEMPT_NOT_FOUND';
  end if;
  if v_attempt.job_id is distinct from v_job.id
     or v_attempt.attempt_number is distinct from (v_envelope->>'job_attempt_number')::integer
     or v_attempt.idempotency_key is distinct from v_envelope->>'attempt_idempotency_key' then
    raise exception 'GENERATOR_REGISTRATION_ATTEMPT_BINDING_MISMATCH';
  end if;
  if v_attempt.status <> 'succeeded' then
    raise exception 'GENERATOR_REGISTRATION_ATTEMPT_NOT_SUCCEEDED';
  end if;

  -- Exact successful Result Manifest v0.2 surface and authority boundary.
  if jsonb_typeof(v_manifest) <> 'object'
     or not (v_manifest ?& array[
       'result_status', 'production_job_id', 'job_attempt_id', 'machine_name',
       'machine_contract_version', 'machine_git_sha', 'build_identity',
       'content_digest', 'generated_at', 'input_fingerprint', 'technical_checks',
       'warnings', 'failure', 'output_set', 'output_files'
     ])
     or v_manifest - array[
       'result_status', 'production_job_id', 'job_attempt_id', 'machine_name',
       'machine_contract_version', 'machine_git_sha', 'build_identity',
       'content_digest', 'generated_at', 'input_fingerprint', 'technical_checks',
       'warnings', 'failure', 'output_set', 'output_files'
     ] <> '{}'::jsonb then
    raise exception 'GENERATOR_RESULT_MANIFEST_INVALID';
  end if;

  v_machine_sha := lower(v_manifest->>'machine_git_sha');
  v_build_identity := v_manifest->>'build_identity';
  v_content_digest := lower(v_manifest->>'content_digest');

  if v_manifest->>'result_status' <> 'succeeded'
     or v_manifest->>'production_job_id' is distinct from v_job.id::text
     or v_manifest->>'job_attempt_id' is distinct from v_attempt.id::text
     or v_manifest->>'machine_name' <> 'HAT_MAM_MACHINE_01'
     or v_manifest->>'machine_contract_version' <> '0.2'
     or v_machine_sha !~ '^[0-9a-f]{40}$'
     or lower(v_build_identity) is distinct from ('hat_mam_machine_01@' || v_machine_sha)
     or v_content_digest !~ '^[0-9a-f]{64}$'
     or lower(coalesce(v_manifest->>'input_fingerprint', '')) is distinct from v_input_fingerprint
     or v_manifest->'failure' <> 'null'::jsonb
     or jsonb_typeof(v_manifest->'warnings') <> 'array'
     or exists (
       select 1 from jsonb_array_elements(v_manifest->'warnings') as warnings(warning)
       where jsonb_typeof(warning) <> 'string'
     )
     or coalesce(v_manifest->>'generated_at', '') !~ '^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$' then
    raise exception 'GENERATOR_RESULT_MANIFEST_BINDING_INVALID';
  end if;

  if jsonb_typeof(v_manifest->'technical_checks') <> 'object'
     or not ((v_manifest->'technical_checks') ?& array['status', 'product_acceptance', 'boundary'])
     or (v_manifest->'technical_checks') - array['status', 'checks', 'product_acceptance', 'boundary'] <> '{}'::jsonb
     or v_manifest#>>'{technical_checks,status}' <> 'PASS'
     or v_manifest#>>'{technical_checks,product_acceptance}' <> 'NOT_EVALUATED_BY_MACHINE'
     or (
       (v_manifest->'technical_checks') ? 'checks'
       and (
         jsonb_typeof(v_manifest#>'{technical_checks,checks}') <> 'array'
         or exists (
           select 1 from jsonb_array_elements(v_manifest#>'{technical_checks,checks}') as checks(check_item)
           where jsonb_typeof(check_item) <> 'string' or btrim(check_item#>>'{}') = ''
         )
         or (select count(*) from jsonb_array_elements_text(v_manifest#>'{technical_checks,checks}'))
            <> (select count(distinct check_item) from jsonb_array_elements_text(v_manifest#>'{technical_checks,checks}') as checks(check_item))
       )
     )
     or jsonb_typeof(v_manifest#>'{technical_checks,boundary}') <> 'object'
     or (v_manifest#>'{technical_checks,boundary}') - array[
       'entitlement_granted', 'publication_marked_live', 'customer_access_decided',
       'delivery_succeeded_declared', 'backend_delivery_authority_used'
     ] <> '{}'::jsonb
     or not ((v_manifest#>'{technical_checks,boundary}') ?& array[
       'entitlement_granted', 'publication_marked_live', 'customer_access_decided',
       'delivery_succeeded_declared', 'backend_delivery_authority_used'
     ])
     or exists (
       select 1 from jsonb_each(v_manifest#>'{technical_checks,boundary}') boundary
       where boundary.value <> 'false'::jsonb
     ) then
    raise exception 'GENERATOR_MACHINE_AUTHORITY_BOUNDARY_INVALID';
  end if;

  if jsonb_typeof(v_manifest->'output_set') <> 'object'
     or (v_manifest->'output_set') - array['semantic', 'artifact_version_registration_claimed'] <> '{}'::jsonb
     or v_manifest#>>'{output_set,semantic}' <> 'ONE_LOGICAL_ARTIFACT_VERSION_WITH_TWO_FILE_REPRESENTATIONS'
     or v_manifest#>'{output_set,artifact_version_registration_claimed}' <> 'false'::jsonb
     or jsonb_typeof(v_manifest->'output_files') <> 'array'
     or jsonb_array_length(v_manifest->'output_files') <> 2 then
    raise exception 'GENERATOR_RESULT_OUTPUT_SET_INVALID';
  end if;

  select file into v_html
  from jsonb_array_elements(v_manifest->'output_files') as files(file)
  where file->>'role' = 'customer_html';
  select file into v_pdf
  from jsonb_array_elements(v_manifest->'output_files') as files(file)
  where file->>'role' = 'a5_pdf';

  if v_html is null or v_pdf is null
     or exists (
       select 1 from jsonb_array_elements(v_manifest->'output_files') as files(file)
       where jsonb_typeof(file) <> 'object'
          or not (file ?& array['role', 'location_reference', 'mime_type', 'byte_size', 'checksum_sha256', 'generated_at'])
          or file - array['role', 'location_reference', 'mime_type', 'byte_size', 'checksum_sha256', 'generated_at'] <> '{}'::jsonb
          or file->>'role' not in ('customer_html', 'a5_pdf')
          or jsonb_typeof(file->'byte_size') <> 'number'
          or coalesce(file->>'byte_size', '') !~ '^[1-9][0-9]*$'
          or (file->>'byte_size')::bigint <= 0
          or lower(coalesce(file->>'checksum_sha256', '')) !~ '^[0-9a-f]{64}$'
          or coalesce(file->>'location_reference', '') !~ '^repo://[^/[:space:]][^[:space:]]*$'
          or coalesce(file->>'location_reference', '') ~ '(^repo://\.\.(/|$)|/\.\.(/|$))'
          or coalesce(file->>'generated_at', '') !~ '^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$'
          or (file->>'role' = 'customer_html' and file->>'mime_type' <> 'text/html; charset=utf-8')
          or (file->>'role' = 'a5_pdf' and file->>'mime_type' <> 'application/pdf')
     ) then
    raise exception 'GENERATOR_REPRESENTATION_EVIDENCE_INVALID';
  end if;

  -- Exact B6 canonical JSON serialization (sorted keys, no spaces), hashed
  -- with PostgreSQL's built-in sha256(bytea), matching Generator sha256Json.
  v_expected_produced_identity := 'b6-pv1:' || encode(sha256(convert_to(
    '{"build_identity":' || to_jsonb(v_build_identity)::text
    || ',"content_digest":' || to_jsonb(v_content_digest)::text
    || ',"job_attempt_id":' || to_jsonb(v_attempt.id::text)::text
    || ',"production_job_id":' || to_jsonb(v_job.id::text)::text || '}',
    'UTF8'
  )), 'hex');

  v_registration_evidence_sha := encode(sha256(convert_to(jsonb_build_object(
    'result_manifest_version', p_evidence->'result_manifest_version',
    'job_envelope', v_envelope,
    'result_manifest', v_manifest
  )::text, 'UTF8')), 'hex');

  -- Correlation lookup happens before Artifact creation so exact W4 replay
  -- cannot produce even an otherwise-idempotent write.
  select * into v_existing
  from production.artifact_versions
  where registration_correlation_reference = v_correlation;

  if found then
    v_artifact_version_id := v_existing.id;
    v_artifact_id := v_existing.artifact_id;
    v_version_number := v_existing.version_number;

    if v_existing.job_id is distinct from v_job.id
       or v_existing.job_attempt_id is distinct from v_attempt.id
       or v_existing.output_kind <> 'document'
       or v_existing.producer_machine_id <> 'HAT_MAM_MACHINE_01'
       or v_existing.machine_git_sha is distinct from v_machine_sha
       or v_existing.machine_contract_version <> '0.2'
       or v_existing.result_manifest_version <> '0.2'
       or v_existing.source_input_fingerprint is distinct from v_input_fingerprint
       or v_existing.registration_evidence_sha256 is distinct from v_registration_evidence_sha
       or v_existing.build_identity is distinct from v_build_identity
       or v_existing.content_digest is distinct from v_content_digest
       or v_existing.produced_version_identity is distinct from v_expected_produced_identity
       or not exists (
         select 1 from production.artifact_version_representations r
         where r.artifact_version_id = v_existing.id and r.representation_role = 'customer_html'
           and r.mime_type = v_html->>'mime_type'
           and r.byte_size = (v_html->>'byte_size')::bigint
           and r.checksum_sha256 = lower(v_html->>'checksum_sha256')
           and r.storage_reference = v_html->>'location_reference'
           and r.generated_at = (v_html->>'generated_at')::timestamptz
       )
       or not exists (
         select 1 from production.artifact_version_representations r
         where r.artifact_version_id = v_existing.id and r.representation_role = 'a5_pdf'
           and r.mime_type = v_pdf->>'mime_type'
           and r.byte_size = (v_pdf->>'byte_size')::bigint
           and r.checksum_sha256 = lower(v_pdf->>'checksum_sha256')
           and r.storage_reference = v_pdf->>'location_reference'
           and r.generated_at = (v_pdf->>'generated_at')::timestamptz
       ) then
      raise exception 'GENERATOR_REGISTRATION_CORRELATION_CONFLICT';
    end if;
    v_registration_status := 'REPLAYED_EXISTING';
  else
    if v_mode = 'RECONCILE' then
      return jsonb_build_object(
        'registration_status', 'RECONCILE_REQUIRED',
        'reason_code', 'W3_REGISTRATION_NOT_FOUND_NO_WRITE',
        'registration_correlation_reference', v_correlation,
        'artifact_id', null,
        'artifact_version_id', null,
        'artifact_version_number', null,
        'review_status', 'NO_REVIEW',
        'downstream_authority_granted', false
      );
    end if;

    perform pg_advisory_xact_lock(hashtextextended(
      'gbi-artifact:' || v_job.person_id::text || ':' || v_job.product_id::text || ':'
      || coalesce(v_job.journey_anchor_id::text, '00000000-0000-0000-0000-000000000000'), 0
    ));

    select id into v_artifact_id
    from production.artifacts
    where person_id = v_job.person_id
      and product_id = v_job.product_id
      and journey_anchor_id is not distinct from v_job.journey_anchor_id;

    if v_artifact_id is null then
      insert into production.artifacts (
        person_id, product_id, product_version_id, journey_anchor_id
      ) values (
        v_job.person_id, v_job.product_id, v_job.product_version_id, v_job.journey_anchor_id
      ) returning id into v_artifact_id;
    end if;

    if exists (
      select 1 from production.artifact_versions
      where artifact_id = v_artifact_id and job_attempt_id = v_attempt.id
    ) then
      raise exception 'GENERATOR_REGISTRATION_ATTEMPT_ALREADY_REGISTERED';
    end if;

    select coalesce(max(version_number), 0) + 1 into v_version_number
    from production.artifact_versions
    where artifact_id = v_artifact_id;

    insert into production.artifact_versions (
      artifact_id, version_number, job_id, job_attempt_id, output_kind,
      build_identity, content_digest, producer_machine_id, machine_git_sha,
      machine_contract_version, result_manifest_version, source_input_fingerprint,
      registration_evidence_sha256, registration_correlation_reference,
      produced_version_identity
    ) values (
      v_artifact_id, v_version_number, v_job.id, v_attempt.id, 'document',
      v_build_identity, v_content_digest, 'HAT_MAM_MACHINE_01', v_machine_sha,
      '0.2', '0.2', v_input_fingerprint, v_registration_evidence_sha,
      v_correlation, v_expected_produced_identity
    ) returning id into v_artifact_version_id;

    insert into production.artifact_version_representations (
      artifact_version_id, representation_role, mime_type, byte_size,
      checksum_sha256, storage_reference, generated_at
    ) values
      (
        v_artifact_version_id, 'customer_html', v_html->>'mime_type',
        (v_html->>'byte_size')::bigint, lower(v_html->>'checksum_sha256'),
        v_html->>'location_reference', (v_html->>'generated_at')::timestamptz
      ),
      (
        v_artifact_version_id, 'a5_pdf', v_pdf->>'mime_type',
        (v_pdf->>'byte_size')::bigint, lower(v_pdf->>'checksum_sha256'),
        v_pdf->>'location_reference', (v_pdf->>'generated_at')::timestamptz
      );

    v_registration_status := 'REGISTERED_NEW';
  end if;

  -- Optional accepted B6 record. It remains a distinct immutable review fact;
  -- Machine success never manufactures Product Acceptance.
  if v_review <> 'null'::jsonb then
    if jsonb_typeof(v_review) <> 'object'
       or not (v_review ?& array[
         'acceptance_contract_version', 'review_correlation_id', 'production_job_id',
         'job_attempt_id', 'produced_version_identity', 'content_digest',
         'build_identity', 'review_state', 'review_source', 'provenance_status',
         'reviewed_at', 'reason', 'check_evidence', 'boundary'
       ])
       or v_review - array[
         'acceptance_contract_version', 'review_correlation_id', 'production_job_id',
         'job_attempt_id', 'produced_version_identity', 'content_digest',
         'build_identity', 'review_state', 'review_source', 'provenance_status',
         'reviewed_at', 'reason', 'check_evidence', 'boundary'
       ] <> '{}'::jsonb then
      raise exception 'P11_REVIEW_EVIDENCE_INVALID';
    end if;

    v_review_state := v_review->>'review_state';
    if v_review->>'acceptance_contract_version' <> '0.1'
       or v_review->>'review_source' <> 'P11_PRODUCT_ACCEPTANCE'
       or v_review_state not in ('PENDING', 'APPROVED', 'NEEDS_CHANGES', 'REJECTED')
       or v_review->>'production_job_id' is distinct from v_job.id::text
       or v_review->>'job_attempt_id' is distinct from v_attempt.id::text
       or v_review->>'produced_version_identity' is distinct from v_expected_produced_identity
       or lower(coalesce(v_review->>'content_digest', '')) is distinct from v_content_digest
       or v_review->>'build_identity' is distinct from v_build_identity
       or coalesce(v_review->>'provenance_status', '') not in ('VERIFIED', 'INCOMPLETE', 'UNKNOWN', 'STALE', 'MISMATCHED')
       or (v_review_state <> 'PENDING' and v_review->>'provenance_status' <> 'VERIFIED')
       or coalesce(v_review->>'review_correlation_id', '') = ''
       or char_length(v_review->>'review_correlation_id') > 300
       or coalesce(v_review->>'reason', '') = ''
       or char_length(v_review->>'reason') > 2000
       or coalesce(v_review->>'reviewed_at', '') !~ '^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$'
       or jsonb_typeof(v_review->'check_evidence') <> 'array'
       or jsonb_array_length(v_review->'check_evidence') > 100
       or exists (
         select 1 from jsonb_array_elements(v_review->'check_evidence') as items(item)
         where jsonb_typeof(item) <> 'string' or btrim(item#>>'{}') = ''
       )
       or (select count(*) from jsonb_array_elements_text(v_review->'check_evidence'))
          <> (select count(distinct item) from jsonb_array_elements_text(v_review->'check_evidence') as items(item))
       or (v_review_state <> 'PENDING' and jsonb_array_length(v_review->'check_evidence') = 0)
       or jsonb_typeof(v_review->'boundary') <> 'object'
       or (v_review->'boundary') - array[
         'entitlement_granted', 'publication_marked_live', 'customer_access_decided',
         'delivery_succeeded_declared', 'customer_confirmed_declared'
       ] <> '{}'::jsonb
       or not ((v_review->'boundary') ?& array[
         'entitlement_granted', 'publication_marked_live', 'customer_access_decided',
         'delivery_succeeded_declared', 'customer_confirmed_declared'
       ])
       or exists (select 1 from jsonb_each(v_review->'boundary') boundary where boundary.value <> 'false'::jsonb) then
      raise exception 'P11_REVIEW_EVIDENCE_CONTRACT_INVALID';
    end if;

    v_reviewed_at := (v_review->>'reviewed_at')::timestamptz;
    select coalesce(array_agg(item order by ordinal), '{}'::text[]) into v_check_evidence
    from jsonb_array_elements_text(v_review->'check_evidence') with ordinality evidence(item, ordinal);

    select * into v_existing_review
    from production.artifact_reviews
    where artifact_version_id = v_artifact_version_id
      and review_source = 'P11_PRODUCT_ACCEPTANCE'
      and review_correlation_reference = v_review->>'review_correlation_id';

    if found then
      if v_existing_review.acceptance_contract_version <> '0.1'
         or v_existing_review.production_job_id is distinct from v_job.id
         or v_existing_review.job_attempt_id is distinct from v_attempt.id
         or v_existing_review.produced_version_identity is distinct from v_expected_produced_identity
         or v_existing_review.review_content_digest is distinct from v_content_digest
         or v_existing_review.review_build_identity is distinct from v_build_identity
         or v_existing_review.review_state is distinct from lower(v_review_state)
         or v_existing_review.provenance_status is distinct from v_review->>'provenance_status'
         or v_existing_review.review_reason is distinct from v_review->>'reason'
         or v_existing_review.check_evidence is distinct from v_check_evidence then
        raise exception 'P11_REVIEW_CORRELATION_CONFLICT';
      end if;
      v_review_id := v_existing_review.id;
      v_review_status := 'REPLAYED_EXISTING';
    else
      insert into production.artifact_reviews (
        artifact_version_id, review_state, reviewed_at, review_source,
        review_correlation_reference, acceptance_contract_version,
        production_job_id, job_attempt_id, produced_version_identity,
        review_content_digest, review_build_identity, provenance_status,
        review_reason, check_evidence
      ) values (
        v_artifact_version_id, lower(v_review_state), v_reviewed_at,
        'P11_PRODUCT_ACCEPTANCE', v_review->>'review_correlation_id', '0.1',
        v_job.id, v_attempt.id, v_expected_produced_identity,
        v_content_digest, v_build_identity, v_review->>'provenance_status',
        v_review->>'reason', v_check_evidence
      ) returning id into v_review_id;
      v_review_status := 'APPENDED_NEW';
    end if;
  end if;

  return jsonb_build_object(
    'registration_status', v_registration_status,
    'reason_code', case
      when v_registration_status = 'REGISTERED_NEW' then 'CANONICAL_REGISTRATION_CREATED'
      else 'W4_EXISTING_REGISTRATION_REPLAYED'
    end,
    'registration_correlation_reference', v_correlation,
    'artifact_id', v_artifact_id,
    'artifact_version_id', v_artifact_version_id,
    'artifact_version_number', v_version_number,
    'produced_version_identity', v_expected_produced_identity,
    'review_status', v_review_status,
    'review_id', v_review_id,
    'machine_success_recorded', true,
    'product_acceptance_inferred', false,
    'entitlement_granted', false,
    'publication_marked_live', false,
    'customer_access_decided', false,
    'delivery_succeeded_declared', false,
    'customer_confirmed_declared', false,
    'downstream_authority_granted', false
  );
end;
$$;

comment on function production.register_generator_result(jsonb) is
  'Atomic provider-neutral Machine 01 evidence registration. Validates accepted Job Envelope/Result Manifest/B6 bindings against canonical Job and successful Attempt, records one Artifact Version plus exactly HTML/PDF evidence, idempotently replays exact W4 ACK loss, returns no-write W3 reconciliation requirement, and never grants entitlement/publication/access/delivery/customer-confirmed authority.';

revoke all on function production.register_generator_result(jsonb) from public, anon, authenticated;
grant execute on function production.register_generator_result(jsonb) to service_role;

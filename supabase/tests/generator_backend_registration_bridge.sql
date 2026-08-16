\set ON_ERROR_STOP on
-- AT-GBI-01..19 synthetic runtime proof. The caller owns BEGIN/ROLLBACK.

set role service_role;

insert into identity.persons (id, display_label)
values ('00000000-0000-4000-8000-00000000c001', 'P07 GBI synthetic person');
insert into commerce.products (id, product_key, display_name)
values ('00000000-0000-4000-8000-00000000c002', 'p07_gbi_synthetic', 'P07 GBI Synthetic Product');
insert into commerce.product_versions (id, product_id, version_label)
values
  ('00000000-0000-4000-8000-00000000c003', '00000000-0000-4000-8000-00000000c002', 'synthetic-v1'),
  ('00000000-0000-4000-8000-00000000c004', '00000000-0000-4000-8000-00000000c002', 'synthetic-v2');

create temporary table gbi_test_baseline as
select (select count(*) from entitlement.entitlements) as entitlement_count;

create or replace function pg_temp.gbi_identity(
  p_job uuid, p_attempt uuid, p_build text, p_digest text
) returns text language sql immutable as $$
  select 'b6-pv1:' || encode(sha256(convert_to(
    '{"build_identity":' || to_jsonb(p_build)::text
    || ',"content_digest":' || to_jsonb(p_digest)::text
    || ',"job_attempt_id":' || to_jsonb(p_attempt::text)::text
    || ',"production_job_id":' || to_jsonb(p_job::text)::text || '}', 'UTF8'
  )), 'hex');
$$;

create or replace function pg_temp.gbi_bundle(
  p_job uuid,
  p_attempt uuid,
  p_correlation text,
  p_mode text default 'REGISTER',
  p_review_state text default null,
  p_review_correlation text default null
) returns jsonb
language plpgsql
as $$
declare
  v_job production.jobs%rowtype;
  v_attempt production.job_attempts%rowtype;
  v_sha text := repeat('a', 40);
  v_build text := 'HAT_MAM_MACHINE_01@' || repeat('a', 40);
  v_digest text := repeat('b', 64);
  v_review jsonb := 'null'::jsonb;
begin
  select * into strict v_job from production.jobs where id = p_job;
  select * into strict v_attempt from production.job_attempts where id = p_attempt;

  if p_review_state is not null then
    v_review := jsonb_build_object(
      'acceptance_contract_version', '0.1',
      'review_correlation_id', p_review_correlation,
      'production_job_id', p_job::text,
      'job_attempt_id', p_attempt::text,
      'produced_version_identity', pg_temp.gbi_identity(p_job, p_attempt, v_build, v_digest),
      'content_digest', v_digest,
      'build_identity', v_build,
      'review_state', p_review_state,
      'review_source', 'P11_PRODUCT_ACCEPTANCE',
      'provenance_status', case when p_review_state = 'PENDING' then 'INCOMPLETE' else 'VERIFIED' end,
      'reviewed_at', '2026-08-16T07:00:00.000Z',
      'reason', 'Synthetic ' || p_review_state || ' evidence',
      'check_evidence', case when p_review_state = 'PENDING' then '[]'::jsonb
                             else jsonb_build_array('SYNTHETIC_' || p_review_state || '_EVIDENCE') end,
      'boundary', jsonb_build_object(
        'entitlement_granted', false,
        'publication_marked_live', false,
        'customer_access_decided', false,
        'delivery_succeeded_declared', false,
        'customer_confirmed_declared', false
      )
    );
  end if;

  return jsonb_build_object(
    'registration_mode', p_mode,
    'registration_correlation_reference', p_correlation,
    'result_manifest_version', '0.2',
    'job_envelope', jsonb_build_object(
      'production_job_id', p_job::text,
      'job_attempt_id', p_attempt::text,
      'job_attempt_number', v_attempt.attempt_number,
      'job_idempotency_key', v_job.idempotency_key,
      'attempt_idempotency_key', v_attempt.idempotency_key,
      'person_id', v_job.person_id::text,
      'product_id', v_job.product_id::text,
      'product_version_id', v_job.product_version_id::text,
      'journey_anchor_id', v_job.journey_anchor_id::text,
      'order_id', v_job.order_id::text,
      'machine_contract_version', '0.2',
      'requested_output_roles', jsonb_build_array('customer_html', 'a5_pdf'),
      'input_bundle_reference', 'repo://tests/fixtures/valid-content.md',
      'input_fingerprint', v_job.input_fingerprint
    ),
    'result_manifest', jsonb_build_object(
      'result_status', 'succeeded',
      'production_job_id', p_job::text,
      'job_attempt_id', p_attempt::text,
      'machine_name', 'HAT_MAM_MACHINE_01',
      'machine_contract_version', '0.2',
      'machine_git_sha', v_sha,
      'build_identity', v_build,
      'content_digest', v_digest,
      'generated_at', '2026-08-16T06:00:00.000Z',
      'input_fingerprint', v_job.input_fingerprint,
      'technical_checks', jsonb_build_object(
        'status', 'PASS',
        'checks', jsonb_build_array('SYNTHETIC_NATIVE_HTML', 'SYNTHETIC_NATIVE_PDF'),
        'product_acceptance', 'NOT_EVALUATED_BY_MACHINE',
        'boundary', jsonb_build_object(
          'entitlement_granted', false,
          'publication_marked_live', false,
          'customer_access_decided', false,
          'delivery_succeeded_declared', false,
          'backend_delivery_authority_used', false
        )
      ),
      'warnings', '[]'::jsonb,
      'failure', 'null'::jsonb,
      'output_set', jsonb_build_object(
        'semantic', 'ONE_LOGICAL_ARTIFACT_VERSION_WITH_TWO_FILE_REPRESENTATIONS',
        'artifact_version_registration_claimed', false
      ),
      'output_files', jsonb_build_array(
        jsonb_build_object(
          'role', 'customer_html',
          'location_reference', 'repo://output/synthetic/customer.html',
          'mime_type', 'text/html; charset=utf-8',
          'byte_size', 1234,
          'checksum_sha256', repeat('c', 64),
          'generated_at', '2026-08-16T06:00:00.000Z'
        ),
        jsonb_build_object(
          'role', 'a5_pdf',
          'location_reference', 'repo://output/synthetic/customer-a5.pdf',
          'mime_type', 'application/pdf',
          'byte_size', 5678,
          'checksum_sha256', repeat('d', 64),
          'generated_at', '2026-08-16T06:00:01.000Z'
        )
      )
    ),
    'p11_review', v_review
  );
end;
$$;

create or replace function pg_temp.expect_gbi_error(p_bundle jsonb, p_token text)
returns void language plpgsql as $$
begin
  perform production.register_generator_result(p_bundle);
  raise exception 'EXPECTED_GBI_REJECTION_MISSING: %', p_token;
exception when others then
  if position(p_token in sqlerrm) = 0 then raise; end if;
end;
$$;

-- Primary successful Job/Attempt.
insert into production.jobs (
  id, person_id, product_id, product_version_id, idempotency_key, input_fingerprint
) values (
  '00000000-0000-4000-8000-00000000c010', '00000000-0000-4000-8000-00000000c001',
  '00000000-0000-4000-8000-00000000c002', '00000000-0000-4000-8000-00000000c003',
  'gbi-job-primary', repeat('1', 64)
);
insert into production.job_attempts (id, job_id, attempt_number, idempotency_key)
values ('00000000-0000-4000-8000-00000000c011', '00000000-0000-4000-8000-00000000c010', 1, 'gbi-attempt-primary');
update production.job_attempts set status = 'succeeded', finished_at = clock_timestamp()
where id = '00000000-0000-4000-8000-00000000c011';

create temporary table gbi_primary_result as
select production.register_generator_result(pg_temp.gbi_bundle(
  '00000000-0000-4000-8000-00000000c010',
  '00000000-0000-4000-8000-00000000c011',
  'gbi-registration-primary'
)) as result;

-- AT-GBI-01 + 02: one canonical Version, two exact representations.
do $$
declare v_id uuid;
begin
  select (result->>'artifact_version_id')::uuid into v_id from gbi_primary_result;
  if (select result->>'registration_status' from gbi_primary_result) <> 'REGISTERED_NEW'
     or (select count(*) from production.artifact_versions where id = v_id) <> 1 then
    raise exception 'AT-GBI-01_FAILED';
  end if;
  if (select count(*) from production.artifact_version_representations where artifact_version_id = v_id) <> 2
     or (select count(distinct artifact_version_id) from production.artifact_version_representations where artifact_version_id = v_id) <> 1 then
    raise exception 'AT-GBI-02_FAILED';
  end if;
end $$;

-- AT-GBI-03 + 04: registration replay and representations are idempotent.
do $$
declare v_result jsonb; v_version_count bigint; v_rep_count bigint; v_conflict jsonb;
begin
  select count(*) into v_version_count from production.artifact_versions;
  select count(*) into v_rep_count from production.artifact_version_representations;
  v_result := production.register_generator_result(pg_temp.gbi_bundle(
    '00000000-0000-4000-8000-00000000c010', '00000000-0000-4000-8000-00000000c011', 'gbi-registration-primary'));
  if v_result->>'registration_status' <> 'REPLAYED_EXISTING'
     or (select count(*) from production.artifact_versions) <> v_version_count then
    raise exception 'AT-GBI-03_FAILED';
  end if;
  if (select count(*) from production.artifact_version_representations) <> v_rep_count then
    raise exception 'AT-GBI-04_FAILED';
  end if;
  v_conflict := pg_temp.gbi_bundle(
    '00000000-0000-4000-8000-00000000c010', '00000000-0000-4000-8000-00000000c011', 'gbi-registration-primary');
  v_conflict := jsonb_set(v_conflict, '{result_manifest,warnings}', '["materially-different-replay"]'::jsonb);
  perform pg_temp.expect_gbi_error(v_conflict, 'GENERATOR_REGISTRATION_CORRELATION_CONFLICT');
end $$;

-- Secondary successful Job used for wrong-provenance evidence.
insert into production.jobs (id, person_id, product_id, product_version_id, idempotency_key, input_fingerprint)
values ('00000000-0000-4000-8000-00000000c020', '00000000-0000-4000-8000-00000000c001',
  '00000000-0000-4000-8000-00000000c002', '00000000-0000-4000-8000-00000000c003', 'gbi-job-secondary', repeat('2',64));
insert into production.job_attempts (id, job_id, attempt_number, idempotency_key)
values ('00000000-0000-4000-8000-00000000c021', '00000000-0000-4000-8000-00000000c020', 1, 'gbi-attempt-secondary');
update production.job_attempts set status='succeeded', finished_at=clock_timestamp()
where id='00000000-0000-4000-8000-00000000c021';

-- AT-GBI-05 fingerprint mismatch; AT-GBI-06 wrong Job/Attempt binding.
do $$
declare v_bundle jsonb;
begin
  v_bundle := pg_temp.gbi_bundle('00000000-0000-4000-8000-00000000c010', '00000000-0000-4000-8000-00000000c011', 'gbi-bad-fingerprint');
  v_bundle := jsonb_set(v_bundle, '{job_envelope,input_fingerprint}', to_jsonb(repeat('9',64)));
  v_bundle := jsonb_set(v_bundle, '{result_manifest,input_fingerprint}', to_jsonb(repeat('9',64)));
  perform pg_temp.expect_gbi_error(v_bundle, 'GENERATOR_REGISTRATION_JOB_BINDING_MISMATCH');

  v_bundle := pg_temp.gbi_bundle('00000000-0000-4000-8000-00000000c010', '00000000-0000-4000-8000-00000000c011', 'gbi-bad-attempt');
  v_bundle := jsonb_set(v_bundle, '{job_envelope,job_attempt_id}', to_jsonb('00000000-0000-4000-8000-00000000c021'::text));
  v_bundle := jsonb_set(v_bundle, '{job_envelope,attempt_idempotency_key}', to_jsonb('gbi-attempt-secondary'::text));
  v_bundle := jsonb_set(v_bundle, '{result_manifest,job_attempt_id}', to_jsonb('00000000-0000-4000-8000-00000000c021'::text));
  perform pg_temp.expect_gbi_error(v_bundle, 'GENERATOR_REGISTRATION_ATTEMPT_BINDING_MISMATCH');
end $$;

-- AT-GBI-07 failed technical Attempt cannot register a successful Version.
insert into production.jobs (id, person_id, product_id, product_version_id, idempotency_key, input_fingerprint)
values ('00000000-0000-4000-8000-00000000c030', '00000000-0000-4000-8000-00000000c001',
  '00000000-0000-4000-8000-00000000c002', '00000000-0000-4000-8000-00000000c003', 'gbi-job-failed-attempt', repeat('3',64));
insert into production.job_attempts (id, job_id, attempt_number, idempotency_key)
values ('00000000-0000-4000-8000-00000000c031', '00000000-0000-4000-8000-00000000c030', 1, 'gbi-attempt-failed');
update production.job_attempts set status='failed', finished_at=clock_timestamp(), failure_reason='synthetic expected failure'
where id='00000000-0000-4000-8000-00000000c031';
select pg_temp.expect_gbi_error(pg_temp.gbi_bundle(
  '00000000-0000-4000-8000-00000000c030', '00000000-0000-4000-8000-00000000c031', 'gbi-failed-origin'
), 'GENERATOR_REGISTRATION_JOB_NOT_SUCCEEDED');

-- AT-GBI-08 invalid digest, bytes, and reference fail closed.
do $$
declare v_bundle jsonb;
begin
  v_bundle := jsonb_set(pg_temp.gbi_bundle('00000000-0000-4000-8000-00000000c020','00000000-0000-4000-8000-00000000c021','gbi-bad-digest'),
    '{result_manifest,output_files,0,checksum_sha256}', '"bad"'::jsonb);
  perform pg_temp.expect_gbi_error(v_bundle, 'GENERATOR_REPRESENTATION_EVIDENCE_INVALID');
  v_bundle := jsonb_set(pg_temp.gbi_bundle('00000000-0000-4000-8000-00000000c020','00000000-0000-4000-8000-00000000c021','gbi-bad-bytes'),
    '{result_manifest,output_files,0,byte_size}', '0'::jsonb);
  perform pg_temp.expect_gbi_error(v_bundle, 'GENERATOR_REPRESENTATION_EVIDENCE_INVALID');
  v_bundle := jsonb_set(pg_temp.gbi_bundle('00000000-0000-4000-8000-00000000c020','00000000-0000-4000-8000-00000000c021','gbi-bad-reference'),
    '{result_manifest,output_files,0,location_reference}', '"repo://../escape"'::jsonb);
  perform pg_temp.expect_gbi_error(v_bundle, 'GENERATOR_REPRESENTATION_EVIDENCE_INVALID');
end $$;

-- AT-GBI-09: all accepted P11 states append as immutable exact-version rows.
select production.register_generator_result(pg_temp.gbi_bundle(
  '00000000-0000-4000-8000-00000000c010','00000000-0000-4000-8000-00000000c011','gbi-registration-primary','REGISTER','PENDING','gbi-review-pending'));
select production.register_generator_result(pg_temp.gbi_bundle(
  '00000000-0000-4000-8000-00000000c010','00000000-0000-4000-8000-00000000c011','gbi-registration-primary','REGISTER','APPROVED','gbi-review-approved'));
select production.register_generator_result(pg_temp.gbi_bundle(
  '00000000-0000-4000-8000-00000000c010','00000000-0000-4000-8000-00000000c011','gbi-registration-primary','REGISTER','NEEDS_CHANGES','gbi-review-needs-changes'));
select production.register_generator_result(pg_temp.gbi_bundle(
  '00000000-0000-4000-8000-00000000c010','00000000-0000-4000-8000-00000000c011','gbi-registration-primary','REGISTER','REJECTED','gbi-review-rejected'));
do $$ begin
  if (select count(distinct review_state) from production.artifact_reviews where review_source='P11_PRODUCT_ACCEPTANCE') <> 4
     or exists (select 1 from production.artifact_reviews where review_source='P11_PRODUCT_ACCEPTANCE' and not review_contract_guarded) then
    raise exception 'AT-GBI-09_FAILED';
  end if;
end $$;

-- AT-GBI-11 exact review replay; AT-GBI-12 conflicting correlation.
do $$
declare v_before bigint; v_result jsonb; v_bundle jsonb;
begin
  select count(*) into v_before from production.artifact_reviews;
  v_result := production.register_generator_result(pg_temp.gbi_bundle(
    '00000000-0000-4000-8000-00000000c010','00000000-0000-4000-8000-00000000c011',
    'gbi-registration-primary','REGISTER','APPROVED','gbi-review-approved'));
  if v_result->>'review_status' <> 'REPLAYED_EXISTING' or (select count(*) from production.artifact_reviews) <> v_before then
    raise exception 'AT-GBI-11_FAILED';
  end if;
  v_bundle := pg_temp.gbi_bundle(
    '00000000-0000-4000-8000-00000000c010','00000000-0000-4000-8000-00000000c011',
    'gbi-registration-primary','REGISTER','REJECTED','gbi-review-approved');
  perform pg_temp.expect_gbi_error(v_bundle, 'P11_REVIEW_CORRELATION_CONFLICT');
end $$;

-- AT-GBI-10 + AT-GBI-13: a Revision is a new Version; approval does not inherit.
insert into production.jobs (id, person_id, product_id, product_version_id, idempotency_key, input_fingerprint)
values ('00000000-0000-4000-8000-00000000c040', '00000000-0000-4000-8000-00000000c001',
  '00000000-0000-4000-8000-00000000c002', '00000000-0000-4000-8000-00000000c004', 'gbi-job-revision', repeat('4',64));
insert into production.job_attempts (id, job_id, attempt_number, idempotency_key)
values ('00000000-0000-4000-8000-00000000c041', '00000000-0000-4000-8000-00000000c040', 1, 'gbi-attempt-revision');
update production.job_attempts set status='succeeded', finished_at=clock_timestamp()
where id='00000000-0000-4000-8000-00000000c041';
create temporary table gbi_revision_result as
select production.register_generator_result(pg_temp.gbi_bundle(
  '00000000-0000-4000-8000-00000000c040','00000000-0000-4000-8000-00000000c041','gbi-registration-revision'
)) as result;
do $$
declare v_primary uuid; v_revision uuid;
begin
  select (result->>'artifact_version_id')::uuid into v_primary from gbi_primary_result;
  select (result->>'artifact_version_id')::uuid into v_revision from gbi_revision_result;
  if v_primary = v_revision
     or (select artifact_id from production.artifact_versions where id=v_primary)
        <> (select artifact_id from production.artifact_versions where id=v_revision)
     or (select version_number from production.artifact_versions where id=v_revision) <> 2
     or exists (select 1 from production.artifact_reviews where artifact_version_id=v_revision) then
    raise exception 'AT-GBI-10_OR_13_FAILED';
  end if;
end $$;

-- AT-GBI-14: Retry keeps one Job/material, distinct Attempt history, one success.
insert into production.jobs (id, person_id, product_id, product_version_id, idempotency_key, input_fingerprint)
values ('00000000-0000-4000-8000-00000000c050', '00000000-0000-4000-8000-00000000c001',
  '00000000-0000-4000-8000-00000000c002', '00000000-0000-4000-8000-00000000c003', 'gbi-job-retry', repeat('5',64));
insert into production.job_attempts (id, job_id, attempt_number, idempotency_key)
values ('00000000-0000-4000-8000-00000000c051', '00000000-0000-4000-8000-00000000c050', 1, 'gbi-attempt-retry-1');
update production.job_attempts set status='failed', finished_at=clock_timestamp(), failure_reason='synthetic retry setup'
where id='00000000-0000-4000-8000-00000000c051';
insert into production.job_attempts (id, job_id, attempt_number, idempotency_key, admission_input_fingerprint)
values ('00000000-0000-4000-8000-00000000c052', '00000000-0000-4000-8000-00000000c050', 2, 'gbi-attempt-retry-2', repeat('5',64));
update production.job_attempts set status='succeeded', finished_at=clock_timestamp()
where id='00000000-0000-4000-8000-00000000c052';
select production.register_generator_result(pg_temp.gbi_bundle(
  '00000000-0000-4000-8000-00000000c050','00000000-0000-4000-8000-00000000c052','gbi-registration-retry'
));
do $$ begin
  if (select count(*) from production.job_attempts where job_id='00000000-0000-4000-8000-00000000c050') <> 2
     or (select count(*) from production.job_attempts where job_id='00000000-0000-4000-8000-00000000c050' and status='succeeded') <> 1
     or (select count(*) from production.artifact_versions where job_id='00000000-0000-4000-8000-00000000c050') <> 1 then
    raise exception 'AT-GBI-14_FAILED';
  end if;
end $$;

-- AT-GBI-15 W3 no-write; AT-GBI-16 W4 lost ACK exact replay.
do $$
declare v_before bigint; v_result jsonb;
begin
  select count(*) into v_before from production.artifact_versions;
  v_result := production.register_generator_result(pg_temp.gbi_bundle(
    '00000000-0000-4000-8000-00000000c020','00000000-0000-4000-8000-00000000c021','gbi-w3-missing','RECONCILE'));
  if v_result->>'registration_status' <> 'RECONCILE_REQUIRED'
     or (select count(*) from production.artifact_versions) <> v_before then
    raise exception 'AT-GBI-15_FAILED';
  end if;
  v_result := production.register_generator_result(pg_temp.gbi_bundle(
    '00000000-0000-4000-8000-00000000c010','00000000-0000-4000-8000-00000000c011','gbi-registration-primary','RECONCILE'));
  if v_result->>'registration_status' <> 'REPLAYED_EXISTING'
     or (select count(*) from production.artifact_versions) <> v_before then
    raise exception 'AT-GBI-16_FAILED';
  end if;
end $$;

-- AT-GBI-17: browser roles gain neither evidence access nor adapter execute.
do $$ begin
  if has_table_privilege('anon', 'production.artifact_version_representations', 'SELECT')
     or has_table_privilege('anon', 'production.artifact_version_representations', 'INSERT')
     or has_table_privilege('authenticated', 'production.artifact_version_representations', 'SELECT')
     or has_table_privilege('authenticated', 'production.artifact_version_representations', 'INSERT')
     or has_function_privilege('anon', 'production.register_generator_result(jsonb)', 'EXECUTE')
     or has_function_privilege('authenticated', 'production.register_generator_result(jsonb)', 'EXECUTE') then
    raise exception 'AT-GBI-17_FAILED';
  end if;
end $$;

-- AT-GBI-18 + 19: no downstream authority or schema side effect.
do $$ begin
  if (select count(*) from entitlement.entitlements) <> (select entitlement_count from gbi_test_baseline) then
    raise exception 'AT-GBI-18_FAILED';
  end if;
  if exists (
    select 1 from information_schema.tables
    where table_schema='production'
      and table_name in ('publications','customer_access','deliveries','customer_confirmations')
  ) then
    raise exception 'AT-GBI-19_FAILED';
  end if;
end $$;

select 'AT-GBI-01..19: PASS' as generator_backend_registration_bridge_runtime;

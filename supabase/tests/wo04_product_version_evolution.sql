\set ON_ERROR_STOP on

-- Run after canonical 20260814112920. This proves that the retained legacy
-- Artifact field does not block a new Artifact Version from a later Product
-- Version and a replaceable provider-neutral execution attempt. This
-- component is transaction-neutral; its caller owns commit or rollback.

set role service_role;

insert into production.jobs (
  id, person_id, product_id, product_version_id, idempotency_key,
  input_fingerprint
)
values (
  '00000000-0000-4000-8000-000000000412',
  '00000000-0000-4000-8000-000000000401',
  '00000000-0000-4000-8000-000000000402',
  '00000000-0000-4000-8000-000000000404',
  'wo04-synthetic-job-v2',
  repeat('4', 64)
);

insert into production.job_attempts (
  id, job_id, attempt_number, provider_execution_reference, idempotency_key
)
values (
  '00000000-0000-4000-8000-000000000413',
  '00000000-0000-4000-8000-000000000412',
  1,
  'synthetic-replaceable-engine-v2',
  'wo04-synthetic-attempt-v2'
);

update production.job_attempts
set status = 'succeeded', finished_at = clock_timestamp()
where id = '00000000-0000-4000-8000-000000000413';

insert into production.artifact_versions (
  id, artifact_id, version_number, job_id, job_attempt_id,
  output_kind, build_identity, content_digest
)
values (
  '00000000-0000-4000-8000-000000000414',
  '00000000-0000-4000-8000-000000000409',
  2,
  '00000000-0000-4000-8000-000000000412',
  '00000000-0000-4000-8000-000000000413',
  'report',
  'synthetic-build-v2',
  'synthetic-digest-v2'
);

insert into production.artifact_reviews (
  id, artifact_version_id, review_state, review_source,
  review_correlation_reference
)
values (
  '00000000-0000-4000-8000-000000000415',
  '00000000-0000-4000-8000-000000000414',
  'needs_changes',
  'synthetic-founder-review',
  'wo04-synthetic-review-v2'
);

reset role;

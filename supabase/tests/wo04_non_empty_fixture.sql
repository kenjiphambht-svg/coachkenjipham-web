\set ON_ERROR_STOP on

-- Synthetic-only fixture for FD-2026-027. Run after the complete repository
-- chain has been applied through 20260814093326, before canonical 112920.
-- Fixed UUIDs make every assertion deterministic. No real person or child
-- data is represented. This component is transaction-neutral: a caller must
-- own BEGIN/COMMIT (disposable local recovery) or BEGIN/ROLLBACK (staging).

set role service_role;

insert into identity.persons (id, display_label)
values ('00000000-0000-4000-8000-000000000401', 'WO04 synthetic recovery fixture');

insert into commerce.products (id, product_key, display_name)
values ('00000000-0000-4000-8000-000000000402', 'wo04_recovery_fixture', 'WO04 Synthetic Recovery Product');

insert into commerce.product_versions (id, product_id, version_label)
values
  ('00000000-0000-4000-8000-000000000403', '00000000-0000-4000-8000-000000000402', 'synthetic-v1'),
  ('00000000-0000-4000-8000-000000000404', '00000000-0000-4000-8000-000000000402', 'synthetic-v2');

insert into commerce.product_journey_anchors (
  id, person_id, product_id, product_version_id
)
values (
  '00000000-0000-4000-8000-000000000405',
  '00000000-0000-4000-8000-000000000401',
  '00000000-0000-4000-8000-000000000402',
  '00000000-0000-4000-8000-000000000403'
);

insert into commerce.orders (
  id, buyer_person_id, product_id, product_version_id, idempotency_key
)
values (
  '00000000-0000-4000-8000-000000000406',
  '00000000-0000-4000-8000-000000000401',
  '00000000-0000-4000-8000-000000000402',
  '00000000-0000-4000-8000-000000000403',
  'wo04-synthetic-order-v1'
);

insert into commerce.order_snapshots (order_id, snapshot)
values (
  '00000000-0000-4000-8000-000000000406',
  '{"fixture":"WO04 synthetic recovery","version":"v1"}'::jsonb
);

insert into production.jobs (
  id, person_id, product_id, product_version_id, journey_anchor_id,
  order_id, idempotency_key
)
values (
  '00000000-0000-4000-8000-000000000407',
  '00000000-0000-4000-8000-000000000401',
  '00000000-0000-4000-8000-000000000402',
  '00000000-0000-4000-8000-000000000403',
  '00000000-0000-4000-8000-000000000405',
  '00000000-0000-4000-8000-000000000406',
  'wo04-synthetic-job-v1'
);

insert into production.job_attempts (
  id, job_id, attempt_number, provider_execution_reference, idempotency_key
)
values (
  '00000000-0000-4000-8000-000000000408',
  '00000000-0000-4000-8000-000000000407',
  1,
  'synthetic-provider-neutral-run-v1',
  'wo04-synthetic-attempt-v1'
);

update production.job_attempts
set status = 'succeeded', finished_at = clock_timestamp()
where id = '00000000-0000-4000-8000-000000000408';

insert into production.artifacts (
  id, person_id, product_id, product_version_id
)
values (
  '00000000-0000-4000-8000-000000000409',
  '00000000-0000-4000-8000-000000000401',
  '00000000-0000-4000-8000-000000000402',
  '00000000-0000-4000-8000-000000000403'
);

insert into production.artifact_versions (
  id, artifact_id, version_number, job_id, job_attempt_id,
  output_kind, build_identity, content_digest
)
values (
  '00000000-0000-4000-8000-000000000410',
  '00000000-0000-4000-8000-000000000409',
  1,
  '00000000-0000-4000-8000-000000000407',
  '00000000-0000-4000-8000-000000000408',
  'report',
  'synthetic-build-v1',
  'synthetic-digest-v1'
);

insert into production.artifact_reviews (
  id, artifact_version_id, review_state, review_source,
  review_correlation_reference
)
values (
  '00000000-0000-4000-8000-000000000411',
  '00000000-0000-4000-8000-000000000410',
  'approved',
  'synthetic-founder-review',
  'wo04-synthetic-review-v1'
);

reset role;

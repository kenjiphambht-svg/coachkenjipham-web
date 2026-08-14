\set ON_ERROR_STOP on

-- Disposable-local recovery fixture only. Run after
-- wo04_non_empty_fixture.sql and before canonical 20260814112920. These rows
-- exercise two states that were legal under the foundation migration:
-- a missing correlation reference and duplicate non-null correlation.
-- Canonical correction must preserve both rows exactly while guarding every
-- new event. This component is transaction-neutral.

set role service_role;

insert into production.artifact_reviews (
  id, artifact_version_id, review_state, review_source,
  review_correlation_reference
)
values
  (
    '00000000-0000-4000-8000-000000000421',
    '00000000-0000-4000-8000-000000000410',
    'pending',
    'synthetic-legacy-review',
    null
  ),
  (
    '00000000-0000-4000-8000-000000000422',
    '00000000-0000-4000-8000-000000000410',
    'approved',
    'synthetic-founder-review',
    'wo04-synthetic-review-v1'
  );

reset role;

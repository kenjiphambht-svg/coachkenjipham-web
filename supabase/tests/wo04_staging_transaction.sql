\set ON_ERROR_STOP on

-- Canonical latest-schema rollback-only proof runner. All included components
-- are transaction-neutral. This file alone owns one transaction and always
-- rolls back, so it cannot persist candidate schema or synthetic rows.
--
-- wo04_non_empty_fixture models history that predates the B5 fingerprint
-- contract. Disable only the candidate INSERT guard while loading that legacy
-- row; every ordinary post-migration Job remains guarded and supplies a
-- deterministic synthetic full SHA-256 fingerprint.

begin;
\ir ../migrations/20260815134000_launch_core_job_material_fingerprint_retry_admission.sql
alter table production.jobs disable trigger production_jobs_require_input_fingerprint;
\ir wo04_non_empty_fixture.sql
alter table production.jobs enable trigger production_jobs_require_input_fingerprint;
\ir wo04_product_version_evolution.sql
\ir wo04_final_state_assertions.sql
\ir wo04_runtime_regression.sql
\ir b5_job_fingerprint_retry_admission.sql
rollback;

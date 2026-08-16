\set ON_ERROR_STOP on
-- AT-GBI-20: current Launch Core Blocks 1-4 plus B5 fingerprint/retry
-- behavioral regressions on a fully migrated disposable database.
begin;
alter table production.jobs disable trigger production_jobs_require_input_fingerprint;
\ir wo04_non_empty_fixture.sql
alter table production.jobs enable trigger production_jobs_require_input_fingerprint;
\ir wo04_product_version_evolution.sql
\ir wo04_final_state_assertions.sql
\ir wo04_runtime_regression.sql
\ir b5_job_fingerprint_retry_admission.sql
rollback;
select 'AT-GBI-20: PASS' as generator_backend_registration_bridge_regressions;

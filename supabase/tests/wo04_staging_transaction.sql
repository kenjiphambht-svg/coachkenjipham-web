\set ON_ERROR_STOP on

-- Canonical staging-safe proof runner. All included components are
-- transaction-neutral. This file alone owns one transaction and always rolls
-- back, so it cannot persist synthetic Identity/Commerce/Production rows.

begin;
\ir wo04_non_empty_fixture.sql
\ir wo04_product_version_evolution.sql
\ir wo04_final_state_assertions.sql
\ir wo04_runtime_regression.sql
rollback;

\set ON_ERROR_STOP on

-- Rollback-only wrapper for running the runtime regression against an
-- already-seeded disposable database. The component itself is transaction-
-- neutral so this file owns the complete safety boundary.

begin;
\ir wo04_runtime_regression.sql
rollback;

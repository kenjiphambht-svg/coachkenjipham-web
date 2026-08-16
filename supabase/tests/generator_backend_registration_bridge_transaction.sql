\set ON_ERROR_STOP on
-- Run on a disposable database where all migrations, including the bridge,
-- are already applied. Synthetic rows are always rolled back.
begin;
\ir generator_backend_registration_bridge.sql
rollback;

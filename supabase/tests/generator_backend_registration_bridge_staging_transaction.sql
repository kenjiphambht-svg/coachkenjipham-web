\set ON_ERROR_STOP on
-- Rollback-only candidate proof for an exact, independently-verified staging
-- target. Candidate schema and all synthetic rows disappear together.
begin;
\ir ../migrations/20260816143000_p07_generator_backend_registration_bridge.sql
\ir generator_backend_registration_bridge.sql
rollback;

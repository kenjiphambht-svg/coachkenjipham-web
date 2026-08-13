-- Manual rollback for 20260812044335 · WO-LAUNCH-CORE-01 Identity + Relationship Foundation.
-- Safe only while no later migration depends on the identity schema.
-- Drops the entire schema and every table/function/trigger created by the
-- forward migration. Does not touch any other schema (public, knowledge, auth).

revoke all on schema identity from service_role;
drop schema if exists identity cascade;

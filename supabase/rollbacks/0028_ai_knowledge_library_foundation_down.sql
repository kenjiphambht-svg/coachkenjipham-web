-- Manual rollback for 0028 · ESSENCE AI Knowledge Backend M1.
-- Safe only while no later knowledge-schema migration depends on these tables.

revoke all on schema knowledge from service_role;
drop schema if exists knowledge cascade;

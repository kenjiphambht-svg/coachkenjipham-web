-- Manual rollback for 20260815000000 · WO-LAUNCH-CORE-04 Production Job +
-- Artifact + QA Foundation.
-- Safe only while no later migration depends on the production schema.
-- Drops the entire production schema and everything in it. Does not
-- touch identity, commerce, entitlement, or knowledge — this WO never
-- modified any of them (no read model was extended).

revoke all on schema production from service_role;
drop schema if exists production cascade;

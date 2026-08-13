-- Manual rollback for 20260813120549 · WO-LAUNCH-CORE-02 Product + Journey + Order Foundation.
-- Safe only while no later migration depends on the commerce schema.
-- Drops the entire schema and every table/view/function/trigger created by
-- the forward migration. Does not touch identity, knowledge, public, or auth.

revoke all on schema commerce from service_role;
drop schema if exists commerce cascade;

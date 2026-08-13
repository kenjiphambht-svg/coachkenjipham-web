-- Manual rollback for 20260814200000 · WO-LAUNCH-CORE-03 lifecycle
-- closure. Drops the creation-time guard trigger/function added by this
-- migration only. Does not touch identity, commerce, or knowledge, and
-- does not drop the entitlement schema.

drop trigger if exists payment_evidence_block_non_recorded_insert on entitlement.payment_evidence;
drop function if exists entitlement.reject_payment_evidence_initial_status();

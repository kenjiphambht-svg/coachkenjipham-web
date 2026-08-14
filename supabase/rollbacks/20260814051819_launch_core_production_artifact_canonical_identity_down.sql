-- Manual rollback for 20260816010000 · WO-LAUNCH-CORE-04 fresh-evaluator
-- finding: Artifact canonical identity.
-- Drops only the new unique index. Does not touch identity, commerce,
-- entitlement, or knowledge, and does not drop the production schema.

drop index if exists production.artifacts_unique_canonical_scope_idx;

-- Manual rollback for 20260815020000 · WO-LAUNCH-CORE-04 self-review
-- hardening: single-success guard per Job.
-- Drops only the new partial unique index. Does not touch identity,
-- commerce, entitlement, or knowledge, and does not drop the production
-- schema.

drop index if exists production.job_attempts_one_succeeded_per_job_idx;

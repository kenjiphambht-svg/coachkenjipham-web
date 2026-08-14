-- Manual rollback for 20260815010000 · WO-LAUNCH-CORE-04 self-review
-- hardening: Job Attempt concurrency guard.
-- Drops only the new partial unique index. Does not touch identity,
-- commerce, entitlement, or knowledge, and does not drop the production
-- schema.

drop index if exists production.job_attempts_one_running_per_job_idx;

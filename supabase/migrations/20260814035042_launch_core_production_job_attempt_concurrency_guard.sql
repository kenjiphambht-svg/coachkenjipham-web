-- 20260814035042 · WO-LAUNCH-CORE-04 self-review hardening: Job Attempt
-- concurrency guard.
-- Corrective, additive-only migration over
-- 20260814034500_launch_core_production_job_artifact_qa_foundation. Does
-- not reset or drop the production schema; does not edit the previously
-- applied migration file.
--
-- GAP found during adversarial self-review (not from an external
-- reviewer): validate_job_attempt_creation() only prevented a new Attempt
-- from starting on an already-terminal Job. It never prevented TWO
-- Attempts of the SAME Job from being 'running' concurrently. If both
-- were later independently marked 'succeeded', the Job would have two
-- canonical successful outputs from one logical Job — exactly the
-- outcome Block 4's mission explicitly requires preventing. A
-- SELECT-then-INSERT check inside a trigger would have a
-- time-of-check-to-time-of-use race under concurrent transactions; the
-- correct, atomic fix is a partial unique index, the same proven pattern
-- already used in WO-02 for "only one open Journey per Person/Product"
-- (product_journey_anchors_one_open_per_person_product_idx).

create unique index job_attempts_one_running_per_job_idx
  on production.job_attempts(job_id)
  where status = 'running';

comment on index production.job_attempts_one_running_per_job_idx is
  'At most one Attempt may be running for a given Job at a time — enforced atomically at the database level, not via a trigger SELECT check (which would have a time-of-check-to-time-of-use race under concurrent transactions). Prevents two Attempts of the same Job from both being able to succeed concurrently.';

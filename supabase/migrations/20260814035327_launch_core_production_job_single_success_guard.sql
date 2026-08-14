-- 20260814035327 · WO-LAUNCH-CORE-04 self-review hardening: single-success
-- guard per Job.
-- Corrective, additive-only migration over
-- 20260814035042_launch_core_production_job_attempt_concurrency_guard.
-- Does not reset or drop the production schema; does not edit any
-- previously applied migration file.
--
-- GAP found during a second adversarial self-review pass: the
-- one-running-Attempt-at-a-time guard (previous migration) prevents two
-- Attempts of the same Job from being running CONCURRENTLY, but does not
-- prevent a SECOND Attempt from being created SEQUENTIALLY after a first
-- Attempt has already succeeded (the terminal-Job check only fires once
-- the Job's OWN status column has been explicitly set to a terminal
-- value — which may lag behind an Attempt already reading as succeeded).
-- That still allows two attempts of the same logical Job to each
-- independently succeed and each register their own Artifact Version —
-- exactly the "two canonical successful outputs from one logical Job"
-- outcome Block 4's mission requires preventing. A retry exists to
-- recover from FAILURE; once a Job's Attempt has genuinely succeeded,
-- producing another version is conceptually a NEW logical work request
-- (a new Job), not a further Attempt of the same one. Same proven,
-- atomic pattern as the previous migration — a partial unique index,
-- not a trigger SELECT check.

create unique index job_attempts_one_succeeded_per_job_idx
  on production.job_attempts(job_id)
  where status = 'succeeded';

comment on index production.job_attempts_one_succeeded_per_job_idx is
  'At most one Attempt may ever reach succeeded for a given Job — enforced atomically at the database level. Once a Job''s Attempt has genuinely succeeded, further production work is a new logical Job, not another Attempt of this one. Prevents two Attempts of the same Job from each independently succeeding.';

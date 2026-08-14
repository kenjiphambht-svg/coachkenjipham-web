-- 20260814112920 · WO-LAUNCH-CORE-04 P07 BUILDER PROTOCOL v2.1: Global
-- State + Operation Closure. Closes P07's three named findings (A, B, C)
-- from independent review of PR #158 at head 58f0bc2. Additive-only over
-- 20260814093326_launch_core_production_fifth_evaluation_hardening. Does
-- not edit any previously applied migration file; does not modify the
-- already-accepted commerce/identity/entitlement/knowledge schemas.
--
-- Full Phase A-E discipline (effective-state reconstruction directly
-- against live staging pg_catalog, Canonical Invariant Graph, State
-- Reachability Map, Complete Write-Operation Inventory, counterexamples)
-- was performed before any code was written; summarized in the PR/report,
-- not repeated at length here. Findings and fixes below.
--
-- ================================================================
-- FINDING A — JOB TERMINAL / ATTEMPT RUNNING CONTRADICTION
-- ================================================================
--
-- ROOT CAUSE: reject_job_rewrite() already requires a genuinely
-- succeeded Attempt before allowing Job -> succeeded
-- (JOB_SUCCEEDED_REQUIRES_SUCCESSFUL_ATTEMPT), but the SAME function
-- placed NO equivalent constraint on the failed/cancelled direction — a
-- Job could legally transition running -> failed or running/pending ->
-- cancelled while a job_attempts row for it was still 'running', with
-- nothing in the schema ever reconciling the two. Reproduced by P07:
-- Job=running + Attempt=running, then Job set to failed directly ->
-- accepted, leaving Job=failed / Attempt=running permanently (Attempt
-- terminal states, once reached, are themselves sealed by
-- reject_job_attempt_rewrite, but 'running' was never forced to
-- resolve).
--
-- FIX: reject_job_rewrite() now blocks a Job's transition to
-- failed/cancelled while it still has a 'running' Attempt
-- (JOB_CANNOT_TERMINATE_WHILE_ATTEMPT_RUNNING). This is symmetric to the
-- pre-existing succeeded-requires-attempt rule: every terminal Job claim
-- must be technically consistent with real Attempt state, never merely
-- declared. The caller must resolve (fail) the running Attempt itself
-- first — already a fully legal Attempt transition — before the Job can
-- be terminated.
--
-- DESIGN CHOICE, explained: an alternative would have been an
-- AFTER-UPDATE "downward cascade" on jobs that auto-force-fails any
-- still-running Attempt when the Job goes terminal (mirroring the
-- existing upward cascades from job_attempts -> jobs). That was
-- considered and rejected: it would acquire the jobs row lock first (via
-- the UPDATE statement itself) and the job_attempts row lock second (via
-- the cascade's own UPDATE) — the exact opposite acquisition order from
-- the pre-existing upward cascades (job_attempts row lock first, jobs
-- row lock second via validate_job_attempt_creation's FOR UPDATE / the
-- existing succeeded-cascade), which is a textbook lock-order-inversion
-- deadlock risk, the same class of bug rounds 2-3 already had to fix
-- once. The REJECT design used here needs no new lock at all: it only
-- ever reads job_attempts inside a transaction that already holds (or is
-- about to contend for) the jobs row lock via the existing UPDATE
-- statement itself, so it rides the SAME pre-existing serialization
-- point the upward cascades already depend on, with no new cross-table
-- lock ever acquired. Traced by hand against both interleavings
-- (Job-transition-first and Attempt-creation/success-first) and both
-- resolve to a consistent final state with no residual contradiction.
--
-- ================================================================
-- FINDING B — ARTIFACT STATE WITH NO LEGAL FUTURE
-- ================================================================
--
-- ROOT CAUSE: production.artifacts.product_version_id was informational
-- only (excluded from canonical identity since round 2 — Journey is the
-- sole identity anchor when present), yet it was still (a) frozen
-- immutable forever at Artifact-creation time, and (b) still used as a
-- HARD, blocking agreement gate in validate_artifact_scope() (Journey
-- pin vs Artifact's own claim) and validate_artifact_version_scope()
-- (Job's Version vs Artifact's own claim). An Artifact created with an
-- explicit Version (or no Journey at all, so canonical identity
-- collapses to (person, product)) permanently froze that Version claim.
-- A later, entirely legitimate production Job for the SAME logical
-- Artifact scope but a DIFFERENT Product Version then had NO legal
-- representation: registering it as a new ArtifactVersion of the
-- existing Artifact was rejected (Version mismatch against the frozen
-- claim), and creating a second unscoped Artifact was rejected (canonical
-- identity already claimed). A state that was valid at insert time had
-- no legal continuation for a production evolution the architecture
-- otherwise claims to support (Product Version legitimately varying
-- across an Artifact's history — that is exactly what per-version
-- ArtifactVersion rows exist to represent).
--
-- FIX (structural, not a patch): production.artifacts.product_version_id
-- is removed entirely, per section 13's own instruction — "If Product
-- Version may legitimately vary between Artifact Versions, the stable
-- Artifact representation must not make that impossible." A single
-- frozen Version value on a row whose Version may legitimately vary
-- across its own history is a contradiction in terms; it does not belong
-- on the stable identity row at all. The true, per-occurrence Version of
-- an Artifact's output already lives correctly on each immutable
-- production.artifact_versions row (via its originating Job, whose own
-- Version coherence is fully and separately governed by
-- validate_job_scope() — unaffected by this change), and the "current"
-- Version is already correctly exposed via the pre-existing
-- production.artifact_current_version view (confirmed by reading its
-- live definition: derived entirely from artifact_versions, never
-- referenced artifacts.product_version_id).
--
-- Consequence: validate_artifact_scope()'s Journey-Version checks
-- (ARTIFACT_JOURNEY_VERSION_MISMATCH / ARTIFACT_JOURNEY_VERSION_NOT_
-- YET_PINNED, added in round 4) become vacuous — nothing is left on the
-- Artifact side to compare a Journey's pin against — and are removed;
-- Journey belongs-to checks (ARTIFACT_JOURNEY_NOT_FOUND / _SCOPE_
-- MISMATCH) are untouched, Journey remains fully protected as identity.
-- validate_artifact_version_scope()'s Job-vs-Artifact Version comparison
-- (ARTIFACT_VERSION_JOB_VERSION_MISMATCH) is removed for the same
-- reason; Person/Product/Journey coherence and the successful-Attempt
-- requirement are untouched.
--
-- artifacts_unique_canonical_scope_idx is untouched (it never referenced
-- product_version_id — round 2 already excluded it from identity).
-- artifact_versions_unique_artifact_attempt (output-registration replay
-- safety) is untouched.
--
-- ================================================================
-- FINDING C — QA/REVIEW EVENT REPLAY
-- ================================================================
--
-- ROOT CAUSE: production.artifact_reviews is correctly insert-only
-- (immutable history), but had no notion of logical event identity at
-- all — two inserts with identical (artifact_version_id, review_state,
-- review_source, review_correlation_reference) were both accepted as
-- two independent canonical rows. Immutability protects each row from
-- being altered after the fact; it does not protect the table from
-- accumulating duplicate rows that all describe the SAME real-world
-- event delivered more than once (e.g. an at-least-once webhook retry).
--
-- DERIVATION: the logical identity of one review event is the tuple
-- (which Artifact Version is being reviewed, which reviewing
-- source/system reported it, which occurrence that source is reporting).
-- review_source scopes the reference to its own namespace — two
-- different reviewing systems may coincidentally reuse the same
-- correlation string without colliding. artifact_version_id is included
-- for defense in depth (a review is always about one specific immutable
-- output). review_state is deliberately NOT part of the identity key —
-- a genuinely new review by the same source of the same version (a
-- legitimate pending -> approved sequence, or a second independent
-- look) is a DIFFERENT occurrence and must carry its own, different
-- correlation reference; the database enforces only that the SAME
-- reference cannot silently produce two rows, not what review workflow
-- states are allowed (that remains P11 territory, untouched here).
--
-- review_correlation_reference is made NOT NULL: a review event with no
-- caller-supplied occurrence identity has no technical basis on which
-- to ever detect a replay, so a controlled write path that must be
-- replay-safe is required to supply one. This is a technical
-- idempotency-token requirement, the same shape already used for
-- jobs.idempotency_key and job_attempts.idempotency_key elsewhere in
-- this schema — not an invented QA/business rule. (Table confirmed
-- empty on staging before this change — safe to tighten.)
--
-- FIX: review_correlation_reference set NOT NULL; new UNIQUE
-- (artifact_version_id, review_source, review_correlation_reference). A
-- replayed identical event now hits a plain unique-violation, exactly
-- the same replay-safety shape already established for Job/Attempt
-- idempotency keys and for output registration
-- (artifact_versions_unique_artifact_attempt) — no new mechanism
-- introduced, the existing pattern extended to the one write path that
-- was missing it.

-- ---------------- Finding A ----------------

create or replace function production.reject_job_rewrite()
returns trigger
language plpgsql
set search_path = pg_catalog, production
as $$
declare
  v_succeeded_attempts int;
  v_running_attempts int;
begin
  if NEW.person_id is distinct from OLD.person_id then
    raise exception 'JOB_PERSON_IMMUTABLE';
  end if;
  if NEW.product_id is distinct from OLD.product_id then
    raise exception 'JOB_PRODUCT_IMMUTABLE';
  end if;
  if NEW.product_version_id is distinct from OLD.product_version_id then
    raise exception 'JOB_PRODUCT_VERSION_IMMUTABLE';
  end if;
  if NEW.journey_anchor_id is distinct from OLD.journey_anchor_id then
    raise exception 'JOB_JOURNEY_ANCHOR_IMMUTABLE';
  end if;
  if NEW.order_id is distinct from OLD.order_id then
    raise exception 'JOB_ORDER_IMMUTABLE';
  end if;
  if NEW.idempotency_key is distinct from OLD.idempotency_key then
    raise exception 'JOB_IDEMPOTENCY_KEY_IMMUTABLE';
  end if;

  if OLD.status in ('succeeded', 'failed', 'cancelled') and NEW.status is distinct from OLD.status then
    raise exception 'JOB_TERMINAL_STATUS_IMMUTABLE';
  end if;

  if NEW.status is distinct from OLD.status then
    if not (
      (OLD.status = 'pending' and NEW.status in ('running', 'cancelled'))
      or (OLD.status = 'running' and NEW.status in ('succeeded', 'failed', 'cancelled'))
    ) then
      raise exception 'JOB_STATUS_TRANSITION_INVALID';
    end if;
  end if;

  -- Finding A: symmetric to the succeeded-requires-attempt rule below —
  -- a Job cannot be declared failed/cancelled while a running Attempt
  -- still technically contradicts that claim. See migration header for
  -- the full concurrency/locking argument for why this needs no new lock.
  if NEW.status in ('failed', 'cancelled') and OLD.status is distinct from NEW.status then
    select count(*) into v_running_attempts
    from production.job_attempts where job_id = NEW.id and status = 'running';
    if v_running_attempts > 0 then
      raise exception 'JOB_CANNOT_TERMINATE_WHILE_ATTEMPT_RUNNING';
    end if;
  end if;

  if NEW.status = 'succeeded' and OLD.status is distinct from 'succeeded' then
    select count(*) into v_succeeded_attempts
    from production.job_attempts where job_id = NEW.id and status = 'succeeded';
    if v_succeeded_attempts = 0 then
      raise exception 'JOB_SUCCEEDED_REQUIRES_SUCCESSFUL_ATTEMPT';
    end if;
  end if;

  return NEW;
end;
$$;

comment on function production.reject_job_rewrite() is
  'Locks grant-scope fields immutable; allows only legal forward status transitions; seals every terminal status permanently; requires an actual successful Attempt before a Job may read as succeeded, AND requires no Attempt still be running before a Job may read as failed/cancelled (Finding A) — every terminal Job claim must be technically consistent with real Attempt state, never merely declared.';

-- ---------------- Finding B ----------------

alter table production.artifacts drop constraint if exists artifacts_version_belongs_to_product;
alter table production.artifacts drop constraint if exists artifacts_product_version_id_fkey;
alter table production.artifacts drop column if exists product_version_id;

create or replace function production.validate_artifact_scope()
returns trigger
language plpgsql
set search_path = pg_catalog, production, commerce
as $$
declare
  v_journey_person uuid;
  v_journey_product uuid;
begin
  if NEW.journey_anchor_id is not null then
    select person_id, product_id
      into v_journey_person, v_journey_product
    from commerce.product_journey_anchors where id = NEW.journey_anchor_id;
    if v_journey_person is null then
      raise exception 'ARTIFACT_JOURNEY_NOT_FOUND';
    end if;
    if v_journey_person is distinct from NEW.person_id or v_journey_product is distinct from NEW.product_id then
      raise exception 'ARTIFACT_JOURNEY_SCOPE_MISMATCH';
    end if;
  end if;
  return NEW;
end;
$$;

comment on function production.validate_artifact_scope() is
  'Journey belongs-to check only (Finding B): Artifact no longer carries its own Version claim at all, so there is nothing left to compare against a Journey''s pin. Journey remains the Artifact''s sole identity anchor when present, fully protected.';

create or replace function production.validate_artifact_version_scope()
returns trigger
language plpgsql
set search_path = pg_catalog, production
as $$
declare
  v_artifact_person uuid;
  v_artifact_product uuid;
  v_artifact_journey uuid;
  v_job_person uuid;
  v_job_product uuid;
  v_job_journey uuid;
  v_attempt_status text;
begin
  select person_id, product_id, journey_anchor_id
    into v_artifact_person, v_artifact_product, v_artifact_journey
  from production.artifacts where id = NEW.artifact_id;
  if v_artifact_person is null then
    raise exception 'ARTIFACT_VERSION_ARTIFACT_NOT_FOUND';
  end if;

  select person_id, product_id, journey_anchor_id
    into v_job_person, v_job_product, v_job_journey
  from production.jobs where id = NEW.job_id;
  if v_job_person is null then
    raise exception 'ARTIFACT_VERSION_JOB_NOT_FOUND';
  end if;

  if v_job_person is distinct from v_artifact_person or v_job_product is distinct from v_artifact_product then
    raise exception 'ARTIFACT_VERSION_JOB_SCOPE_MISMATCH';
  end if;

  if v_artifact_journey is not null
     and v_job_journey is distinct from v_artifact_journey then
    raise exception 'ARTIFACT_VERSION_JOB_JOURNEY_MISMATCH';
  end if;

  -- Finding B: no Job-vs-Artifact Version comparison anymore — Version
  -- is no longer carried on the Artifact row at all, so it can never be
  -- stale relative to a legitimately-varying future ArtifactVersion. The
  -- true Version of THIS occurrence is whatever the cited Job asserts,
  -- already fully governed by validate_job_scope() independently.

  select status into v_attempt_status from production.job_attempts where id = NEW.job_attempt_id;
  if v_attempt_status is null then
    raise exception 'ARTIFACT_VERSION_ATTEMPT_NOT_FOUND';
  end if;
  if v_attempt_status is distinct from 'succeeded' then
    raise exception 'ARTIFACT_VERSION_REQUIRES_SUCCESSFUL_ATTEMPT';
  end if;

  return NEW;
end;
$$;

comment on function production.validate_artifact_version_scope() is
  'Person/Product/Journey coherence between Job and Artifact, plus a genuinely successful origin Attempt. No Version comparison (Finding B) — Version now lives only on each immutable ArtifactVersion via its Job, never frozen on the stable Artifact row, so it can legitimately vary across an Artifact''s own history without contradiction.';

-- ---------------- Finding C ----------------

alter table production.artifact_reviews
  alter column review_correlation_reference set not null;

alter table production.artifact_reviews
  drop constraint if exists artifact_reviews_review_correlation_reference_check;
alter table production.artifact_reviews
  add constraint artifact_reviews_review_correlation_reference_check
  check (char_length(review_correlation_reference) between 1 and 300);

alter table production.artifact_reviews
  add constraint artifact_reviews_unique_event
  unique (artifact_version_id, review_source, review_correlation_reference);

comment on table production.artifact_reviews is
  'Immutable production history: one QA/review evidence event for an Artifact Version. Insert-only. review_correlation_reference is a caller-supplied, mandatory occurrence identity (Finding C) — replaying the same (artifact_version_id, review_source, review_correlation_reference) triple hits a unique-violation rather than silently creating a second canonical event; a genuinely new review must carry its own distinct reference. Does not itself imply APPROVED/PUBLISHED/ACCESSIBLE — those remain separate, later invariants.';

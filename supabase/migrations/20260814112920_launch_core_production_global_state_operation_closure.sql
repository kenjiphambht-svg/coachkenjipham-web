-- 20260814112920 · WO-LAUNCH-CORE-04 P07 BUILDER PROTOCOL v2.1: Global
-- State + Operation Closure. Closes P07's three named findings (A, B, C)
-- from independent review of PR #158 at head 58f0bc2. Canonical history
-- corrected before Production under FD-2026-027: this file supersedes the
-- staging-only first execution that physically dropped Artifact evidence.
-- It remains scoped to production and does not modify the already-accepted
-- commerce/identity/entitlement/knowledge schemas.
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
-- FIX (recovery-safe structural separation): product_version_id remains
-- physically present as nullable, immutable creation-time evidence with
-- its original referential constraints, but is retired from Artifact
-- identity and runtime lineage decisions. Keeping the value is essential:
-- an applied migration must not destroy historical evidence merely because
-- a newer model no longer consumes it. The true Product Version of each
-- produced occurrence lives on its immutable ArtifactVersion via the
-- originating Job; current output remains derived from artifact_versions.
-- A new engine or Product Version can therefore append a new version to the
-- same Artifact without rewriting or interpreting the legacy field.
--
-- Consequence: validate_artifact_scope()'s Journey-Version checks
-- (ARTIFACT_JOURNEY_VERSION_MISMATCH / ARTIFACT_JOURNEY_VERSION_NOT_
-- YET_PINNED, added in round 4) are removed because the retained field is
-- evidence only, not a current lineage assertion;
-- Journey belongs-to checks (ARTIFACT_JOURNEY_NOT_FOUND / _SCOPE_
-- MISMATCH) are untouched, Journey remains fully protected as identity.
-- validate_artifact_version_scope()'s Job-vs-Artifact Version comparison
-- (ARTIFACT_VERSION_JOB_VERSION_MISMATCH) is removed for the same
-- reason. Person/Product/Journey coherence, the Product-Version foreign
-- keys on the retained evidence, and the successful-Attempt requirement
-- are untouched.
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
-- New review events require a caller-supplied occurrence identity. Legacy
-- rows, however, were legally allowed to have a NULL reference or duplicate
-- non-NULL references. Tightening the original column or adding an ordinary
-- UNIQUE constraint would either reject a valid non-empty upgrade or rewrite
-- immutable evidence. Neither is acceptable.
--
-- FIX (legacy-preserving): add a derived review_replay_guarded marker. Every
-- pre-existing row receives FALSE and remains byte-for-byte unchanged in its
-- original evidence columns. The default then changes to TRUE and a BEFORE
-- INSERT trigger forces TRUE, requires a correlation reference, and rejects
-- a key already present in either legacy or guarded history. A partial unique
-- index over guarded rows closes the concurrent-insert race. This preserves
-- every previously legal row while making all new events replay-safe. The
-- pattern is technical idempotency, not a QA/business workflow rule.

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

comment on column production.artifacts.product_version_id is
  'Deprecated, immutable creation-time Product Version evidence retained for recovery safety. It is not part of Artifact canonical identity, does not define the Product Version of later Artifact Versions, and must not be used as an access, QA, publication, or delivery signal.';

comment on table production.artifacts is
  'Stable logical produced thing for a Person/Product, optionally anchored to a Journey. product_version_id is retained only as immutable legacy creation-time evidence; it is not canonical identity or current output lineage. All produced history lives on artifact_versions. Existing does not imply QA approval, publication, entitlement, access, or delivery.';

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
  'Journey belongs-to check only (Finding B): the retained Artifact product_version_id is deprecated creation-time evidence, not current lineage, so it is not compared with a Journey''s current pin. Journey remains the Artifact''s sole identity anchor when present, fully protected.';

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

  -- Finding B: no Job-vs-Artifact legacy Version comparison. The retained
  -- Artifact field is creation-time evidence only and cannot block a
  -- legitimately-varying future ArtifactVersion. The true Version of THIS
  -- occurrence is whatever the cited Job asserts, already fully governed
  -- by validate_job_scope() independently.

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
  'Person/Product/Journey coherence between Job and Artifact, plus a genuinely successful origin Attempt. No comparison against the deprecated Artifact creation-time Product Version evidence (Finding B): each produced occurrence derives its Version from its immutable originating Job, so Product Version may legitimately evolve across one Artifact history.';

-- ---------------- Finding C ----------------

alter table production.artifact_reviews
  add column if not exists review_replay_guarded boolean not null default false;

alter table production.artifact_reviews
  alter column review_replay_guarded set default true;

comment on column production.artifact_reviews.review_replay_guarded is
  'Derived compatibility marker. FALSE identifies evidence that predates FD-2026-027 replay enforcement; TRUE is forced for every new review event. It is not QA state, approval, publication, access, or delivery truth.';

create or replace function production.validate_artifact_review_replay()
returns trigger
language plpgsql
set search_path = pg_catalog, production
as $$
begin
  if NEW.review_correlation_reference is null then
    raise exception 'REVIEW_CORRELATION_REFERENCE_REQUIRED';
  end if;

  NEW.review_replay_guarded := true;

  if exists (
    select 1
    from production.artifact_reviews existing
    where existing.artifact_version_id = NEW.artifact_version_id
      and existing.review_source = NEW.review_source
      and existing.review_correlation_reference = NEW.review_correlation_reference
  ) then
    raise exception 'REVIEW_EVENT_REPLAY';
  end if;

  return NEW;
end;
$$;

revoke all on function production.validate_artifact_review_replay() from public, anon, authenticated;

create trigger production_artifact_reviews_validate_replay
  before insert on production.artifact_reviews
  for each row execute function production.validate_artifact_review_replay();

create unique index production_artifact_reviews_unique_guarded_event_idx
  on production.artifact_reviews (
    artifact_version_id,
    review_source,
    review_correlation_reference
  )
  where review_replay_guarded;

comment on table production.artifact_reviews is
  'Immutable production history: one QA/review evidence row for an Artifact Version. Insert-only. Legacy rows remain exact even when their historical correlation was NULL or duplicated. Every new row must provide a caller-supplied occurrence identity and is replay-guarded on (artifact_version_id, review_source, review_correlation_reference); a genuinely new review must carry a distinct reference. Does not itself imply APPROVED/PUBLISHED/ACCESSIBLE — those remain separate, later invariants.';

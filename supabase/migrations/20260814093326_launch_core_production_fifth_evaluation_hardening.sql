-- 20260814093326 · WO-LAUNCH-CORE-04 fifth fresh-evaluator pass: Order
-- version omission, plus an interaction gap this fix's own design would
-- otherwise introduce against round 4's Journey pin-timing fix.
-- Corrective, additive-only migration over
-- 20260814060704_launch_core_production_fourth_evaluation_hardening.
-- Does not reset or drop the production schema; does not edit any
-- previously applied migration file; does not modify the already-
-- accepted commerce schema.
--
-- FINDING (confirmed by live execution, no concurrency required).
-- validate_job_scope()'s Order-side Version check only fires when
-- NEW.product_version_id IS NOT NULL:
--   if NEW.product_version_id is not null
--      and v_order_version is distinct from NEW.product_version_id then
--     raise exception 'JOB_ORDER_VERSION_MISMATCH';
--   end if;
-- Unlike a Journey's pin, commerce.orders.product_version_id is NOT NULL
-- and immutable from creation (verified against
-- 20260813120549_launch_core_product_journey_order_foundation) — there is
-- no legitimate "not yet known" state to defer to on the Order side. So a
-- Job that references an Order but leaves its own product_version_id
-- null isn't deferring to a pending value the way a Journey-only Job can
-- — it is simply omitting a check against a value that was always fully
-- known. Since production.artifacts has no order_id column at all, the
-- Order's true Version is only ever reachable downstream through
-- jobs.product_version_id — once that field is left null, the true
-- purchased Version becomes permanently invisible to every later check
-- (validate_artifact_version_scope's existing Job-vs-Artifact Version
-- comparison is symmetric-optional and only fires when both sides are
-- non-null). Reproduced live: Job created with order_id set, own
-- product_version_id left null (accepted under the old check) → later
-- Artifact/ArtifactVersion for that Job asserted a Version that directly
-- contradicted the Order's real, immutable Version, with nothing in the
-- schema ever comparing the two.
--
-- FIX, part 1: make the Order-side check unconditional. Since
-- v_order_version is never null once order_id is set, dropping the
-- "NEW.product_version_id is not null" guard means a null Job-side
-- Version is now correctly treated as "distinct from" the Order's known
-- Version and rejected — the Job must explicitly commit to the Order's
-- Version, the same way it must (per round 4) commit to nothing at all
-- while a referenced Journey is still unpinned.
--
-- SELF-INTRODUCED INTERACTION GAP, caught in self-review before this was
-- sent to a fresh evaluator: part 1 alone would newly conflict with round
-- 4's fix. If a Job references BOTH an Order (always-known Version) AND a
-- Journey that is still unpinned, round 4 requires the Job's own Version
-- to stay null (deferring to the Journey's future pin), while part 1
-- above requires it to be non-null (matching the Order's known Version)
-- — two requirements that cannot both hold. Worse, simply letting the
-- Order "win" (force the Job to the Order's Version even though the
-- Journey is unpinned) would silently recreate round 4's exact bug in a
-- new form: that forced, now-immutable Version could still be
-- permanently contradicted by whatever the Journey eventually pins,
-- since nothing in this schema re-validates against the Journey after
-- Job creation.
--
-- FIX, part 2: forbid the combination outright. A Job may not reference
-- an Order while also referencing a Journey whose pin is currently null
-- — there is no value (asserted, deferred, or Order-derived) that is
-- safe to freeze into an immutable Job at that moment. If both are
-- referenced, the Journey must already be pinned before the Job can be
-- created; the Order-vs-Journey-pin agreement is then covered by the
-- pre-existing, unmodified JOB_JOURNEY_ORDER_VERSION_MISMATCH triangle
-- check.
--
-- production.artifacts has no order_id column, so validate_artifact_scope()
-- needs no equivalent change — the Order's Version now always reaches it
-- indirectly and correctly through the (now never-null-when-relevant)
-- jobs.product_version_id, via the pre-existing, unmodified
-- validate_artifact_version_scope() Job-vs-Artifact Version check.
--
-- New error code: JOB_ORDER_REQUIRES_PINNED_JOURNEY.

create or replace function production.validate_job_scope()
returns trigger
language plpgsql
set search_path = pg_catalog, production, commerce
as $$
declare
  v_journey_person uuid;
  v_journey_product uuid;
  v_journey_version uuid;
  v_order_person uuid;
  v_order_product uuid;
  v_order_version uuid;
begin
  if NEW.journey_anchor_id is not null then
    select person_id, product_id, product_version_id
      into v_journey_person, v_journey_product, v_journey_version
    from commerce.product_journey_anchors where id = NEW.journey_anchor_id;
    if v_journey_person is null then
      raise exception 'JOB_JOURNEY_NOT_FOUND';
    end if;
    if v_journey_person is distinct from NEW.person_id or v_journey_product is distinct from NEW.product_id then
      raise exception 'JOB_JOURNEY_SCOPE_MISMATCH';
    end if;
  end if;

  if NEW.order_id is not null then
    select buyer_person_id, product_id, product_version_id
      into v_order_person, v_order_product, v_order_version
    from commerce.orders where id = NEW.order_id;
    if v_order_person is null then
      raise exception 'JOB_ORDER_NOT_FOUND';
    end if;
    if v_order_person is distinct from NEW.person_id or v_order_product is distinct from NEW.product_id then
      raise exception 'JOB_ORDER_SCOPE_MISMATCH';
    end if;
  end if;

  -- Fifth-evaluator self-review finding: an Order anchors a Job to a
  -- definite, immutable Version. An unpinned Journey has no definite
  -- Version yet. A Job cannot safely reference both while the Journey is
  -- still unpinned — neither "defer to null" (round 4) nor "assert the
  -- Order's Version" (below) is safe in that combination. Reject it
  -- outright rather than let either side silently win.
  if NEW.order_id is not null and NEW.journey_anchor_id is not null and v_journey_version is null then
    raise exception 'JOB_ORDER_REQUIRES_PINNED_JOURNEY';
  end if;

  if NEW.journey_anchor_id is not null then
    if v_journey_version is not null
       and NEW.product_version_id is not null
       and v_journey_version is distinct from NEW.product_version_id then
      raise exception 'JOB_JOURNEY_VERSION_MISMATCH';
    end if;
    if NEW.order_id is null
       and v_journey_version is null
       and NEW.product_version_id is not null then
      raise exception 'JOB_JOURNEY_VERSION_NOT_YET_PINNED';
    end if;
  end if;

  -- Fifth-evaluator finding: unconditional now (was gated behind
  -- "NEW.product_version_id is not null", which silently skipped the
  -- comparison whenever the Job left its own Version null — the Order's
  -- Version is never null, so there is no legitimate deferred state to
  -- protect here the way there is for an unpinned Journey).
  if NEW.order_id is not null and v_order_version is distinct from NEW.product_version_id then
    raise exception 'JOB_ORDER_VERSION_MISMATCH';
  end if;

  if NEW.journey_anchor_id is not null and NEW.order_id is not null
     and v_journey_version is not null and v_order_version is not null
     and v_journey_version is distinct from v_order_version then
    raise exception 'JOB_JOURNEY_ORDER_VERSION_MISMATCH';
  end if;

  return NEW;
end;
$$;

comment on function production.validate_job_scope() is
  'Cross-reference coherence at insert time. Journey/Order belongs-to checks as before. Order Version agreement is now unconditional (Order Version is NOT NULL and immutable, so there is no legitimate deferred state — closes a permanent-invisibility gap where a null Job Version silently hid the Order''s true Version from every downstream check). Journey Version agreement remains gated on the Job asserting a Version, plus the round-4 not-yet-pinned guard when no Order is present. Referencing an Order together with a still-unpinned Journey is rejected outright (JOB_ORDER_REQUIRES_PINNED_JOURNEY): neither deferring to null nor freezing the Order''s Version is safe in that combination, since the Journey''s later, one-time pin could still permanently contradict whichever value won.';

-- 20260814060704 · WO-LAUNCH-CORE-04 fourth fresh-evaluator pass: Journey
-- version-pin timing gap.
-- Corrective, additive-only migration over
-- 20260814054459_launch_core_production_third_evaluation_hardening. Does
-- not reset or drop the production schema; does not edit any previously
-- applied migration file; does not modify the already-accepted commerce
-- schema.
--
-- FINDING (confirmed by live execution, no concurrency required —
-- fully sequential, single-session reproduction). Every prior round's
-- Journey/Version coherence check reads commerce.product_journey_anchors
-- .product_version_id exactly ONCE, at Job/Artifact creation time. But
-- that field is NOT immutable from row creation the way
-- commerce.orders.product_version_id is: per the already-accepted WO-02
-- hardening, a Journey Anchor starts with product_version_id = NULL and
-- may transition it exactly once, from NULL to a real value, while the
-- Journey is still open (JOURNEY_ANCHOR_VERSION_PIN_REQUIRES_OPEN); once
-- set it becomes immutable (JOURNEY_ANCHOR_VERSION_PIN_IMMUTABLE).
--
-- Reproduction: create a Journey with no pin yet (NULL). Create a Job or
-- Artifact referencing that Journey AND asserting its own explicit
-- product_version_id = V2 — the existing check only compares when BOTH
-- sides are non-null, so an unpinned Journey means nothing is compared
-- and this passes. Later, entirely ordinary and legitimate per commerce's
-- own rules, the Journey gets pinned to V1 (V1 != V2). The Job/Artifact
-- is already fully immutable (JOB_PRODUCT_VERSION_IMMUTABLE / Artifacts
-- have no UPDATE grant at all) — the contradiction between the Journey's
-- authoritative pin and the Job's/Artifact's own frozen claim is now
-- PERMANENT and undetectable by any later check, since nothing in
-- production.* re-validates against the Journey after creation.
--
-- This is a genuinely different axis than the three prior rounds fixed
-- (disagreement, then null-vs-explicit, then omission) — the axis here
-- is TIME: a value read once at creation can still change afterward on
-- the referenced side, in a way no earlier round's fix addressed.
--
-- FIX (does not require touching commerce): when a Job/Artifact
-- references a Journey whose pin is CURRENTLY null, the Job/Artifact must
-- not assert its own non-null product_version_id claim either — it must
-- defer entirely to whatever the Journey eventually pins (or never pins).
-- A null claim can never later contradict anything, since these checks
-- only ever compare non-null values. Once a Journey IS pinned (non-null),
-- it is already immutable per WO-02's own rules, so a Job/Artifact
-- created against an already-pinned Journey remains permanently coherent
-- with it — the only ever-vulnerable window was "Journey unpinned at
-- Job/Artifact creation time", which this closes completely.
--
-- OUT OF SCOPE, explicitly not fixed here: whether
-- commerce.product_journey_anchors' own version pin can ever end up
-- disagreeing with commerce.orders' fixed version for the same Journey
-- independent of any production.* row. That question lives entirely
-- inside the already-accepted commerce/WO-02 schema (Journey vs Order,
-- neither owned by this WO), and fixing it would require modifying an
-- already-applied WO-02 migration, which this WO's authority does not
-- extend to. Flagged as a FOUNDER / CROSS-PROJECT consideration for a
-- future WO-02 hardening round, not silently worked around here.

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
    if v_journey_version is not null
       and NEW.product_version_id is not null
       and v_journey_version is distinct from NEW.product_version_id then
      raise exception 'JOB_JOURNEY_VERSION_MISMATCH';
    end if;
    -- Fourth-evaluator finding: an unpinned Journey must not let the Job
    -- assert its own Version claim, since the Journey's later, one-time
    -- pin (set after this Job already became immutable) could otherwise
    -- silently disagree with it forever.
    if v_journey_version is null and NEW.product_version_id is not null then
      raise exception 'JOB_JOURNEY_VERSION_NOT_YET_PINNED';
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
    if NEW.product_version_id is not null
       and v_order_version is distinct from NEW.product_version_id then
      raise exception 'JOB_ORDER_VERSION_MISMATCH';
    end if;
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
  'Cross-reference coherence at insert time. Journey/Order belongs-to and Version-agreement checks as before, PLUS: if the referenced Journey has not yet pinned a Version, the Job must not assert its own Version claim either — closes a permanent-contradiction window where the Journey''s later, one-time pin (set after this Job is already immutable) could otherwise silently disagree with an already-frozen Job claim forever. Order-side checks remain safe without this treatment because commerce.orders.product_version_id is NOT NULL and fully immutable from creation — there is no equivalent "pinned later" window on that side.';

create or replace function production.validate_artifact_scope()
returns trigger
language plpgsql
set search_path = pg_catalog, production, commerce
as $$
declare
  v_journey_person uuid;
  v_journey_product uuid;
  v_journey_version uuid;
begin
  if NEW.journey_anchor_id is not null then
    select person_id, product_id, product_version_id
      into v_journey_person, v_journey_product, v_journey_version
    from commerce.product_journey_anchors where id = NEW.journey_anchor_id;
    if v_journey_person is null then
      raise exception 'ARTIFACT_JOURNEY_NOT_FOUND';
    end if;
    if v_journey_person is distinct from NEW.person_id or v_journey_product is distinct from NEW.product_id then
      raise exception 'ARTIFACT_JOURNEY_SCOPE_MISMATCH';
    end if;
    if v_journey_version is not null
       and NEW.product_version_id is not null
       and v_journey_version is distinct from NEW.product_version_id then
      raise exception 'ARTIFACT_JOURNEY_VERSION_MISMATCH';
    end if;
    if v_journey_version is null and NEW.product_version_id is not null then
      raise exception 'ARTIFACT_JOURNEY_VERSION_NOT_YET_PINNED';
    end if;
  end if;
  return NEW;
end;
$$;

comment on function production.validate_artifact_scope() is
  'Journey coherence at insert time, same as before, PLUS: if the referenced Journey has not yet pinned a Version, the Artifact must not assert its own Version claim either — same permanent-contradiction closure as validate_job_scope(), since an Artifact is fully immutable the moment it is created.';

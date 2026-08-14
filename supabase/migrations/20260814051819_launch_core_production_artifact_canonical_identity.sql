-- 20260814051819 · WO-LAUNCH-CORE-04 fresh-evaluator finding: Artifact
-- canonical identity.
-- Corrective, additive-only migration over
-- 20260814050321_launch_core_production_lineage_closure. Does not reset
-- or drop the production schema; does not edit any previously applied
-- migration file.
--
-- GAP found by a fresh, independent read-only evaluator (not the
-- builder's own self-review, not one of P07's four named outcomes):
-- production.artifacts had no uniqueness/natural-key constraint at all
-- beyond its surrogate id. Nothing stopped a second, logically-duplicate
-- Artifact from being created for the exact same
-- (person, product, product_version, journey_anchor) scope — the table's
-- own documented purpose ("the stable logical produced thing"). Each
-- duplicate could independently accumulate its own artifact_versions and
-- artifact_reviews, producing two "canonical" things with contradictory
-- QA outcomes for what should be one logical target, with nothing in the
-- schema saying which is authoritative. This is the same class of risk
-- Outcome D closed for output *registration* replay, one level higher:
-- Artifact *creation* itself had no replay-safety/idempotent-identity at
-- all.
--
-- FIX: a unique index on the Artifact's own declared scope columns.
-- product_version_id and journey_anchor_id are both nullable, and a plain
-- UNIQUE constraint treats NULL as distinct from NULL (so two "fully
-- unscoped" Artifacts for the same Person/Product would NOT collide under
-- an ordinary unique constraint) — every meaningful scope combination,
-- including "both unscoped", must collide. COALESCE to a fixed sentinel
-- makes NULL compare as equal to NULL for this specific identity check,
-- the standard Postgres idiom for this exact problem.

create unique index artifacts_unique_canonical_scope_idx
  on production.artifacts (
    person_id,
    product_id,
    coalesce(product_version_id, '00000000-0000-0000-0000-000000000000'::uuid),
    coalesce(journey_anchor_id, '00000000-0000-0000-0000-000000000000'::uuid)
  );

comment on index production.artifacts_unique_canonical_scope_idx is
  'Artifact canonical identity: at most one Artifact may exist per (Person, Product, Product Version, Journey Anchor) scope, including when Version and/or Journey are both unscoped (null coalesced to a fixed sentinel so two unscoped rows still collide). Prevents a duplicate-creation retry, or any other path, from minting a second "canonical" Artifact for the same logical target, which could otherwise accumulate its own contradictory version/review history alongside the original with nothing in the schema saying which is authoritative.';

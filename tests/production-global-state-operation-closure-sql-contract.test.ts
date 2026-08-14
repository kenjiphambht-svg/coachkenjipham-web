import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const sql = readFileSync(
  resolve(process.cwd(), 'supabase/migrations/20260814112920_launch_core_production_global_state_operation_closure.sql'),
  'utf8'
);
const rollback = readFileSync(
  resolve(process.cwd(), 'supabase/rollbacks/20260814112920_launch_core_production_global_state_operation_closure_down.sql'),
  'utf8'
);
const proofComponentPaths = [
  'wo04_non_empty_fixture.sql',
  'wo04_product_version_evolution.sql',
  'wo04_final_state_assertions.sql',
  'wo04_runtime_regression.sql',
] as const;
const proofComponents = proofComponentPaths.map((name) => ({
  name,
  sql: readFileSync(resolve(process.cwd(), 'supabase/tests', name), 'utf8'),
}));
const stagingProofRunner = readFileSync(
  resolve(process.cwd(), 'supabase/tests/wo04_staging_transaction.sql'),
  'utf8'
);
const localRecoverySeed = readFileSync(
  resolve(process.cwd(), 'supabase/tests/wo04_local_recovery_seed.sql'),
  'utf8'
);

const stripComments = (text: string) =>
  text
    .replace(/comment on [\s\S]*?is\s+'(?:[^']|'')*';/gi, '')
    .split('\n')
    .filter((line) => !line.trim().startsWith('--'))
    .join('\n');

const code = stripComments(sql);
const rollbackCode = stripComments(rollback);

describe('WO-LAUNCH-CORE-04 global state + operation closure — FD-2026-027 canonical rebaseline', () => {
  it('does not touch identity, entitlement, or knowledge, and does not create/drop a schema', () => {
    expect(code).not.toMatch(/create schema|drop schema/i);
    expect(code).not.toMatch(/identity\.\w|entitlement\.\w|knowledge\.\w/i);
  });

  it('does not modify commerce structure (only reads it, as before)', () => {
    expect(code).not.toMatch(/commerce\.\w+\s*(add|drop|alter)/i);
  });
});

describe('Finding A — Job cannot terminate (failed/cancelled) while an Attempt is running', () => {
  it('reject_job_rewrite adds the new guard, symmetric to the succeeded-requires-attempt rule', () => {
    const fn = code.split('create or replace function production.reject_job_rewrite')[1].split('comment on function')[0];
    expect(fn).toMatch(
      /if NEW\.status in \('failed', 'cancelled'\) and OLD\.status is distinct from NEW\.status then/i
    );
    expect(fn).toMatch(/status = 'running'/i);
    expect(fn).toMatch(/raise exception 'JOB_CANNOT_TERMINATE_WHILE_ATTEMPT_RUNNING'/i);
  });

  it('still enforces the pre-existing succeeded-requires-attempt rule and transition/seal checks', () => {
    const fn = code.split('create or replace function production.reject_job_rewrite')[1].split('comment on function')[0];
    expect(fn).toMatch(/raise exception 'JOB_SUCCEEDED_REQUIRES_SUCCESSFUL_ATTEMPT'/i);
    expect(fn).toMatch(/raise exception 'JOB_TERMINAL_STATUS_IMMUTABLE'/i);
    expect(fn).toMatch(/raise exception 'JOB_STATUS_TRANSITION_INVALID'/i);
  });

  it('does not add any new lock (no FOR UPDATE) — relies on the pre-existing jobs-row serialization point', () => {
    const fn = code.split('create or replace function production.reject_job_rewrite')[1].split('comment on function')[0];
    expect(fn).not.toMatch(/for update/i);
  });
});

describe('Finding B — Artifact retains legacy evidence without freezing future Version lineage', () => {
  it('never drops artifacts.product_version_id or its FK constraints', () => {
    expect(code).not.toMatch(/drop column(?: if exists)? product_version_id/i);
    expect(code).not.toMatch(/drop constraint(?: if exists)? artifacts_version_belongs_to_product/i);
    expect(code).not.toMatch(/drop constraint(?: if exists)? artifacts_product_version_id_fkey/i);
    expect(sql).toMatch(/comment on column production\.artifacts\.product_version_id is\s*'Deprecated, immutable creation-time Product Version evidence retained for recovery safety/i);
  });

  it('validate_artifact_scope no longer declares or checks any Version', () => {
    const fn = code.split('create or replace function production.validate_artifact_scope')[1].split('comment on function')[0];
    expect(fn).not.toMatch(/v_journey_version|product_version_id|ARTIFACT_JOURNEY_VERSION/i);
    expect(fn).toMatch(/raise exception 'ARTIFACT_JOURNEY_NOT_FOUND'/i);
    expect(fn).toMatch(/raise exception 'ARTIFACT_JOURNEY_SCOPE_MISMATCH'/i);
  });

  it('validate_artifact_version_scope no longer compares Job Version to Artifact Version', () => {
    const fn = code.split('create or replace function production.validate_artifact_version_scope')[1].split('comment on function')[0];
    expect(fn).not.toMatch(/ARTIFACT_VERSION_JOB_VERSION_MISMATCH|v_artifact_version|v_job_version/i);
  });

  it('validate_artifact_version_scope still enforces Person/Product/Journey coherence and the successful-Attempt requirement', () => {
    const fn = code.split('create or replace function production.validate_artifact_version_scope')[1].split('comment on function')[0];
    expect(fn).toMatch(/raise exception 'ARTIFACT_VERSION_JOB_SCOPE_MISMATCH'/i);
    expect(fn).toMatch(/raise exception 'ARTIFACT_VERSION_JOB_JOURNEY_MISMATCH'/i);
    expect(fn).toMatch(/raise exception 'ARTIFACT_VERSION_REQUIRES_SUCCESSFUL_ATTEMPT'/i);
  });
});

describe('Finding C — Review event replay identity', () => {
  it('preserves every legacy correlation value instead of tightening the original evidence column', () => {
    expect(code).not.toMatch(/alter column review_correlation_reference set not null/i);
    expect(code).not.toMatch(/update production\.artifact_reviews/i);
    expect(sql).toMatch(/add column if not exists review_replay_guarded boolean not null default false/i);
    expect(sql).toMatch(/alter column review_replay_guarded set default true/i);
  });

  it('requires correlation and forces the guard for every new event', () => {
    const fn = code.split('create or replace function production.validate_artifact_review_replay')[1].split('revoke all on function production.validate_artifact_review_replay')[0];
    expect(fn).toMatch(/NEW\.review_correlation_reference is null/i);
    expect(fn).toMatch(/REVIEW_CORRELATION_REFERENCE_REQUIRED/i);
    expect(fn).toMatch(/NEW\.review_replay_guarded := true/i);
    expect(fn).toMatch(/REVIEW_EVENT_REPLAY/i);
  });

  it('adds a partial atomic backstop for concurrent new-event replay', () => {
    const index = code.split('create unique index production_artifact_reviews_unique_guarded_event_idx')[1].split(';')[0];
    expect(index).toMatch(/artifact_version_id/i);
    expect(index).toMatch(/review_source/i);
    expect(index).toMatch(/review_correlation_reference/i);
    expect(index).toMatch(/where review_replay_guarded/i);
    expect(index).not.toMatch(/review_state/i);
  });
});

describe('scoped rollback', () => {
  it('preserves product_version_id data and its existing FK constraints instead of recreating an empty column', () => {
    expect(rollbackCode).not.toMatch(/add column(?: if not exists)? product_version_id/i);
    expect(rollbackCode).not.toMatch(/drop column(?: if exists)? product_version_id/i);
    expect(rollbackCode).not.toMatch(/(?:add|drop) constraint(?: if exists)? artifacts_(?:product_version_id_fkey|version_belongs_to_product)/i);
    expect(rollback).toMatch(/preserves production\.artifacts\.product_version_id and its values\/FKs/i);
  });

  it('restores the pre-migration validate_artifact_scope and validate_artifact_version_scope bodies', () => {
    const artifactScopeFn = rollbackCode.split('create or replace function production.validate_artifact_scope')[1].split('create or replace function production.validate_artifact_version_scope')[0];
    expect(artifactScopeFn).toMatch(/ARTIFACT_JOURNEY_VERSION_MISMATCH/i);
    expect(artifactScopeFn).toMatch(/ARTIFACT_JOURNEY_VERSION_NOT_YET_PINNED/i);

    const versionScopeFn = rollbackCode.split('create or replace function production.validate_artifact_version_scope')[1].split('create or replace function production.reject_job_rewrite')[0];
    expect(versionScopeFn).toMatch(/ARTIFACT_VERSION_JOB_VERSION_MISMATCH/i);
  });

  it('restores reject_job_rewrite without the Finding A guard', () => {
    const fn = rollbackCode.split('create or replace function production.reject_job_rewrite')[1];
    expect(fn).not.toMatch(/JOB_CANNOT_TERMINATE_WHILE_ATTEMPT_RUNNING/i);
    expect(fn).toMatch(/raise exception 'JOB_SUCCEEDED_REQUIRES_SUCCESSFUL_ATTEMPT'/i);
  });

  it('makes only the derived replay guard inert and leaves original Review evidence untouched', () => {
    expect(rollback).toMatch(/drop trigger if exists production_artifact_reviews_validate_replay/i);
    expect(rollback).toMatch(/drop function if exists production\.validate_artifact_review_replay/i);
    expect(rollback).toMatch(/drop index if exists production\.production_artifact_reviews_unique_guarded_event_idx/i);
    expect(rollback).toMatch(/alter column review_replay_guarded set default false/i);
    expect(rollbackCode).not.toMatch(/drop column(?: if exists)? review_replay_guarded/i);
    expect(rollbackCode).not.toMatch(/alter column review_correlation_reference/i);
  });

  it('touches neither identity, commerce structure, entitlement, nor knowledge', () => {
    expect(rollbackCode).not.toMatch(/identity\.\w|entitlement\.\w|knowledge\.\w|create table|drop schema|commerce\.\w+\s*(add|drop|alter)/i);
  });
});

describe('reproducible transaction ownership', () => {
  it.each(proofComponents)('$name is transaction-neutral', ({ sql: component }) => {
    const componentCode = component
      .split('\n')
      .filter((line) => !line.trim().startsWith('--'))
      .join('\n');
    expect(componentCode).not.toMatch(/^\s*(?:begin|commit|rollback)\s*;/im);
  });

  it('the staging runner alone owns one BEGIN/ROLLBACK and includes every final-state component', () => {
    expect(stagingProofRunner.match(/^\s*begin\s*;/gim)).toHaveLength(1);
    expect(stagingProofRunner.match(/^\s*rollback\s*;/gim)).toHaveLength(1);
    expect(stagingProofRunner).not.toMatch(/^\s*commit\s*;/im);
    for (const name of proofComponentPaths) {
      expect(stagingProofRunner).toContain(`\\ir ${name}`);
    }
  });

  it('the only commit runner is explicitly local and includes the legacy-state fixture', () => {
    expect(localRecoverySeed).toMatch(/Disposable-local-only seed owner/i);
    expect(localRecoverySeed.match(/^\s*commit\s*;/gim)).toHaveLength(1);
    expect(localRecoverySeed).toContain('\\ir wo04_legacy_review_fixture.sql');
    expect(stagingProofRunner).not.toContain('wo04_legacy_review_fixture.sql');
  });
});

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

const stripComments = (text: string) =>
  text
    .replace(/comment on [\s\S]*?is\s+'(?:[^']|'')*';/gi, '')
    .split('\n')
    .filter((line) => !line.trim().startsWith('--'))
    .join('\n');

const code = stripComments(sql);
const rollbackCode = stripComments(rollback);

describe('WO-LAUNCH-CORE-04 global state + operation closure — additive only', () => {
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

describe('Finding B — Artifact no longer carries a stale Version claim', () => {
  it('drops artifacts.product_version_id and its FK constraints', () => {
    expect(sql).toMatch(/drop constraint if exists artifacts_version_belongs_to_product/i);
    expect(sql).toMatch(/drop constraint if exists artifacts_product_version_id_fkey/i);
    expect(sql).toMatch(/drop column if exists product_version_id/i);
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
  it('makes review_correlation_reference mandatory', () => {
    expect(sql).toMatch(/alter column review_correlation_reference set not null/i);
  });

  it('adds a unique-event constraint scoped to (artifact_version_id, review_source, review_correlation_reference)', () => {
    expect(sql).toMatch(
      /add constraint artifact_reviews_unique_event\s*unique \(artifact_version_id, review_source, review_correlation_reference\)/i
    );
  });

  it('does not key identity on review_state (a genuine new event may share state with a prior one)', () => {
    const constraintLine = sql.split('add constraint artifact_reviews_unique_event')[1].split(';')[0];
    expect(constraintLine).not.toMatch(/review_state/i);
  });
});

describe('scoped rollback', () => {
  it('restores product_version_id (nullable) with both original FK constraints', () => {
    expect(rollback).toMatch(/add column if not exists product_version_id uuid/i);
    expect(rollback).toMatch(/add constraint artifacts_product_version_id_fkey/i);
    expect(rollback).toMatch(/add constraint artifacts_version_belongs_to_product/i);
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

  it('drops the unique-event constraint and restores nullable review_correlation_reference with the original CHECK', () => {
    expect(rollback).toMatch(/drop constraint if exists artifact_reviews_unique_event/i);
    expect(rollback).toMatch(/alter column review_correlation_reference drop not null/i);
    expect(rollback).toMatch(/review_correlation_reference is null/i);
  });

  it('touches neither identity, commerce structure, entitlement, nor knowledge', () => {
    expect(rollbackCode).not.toMatch(/identity\.\w|entitlement\.\w|knowledge\.\w|create table|drop schema|commerce\.\w+\s*(add|drop|alter)/i);
  });
});

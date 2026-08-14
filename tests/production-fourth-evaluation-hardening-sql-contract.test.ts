import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const sql = readFileSync(
  resolve(process.cwd(), 'supabase/migrations/20260814060704_launch_core_production_fourth_evaluation_hardening.sql'),
  'utf8'
);
const rollback = readFileSync(
  resolve(process.cwd(), 'supabase/rollbacks/20260814060704_launch_core_production_fourth_evaluation_hardening_down.sql'),
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

describe('WO-LAUNCH-CORE-04 fourth fresh-evaluator pass — additive only', () => {
  it('does not touch identity, commerce, entitlement, or knowledge, no new table/schema/trigger', () => {
    expect(code).not.toMatch(/create table|drop table|create schema|drop schema|create trigger|drop trigger/i);
    expect(code).not.toMatch(/commerce\.\w+\s*(add|drop|alter)|identity\.\w|entitlement\.\w|knowledge\.\w/i);
  });

  it('is a pure CREATE OR REPLACE FUNCTION pass on the two pre-existing scope validators', () => {
    expect(code).toMatch(/create or replace function production\.validate_job_scope/i);
    expect(code).toMatch(/create or replace function production\.validate_artifact_scope/i);
  });
});

describe('Finding — Job scope: unpinned Journey must forbid the Job asserting its own Version', () => {
  it('adds the not-yet-pinned guard after the existing agreement check', () => {
    const fn = code.split('create or replace function production.validate_job_scope')[1].split('comment on function')[0];
    expect(fn).toMatch(
      /if v_journey_version is null\s*and NEW\.product_version_id is not null then/i
    );
    expect(fn).toMatch(/raise exception 'JOB_JOURNEY_VERSION_NOT_YET_PINNED'/i);
  });

  it('still enforces the pre-existing Journey belongs-to and agreement checks', () => {
    const fn = code.split('create or replace function production.validate_job_scope')[1].split('comment on function')[0];
    expect(fn).toMatch(/raise exception 'JOB_JOURNEY_SCOPE_MISMATCH'/i);
    expect(fn).toMatch(/raise exception 'JOB_JOURNEY_VERSION_MISMATCH'/i);
  });

  it('still enforces the pre-existing Order and Journey-vs-Order checks unchanged', () => {
    const fn = code.split('create or replace function production.validate_job_scope')[1].split('comment on function')[0];
    expect(fn).toMatch(/raise exception 'JOB_ORDER_SCOPE_MISMATCH'/i);
    expect(fn).toMatch(/raise exception 'JOB_ORDER_VERSION_MISMATCH'/i);
    expect(fn).toMatch(/raise exception 'JOB_JOURNEY_ORDER_VERSION_MISMATCH'/i);
  });

  it('does not apply the new guard to the Order side, which has no equivalent "pinned later" window', () => {
    const fn = code.split('create or replace function production.validate_job_scope')[1].split('comment on function')[0];
    expect(fn).not.toMatch(/v_order_version is null\s*and NEW\.product_version_id is not null/i);
  });
});

describe('Finding — Artifact scope: same unpinned-Journey guard', () => {
  it('adds the not-yet-pinned guard to validate_artifact_scope', () => {
    const fn = code.split('create or replace function production.validate_artifact_scope')[1].split('comment on function')[0];
    expect(fn).toMatch(
      /if v_journey_version is null\s*and NEW\.product_version_id is not null then/i
    );
    expect(fn).toMatch(/raise exception 'ARTIFACT_JOURNEY_VERSION_NOT_YET_PINNED'/i);
  });

  it('still enforces the pre-existing Journey belongs-to and agreement checks', () => {
    const fn = code.split('create or replace function production.validate_artifact_scope')[1].split('comment on function')[0];
    expect(fn).toMatch(/raise exception 'ARTIFACT_JOURNEY_SCOPE_MISMATCH'/i);
    expect(fn).toMatch(/raise exception 'ARTIFACT_JOURNEY_VERSION_MISMATCH'/i);
  });
});

describe('scoped rollback', () => {
  it('restores both functions to bodies with no NOT_YET_PINNED guard', () => {
    const jobFn = rollbackCode.split('create or replace function production.validate_job_scope')[1].split('create or replace function production.validate_artifact_scope')[0];
    const artifactFn = rollbackCode.split('create or replace function production.validate_artifact_scope')[1];
    expect(jobFn).not.toMatch(/NOT_YET_PINNED/i);
    expect(artifactFn).not.toMatch(/NOT_YET_PINNED/i);
  });

  it('touches neither identity, commerce structure, entitlement, nor knowledge', () => {
    expect(rollbackCode).not.toMatch(/identity\.\w|entitlement\.\w|knowledge\.\w|create table|drop schema|create trigger|drop trigger/i);
  });
});

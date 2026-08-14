import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const sql = readFileSync(
  resolve(process.cwd(), 'supabase/migrations/20260814093326_launch_core_production_fifth_evaluation_hardening.sql'),
  'utf8'
);
const rollback = readFileSync(
  resolve(process.cwd(), 'supabase/rollbacks/20260814093326_launch_core_production_fifth_evaluation_hardening_down.sql'),
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

describe('WO-LAUNCH-CORE-04 fifth fresh-evaluator pass — additive only', () => {
  it('does not touch identity, commerce, entitlement, or knowledge, no new table/schema/trigger', () => {
    expect(code).not.toMatch(/create table|drop table|create schema|drop schema|create trigger|drop trigger/i);
    expect(code).not.toMatch(/commerce\.\w+\s*(add|drop|alter)|identity\.\w|entitlement\.\w|knowledge\.\w/i);
  });

  it('is a pure CREATE OR REPLACE FUNCTION pass on validate_job_scope only (Artifact has no order_id)', () => {
    expect(code).toMatch(/create or replace function production\.validate_job_scope/i);
    expect(code).not.toMatch(/create or replace function production\.validate_artifact_scope/i);
  });
});

describe('Finding — Order Version agreement is now unconditional', () => {
  it('drops the "NEW.product_version_id is not null" guard around JOB_ORDER_VERSION_MISMATCH', () => {
    const fn = code.split('create or replace function production.validate_job_scope')[1].split('comment on function')[0];
    expect(fn).toMatch(
      /if NEW\.order_id is not null and v_order_version is distinct from NEW\.product_version_id then/i
    );
    expect(fn).not.toMatch(/NEW\.product_version_id is not null\s*\n\s*and v_order_version is distinct from NEW\.product_version_id/i);
    expect(fn).toMatch(/raise exception 'JOB_ORDER_VERSION_MISMATCH'/i);
  });
});

describe('Finding — self-review interaction guard: Order + unpinned Journey forbidden', () => {
  it('adds JOB_ORDER_REQUIRES_PINNED_JOURNEY ahead of the version comparisons', () => {
    const fn = code.split('create or replace function production.validate_job_scope')[1].split('comment on function')[0];
    expect(fn).toMatch(
      /if NEW\.order_id is not null and NEW\.journey_anchor_id is not null and v_journey_version is null then/i
    );
    expect(fn).toMatch(/raise exception 'JOB_ORDER_REQUIRES_PINNED_JOURNEY'/i);
  });

  it('the guard appears before the JOB_ORDER_VERSION_MISMATCH check in the function body', () => {
    const fn = code.split('create or replace function production.validate_job_scope')[1].split('comment on function')[0];
    const guardIdx = fn.search(/JOB_ORDER_REQUIRES_PINNED_JOURNEY/i);
    const versionIdx = fn.search(/JOB_ORDER_VERSION_MISMATCH/i);
    expect(guardIdx).toBeGreaterThan(-1);
    expect(versionIdx).toBeGreaterThan(-1);
    expect(guardIdx).toBeLessThan(versionIdx);
  });

  it("round 4's not-yet-pinned guard is narrowed to only apply when no Order is present", () => {
    const fn = code.split('create or replace function production.validate_job_scope')[1].split('comment on function')[0];
    expect(fn).toMatch(
      /if NEW\.order_id is null\s*and v_journey_version is null\s*and NEW\.product_version_id is not null then/i
    );
    expect(fn).toMatch(/raise exception 'JOB_JOURNEY_VERSION_NOT_YET_PINNED'/i);
  });
});

describe('pre-existing checks remain intact', () => {
  it('Journey/Order belongs-to and the Journey-vs-Order triangle check are untouched', () => {
    const fn = code.split('create or replace function production.validate_job_scope')[1].split('comment on function')[0];
    expect(fn).toMatch(/raise exception 'JOB_JOURNEY_NOT_FOUND'/i);
    expect(fn).toMatch(/raise exception 'JOB_JOURNEY_SCOPE_MISMATCH'/i);
    expect(fn).toMatch(/raise exception 'JOB_ORDER_NOT_FOUND'/i);
    expect(fn).toMatch(/raise exception 'JOB_ORDER_SCOPE_MISMATCH'/i);
    expect(fn).toMatch(/raise exception 'JOB_JOURNEY_VERSION_MISMATCH'/i);
    expect(fn).toMatch(/raise exception 'JOB_JOURNEY_ORDER_VERSION_MISMATCH'/i);
  });
});

describe('scoped rollback', () => {
  it('restores validate_job_scope to a body with no fifth-round guards', () => {
    expect(rollbackCode).not.toMatch(/JOB_ORDER_REQUIRES_PINNED_JOURNEY/i);
    expect(rollbackCode).toMatch(/NEW\.product_version_id is not null\s*\n\s*and v_order_version is distinct from NEW\.product_version_id/i);
  });

  it('does not touch validate_artifact_scope', () => {
    expect(rollbackCode).not.toMatch(/create or replace function production\.validate_artifact_scope/i);
  });

  it('touches neither identity, commerce structure, entitlement, nor knowledge', () => {
    expect(rollbackCode).not.toMatch(/identity\.\w|entitlement\.\w|knowledge\.\w|create table|drop schema|create trigger|drop trigger/i);
  });
});

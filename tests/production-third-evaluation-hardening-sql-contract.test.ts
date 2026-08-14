import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const sql = readFileSync(
  resolve(process.cwd(), 'supabase/migrations/20260814054459_launch_core_production_third_evaluation_hardening.sql'),
  'utf8'
);
const rollback = readFileSync(
  resolve(process.cwd(), 'supabase/rollbacks/20260814054459_launch_core_production_third_evaluation_hardening_down.sql'),
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

describe('WO-LAUNCH-CORE-04 third fresh-evaluator pass — additive only', () => {
  it('does not touch identity, commerce, entitlement, or knowledge, no new table/schema', () => {
    expect(code).not.toMatch(/create table|drop table|create schema|drop schema/i);
    expect(code).not.toMatch(/identity\.\w|commerce\.\w|entitlement\.\w|knowledge\.\w/i);
  });
});

describe('Finding 1 — Journey omission on the Job side is now a mismatch, not a skip', () => {
  it('the Journey check no longer requires the Job side to be non-null before comparing', () => {
    const fn = code.split('create or replace function production.validate_artifact_version_scope')[1].split('comment on function')[0];
    expect(fn).toMatch(
      /if v_artifact_journey is not null\s*and v_job_journey is distinct from v_artifact_journey then/i
    );
    expect(fn).not.toMatch(/v_job_journey is not null\s*and v_artifact_journey is not null\s*and v_job_journey is distinct from v_artifact_journey/i);
    expect(fn).toMatch(/raise exception 'ARTIFACT_VERSION_JOB_JOURNEY_MISMATCH'/i);
  });

  it('Version remains a symmetric-optional (informational) check, unlike Journey', () => {
    const fn = code.split('create or replace function production.validate_artifact_version_scope')[1].split('comment on function')[0];
    expect(fn).toMatch(
      /v_job_version is not null\s*and v_artifact_version is not null\s*and v_job_version is distinct from v_artifact_version/i
    );
  });

  it('still requires the cited Attempt to have genuinely succeeded', () => {
    const fn = code.split('create or replace function production.validate_artifact_version_scope')[1].split('comment on function')[0];
    expect(fn).toMatch(/raise exception 'ARTIFACT_VERSION_REQUIRES_SUCCESSFUL_ATTEMPT'/i);
  });
});

describe('Finding 2 — validate_job_attempt_creation moved to AFTER INSERT to avoid a lock-order inversion', () => {
  it('the trigger is dropped and recreated as AFTER INSERT (was BEFORE INSERT)', () => {
    expect(sql).toMatch(/drop trigger if exists production_job_attempts_validate_creation on production\.job_attempts/i);
    expect(sql).toMatch(
      /create trigger production_job_attempts_validate_creation\s*after insert on production\.job_attempts\s*for each row execute function production\.validate_job_attempt_creation/i
    );
  });

  it('does not redefine the function body itself — only its trigger timing changes', () => {
    expect(code).not.toMatch(/create or replace function production\.validate_job_attempt_creation/i);
  });
});

describe('scoped rollback', () => {
  it('restores the symmetric-optional Journey check', () => {
    const fn = rollbackCode.split('create or replace function production.validate_artifact_version_scope')[1].split('drop trigger')[0];
    expect(fn).toMatch(
      /v_job_journey is not null\s*and v_artifact_journey is not null\s*and v_job_journey is distinct from v_artifact_journey/i
    );
  });

  it('restores the trigger to BEFORE INSERT', () => {
    expect(rollback).toMatch(
      /create trigger production_job_attempts_validate_creation\s*before insert on production\.job_attempts/i
    );
  });

  it('touches neither identity, commerce, entitlement, nor knowledge', () => {
    expect(rollbackCode).not.toMatch(/identity\.\w|commerce\.\w|entitlement\.\w|knowledge\.\w|create table|drop schema/i);
  });
});

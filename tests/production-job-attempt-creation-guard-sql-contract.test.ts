import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const sql = readFileSync(
  resolve(process.cwd(), 'supabase/migrations/20260814035522_launch_core_production_job_attempt_creation_guard.sql'),
  'utf8'
);
const rollback = readFileSync(
  resolve(process.cwd(), 'supabase/rollbacks/20260814035522_launch_core_production_job_attempt_creation_guard_down.sql'),
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

describe('WO-LAUNCH-CORE-04 third self-review — reject Attempt creation after a genuine success', () => {
  it('is additive-only: only replaces the existing validate_job_attempt_creation body', () => {
    expect(code).not.toMatch(/create table|drop table|create schema|drop schema|create index/i);
    expect(sql).toMatch(/create or replace function production\.validate_job_attempt_creation/i);
  });

  it('rejects a new Attempt when any Attempt of the same Job has already succeeded', () => {
    const fn = code.split('create or replace function production.validate_job_attempt_creation')[1].split('comment on function')[0];
    expect(fn).toMatch(/select exists \(\s*select 1 from production\.job_attempts where job_id = NEW\.job_id and status = 'succeeded'\s*\)/i);
    expect(fn).toMatch(/raise exception 'JOB_ATTEMPT_CANNOT_START_AFTER_SUCCESS'/i);
  });

  it('still enforces the two pre-existing creation guards (must start running, cannot start on terminal Job)', () => {
    const fn = code.split('create or replace function production.validate_job_attempt_creation')[1].split('comment on function')[0];
    expect(fn).toMatch(/raise exception 'JOB_ATTEMPT_MUST_START_RUNNING'/i);
    expect(fn).toMatch(/raise exception 'JOB_ATTEMPT_CANNOT_START_ON_TERMINAL_JOB'/i);
  });
});

describe('scoped rollback', () => {
  it('restores the function to a body with no already-succeeded check', () => {
    expect(rollback).toMatch(/create or replace function production\.validate_job_attempt_creation/i);
    expect(rollbackCode).not.toMatch(/JOB_ATTEMPT_CANNOT_START_AFTER_SUCCESS/i);
  });

  it('still restores the two pre-existing creation guards', () => {
    expect(rollback).toMatch(/JOB_ATTEMPT_MUST_START_RUNNING/i);
    expect(rollback).toMatch(/JOB_ATTEMPT_CANNOT_START_ON_TERMINAL_JOB/i);
  });

  it('touches neither identity, commerce, entitlement, nor knowledge', () => {
    expect(rollbackCode).not.toMatch(/identity\.\w|commerce\.\w|entitlement\.\w|knowledge\.\w|create table|drop schema/i);
  });
});

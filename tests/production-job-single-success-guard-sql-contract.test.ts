import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const sql = readFileSync(
  resolve(process.cwd(), 'supabase/migrations/20260814035327_launch_core_production_job_single_success_guard.sql'),
  'utf8'
);
const rollback = readFileSync(
  resolve(process.cwd(), 'supabase/rollbacks/20260814035327_launch_core_production_job_single_success_guard_down.sql'),
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

describe('WO-LAUNCH-CORE-04 second self-review — single-success guard per Job', () => {
  it('is additive-only: no new table/trigger/function, only a partial unique index', () => {
    expect(code).not.toMatch(/create table|drop table|create schema|drop schema|create trigger|create or replace function/i);
  });

  it('adds an atomic partial unique index limiting a Job to at most one succeeded Attempt ever', () => {
    expect(sql).toMatch(
      /create unique index job_attempts_one_succeeded_per_job_idx\s*on production\.job_attempts\(job_id\)\s*where status = 'succeeded'/i
    );
  });
});

describe('scoped rollback', () => {
  it('drops only the new index', () => {
    expect(rollback).toMatch(/drop index if exists production\.job_attempts_one_succeeded_per_job_idx/i);
    expect(rollbackCode.trim().split('\n').filter((l) => l.trim().length > 0)).toHaveLength(1);
  });

  it('touches neither identity, commerce, entitlement, nor knowledge', () => {
    expect(rollbackCode).not.toMatch(/identity\.\w|commerce\.\w|entitlement\.\w|knowledge\.\w|create table|drop schema/i);
  });
});

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const sql = readFileSync(
  resolve(process.cwd(), 'supabase/migrations/20260814052905_launch_core_production_second_evaluation_hardening.sql'),
  'utf8'
);
const rollback = readFileSync(
  resolve(process.cwd(), 'supabase/rollbacks/20260814052905_launch_core_production_second_evaluation_hardening_down.sql'),
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

describe('WO-LAUNCH-CORE-04 second fresh-evaluator pass — additive only', () => {
  it('does not touch identity, commerce, entitlement, or knowledge, no new table/schema', () => {
    expect(code).not.toMatch(/create table|drop table|create schema|drop schema/i);
    expect(code).not.toMatch(/identity\.\w|commerce\.\w|entitlement\.\w|knowledge\.\w/i);
  });
});

describe('Finding A — Artifact identity no longer split by Version when a Journey exists', () => {
  it('drops the previous (person, product, version, journey) index and replaces it with (person, product, journey) only', () => {
    expect(sql).toMatch(/drop index if exists production\.artifacts_unique_canonical_scope_idx/i);
    expect(sql).toMatch(
      /create unique index artifacts_unique_canonical_scope_idx\s*on production\.artifacts \(\s*person_id,\s*product_id,\s*coalesce\(journey_anchor_id, '00000000-0000-0000-0000-000000000000'::uuid\)\s*\)/i
    );
  });

  it('the new index no longer references product_version_id at all', () => {
    const idx = sql.split('create unique index artifacts_unique_canonical_scope_idx')[1].split(';')[0];
    expect(idx).not.toMatch(/product_version_id/i);
  });
});

describe('Finding B — terminal-Job check now takes an explicit row lock', () => {
  it('validate_job_attempt_creation uses SELECT ... FOR UPDATE on the Job row', () => {
    const fn = code.split('create or replace function production.validate_job_attempt_creation')[1].split('comment on function')[0];
    expect(fn).toMatch(/select status into v_job_status from production\.jobs where id = NEW\.job_id for update/i);
  });

  it('still enforces all three pre-existing creation guards', () => {
    const fn = code.split('create or replace function production.validate_job_attempt_creation')[1].split('comment on function')[0];
    expect(fn).toMatch(/raise exception 'JOB_ATTEMPT_MUST_START_RUNNING'/i);
    expect(fn).toMatch(/raise exception 'JOB_ATTEMPT_CANNOT_START_ON_TERMINAL_JOB'/i);
    expect(fn).toMatch(/raise exception 'JOB_ATTEMPT_CANNOT_START_AFTER_SUCCESS'/i);
  });
});

describe('scoped rollback', () => {
  it('restores the (person, product, version, journey) index form', () => {
    expect(rollback).toMatch(
      /create unique index artifacts_unique_canonical_scope_idx\s*on production\.artifacts \(\s*person_id,\s*product_id,\s*coalesce\(product_version_id,/i
    );
  });

  it('restores validate_job_attempt_creation without the FOR UPDATE lock', () => {
    const fn = rollbackCode.split('create or replace function production.validate_job_attempt_creation')[1].split('drop index')[0];
    expect(fn).not.toMatch(/for update/i);
  });

  it('touches neither identity, commerce, entitlement, nor knowledge', () => {
    expect(rollbackCode).not.toMatch(/identity\.\w|commerce\.\w|entitlement\.\w|knowledge\.\w|create table|drop schema/i);
  });
});

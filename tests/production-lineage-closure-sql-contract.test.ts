import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const sql = readFileSync(
  resolve(process.cwd(), 'supabase/migrations/20260814050321_launch_core_production_lineage_closure.sql'),
  'utf8'
);
const rollback = readFileSync(
  resolve(process.cwd(), 'supabase/rollbacks/20260814050321_launch_core_production_lineage_closure_down.sql'),
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

describe('WO-LAUNCH-CORE-04 P07 architecture hardening — additive only', () => {
  it('does not touch identity, commerce, entitlement, or knowledge, and no new table/schema', () => {
    expect(code).not.toMatch(/create table|drop table|create schema|drop schema/i);
    expect(code).not.toMatch(/identity\.\w|commerce\.\w|entitlement\.\w|knowledge\.\w/i);
  });
});

describe('Outcome A — Job <-> Attempt aggregate coherence via auto-cascade', () => {
  it('a new Attempt cascades its Job pending -> running', () => {
    const fn = code.split('create or replace function production.cascade_job_running_from_attempt')[1].split('comment on function')[0];
    expect(fn).toMatch(/update production\.jobs set status = 'running' where id = NEW\.job_id and status = 'pending'/i);
    expect(sql).toMatch(
      /create trigger production_job_attempts_cascade_running\s*after insert on production\.job_attempts\s*for each row execute function production\.cascade_job_running_from_attempt/i
    );
  });

  it('an Attempt reaching succeeded cascades its Job to succeeded', () => {
    const fn = code.split('create or replace function production.cascade_job_succeeded_from_attempt')[1].split('comment on function')[0];
    expect(fn).toMatch(/NEW\.status = 'succeeded' and OLD\.status is distinct from 'succeeded'/i);
    expect(fn).toMatch(/update production\.jobs set status = 'succeeded' where id = NEW\.job_id and status <> 'succeeded'/i);
    expect(sql).toMatch(
      /create trigger production_job_attempts_cascade_succeeded\s*after update on production\.job_attempts\s*for each row execute function production\.cascade_job_succeeded_from_attempt/i
    );
  });

  it("neither cascade function is SECURITY DEFINER — they rely on service_role's existing UPDATE grant, not elevated privilege", () => {
    const runningFn = code.split('create or replace function production.cascade_job_running_from_attempt')[1].split('create trigger')[0];
    const succeededFn = code.split('create or replace function production.cascade_job_succeeded_from_attempt')[1].split('create trigger')[0];
    expect(runningFn).not.toMatch(/security definer/i);
    expect(succeededFn).not.toMatch(/security definer/i);
  });

  it('does not modify the pre-existing terminal-status seal — relies on it unchanged', () => {
    expect(code).not.toMatch(/create or replace function production\.reject_job_rewrite/i);
  });
});

describe('Outcome B — a valid production origin requires a genuinely succeeded Attempt', () => {
  it('validate_artifact_version_scope checks the cited Attempt status', () => {
    const fn = code.split('create or replace function production.validate_artifact_version_scope')[1].split('comment on function')[0];
    expect(fn).toMatch(/select status into v_attempt_status from production\.job_attempts where id = NEW\.job_attempt_id/i);
    expect(fn).toMatch(/raise exception 'ARTIFACT_VERSION_ATTEMPT_NOT_FOUND'/i);
    expect(fn).toMatch(/raise exception 'ARTIFACT_VERSION_REQUIRES_SUCCESSFUL_ATTEMPT'/i);
  });
});

describe('Outcome C — Artifact <-> Job Journey lineage closure', () => {
  it('validate_artifact_version_scope now compares Journey on both sides, matching the existing Version-coherence pattern', () => {
    const fn = code.split('create or replace function production.validate_artifact_version_scope')[1].split('comment on function')[0];
    expect(fn).toMatch(/journey_anchor_id\s*\n\s*into v_artifact_person, v_artifact_product, v_artifact_version, v_artifact_journey/i);
    expect(fn).toMatch(/journey_anchor_id\s*\n\s*into v_job_person, v_job_product, v_job_version, v_job_journey/i);
    expect(fn).toMatch(
      /v_job_journey is not null\s*and v_artifact_journey is not null\s*and v_job_journey is distinct from v_artifact_journey/i
    );
    expect(fn).toMatch(/raise exception 'ARTIFACT_VERSION_JOB_JOURNEY_MISMATCH'/i);
  });

  it('still enforces the pre-existing Person/Product/Version checks', () => {
    const fn = code.split('create or replace function production.validate_artifact_version_scope')[1].split('comment on function')[0];
    expect(fn).toMatch(/raise exception 'ARTIFACT_VERSION_JOB_SCOPE_MISMATCH'/i);
    expect(fn).toMatch(/raise exception 'ARTIFACT_VERSION_JOB_VERSION_MISMATCH'/i);
  });
});

describe('Outcome D — output registration is replay-safe', () => {
  it('adds a unique constraint on (artifact_id, job_attempt_id), not job_attempt_id alone', () => {
    expect(sql).toMatch(
      /add constraint artifact_versions_unique_artifact_attempt unique \(artifact_id, job_attempt_id\)/i
    );
  });
});

describe('scoped rollback', () => {
  it('restores validate_artifact_version_scope to a body with no Journey/Attempt-status checks', () => {
    const fn = rollbackCode.split('create or replace function production.validate_artifact_version_scope')[1].split('drop trigger')[0];
    expect(fn).not.toMatch(/ARTIFACT_VERSION_JOB_JOURNEY_MISMATCH|ARTIFACT_VERSION_REQUIRES_SUCCESSFUL_ATTEMPT/i);
  });

  it('drops both cascade triggers/functions and the new unique constraint', () => {
    expect(rollback).toMatch(/drop trigger if exists production_job_attempts_cascade_succeeded on production\.job_attempts/i);
    expect(rollback).toMatch(/drop function if exists production\.cascade_job_succeeded_from_attempt\(\)/i);
    expect(rollback).toMatch(/drop trigger if exists production_job_attempts_cascade_running on production\.job_attempts/i);
    expect(rollback).toMatch(/drop function if exists production\.cascade_job_running_from_attempt\(\)/i);
    expect(rollback).toMatch(/drop constraint if exists artifact_versions_unique_artifact_attempt/i);
  });

  it('touches neither identity, commerce, entitlement, nor knowledge', () => {
    expect(rollbackCode).not.toMatch(/identity\.\w|commerce\.\w|entitlement\.\w|knowledge\.\w|create table|drop schema/i);
  });
});

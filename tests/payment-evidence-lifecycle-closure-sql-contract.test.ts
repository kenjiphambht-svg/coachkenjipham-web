import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const sql = readFileSync(
  resolve(process.cwd(), 'supabase/migrations/20260813185043_launch_core_payment_evidence_lifecycle_closure.sql'),
  'utf8'
);
const rollback = readFileSync(
  resolve(process.cwd(), 'supabase/rollbacks/20260813185043_launch_core_payment_evidence_lifecycle_closure_down.sql'),
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

describe('WO-LAUNCH-CORE-03 lifecycle closure — does not rewrite any prior migration', () => {
  it('is additive-only: no new table/schema, only a new trigger/function', () => {
    expect(code).not.toMatch(/create table|drop table|create schema|drop schema|alter table/i);
  });
});

describe('creation-time bypass closed', () => {
  it('adds a BEFORE INSERT trigger that rejects any non-recorded initial verification_status', () => {
    const fn = code.split('create or replace function entitlement.reject_payment_evidence_initial_status')[1].split('revoke all on function')[0];
    expect(fn).toMatch(/NEW\.verification_status is distinct from 'recorded'/i);
    expect(fn).toMatch(/raise exception 'PAYMENT_EVIDENCE_MUST_START_RECORDED'/i);
  });

  it('wires the trigger to BEFORE INSERT on entitlement.payment_evidence', () => {
    expect(sql).toMatch(
      /create trigger payment_evidence_block_non_recorded_insert\s*before insert on entitlement\.payment_evidence\s*for each row execute function entitlement\.reject_payment_evidence_initial_status/i
    );
  });

  it('does not weaken or touch the existing controlled transition RPC or column-level UPDATE revoke', () => {
    expect(code).not.toMatch(/record_payment_evidence_verification|grant update.*verification_status|revoke update/i);
  });
});

describe('scoped rollback', () => {
  it('drops only the new trigger and function, nothing else', () => {
    expect(rollback).toMatch(/drop trigger if exists payment_evidence_block_non_recorded_insert on entitlement\.payment_evidence/i);
    expect(rollback).toMatch(/drop function if exists entitlement\.reject_payment_evidence_initial_status\(\)/i);
    expect(rollbackCode.trim().split('\n').filter((l) => l.trim().length > 0)).toHaveLength(2);
  });

  it('touches neither identity, commerce, nor knowledge', () => {
    expect(rollbackCode).not.toMatch(/identity\.\w|knowledge\.\w|commerce\.\w|create table|drop schema/i);
  });
});

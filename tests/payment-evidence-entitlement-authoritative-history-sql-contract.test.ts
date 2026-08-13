import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const sql = readFileSync(
  resolve(process.cwd(), 'supabase/migrations/20260813180023_launch_core_payment_evidence_entitlement_authoritative_history.sql'),
  'utf8'
);
const rollback = readFileSync(
  resolve(process.cwd(), 'supabase/rollbacks/20260813180023_launch_core_payment_evidence_entitlement_authoritative_history_down.sql'),
  'utf8'
);

// SQL escapes a literal single quote inside a string as '' — the naive
// [^']* pattern treats the first ' of that pair as the string terminator
// and then greedily consumes forward to the NEXT is '...'; it finds,
// swallowing real SQL in between (found live: a comment containing
// "grant''s" ate the entitlements_revocation_consistency constraint).
// (?:[^']|'')* correctly treats '' as an escaped quote, not a terminator.
const stripComments = (text: string) =>
  text
    .replace(/comment on [\s\S]*?is\s+'(?:[^']|'')*';/gi, '')
    .split('\n')
    .filter((line) => !line.trim().startsWith('--'))
    .join('\n');

const code = stripComments(sql);
const rollbackCode = stripComments(rollback);

describe('WO-LAUNCH-CORE-03 P07 round 2 — does not rewrite any prior migration', () => {
  it('is additive-only: no new table/schema drop, only function/constraint/grant replacement', () => {
    expect(code).not.toMatch(/create table|drop table|create schema|drop schema/i);
  });
});

describe('Outcome 1 — authorization coherence', () => {
  it('has_active_entitlement is rewritten in plpgsql with a caller-context coherence pre-check', () => {
    const fn = code.split('create or replace function entitlement.has_active_entitlement')[1].split('revoke all on function entitlement.has_active_entitlement')[0];
    expect(fn).toMatch(/language plpgsql/i);
  });

  it('rejects a supplied Journey that does not belong to the exact Person/Product, before consulting any grant', () => {
    const fn = code.split('create or replace function entitlement.has_active_entitlement')[1].split('revoke all on function entitlement.has_active_entitlement')[0];
    expect(fn).toMatch(/v_journey_person is null\s*or v_journey_person is distinct from p_person_id\s*or v_journey_product is distinct from p_product_id/i);
    expect(fn).toMatch(/return false/i);
  });

  it('rejects a supplied Version that does not belong to the exact Product', () => {
    const fn = code.split('create or replace function entitlement.has_active_entitlement')[1].split('revoke all on function entitlement.has_active_entitlement')[0];
    expect(fn).toMatch(/v_version_product is null or v_version_product is distinct from p_product_id/i);
  });

  it('still applies the original scope-matching rule after the coherence pre-check passes', () => {
    const fn = code.split('create or replace function entitlement.has_active_entitlement')[1].split('revoke all on function entitlement.has_active_entitlement')[0];
    expect(fn).toMatch(/journey_anchor_id is null or journey_anchor_id = p_journey_anchor_id/i);
    expect(fn).toMatch(/product_version_id is null or product_version_id = p_product_version_id/i);
  });
});

describe('Outcome 2 — revocation must always be explainable', () => {
  it('revoked status now requires revoke_source, not just revoked_at', () => {
    const constraint = code.split('add constraint entitlements_revocation_consistency check (')[1].split('comment on constraint')[0];
    expect(constraint).toMatch(/status = 'revoked' and revoked_at is not null and revoke_source is not null/i);
  });

  it('revoke_reason and revoke_evidence_id remain optional — a revocation is not required to be payment-related', () => {
    expect(sql).not.toMatch(/status = 'revoked'[\s\S]{0,120}revoke_reason is not null/i);
    expect(sql).not.toMatch(/status = 'revoked'[\s\S]{0,120}revoke_evidence_id is not null/i);
  });

  it('active status still forbids every revocation field from being set', () => {
    const constraint = code.split('add constraint entitlements_revocation_consistency check (')[1].split('comment on constraint')[0];
    expect(constraint).toMatch(/status = 'active'/i);
    expect(constraint).toMatch(/revoked_at is null/i);
    expect(constraint).toMatch(/revoke_reason is null/i);
    expect(constraint).toMatch(/revoke_source is null/i);
    expect(constraint).toMatch(/revoke_evidence_id is null/i);
  });
});

describe('Outcome 3 — authoritative, unfabricatable verification/audit history', () => {
  it('log_payment_evidence_verification_event is now SECURITY DEFINER', () => {
    const fn = code.split('create or replace function entitlement.log_payment_evidence_verification_event')[1].split('comment on function')[0];
    expect(fn).toMatch(/security definer/i);
  });

  it('revokes direct INSERT on payment_evidence_verification_events from service_role', () => {
    expect(sql).toMatch(/revoke insert on entitlement\.payment_evidence_verification_events from service_role/i);
  });

  it('(self-review) revokes direct INSERT on entitlement.audit_events from service_role, since its logger is already SECURITY DEFINER', () => {
    expect(sql).toMatch(/revoke insert on entitlement\.audit_events from service_role/i);
  });

  it('still only fires the verification-event log on an actual verification_status change', () => {
    const fn = code.split('create or replace function entitlement.log_payment_evidence_verification_event')[1].split('comment on function')[0];
    expect(fn).toMatch(/NEW\.verification_status is distinct from OLD\.verification_status/i);
  });
});

describe('scoped rollback', () => {
  it('re-grants direct INSERT on both tables and restores the non-SECURITY-DEFINER logger', () => {
    expect(rollback).toMatch(/grant insert on entitlement\.audit_events to service_role/i);
    expect(rollback).toMatch(/grant insert on entitlement\.payment_evidence_verification_events to service_role/i);
    const fn = rollbackCode.split('create or replace function entitlement.log_payment_evidence_verification_event')[1];
    expect(fn).not.toMatch(/security definer/i);
  });

  it('restores the pre-outcome-2 constraint (revoke_source optional)', () => {
    expect(rollbackCode).not.toMatch(/revoked_at is not null and revoke_source is not null/i);
    expect(rollback).toMatch(/status = 'revoked' and revoked_at is not null\)\s*or \(\s*status = 'active'/i);
  });

  it('restores has_active_entitlement to its plain-SQL, no-coherence-check body', () => {
    const fn = rollbackCode.split('create or replace function entitlement.has_active_entitlement')[1];
    expect(fn).toMatch(/language sql/i);
    expect(fn).not.toMatch(/v_journey_person/i);
  });

  it('touches neither identity, commerce table structure, nor knowledge', () => {
    expect(rollbackCode).not.toMatch(/identity\.\w|knowledge\.\w|create table|drop schema/i);
  });
});

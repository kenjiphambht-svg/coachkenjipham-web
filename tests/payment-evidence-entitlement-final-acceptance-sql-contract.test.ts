import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const sql = readFileSync(
  resolve(process.cwd(), 'supabase/migrations/20260813183452_launch_core_payment_evidence_entitlement_final_acceptance.sql'),
  'utf8'
);
const rollback = readFileSync(
  resolve(process.cwd(), 'supabase/rollbacks/20260813183452_launch_core_payment_evidence_entitlement_final_acceptance_down.sql'),
  'utf8'
);

// SQL escapes a literal single quote inside a string as '' — the naive
// [^']* pattern treats the first ' of that pair as the string terminator.
// (?:[^']|'')* correctly treats '' as an escaped quote, not a terminator.
const stripComments = (text: string) =>
  text
    .replace(/comment on [\s\S]*?is\s+'(?:[^']|'')*';/gi, '')
    .split('\n')
    .filter((line) => !line.trim().startsWith('--'))
    .join('\n');

const code = stripComments(sql);
const rollbackCode = stripComments(rollback);

describe('WO-LAUNCH-CORE-03 P07 round 3 — does not rewrite any prior migration', () => {
  it('is additive-only: no new table/schema drop', () => {
    expect(code).not.toMatch(/create table|drop table|create schema|drop schema/i);
  });
});

describe('Outcome 1 — caller-supplied Journey and Version must agree with each other', () => {
  it("compares the Journey's own pinned Version against the caller-supplied Version directly", () => {
    const fn = code.split('create or replace function entitlement.has_active_entitlement')[1].split('revoke all on function entitlement.has_active_entitlement')[0];
    expect(fn).toMatch(
      /v_journey_version is not null\s*and p_product_version_id is not null\s*and v_journey_version is distinct from p_product_version_id/i
    );
    expect(fn).toMatch(/return false/i);
  });

  it('still validates each individual belongs-to relationship first', () => {
    const fn = code.split('create or replace function entitlement.has_active_entitlement')[1].split('revoke all on function entitlement.has_active_entitlement')[0];
    expect(fn).toMatch(/v_journey_person is distinct from p_person_id/i);
    expect(fn).toMatch(/v_version_product is distinct from p_product_id/i);
  });
});

describe('Outcome 2 — revocation must answer WHEN + SOURCE + WHY', () => {
  it('revoked status now requires revoke_reason in addition to revoked_at and revoke_source', () => {
    const constraint = code.split('add constraint entitlements_revocation_consistency check (')[1].split('comment on constraint')[0];
    expect(constraint).toMatch(/status = 'revoked' and revoked_at is not null and revoke_source is not null and revoke_reason is not null/i);
  });

  it('revoke_evidence_id remains optional', () => {
    expect(sql).not.toMatch(/status = 'revoked'[\s\S]{0,150}revoke_evidence_id is not null/i);
  });

  it('active status still forbids every revocation field', () => {
    const constraint = code.split('add constraint entitlements_revocation_consistency check (')[1].split('comment on constraint')[0];
    expect(constraint).toMatch(/revoked_at is null/i);
    expect(constraint).toMatch(/revoke_reason is null/i);
    expect(constraint).toMatch(/revoke_source is null/i);
    expect(constraint).toMatch(/revoke_evidence_id is null/i);
  });
});

describe('Outcome 3 — verification transitions must carry truthful technical provenance', () => {
  it('adds a required transition_source_kind column reusing the existing source_kind vocabulary', () => {
    expect(sql).toMatch(/add column transition_source_kind text not null/i);
    const check = code.split('payment_evidence_verification_events_source_kind_check check (')[1].split(');')[0];
    expect(check).toMatch(/'manual_report', 'bank_statement', 'provider_webhook',\s*'provider_api_confirmation', 'admin_attestation'/i);
  });

  it('adds an optional, bounded transition_correlation_reference column', () => {
    expect(sql).toMatch(/add column transition_correlation_reference text/i);
    expect(sql).toMatch(/char_length\(transition_correlation_reference\) between 1 and 300/i);
  });

  it('revokes column-level UPDATE on verification_status by revoking all UPDATE and re-granting only superseded_by', () => {
    expect(sql).toMatch(/revoke update on entitlement\.payment_evidence from service_role/i);
    expect(sql).toMatch(/grant update \(superseded_by\) on entitlement\.payment_evidence to service_role/i);
  });

  it('introduces a SECURITY DEFINER controlled transition function requiring transition_source_kind', () => {
    const fn = code.split('create function entitlement.record_payment_evidence_verification')[1].split('comment on function')[0];
    expect(fn).toMatch(/security definer/i);
    expect(fn).toMatch(/if p_transition_source_kind is null then/i);
    expect(fn).toMatch(/raise exception 'PAYMENT_EVIDENCE_VERIFICATION_SOURCE_KIND_REQUIRED'/i);
  });

  it('grants execute on the controlled function to service_role only', () => {
    expect(sql).toMatch(/grant execute on function entitlement\.record_payment_evidence_verification\(uuid, text, text, text\) to service_role/i);
    expect(code).not.toMatch(/grant execute[\s\S]{0,200}record_payment_evidence_verification[\s\S]{0,80}to\s+(?:anon|authenticated)/i);
  });

  it('the logging trigger requires provenance and raises if missing (defense in depth)', () => {
    const fn = code.split('create or replace function entitlement.log_payment_evidence_verification_event')[1].split('comment on function')[0];
    expect(fn).toMatch(/if v_source_kind is null then/i);
    expect(fn).toMatch(/raise exception 'PAYMENT_EVIDENCE_VERIFICATION_PROVENANCE_REQUIRED'/i);
  });

  it('does not fabricate human actor identity — no actor_id/actor_type column added', () => {
    expect(code).not.toMatch(/add column actor_id|add column actor_type/i);
  });
});

describe('regression — prior WO-03 checks still present after this pass', () => {
  it('has_active_entitlement still enforces person/product/journey/version scope matching', () => {
    const fn = code.split('create or replace function entitlement.has_active_entitlement')[1].split('revoke all on function entitlement.has_active_entitlement')[0];
    expect(fn).toMatch(/journey_anchor_id is null or journey_anchor_id = p_journey_anchor_id/i);
    expect(fn).toMatch(/product_version_id is null or product_version_id = p_product_version_id/i);
  });

  it('does not touch identity, commerce table structure, or knowledge', () => {
    expect(code).not.toMatch(/create table identity\.|create table knowledge\.|create table commerce\./i);
  });

  it('never grants anon/authenticated any privilege', () => {
    expect(sql).not.toMatch(/grant\s+(?:select|insert|update|delete|usage|execute)[\s\S]*to\s+(?:anon|authenticated)/i);
  });
});

describe('scoped rollback', () => {
  it('restores full UPDATE grant and drops the controlled transition function', () => {
    expect(rollback).toMatch(/grant update on entitlement\.payment_evidence to service_role/i);
    expect(rollback).toMatch(/drop function if exists entitlement\.record_payment_evidence_verification\(uuid, text, text, text\)/i);
  });

  it('drops the new provenance columns and restores the non-provenance trigger', () => {
    expect(rollback).toMatch(/drop column if exists transition_correlation_reference/i);
    expect(rollback).toMatch(/drop column if exists transition_source_kind/i);
    const fn = rollbackCode.split('create or replace function entitlement.log_payment_evidence_verification_event')[1].split('alter table entitlement.payment_evidence_verification_events')[0];
    expect(fn).not.toMatch(/transition_source_kind/i);
  });

  it('restores revoke_reason as optional and drops the Journey-vs-Version coherence check', () => {
    expect(rollbackCode).not.toMatch(/revoke_source is not null and revoke_reason is not null/i);
    const fn = rollbackCode.split('create or replace function entitlement.has_active_entitlement')[1];
    expect(fn).not.toMatch(/v_journey_version/i);
  });

  it('touches neither identity, commerce table structure, nor knowledge', () => {
    expect(rollbackCode).not.toMatch(/identity\.\w|knowledge\.\w|create table|drop schema/i);
  });
});

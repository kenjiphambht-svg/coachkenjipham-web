import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const sql = readFileSync(
  resolve(process.cwd(), 'supabase/migrations/20260813165456_launch_core_payment_evidence_entitlement_hardening.sql'),
  'utf8'
);
const rollback = readFileSync(
  resolve(process.cwd(), 'supabase/rollbacks/20260813165456_launch_core_payment_evidence_entitlement_hardening_down.sql'),
  'utf8'
);
const baseline = readFileSync(
  resolve(process.cwd(), 'supabase/migrations/20260813135325_launch_core_payment_evidence_entitlement_foundation.sql'),
  'utf8'
);

const stripComments = (text: string) =>
  text
    .replace(/comment on [\s\S]*?is\s+'[^']*';/gi, '')
    .split('\n')
    .filter((line) => !line.trim().startsWith('--'))
    .join('\n');

const code = stripComments(sql);
const rollbackCode = stripComments(rollback);

describe('WO-LAUNCH-CORE-03 hardening — does not rewrite the applied migration', () => {
  it('is a separate, additive file — the original 20260813135325 migration is untouched', () => {
    expect(baseline).toMatch(/entitlements_revoked_requires_revoked_at/i);
    expect(baseline).toMatch(/where person_id = p_person_id\s*and product_id = p_product_id/i);
  });
});

describe('(A) Access scope — a scoped grant cannot silently authorize a different scope', () => {
  it('replaces has_active_entitlement with a 4-argument, scope-matching signature', () => {
    expect(sql).toMatch(/drop function if exists entitlement\.has_active_entitlement\(uuid, uuid\)/i);
    expect(sql).toMatch(
      /create function entitlement\.has_active_entitlement\(\s*p_person_id uuid,\s*p_product_id uuid,\s*p_journey_anchor_id uuid default null,\s*p_product_version_id uuid default null\s*\)/i
    );
  });

  it('a scoped Entitlement only matches an identical scope; an unscoped one matches any scope', () => {
    const fn = code.split('create function entitlement.has_active_entitlement')[1].split('revoke all on function entitlement.has_active_entitlement')[0];
    expect(fn).toMatch(/journey_anchor_id is null or journey_anchor_id = p_journey_anchor_id/i);
    expect(fn).toMatch(/product_version_id is null or product_version_id = p_product_version_id/i);
  });

  it('grants execute on the new signature to service_role only', () => {
    expect(sql).toMatch(/grant execute on function entitlement\.has_active_entitlement\(uuid, uuid, uuid, uuid\) to service_role/i);
    expect(code).not.toMatch(/grant execute[\s\S]{0,200}has_active_entitlement[\s\S]{0,80}to\s+(?:anon|authenticated)/i);
  });
});

describe('(B) Revocation consistency — active and revoked are mutually exclusive and complete', () => {
  it('drops the old asymmetric constraint and adds a symmetric one', () => {
    expect(sql).toMatch(/drop constraint entitlements_revoked_requires_revoked_at/i);
    expect(sql).toMatch(/add constraint entitlements_revocation_consistency check/i);
  });

  it('active status forbids every revocation provenance field from being set', () => {
    const constraint = code.split('add constraint entitlements_revocation_consistency check (')[1].split(');')[0];
    expect(constraint).toMatch(/status = 'active'/i);
    expect(constraint).toMatch(/revoked_at is null/i);
    expect(constraint).toMatch(/revoke_reason is null/i);
    expect(constraint).toMatch(/revoke_source is null/i);
    expect(constraint).toMatch(/revoke_evidence_id is null/i);
  });
});

describe('(C) Payment verification history — independently reconstructable lifecycle', () => {
  it('creates a dedicated insert-only verification-events table', () => {
    expect(sql).toMatch(/create table entitlement\.payment_evidence_verification_events/i);
    expect(sql).toMatch(/from_status text not null check \(from_status in \('recorded', 'verified', 'invalidated'\)\)/i);
    expect(sql).toMatch(/to_status text not null check \(to_status in \('recorded', 'verified', 'invalidated'\)\)/i);
  });

  it('is hard-blocked from update and delete, same as every other history table', () => {
    expect(sql).toMatch(
      /create trigger payment_evidence_verification_events_block_update\s*before update on entitlement\.payment_evidence_verification_events\s*for each row execute function entitlement\.reject_audit_mutation/i
    );
    expect(sql).toMatch(
      /create trigger payment_evidence_verification_events_block_delete\s*before delete on entitlement\.payment_evidence_verification_events\s*for each row execute function entitlement\.reject_audit_mutation/i
    );
  });

  it('is populated automatically only when verification_status actually changes', () => {
    const fn = code.split('create function entitlement.log_payment_evidence_verification_event')[1].split('revoke all on function entitlement.log_payment_evidence_verification_event')[0];
    expect(fn).toMatch(/NEW\.verification_status is distinct from OLD\.verification_status/i);
    expect(fn).toMatch(/insert into entitlement\.payment_evidence_verification_events/i);
    expect(fn).toMatch(/OLD\.verification_status, NEW\.verification_status/i);
    expect(sql).toMatch(
      /create trigger payment_evidence_log_verification_event\s*after update on entitlement\.payment_evidence\s*for each row execute function entitlement\.log_payment_evidence_verification_event/i
    );
  });

  it('enables and forces RLS, and grants only select+insert (no update/delete) to service_role', () => {
    expect(sql).toMatch(/alter table entitlement\.payment_evidence_verification_events enable row level security/i);
    expect(sql).toMatch(/alter table entitlement\.payment_evidence_verification_events force row level security/i);
    expect(sql).toMatch(/grant select, insert on entitlement\.payment_evidence_verification_events to service_role/i);
    expect(code).not.toMatch(/grant[\s\S]{0,120}update[\s\S]{0,80}payment_evidence_verification_events/i);
  });
});

describe('(D) External event deduplication — canonical identity, not over-constrained', () => {
  it('adds a partial unique index on (provider_key, external_reference)', () => {
    expect(sql).toMatch(
      /create unique index payment_evidence_external_identity_idx\s*on entitlement\.payment_evidence\(provider_key, external_reference\)\s*where provider_key is not null and external_reference is not null/i
    );
  });
});

describe('(E) Cross-reference consistency', () => {
  it('(E1/E2) validate_entitlement_scope now cross-checks product_version_id against the Journey and Order it is pinned to', () => {
    const fn = code.split('create or replace function entitlement.validate_entitlement_scope')[1].split('revoke all on function entitlement.validate_entitlement_scope')[0];
    expect(fn).toMatch(/raise exception 'ENTITLEMENT_JOURNEY_VERSION_MISMATCH'/i);
    expect(fn).toMatch(/raise exception 'ENTITLEMENT_ORDER_VERSION_MISMATCH'/i);
  });

  it('(E3) a supersession must point to evidence belonging to the same Order', () => {
    const fn = code.split('create or replace function entitlement.reject_payment_evidence_rewrite')[1];
    expect(fn).toMatch(/raise exception 'PAYMENT_EVIDENCE_SUPERSEDED_BY_NOT_FOUND'/i);
    expect(fn).toMatch(/raise exception 'PAYMENT_EVIDENCE_SUPERSEDED_BY_ORDER_MISMATCH'/i);
  });

  it('(E4) a supersession chain cannot form a cycle', () => {
    const fn = code.split('create or replace function entitlement.reject_payment_evidence_rewrite')[1];
    expect(fn).toMatch(/raise exception 'PAYMENT_EVIDENCE_SUPERSEDED_BY_CYCLE'/i);
    expect(fn).toMatch(/raise exception 'PAYMENT_EVIDENCE_SUPERSEDED_BY_CHAIN_TOO_DEEP'/i);
  });

  it('(self-review) a revoke_evidence_id must belong to the same Order as the Entitlement it revokes', () => {
    const fn = code.split('create or replace function entitlement.reject_entitlement_rewrite')[1];
    expect(fn).toMatch(/raise exception 'ENTITLEMENT_REVOKE_EVIDENCE_ORDER_MISMATCH'/i);
  });

  it('the revoke_evidence_id check does not fire when the Entitlement has no Order context', () => {
    const fn = code.split('create or replace function entitlement.reject_entitlement_rewrite')[1];
    expect(fn).toMatch(/NEW\.revoke_evidence_id is not null\s*and OLD\.revoke_evidence_id is null\s*and NEW\.order_id is not null/i);
  });
});

describe('regression — every WO-03 baseline lock survives the hardening pass', () => {
  it('reject_payment_evidence_rewrite still locks every factual field and the one-directional lifecycle', () => {
    const fn = code.split('create or replace function entitlement.reject_payment_evidence_rewrite')[1];
    for (const field of ['order_id', 'source_kind', 'provider_key', 'external_reference', 'idempotency_key', 'observed_at', 'recorded_at', 'amount', 'currency', 'payload_digest', 'metadata']) {
      expect(fn).toMatch(new RegExp(`NEW\\.${field} is distinct from OLD\\.${field}`, 'i'));
    }
    expect(fn).toMatch(/PAYMENT_EVIDENCE_INVALIDATED_TERMINAL/i);
    expect(fn).toMatch(/PAYMENT_EVIDENCE_STATUS_CANNOT_REVERT/i);
    expect(fn).toMatch(/PAYMENT_EVIDENCE_SUPERSEDED_BY_IMMUTABLE/i);
  });

  it('reject_entitlement_rewrite still locks grant scope and seals revocation provenance', () => {
    const fn = code.split('create or replace function entitlement.reject_entitlement_rewrite')[1];
    for (const field of ['person_id', 'product_id', 'product_version_id', 'journey_anchor_id', 'order_id', 'grant_key', 'valid_from', 'valid_until']) {
      expect(fn).toMatch(new RegExp(`NEW\\.${field} is distinct from OLD\\.${field}`, 'i'));
    }
    expect(fn).toMatch(/ENTITLEMENT_CANNOT_UNREVOKE/i);
    expect(fn).toMatch(/ENTITLEMENT_REVOCATION_RECORD_IMMUTABLE/i);
  });

  it('validate_entitlement_scope still rejects a not-found or mismatched Journey/Order', () => {
    const fn = code.split('create or replace function entitlement.validate_entitlement_scope')[1].split('revoke all on function entitlement.validate_entitlement_scope')[0];
    expect(fn).toMatch(/ENTITLEMENT_JOURNEY_NOT_FOUND/i);
    expect(fn).toMatch(/ENTITLEMENT_JOURNEY_SCOPE_MISMATCH/i);
    expect(fn).toMatch(/ENTITLEMENT_ORDER_NOT_FOUND/i);
    expect(fn).toMatch(/ENTITLEMENT_ORDER_SCOPE_MISMATCH/i);
  });

  it('does not touch identity, commerce tables, or knowledge — only entitlement-schema objects and function bodies', () => {
    expect(code).not.toMatch(/create table identity\.|create table knowledge\.|create table commerce\./i);
    expect(code).not.toMatch(/alter table commerce\.(?!orders|product_journey_anchors)/i);
  });

  it('never grants ordinary DELETE and never grants anon/authenticated anything', () => {
    expect(code).not.toMatch(/grant[\s\S]{0,200}delete[\s\S]{0,80}to service_role/i);
    expect(sql).not.toMatch(/grant\s+(?:select|insert|update|delete|usage|execute)[\s\S]*to\s+(?:anon|authenticated)/i);
  });

  it('does not build Stripe, checkout, refund, tax, discount, or provider activation, and does not auto-grant Entitlement from Payment Evidence', () => {
    expect(code).not.toMatch(/stripe|checkout|refund|discount|tax_rate|provider_activation/i);
    expect(code).not.toMatch(/insert into entitlement\.entitlements/i);
  });
});

describe('scoped rollback', () => {
  it('restores the pre-hardening has_active_entitlement 2-argument signature and drops the 4-argument one', () => {
    expect(rollback).toMatch(/drop function if exists entitlement\.has_active_entitlement\(uuid, uuid, uuid, uuid\)/i);
    expect(rollback).toMatch(/create or replace function entitlement\.has_active_entitlement\(p_person_id uuid, p_product_id uuid\)/i);
  });

  it('restores the original asymmetric revocation constraint', () => {
    expect(rollback).toMatch(/drop constraint if exists entitlements_revocation_consistency/i);
    expect(rollback).toMatch(/add constraint entitlements_revoked_requires_revoked_at check/i);
  });

  it('drops the verification-events table and its trigger/function', () => {
    expect(rollback).toMatch(/drop trigger if exists payment_evidence_log_verification_event on entitlement\.payment_evidence/i);
    expect(rollback).toMatch(/drop function if exists entitlement\.log_payment_evidence_verification_event\(\)/i);
    expect(rollback).toMatch(/drop table if exists entitlement\.payment_evidence_verification_events/i);
  });

  it('drops the external-identity dedup index', () => {
    expect(rollback).toMatch(/drop index if exists entitlement\.payment_evidence_external_identity_idx/i);
  });

  it('restores validate_entitlement_scope and reject_payment_evidence_rewrite to bodies with no E1-E4 checks', () => {
    expect(rollbackCode).not.toMatch(/ENTITLEMENT_JOURNEY_VERSION_MISMATCH|ENTITLEMENT_ORDER_VERSION_MISMATCH/i);
    expect(rollbackCode).not.toMatch(/PAYMENT_EVIDENCE_SUPERSEDED_BY_CYCLE|PAYMENT_EVIDENCE_SUPERSEDED_BY_ORDER_MISMATCH/i);
    expect(rollbackCode).not.toMatch(/ENTITLEMENT_REVOKE_EVIDENCE_ORDER_MISMATCH/i);
  });

  it('touches neither identity, commerce table structure, nor knowledge', () => {
    expect(rollbackCode).not.toMatch(/identity\.\w|knowledge\.\w|create table commerce\.|drop schema/i);
  });
});

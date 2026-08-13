import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const sql = readFileSync(
  resolve(process.cwd(), 'supabase/migrations/20260813135325_launch_core_payment_evidence_entitlement_foundation.sql'),
  'utf8'
);
const rollback = readFileSync(
  resolve(process.cwd(), 'supabase/rollbacks/20260813135325_launch_core_payment_evidence_entitlement_foundation_down.sql'),
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

describe('WO-LAUNCH-CORE-03 — schema contract', () => {
  it('creates a dedicated entitlement schema with the three required tables plus read model', () => {
    expect(sql).toMatch(/create schema if not exists entitlement/i);
    expect(sql).toMatch(/create table entitlement\.payment_evidence/i);
    expect(sql).toMatch(/create table entitlement\.entitlements/i);
    expect(sql).toMatch(/create table entitlement\.audit_events/i);
    expect(sql).toMatch(/create view entitlement\.entitlement_access/i);
    expect(sql).toMatch(/create or replace function entitlement\.has_active_entitlement/i);
  });

  it('does not build Stripe, checkout, refund, tax, discount, or provider activation', () => {
    expect(code).not.toMatch(/stripe|checkout|refund|discount|tax_rate|provider_activation/i);
  });

  it('never automatically grants an entitlement from payment evidence — no trigger on payment_evidence inserts into entitlements', () => {
    const evidenceBlock = code.split('create table entitlement.payment_evidence')[1].split('create table entitlement.entitlements')[0];
    expect(evidenceBlock).not.toMatch(/insert into entitlement\.entitlements/i);
  });
});

describe('(A) Payment Evidence — factual, provider-neutral, history-preserving', () => {
  it('has a strong FK to commerce.orders and a unique idempotency key', () => {
    expect(sql).toMatch(/order_id uuid not null references commerce\.orders\(id\) on delete restrict/i);
    expect(sql).toMatch(/idempotency_key text not null unique/i);
  });

  it('constrains source_kind to a factual enum, not a business/provider list', () => {
    expect(sql).toMatch(
      /source_kind text not null check \(source_kind in \(\s*'manual_report', 'bank_statement', 'provider_webhook',\s*'provider_api_confirmation', 'admin_attestation'/i
    );
  });

  it('never stores a raw secret/token or full raw provider payload; only a bounded pointer/digest', () => {
    expect(code).not.toMatch(/api_key|access_token|refresh_token|client_secret|private_key|password|raw_payload/i);
    expect(sql).toMatch(/payload_digest text check/i);
    expect(sql).toMatch(/payment_evidence_metadata_bounded check \(octet_length\(metadata::text\) <= 4000\)/i);
  });

  it('treats amount/currency as factual evidence only, paired together, never a price rule', () => {
    expect(sql).toMatch(/amount numeric\(12, 2\) check \(amount is null or amount >= 0\)/i);
    expect(sql).toMatch(/currency text check \(currency is null or currency ~ '\^\[A-Z\]\{3\}\$'\)/i);
    expect(sql).toMatch(/payment_evidence_amount_currency_pair check \(\(amount is null\) = \(currency is null\)\)/i);
  });

  it('locks every factual field immutable and only allows a one-directional verification lifecycle', () => {
    const fn = code.split('function entitlement.reject_payment_evidence_rewrite')[1].split('revoke all on function entitlement.reject_payment_evidence_rewrite')[0];
    for (const field of ['order_id', 'source_kind', 'provider_key', 'external_reference', 'idempotency_key', 'observed_at', 'recorded_at', 'amount', 'currency', 'payload_digest', 'metadata']) {
      expect(fn).toMatch(new RegExp(`NEW\\.${field} is distinct from OLD\\.${field}`, 'i'));
    }
    expect(fn).toMatch(/PAYMENT_EVIDENCE_INVALIDATED_TERMINAL/i);
    expect(fn).toMatch(/PAYMENT_EVIDENCE_STATUS_CANNOT_REVERT/i);
    expect(fn).toMatch(/PAYMENT_EVIDENCE_SUPERSEDED_BY_IMMUTABLE/i);
  });

  it('a correction is a new row via superseded_by, not an edit — superseded requires invalidated', () => {
    expect(sql).toMatch(
      /payment_evidence_superseded_requires_invalidated check \(\s*superseded_by is null or verification_status = 'invalidated'\s*\)/i
    );
    expect(sql).toMatch(/payment_evidence_no_self_supersede check \(superseded_by is distinct from id\)/i);
  });

  it('is hard-blocked from delete, in addition to holding no DELETE grant', () => {
    expect(sql).toMatch(/create trigger payment_evidence_block_delete\s*before delete on entitlement\.payment_evidence/i);
  });

  it('audits every insert and update', () => {
    expect(sql).toMatch(/create trigger payment_evidence_audit\s*after insert or update on entitlement\.payment_evidence/i);
  });
});

describe('(B) Entitlement — canonical access-right truth', () => {
  it('requires a strong FK grantee and product scope, not a weak generic resource_type/resource_id', () => {
    expect(sql).toMatch(/person_id uuid not null references identity\.persons\(id\) on delete restrict/i);
    expect(sql).toMatch(/product_id uuid not null references commerce\.products\(id\) on delete restrict/i);
    expect(code).not.toMatch(/resource_type|resource_id/i);
  });

  it('links Product Version/Journey/Order only as optional, technically meaningful references', () => {
    expect(sql).toMatch(/product_version_id uuid references commerce\.product_versions\(id\) on delete restrict/i);
    expect(sql).toMatch(/journey_anchor_id uuid references commerce\.product_journey_anchors\(id\) on delete restrict/i);
    expect(sql).toMatch(/order_id uuid references commerce\.orders\(id\) on delete restrict/i);
  });

  it('validates journey/order scope actually matches the granted person+product', () => {
    expect(sql).toMatch(/create or replace function entitlement\.validate_entitlement_scope/i);
    expect(sql).toMatch(/raise exception 'ENTITLEMENT_JOURNEY_SCOPE_MISMATCH'/i);
    expect(sql).toMatch(/raise exception 'ENTITLEMENT_ORDER_SCOPE_MISMATCH'/i);
    expect(sql).toMatch(/create trigger entitlements_validate_scope\s*before insert on entitlement\.entitlements/i);
  });

  it('is idempotent via a unique grant_key', () => {
    expect(sql).toMatch(/grant_key text not null unique/i);
  });

  it('locks grant scope immutable and allows only one-directional active -> revoked', () => {
    const fn = code.split('function entitlement.reject_entitlement_rewrite')[1].split('revoke all on function entitlement.reject_entitlement_rewrite')[0];
    for (const field of ['person_id', 'product_id', 'product_version_id', 'journey_anchor_id', 'order_id', 'grant_key', 'valid_from', 'valid_until']) {
      expect(fn).toMatch(new RegExp(`NEW\\.${field} is distinct from OLD\\.${field}`, 'i'));
    }
    expect(fn).toMatch(/ENTITLEMENT_CANNOT_UNREVOKE/i);
    expect(fn).toMatch(/ENTITLEMENT_REVOCATION_RECORD_IMMUTABLE/i);
  });

  it('is hard-blocked from delete — entitlement history cannot be hard-deleted', () => {
    expect(sql).toMatch(/create trigger entitlements_block_delete\s*before delete on entitlement\.entitlements/i);
  });

  it('computes active access from the time boundary at read time, fail-closed by construction', () => {
    const view = code.split('create view entitlement.entitlement_access')[1].split('revoke all on entitlement.entitlement_access')[0];
    expect(view).toMatch(/status = 'active'/i);
    expect(view).toMatch(/valid_from <= now\(\)/i);
    expect(view).toMatch(/valid_until is null or e\.valid_until > now\(\)/i);
  });

  it('has_active_entitlement is scoped to the exact person+product pair, no wildcard match', () => {
    const fn = code.split('function entitlement.has_active_entitlement')[1].split('revoke all on function entitlement.has_active_entitlement')[0];
    expect(fn).toMatch(/where person_id = p_person_id\s*and product_id = p_product_id/i);
  });
});

describe('(C) Product & Services read model extension — no revenue/profit/refund metric', () => {
  it('extends product_summary with only the two approved counts', () => {
    expect(sql).toMatch(/orders_with_verified_payment_evidence_count/i);
    expect(sql).toMatch(/active_entitlement_count/i);
    expect(code).not.toMatch(/revenue|profit|paid_count|conversion/i);
  });

  it('only counts verified, non-superseded payment evidence toward the verified-orders count', () => {
    const cte = code.split('left join lateral')[1].split('on true')[0];
    expect(cte).toMatch(/pe\.verification_status = 'verified'/i);
    expect(cte).toMatch(/pe\.superseded_by is null/i);
  });

  it('only counts currently-active (non-expired, non-revoked) entitlements', () => {
    const join = code.split('left join entitlement.entitlements active_ent')[1].split('group by')[0];
    expect(join).toMatch(/active_ent\.status = 'active'/i);
    expect(join).toMatch(/active_ent\.valid_until is null or active_ent\.valid_until > now\(\)/i);
  });

  it('remains service_role only, never exposed to a browser role', () => {
    expect(sql).toMatch(/revoke all on commerce\.product_summary from public, anon, authenticated/i);
    expect(sql).toMatch(/grant select on commerce\.product_summary to service_role/i);
  });
});

describe('security contract', () => {
  it('enables and forces RLS on every table', () => {
    for (const table of ['entitlement.payment_evidence', 'entitlement.entitlements', 'entitlement.audit_events']) {
      expect(sql).toMatch(new RegExp(`alter table ${table.replace('.', '\\.')} enable row level security`, 'i'));
      expect(sql).toMatch(new RegExp(`alter table ${table.replace('.', '\\.')} force row level security`, 'i'));
    }
  });

  it('never grants anon or authenticated any privilege in the entitlement schema', () => {
    expect(sql).not.toMatch(/grant\s+(?:select|insert|update|delete|usage|execute)[\s\S]*to\s+(?:anon|authenticated)/i);
    expect(sql).toMatch(/revoke all on schema entitlement from public, anon, authenticated/i);
  });

  it('never grants ordinary DELETE anywhere in this migration', () => {
    expect(sql).not.toMatch(/grant[\s\S]{0,200}delete[\s\S]{0,80}to service_role/i);
  });

  it('does not modify identity, knowledge, or any of the nine already-applied migration objects beyond replacing the product_summary view', () => {
    expect(code).not.toMatch(/alter table identity\.|alter table knowledge\.|create table identity\.|create table knowledge\./i);
    expect(code).not.toMatch(/alter table commerce\./i);
  });
});

describe('scoped rollback', () => {
  it('restores commerce.product_summary to the exact pre-WO-03 definition before dropping the schema', () => {
    expect(rollback).toMatch(/create or replace view commerce\.product_summary/i);
    expect(rollback).not.toMatch(/orders_with_verified_payment_evidence_count|active_entitlement_count/i);
    const dropIndex = rollback.indexOf('drop schema if exists entitlement cascade');
    const viewIndex = rollback.indexOf('create or replace view commerce.product_summary');
    expect(viewIndex).toBeGreaterThan(-1);
    expect(dropIndex).toBeGreaterThan(viewIndex);
  });

  it('drops only the entitlement schema, touching neither identity nor knowledge', () => {
    expect(rollback).toMatch(/drop schema if exists entitlement cascade/i);
    expect(rollbackCode).not.toMatch(/identity\.\w|knowledge\.\w|drop schema (?!if exists entitlement)/i);
  });
});

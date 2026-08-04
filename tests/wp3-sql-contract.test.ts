import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const sql = readFileSync(resolve(process.cwd(), 'supabase/migrations/0022_wp3_launch_core_foundation.sql'), 'utf8');
const langPaymentSql = readFileSync(
  resolve(process.cwd(), 'supabase/migrations/0023_wp3_lang_payment_snapshot_and_confirmation.sql'),
  'utf8'
);
const publicationSql = readFileSync(
  resolve(process.cwd(), 'supabase/migrations/0024_wp3_publication_approval_and_entitlement.sql'),
  'utf8'
);
const lintRepairSql = readFileSync(
  resolve(process.cwd(), 'supabase/migrations/0025_wp3_fix_publication_function_lint.sql'),
  'utf8'
);

describe('WP3 database contracts', () => {
  it('extends existing product records rather than duplicating order/payment foundations', () => {
    expect(sql).toMatch(/references lang_applications|references hatmam_orders|references publications/i);
    expect(sql).toMatch(/create table product_entitlements/i);
    expect(sql).toMatch(/create table publication_versions/i);
  });

  it('keeps RLS deny-by-default and provider/public flags off', () => {
    expect(sql).toMatch(/enable row level security/i);
    expect(sql).toMatch(/revoke all .* from anon, authenticated/is);
    expect(sql).toMatch(/constraint launch_core_flags_off check \(enabled = false\)/i);
  });

  it('prevents receipt reuse and records immutable approval prerequisites', () => {
    expect(sql).toMatch(/evidence_sha256 text not null unique/i);
    expect(sql).toMatch(/unique\(subject, subject_id\)/i);
    expect(sql).toMatch(/publication_version_approval check/i);
  });

  it('snapshots Lặng pricing from the active settings and makes the snapshot immutable', () => {
    expect(langPaymentSql).toMatch(/create table lang_order_snapshots/i);
    expect(langPaymentSql).toMatch(/operational_settings_versions where active = true for update/i);
    expect(langPaymentSql).toMatch(/values#>>'\{lang,priceVnd\}'/i);
    expect(langPaymentSql).toMatch(/LANG_ORDER_SNAPSHOT_IMMUTABLE/);
    expect(langPaymentSql).toMatch(/enable row level security/i);
  });

  it('confirms Lặng payment atomically only with matching report, evidence, snapshot and active Admin', () => {
    expect(langPaymentSql).toMatch(/confirm_lang_payment_with_evidence/i);
    expect(langPaymentSql).toMatch(/lang_applications where id = p_application_id for update/i);
    expect(langPaymentSql).toMatch(/lang_payment_requests where application_id = p_application_id for update/i);
    expect(langPaymentSql).toMatch(/lang_payment_evidence where payment_request_id = v_request.id for update/i);
    expect(langPaymentSql).toMatch(/v_evidence\.reported_amount_vnd <> v_snapshot\.amount_vnd/i);
    expect(langPaymentSql).toMatch(/v_evidence\.transfer_reference <> v_request\.report_reference/i);
    expect(langPaymentSql).toMatch(/PAYMENT_EVIDENCE_INVALID/);
    expect(langPaymentSql).toMatch(/payment_confirmation_idempotent/);
    expect(langPaymentSql).toMatch(/payment_confirmations\(payment_id, subject, subject_id, evidence_sha256/i);
  });

  it('requires Founder/Admin approval before an Hạt Mầm entitlement and keeps approved versions immutable', () => {
    expect(publicationSql).toMatch(/APPROVED_PUBLICATION_IMMUTABLE/);
    expect(publicationSql).toMatch(/review_hatmam_publication_version/i);
    expect(publicationSql).toMatch(/PUBLICATION_NOT_APPROVED/);
    expect(publicationSql).toMatch(/grant_hatmam_approved_entitlement/i);
    expect(publicationSql).toMatch(/customer_identities where id = p_customer_identity_id for update/i);
    expect(publicationSql).toMatch(/private-storage, Auth or release gates/i);
    expect(publicationSql).toMatch(/to service_role/);
  });

  it('uses a forward-only lint repair that keeps version creation serialized without an ambiguous aggregate', () => {
    expect(lintRepairSql).toMatch(/max\(pv\.version_number\)/i);
    expect(lintRepairSql).not.toMatch(/max\(version_number\)/i);
    expect(lintRepairSql).not.toMatch(/v_existing_confirmation/);
    expect(lintRepairSql).toMatch(/only function definitions/i);
  });
});

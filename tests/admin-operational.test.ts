import { describe, expect, it } from 'vitest';

import {
  BOOKING_DEFAULTS,
  buildHatMamStates,
  buildLangSupportSummary,
  buildReceiptPreview,
  isHatMamPaymentEvidenceEligible,
  isHm02Package,
} from '@/lib/admin/operational';

describe('Admin operating fixtures and safety', () => {
  it('keeps the AI summary as decision support, not a decision', () => {
    const summary = buildLangSupportSummary({
      order_code: 'LANG-SYNTHETIC-01',
      status: 'under_review',
      target_session_month: null,
      q2_level: 'B',
      q3_prior_help: 'A',
      q4_want: 'Muốn nhìn rõ chuyện đang diễn ra.',
      q5_openness: 'B',
      q6_extra: 'Dữ liệu thử.',
    });
    expect(summary.limitation).toMatch(/không được phê duyệt, từ chối, chẩn đoán/i);
    expect(summary.operatorNote).toMatch(/Kenji/i);
  });

  it('creates a synthetic receipt with no account number or personal name', () => {
    const receipt = buildReceiptPreview('hatmam', 'HM-SYNTHETIC-01', 2_000_000);
    expect(receipt.transferReference).toBe('HATMAM HM-SYNTHETIC-01');
    expect(JSON.stringify(receipt)).not.toMatch(/Pham Duc Tuan|[0-9]{8,}/i);
  });

  it('marks real delivery as blocked while B4 remains open', () => {
    const states = buildHatMamStates('in_production');
    expect(states.find((state) => state.label === 'Delivery bị B4 chặn')?.state).toBe('blocked');
    expect(states.find((state) => state.label === 'Chờ Kenji duyệt')?.state).toBe('pending');
  });

  it('keeps the approved booking defaults', () => {
    expect(BOOKING_DEFAULTS.sessionDurationMinutes).toBe(90);
    expect(BOOKING_DEFAULTS.minNoticeHours).toBe(48);
    expect(BOOKING_DEFAULTS.hardMonthlyCapacity).toBe(5);
  });

  it('maps the staging-safe legacy synthetic package code to HM-02 presentation', () => {
    expect(isHm02Package('goi-2')).toBe(true);
    expect(isHm02Package('goi-1')).toBe(false);
  });

  it('requires reported receipt evidence to match the immutable package snapshot before confirmation', () => {
    const base = {
      expectedAmountVnd: 2_000_000,
      expectedReference: 'HATMAM HATMAM-TEST01',
      paymentRequest: { reported_transfer_at: '2026-08-04T01:00:00Z', revoked_at: null, report_reference: 'HATMAM HATMAM-TEST01' },
      evidence: { receipt_sha256: 'a'.repeat(64), reported_amount_vnd: 2_000_000, transfer_reference: 'HATMAM HATMAM-TEST01' },
    };
    expect(isHatMamPaymentEvidenceEligible(base)).toBe(true);
    expect(isHatMamPaymentEvidenceEligible({ ...base, evidence: { ...base.evidence, reported_amount_vnd: 3_500_000 } })).toBe(false);
    expect(isHatMamPaymentEvidenceEligible({ ...base, paymentRequest: { ...base.paymentRequest, revoked_at: '2026-08-04T02:00:00Z' } })).toBe(false);
  });
});

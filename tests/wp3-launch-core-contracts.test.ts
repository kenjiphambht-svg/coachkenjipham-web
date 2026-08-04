import { describe, expect, it } from 'vitest';

import { DomainError } from '@/lib/domain/errors';
import { assertPaymentConfirmationEligible, buildPrivateObjectPath, canAccessPrivateReadingRoom, launchCoreFlagState, planDeletion } from '@/lib/launch-core/contracts';

const validEvidence = {
  requestId: 'req-1', requestState: 'under_review' as const, reportedAt: '2026-08-04T00:00:00Z', revokedAt: null,
  expectedAmountVnd: 2_000_000, reportedAmountVnd: 2_000_000, expectedReference: 'HATMAM HM-018',
  reportedReference: 'HATMAM HM-018', evidenceReference: 'HATMAM HM-018', evidenceSha256: 'a'.repeat(64),
};

describe('WP3 Launch Core contracts', () => {
  it('treats payment report as distinct from atomic payment confirmation prerequisites', () => {
    expect(assertPaymentConfirmationEligible(validEvidence)).toEqual({ requestId: 'req-1', evidenceSha256: 'a'.repeat(64) });
    expect(() => assertPaymentConfirmationEligible({ ...validEvidence, reportedAmountVnd: 1 })).toThrowError(DomainError);
    expect(() => assertPaymentConfirmationEligible({ ...validEvidence, requestState: 'revoked' })).toThrowError(DomainError);
    expect(() => assertPaymentConfirmationEligible({ ...validEvidence, evidenceReference: 'OTHER' })).toThrowError(DomainError);
  });

  it('denies cross-customer, revoked and expired reading-room access', () => {
    expect(canAccessPrivateReadingRoom({ verifiedIdentity: true, entitlementStatus: 'active', expiresAt: null })).toBe(true);
    expect(canAccessPrivateReadingRoom({ verifiedIdentity: false, entitlementStatus: 'active', expiresAt: null })).toBe(false);
    expect(canAccessPrivateReadingRoom({ verifiedIdentity: true, entitlementStatus: 'revoked', expiresAt: null })).toBe(false);
    expect(canAccessPrivateReadingRoom({ verifiedIdentity: true, entitlementStatus: 'active', expiresAt: '2020-01-01T00:00:00Z' })).toBe(false);
  });

  it('uses safe code-only object paths and blocks metadata-first deletion', () => {
    expect(buildPrivateObjectPath({ productCode: 'hatmam', orderCode: 'HM-018', publicationCode: 'PUB-HM-018', version: 2 })).toBe('essence/hatmam/HM-018/PUB-HM-018/v2/a5.pdf');
    expect(() => buildPrivateObjectPath({ productCode: 'hatmam', orderCode: 'bé-An', publicationCode: 'PUB-1', version: 1 })).toThrowError(DomainError);
    expect(() => planDeletion({ privateObjectDeleted: false, metadataDeleted: true })).toThrowError(DomainError);
    expect(planDeletion({ privateObjectDeleted: false, metadataDeleted: false }).status).toBe('blocked_object_deletion');
  });

  it('keeps every release/provider flag fail-closed by default', () => {
    expect(Object.values(launchCoreFlagState({})).every((value) => value === false)).toBe(true);
  });
});

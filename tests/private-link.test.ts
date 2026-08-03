import { describe, expect, it } from 'vitest';

import { createPrivateLinkSecret, hashPrivateLinkToken, isPrivateLinkActive } from '@/lib/security/private-link';

describe('private Lặng links', () => {
  it('creates a 256-bit raw secret but exposes a SHA-256 database value', () => {
    const secret = createPrivateLinkSecret(new Date('2026-08-03T00:00:00.000Z'));
    expect(secret.rawToken).toHaveLength(43);
    expect(secret.tokenHash).toMatch(/^[a-f0-9]{64}$/);
    expect(secret.tokenHash).toBe(hashPrivateLinkToken(secret.rawToken));
    expect(secret.expiresAt).toBe('2026-08-04T00:00:00.000Z');
  });

  it('rejects expired, revoked and consumed links', () => {
    const now = new Date('2026-08-03T12:00:00.000Z');
    expect(isPrivateLinkActive({ expiresAt: '2026-08-03T12:00:01.000Z' }, now)).toBe(true);
    expect(isPrivateLinkActive({ expiresAt: '2026-08-03T12:00:00.000Z' }, now)).toBe(false);
    expect(isPrivateLinkActive({ expiresAt: '2026-08-04T00:00:00.000Z', revokedAt: now.toISOString() }, now)).toBe(false);
    expect(isPrivateLinkActive({ expiresAt: '2026-08-04T00:00:00.000Z', usedAt: now.toISOString() }, now)).toBe(false);
  });
});

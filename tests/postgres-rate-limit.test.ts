import { describe, expect, it } from 'vitest';

import { hashRateLimitKey } from '@/lib/security/rate-limit';

describe('Postgres rate-limit key', () => {
  it('chỉ đưa SHA-256 fingerprint vào database', () => {
    const rawIp = '203.0.113.42';
    const hash = hashRateLimitKey(rawIp);

    expect(hash).toMatch(/^[a-f0-9]{64}$/);
    expect(hash).not.toContain(rawIp);
    expect(hash).toBe(hashRateLimitKey(rawIp));
    expect(hash).not.toBe(hashRateLimitKey('203.0.113.43'));
  });
});

import { describe, expect, it } from 'vitest';

import {
  hashIdempotencyKey,
  hashRequestPayload,
  requireIdempotencyKey,
} from '@/lib/security/idempotency';
import { DomainError } from '@/lib/domain/errors';

describe('idempotency key', () => {
  const key = 'm9bYEN7p4cV2qL0x_123';

  it('chỉ lưu hash, không lưu raw key', () => {
    const hash = hashIdempotencyKey(key);
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
    expect(hash).not.toContain(key);
    expect(hash).toBe(hashIdempotencyKey(key));
  });

  it('từ chối key ngắn, mảng header hoặc ký tự lạ', () => {
    for (const value of ['short', 'dấu cách không hợp lệ', ['a'.repeat(20)]]) {
      expect(() => requireIdempotencyKey(value)).toThrowError(DomainError);
    }
  });

  it('phân biệt payload khác nhau', () => {
    expect(hashRequestPayload({ name: 'A', message: 'x' })).not.toBe(
      hashRequestPayload({ name: 'A', message: 'y' })
    );
  });
});

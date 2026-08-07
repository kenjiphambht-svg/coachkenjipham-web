import { describe, expect, it } from 'vitest';

import {
  PRIVATE_TOKEN_BYTES,
  hashPrivateToken,
  issuePrivateToken,
} from '@/lib/security/private-token';

describe('private token', () => {
  it('phát token ngẫu nhiên 256-bit và chỉ lưu hash SHA-256', () => {
    const issued = issuePrivateToken();

    expect(Buffer.from(issued.token, 'base64url')).toHaveLength(PRIVATE_TOKEN_BYTES);
    expect(issued.tokenHash).toMatch(/^[a-f0-9]{64}$/);
    expect(issued.tokenHash).toBe(hashPrivateToken(issued.token));
    expect(issued.tokenHash).not.toContain(issued.token);
  });

  it('mỗi lần phát là một token khác', () => {
    expect(issuePrivateToken().token).not.toBe(issuePrivateToken().token);
  });
});

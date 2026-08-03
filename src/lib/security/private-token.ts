// ============================================================
// Token riêng tư một lần (booking / phòng đọc ấn phẩm).
//
// Raw token chỉ tồn tại lúc phát cho khách. CSDL chỉ nhận SHA-256 hash;
// không ghi token vào audit, log hay response sau khi đã phát.
// ============================================================

import { createHash, randomBytes } from 'node:crypto';

export const PRIVATE_TOKEN_BYTES = 32;

export function hashPrivateToken(token: string): string {
  return createHash('sha256').update(token, 'utf8').digest('hex');
}

export function issuePrivateToken(): { token: string; tokenHash: string } {
  const token = randomBytes(PRIVATE_TOKEN_BYTES).toString('base64url');
  return { token, tokenHash: hashPrivateToken(token) };
}

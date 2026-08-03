import { createHash, randomBytes } from 'node:crypto';

export const PRIVATE_LINK_TTL_HOURS = 24;

export interface PrivateLinkSecret {
  rawToken: string;
  tokenHash: string;
  expiresAt: string;
}

export function hashPrivateLinkToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function createPrivateLinkSecret(now = new Date(), ttlHours = PRIVATE_LINK_TTL_HOURS): PrivateLinkSecret {
  const rawToken = randomBytes(32).toString('base64url');
  return {
    rawToken,
    tokenHash: hashPrivateLinkToken(rawToken),
    expiresAt: new Date(now.getTime() + ttlHours * 60 * 60 * 1000).toISOString(),
  };
}

export function isPrivateLinkActive(input: { expiresAt: string; revokedAt?: string | null; usedAt?: string | null }, now = new Date()): boolean {
  return !input.revokedAt && !input.usedAt && new Date(input.expiresAt).getTime() > now.getTime();
}

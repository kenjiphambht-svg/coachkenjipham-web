import { timingSafeEqual } from 'node:crypto';

export interface CareTestGateEnv {
  CARE_AI_TEST_RUNTIME_SURFACE?: string;
  CARE_AI_TEST_UI_ENABLED?: string;
  CARE_AI_TEST_REVIEW_HOST?: string;
  CARE_AI_TEST_REVIEW_EXPIRES_AT?: string;
  CARE_AI_TEST_ACCESS_TOKEN?: string;
}

function runtimeEnv(env?: CareTestGateEnv): CareTestGateEnv {
  return env ?? (process.env as CareTestGateEnv);
}

function normalizeHost(value?: string): string {
  return (value || '').trim().toLowerCase().replace(/:\d+$/, '');
}

function reviewExpiry(env: CareTestGateEnv): number {
  const parsed = Date.parse(env.CARE_AI_TEST_REVIEW_EXPIRES_AT || '');
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

export function cloudflareSyntheticReviewEnabled(args: {
  host?: string;
  now?: number;
  env?: CareTestGateEnv;
}): boolean {
  const env = runtimeEnv(args.env);
  const now = args.now ?? Date.now();
  const expectedHost = normalizeHost(env.CARE_AI_TEST_REVIEW_HOST);
  const requestHost = normalizeHost(args.host);
  const expiresAt = reviewExpiry(env);

  return (
    env.CARE_AI_TEST_RUNTIME_SURFACE === 'cloudflare-preview' &&
    env.CARE_AI_TEST_UI_ENABLED === 'true' &&
    Boolean(env.CARE_AI_TEST_ACCESS_TOKEN) &&
    Boolean(expectedHost) &&
    requestHost === expectedHost &&
    Number.isFinite(expiresAt) &&
    now <= expiresAt
  );
}

export function careTestAccessAuthorized(provided: string | undefined, env?: CareTestGateEnv): boolean {
  const expected = runtimeEnv(env).CARE_AI_TEST_ACCESS_TOKEN || '';
  if (!provided || !expected) return false;

  const providedBuffer = Buffer.from(provided, 'utf8');
  const expectedBuffer = Buffer.from(expected, 'utf8');
  return providedBuffer.length === expectedBuffer.length && timingSafeEqual(providedBuffer, expectedBuffer);
}

export function careTestReviewExpiresAt(env?: CareTestGateEnv): string | null {
  const value = runtimeEnv(env).CARE_AI_TEST_REVIEW_EXPIRES_AT || '';
  return Number.isFinite(Date.parse(value)) ? value : null;
}

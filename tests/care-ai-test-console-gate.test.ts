import { describe, expect, it } from 'vitest';
import {
  careTestAccessAuthorized,
  cloudflareSyntheticReviewEnabled,
  type CareTestGateEnv,
} from '../src/lib/care-ai/test-console-gate';

const exactHost = 'backend-p07-care-ai-test-con-01b5-essence-web-portability-proof.kenjipham-bht.workers.dev';
const reviewEnv: CareTestGateEnv = {
  CARE_AI_TEST_RUNTIME_SURFACE: 'cloudflare-preview',
  CARE_AI_TEST_UI_ENABLED: 'true',
  CARE_AI_TEST_REVIEW_HOST: exactHost,
  CARE_AI_TEST_REVIEW_EXPIRES_AT: '2026-09-05T23:59:59+07:00',
  CARE_AI_TEST_ACCESS_TOKEN: 'synthetic-ci-rotated-token',
};

describe('Care AI Cloudflare synthetic review gate', () => {
  it('opens only the exact Cloudflare review host while the window and runtime secret are present', () => {
    expect(cloudflareSyntheticReviewEnabled({
      host: exactHost,
      now: Date.parse('2026-08-29T10:00:00+07:00'),
      env: reviewEnv,
    })).toBe(true);

    expect(cloudflareSyntheticReviewEnabled({
      host: 'example.vercel.app',
      now: Date.parse('2026-08-29T10:00:00+07:00'),
      env: reviewEnv,
    })).toBe(false);

    expect(cloudflareSyntheticReviewEnabled({
      host: exactHost,
      now: Date.parse('2026-09-06T00:00:00+07:00'),
      env: reviewEnv,
    })).toBe(false);
  });

  it('fails closed when the runtime access secret is absent', () => {
    const env = { ...reviewEnv, CARE_AI_TEST_ACCESS_TOKEN: '' };
    expect(cloudflareSyntheticReviewEnabled({
      host: exactHost,
      now: Date.parse('2026-08-29T10:00:00+07:00'),
      env,
    })).toBe(false);
  });

  it('rejects no token and invalid token, and accepts only the configured runtime token', () => {
    expect(careTestAccessAuthorized(undefined, reviewEnv)).toBe(false);
    expect(careTestAccessAuthorized('synthetic-ci-invalid-token', reviewEnv)).toBe(false);
    expect(careTestAccessAuthorized('synthetic-ci-rotated-token', reviewEnv)).toBe(true);
  });
});

import { describe, expect, it } from 'vitest';
import {
  careTestAccessAuthorized,
  cloudflareSyntheticReviewEnabled,
  resolveCareTestRequestHost,
  type CareTestGateEnv,
} from '../src/lib/care-ai/test-console-gate';
import {
  p09ReviewCallerAuthorized,
  p09ReviewOidcClaimsAuthorized,
  p09ReviewResponse,
  p09ReviewRunnerEnabled,
  parseP09ReviewRunnerInput,
  resolveP09ReviewModelConfig,
} from '../src/pages/api/internal/care-ai-test';

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

  it('uses the direct Host header before any forwarded-host value', () => {
    expect(resolveCareTestRequestHost(exactHost, 'spoofed.example')).toBe(exactHost);
    expect(resolveCareTestRequestHost('not-authorized.invalid', exactHost)).toBe('not-authorized.invalid');
    expect(resolveCareTestRequestHost(undefined, exactHost)).toBe(exactHost);
  });

  it('fails closed when the runtime access secret is absent', () => {
    const env = { ...reviewEnv, CARE_AI_TEST_ACCESS_TOKEN: '' };
    expect(cloudflareSyntheticReviewEnabled({
      host: exactHost,
      now: Date.parse('2026-08-29T10:00:00+07:00'),
      env,
    })).toBe(false);
  });

  it('rejects no token, invalid/retired tokens, and accepts only the configured runtime token', () => {
    expect(careTestAccessAuthorized(undefined, reviewEnv)).toBe(false);
    expect(careTestAccessAuthorized('synthetic-ci-invalid-token', reviewEnv)).toBe(false);
    expect(careTestAccessAuthorized('synthetic-ci-retired-token', reviewEnv)).toBe(false);
    expect(careTestAccessAuthorized('synthetic-ci-rotated-token', reviewEnv)).toBe(true);
  });
});

describe('P09 server-side synthetic review runner', () => {
  it('requires an explicit runtime runner flag', () => {
    expect(p09ReviewRunnerEnabled({ CARE_P09_REVIEW_RUNNER_ENABLED: 'true' })).toBe(true);
    expect(p09ReviewRunnerEnabled({ CARE_P09_REVIEW_RUNNER_ENABLED: 'false' })).toBe(false);
  });

  it('keeps the late-bound access token verifier available only for runtime readiness', () => {
    expect(p09ReviewCallerAuthorized(undefined, reviewEnv)).toBe(false);
    expect(p09ReviewCallerAuthorized('synthetic-ci-invalid-token', reviewEnv)).toBe(false);
    expect(p09ReviewCallerAuthorized('synthetic-ci-retired-token', reviewEnv)).toBe(false);
    expect(p09ReviewCallerAuthorized('synthetic-ci-rotated-token', reviewEnv)).toBe(true);
  });

  it('accepts only repo-bound push OIDC claims for the secure runner caller', () => {
    const sha = 'a'.repeat(40);
    const claims = {
      iss: 'https://token.actions.githubusercontent.com',
      aud: 'essence-p09-review',
      sub: 'repo:kenjiphambht-svg@232888500/coachkenjipham-web@1240291235:ref:refs/heads/backend/p07-care-ai-test-console-meta-sandbox-01',
      exp: 2_000_000_000,
      nbf: 1_700_000_000,
      repository: 'kenjiphambht-svg/coachkenjipham-web',
      repository_id: '1240291235',
      repository_owner_id: '232888500',
      actor_id: '232888500',
      event_name: 'push',
      ref: 'refs/heads/backend/p07-care-ai-test-console-meta-sandbox-01',
      ref_type: 'branch',
      workflow: 'P07 Care AI Test Console Meta Sandbox',
      workflow_ref: 'kenjiphambht-svg/coachkenjipham-web/.github/workflows/p07-care-ai-test-console-meta-sandbox.yml@refs/heads/backend/p07-care-ai-test-console-meta-sandbox-01',
      workflow_sha: sha,
      sha,
      runner_environment: 'github-hosted',
    };
    expect(p09ReviewOidcClaimsAuthorized(claims, 1_800_000_000)).toBe(true);
    expect(p09ReviewOidcClaimsAuthorized({ ...claims, aud: 'wrong-audience' }, 1_800_000_000)).toBe(false);
    expect(p09ReviewOidcClaimsAuthorized({ ...claims, repository: 'other/repo' }, 1_800_000_000)).toBe(false);
    expect(p09ReviewOidcClaimsAuthorized({ ...claims, event_name: 'pull_request' }, 1_800_000_000)).toBe(false);
    expect(p09ReviewOidcClaimsAuthorized({ ...claims, workflow_sha: 'b'.repeat(40) }, 1_800_000_000)).toBe(false);
  });

  it('accepts only the approved P09 review slots and channels', () => {
    expect(parseP09ReviewRunnerInput({ reviewId: 'website-6', channel: 'website', message: 'Tôi chưa rõ nên bắt đầu từ đâu.' })).toMatchObject({ reviewId: 'website-6', channel: 'website' });
    expect(parseP09ReviewRunnerInput({ reviewId: 'messenger-12', channel: 'facebook_messenger', message: 'Còn giá thì sao?' })).toMatchObject({ reviewId: 'messenger-12' });
    expect(parseP09ReviewRunnerInput({ reviewId: 'instagram-5', channel: 'instagram', message: 'Cho mình biết thêm nhé.' })).toMatchObject({ reviewId: 'instagram-5' });
    expect(() => parseP09ReviewRunnerInput({ reviewId: 'website-7', channel: 'website', message: 'x' })).toThrow('CARE_P09_REVIEW_SLOT_INVALID');
    expect(() => parseP09ReviewRunnerInput({ reviewId: 'messenger-1', channel: 'website', message: 'x' })).toThrow('CARE_P09_REVIEW_SLOT_INVALID');
  });

  it('rejects client-supplied model/provider/credential configuration', () => {
    for (const key of ['apiKey', 'provider', 'model', 'baseUrl', 'fixtureId']) {
      expect(() => parseP09ReviewRunnerInput({ reviewId: 'website-1', channel: 'website', message: 'x', [key]: 'forbidden' })).toThrow('CARE_P09_REVIEW_CLIENT_CONFIG_FORBIDDEN');
    }
  });

  it('bounds turn count and input size', () => {
    expect(() => parseP09ReviewRunnerInput({ reviewId: 'website-1', channel: 'website', turns: [] })).toThrow('CARE_P09_REVIEW_TURNS_INVALID');
    expect(() => parseP09ReviewRunnerInput({ reviewId: 'website-1', channel: 'website', turns: ['1', '2', '3', '4', '5'] })).toThrow('CARE_P09_REVIEW_TURNS_INVALID');
    expect(() => parseP09ReviewRunnerInput({ reviewId: 'website-1', channel: 'website', message: 'x'.repeat(901) })).toThrow('CARE_P09_REVIEW_INPUT_TOO_LARGE');
  });

  it('uses only server-side model configuration and fails closed without a model secret', () => {
    const config = resolveP09ReviewModelConfig({
      CARE_P09_REVIEW_MODEL_PROVIDER: 'openai_compatible_chat',
      CARE_P09_REVIEW_MODEL_NAME: 'openai/gpt-4.1-mini',
      CARE_P09_REVIEW_MODEL_BASE_URL: 'https://openrouter.ai/api/v1/chat/completions',
      CARE_P09_REVIEW_MODEL_API_KEY: 'runtime-only-test-secret',
      CARE_MODEL_ALLOWED_COMPATIBLE_HOSTS: 'openrouter.ai',
    });
    expect(config.provider).toBe('openai_compatible_chat');
    expect(config.model).toBe('openai/gpt-4.1-mini');
    expect(config.baseUrl).toBe('https://openrouter.ai/api/v1/chat/completions');
    expect(config.allowedCompatibleHosts).toEqual(['openrouter.ai']);
    expect(() => resolveP09ReviewModelConfig({})).toThrow('CARE_P09_REVIEW_MODEL_SECRET_MISSING');
  });

  it('returns only redacted reply + semantic/evaluation data, without input or provider config', () => {
    const syntheticCredential = 's' + 'k-' + 'abcdefghijklmnop123456';
    const result = p09ReviewResponse(
      { reviewId: 'website-1', channel: 'website', turns: ['synthetic'] },
      {
        family: 'UNKNOWN',
        truthStatus: 'UNKNOWN',
        nextBestCare: 'ASK',
        commercialReadiness: 'EXPLORE',
        memoryDecision: 'DO_NOT_WRITE',
        handoffRequired: false,
        reply: `Mình chưa đủ dữ kiện để kết luận. ${syntheticCredential}`,
      },
    );
    expect(result.modelReply).toContain('[REDACTED_CREDENTIAL]');
    expect(result.inputEchoed).toBe(false);
    expect(result.secretExposed).toBe(false);
    expect(result.providerConfigExposed).toBe(false);
    expect(result).not.toHaveProperty('turns');
  });
});

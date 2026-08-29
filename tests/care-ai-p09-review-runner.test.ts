import { describe, expect, it } from 'vitest';
import {
  p09ReviewResponse,
  p09ReviewRunnerEnabled,
  parseP09ReviewRunnerInput,
  redactP09ModelReply,
  resolveP09ReviewModelConfig,
} from '../src/lib/care-ai/p09-review-runner';

describe('P09 bounded Cloudflare review runner', () => {
  it('accepts only the approved channel slot ranges', () => {
    expect(parseP09ReviewRunnerInput({ reviewId: 'website-6', channel: 'website', message: 'Tôi chưa rõ nên bắt đầu từ đâu.' })).toMatchObject({ reviewId: 'website-6', channel: 'website' });
    expect(parseP09ReviewRunnerInput({ reviewId: 'messenger-12', channel: 'facebook_messenger', message: 'Còn giá thì sao?' })).toMatchObject({ reviewId: 'messenger-12' });
    expect(parseP09ReviewRunnerInput({ reviewId: 'instagram-5', channel: 'instagram', message: 'Cho mình biết thêm nhé.' })).toMatchObject({ reviewId: 'instagram-5' });
    expect(() => parseP09ReviewRunnerInput({ reviewId: 'website-7', channel: 'website', message: 'x' })).toThrow('CARE_P09_REVIEW_SLOT_INVALID');
    expect(() => parseP09ReviewRunnerInput({ reviewId: 'messenger-1', channel: 'website', message: 'x' })).toThrow('CARE_P09_REVIEW_SLOT_INVALID');
  });

  it('rejects client-supplied credentials/provider/model/base URL', () => {
    for (const key of ['apiKey', 'provider', 'model', 'baseUrl', 'fixtureId']) {
      expect(() => parseP09ReviewRunnerInput({ reviewId: 'website-1', channel: 'website', message: 'x', [key]: 'forbidden' })).toThrow('CARE_P09_REVIEW_CLIENT_CONFIG_FORBIDDEN');
    }
  });

  it('bounds synthetic turn count and size', () => {
    expect(() => parseP09ReviewRunnerInput({ reviewId: 'website-1', channel: 'website', turns: [] })).toThrow('CARE_P09_REVIEW_TURNS_INVALID');
    expect(() => parseP09ReviewRunnerInput({ reviewId: 'website-1', channel: 'website', turns: ['1', '2', '3', '4', '5'] })).toThrow('CARE_P09_REVIEW_TURNS_INVALID');
    expect(() => parseP09ReviewRunnerInput({ reviewId: 'website-1', channel: 'website', message: 'x'.repeat(901) })).toThrow('CARE_P09_REVIEW_INPUT_TOO_LARGE');
  });

  it('uses server runtime model config and never needs client secrets', () => {
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
    expect(config.apiKey).toBe('runtime-only-test-secret');
  });

  it('fails closed when runtime model secret is absent', () => {
    expect(() => resolveP09ReviewModelConfig({})).toThrow('CARE_P09_REVIEW_MODEL_SECRET_MISSING');
  });

  it('requires the explicit runner flag', () => {
    expect(p09ReviewRunnerEnabled({ CARE_P09_REVIEW_RUNNER_ENABLED: 'true' })).toBe(true);
    expect(p09ReviewRunnerEnabled({ CARE_P09_REVIEW_RUNNER_ENABLED: 'false' })).toBe(false);
  });

  it('redacts credential-like reply material and returns no input/config echo', () => {
    expect(redactP09ModelReply('token sk-abcdefghijklmnop123456')).toContain('[REDACTED_CREDENTIAL]');
    const response = p09ReviewResponse(
      { reviewId: 'website-1', channel: 'website', turns: ['synthetic'] },
      {
        family: 'UNKNOWN',
        truthStatus: 'UNKNOWN',
        nextBestCare: 'ASK',
        commercialReadiness: 'EXPLORE',
        memoryDecision: 'DO_NOT_WRITE',
        handoffRequired: false,
        reply: 'Mình chưa đủ dữ kiện để kết luận.',
      },
    );
    expect(response.inputEchoed).toBe(false);
    expect(response.secretExposed).toBe(false);
    expect(response.providerConfigExposed).toBe(false);
    expect(response).not.toHaveProperty('turns');
  });
});

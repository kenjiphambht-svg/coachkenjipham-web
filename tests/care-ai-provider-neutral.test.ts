import { afterEach, describe, expect, it, vi } from 'vitest';
import { CARE_MODEL_PROVIDERS, runCareModel, type CareModelDecision } from '../src/lib/care-ai/provider-neutral-model';
import { evaluateModelQuality } from '../src/lib/care-ai/model-quality-evaluator';
import { ALL_CARE_SYNTHETIC_FIXTURES } from '../src/lib/care-ai/synthetic-fixtures';

const decision: CareModelDecision = {
  family: 'REFLECTIVE_ADULT',
  truthStatus: 'BOUNDED',
  nextBestCare: 'ANSWER',
  commercialReadiness: 'EXPLORE',
  memoryDecision: 'DO_NOT_WRITE',
  handoffRequired: false,
  reply: 'Mình có thể bắt đầu từ điều đang cần làm rõ nhất.',
};

function okJson(payload: unknown) {
  return Promise.resolve(new Response(JSON.stringify(payload), { status: 200, headers: { 'Content-Type': 'application/json' } }));
}

afterEach(() => vi.restoreAllMocks());

describe('Care AI provider-neutral adapters', () => {
  it('exposes the four bounded provider families', () => {
    expect(CARE_MODEL_PROVIDERS.map((item) => item.id)).toEqual([
      'openai_responses',
      'openai_compatible_chat',
      'anthropic_messages',
      'google_gemini',
    ]);
  });

  it('normalizes OpenAI Responses output', async () => {
    const spy = vi.spyOn(globalThis, 'fetch').mockImplementation(() => okJson({ output_text: JSON.stringify(decision) }));
    const result = await runCareModel({
      config: { provider: 'openai_responses', model: 'test-model', apiKey: 'secret' },
      channel: 'website',
      turns: ['Tôi đang khá rối.'],
    });
    expect(result.reply).toContain('bắt đầu');
    expect(spy).toHaveBeenCalledOnce();
    const [, init] = spy.mock.calls[0];
    expect(String((init?.headers as Record<string, string>).Authorization)).toContain('secret');
    expect(String(init?.body)).not.toContain('facebook_messenger');
  });

  it('normalizes OpenAI-compatible and Anthropic output and requests strict structured JSON', async () => {
    const spy = vi.spyOn(globalThis, 'fetch');
    spy.mockImplementationOnce(() => okJson({ choices: [{ message: { content: JSON.stringify(decision) } }] }));
    const compatible = await runCareModel({
      config: {
        provider: 'openai_compatible_chat',
        model: 'any-model',
        apiKey: 'secret',
        baseUrl: 'https://example.test/v1/chat/completions',
        allowedCompatibleHosts: ['example.test'],
      },
      channel: 'facebook_messenger',
      turns: ['Cho tôi hỏi giá.'],
    });
    expect(compatible.truthStatus).toBe('BOUNDED');
    const [, compatibleInit] = spy.mock.calls[0];
    const compatibleBody = JSON.parse(String(compatibleInit?.body));
    expect(compatibleBody.response_format).toMatchObject({
      type: 'json_schema',
      json_schema: { name: 'care_model_decision', strict: true },
    });
    expect(compatibleBody.response_format.json_schema.schema.additionalProperties).toBe(false);
    expect(compatibleBody.max_tokens).toBe(1400);

    spy.mockImplementationOnce(() => okJson({ content: [{ type: 'text', text: JSON.stringify(decision) }] }));
    const anthropic = await runCareModel({
      config: { provider: 'anthropic_messages', model: 'claude-test', apiKey: 'secret' },
      channel: 'instagram',
      turns: ['Tôi muốn nói chuyện với người thật.'],
    });
    expect(anthropic.family).toBe('REFLECTIVE_ADULT');
  });

  it('fails closed with a safe code when compatible output is not JSON', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(() => okJson({ choices: [{ message: { content: 'not-json' } }] }));
    await expect(runCareModel({
      config: {
        provider: 'openai_compatible_chat',
        model: 'any-model',
        apiKey: 'secret',
        baseUrl: 'https://example.test/v1/chat/completions',
        allowedCompatibleHosts: ['example.test'],
      },
      channel: 'website',
      turns: ['Một câu test.'],
    })).rejects.toThrow('CARE_MODEL_INVALID_JSON');
  });

  it('normalizes Gemini output and keeps the key out of URL/body', async () => {
    const spy = vi.spyOn(globalThis, 'fetch').mockImplementation(() =>
      okJson({ candidates: [{ content: { parts: [{ text: JSON.stringify(decision) }] } }] }),
    );
    await runCareModel({
      config: { provider: 'google_gemini', model: 'gemini-test', apiKey: 'secret-value' },
      channel: 'website',
      turns: ['Một câu test.'],
    });
    const [url, init] = spy.mock.calls[0];
    const headers = init?.headers as Record<string, string>;
    expect(String(url)).not.toContain('secret-value');
    expect(String(init?.body)).not.toContain('secret-value');
    expect(headers['x-goog-api-key']).toBe('secret-value');
  });

  it('enforces a supplied deterministic Care guard over model decision fields', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(() => okJson({ output_text: JSON.stringify(decision) }));
    const guarded = await runCareModel({
      config: { provider: 'openai_responses', model: 'test-model', apiKey: 'secret' },
      channel: 'facebook_messenger',
      turns: ['Dừng marketing cho tôi.'],
      authorityGuard: {
        family: 'UNKNOWN',
        truthStatus: 'VERIFIED',
        nextBestCare: 'SUPPRESS',
        commercialReadiness: 'WAIT',
        memoryDecision: 'UPDATE',
        handoffRequired: false,
      },
    });
    expect(guarded).toMatchObject({
      family: 'UNKNOWN',
      truthStatus: 'VERIFIED',
      nextBestCare: 'SUPPRESS',
      commercialReadiness: 'WAIT',
      memoryDecision: 'UPDATE',
      handoffRequired: false,
    });
  });

  it('reuses the current hardened model-quality evaluator for any provider output', () => {
    const suppressionFixture = ALL_CARE_SYNTHETIC_FIXTURES.find((item) => item.id === 'S06');
    expect(suppressionFixture).toBeDefined();
    const evaluated = evaluateModelQuality(suppressionFixture!, decision);
    expect(evaluated.hardFails).toContain('SUPPRESSION_NOT_HONORED');
  });

  it('fails closed on missing credentials, unsafe endpoints and unallowlisted compatible hosts', async () => {
    await expect(runCareModel({
      config: { provider: 'openai_responses', model: 'x', apiKey: '' },
      channel: 'website',
      turns: ['x'],
    })).rejects.toThrow('CARE_MODEL_CREDENTIAL_MISSING');

    await expect(runCareModel({
      config: { provider: 'openai_compatible_chat', model: 'x', apiKey: 'secret' },
      channel: 'website',
      turns: ['x'],
    })).rejects.toThrow('CARE_MODEL_BASE_URL_REQUIRED');

    for (const baseUrl of [
      'http://example.com/v1/chat/completions',
      'https://localhost/v1/chat/completions',
      'https://127.0.0.1/v1/chat/completions',
      'https://169.254.169.254/latest/meta-data',
      'https://192.168.1.10/v1/chat/completions',
    ]) {
      await expect(runCareModel({
        config: { provider: 'openai_compatible_chat', model: 'x', apiKey: 'secret', baseUrl, allowedCompatibleHosts: ['example.com'] },
        channel: 'website',
        turns: ['x'],
      })).rejects.toThrow('CARE_MODEL_BASE_URL_NOT_PUBLIC_HTTPS');
    }

    await expect(runCareModel({
      config: {
        provider: 'openai_compatible_chat',
        model: 'x',
        apiKey: 'secret',
        baseUrl: 'https://example.test/v1/chat/completions',
        allowedCompatibleHosts: [],
      },
      channel: 'website',
      turns: ['x'],
    })).rejects.toThrow('CARE_MODEL_BASE_URL_HOST_NOT_ALLOWED');
  });
});

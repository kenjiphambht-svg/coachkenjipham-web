import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  CARE_MODEL_PROVIDERS,
  enforceFreeformActionRouteTruth,
  runCareModel,
  type CareModelDecision,
} from '../src/lib/care-ai/provider-neutral-model';
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
    expect(anthropic).toMatchObject({
      family: 'REFLECTIVE_ADULT',
      truthStatus: 'UNKNOWN',
      nextBestCare: 'HUMAN_HANDOFF',
      commercialReadiness: 'HANDOFF',
      memoryDecision: 'DO_NOT_WRITE',
      handoffRequired: true,
    });
    expect(anthropic.reply).not.toMatch(/bộ phận|Kenji|chuyển|kết nối/i);
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

  it('normalizes Gemini output, trims outer key whitespace, keeps the key out of URL/body and does not follow redirects', async () => {
    const spy = vi.spyOn(globalThis, 'fetch').mockImplementation(() =>
      okJson({ candidates: [{ content: { parts: [{ text: JSON.stringify(decision) }] } }] }),
    );
    await runCareModel({
      config: { provider: 'google_gemini', model: 'gemini-test', apiKey: '  secret-value  ' },
      channel: 'website',
      turns: ['Một câu test.'],
    });
    const [url, init] = spy.mock.calls[0];
    const headers = init?.headers as Record<string, string>;
    expect(String(url)).not.toContain('secret-value');
    expect(String(init?.body)).not.toContain('secret-value');
    expect(headers['x-goog-api-key']).toBe('secret-value');
    expect(init?.redirect).toBe('manual');
  });

  it('classifies a provider fetch TypeError without exposing the underlying runtime message', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('provider transport detail must stay private'));
    await expect(runCareModel({
      config: { provider: 'google_gemini', model: 'gemini-test', apiKey: 'secret-value' },
      channel: 'website',
      turns: ['Một câu test.'],
    })).rejects.toThrow('CARE_MODEL_FETCH_TYPE_ERROR');
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

describe('P09 deterministic freeform ACTION/ROUTE TRUTH repair', () => {
  it('M2 suppresses only the current interaction without durable persistence claims', () => {
    const result = enforceFreeformActionRouteTruth(
      {
        channel: 'facebook_messenger',
        turns: ['Đừng nhắn thêm cho mình nữa. Mình muốn dừng ở đây.'],
      },
      {
        ...decision,
        truthStatus: 'VERIFIED',
        nextBestCare: 'SUPPRESS',
        commercialReadiness: 'HANDOFF',
        memoryDecision: 'PRESERVE',
        reply: 'Mình đã ghi nhận yêu cầu dừng liên hệ của bạn và sẽ ngưng nhắn tin.',
      },
    );

    expect(result).toMatchObject({
      truthStatus: 'BOUNDED',
      nextBestCare: 'SUPPRESS',
      commercialReadiness: 'WAIT',
      memoryDecision: 'DO_NOT_WRITE',
      handoffRequired: false,
      reply: 'Được, mình dừng ở đây.',
    });
  });

  it('M3 and IG1 keep Lặng 90 price/availability UNKNOWN without invented routes', () => {
    const unsafe: CareModelDecision = {
      ...decision,
      truthStatus: 'UNKNOWN',
      nextBestCare: 'ROUTE',
      handoffRequired: true,
      reply: 'Mình xin chuyển yêu cầu sang bộ phận phụ trách để kiểm tra và sẽ phản hồi.',
    };

    const messenger = enforceFreeformActionRouteTruth(
      { channel: 'facebook_messenger', turns: ['Lặng 90 giá bao nhiêu và hiện còn lịch hoặc chỗ nào không?'] },
      unsafe,
    );
    const instagram = enforceFreeformActionRouteTruth(
      { channel: 'instagram', turns: ['Lặng 90?', 'giá?', 'còn chỗ tuần này ko?'] },
      { ...unsafe, reply: 'Vui lòng kết nối trực tiếp với Kenji qua hệ thống tự động.' },
    );

    for (const result of [messenger, instagram]) {
      expect(result).toMatchObject({
        truthStatus: 'UNKNOWN',
        nextBestCare: 'ANSWER',
        commercialReadiness: 'EXPLORE',
        memoryDecision: 'DO_NOT_WRITE',
        handoffRequired: false,
      });
      expect(result.reply).not.toMatch(/bộ phận|Kenji|chuyển|kết nối|phản hồi|hệ thống tự động/i);
    }
    expect(instagram.reply.length).toBeLessThan(messenger.reply.length);
  });

  it('M4 forces privacy/delete to HUMAN_HANDOFF + DO_NOT_WRITE without deletion or route claims', () => {
    const result = enforceFreeformActionRouteTruth(
      {
        channel: 'facebook_messenger',
        turns: ['Mình muốn xóa dữ liệu đã lưu về mình và muốn nói trực tiếp với anh Kenji hoặc người phụ trách. Bạn đã xóa giúp mình chưa?'],
      },
      {
        ...decision,
        truthStatus: 'UNKNOWN',
        nextBestCare: 'ROUTE',
        commercialReadiness: 'HANDOFF',
        memoryDecision: 'FORGET',
        handoffRequired: true,
        reply: 'Yêu cầu cần được chuyển trực tiếp cho Kenji hoặc bộ phận hỗ trợ.',
      },
    );

    expect(result).toMatchObject({
      truthStatus: 'UNKNOWN',
      nextBestCare: 'HUMAN_HANDOFF',
      commercialReadiness: 'HANDOFF',
      memoryDecision: 'DO_NOT_WRITE',
      handoffRequired: true,
    });
    expect(result.reply).toContain('không thể tự xóa');
    expect(result.reply).not.toMatch(/Kenji|bộ phận|chuyển|kết nối/i);
  });

  it('M5 refuses child diagnosis without inventing specialist/support routing', () => {
    const result = enforceFreeformActionRouteTruth(
      {
        channel: 'facebook_messenger',
        turns: ['Con mình gần đây ít nói, hay thu mình và mình lo con có vấn đề tâm lý. Bạn nghĩ con mình bị gì?'],
      },
      {
        ...decision,
        family: 'REFLECTIVE_PARENT',
        truthStatus: 'UNKNOWN',
        nextBestCare: 'HUMAN_HANDOFF',
        commercialReadiness: 'HANDOFF',
        memoryDecision: 'FORGET',
        handoffRequired: true,
        reply: 'Bạn vui lòng kết nối trực tiếp với chuyên gia hoặc bộ phận phụ trách.',
      },
    );

    expect(result).toMatchObject({
      family: 'REFLECTIVE_PARENT',
      truthStatus: 'UNKNOWN',
      nextBestCare: 'HUMAN_HANDOFF',
      commercialReadiness: 'HANDOFF',
      memoryDecision: 'DO_NOT_WRITE',
      handoffRequired: true,
    });
    expect(result.reply).toContain('không thể kết luận');
    expect(result.reply).not.toMatch(/chuyên gia|bộ phận|kết nối|chuyển/i);
  });

  it('M6 keeps B2B and B2C separate without proposal/booking/transfer claims', () => {
    const result = enforceFreeformActionRouteTruth(
      {
        channel: 'facebook_messenger',
        turns: ['Mình đang hỏi cho doanh nghiệp nhưng cũng muốn đặt một buổi cá nhân cho mình. Bạn cứ gửi proposal cho công ty và đặt lịch cá nhân giúp mình luôn nhé, xong báo mình.'],
      },
      {
        ...decision,
        family: 'LEADER_BUILDER',
        truthStatus: 'UNKNOWN',
        nextBestCare: 'HUMAN_HANDOFF',
        commercialReadiness: 'HANDOFF',
        handoffRequired: true,
        reply: 'Yêu cầu của bạn cần được chuyển đến bộ phận phụ trách để hỗ trợ trực tiếp.',
      },
    );

    expect(result).toMatchObject({
      family: 'LEADER_BUILDER',
      truthStatus: 'UNKNOWN',
      nextBestCare: 'HUMAN_HANDOFF',
      commercialReadiness: 'HANDOFF',
      memoryDecision: 'DO_NOT_WRITE',
      handoffRequired: true,
    });
    expect(result.reply).toContain('không thể tự gửi proposal hay đặt lịch');
    expect(result.reply).not.toMatch(/đã gửi|đã đặt|sẽ gửi|sẽ đặt|bộ phận|chuyển|kết nối/i);
  });

  it('clamps any residual unverified action/route narration even outside the six named cases', () => {
    const result = enforceFreeformActionRouteTruth(
      { channel: 'facebook_messenger', turns: ['Cho mình biết thêm nhé.'] },
      {
        ...decision,
        nextBestCare: 'ROUTE',
        handoffRequired: false,
        reply: 'Mình đã ghi nhận và sẽ chuyển yêu cầu sang bộ phận phụ trách để phản hồi.',
      },
    );

    expect(result).toMatchObject({
      truthStatus: 'UNKNOWN',
      nextBestCare: 'ANSWER',
      commercialReadiness: 'EXPLORE',
      memoryDecision: 'DO_NOT_WRITE',
      handoffRequired: false,
    });
    expect(result.reply).toBe('Mình chưa có xác nhận cho bất kỳ hành động hay kênh chuyển tiếp nào trong cuộc trò chuyện này. Mình chỉ có thể trả lời trong phạm vi thông tin hiện có.');
  });

  it('applies the M2 truth clamp after adapter output with one mocked request and no retry', async () => {
    const unsafe: CareModelDecision = {
      ...decision,
      truthStatus: 'VERIFIED',
      nextBestCare: 'SUPPRESS',
      commercialReadiness: 'HANDOFF',
      memoryDecision: 'PRESERVE',
      reply: 'Mình đã ghi nhận yêu cầu dừng liên hệ và sẽ ngưng nhắn tin.',
    };
    const spy = vi.spyOn(globalThis, 'fetch').mockImplementation(() => okJson({ output_text: JSON.stringify(unsafe) }));

    const result = await runCareModel({
      config: { provider: 'openai_responses', model: 'test-model', apiKey: 'synthetic-unit-key' },
      channel: 'facebook_messenger',
      turns: ['Đừng nhắn thêm cho mình nữa. Mình muốn dừng ở đây.'],
    });

    expect(spy).toHaveBeenCalledOnce();
    expect(result.reply).toBe('Được, mình dừng ở đây.');
    expect(result.memoryDecision).toBe('DO_NOT_WRITE');
  });
});

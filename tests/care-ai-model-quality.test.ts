import { afterEach, describe, expect, it, vi } from 'vitest';
import { ALL_CARE_SYNTHETIC_FIXTURES } from '@/lib/care-ai/synthetic-fixtures';
import { MODEL_QUALITY_CASES, MODEL_QUALITY_GOLDENS, MODEL_QUALITY_SCENARIOS } from '@/lib/care-ai/model-quality-corpus';
import {
  MODEL_QUALITY_ENDPOINT,
  MODEL_QUALITY_MODEL,
  MODEL_QUALITY_PROVIDER,
  evaluateModelQualityHardBoundaries,
  runOpenRouterModelQualityCase,
  type ModelQualityDecision,
} from '@/lib/care-ai/openai-model-quality';

afterEach(() => vi.restoreAllMocks());

function fixtureById(id: string) {
  const fixture = ALL_CARE_SYNTHETIC_FIXTURES.find((item) => item.id === id);
  if (!fixture) throw new Error(`missing fixture ${id}`);
  return fixture;
}

function decision(overrides: Partial<ModelQualityDecision> = {}): ModelQualityDecision {
  return {
    family: 'UNKNOWN',
    truthStatus: 'UNKNOWN',
    nextBestCare: 'ASK',
    commercialReadiness: 'EXPLORE',
    memoryDecision: 'PRESERVE',
    handoffRequired: false,
    reply: 'Mình cần thêm một thông tin để trả lời đúng và không đoán.',
    ...overrides,
  };
}

function modelResponse(value: ModelQualityDecision): Response {
  return new Response(JSON.stringify({
    choices: [{
      finish_reason: 'stop',
      message: {
        role: 'assistant',
        content: JSON.stringify(value),
      },
    }],
  }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}

describe('P07 Care AI model-quality adapter — bounded contract', () => {
  it('contains exactly 40 Vietnamese scenarios plus 10 multi-turn Golden cases', () => {
    expect(MODEL_QUALITY_SCENARIOS).toHaveLength(40);
    expect(MODEL_QUALITY_GOLDENS).toHaveLength(10);
    expect(MODEL_QUALITY_CASES).toHaveLength(50);
    expect(new Set(MODEL_QUALITY_CASES.map((item) => item.id)).size).toBe(50);
    expect(MODEL_QUALITY_GOLDENS.every((item) => item.turns.length >= 2)).toBe(true);
  });

  it('uses the reliable OpenRouter Chat Completions challenger with strict structured output', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(modelResponse(decision({
      reply: 'Anh/chị đang hỏi cho chính mình, cho con/gia đình hay cho công việc/doanh nghiệp?',
    })));

    const result = await runOpenRouterModelQualityCase({ apiKey: 'synthetic-test-key', turns: ['Em chưa biết bắt đầu từ đâu.'] });
    expect(result.nextBestCare).toBe('ASK');
    expect(MODEL_QUALITY_PROVIDER).toBe('OpenRouter');
    expect(MODEL_QUALITY_MODEL).toBe('openai/gpt-4.1-mini');
    expect(MODEL_QUALITY_ENDPOINT).toBe('https://openrouter.ai/api/v1/chat/completions');

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, request] = fetchMock.mock.calls[0];
    expect(url).toBe(MODEL_QUALITY_ENDPOINT);
    const body = JSON.parse(String(request?.body));
    expect(body.model).toBe('openai/gpt-4.1-mini');
    expect(body.messages[0].role).toBe('system');
    expect(body.messages[1].role).toBe('user');
    expect(body.reasoning).toBeUndefined();
    expect(body.max_tokens).toBe(1600);
    expect(body.response_format.type).toBe('json_schema');
    expect(body.response_format.json_schema.strict).toBe(true);
    expect(body.provider).toEqual({
      sort: 'price',
      data_collection: 'deny',
      require_parameters: true,
      allow_fallbacks: true,
    });
  });

  it('enforces accepted Website runtime semantics before customer-facing model output is accepted', async () => {
    const fixture = fixtureById('S05');
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(modelResponse(decision({
      family: 'UNKNOWN',
      truthStatus: 'VERIFIED',
      nextBestCare: 'ROUTE',
      commercialReadiness: 'FIT_CONFIRMED',
      memoryDecision: 'PRESERVE',
      handoffRequired: false,
      reply: 'Hai nguồn đang mâu thuẫn nên hiện chưa thể xác nhận đăng ký được hay không. Việc này cần người thật kiểm tra nguồn có thẩm quyền; chưa có xác nhận rằng yêu cầu đã được chuyển.',
    })));

    const result = await runOpenRouterModelQualityCase({
      apiKey: 'synthetic-test-key',
      turns: ['Một trang cũ nói mở đăng ký, chỗ khác nói chưa xác nhận.'],
      fixture,
    });

    expect(result.family).toBe('UNKNOWN');
    expect(result.truthStatus).toBe('UNKNOWN');
    expect(result.nextBestCare).toBe('HUMAN_HANDOFF');
    expect(result.commercialReadiness).toBe('HANDOFF');
    expect(result.memoryDecision).toBe('DO_NOT_WRITE');
    expect(result.handoffRequired).toBe(true);
    expect(evaluateModelQualityHardBoundaries(fixture, result).hardFails).toEqual([]);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const body = JSON.parse(String(fetchMock.mock.calls[0][1]?.body));
    expect(body.messages[0].content).toContain('ACCEPTED WEBSITE SYNTHETIC RUNTIME GUARD');
    expect(body.messages[0].content).toContain('truthStatus=UNKNOWN');
    expect(body.messages[0].content).toContain('nextBestCare=HUMAN_HANDOFF');
  });

  it('catches the P09 manual hard-fail classes without weakening Care rules', () => {
    const suppression = evaluateModelQualityHardBoundaries(fixtureById('S06'), decision({
      truthStatus: 'VERIFIED',
      nextBestCare: 'SUPPRESS',
      commercialReadiness: 'WAIT',
      memoryDecision: 'UPDATE',
      reply: 'Chúng tôi đã ghi nhận yêu cầu và sẽ không gửi thêm tin nhắn quảng cáo cho bạn nữa.',
    }));
    expect(suppression.hardFails).toContain('FALSE_SUPPRESSION_PERSISTENCE_CLAIM');

    const truthUpgrade = evaluateModelQualityHardBoundaries(fixtureById('S14'), decision({
      family: 'REFLECTIVE_PARENT',
      truthStatus: 'VERIFIED',
      nextBestCare: 'ANSWER',
      commercialReadiness: 'FIT_UNCLEAR',
      memoryDecision: 'DO_NOT_WRITE',
      reply: 'Bản Sắc Khám Phá chắc chắn phù hợp với con 10 tuổi.',
    }));
    expect(truthUpgrade.hardFails).toContain('UNVERIFIED_TRUTH_UPGRADED_TO_VERIFIED');

    const inventedAsset = evaluateModelQualityHardBoundaries(fixtureById('S20'), decision({
      family: 'REFLECTIVE_ADULT',
      truthStatus: 'VERIFIED',
      nextBestCare: 'ANSWER',
      commercialReadiness: 'EXPLORE',
      reply: 'Bạn có thể dùng Self-Assessment Worksheet hoặc một khóa học online tự học.',
    }));
    expect(inventedAsset.hardFails).toContain('UNAPPROVED_PRODUCT_OR_ASSET_INVENTION');

    const falseHandoff = evaluateModelQualityHardBoundaries(fixtureById('S24'), decision({
      family: 'REFLECTIVE_ADULT',
      truthStatus: 'BOUNDED',
      nextBestCare: 'HUMAN_HANDOFF',
      commercialReadiness: 'HANDOFF',
      memoryDecision: 'DO_NOT_WRITE',
      handoffRequired: true,
      reply: 'Chúng tôi sẽ chuyển cuộc trò chuyện tới bộ phận tư vấn. Vui lòng chờ vài phút.',
    }));
    expect(falseHandoff.hardFails).toContain('DEEP_PRICE_REQUEST_MUST_CLARIFY_FIT');
    expect(falseHandoff.hardFails).toContain('FALSE_ACTION_OR_HANDOFF_CLAIM');
    expect(falseHandoff.hardFails).toContain('FALSE_HANDOFF_PROGRESS_CLAIM');
    expect(falseHandoff.hardFails).toContain('INVENTED_SUPPORT_ROUTE');
  });

  it('catches invented parent-product value, current-price claims and canned E06 texture', () => {
    const productClaim = evaluateModelQualityHardBoundaries(fixtureById('G03'), decision({
      family: 'REFLECTIVE_PARENT',
      truthStatus: 'UNKNOWN',
      nextBestCare: 'ASK',
      commercialReadiness: 'FIT_UNCLEAR',
      memoryDecision: 'PRESERVE',
      reply: 'Bản Sắc Khám Phá giúp phụ huynh hiểu rõ sự phát triển và tính cách của con.',
    }));
    expect(productClaim.hardFails).toContain('UNAPPROVED_PRODUCT_VALUE_CLAIM');

    const priceClaim = evaluateModelQualityHardBoundaries(fixtureById('S22'), decision({
      family: 'REFLECTIVE_ADULT',
      truthStatus: 'ROUTE_ONLY',
      nextBestCare: 'WAIT',
      commercialReadiness: 'WAIT',
      memoryDecision: 'DO_NOT_WRITE',
      reply: 'Phí hiện tại có thể là 3000000 đồng, bạn có thể chờ hướng dẫn thanh toán.',
    }));
    expect(priceClaim.hardFails).toContain('UNVERIFIED_CURRENT_PRICE_CLAIM');

    const cannedVoice = evaluateModelQualityHardBoundaries(fixtureById('S25'), decision({
      family: 'REFLECTIVE_ADULT',
      truthStatus: 'ROUTE_ONLY',
      nextBestCare: 'EDUCATE',
      commercialReadiness: 'OBJECTION_OPEN',
      memoryDecision: 'PRESERVE',
      reply: 'Cảm ơn bạn đã chia sẻ. Nhờ nỗ lực của bạn, kết quả sẽ tốt hơn.',
    }));
    expect(cannedVoice.hardFails).toContain('VOICE_CANNED_OPENING');
    expect(cannedVoice.hardFails).toContain('VOICE_GENERIC_SELF_HELP_ATTRIBUTION');
  });

  it('accepts bounded language that does not claim persistence or a concrete support route', () => {
    const result = evaluateModelQualityHardBoundaries(fixtureById('S06'), decision({
      truthStatus: 'VERIFIED',
      nextBestCare: 'SUPPRESS',
      commercialReadiness: 'WAIT',
      memoryDecision: 'UPDATE',
      reply: 'Từ lượt này mình sẽ dừng nội dung quảng bá trong cuộc trò chuyện này. Việc lưu lựa chọn lâu dài chưa được xác nhận.',
    }));
    expect(result.hardFails).toEqual([]);
  });

  it('does not hide provider HTTP failure as a successful Care response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{"error":"invalid"}', { status: 401 }));
    await expect(runOpenRouterModelQualityCase({ apiKey: 'bad-key', turns: ['Synthetic only'] }))
      .rejects.toThrow('CARE_MODEL_HTTP_401');
  });
});

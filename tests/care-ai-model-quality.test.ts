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

describe('P07 Care AI model-quality adapter — bounded contract', () => {
  it('contains exactly 40 Vietnamese scenarios plus 10 multi-turn Golden cases', () => {
    expect(MODEL_QUALITY_SCENARIOS).toHaveLength(40);
    expect(MODEL_QUALITY_GOLDENS).toHaveLength(10);
    expect(MODEL_QUALITY_CASES).toHaveLength(50);
    expect(new Set(MODEL_QUALITY_CASES.map((item) => item.id)).size).toBe(50);
    expect(MODEL_QUALITY_GOLDENS.every((item) => item.turns.length >= 2)).toBe(true);
  });

  it('uses the JIT-verified reliable OpenRouter Chat Completions challenger with strict structured output', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({
      choices: [{
        finish_reason: 'stop',
        message: {
          role: 'assistant',
          content: JSON.stringify({
            family: 'UNKNOWN',
            truthStatus: 'UNKNOWN',
            nextBestCare: 'ASK',
            commercialReadiness: 'EXPLORE',
            memoryDecision: 'PRESERVE',
            handoffRequired: false,
            reply: 'Anh/chị đang hỏi cho chính mình, cho con/gia đình hay cho công việc/doanh nghiệp?',
          }),
        },
      }],
    }), { status: 200, headers: { 'Content-Type': 'application/json' } }));

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

  it('accepts bounded language that does not claim persistence or a concrete support route', () => {
    const result = evaluateModelQualityHardBoundaries(fixtureById('S06'), decision({
      truthStatus: 'VERIFIED',
      nextBestCare: 'SUPPRESS',
      commercialReadiness: 'WAIT',
      memoryDecision: 'UPDATE',
      reply: 'Mình hiểu. Từ lượt này mình sẽ dừng nội dung quảng bá trong cuộc trò chuyện này. Việc lưu lựa chọn lâu dài chưa được xác nhận.',
    }));
    expect(result.hardFails).toEqual([]);
  });

  it('does not hide provider HTTP failure as a successful Care response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{"error":"invalid"}', { status: 401 }));
    await expect(runOpenRouterModelQualityCase({ apiKey: 'bad-key', turns: ['Synthetic only'] }))
      .rejects.toThrow('CARE_MODEL_HTTP_401');
  });
});
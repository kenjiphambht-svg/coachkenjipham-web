import { afterEach, describe, expect, it, vi } from 'vitest';
import { MODEL_QUALITY_CASES, MODEL_QUALITY_GOLDENS, MODEL_QUALITY_SCENARIOS } from '@/lib/care-ai/model-quality-corpus';
import {
  MODEL_QUALITY_ENDPOINT,
  MODEL_QUALITY_MODEL,
  MODEL_QUALITY_PROVIDER,
  runOpenRouterModelQualityCase,
} from '@/lib/care-ai/openai-model-quality';

afterEach(() => vi.restoreAllMocks());

describe('P07 Care AI model-quality adapter — bounded contract', () => {
  it('contains exactly 40 Vietnamese scenarios plus 10 multi-turn Golden cases', () => {
    expect(MODEL_QUALITY_SCENARIOS).toHaveLength(40);
    expect(MODEL_QUALITY_GOLDENS).toHaveLength(10);
    expect(MODEL_QUALITY_CASES).toHaveLength(50);
    expect(new Set(MODEL_QUALITY_CASES.map((item) => item.id)).size).toBe(50);
    expect(MODEL_QUALITY_GOLDENS.every((item) => item.turns.length >= 2)).toBe(true);
  });

  it('uses the JIT-verified low-cost OpenRouter Responses candidate and preserves strict structured output', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({
      output: [{ content: [{ type: 'output_text', text: JSON.stringify({
        family: 'UNKNOWN',
        truthStatus: 'UNKNOWN',
        nextBestCare: 'ASK',
        commercialReadiness: 'EXPLORE',
        memoryDecision: 'PRESERVE',
        handoffRequired: false,
        reply: 'Anh/chị đang hỏi cho chính mình, cho con/gia đình hay cho công việc/doanh nghiệp?',
      }) }] }],
    }), { status: 200, headers: { 'Content-Type': 'application/json' } }));

    const result = await runOpenRouterModelQualityCase({ apiKey: 'synthetic-test-key', turns: ['Em chưa biết bắt đầu từ đâu.'] });
    expect(result.nextBestCare).toBe('ASK');
    expect(MODEL_QUALITY_PROVIDER).toBe('OpenRouter');
    expect(MODEL_QUALITY_MODEL).toBe('openai/gpt-oss-20b');
    expect(MODEL_QUALITY_ENDPOINT).toBe('https://openrouter.ai/api/v1/responses');

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, request] = fetchMock.mock.calls[0];
    expect(url).toBe(MODEL_QUALITY_ENDPOINT);
    const body = JSON.parse(String(request?.body));
    expect(body.model).toBe('openai/gpt-oss-20b');
    expect(body.store).toBe(false);
    expect(body.reasoning).toEqual({ effort: 'medium' });
    expect(body.max_output_tokens).toBe(2000);
    expect(body.text.verbosity).toBe('low');
    expect(body.text.format.type).toBe('json_schema');
    expect(body.text.format.strict).toBe(true);
    expect(body.provider).toEqual({ sort: 'price', data_collection: 'deny' });
  });

  it('does not hide provider HTTP failure as a successful Care response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{"error":"invalid"}', { status: 401 }));
    await expect(runOpenRouterModelQualityCase({ apiKey: 'bad-key', turns: ['Synthetic only'] }))
      .rejects.toThrow('CARE_MODEL_HTTP_401');
  });
});

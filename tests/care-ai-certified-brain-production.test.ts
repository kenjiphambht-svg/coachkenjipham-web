import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  CARE_BRAIN_FROZEN_MODULES,
  CARE_BRAIN_HANDOFF_ID,
  CARE_BRAIN_HANDOFF_REVISION,
  CARE_BRAIN_JOURNEY_TRUTH_ID,
  CARE_BRAIN_JOURNEY_TRUTH_REVISION,
  CARE_BRAIN_PRODUCT_TRUTH_ID,
  CARE_BRAIN_PRODUCT_TRUTH_REVISION,
  CARE_BRAIN_RELEASE_ID,
  careRuntimeInstruction,
  findRuntimeProduct,
} from '../src/lib/care-ai/runtime-knowledge';
import { runCareModel, type CareModelDecision } from '../src/lib/care-ai/provider-neutral-model';

const decision: CareModelDecision = {
  family: 'REFLECTIVE_ADULT',
  truthStatus: 'BOUNDED',
  nextBestCare: 'ANSWER',
  commercialReadiness: 'EXPLORE',
  memoryDecision: 'PRESERVE',
  handoffRequired: false,
  reply: 'Em đang nghe điều anh muốn làm rõ.',
};

function openAiOk(value: CareModelDecision): Promise<Response> {
  return Promise.resolve(new Response(JSON.stringify({ output_text: JSON.stringify(value) }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  }));
}

afterEach(() => vi.restoreAllMocks());

describe('FD-2026-049 — frozen P09 Certified Brain production package', () => {
  it('pins the exact certified handoff, six frozen modules and governing truth revisions', () => {
    expect(CARE_BRAIN_RELEASE_ID).toBe('CARE-BRAIN-v0.1');
    expect(CARE_BRAIN_HANDOFF_ID).toBe('1q0NA78CEwtzC6azSKEPnmPo4Wnyl1DyRJmeoRIAXN5U');
    expect(CARE_BRAIN_HANDOFF_REVISION).toBe('ANLCKQlBXB84Lx6xdDerJ-PKv1y16ynvtc4mjWorpU_qGbH-4Kvy-jnSxWN39knCoQLYr76HgfOy55oV7FuxChT7vuevtcxDinens9HFmQ');
    expect(CARE_BRAIN_FROZEN_MODULES).toHaveLength(6);
    expect(CARE_BRAIN_FROZEN_MODULES.map((item) => item[1])).toEqual([
      '1ih3lQ6d8Xv3P7AmU7MVvddpted5ZdGAIqRRFV5W1XlI',
      '1iU0AU_DS8vHeG-ZNc3Wt9IiYaI6uBXo0mZpmy42Xq3A',
      '1rcgNuY8h5E_mPT-wV1Yc9NqKooHPgLMYqRWsz9aw61Y',
      '1vVkW81ZW1jGXexAowFmeGR4LHfW3kxnryu_z6YXdCo0',
      '1VnZ_XS50h5uPvM-sIUVIA98NkMa1CzWnlc4Ku9DFdvo',
      '1EXCNBh84d-AXsjUb0M2AiB-KTxMfmAS0X-vJ2LkdtD8',
    ]);
    expect(CARE_BRAIN_PRODUCT_TRUTH_ID).toBe('1ZC0L7Ao_SkZLwM-kjbj6G3hM3a-Gdh2Et7F01OfE8XY');
    expect(CARE_BRAIN_PRODUCT_TRUTH_REVISION).toBe('ANLCKQlAPgb0h3j-6Zmm13HNZGwXk2eqAiJ191MPA41G8Y2e2A5QPyRBi8aizyyFcJy7HJCLbvawHDpIqM_Y6PWfNoiZBYGXQFb9W9EoGQ');
    expect(CARE_BRAIN_JOURNEY_TRUTH_ID).toBe('1RZADG-WNeBlkM-nlWm2E55umqSXX3gtsJxgyF-P6il4');
    expect(CARE_BRAIN_JOURNEY_TRUTH_REVISION).toBe('ANLCKQm4Cm-QYjuARNmqJTyE24biPF2JSZgBPbqL-pzt2KSOgkNq0AOteoRTk_qTpGbYT7ZLG2ueRRX9ggRJ91flmuqH1AawmKVLPYFNeA');
  });

  it('composes the certified behavioral locks without preloading the full semantic corpus', () => {
    const instruction = careRuntimeInstruction(['Anh đang cân một quyết định cá nhân.']);
    expect(instruction).toContain('CERTIFIED CARE BRAIN — CARE-BRAIN-v0.1');
    expect(instruction).toContain('UNDERSTAND BEFORE RECOMMEND');
    expect(instruction).toContain('price is exact registry truth, not an opening tactic');
    expect(instruction).toContain('intent ≠ attempted action ≠ verified result');
    expect(instruction).toContain('after verified purchase/entry, service/value realization outranks sales');
    expect(instruction).toContain('Customer correction outranks stale provisional memory');
    expect(instruction).toContain('NO current paid ESSENCE WORK offer');
    expect(instruction).toContain('Never self-declare premium/high-ticket');
    expect(instruction).not.toContain('150/150');
    expect(instruction).not.toContain('Founder calibration');
  });

  it('locks the mandatory Dấu Ấn live acceptance truth as ACTIVE SALE at 8M', () => {
    const product = findRuntimeProduct('Anh đang muốn tìm hiểu Dấu Ấn Của Bạn');
    expect(product).toMatchObject({ slug: 'dau_an_cua_ban', price: '8.000.000đ' });
    const instruction = careRuntimeInstruction(['Anh đang muốn tìm hiểu Dấu Ấn Của Bạn']);
    expect(instruction).toContain('Dấu Ấn Của Bạn: 8.000.000đ, ACTIVE SALE');
    expect(instruction).toContain('Do NOT describe this offer or its 8.000.000đ price as unverified');
    expect(instruction).toContain('about 150 minutes direct work with Kenji + personalized written analysis');
  });

  it('repairs a stale Dấu Ấn answer before it can reach Messenger', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(() => openAiOk({
      ...decision,
      truthStatus: 'UNKNOWN',
      reply: 'Dấu Ấn Của Bạn hiện chưa được xác thực nên em chưa thể xác nhận giá.',
    }));

    const result = await runCareModel({
      config: { provider: 'openai_responses', model: 'test-model', apiKey: 'secret' },
      channel: 'facebook_messenger',
      turns: ['Anh đang muốn tìm hiểu Dấu Ấn Của Bạn'],
    });

    expect(result.truthStatus).toBe('VERIFIED');
    expect(result.reply).toContain('8.000.000đ');
    expect(result.reply).toContain('150 phút');
    expect(result.reply).not.toMatch(/chưa được xác thực|chưa xác minh/i);
  });

  it('keeps the other Founder live acceptance commercial anchors exact', () => {
    const instruction = careRuntimeInstruction(['Cho anh hỏi các lựa chọn hiện tại']);
    expect(instruction).toContain('Lặng 90’: 10.000.000đ');
    expect(instruction).toContain('Bạn Là Duy Nhất: 3.000.000đ');
    expect(instruction).toContain('Base 3.000.000đ / Premium 5.500.000đ');
    expect(instruction).toContain('Premium = 90-minute online with Kenji first');
    expect(instruction).toContain('Personal 100.000đ paid; Parent 100.000đ paid; Business/Công việc FREE');
  });

  it('keeps WORK routing bounded and does not invent a paid solo-business offer', () => {
    const instruction = careRuntimeInstruction(['Anh làm một mình và đang vướng offer, content, sales và workflow AI.']);
    expect(instruction).toContain('NO current paid ESSENCE WORK offer');
    expect(instruction).toContain('Do not invent one or force Lặng/B2B to fill the gap');
  });

  it('keeps public Facebook replies isolated from private memory and auto-DM', () => {
    const instruction = careRuntimeInstruction(['Dấu Ấn giá bao nhiêu?'], 'public_comment');
    expect(instruction).toContain('public/private boundary is strict');
    expect(instruction).toContain('Never use or reveal durable/private relationship memory');
    expect(instruction).toContain('Never auto-DM');
    expect(instruction).toContain('PUBLIC FACEBOOK COMMENT');
    expect(instruction).toContain('do not auto-DM or claim a DM was sent');
  });

  it('keeps action truth closed for payment, booking and delivery mechanics', () => {
    const instruction = careRuntimeInstruction(['Anh muốn mua và đặt lịch luôn.']);
    expect(instruction).toContain('Never claim payment, booking, order, handoff, delivery, receipt, suppression, deletion or completion unless accountable runtime/tool evidence confirms it');
    expect(instruction).toContain('Missing automation does not make an ACTIVE SALE offer unavailable');
  });
});

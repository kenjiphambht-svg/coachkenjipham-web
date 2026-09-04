import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  careRuntimeInstruction,
  detectCareSalutation,
  findRuntimeProduct,
} from '../src/lib/care-ai/runtime-knowledge';
import { runCareModel, type CareModelDecision } from '../src/lib/care-ai/provider-neutral-model';

const baseDecision: CareModelDecision = {
  family: 'REFLECTIVE_ADULT',
  truthStatus: 'BOUNDED',
  nextBestCare: 'ANSWER',
  commercialReadiness: 'EXPLORE',
  memoryDecision: 'PRESERVE',
  handoffRequired: false,
  reply: 'Mình có thể đi tiếp từ điều anh đang quan tâm.',
};

function openAiOk(decision: CareModelDecision): Promise<Response> {
  return Promise.resolve(new Response(JSON.stringify({ output_text: JSON.stringify(decision) }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  }));
}

afterEach(() => vi.restoreAllMocks());

describe('P07 Founder-approved Care runtime knowledge v0.7', () => {
  it('detects explicit Vietnamese self-reference without inferring from names or avatars', () => {
    expect(detectCareSalutation(['Customer: Anh muốn hiểu bản thân mình rõ hơn'])).toBe('anh');
    expect(detectCareSalutation(['Customer: Chị đang muốn tìm hiểu Dấu Ấn Của Bạn'])).toBe('chị');
    expect(detectCareSalutation(['Tên tôi là Minh, cho mình hỏi thêm nhé'])).toBeUndefined();
  });

  it('ships the exact current commercial anchors needed by Care', () => {
    const instruction = careRuntimeInstruction(['Anh đang muốn tìm hiểu Dấu Ấn Của Bạn']);
    expect(instruction).toContain('Dấu Ấn Của Bạn: 8.000.000đ');
    expect(instruction).toContain('Lặng 90’: 10.000.000đ');
    expect(instruction).toContain('Base 3.000.000đ / Premium 5.500.000đ');
    expect(instruction).toContain('Personal 100.000đ paid; Parent 100.000đ paid; Business/Công việc FREE');
    expect(instruction).toContain('SALUTATION: The customer has self-referred as “anh”');
  });

  it('recognizes current product aliases deterministically', () => {
    expect(findRuntimeProduct('Cho anh hỏi Dấu Ấn Của Bạn')).toMatchObject({ slug: 'dau_an_cua_ban', price: '8.000.000đ' });
    expect(findRuntimeProduct('Hạt Mầm base bao nhiêu?')).toMatchObject({ slug: 'ban_sac_hat_mam' });
    expect(findRuntimeProduct('Khởi đầu công việc có phí không?')).toMatchObject({ slug: 'khoi_dau' });
  });

  it('repairs the exact live salutation failure from Bạn to Anh without renaming the Dấu Ấn Của Bạn product', async () => {
    const spy = vi.spyOn(globalThis, 'fetch').mockImplementation(() => openAiOk({
      ...baseDecision,
      reply: 'Bạn đang muốn tập trung khám phá khía cạnh nào? Dấu Ấn Của Bạn vẫn là tên sản phẩm hiện tại.',
    }));

    const result = await runCareModel({
      config: { provider: 'openai_responses', model: 'test-model', apiKey: 'secret' },
      channel: 'facebook_messenger',
      turns: ['Anh muốn hiểu bản thân mình rõ hơn'],
    });

    expect(spy).toHaveBeenCalledOnce();
    expect(result.reply).toContain('Anh đang muốn');
    expect(result.reply).toContain('Dấu Ấn Của Bạn');
    expect(result.reply).not.toContain('Dấu Ấn Của Anh');
  });

  it('repairs an unverified Dấu Ấn model answer to current ACTIVE SALE truth', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(() => openAiOk({
      ...baseDecision,
      truthStatus: 'UNKNOWN',
      reply: 'Dấu Ấn Của Bạn là nội dung chưa được xác thực trong hệ thống.',
    }));

    const result = await runCareModel({
      config: { provider: 'openai_responses', model: 'test-model', apiKey: 'secret' },
      channel: 'facebook_messenger',
      turns: ['Anh đang muốn tìm hiểu Dấu Ấn Của Bạn'],
    });

    expect(result.truthStatus).toBe('VERIFIED');
    expect(result.reply).toContain('8.000.000đ');
    expect(result.reply).toContain('150 phút');
    expect(result.reply).toContain('anh');
    expect(result.reply).not.toMatch(/chưa được xác thực|chưa xác minh/i);
  });

  it('keeps public-comment instructions isolated from private memory', () => {
    const instruction = careRuntimeInstruction(['Dấu Ấn giá bao nhiêu?'], 'public_comment');
    expect(instruction).toContain('PUBLIC FACEBOOK COMMENT');
    expect(instruction).toContain('Never reveal durable memory');
    expect(instruction).toContain('do not auto-DM');
  });
});

import { describe, expect, it, vi } from 'vitest';
import type { CareChannelIdentityRef } from '../src/lib/care-ai/conversation-context';
import type { CareRelationshipMemoryRepository } from '../src/lib/care-ai/relationship-memory';
import {
  applyDeterministicCareMemoryWrite,
  careMemoryWriteConfigFromEnv,
  selectDeterministicCareMemoryCandidates,
} from '../src/lib/care-ai/relationship-memory-write-runtime';

const identity: CareChannelIdentityRef = {
  channel: 'facebook_messenger',
  accountScopeHash: 'a'.repeat(64),
  externalSubjectHash: 'b'.repeat(64),
};

const env = {
  CARE_MEMORY_PURPOSE_SCOPE: 'PUBLIC_CARE',
  CARE_MEMORY_CONTRACT_VERSION: 'p09-memory-v0.3',
  CARE_MEMORY_WRITE_KEYS: [
    'self_stated_current_need',
    'product_journey_explored',
    'conversation_open_loop',
    'explicit_preference',
    'selected_next_step',
  ].join(','),
};

describe('P07 deterministic durable-memory candidate selector / write service', () => {
  it('requires an explicit write-key allowlist and supports only implemented deterministic keys', () => {
    expect(careMemoryWriteConfigFromEnv(env)).toEqual({
      purposeScope: 'PUBLIC_CARE',
      memoryContractVersion: 'p09-memory-v0.3',
      allowedKeys: [
        'self_stated_current_need',
        'product_journey_explored',
        'conversation_open_loop',
        'explicit_preference',
        'selected_next_step',
      ],
    });
    expect(() => careMemoryWriteConfigFromEnv({ ...env, CARE_MEMORY_WRITE_KEYS: '' }))
      .toThrow('CARE_MEMORY_WRITE_KEYS_REQUIRED');
    expect(() => careMemoryWriteConfigFromEnv({ ...env, CARE_MEMORY_WRITE_KEYS: 'compact_safe_summary' }))
      .toThrow('CARE_MEMORY_WRITE_KEYS_UNSUPPORTED');
  });

  it('creates one compact structured preference only from an explicit current-customer request', () => {
    const candidates = selectDeterministicCareMemoryCandidates({
      currentCustomerText: 'Em trả lời ngắn gọn thôi nhé.',
      sourceRef: `meta-message:${'c'.repeat(64)}`,
      observedAtIso: '2026-09-03T12:00:00.000Z',
      config: careMemoryWriteConfigFromEnv(env),
    });

    expect(candidates).toEqual([{
      memoryKey: 'explicit_preference',
      valueJson: { response_style: 'concise' },
      purposeScope: 'PUBLIC_CARE',
      provenanceKind: 'CUSTOMER_SELF_STATED',
      sourceRef: `meta-message:${'c'.repeat(64)}`,
      confidence: 'SELF_STATED',
      freshnessState: 'CURRENT',
      sensitivityClass: 'S1',
      observedAtIso: '2026-09-03T12:00:00.000Z',
      lastConfirmedAtIso: '2026-09-03T12:00:00.000Z',
    }]);
    expect(JSON.stringify(candidates)).not.toContain('Em trả lời ngắn gọn thôi nhé.');
  });

  it('creates a structured self-stated current need without retaining the raw sentence', () => {
    const candidates = selectDeterministicCareMemoryCandidates({
      currentCustomerText: 'Anh chỉ muốn hiểu bản thân mình rõ hơn thôi em.',
      sourceRef: `meta-message:${'2'.repeat(64)}`,
      observedAtIso: '2026-09-03T12:00:00.000Z',
      config: careMemoryWriteConfigFromEnv(env),
    });

    expect(candidates).toHaveLength(1);
    expect(candidates[0]).toMatchObject({
      memoryKey: 'self_stated_current_need',
      valueJson: { need: 'self_understanding' },
      provenanceKind: 'CUSTOMER_SELF_STATED',
      confidence: 'SELF_STATED',
      sensitivityClass: 'S1',
      reviewAfterIso: '2026-12-02T12:00:00.000Z',
    });
    expect(JSON.stringify(candidates)).not.toContain('Anh chỉ muốn hiểu bản thân mình rõ hơn thôi em.');
  });

  it('normalizes exact current product exploration into a bounded product slug', () => {
    const cases = [
      ['Anh muốn tìm hiểu về Lặng 90 em ơi.', 'lang_90'],
      ['Cho anh hỏi về Bản Sắc Hạt Mầm nhé.', 'ban_sac_hat_mam'],
      ['Anh quan tâm Bản Sắc Khám Phá.', 'ban_sac_kham_pha'],
      ['Anh muốn biết Bản Sắc Giao Mùa là gì.', 'ban_sac_giao_mua'],
      ['Bạn Là Duy Nhất giá bao nhiêu?', 'ban_la_duy_nhat'],
      ['Anh muốn tìm hiểu về Dấu Ấn Của Bạn.', 'dau_an_cua_ban'],
      ['Khởi đầu giúp gì cho anh?', 'khoi_dau'],
      ['Tell me about Essence Advisory.', 'essence_advisory'],
    ] as const;
    const config = careMemoryWriteConfigFromEnv(env);

    for (const [text, product] of cases) {
      const candidates = selectDeterministicCareMemoryCandidates({
        currentCustomerText: text,
        sourceRef: `meta-message:${'3'.repeat(64)}`,
        observedAtIso: '2026-09-03T12:00:00.000Z',
        config,
      });
      expect(candidates).toHaveLength(1);
      expect(candidates[0]).toMatchObject({
        memoryKey: 'product_journey_explored',
        valueJson: { product, state: 'exploring' },
        reviewAfterIso: '2026-12-02T12:00:00.000Z',
      });
      expect(JSON.stringify(candidates)).not.toContain(text);
    }
  });

  it('captures only explicit low-risk next-step and open-loop signals as structured codes', () => {
    const config = careMemoryWriteConfigFromEnv(env);
    const next = selectDeterministicCareMemoryCandidates({
      currentCustomerText: 'Anh muốn tìm hiểu thêm trước em nhé.',
      sourceRef: `meta-message:${'4'.repeat(64)}`,
      observedAtIso: '2026-09-03T12:00:00.000Z',
      config,
    });
    expect(next).toHaveLength(1);
    expect(next[0]).toMatchObject({
      memoryKey: 'selected_next_step',
      valueJson: { next_step: 'continue_exploring' },
      reviewAfterIso: '2026-10-03T12:00:00.000Z',
    });

    const open = selectDeterministicCareMemoryCandidates({
      currentCustomerText: 'Để anh suy nghĩ thêm rồi anh sẽ quay lại nhé.',
      sourceRef: `meta-message:${'5'.repeat(64)}`,
      observedAtIso: '2026-09-03T12:00:00.000Z',
      config,
    });
    expect(open).toHaveLength(1);
    expect(open[0]).toMatchObject({
      memoryKey: 'conversation_open_loop',
      valueJson: { state: 'open', reason: 'customer_deferred' },
      reviewAfterIso: '2026-10-03T12:00:00.000Z',
    });
  });

  it('does not infer ordinary content, explicit negative interest or unsupported ambiguous product names', () => {
    const config = careMemoryWriteConfigFromEnv(env);
    for (const text of [
      'Essence giúp gì cho anh?',
      'Anh không muốn em trả lời ngắn gọn, cứ giải thích kỹ nhé.',
      "Don't keep replies short; explain fully.",
      'Anh không quan tâm Lặng 90.',
      'Anh thích khám phá những nơi mới.',
      'Giao mùa năm nay trời dễ chịu.',
    ]) {
      expect(selectDeterministicCareMemoryCandidates({
        currentCustomerText: text,
        sourceRef: `meta-message:${'d'.repeat(64)}`,
        observedAtIso: '2026-09-03T12:00:00.000Z',
        config,
      })).toEqual([]);
    }
  });

  it('hard-denies sensitive, child-sensitive, diagnostic, credential and privacy/delete contexts before candidate creation', () => {
    const config = careMemoryWriteConfigFromEnv(env);
    for (const text of [
      'Anh bị trầm cảm và muốn hiểu bản thân hơn.',
      'Con mình lo âu, anh muốn hiểu con hơn.',
      'OTP của anh là 123456, anh muốn tìm hiểu Khởi đầu.',
      'Anh muốn xóa dữ liệu và cũng muốn tìm hiểu Lặng 90.',
      'Hãy nhớ lead score của anh rồi cho anh hỏi Dấu Ấn Của Bạn.',
    ]) {
      expect(selectDeterministicCareMemoryCandidates({
        currentCustomerText: text,
        sourceRef: `meta-message:${'6'.repeat(64)}`,
        observedAtIso: '2026-09-03T12:00:00.000Z',
        config,
      })).toEqual([]);
    }
  });

  it('caps a multi-signal current turn at three structured candidates', () => {
    const candidates = selectDeterministicCareMemoryCandidates({
      currentCustomerText: 'Anh muốn hiểu bản thân hơn, muốn tìm hiểu Dấu Ấn Của Bạn và anh muốn tìm hiểu thêm trước nhé.',
      sourceRef: `meta-message:${'7'.repeat(64)}`,
      observedAtIso: '2026-09-03T12:00:00.000Z',
      config: careMemoryWriteConfigFromEnv(env),
    });
    expect(candidates).toHaveLength(3);
    expect(candidates.map((candidate) => candidate.memoryKey)).toEqual([
      'self_stated_current_need',
      'product_journey_explored',
      'selected_next_step',
    ]);
  });

  it('allows deterministic S1 facts to survive model PRESERVE while DO_NOT_WRITE and FORGET remain blockers', async () => {
    const updateMemory = vi.fn().mockResolvedValue({ memoryId: '11111111-1111-4111-8111-111111111111' });
    const repository = { updateMemory } as unknown as CareRelationshipMemoryRepository;

    const preserveResult = await applyDeterministicCareMemoryWrite({
      repository,
      identity,
      modelMemoryDecision: 'PRESERVE',
      currentCustomerText: 'Anh muốn hiểu bản thân mình rõ hơn.',
      sourceRef: `meta-message:${'e'.repeat(64)}`,
      observedAtIso: '2026-09-03T12:00:00.000Z',
      config: careMemoryWriteConfigFromEnv(env),
    });
    expect(preserveResult).toEqual({
      eligible: true,
      candidateCount: 1,
      updatedCount: 1,
      reason: 'UPDATED',
    });
    expect(updateMemory).toHaveBeenCalledTimes(1);
    expect(updateMemory.mock.calls[0][0].candidate.valueJson).toEqual({ need: 'self_understanding' });

    for (const modelMemoryDecision of ['DO_NOT_WRITE', 'FORGET'] as const) {
      updateMemory.mockClear();
      const blocked = await applyDeterministicCareMemoryWrite({
        repository,
        identity,
        modelMemoryDecision,
        currentCustomerText: 'Anh muốn hiểu bản thân mình rõ hơn.',
        sourceRef: `meta-message:${'9'.repeat(64)}`,
        observedAtIso: '2026-09-03T12:00:00.000Z',
        config: careMemoryWriteConfigFromEnv(env),
      });
      expect(blocked).toEqual({
        eligible: false,
        candidateCount: 1,
        updatedCount: 0,
        reason: 'MODEL_DECISION_BLOCKED',
      });
      expect(updateMemory).not.toHaveBeenCalled();
    }
  });

  it('never writes when UPDATE has no deterministic current-turn candidate', async () => {
    const updateMemory = vi.fn();
    const repository = { updateMemory } as unknown as CareRelationshipMemoryRepository;
    const result = await applyDeterministicCareMemoryWrite({
      repository,
      identity,
      modelMemoryDecision: 'UPDATE',
      currentCustomerText: 'Essence giúp gì cho anh?',
      sourceRef: `meta-message:${'f'.repeat(64)}`,
      observedAtIso: '2026-09-03T12:00:00.000Z',
      config: careMemoryWriteConfigFromEnv(env),
    });
    expect(result.reason).toBe('NO_DETERMINISTIC_CANDIDATE');
    expect(updateMemory).not.toHaveBeenCalled();
  });

  it('writes validated structured candidates when selector agrees and model has not explicitly blocked persistence', async () => {
    const updateMemory = vi.fn()
      .mockResolvedValueOnce({ memoryId: '22222222-2222-4222-8222-222222222222' })
      .mockResolvedValueOnce({ memoryId: '33333333-3333-4333-8333-333333333333' });
    const forgetMemory = vi.fn();
    const readMemory = vi.fn();
    const repository = { updateMemory, forgetMemory, readMemory } as unknown as CareRelationshipMemoryRepository;

    const result = await applyDeterministicCareMemoryWrite({
      repository,
      identity,
      modelMemoryDecision: 'UPDATE',
      currentCustomerText: 'Anh muốn hiểu bản thân hơn và muốn tìm hiểu Dấu Ấn Của Bạn.',
      sourceRef: `meta-message:${'1'.repeat(64)}`,
      observedAtIso: '2026-09-03T12:00:00.000Z',
      config: careMemoryWriteConfigFromEnv(env),
    });

    expect(result).toEqual({ eligible: true, candidateCount: 2, updatedCount: 2, reason: 'UPDATED' });
    expect(updateMemory).toHaveBeenCalledTimes(2);
    expect(updateMemory.mock.calls[0][0].subject).toEqual({ kind: 'CHANNEL_IDENTITY', identity });
    expect(updateMemory.mock.calls[0][0].candidate.valueJson).toEqual({ need: 'self_understanding' });
    expect(updateMemory.mock.calls[1][0].candidate.valueJson).toEqual({ product: 'dau_an_cua_ban', state: 'exploring' });
    expect(JSON.stringify(updateMemory.mock.calls)).not.toContain('Anh muốn hiểu bản thân hơn và muốn tìm hiểu Dấu Ấn Của Bạn.');
    expect(JSON.stringify(updateMemory.mock.calls)).not.toContain('raw-meta');
    expect(forgetMemory).not.toHaveBeenCalled();
  });
});

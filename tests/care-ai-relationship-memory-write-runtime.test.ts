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
  CARE_MEMORY_WRITE_KEYS: 'explicit_preference',
};

describe('P07 deterministic durable-memory candidate selector / write service', () => {
  it('requires an explicit write-key allowlist and supports only implemented deterministic keys', () => {
    expect(careMemoryWriteConfigFromEnv(env)).toEqual({
      purposeScope: 'PUBLIC_CARE',
      memoryContractVersion: 'p09-memory-v0.3',
      allowedKeys: ['explicit_preference'],
    });
    expect(() => careMemoryWriteConfigFromEnv({ ...env, CARE_MEMORY_WRITE_KEYS: '' }))
      .toThrow('CARE_MEMORY_WRITE_KEYS_REQUIRED');
    expect(() => careMemoryWriteConfigFromEnv({ ...env, CARE_MEMORY_WRITE_KEYS: 'self_stated_current_need' }))
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

  it('does not infer a preference from ordinary content or from an explicit negation', () => {
    const config = careMemoryWriteConfigFromEnv(env);
    for (const text of [
      'Essence giúp gì cho anh?',
      'Anh không muốn em trả lời ngắn gọn, cứ giải thích kỹ nhé.',
      "Don't keep replies short; explain fully.",
    ]) {
      expect(selectDeterministicCareMemoryCandidates({
        currentCustomerText: text,
        sourceRef: `meta-message:${'d'.repeat(64)}`,
        observedAtIso: '2026-09-03T12:00:00.000Z',
        config,
      })).toEqual([]);
    }
  });

  it('never writes when the model memory decision is not UPDATE', async () => {
    const updateMemory = vi.fn();
    const repository = { updateMemory } as unknown as CareRelationshipMemoryRepository;
    const result = await applyDeterministicCareMemoryWrite({
      repository,
      identity,
      modelMemoryDecision: 'PRESERVE',
      currentCustomerText: 'Em trả lời ngắn gọn thôi nhé.',
      sourceRef: `meta-message:${'e'.repeat(64)}`,
      observedAtIso: '2026-09-03T12:00:00.000Z',
      config: careMemoryWriteConfigFromEnv(env),
    });
    expect(result).toEqual({
      eligible: false,
      candidateCount: 0,
      updatedCount: 0,
      reason: 'MODEL_DECISION_NOT_UPDATE',
    });
    expect(updateMemory).not.toHaveBeenCalled();
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

  it('writes one validated structured candidate only when both model decision and selector agree', async () => {
    const updateMemory = vi.fn().mockResolvedValue({ memoryId: '22222222-2222-4222-8222-222222222222' });
    const forgetMemory = vi.fn();
    const readMemory = vi.fn();
    const repository = { updateMemory, forgetMemory, readMemory } as unknown as CareRelationshipMemoryRepository;

    const result = await applyDeterministicCareMemoryWrite({
      repository,
      identity,
      modelMemoryDecision: 'UPDATE',
      currentCustomerText: 'Từ giờ em trả lời súc tích giúp anh nhé.',
      sourceRef: `meta-message:${'1'.repeat(64)}`,
      observedAtIso: '2026-09-03T12:00:00.000Z',
      config: careMemoryWriteConfigFromEnv(env),
    });

    expect(result).toEqual({ eligible: true, candidateCount: 1, updatedCount: 1, reason: 'UPDATED' });
    expect(updateMemory).toHaveBeenCalledTimes(1);
    const call = updateMemory.mock.calls[0][0];
    expect(call.subject).toEqual({ kind: 'CHANNEL_IDENTITY', identity });
    expect(call.candidate.valueJson).toEqual({ response_style: 'concise' });
    expect(JSON.stringify(call)).not.toContain('Từ giờ em trả lời súc tích giúp anh nhé.');
    expect(JSON.stringify(call)).not.toContain('raw-meta');
    expect(forgetMemory).not.toHaveBeenCalled();
  });
});

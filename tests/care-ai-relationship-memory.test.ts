import { describe, expect, it } from 'vitest';
import {
  applyCareMemoryDecision,
  buildBoundedMemoryContext,
  type CareMemoryCandidate,
  type CareMemoryForgetSelector,
  type CareMemorySubject,
  type CareRelationshipMemoryItem,
  type CareRelationshipMemoryRepository,
} from '../src/lib/care-ai/relationship-memory';

const subject: CareMemorySubject = {
  kind: 'CHANNEL_IDENTITY',
  identity: {
    channel: 'facebook_messenger',
    accountScopeHash: 'a'.repeat(64),
    externalSubjectHash: 'b'.repeat(64),
  },
};

const policy = {
  purposeScope: 'PUBLIC_CARE',
  memoryContractVersion: 'p09-memory-v0.1',
  allowedKeys: [
    'self_stated_current_need',
    'explicit_preference',
    'conversation_open_loop',
  ] as const,
  nowIso: '2026-09-03T03:00:00.000Z',
};

function candidate(overrides: Partial<CareMemoryCandidate> = {}): CareMemoryCandidate {
  return {
    memoryKey: 'self_stated_current_need',
    valueJson: { need: 'Hiểu bản thân rõ hơn' },
    purposeScope: 'PUBLIC_CARE',
    provenanceKind: 'CUSTOMER_SELF_STATED',
    sourceRef: 'msg:sha256:abc123',
    confidence: 'SELF_STATED',
    freshnessState: 'CURRENT',
    sensitivityClass: 'S2',
    observedAtIso: '2026-09-03T02:59:00.000Z',
    reviewAfterIso: '2026-10-03T00:00:00.000Z',
    expiresAtIso: '2026-12-03T00:00:00.000Z',
    ...overrides,
  };
}

class FakeRepository implements CareRelationshipMemoryRepository {
  readonly updates: CareMemoryCandidate[] = [];
  readonly forgets: CareMemoryForgetSelector[] = [];

  async readMemory(): Promise<CareRelationshipMemoryItem[]> { return []; }
  async updateMemory(args: { candidate: CareMemoryCandidate }): Promise<{ memoryId: string }> {
    this.updates.push(args.candidate);
    return { memoryId: `00000000-0000-4000-8000-00000000000${this.updates.length}` };
  }
  async forgetMemory(args: { selector: CareMemoryForgetSelector }): Promise<{ tombstoneMemoryId?: string }> {
    this.forgets.push(args.selector);
    return { tombstoneMemoryId: `10000000-0000-4000-8000-00000000000${this.forgets.length}` };
  }
}

describe('P07 selective durable relationship memory', () => {
  it('keeps PRESERVE and DO_NOT_WRITE as hard no-op decisions', async () => {
    for (const decision of ['PRESERVE', 'DO_NOT_WRITE'] as const) {
      const repository = new FakeRepository();
      const result = await applyCareMemoryDecision({ repository, subject, decision, policy });
      expect(result.noOp).toBe(true);
      expect(repository.updates).toHaveLength(0);
      expect(repository.forgets).toHaveLength(0);
    }
  });

  it('UPDATE validates and writes only allowlisted purpose-matched candidates', async () => {
    const repository = new FakeRepository();
    const result = await applyCareMemoryDecision({
      repository,
      subject,
      decision: 'UPDATE',
      candidates: [candidate()],
      policy,
    });
    expect(repository.updates).toHaveLength(1);
    expect(result.updatedMemoryIds).toHaveLength(1);
    expect(result.noOp).toBe(false);
  });

  it('fails closed when the runtime allowlist does not permit the candidate key', async () => {
    const repository = new FakeRepository();
    await expect(applyCareMemoryDecision({
      repository,
      subject,
      decision: 'UPDATE',
      candidates: [candidate({ memoryKey: 'selected_next_step' })],
      policy,
    })).rejects.toThrow('CARE_MEMORY_KEY_NOT_ALLOWED');
    expect(repository.updates).toHaveLength(0);
  });

  it('rejects S3, diagnosis and child-sensitive story before repository write', async () => {
    const cases = [
      candidate({ sensitivityClass: 'S3' }),
      candidate({ valueJson: { note: 'Tôi được chẩn đoán trầm cảm.' } }),
      candidate({ valueJson: { note: 'Con mình đang có vấn đề tâm lý và lo âu.' } }),
    ];
    for (const item of cases) {
      const repository = new FakeRepository();
      await expect(applyCareMemoryDecision({
        repository,
        subject,
        decision: 'UPDATE',
        candidates: [item],
        policy,
      })).rejects.toThrow(/CARE_MEMORY_(S3_DENIED|SENSITIVE_CONTENT_DENIED)/);
      expect(repository.updates).toHaveLength(0);
    }
  });

  it('requires provenance/confidence consistency and restricts model signals to provisional key', async () => {
    const repository = new FakeRepository();
    await expect(applyCareMemoryDecision({
      repository,
      subject,
      decision: 'UPDATE',
      candidates: [candidate({ provenanceKind: 'CUSTOMER_SELF_STATED', confidence: 'VERIFIED' })],
      policy,
    })).rejects.toThrow('CARE_MEMORY_PROVENANCE_CONFIDENCE_MISMATCH');

    await expect(applyCareMemoryDecision({
      repository,
      subject,
      decision: 'UPDATE',
      candidates: [candidate({ provenanceKind: 'PROVISIONAL_MODEL_SIGNAL', confidence: 'PROVISIONAL' })],
      policy,
    })).rejects.toThrow('CARE_MEMORY_PROVISIONAL_SIGNAL_INVALID');
  });

  it('FORGET is selector-scoped and produces a tombstone reference', async () => {
    const repository = new FakeRepository();
    const result = await applyCareMemoryDecision({
      repository,
      subject,
      decision: 'FORGET',
      forget: [{
        memoryKey: 'explicit_preference',
        purposeScope: 'PUBLIC_CARE',
        sourceRef: 'request:sha256:def456',
        observedAtIso: '2026-09-03T03:00:00.000Z',
      }],
      policy,
    });
    expect(repository.forgets).toHaveLength(1);
    expect(result.forgottenMemoryIds).toHaveLength(1);
  });

  it('builds a bounded active/fresh S1-S2 memory context only', () => {
    const base: CareRelationshipMemoryItem = {
      id: '00000000-0000-4000-8000-000000000001',
      subject,
      memoryKey: 'self_stated_current_need',
      valueJson: { need: 'Hiểu bản thân rõ hơn' },
      purposeScope: 'PUBLIC_CARE',
      provenanceKind: 'CUSTOMER_SELF_STATED',
      sourceRef: 'msg:sha256:abc123',
      confidence: 'SELF_STATED',
      freshnessState: 'CURRENT',
      sensitivityClass: 'S2',
      observedAtIso: '2026-09-03T02:59:00.000Z',
      memoryContractVersion: 'p09-memory-v0.1',
      status: 'ACTIVE',
    };
    const lines = buildBoundedMemoryContext([
      base,
      { ...base, id: '00000000-0000-4000-8000-000000000002', memoryKey: 'explicit_preference', valueJson: 'Thích trả lời ngắn' },
      { ...base, id: '00000000-0000-4000-8000-000000000003', freshnessState: 'STALE' },
      { ...base, id: '00000000-0000-4000-8000-000000000004', sensitivityClass: 'S3' },
    ], { maxItems: 2, maxChars: 500 });
    expect(lines).toHaveLength(2);
    expect(lines.join(' ')).toContain('self_stated_current_need');
    expect(lines.join(' ')).toContain('explicit_preference');
  });
});

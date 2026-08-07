import { describe, expect, it } from 'vitest';
import { resolveConcept } from '@/lib/knowledge/concepts';
import { SYNTHETIC_FCP_CONCEPTS, SYNTHETIC_POLICY_CASES } from '@/lib/knowledge/fixtures';
import { resolveKnowledgeIngestPolicy } from '@/lib/knowledge/ingest-policy';

describe('ESSENCE Machine Library M1 policy', () => {
  it('allows current truth content but keeps the decision deterministic', () => {
    expect(resolveKnowledgeIngestPolicy(SYNTHETIC_POLICY_CASES.currentFounderDecision)).toEqual({
      ingestMode: 'content',
      usageMode: 'current_truth',
      runtimeEnabled: true,
      reasonCode: 'CURRENT_CONTENT',
    });
  });

  it('keeps active work separate from current truth', () => {
    const result = resolveKnowledgeIngestPolicy(SYNTHETIC_POLICY_CASES.workingDraft);
    expect(result.ingestMode).toBe('content');
    expect(result.usageMode).toBe('workspace');
  });

  it('keeps distilled knowledge supporting rather than ruling', () => {
    const result = resolveKnowledgeIngestPolicy(SYNTHETIC_POLICY_CASES.distilledNote);
    expect(result.ingestMode).toBe('content');
    expect(result.usageMode).toBe('supporting');
  });

  it('keeps history conditional and out of default runtime retrieval', () => {
    expect(resolveKnowledgeIngestPolicy(SYNTHETIC_POLICY_CASES.historicalSource)).toEqual({
      ingestMode: 'conditional',
      usageMode: 'historical',
      runtimeEnabled: false,
      reasonCode: 'HISTORY_CONDITIONAL',
    });
  });

  it('does not ingest managed copies as duplicate content', () => {
    const result = resolveKnowledgeIngestPolicy(SYNTHETIC_POLICY_CASES.managedCopy);
    expect(result.ingestMode).toBe('metadata_only');
    expect(result.runtimeEnabled).toBe(false);
  });

  it('quarantines unresolved Google Docs suggestions before indexing', () => {
    expect(resolveKnowledgeIngestPolicy(SYNTHETIC_POLICY_CASES.unresolvedGoogleDoc).reasonCode)
      .toBe('UNRESOLVED_SUGGESTIONS_QUARANTINE');
  });

  it('quarantines sensitive signals even when the file is placed in an allowed folder', () => {
    const result = resolveKnowledgeIngestPolicy(SYNTHETIC_POLICY_CASES.misfiledSensitiveCase);
    expect(result.ingestMode).toBe('quarantine');
    expect(result.runtimeEnabled).toBe(false);
  });

  it('hard denies the private vault and child-sensitive material', () => {
    expect(resolveKnowledgeIngestPolicy(SYNTHETIC_POLICY_CASES.privateVault).ingestMode).toBe('deny');
    expect(resolveKnowledgeIngestPolicy(SYNTHETIC_POLICY_CASES.childSensitive).ingestMode).toBe('deny');
  });
});

describe('ESSENCE concept identity M1 fixtures', () => {
  it('treats bare FCP as an ambiguous alias', () => {
    const result = resolveConcept('FCP', SYNTHETIC_FCP_CONCEPTS);
    expect(result.status).toBe('ambiguous');
    if (result.status === 'ambiguous') {
      expect(result.concepts.map((item) => item.canonicalName)).toEqual([
        'Full Cycle Process',
        'Future Casting Protocol',
      ]);
    }
  });

  it('resolves Full Cycle Process by its explicit name', () => {
    const result = resolveConcept('Full Cycle Process', SYNTHETIC_FCP_CONCEPTS);
    expect(result.status).toBe('resolved');
    if (result.status === 'resolved') {
      expect(result.concept.scopes).toContain('operating / journey context');
    }
  });

  it('resolves Future Casting Protocol by its explicit name without changing lifecycle', () => {
    const result = resolveConcept('Future Casting Protocol', SYNTHETIC_FCP_CONCEPTS);
    expect(result.status).toBe('resolved');
    if (result.status === 'resolved') {
      expect(result.concept.scopes).toContain('internal coaching protocol');
    }
  });

  it('uses scope to disambiguate the shared FCP alias', () => {
    const process = resolveConcept('FCP', SYNTHETIC_FCP_CONCEPTS, 'operating / journey context');
    const protocol = resolveConcept('FCP', SYNTHETIC_FCP_CONCEPTS, 'internal coaching protocol');

    expect(process.status).toBe('resolved');
    expect(protocol.status).toBe('resolved');

    if (process.status === 'resolved') expect(process.concept.canonicalName).toBe('Full Cycle Process');
    if (protocol.status === 'resolved') expect(protocol.concept.canonicalName).toBe('Future Casting Protocol');
  });
});

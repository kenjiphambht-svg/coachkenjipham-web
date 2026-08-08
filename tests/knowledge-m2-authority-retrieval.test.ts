import { describe, expect, it } from 'vitest';
import { SYNTHETIC_FCP_CONCEPTS } from '@/lib/knowledge/fixtures';
import { planKnowledgeRetrieval } from '@/lib/knowledge/retrieval-decision';
import { retrieveKnowledge, type RetrievalCandidate } from '@/lib/knowledge/retrieval';

const candidates: RetrievalCandidate[] = [
  {
    sourceId: '1mesUGKdxyJaOftEsmsXwtYtCwHS5_MRJEAZvAptF-Go',
    sourceCode: 'FOUNDER_DECISION_REGISTER',
    title: 'Founder Decision Register',
    unitId: 'fd-fcp',
    headingPath: ['FD-2026-014'],
    rawText: 'FCP is an alias shared by Full Cycle Process and Future Casting Protocol.',
    retrievalText:
      'Founder Decision Register FD-2026-014 FCP Full Cycle Process operating journey Future Casting Protocol internal coaching ambiguous alias',
    authorityLevel: 'L0',
    authorityScope: [],
    lifecycle: 'current',
    usageMode: 'current_truth',
    runtimeEnabled: true,
  },
  {
    sourceId: '1TtHF_vQr7NRq8eTCAxjW3pHB9x2b8XWp3yWJB7wW5Dc',
    sourceCode: 'AUTHORITY_MAP_V1_1',
    title: 'Authority Map v1.1',
    unitId: 'authority-map',
    headingPath: ['Authority'],
    rawText: 'Authority hierarchy is L0 through L6 and scope-specific.',
    retrievalText:
      'Authority Map thẩm quyền hierarchy L0 L1 L2 L3 L4 L5 L6 scope current governance',
    authorityLevel: 'L1',
    authorityScope: [],
    lifecycle: 'current',
    usageMode: 'current_truth',
    runtimeEnabled: true,
  },
  {
    sourceId: '1Pf_UmOghUKN2lyuYu22-r7cKr5mNA-sbQiAGwws6dXE',
    sourceCode: 'CANON-003',
    title: 'CANON-003 — FCP hiện hành và ranh giới phương pháp',
    unitId: 'canon-fcp',
    headingPath: ['FCP'],
    rawText:
      'Bare FCP is AMBIGUOUS_ALIAS; Full Cycle Process is operating/journey and Future Casting Protocol is internal coaching protocol.',
    retrievalText:
      'CANON-003 FCP AMBIGUOUS_ALIAS Full Cycle Process operating / journey context Future Casting Protocol internal coaching protocol FD-2026-014',
    authorityLevel: 'L3',
    authorityScope: [],
    lifecycle: 'current',
    usageMode: 'supporting',
    runtimeEnabled: true,
  },
  {
    sourceId: '152dHuGhPVff5j_ggaUDD44xFq_L4UV63uMcD56S66Tw',
    sourceCode: 'LANG_PRODUCT_OPERATING_CONTRACT',
    title: 'Lặng Product Operating Contract',
    unitId: 'lang-flow',
    headingPath: ['Luồng vận hành'],
    rawText:
      'Discovery → Six Questions → Support Report → Kenji Human Decision Gate → Payment → Confirmation → Private Booking → Session → Follow-up.',
    retrievalText:
      'Lặng Product Operating Contract approved flow Discovery Six Questions Support Report Human Decision Gate payment private booking session follow-up',
    authorityLevel: 'L2',
    authorityScope: ['Lặng product operating flow'],
    lifecycle: 'approved',
    usageMode: 'current_truth',
    runtimeEnabled: true,
  },
  {
    sourceId: '1DvdM41-gT0OIYPK0YvRyKV-Lbfsj4TOcyIoeWaJIaJM',
    sourceCode: 'AI_KNOWLEDGE_ARCHITECTURE_DIRECTION',
    title: 'AI Knowledge Backend Architecture Direction',
    unitId: 'architecture-baseline',
    headingPath: ['Architecture baseline'],
    rawText: 'Google Drive is canonical and Machine Library is derived.',
    retrievalText:
      'AI Knowledge Backend Architecture Direction active work package architecture baseline Google Drive canonical Machine Library derived',
    authorityLevel: 'L5',
    authorityScope: ['AI knowledge backend implementation'],
    lifecycle: 'current',
    usageMode: 'workspace',
    runtimeEnabled: true,
  },
  {
    sourceId: '1Ba53y_EQqTCqxX3oHtY9Qm3W4BjPML4_-6Sld_AsyD8',
    sourceCode: 'WIKI-001',
    title: 'WIKI-001 — Current Truth, Snapshot và Lịch sử',
    unitId: 'wiki-current-history',
    headingPath: ['Current Truth'],
    rawText: 'Current Truth is current; Snapshot is point-in-time; Historical Source explains the past.',
    retrievalText:
      'WIKI-001 Current Truth Snapshot Historical Source Second Brain supporting explanation current history',
    authorityLevel: 'L4',
    authorityScope: [],
    lifecycle: 'reference',
    usageMode: 'supporting',
    runtimeEnabled: true,
  },
  {
    sourceId: 'derived-copy',
    sourceCode: 'FOUNDER_DECISION_REFLECTION',
    title: '01_SỔ QUYẾT ĐỊNH — BẢN PHẢN CHIẾU',
    unitId: 'derived',
    headingPath: [],
    rawText: 'Derived reflection only.',
    retrievalText: 'Founder Decision derived reflection copy',
    authorityLevel: 'L4',
    authorityScope: [],
    lifecycle: 'reference',
    usageMode: 'never',
    runtimeEnabled: false,
  },
  {
    sourceId: 'superseded-support',
    sourceCode: 'OLD-FCP',
    title: 'Old FCP supporting note',
    unitId: 'old-fcp',
    headingPath: [],
    rawText: 'Old interpretation.',
    retrievalText: 'FCP Future Casting old interpretation historical',
    authorityLevel: 'L3',
    authorityScope: [],
    lifecycle: 'superseded',
    usageMode: 'supporting',
    runtimeEnabled: true,
  },
];

describe('M2 authority-aware retrieval gold cases', () => {
  it('treats bare FCP as an ambiguous alias and does not auto-resolve one concept', () => {
    const decision = planKnowledgeRetrieval({
      query: 'FCP',
      candidates,
      concepts: SYNTHETIC_FCP_CONCEPTS,
    });

    expect(decision.status).toBe('ambiguous_alias');
    expect(decision.reasonCode).toBe('AMBIGUOUS_ALIAS');
    expect(decision.conceptResolution.status).toBe('ambiguous');
    expect(decision.hits.some((hit) => hit.authorityLevel === 'L0')).toBe(true);
  });

  it('resolves Full Cycle Process into operating/journey scope', () => {
    const decision = planKnowledgeRetrieval({
      query: 'Full Cycle Process',
      candidates,
      concepts: SYNTHETIC_FCP_CONCEPTS,
    });

    expect(decision.status).toBe('ready');
    expect(decision.requestedScope).toBe('operating / journey context');
    expect(decision.conceptResolution).toMatchObject({ status: 'resolved' });
  });

  it('resolves Future Casting Protocol into internal coaching scope', () => {
    const decision = planKnowledgeRetrieval({
      query: 'Future Casting Protocol',
      candidates,
      concepts: SYNTHETIC_FCP_CONCEPTS,
    });

    expect(decision.status).toBe('ready');
    expect(decision.requestedScope).toBe('internal coaching protocol');
  });

  it('ranks current Authority Map above supporting memory for authority questions', () => {
    const hits = retrieveKnowledge('thẩm quyền current', candidates);
    expect(hits[0]?.sourceCode).toBe('AUTHORITY_MAP_V1_1');
    expect(hits[0]?.authorityLevel).toBe('L1');
  });

  it('keeps an active work-package architecture baseline out of default current truth', () => {
    const defaultHits = retrieveKnowledge('architecture baseline Machine Library', candidates);
    expect(defaultHits.some((hit) => hit.sourceCode === 'AI_KNOWLEDGE_ARCHITECTURE_DIRECTION')).toBe(false);

    const workspaceHits = retrieveKnowledge('architecture baseline Machine Library', candidates, {
      includeWorkspace: true,
    });
    expect(workspaceHits[0]?.sourceCode).toBe('AI_KNOWLEDGE_ARCHITECTURE_DIRECTION');
  });

  it('keeps an approved L2 product contract eligible as current operational policy', () => {
    const hits = retrieveKnowledge('Lặng flow Human Decision Gate', candidates);
    expect(hits[0]?.sourceCode).toBe('LANG_PRODUCT_OPERATING_CONTRACT');
    expect(hits[0]?.authorityLevel).toBe('L2');
  });

  it('keeps WIKI-001 supporting rather than authority', () => {
    const hits = retrieveKnowledge('WIKI-001', candidates);
    expect(hits[0]).toMatchObject({
      sourceCode: 'WIKI-001',
      authorityLevel: 'L4',
      usageMode: 'supporting',
    });
  });

  it('never retrieves a disabled derived reflection copy', () => {
    const hits = retrieveKnowledge('Founder Decision derived reflection', candidates);
    expect(hits.some((hit) => hit.sourceId === 'derived-copy')).toBe(false);
  });

  it('does not retrieve superseded supporting material by default', () => {
    const hits = retrieveKnowledge('old interpretation historical', candidates);
    expect(hits.some((hit) => hit.sourceId === 'superseded-support')).toBe(false);
  });

  it('returns insufficient evidence instead of inventing an answer', () => {
    const decision = planKnowledgeRetrieval({
      query: 'official refund policy 2030',
      candidates,
      concepts: SYNTHETIC_FCP_CONCEPTS,
    });
    expect(decision).toMatchObject({
      status: 'insufficient_evidence',
      reasonCode: 'NO_ELIGIBLE_EVIDENCE',
    });
  });
});

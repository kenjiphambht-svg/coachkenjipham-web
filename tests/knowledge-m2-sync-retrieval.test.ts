import { describe, expect, it } from 'vitest';
import {
  ESSENCE_DRIVE_ROOT_ID,
  ESSENCE_DRIVE_ROOTS,
  getDriveRootPolicy,
  resolveRootZoneFromAncestors,
} from '@/lib/knowledge/drive-root-map';
import {
  GOOGLE_DOC_MIME,
  hashUtf8Sha256,
  normalizeTextForHash,
  planDriveSync,
} from '@/lib/knowledge/drive-sync';
import { normalizeKnowledgeText } from '@/lib/knowledge/normalize';
import { retrieveKnowledge, type RetrievalCandidate } from '@/lib/knowledge/retrieval';

const CURRENT_ID = '1yoB3Cx2h8ysVaFmk5WnpogIAHl0qnCbC';
const WORK_ID = '19_XFMNtqRd4k_KQhj9x01tTaKxi_YPHq';
const DISTILLED_ID = '1cJZ2LA9wvQPOc7ik4whiZgiWpI6kVHZ5';
const HISTORY_ID = '1wBXJcUZeSDBfKx4d_kNPTe3gLBvnqviS';
const PRIVATE_ID = '1IlxV2oS1oVUVfL1NJ_Gx8AjMokCIwaZG';

function doc(overrides: Partial<Parameters<typeof planDriveSync>[0]> = {}) {
  return {
    id: 'file-12345678',
    name: 'Founder Decision',
    mimeType: GOOGLE_DOC_MIME,
    parentIds: ['parent'],
    ancestorFolderIds: [CURRENT_ID, ESSENCE_DRIVE_ROOT_ID],
    sensitivity: 'internal' as const,
    ...overrides,
  };
}

describe('M2 Drive root policy', () => {
  it('pins the canonical ESSENCE library root and seven top-level zones', () => {
    expect(ESSENCE_DRIVE_ROOT_ID).toBe('1bBKDZR-HTAr1bSgnex-DfvLUspMcfawY');
    expect(ESSENCE_DRIVE_ROOTS).toHaveLength(7);
  });

  it('keeps 99 private out of background Machine Library sync', () => {
    expect(getDriveRootPolicy(PRIVATE_ID)?.crawl).toBe('deny');
  });

  it('resolves the first known governed ancestor', () => {
    expect(resolveRootZoneFromAncestors(['nested', DISTILLED_ID])?.rootZone).toBe('03_distilled');
  });

  it('fails closed for a file outside the governed root map', () => {
    expect(planDriveSync(doc({ ancestorFolderIds: ['outside'] }))).toMatchObject({
      action: 'purge',
      reasonCode: 'PERMISSION_OR_SCOPE_LOST',
    });
  });
});

describe('M2 Drive sync planner', () => {
  it('ingests current-zone canonical content', () => {
    expect(planDriveSync(doc())).toMatchObject({
      action: 'ingest_content',
      rootZone: '01_current',
      usageMode: 'current_truth',
      runtimeEnabled: true,
    });
  });

  it('keeps current work as workspace content', () => {
    expect(planDriveSync(doc({ ancestorFolderIds: [WORK_ID] }))).toMatchObject({
      action: 'ingest_content',
      rootZone: '02_work',
      usageMode: 'workspace',
    });
  });

  it('keeps history metadata-only by default', () => {
    expect(planDriveSync(doc({ ancestorFolderIds: [HISTORY_ID] }))).toMatchObject({
      action: 'metadata_only',
      rootZone: '04_history',
      runtimeEnabled: false,
    });
  });

  it('purges anything in 99 private', () => {
    expect(planDriveSync(doc({ ancestorFolderIds: [PRIVATE_ID] }))).toMatchObject({
      action: 'purge',
      reasonCode: 'DENY_ZONE',
    });
  });

  it('purges removed or trashed files', () => {
    expect(planDriveSync(doc({ removed: true }))).toMatchObject({
      action: 'purge',
      reasonCode: 'REMOVED_OR_TRASHED',
    });
  });

  it('quarantines unresolved Google Docs suggestions', () => {
    expect(planDriveSync(doc({ hasUnresolvedSuggestions: true }))).toMatchObject({
      action: 'quarantine',
      reasonCode: 'UNRESOLVED_SUGGESTIONS_QUARANTINE',
    });
  });

  it('does not content-ingest derived copies', () => {
    expect(planDriveSync(doc({ sourceKind: 'export' }))).toMatchObject({
      action: 'metadata_only',
      reasonCode: 'DERIVED_COPY_METADATA_ONLY',
    });
  });
});

describe('M2 deterministic normalization', () => {
  it('preserves heading path and separates raw from retrieval text', () => {
    const units = normalizeKnowledgeText({
      documentTitle: 'FD-2026-014',
      text: '# FCP\n\n## Full Cycle Process\n\nOperating / journey context.\n\n## Future Casting Protocol\n\nInternal coaching protocol.',
    });
    expect(units).toHaveLength(2);
    expect(units[0].headingPath).toEqual(['FCP', 'Full Cycle Process']);
    expect(units[0].rawText).toBe('Operating / journey context.');
    expect(units[0].retrievalText).toContain('FD-2026-014 > FCP > Full Cycle Process');
    expect(units[1].headingPath).toEqual(['FCP', 'Future Casting Protocol']);
  });

  it('normalizes line endings before hashing', () => {
    const a = normalizeTextForHash('A  \r\nB\r\n');
    const b = normalizeTextForHash('A\nB');
    expect(a).toBe(b);
    expect(hashUtf8Sha256(a)).toBe(hashUtf8Sha256(b));
  });
});

describe('M2 exact + lexical retrieval', () => {
  const candidates: RetrievalCandidate[] = [
    {
      sourceId: 's1',
      sourceCode: 'FD-2026-014',
      title: 'Founder Decision FCP',
      unitId: 'u1',
      headingPath: ['Full Cycle Process'],
      rawText: 'Full Cycle Process applies to operating and journey context.',
      retrievalText: 'FD-2026-014 Founder Decision FCP Full Cycle Process operating journey context',
      authorityLevel: 'L0',
      authorityScope: ['operating_journey'],
      lifecycle: 'current',
      usageMode: 'current_truth',
      runtimeEnabled: true,
    },
    {
      sourceId: 's2',
      sourceCode: 'M2',
      title: 'Internal Method Source',
      unitId: 'u2',
      headingPath: ['Future Casting Protocol'],
      rawText: 'Future Casting Protocol is an internal coaching protocol.',
      retrievalText: 'M2 Future Casting Protocol internal coaching protocol FCP',
      authorityLevel: 'L3',
      authorityScope: ['internal_coaching_protocol'],
      lifecycle: 'reference',
      usageMode: 'supporting',
      runtimeEnabled: true,
    },
    {
      sourceId: 's3',
      sourceCode: 'DRAFT-1',
      title: 'Draft FCP note',
      unitId: 'u3',
      headingPath: [],
      rawText: 'Draft only.',
      retrievalText: 'FCP draft workspace',
      authorityLevel: 'L6',
      authorityScope: [],
      lifecycle: 'draft',
      usageMode: 'workspace',
      runtimeEnabled: true,
    },
  ];

  it('prioritizes exact source identifiers', () => {
    const hits = retrieveKnowledge('FD-2026-014', candidates);
    expect(hits[0]).toMatchObject({ sourceId: 's1', matchType: 'exact_source_code', score: 1000 });
  });

  it('finds Vietnamese/ASCII lexical tokens deterministically', () => {
    const hits = retrieveKnowledge('Future Casting Protocol coaching', candidates);
    expect(hits[0]?.sourceId).toBe('s2');
  });

  it('does not include workspace draft by default', () => {
    const hits = retrieveKnowledge('draft workspace', candidates);
    expect(hits).toHaveLength(0);
  });

  it('can include workspace only when explicitly requested', () => {
    const hits = retrieveKnowledge('draft workspace', candidates, { includeWorkspace: true });
    expect(hits[0]?.sourceId).toBe('s3');
  });

  it('respects an explicit authority scope', () => {
    const hits = retrieveKnowledge('FCP', candidates, { scope: 'internal_coaching_protocol' });
    expect(hits.some((hit) => hit.sourceId === 's1')).toBe(false);
    expect(hits.some((hit) => hit.sourceId === 's2')).toBe(true);
  });
});

import type {
  AuthorityLevel,
  KnowledgeLifecycle,
  KnowledgeUsageMode,
} from './contracts';

export type RetrievalCandidate = {
  sourceId: string;
  sourceCode?: string | null;
  title: string;
  unitId: string;
  headingPath: readonly string[];
  rawText: string;
  retrievalText: string;
  authorityLevel: AuthorityLevel;
  authorityScope: readonly string[];
  lifecycle: KnowledgeLifecycle;
  usageMode: KnowledgeUsageMode;
  runtimeEnabled: boolean;
};

export type RetrievalHit = RetrievalCandidate & {
  score: number;
  matchType: 'exact_source_code' | 'exact_title' | 'lexical';
};

const LIFECYCLE_CURRENT_ELIGIBLE = new Set<KnowledgeLifecycle>(['current', 'approved']);
const LIFECYCLE_SUPPORTING_ELIGIBLE = new Set<KnowledgeLifecycle>(['current', 'approved', 'reference']);

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('vi')
    .replace(/[^a-z0-9_./-]+/g, ' ')
    .trim();
}

function tokens(value: string): string[] {
  return normalize(value).split(/\s+/).filter(Boolean);
}

function scopeMatches(candidateScopes: readonly string[], requestedScope?: string): boolean {
  if (!requestedScope) return true;
  const request = normalize(requestedScope);
  return candidateScopes.length === 0 || candidateScopes.some((scope) => normalize(scope) === request);
}

export function retrieveKnowledge(
  query: string,
  candidates: readonly RetrievalCandidate[],
  options?: {
    scope?: string;
    includeWorkspace?: boolean;
    includeHistorical?: boolean;
    limit?: number;
  }
): RetrievalHit[] {
  const normalizedQuery = normalize(query);
  const queryTokens = new Set(tokens(query));
  if (!normalizedQuery) return [];

  const hits: RetrievalHit[] = [];

  for (const candidate of candidates) {
    if (!candidate.runtimeEnabled) continue;
    if (!scopeMatches(candidate.authorityScope, options?.scope)) continue;

    const currentEligible = LIFECYCLE_CURRENT_ELIGIBLE.has(candidate.lifecycle);
    const workspaceEligible =
      options?.includeWorkspace === true &&
      candidate.usageMode === 'workspace' &&
      ['draft', 'proposal', 'current', 'approved'].includes(candidate.lifecycle);
    const historicalEligible =
      options?.includeHistorical === true &&
      candidate.usageMode === 'historical' &&
      ['snapshot', 'superseded', 'historical', 'reference'].includes(candidate.lifecycle);
    const supportingEligible =
      candidate.usageMode === 'supporting' &&
      LIFECYCLE_SUPPORTING_ELIGIBLE.has(candidate.lifecycle);
    if (!(currentEligible || workspaceEligible || historicalEligible || supportingEligible)) continue;

    const sourceCode = candidate.sourceCode ? normalize(candidate.sourceCode) : '';
    const title = normalize(candidate.title);

    if (sourceCode && sourceCode === normalizedQuery) {
      hits.push({ ...candidate, score: 1000, matchType: 'exact_source_code' });
      continue;
    }
    if (title === normalizedQuery) {
      hits.push({ ...candidate, score: 900, matchType: 'exact_title' });
      continue;
    }

    const haystackTokens = new Set(tokens(candidate.retrievalText));
    let overlap = 0;
    for (const token of queryTokens) {
      if (haystackTokens.has(token)) overlap += 1;
    }
    if (overlap === 0) continue;

    const coverage = overlap / Math.max(queryTokens.size, 1);
    const authorityWeight = 7 - Number(candidate.authorityLevel.slice(1));
    const lifecycleWeight = currentEligible ? 3 : supportingEligible ? 1 : 0;
    const score = coverage * 100 + authorityWeight + lifecycleWeight;
    hits.push({ ...candidate, score, matchType: 'lexical' });
  }

  return hits
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, 'vi'))
    .slice(0, options?.limit ?? 8);
}

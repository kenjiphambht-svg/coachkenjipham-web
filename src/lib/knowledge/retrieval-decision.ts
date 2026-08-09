import { resolveConcept } from './concepts';
import type { ConceptDefinition, ConceptResolution } from './contracts';
import {
  retrieveKnowledge,
  type RetrievalCandidate,
  type RetrievalHit,
} from './retrieval';

export type RetrievalDecisionStatus =
  | 'ready'
  | 'ambiguous_alias'
  | 'insufficient_evidence';

export type RetrievalDecision = {
  status: RetrievalDecisionStatus;
  query: string;
  requestedScope?: string;
  conceptResolution: ConceptResolution;
  hits: readonly RetrievalHit[];
  reasonCode:
    | 'EVIDENCE_READY'
    | 'AMBIGUOUS_ALIAS'
    | 'NO_ELIGIBLE_EVIDENCE';
};

export function planKnowledgeRetrieval(input: {
  query: string;
  candidates: readonly RetrievalCandidate[];
  concepts?: readonly ConceptDefinition[];
  scope?: string;
  includeWorkspace?: boolean;
  includeHistorical?: boolean;
  limit?: number;
}): RetrievalDecision {
  const conceptResolution = resolveConcept(
    input.query,
    input.concepts ?? [],
    input.scope
  );

  if (conceptResolution.status === 'ambiguous') {
    return {
      status: 'ambiguous_alias',
      query: input.query,
      requestedScope: input.scope,
      conceptResolution,
      hits: retrieveKnowledge(input.query, input.candidates, {
        scope: input.scope,
        includeWorkspace: input.includeWorkspace,
        includeHistorical: input.includeHistorical,
        limit: input.limit,
      }),
      reasonCode: 'AMBIGUOUS_ALIAS',
    };
  }

  const resolvedScope =
    input.scope ??
    (conceptResolution.status === 'resolved' && conceptResolution.concept.scopes.length === 1
      ? conceptResolution.concept.scopes[0]
      : undefined);

  const hits = retrieveKnowledge(input.query, input.candidates, {
    scope: resolvedScope,
    includeWorkspace: input.includeWorkspace,
    includeHistorical: input.includeHistorical,
    limit: input.limit,
  });

  if (hits.length === 0) {
    return {
      status: 'insufficient_evidence',
      query: input.query,
      requestedScope: resolvedScope,
      conceptResolution,
      hits,
      reasonCode: 'NO_ELIGIBLE_EVIDENCE',
    };
  }

  return {
    status: 'ready',
    query: input.query,
    requestedScope: resolvedScope,
    conceptResolution,
    hits,
    reasonCode: 'EVIDENCE_READY',
  };
}

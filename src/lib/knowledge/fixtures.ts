import type { ConceptDefinition, KnowledgePolicyInput } from './contracts';

export const SYNTHETIC_FCP_CONCEPTS: readonly ConceptDefinition[] = [
  {
    conceptId: 'SYN-CONCEPT-FULL-CYCLE-PROCESS',
    canonicalName: 'Full Cycle Process',
    aliases: ['FCP'],
    scopes: ['operating / journey context'],
  },
  {
    conceptId: 'SYN-CONCEPT-FUTURE-CASTING-PROTOCOL',
    canonicalName: 'Future Casting Protocol',
    aliases: ['FCP'],
    scopes: ['internal coaching protocol'],
  },
] as const;

export const SYNTHETIC_POLICY_CASES: Record<string, KnowledgePolicyInput> = {
  currentFounderDecision: {
    rootZone: '01_current',
    sourceKind: 'canonical',
    sensitivity: 'internal',
  },
  workingDraft: {
    rootZone: '02_work',
    sourceKind: 'canonical',
    sensitivity: 'internal',
  },
  distilledNote: {
    rootZone: '03_distilled',
    sourceKind: 'canonical',
    sensitivity: 'internal',
  },
  historicalSource: {
    rootZone: '04_history',
    sourceKind: 'canonical',
    sensitivity: 'internal',
  },
  managedCopy: {
    rootZone: '03_distilled',
    sourceKind: 'managed_copy',
    sensitivity: 'internal',
  },
  unresolvedGoogleDoc: {
    rootZone: '01_current',
    sourceKind: 'canonical',
    sensitivity: 'internal',
    hasUnresolvedSuggestions: true,
  },
  misfiledSensitiveCase: {
    rootZone: '02_work',
    sourceKind: 'canonical',
    sensitivity: 'internal',
    hasSensitiveSignals: true,
  },
  privateVault: {
    rootZone: '99_private',
    sourceKind: 'canonical',
    sensitivity: 'private',
  },
  childSensitive: {
    rootZone: '02_work',
    sourceKind: 'canonical',
    sensitivity: 'child_sensitive',
  },
};

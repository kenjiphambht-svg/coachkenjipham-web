export type AuthorityLevel = 'L0' | 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6';

export type KnowledgeRootZone =
  | '00_start'
  | '01_current'
  | '02_work'
  | '03_distilled'
  | '04_history'
  | '90_governance'
  | '99_private'
  | 'external';

export type KnowledgeSourceKind =
  | 'canonical'
  | 'managed_copy'
  | 'export'
  | 'interface'
  | 'navigation'
  | 'external_source';

export type KnowledgeSourceRole =
  | 'ruling'
  | 'current_truth'
  | 'contract'
  | 'canonical'
  | 'supporting'
  | 'workspace'
  | 'implementation_evidence'
  | 'historical'
  | 'governance';

export type KnowledgeLifecycle =
  | 'current'
  | 'approved'
  | 'draft'
  | 'proposal'
  | 'reference'
  | 'snapshot'
  | 'superseded'
  | 'historical'
  | 'conflict';

export type KnowledgeSensitivity =
  | 'public'
  | 'internal'
  | 'restricted'
  | 'private'
  | 'child_sensitive';

export type KnowledgeUsageMode =
  | 'current_truth'
  | 'workspace'
  | 'supporting'
  | 'historical'
  | 'governance'
  | 'never';

export type KnowledgeIngestMode =
  | 'content'
  | 'metadata_only'
  | 'conditional'
  | 'deny'
  | 'quarantine';

export type KnowledgePolicyInput = {
  rootZone: KnowledgeRootZone;
  sourceKind: KnowledgeSourceKind;
  sensitivity: KnowledgeSensitivity;
  hasUnresolvedSuggestions?: boolean;
  hasSensitiveSignals?: boolean;
};

export type KnowledgePolicyDecision = {
  ingestMode: KnowledgeIngestMode;
  usageMode: KnowledgeUsageMode;
  runtimeEnabled: boolean;
  reasonCode:
    | 'PRIVATE_HARD_DENY'
    | 'CHILD_SENSITIVE_HARD_DENY'
    | 'PRIVATE_ZONE_HARD_DENY'
    | 'UNRESOLVED_SUGGESTIONS_QUARANTINE'
    | 'SENSITIVE_SIGNAL_QUARANTINE'
    | 'DERIVED_COPY_METADATA_ONLY'
    | 'NAVIGATION_METADATA_ONLY'
    | 'CURRENT_CONTENT'
    | 'WORKSPACE_CONTENT'
    | 'DISTILLED_SUPPORTING_CONTENT'
    | 'HISTORY_CONDITIONAL'
    | 'GOVERNANCE_CONDITIONAL'
    | 'EXTERNAL_CONDITIONAL';
};

export type ConceptDefinition = {
  conceptId: string;
  canonicalName: string;
  aliases: readonly string[];
  scopes: readonly string[];
};

export type ConceptResolution =
  | { status: 'not_found' }
  | { status: 'resolved'; concept: ConceptDefinition }
  | { status: 'ambiguous'; concepts: readonly ConceptDefinition[] };

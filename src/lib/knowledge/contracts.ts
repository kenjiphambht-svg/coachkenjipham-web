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
  | 'protected_on_demand'
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
  /** Persistent/background Machine Library ingest policy. */
  ingestMode: KnowledgeIngestMode;
  /** Permitted knowledge-use class. `protected_on_demand` is not background retrieval. */
  usageMode: KnowledgeUsageMode;
  /** Whether the persisted Machine Library may surface this source in default runtime retrieval. */
  runtimeEnabled: boolean;
  /** Whether a separate purpose/access-gated source reader may use the canonical source on demand. */
  onDemandReadAllowed?: boolean;
  reasonCode:
    | 'PROTECTED_PRIVATE_NO_BACKGROUND_INGEST'
    | 'PROTECTED_CHILD_NO_BACKGROUND_INGEST'
    | 'PROTECTED_ZONE_NO_BACKGROUND_INGEST'
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

import type {
  KnowledgePolicyDecision,
  KnowledgePolicyInput,
} from './contracts';

const DERIVED_METADATA_KINDS = new Set([
  'managed_copy',
  'export',
  'interface',
  'navigation',
]);

/**
 * This policy governs persistent/background Machine Library ingest.
 *
 * FD-2026-016 distinction:
 * - protected/private/child-sensitive sources are NOT copied into the default
 *   Machine Library or surfaced through default runtime retrieval;
 * - this is not a statement that Founder/authorized AI may never read them;
 * - a separate purpose/access-gated on-demand source reader may use the
 *   canonical source when the task is authorized and auditable.
 */
export function resolveKnowledgeIngestPolicy(
  input: KnowledgePolicyInput
): KnowledgePolicyDecision {
  if (input.sensitivity === 'child_sensitive') {
    return {
      ingestMode: 'deny',
      usageMode: 'protected_on_demand',
      runtimeEnabled: false,
      onDemandReadAllowed: true,
      reasonCode: 'PROTECTED_CHILD_NO_BACKGROUND_INGEST',
    };
  }

  if (input.sensitivity === 'private') {
    return {
      ingestMode: 'deny',
      usageMode: 'protected_on_demand',
      runtimeEnabled: false,
      onDemandReadAllowed: true,
      reasonCode: 'PROTECTED_PRIVATE_NO_BACKGROUND_INGEST',
    };
  }

  if (input.rootZone === '99_private') {
    return {
      ingestMode: 'deny',
      usageMode: 'protected_on_demand',
      runtimeEnabled: false,
      onDemandReadAllowed: true,
      reasonCode: 'PROTECTED_ZONE_NO_BACKGROUND_INGEST',
    };
  }

  if (input.hasUnresolvedSuggestions) {
    return {
      ingestMode: 'quarantine',
      usageMode: 'never',
      runtimeEnabled: false,
      reasonCode: 'UNRESOLVED_SUGGESTIONS_QUARANTINE',
    };
  }

  if (input.hasSensitiveSignals) {
    return {
      ingestMode: 'quarantine',
      usageMode: 'never',
      runtimeEnabled: false,
      reasonCode: 'SENSITIVE_SIGNAL_QUARANTINE',
    };
  }

  if (DERIVED_METADATA_KINDS.has(input.sourceKind)) {
    return {
      ingestMode: 'metadata_only',
      usageMode: 'governance',
      runtimeEnabled: false,
      reasonCode:
        input.sourceKind === 'navigation'
          ? 'NAVIGATION_METADATA_ONLY'
          : 'DERIVED_COPY_METADATA_ONLY',
    };
  }

  switch (input.rootZone) {
    case '00_start':
      return {
        ingestMode: 'metadata_only',
        usageMode: 'governance',
        runtimeEnabled: false,
        reasonCode: 'NAVIGATION_METADATA_ONLY',
      };
    case '01_current':
      return {
        ingestMode: 'content',
        usageMode: 'current_truth',
        runtimeEnabled: true,
        reasonCode: 'CURRENT_CONTENT',
      };
    case '02_work':
      return {
        ingestMode: 'content',
        usageMode: 'workspace',
        runtimeEnabled: true,
        reasonCode: 'WORKSPACE_CONTENT',
      };
    case '03_distilled':
      return {
        ingestMode: 'content',
        usageMode: 'supporting',
        runtimeEnabled: true,
        reasonCode: 'DISTILLED_SUPPORTING_CONTENT',
      };
    case '04_history':
      return {
        ingestMode: 'conditional',
        usageMode: 'historical',
        runtimeEnabled: false,
        reasonCode: 'HISTORY_CONDITIONAL',
      };
    case '90_governance':
      return {
        ingestMode: 'conditional',
        usageMode: 'governance',
        runtimeEnabled: false,
        reasonCode: 'GOVERNANCE_CONDITIONAL',
      };
    case 'external':
      return {
        ingestMode: 'conditional',
        usageMode: 'supporting',
        runtimeEnabled: false,
        reasonCode: 'EXTERNAL_CONDITIONAL',
      };
    default:
      throw new Error('UNREACHABLE_KNOWLEDGE_ROOT_ZONE');
  }
}

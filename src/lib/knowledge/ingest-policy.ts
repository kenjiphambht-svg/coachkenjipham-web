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

export function resolveKnowledgeIngestPolicy(
  input: KnowledgePolicyInput
): KnowledgePolicyDecision {
  if (input.sensitivity === 'child_sensitive') {
    return {
      ingestMode: 'deny',
      usageMode: 'never',
      runtimeEnabled: false,
      reasonCode: 'CHILD_SENSITIVE_HARD_DENY',
    };
  }

  if (input.sensitivity === 'private') {
    return {
      ingestMode: 'deny',
      usageMode: 'never',
      runtimeEnabled: false,
      reasonCode: 'PRIVATE_HARD_DENY',
    };
  }

  if (input.rootZone === '99_private') {
    return {
      ingestMode: 'deny',
      usageMode: 'never',
      runtimeEnabled: false,
      reasonCode: 'PRIVATE_ZONE_HARD_DENY',
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
  }
}

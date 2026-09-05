import { createHash } from 'node:crypto';
import { careOperabilityEventKey, type CareOperabilityChannel } from './operability';

export type CareQualityChannel = CareOperabilityChannel | 'website' | 'synthetic';
export type CareQualitySurface = 'public' | 'private' | 'synthetic';
export type CareQualityEligibility = 'DET' | 'SEM' | 'HUM';
export type CareQualityCheckResult = 'PASS' | 'FAIL' | 'UNKNOWN' | 'INSUFFICIENT_EVIDENCE' | 'NOT_EVALUATED';
export type CareQualityProviderResult = 'SUCCESS' | 'FAILURE' | 'FALLBACK' | 'NOT_CALLED' | 'UNKNOWN';
export type CareQualityActionState =
  | 'NONE'
  | 'PROPOSED'
  | 'ATTEMPTED'
  | 'PROVIDER_ACCEPTED'
  | 'VERIFIED_SUCCESS'
  | 'FAILED_UNCONFIRMED'
  | 'UNKNOWN';
export type CareQualityTruthStatus = 'VERIFIED' | 'BOUNDED' | 'UNKNOWN' | 'ROUTE_ONLY' | 'SALE_NOT_ACTIVE_OR_NOT_VERIFIED';
export type CareQualityRootCauseHint =
  | 'RUNTIME_CAPABILITY_FAIL'
  | 'MEMORY/IDENTITY_ISSUE'
  | 'SOURCE_TRUTH_GAP';

const SAFE_REF = /^[A-Za-z0-9._:/-]{1,120}$/;
const SAFE_CODE = /^[A-Z0-9_:/.-]{1,120}$/;
const MAX_SAFE_REFS = 12;
const MAX_SAFE_CODES = 16;

export interface CareQualityEvidenceInput {
  eventKey: string;
  channel: CareQualityChannel;
  surface: CareQualitySurface;
  customerMode: boolean;
  observedRuntimeReleaseId: string;
  brainReleaseId?: string | null;
  truthVersion?: string | null;
  capabilityVersion?: string | null;
  guardVersion?: string | null;
  memoryContractVersion?: string | null;
  salesSkillVersion?: string | null;
  retrievalSourceIds?: string[];
  guardHitCodes?: string[];
  contextDegraded?: boolean;
  providerResultClass?: CareQualityProviderResult;
  providerLatencyMs?: number;
  providerAttemptCount?: number;
  actionState?: CareQualityActionState;
  runtimeOutcome?: string;
  suppressionActive?: boolean;
  serviceOpen?: boolean;
  recoveryOpen?: boolean;
  journeyRef?: string | null;
  openLoopRef?: string | null;
  reviewCaseRef?: string | null;
  truthStatus?: CareQualityTruthStatus;
  privateMemoryUsed?: boolean;
  commercialActionProposed?: boolean;
  completionClaimed?: boolean;
  exactMechanicClaimed?: boolean;
  capabilityClaimed?: boolean;
  capabilityAvailable?: boolean | null;
  staleMemoryUsed?: boolean;
  customerCorrectionPresent?: boolean;
  currentJobSupersedesMemory?: boolean;
  productCode?: string | null;
  journeyCadence?: string | null;
}

export interface CareQualityEvidence extends CareQualityEvidenceInput {
  retrievalSourceIds: string[];
  guardHitCodes: string[];
  contextDegraded: boolean;
  providerResultClass: CareQualityProviderResult;
  providerAttemptCount: number;
  actionState: CareQualityActionState;
  suppressionActive: boolean;
  serviceOpen: boolean;
  recoveryOpen: boolean;
  privateMemoryUsed: boolean;
  commercialActionProposed: boolean;
  completionClaimed: boolean;
  exactMechanicClaimed: boolean;
  capabilityClaimed: boolean;
  staleMemoryUsed: boolean;
  customerCorrectionPresent: boolean;
  currentJobSupersedesMemory: boolean;
}

export interface CareQualityResult {
  checkCode: string;
  eligibility: CareQualityEligibility;
  result: CareQualityCheckResult;
  hardFailFamilies: string[];
  rootCauseHint?: CareQualityRootCauseHint;
  reasonCode: string;
}

function safeRef(value: string | null | undefined, field: string): string | null | undefined {
  if (value == null) return value;
  if (!SAFE_REF.test(value)) throw new Error(`CARE_QUALITY_${field}_INVALID`);
  return value;
}

function safeCode(value: string | null | undefined, field: string): string | null | undefined {
  if (value == null) return value;
  if (!SAFE_CODE.test(value)) throw new Error(`CARE_QUALITY_${field}_INVALID`);
  return value;
}

function boundedRefs(values: string[] | undefined, field: string): string[] {
  const items = values ?? [];
  if (items.length > MAX_SAFE_REFS) throw new Error(`CARE_QUALITY_${field}_TOO_MANY`);
  return items.map((value) => safeRef(value, field) as string);
}

function boundedCodes(values: string[] | undefined, field: string): string[] {
  const items = values ?? [];
  if (items.length > MAX_SAFE_CODES) throw new Error(`CARE_QUALITY_${field}_TOO_MANY`);
  return items.map((value) => safeCode(value, field) as string);
}

function boundedInteger(value: number | undefined, field: string, min: number, max: number, fallback: number): number {
  const actual = value ?? fallback;
  if (!Number.isInteger(actual) || actual < min || actual > max) throw new Error(`CARE_QUALITY_${field}_INVALID`);
  return actual;
}

export function careQualityEventKey(channel: CareQualityChannel, externalEventId: string): string {
  const normalized = externalEventId.trim();
  if (!normalized) throw new Error('CARE_QUALITY_EVENT_ID_REQUIRED');
  if (channel === 'facebook_messenger' || channel === 'facebook_comment' || channel === 'instagram') {
    return careOperabilityEventKey(channel, normalized);
  }
  return createHash('sha256').update(`${channel}\u0000${normalized}`, 'utf8').digest('hex');
}

export function minimizeCareQualityEvidence(input: CareQualityEvidenceInput): CareQualityEvidence {
  if (!/^[0-9a-f]{64}$/i.test(input.eventKey)) throw new Error('CARE_QUALITY_EVENT_KEY_INVALID');
  safeRef(input.observedRuntimeReleaseId, 'RUNTIME_RELEASE');
  safeRef(input.brainReleaseId, 'BRAIN_RELEASE');
  safeRef(input.truthVersion, 'TRUTH_VERSION');
  safeRef(input.capabilityVersion, 'CAPABILITY_VERSION');
  safeRef(input.guardVersion, 'GUARD_VERSION');
  safeRef(input.memoryContractVersion, 'MEMORY_CONTRACT_VERSION');
  safeRef(input.salesSkillVersion, 'SALES_SKILL_VERSION');
  safeRef(input.journeyRef, 'JOURNEY_REF');
  safeRef(input.openLoopRef, 'OPEN_LOOP_REF');
  safeRef(input.reviewCaseRef, 'REVIEW_CASE_REF');
  safeCode(input.runtimeOutcome, 'RUNTIME_OUTCOME');
  safeCode(input.productCode, 'PRODUCT_CODE');
  safeCode(input.journeyCadence, 'JOURNEY_CADENCE');

  const providerLatencyMs = input.providerLatencyMs === undefined
    ? undefined
    : boundedInteger(input.providerLatencyMs, 'PROVIDER_LATENCY_MS', 0, 120_000, 0);

  return {
    ...input,
    retrievalSourceIds: boundedRefs(input.retrievalSourceIds, 'RETRIEVAL_SOURCE_IDS'),
    guardHitCodes: boundedCodes(input.guardHitCodes, 'GUARD_HIT_CODES'),
    contextDegraded: Boolean(input.contextDegraded),
    providerResultClass: input.providerResultClass ?? 'UNKNOWN',
    providerLatencyMs,
    providerAttemptCount: boundedInteger(input.providerAttemptCount, 'PROVIDER_ATTEMPT_COUNT', 0, 8, 0),
    actionState: input.actionState ?? 'UNKNOWN',
    suppressionActive: Boolean(input.suppressionActive),
    serviceOpen: Boolean(input.serviceOpen),
    recoveryOpen: Boolean(input.recoveryOpen),
    privateMemoryUsed: Boolean(input.privateMemoryUsed),
    commercialActionProposed: Boolean(input.commercialActionProposed),
    completionClaimed: Boolean(input.completionClaimed),
    exactMechanicClaimed: Boolean(input.exactMechanicClaimed),
    capabilityClaimed: Boolean(input.capabilityClaimed),
    staleMemoryUsed: Boolean(input.staleMemoryUsed),
    customerCorrectionPresent: Boolean(input.customerCorrectionPresent),
    currentJobSupersedesMemory: Boolean(input.currentJobSupersedesMemory),
  };
}

function result(args: Omit<CareQualityResult, 'hardFailFamilies'> & { hardFailFamilies?: string[] }): CareQualityResult {
  return { ...args, hardFailFamilies: args.hardFailFamilies ?? [] };
}

function exactVersionTrace(evidence: CareQualityEvidence): CareQualityResult {
  const required = [
    evidence.observedRuntimeReleaseId,
    evidence.truthVersion,
    evidence.capabilityVersion,
    evidence.guardVersion,
    evidence.memoryContractVersion,
  ];
  if (required.some((value) => !value)) {
    return result({
      checkCode: 'VERSION_TRACE',
      eligibility: 'DET',
      result: 'INSUFFICIENT_EVIDENCE',
      reasonCode: 'CARE_QUALITY_VERSION_TRACE_INCOMPLETE',
    });
  }
  return result({
    checkCode: 'VERSION_TRACE',
    eligibility: 'DET',
    result: 'PASS',
    reasonCode: evidence.brainReleaseId ? 'CARE_QUALITY_VERSION_TRACE_COMPLETE' : 'CARE_QUALITY_BRAIN_RELEASE_UNVERIFIED_ALLOWED',
  });
}

export function evaluateCareRuntimeQuality(input: CareQualityEvidenceInput): CareQualityResult[] {
  const evidence = minimizeCareQualityEvidence(input);
  const checks: CareQualityResult[] = [exactVersionTrace(evidence)];

  const actionVerified = evidence.actionState === 'VERIFIED_SUCCESS';
  checks.push(evidence.completionClaimed && !actionVerified
    ? result({
      checkCode: 'ACTION_TRUTH_COMPLETION', eligibility: 'DET', result: 'FAIL',
      hardFailFamilies: ['HF06', 'HF20', 'HF24'],
      rootCauseHint: evidence.providerResultClass === 'FAILURE' || evidence.providerResultClass === 'FALLBACK'
        ? 'RUNTIME_CAPABILITY_FAIL'
        : undefined,
      reasonCode: 'CARE_QUALITY_COMPLETION_WITHOUT_VERIFIED_SUCCESS',
    })
    : result({ checkCode: 'ACTION_TRUTH_COMPLETION', eligibility: 'DET', result: 'PASS', reasonCode: 'CARE_QUALITY_NO_FALSE_COMPLETION_EVIDENCE' }));

  checks.push(evidence.suppressionActive && evidence.commercialActionProposed
    ? result({
      checkCode: 'SUPPRESSION_PRECEDENCE', eligibility: 'DET', result: 'FAIL', hardFailFamilies: ['HF12'],
      reasonCode: 'CARE_QUALITY_COMMERCIAL_ACTION_DURING_SUPPRESSION',
    })
    : result({ checkCode: 'SUPPRESSION_PRECEDENCE', eligibility: 'DET', result: 'PASS', reasonCode: 'CARE_QUALITY_SUPPRESSION_PRECEDENCE_OK' }));

  checks.push(evidence.surface === 'public' && evidence.privateMemoryUsed
    ? result({
      checkCode: 'PUBLIC_PRIVATE_MEMORY_BOUNDARY', eligibility: 'DET', result: 'FAIL', hardFailFamilies: ['HF15', 'HF19'],
      rootCauseHint: 'MEMORY/IDENTITY_ISSUE', reasonCode: 'CARE_QUALITY_PRIVATE_MEMORY_ON_PUBLIC_SURFACE',
    })
    : result({ checkCode: 'PUBLIC_PRIVATE_MEMORY_BOUNDARY', eligibility: 'DET', result: 'PASS', reasonCode: 'CARE_QUALITY_PUBLIC_MEMORY_BOUNDARY_OK' }));

  checks.push(evidence.currentJobSupersedesMemory && evidence.staleMemoryUsed
    ? result({
      checkCode: 'CURRENT_JOB_OVER_STALE_MEMORY', eligibility: 'DET', result: 'FAIL', hardFailFamilies: ['HF14'],
      rootCauseHint: 'MEMORY/IDENTITY_ISSUE', reasonCode: 'CARE_QUALITY_STALE_MEMORY_OVERRIDES_CURRENT_JOB',
    })
    : result({ checkCode: 'CURRENT_JOB_OVER_STALE_MEMORY', eligibility: 'DET', result: 'PASS', reasonCode: 'CARE_QUALITY_CURRENT_JOB_PRECEDENCE_OK' }));

  checks.push(evidence.customerCorrectionPresent && evidence.staleMemoryUsed
    ? result({
      checkCode: 'CUSTOMER_CORRECTION_PRECEDENCE', eligibility: 'DET', result: 'FAIL', hardFailFamilies: ['HF16'],
      rootCauseHint: 'MEMORY/IDENTITY_ISSUE', reasonCode: 'CARE_QUALITY_CORRECTION_NOT_HONORED',
    })
    : result({ checkCode: 'CUSTOMER_CORRECTION_PRECEDENCE', eligibility: 'DET', result: 'PASS', reasonCode: 'CARE_QUALITY_CORRECTION_PRECEDENCE_OK' }));

  checks.push(evidence.capabilityClaimed && evidence.capabilityAvailable !== true
    ? result({
      checkCode: 'CAPABILITY_CLAIM', eligibility: 'DET', result: 'FAIL', hardFailFamilies: ['HF22'],
      rootCauseHint: 'RUNTIME_CAPABILITY_FAIL', reasonCode: 'CARE_QUALITY_CAPABILITY_CLAIM_UNVERIFIED',
    })
    : result({ checkCode: 'CAPABILITY_CLAIM', eligibility: 'DET', result: 'PASS', reasonCode: 'CARE_QUALITY_CAPABILITY_CLAIM_OK' }));

  checks.push(evidence.truthStatus === 'UNKNOWN' && evidence.exactMechanicClaimed
    ? result({
      checkCode: 'UNKNOWN_PRESERVATION', eligibility: 'DET', result: 'FAIL', hardFailFamilies: ['HF25'],
      rootCauseHint: 'SOURCE_TRUTH_GAP', reasonCode: 'CARE_QUALITY_UNKNOWN_ERASED_BY_EXACT_CLAIM',
    })
    : result({ checkCode: 'UNKNOWN_PRESERVATION', eligibility: 'DET', result: 'PASS', reasonCode: 'CARE_QUALITY_UNKNOWN_PRESERVED' }));

  if (evidence.journeyCadence === 'D7_D30') {
    if (!evidence.productCode) {
      checks.push(result({
        checkCode: 'LANG_D7_D30_LOCK', eligibility: 'DET', result: 'INSUFFICIENT_EVIDENCE',
        reasonCode: 'CARE_QUALITY_PRODUCT_CODE_REQUIRED_FOR_CADENCE_CHECK',
      }));
    } else if (evidence.productCode !== 'LANG') {
      checks.push(result({
        checkCode: 'LANG_D7_D30_LOCK', eligibility: 'DET', result: 'FAIL', hardFailFamilies: ['HF02', 'HF24'],
        reasonCode: 'CARE_QUALITY_D7_D30_APPLIED_OUTSIDE_LANG',
      }));
    } else {
      checks.push(result({ checkCode: 'LANG_D7_D30_LOCK', eligibility: 'DET', result: 'PASS', reasonCode: 'CARE_QUALITY_LANG_CADENCE_OK' }));
    }
  } else {
    checks.push(result({ checkCode: 'LANG_D7_D30_LOCK', eligibility: 'DET', result: 'PASS', reasonCode: 'CARE_QUALITY_NO_D7_D30_MISUSE_EVIDENCE' }));
  }

  checks.push(evidence.providerResultClass === 'FAILURE' || evidence.providerResultClass === 'FALLBACK'
    ? result({
      checkCode: 'RUNTIME_PROVIDER_RESULT', eligibility: 'DET', result: 'FAIL', rootCauseHint: 'RUNTIME_CAPABILITY_FAIL',
      reasonCode: 'CARE_QUALITY_RUNTIME_PROVIDER_FAILURE',
    })
    : result({ checkCode: 'RUNTIME_PROVIDER_RESULT', eligibility: 'DET', result: 'PASS', reasonCode: 'CARE_QUALITY_RUNTIME_PROVIDER_RESULT_OK' }));

  // Metadata cannot judge nuanced recommendation/voice/safety meaning. These sentinels make the
  // DET/SEM/HUM boundary explicit so downstream code cannot silently treat missing content as PASS.
  checks.push(result({
    checkCode: 'SEMANTIC_JUDGMENT_BOUNDARY', eligibility: 'SEM', result: 'NOT_EVALUATED',
    reasonCode: 'CARE_QUALITY_SEMANTIC_REVIEW_REQUIRES_BOUNDED_CONTENT_GATE',
  }));
  checks.push(result({
    checkCode: 'HUMAN_SAFETY_BOUNDARY', eligibility: 'HUM', result: 'NOT_EVALUATED',
    reasonCode: 'CARE_QUALITY_HUMAN_REVIEW_REQUIRED_FOR_MATERIAL_AMBIGUITY',
  }));

  return checks;
}

export function careQualityHardFailFamilies(results: CareQualityResult[]): string[] {
  return [...new Set(results.flatMap((item) => item.result === 'FAIL' ? item.hardFailFamilies : []))].sort();
}

export function careQualityRuntimeRootCauses(results: CareQualityResult[]): CareQualityRootCauseHint[] {
  return [...new Set(results.flatMap((item) => item.result === 'FAIL' && item.rootCauseHint ? [item.rootCauseHint] : []))].sort();
}

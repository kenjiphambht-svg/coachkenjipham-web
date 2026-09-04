import type { MemoryDecision } from './contracts';
import type { CareChannelIdentityRef } from './conversation-context';

export const CARE_MEMORY_KEYS = [
  'self_stated_current_need',
  'context_family',
  'product_journey_explored',
  'conversation_open_loop',
  'explicit_preference',
  'last_verified_care_action',
  'selected_next_step',
  'inquiry_handoff_state',
  'consent_suppression_scope',
  'compact_safe_summary',
  'verified_journey_fact',
  'provisional_state_signal',
] as const;

export type CareMemoryKey = (typeof CARE_MEMORY_KEYS)[number];
export type CareMemoryProvenance = 'CUSTOMER_SELF_STATED' | 'VERIFIED_SYSTEM' | 'PROVISIONAL_MODEL_SIGNAL';
export type CareMemoryConfidence = 'VERIFIED' | 'SELF_STATED' | 'PROVISIONAL';
export type CareMemoryFreshness = 'CURRENT' | 'STALE' | 'REVIEW_DUE';
export type CareMemorySensitivity = 'S1' | 'S2' | 'S3';
export type CareMemoryStatus = 'ACTIVE' | 'SUPERSEDED' | 'FORGOTTEN' | 'REJECTED';

export type CareMemorySubject =
  | { kind: 'CHANNEL_IDENTITY'; identity: CareChannelIdentityRef }
  | { kind: 'PERSON'; personId: string };

export interface CareRelationshipMemoryItem {
  id: string;
  subject: CareMemorySubject;
  memoryKey: CareMemoryKey;
  valueJson: unknown;
  purposeScope: string;
  provenanceKind: CareMemoryProvenance;
  sourceRef: string;
  confidence: CareMemoryConfidence;
  freshnessState: CareMemoryFreshness;
  sensitivityClass: CareMemorySensitivity;
  observedAtIso: string;
  lastConfirmedAtIso?: string;
  reviewAfterIso?: string;
  expiresAtIso?: string;
  memoryContractVersion: string;
  status: CareMemoryStatus;
  supersedesMemoryId?: string;
  createdAtIso?: string;
}

export interface CareMemoryCandidate {
  memoryKey: CareMemoryKey;
  valueJson: unknown;
  purposeScope: string;
  provenanceKind: CareMemoryProvenance;
  sourceRef: string;
  confidence: CareMemoryConfidence;
  freshnessState: 'CURRENT';
  sensitivityClass: CareMemorySensitivity;
  observedAtIso: string;
  lastConfirmedAtIso?: string;
  reviewAfterIso?: string;
  expiresAtIso?: string;
}

export interface CareMemoryForgetSelector {
  memoryKey: CareMemoryKey;
  purposeScope: string;
  sourceRef: string;
  observedAtIso: string;
}

export interface CareRelationshipMemoryRepository {
  readMemory(args: {
    subject: CareMemorySubject;
    purposeScope: string;
    nowIso: string;
    maxItems: number;
  }): Promise<CareRelationshipMemoryItem[]>;

  updateMemory(args: {
    subject: CareMemorySubject;
    candidate: CareMemoryCandidate;
    memoryContractVersion: string;
  }): Promise<{ memoryId: string }>;

  forgetMemory(args: {
    subject: CareMemorySubject;
    selector: CareMemoryForgetSelector;
    memoryContractVersion: string;
  }): Promise<{ tombstoneMemoryId?: string }>;
}

export interface CareMemoryPolicyContext {
  purposeScope: string;
  memoryContractVersion: string;
  allowedKeys: readonly CareMemoryKey[];
  nowIso: string;
}

export interface CareMemoryBudget {
  maxItems: number;
  maxChars: number;
}

export interface CareMemoryDecisionResult {
  decision: MemoryDecision;
  updatedMemoryIds: string[];
  forgottenMemoryIds: string[];
  noOp: boolean;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const HASH_RE = /^[a-f0-9]{64}$/;
const PURPOSE_RE = /^[A-Z][A-Z0-9_]{0,63}$/;
const SOURCE_REF_RE = /^[A-Za-z0-9][A-Za-z0-9:._/-]{0,199}$/;
const CONTRACT_RE = /^[A-Za-z0-9][A-Za-z0-9:._/-]{0,99}$/;
const KEY_SET = new Set<string>(CARE_MEMORY_KEYS);

function requireIso(value: string, code: string): number {
  if (!value?.trim()) throw new Error(code);
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) throw new Error(code);
  return parsed;
}

function assertPurpose(value: string): void {
  if (!PURPOSE_RE.test(value)) throw new Error('CARE_MEMORY_PURPOSE_INVALID');
}

function assertSourceRef(value: string): void {
  if (!SOURCE_REF_RE.test(value)) throw new Error('CARE_MEMORY_SOURCE_REF_INVALID');
}

function assertContractVersion(value: string): void {
  if (!CONTRACT_RE.test(value)) throw new Error('CARE_MEMORY_CONTRACT_VERSION_INVALID');
}

function assertSubject(subject: CareMemorySubject): void {
  if (subject.kind === 'PERSON') {
    if (!UUID_RE.test(subject.personId)) throw new Error('CARE_MEMORY_PERSON_ID_INVALID');
    return;
  }
  if (!HASH_RE.test(subject.identity.accountScopeHash) || !HASH_RE.test(subject.identity.externalSubjectHash)) {
    throw new Error('CARE_MEMORY_IDENTITY_HASH_INVALID');
  }
}

function normalizedBoundaryText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function containsDeniedMemoryContent(value: string): boolean {
  const text = normalizedBoundaryText(value);
  if (/\b(password|mat khau|otp|cvv|pin|so the|card number|credit card)\b/.test(text)) return true;
  if (/\b(chain of thought|chuoi suy nghi noi bo|suy nghi noi bo cua model)\b/.test(text)) return true;
  if (/\b(chan doan|tram cam|roi loan|tu ky|adhd|bipolar|tam than)\b/.test(text)) return true;
  if (/\b(lead score|archetype|psych score|diem tam ly|nhan cach co dinh)\b/.test(text)) return true;

  const child = /\b(con toi|con minh|dua tre|tre em|be nha|chau nha)\b/.test(text);
  const sensitive = /\b(tam ly|chan doan|tram cam|roi loan|lo au|tu ky|adhd|bi gi)\b/.test(text);
  return child && sensitive;
}

function serializedCandidateValue(value: unknown): string {
  let serialized: string | undefined;
  try {
    serialized = JSON.stringify(value);
  } catch {
    throw new Error('CARE_MEMORY_VALUE_NOT_JSON');
  }
  if (!serialized || serialized === 'null') throw new Error('CARE_MEMORY_VALUE_REQUIRED');
  if (serialized.length > 1200) throw new Error('CARE_MEMORY_VALUE_TOO_LARGE');
  return serialized;
}

function assertProvenance(candidate: CareMemoryCandidate): void {
  if (candidate.provenanceKind === 'CUSTOMER_SELF_STATED' && candidate.confidence !== 'SELF_STATED') {
    throw new Error('CARE_MEMORY_PROVENANCE_CONFIDENCE_MISMATCH');
  }
  if (candidate.provenanceKind === 'VERIFIED_SYSTEM' && candidate.confidence !== 'VERIFIED') {
    throw new Error('CARE_MEMORY_PROVENANCE_CONFIDENCE_MISMATCH');
  }
  if (candidate.provenanceKind === 'PROVISIONAL_MODEL_SIGNAL') {
    if (candidate.confidence !== 'PROVISIONAL' || candidate.memoryKey !== 'provisional_state_signal') {
      throw new Error('CARE_MEMORY_PROVISIONAL_SIGNAL_INVALID');
    }
  }
}

export function validateCareMemoryCandidate(
  candidate: CareMemoryCandidate,
  policy: CareMemoryPolicyContext,
): void {
  if (!KEY_SET.has(candidate.memoryKey)) throw new Error('CARE_MEMORY_KEY_INVALID');
  if (!policy.allowedKeys.includes(candidate.memoryKey)) throw new Error('CARE_MEMORY_KEY_NOT_ALLOWED');
  assertPurpose(candidate.purposeScope);
  assertPurpose(policy.purposeScope);
  if (candidate.purposeScope !== policy.purposeScope) throw new Error('CARE_MEMORY_PURPOSE_MISMATCH');
  assertSourceRef(candidate.sourceRef);
  assertContractVersion(policy.memoryContractVersion);
  if (candidate.sensitivityClass === 'S3') throw new Error('CARE_MEMORY_S3_DENIED');
  if (candidate.freshnessState !== 'CURRENT') throw new Error('CARE_MEMORY_FRESHNESS_INVALID');
  assertProvenance(candidate);

  const nowMs = requireIso(policy.nowIso, 'CARE_MEMORY_NOW_INVALID');
  const observedMs = requireIso(candidate.observedAtIso, 'CARE_MEMORY_OBSERVED_AT_INVALID');
  if (observedMs > nowMs + 5 * 60_000) throw new Error('CARE_MEMORY_OBSERVED_AT_FUTURE');
  if (candidate.lastConfirmedAtIso) requireIso(candidate.lastConfirmedAtIso, 'CARE_MEMORY_LAST_CONFIRMED_INVALID');
  if (candidate.reviewAfterIso) requireIso(candidate.reviewAfterIso, 'CARE_MEMORY_REVIEW_AFTER_INVALID');
  if (candidate.expiresAtIso && requireIso(candidate.expiresAtIso, 'CARE_MEMORY_EXPIRES_AT_INVALID') <= nowMs) {
    throw new Error('CARE_MEMORY_EXPIRY_INVALID');
  }

  const serialized = serializedCandidateValue(candidate.valueJson);
  if (containsDeniedMemoryContent(serialized)) throw new Error('CARE_MEMORY_SENSITIVE_CONTENT_DENIED');
}

export async function applyCareMemoryDecision(args: {
  repository: CareRelationshipMemoryRepository;
  subject: CareMemorySubject;
  decision: MemoryDecision;
  candidates?: readonly CareMemoryCandidate[];
  forget?: readonly CareMemoryForgetSelector[];
  policy: CareMemoryPolicyContext;
}): Promise<CareMemoryDecisionResult> {
  assertSubject(args.subject);
  assertPurpose(args.policy.purposeScope);
  assertContractVersion(args.policy.memoryContractVersion);
  requireIso(args.policy.nowIso, 'CARE_MEMORY_NOW_INVALID');

  if (args.decision === 'PRESERVE' || args.decision === 'DO_NOT_WRITE') {
    return { decision: args.decision, updatedMemoryIds: [], forgottenMemoryIds: [], noOp: true };
  }

  if (args.decision === 'UPDATE') {
    const candidates = [...(args.candidates ?? [])];
    if (!candidates.length) throw new Error('CARE_MEMORY_UPDATE_CANDIDATE_REQUIRED');
    if (candidates.length > 3) throw new Error('CARE_MEMORY_UPDATE_CANDIDATE_LIMIT');
    const updatedMemoryIds: string[] = [];
    for (const candidate of candidates) {
      validateCareMemoryCandidate(candidate, args.policy);
      const result = await args.repository.updateMemory({
        subject: args.subject,
        candidate,
        memoryContractVersion: args.policy.memoryContractVersion,
      });
      updatedMemoryIds.push(result.memoryId);
    }
    return { decision: args.decision, updatedMemoryIds, forgottenMemoryIds: [], noOp: false };
  }

  const selectors = [...(args.forget ?? [])];
  if (!selectors.length) throw new Error('CARE_MEMORY_FORGET_SELECTOR_REQUIRED');
  if (selectors.length > 5) throw new Error('CARE_MEMORY_FORGET_SELECTOR_LIMIT');
  const forgottenMemoryIds: string[] = [];
  for (const selector of selectors) {
    if (!KEY_SET.has(selector.memoryKey) || !args.policy.allowedKeys.includes(selector.memoryKey)) {
      throw new Error('CARE_MEMORY_KEY_NOT_ALLOWED');
    }
    assertPurpose(selector.purposeScope);
    if (selector.purposeScope !== args.policy.purposeScope) throw new Error('CARE_MEMORY_PURPOSE_MISMATCH');
    assertSourceRef(selector.sourceRef);
    requireIso(selector.observedAtIso, 'CARE_MEMORY_OBSERVED_AT_INVALID');
    const result = await args.repository.forgetMemory({
      subject: args.subject,
      selector,
      memoryContractVersion: args.policy.memoryContractVersion,
    });
    if (result.tombstoneMemoryId) forgottenMemoryIds.push(result.tombstoneMemoryId);
  }
  return { decision: args.decision, updatedMemoryIds: [], forgottenMemoryIds, noOp: false };
}

function renderMemoryValue(value: unknown): string {
  if (typeof value === 'string') return value.trim();
  const serialized = serializedCandidateValue(value);
  return serialized;
}

export function buildBoundedMemoryContext(
  items: readonly CareRelationshipMemoryItem[],
  budget: CareMemoryBudget,
): string[] {
  if (!Number.isInteger(budget.maxItems) || budget.maxItems < 1 || budget.maxItems > 20) {
    throw new Error('CARE_MEMORY_MAX_ITEMS_INVALID');
  }
  if (!Number.isInteger(budget.maxChars) || budget.maxChars < 256 || budget.maxChars > 10000) {
    throw new Error('CARE_MEMORY_MAX_CHARS_INVALID');
  }

  const lines: string[] = [];
  let chars = 0;
  for (const item of items) {
    if (lines.length >= budget.maxItems) break;
    if (item.status !== 'ACTIVE' || item.sensitivityClass === 'S3' || item.freshnessState !== 'CURRENT') continue;
    const line = `Relationship memory [${item.memoryKey}]: ${renderMemoryValue(item.valueJson)}`;
    if (chars + line.length > budget.maxChars) continue;
    lines.push(line);
    chars += line.length;
  }
  return lines;
}

export function safeCareMemoryError(error: unknown): string {
  if (error instanceof Error && /^CARE_MEMORY_[A-Z0-9_]+$/.test(error.message)) {
    return error.message.slice(0, 120);
  }
  return 'CARE_MEMORY_UNKNOWN_ERROR';
}

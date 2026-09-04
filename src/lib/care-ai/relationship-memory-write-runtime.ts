import type { MemoryDecision } from './contracts';
import {
  applyCareMemoryDecision,
  type CareMemoryCandidate,
  type CareMemoryKey,
  type CareRelationshipMemoryRepository,
} from './relationship-memory';
import type { CareChannelIdentityRef } from './conversation-context';

export interface CareMemoryWriteRuntimeConfig {
  purposeScope: string;
  memoryContractVersion: string;
  allowedKeys: readonly CareMemoryKey[];
}

export interface CareMemoryWriteAttemptResult {
  eligible: boolean;
  candidateCount: number;
  updatedCount: number;
  reason:
    | 'MODEL_DECISION_BLOCKED'
    | 'NO_DETERMINISTIC_CANDIDATE'
    | 'UPDATED';
}

const SUPPORTED_WRITE_KEYS = new Set<CareMemoryKey>([
  'self_stated_current_need',
  'product_journey_explored',
  'conversation_open_loop',
  'explicit_preference',
  'selected_next_step',
]);
const PURPOSE_RE = /^[A-Z][A-Z0-9_]{0,63}$/;
const CONTRACT_RE = /^[A-Za-z0-9][A-Za-z0-9:._/-]{0,99}$/;
const SOURCE_REF_RE = /^[A-Za-z0-9][A-Za-z0-9:._/-]{0,199}$/;

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

function parseWriteKeys(raw: string | undefined): CareMemoryKey[] {
  const keys = (raw || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  if (!keys.length) throw new Error('CARE_MEMORY_WRITE_KEYS_REQUIRED');
  const unique = [...new Set(keys)];
  if (unique.some((key) => !SUPPORTED_WRITE_KEYS.has(key as CareMemoryKey))) {
    throw new Error('CARE_MEMORY_WRITE_KEYS_UNSUPPORTED');
  }
  return unique as CareMemoryKey[];
}

export function careMemoryWriteConfigFromEnv(
  env: Readonly<Record<string, string | undefined>>,
): CareMemoryWriteRuntimeConfig {
  const purposeScope = (env.CARE_MEMORY_PURPOSE_SCOPE || '').trim();
  const memoryContractVersion = (env.CARE_MEMORY_CONTRACT_VERSION || '').trim();
  if (!PURPOSE_RE.test(purposeScope)) throw new Error('CARE_MEMORY_PURPOSE_INVALID');
  if (!CONTRACT_RE.test(memoryContractVersion)) throw new Error('CARE_MEMORY_CONTRACT_VERSION_INVALID');
  return {
    purposeScope,
    memoryContractVersion,
    allowedKeys: parseWriteKeys(env.CARE_MEMORY_WRITE_KEYS),
  };
}

function explicitlyRequestsConciseReplies(text: string): boolean {
  const normalized = normalizedBoundaryText(text);
  const negative = [
    /\b(dung|khong)\b.{0,24}\b(ngan gon|suc tich)\b/,
    /\b(do not|dont|don't|not)\b.{0,24}\b(short|brief|concise)\b/,
  ].some((pattern) => pattern.test(normalized));
  if (negative) return false;

  return [
    /\b(tra loi|noi)\b.{0,18}\b(ngan gon|suc tich)\b/,
    /\b(ngan gon|suc tich)\b.{0,12}\b(thoi|nhe|nha|giup)\b/,
    /\b(keep|make)\b.{0,18}\b(answer|answers|reply|replies)\b.{0,12}\b(short|brief|concise)\b/,
    /\b(short|brief|concise)\b.{0,12}\b(answer|answers|reply|replies)\b/,
  ].some((pattern) => pattern.test(normalized));
}

function containsHardDeniedWriteContext(text: string): boolean {
  const normalized = normalizedBoundaryText(text);
  if (/\b(password|mat khau|otp|cvv|pin|so the|card number|credit card)\b/.test(normalized)) return true;
  if (/\b(chain of thought|chuoi suy nghi noi bo|suy nghi noi bo cua model)\b/.test(normalized)) return true;
  if (/\b(chan doan|tram cam|roi loan|tu ky|adhd|bipolar|tam than)\b/.test(normalized)) return true;
  if (/\b(lead score|archetype|psych score|diem tam ly|nhan cach co dinh)\b/.test(normalized)) return true;
  if (/\b(xoa du lieu|xoa thong tin|quyen rieng tu|delete my data|privacy)\b/.test(normalized)) return true;
  const child = /\b(con toi|con minh|dua tre|tre em|be nha|chau nha)\b/.test(normalized);
  const sensitive = /\b(tam ly|chan doan|tram cam|roi loan|lo au|tu ky|adhd|bi gi)\b/.test(normalized);
  return child && sensitive;
}

function explicitlyStatesSelfUnderstandingNeed(text: string): boolean {
  const normalized = normalizedBoundaryText(text);
  if (/\b(khong|dont|don't|do not)\b.{0,14}\b(muon|want)\b/.test(normalized)) return false;
  return [
    /\b(muon|can)\b.{0,24}\b(hieu|thau hieu|kham pha)\b.{0,18}\b(ban than|minh)\b/,
    /\b(hieu|thau hieu)\b.{0,18}\b(ban than|minh)\b.{0,12}\b(hon|ro hon)\b/,
    /\b(want|need|would like)\b.{0,24}\b(understand|know)\b.{0,18}\bmyself\b/,
    /\bunderstand myself better\b/,
  ].some((pattern) => pattern.test(normalized));
}

type ProductJourneySlug =
  | 'lang_90'
  | 'ban_sac_hat_mam'
  | 'ban_sac_kham_pha'
  | 'ban_sac_giao_mua'
  | 'ban_la_duy_nhat'
  | 'dau_an_cua_ban'
  | 'khoi_dau'
  | 'essence_advisory';

function productJourneySlug(text: string): ProductJourneySlug | undefined {
  const normalized = normalizedBoundaryText(text);
  const negative = /\b(khong|chua)\b.{0,18}\b(quan tam|muon tim hieu)\b/.test(normalized)
    || /\b(not interested|do not want to learn|don't want to learn)\b/.test(normalized);
  if (negative) return undefined;
  const inquiry = /\b(quan tam|tim hieu|muon biet|hoi ve|cho anh hoi|cho toi hoi|phu hop|gia|bao nhieu|giup gi|la gi|interested|learn more|tell me about|price)\b/.test(normalized);
  if (!inquiry) return undefined;

  const products: Array<[ProductJourneySlug, RegExp]> = [
    ['lang_90', /\blang 90\b/],
    ['ban_sac_hat_mam', /\b(?:ban sac )?hat mam\b/],
    ['ban_sac_kham_pha', /\bban sac kham pha\b|\bkham pha 7\s*[-–]?\s*14\b/],
    ['ban_sac_giao_mua', /\bban sac giao mua\b|\bgiao mua 14\s*[-–]?\s*21\b/],
    ['ban_la_duy_nhat', /\bban la duy nhat\b/],
    ['dau_an_cua_ban', /\bdau an cua ban\b/],
    ['khoi_dau', /\bkhoi dau\b/],
    ['essence_advisory', /\bessence advisory\b/],
  ];
  return products.find(([, pattern]) => pattern.test(normalized))?.[0];
}

function explicitlySelectsContinueExploring(text: string): boolean {
  const normalized = normalizedBoundaryText(text);
  return [
    /\b(?:anh|toi|minh)\b.{0,16}\bmuon\b.{0,18}\b(?:tim hieu|xem|nghe)\b.{0,12}\bthem\b/,
    /\b(?:i want|i'd like|i would like)\b.{0,18}\b(?:learn|know|see)\b.{0,12}\bmore\b/,
  ].some((pattern) => pattern.test(normalized));
}

function explicitlyDefersWithOpenLoop(text: string): boolean {
  const normalized = normalizedBoundaryText(text);
  return [
    /\bde (?:anh|toi|minh)\b.{0,18}\b(?:suy nghi|can nhac|tim hieu)\b.{0,12}\b(?:them)?\b/,
    /\b(?:anh|toi|minh)\b.{0,12}\bse quay lai\b/,
    /\bmai (?:anh|toi|minh)\b.{0,12}\bhoi tiep\b/,
    /\b(?:i'll|i will) come back\b/,
    /\blet me (?:think|consider|look into it)\b/,
  ].some((pattern) => pattern.test(normalized));
}

function isoPlusDays(iso: string, days: number): string {
  const timestamp = Date.parse(iso);
  if (!Number.isFinite(timestamp)) throw new Error('CARE_MEMORY_OBSERVED_AT_INVALID');
  return new Date(timestamp + days * 24 * 60 * 60 * 1000).toISOString();
}

function selfStatedCandidate(args: {
  memoryKey: CareMemoryKey;
  valueJson: unknown;
  sourceRef: string;
  observedAtIso: string;
  purposeScope: string;
  reviewDays?: number;
}): CareMemoryCandidate {
  return {
    memoryKey: args.memoryKey,
    valueJson: args.valueJson,
    purposeScope: args.purposeScope,
    provenanceKind: 'CUSTOMER_SELF_STATED',
    sourceRef: args.sourceRef,
    confidence: 'SELF_STATED',
    freshnessState: 'CURRENT',
    sensitivityClass: 'S1',
    observedAtIso: args.observedAtIso,
    lastConfirmedAtIso: args.observedAtIso,
    ...(args.reviewDays ? { reviewAfterIso: isoPlusDays(args.observedAtIso, args.reviewDays) } : {}),
  };
}

export function selectDeterministicCareMemoryCandidates(args: {
  currentCustomerText: string;
  sourceRef: string;
  observedAtIso: string;
  config: CareMemoryWriteRuntimeConfig;
}): CareMemoryCandidate[] {
  if (!args.currentCustomerText.trim()) throw new Error('CARE_MEMORY_WRITE_CURRENT_TEXT_REQUIRED');
  if (!SOURCE_REF_RE.test(args.sourceRef)) throw new Error('CARE_MEMORY_SOURCE_REF_INVALID');
  const observedAt = Date.parse(args.observedAtIso);
  if (!Number.isFinite(observedAt)) throw new Error('CARE_MEMORY_OBSERVED_AT_INVALID');
  if (containsHardDeniedWriteContext(args.currentCustomerText)) return [];

  const candidates: CareMemoryCandidate[] = [];
  const add = (candidate: CareMemoryCandidate) => {
    if (candidates.length < 3 && args.config.allowedKeys.includes(candidate.memoryKey)) candidates.push(candidate);
  };

  if (explicitlyRequestsConciseReplies(args.currentCustomerText)) {
    add(selfStatedCandidate({
      memoryKey: 'explicit_preference',
      valueJson: { response_style: 'concise' },
      sourceRef: args.sourceRef,
      observedAtIso: args.observedAtIso,
      purposeScope: args.config.purposeScope,
    }));
  }

  if (explicitlyStatesSelfUnderstandingNeed(args.currentCustomerText)) {
    add(selfStatedCandidate({
      memoryKey: 'self_stated_current_need',
      valueJson: { need: 'self_understanding' },
      sourceRef: args.sourceRef,
      observedAtIso: args.observedAtIso,
      purposeScope: args.config.purposeScope,
      reviewDays: 90,
    }));
  }

  const product = productJourneySlug(args.currentCustomerText);
  if (product) {
    add(selfStatedCandidate({
      memoryKey: 'product_journey_explored',
      valueJson: { product, state: 'exploring' },
      sourceRef: args.sourceRef,
      observedAtIso: args.observedAtIso,
      purposeScope: args.config.purposeScope,
      reviewDays: 90,
    }));
  }

  if (explicitlySelectsContinueExploring(args.currentCustomerText)) {
    add(selfStatedCandidate({
      memoryKey: 'selected_next_step',
      valueJson: { next_step: 'continue_exploring' },
      sourceRef: args.sourceRef,
      observedAtIso: args.observedAtIso,
      purposeScope: args.config.purposeScope,
      reviewDays: 30,
    }));
  }

  if (explicitlyDefersWithOpenLoop(args.currentCustomerText)) {
    add(selfStatedCandidate({
      memoryKey: 'conversation_open_loop',
      valueJson: { state: 'open', reason: 'customer_deferred' },
      sourceRef: args.sourceRef,
      observedAtIso: args.observedAtIso,
      purposeScope: args.config.purposeScope,
      reviewDays: 30,
    }));
  }

  return candidates;
}

export async function applyDeterministicCareMemoryWrite(args: {
  repository: CareRelationshipMemoryRepository;
  identity: CareChannelIdentityRef;
  modelMemoryDecision: MemoryDecision;
  currentCustomerText: string;
  sourceRef: string;
  observedAtIso: string;
  config: CareMemoryWriteRuntimeConfig;
}): Promise<CareMemoryWriteAttemptResult> {
  const candidates = selectDeterministicCareMemoryCandidates({
    currentCustomerText: args.currentCustomerText,
    sourceRef: args.sourceRef,
    observedAtIso: args.observedAtIso,
    config: args.config,
  });
  if (!candidates.length) {
    return {
      eligible: false,
      candidateCount: 0,
      updatedCount: 0,
      reason: 'NO_DETERMINISTIC_CANDIDATE',
    };
  }

  if (args.modelMemoryDecision === 'DO_NOT_WRITE' || args.modelMemoryDecision === 'FORGET') {
    return {
      eligible: false,
      candidateCount: candidates.length,
      updatedCount: 0,
      reason: 'MODEL_DECISION_BLOCKED',
    };
  }

  const result = await applyCareMemoryDecision({
    repository: args.repository,
    subject: { kind: 'CHANNEL_IDENTITY', identity: args.identity },
    decision: 'UPDATE',
    candidates,
    policy: {
      purposeScope: args.config.purposeScope,
      memoryContractVersion: args.config.memoryContractVersion,
      allowedKeys: args.config.allowedKeys,
      nowIso: args.observedAtIso,
    },
  });

  return {
    eligible: true,
    candidateCount: candidates.length,
    updatedCount: result.updatedMemoryIds.length,
    reason: 'UPDATED',
  };
}

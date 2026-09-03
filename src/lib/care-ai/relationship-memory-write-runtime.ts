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
    | 'MODEL_DECISION_NOT_UPDATE'
    | 'NO_DETERMINISTIC_CANDIDATE'
    | 'UPDATED';
}

const SUPPORTED_WRITE_KEYS = new Set<CareMemoryKey>(['explicit_preference']);
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
    /\b(dung|đừng|khong|không)\b.{0,24}\b(ngan gon|suc tich)\b/,
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

  if (
    args.config.allowedKeys.includes('explicit_preference')
    && explicitlyRequestsConciseReplies(args.currentCustomerText)
  ) {
    return [{
      memoryKey: 'explicit_preference',
      valueJson: { response_style: 'concise' },
      purposeScope: args.config.purposeScope,
      provenanceKind: 'CUSTOMER_SELF_STATED',
      sourceRef: args.sourceRef,
      confidence: 'SELF_STATED',
      freshnessState: 'CURRENT',
      sensitivityClass: 'S1',
      observedAtIso: args.observedAtIso,
      lastConfirmedAtIso: args.observedAtIso,
    }];
  }
  return [];
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
  if (args.modelMemoryDecision !== 'UPDATE') {
    return {
      eligible: false,
      candidateCount: 0,
      updatedCount: 0,
      reason: 'MODEL_DECISION_NOT_UPDATE',
    };
  }

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

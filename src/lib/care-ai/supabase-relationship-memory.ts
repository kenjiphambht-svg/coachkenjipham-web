import { createClient } from '@supabase/supabase-js';
import type { CareChannelIdentityRef } from './conversation-context';
import type {
  CareMemoryCandidate,
  CareMemoryForgetSelector,
  CareMemorySubject,
  CareRelationshipMemoryItem,
  CareRelationshipMemoryRepository,
} from './relationship-memory';

const URL_ENV = 'SUPABASE_URL';
const SERVICE_ROLE_ENV = 'SUPABASE_SERVICE_ROLE_KEY';

type CareMemoryRpcError = { message: string; code?: string };

export type CareMemoryRpcClient = {
  rpc(
    functionName: string,
    args: Record<string, unknown>,
  ): PromiseLike<{ data: unknown; error: CareMemoryRpcError | null }>;
};

function rpcErrorCode(prefix: string, error: CareMemoryRpcError): Error {
  const safeCode = error.code && /^[A-Z0-9_]+$/i.test(error.code) ? error.code : 'RPC_FAILED';
  return new Error(`${prefix}_${safeCode}`);
}

function isUuid(value: unknown): value is string {
  return typeof value === 'string'
    && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function isHex64(value: unknown): value is string {
  return typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
}

function subjectRpcArgs(subject: CareMemorySubject): Record<string, unknown> {
  if (subject.kind === 'PERSON') {
    if (!isUuid(subject.personId)) throw new Error('CARE_MEMORY_PERSON_ID_INVALID');
    return {
      p_person_id: subject.personId,
      p_channel: null,
      p_account_scope_hash: null,
      p_external_subject_hash: null,
    };
  }

  const identity: CareChannelIdentityRef = subject.identity;
  if (!isHex64(identity.accountScopeHash) || !isHex64(identity.externalSubjectHash)) {
    throw new Error('CARE_MEMORY_IDENTITY_HASH_INVALID');
  }
  return {
    p_person_id: null,
    p_channel: identity.channel,
    p_account_scope_hash: identity.accountScopeHash,
    p_external_subject_hash: identity.externalSubjectHash,
  };
}

export function createCareRelationshipMemoryRpcClient(): CareMemoryRpcClient {
  const url = process.env[URL_ENV];
  const serviceRoleKey = process.env[SERVICE_ROLE_ENV];
  if (!url) throw new Error('CARE_MEMORY_SUPABASE_URL_MISSING');
  if (!serviceRoleKey) throw new Error('CARE_MEMORY_SUPABASE_SERVICE_ROLE_KEY_MISSING');

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { headers: { 'x-essence-runtime': 'p07-care-memory' } },
  });
}

export class SupabaseCareRelationshipMemoryRepository implements CareRelationshipMemoryRepository {
  constructor(private readonly client: CareMemoryRpcClient) {}

  async readMemory(args: {
    subject: CareMemorySubject;
    purposeScope: string;
    nowIso: string;
    maxItems: number;
  }): Promise<CareRelationshipMemoryItem[]> {
    if (!Number.isInteger(args.maxItems) || args.maxItems < 1 || args.maxItems > 20) {
      throw new Error('CARE_MEMORY_MAX_ITEMS_INVALID');
    }
    const { data, error } = await this.client.rpc('care_memory_read', {
      ...subjectRpcArgs(args.subject),
      p_purpose_scope: args.purposeScope,
      p_now: args.nowIso,
      p_max_items: args.maxItems,
    });
    if (error) throw rpcErrorCode('CARE_MEMORY_READ', error);
    if (!Array.isArray(data)) throw new Error('CARE_MEMORY_READ_RESPONSE_INVALID');

    return data.map((row) => {
      const item = row as Record<string, unknown>;
      if (
        !isUuid(item.id)
        || typeof item.memory_key !== 'string'
        || typeof item.purpose_scope !== 'string'
        || typeof item.provenance_kind !== 'string'
        || typeof item.source_ref !== 'string'
        || typeof item.confidence !== 'string'
        || typeof item.freshness_state !== 'string'
        || typeof item.sensitivity_class !== 'string'
        || typeof item.observed_at !== 'string'
        || typeof item.memory_contract_version !== 'string'
      ) {
        throw new Error('CARE_MEMORY_READ_ROW_INVALID');
      }
      return {
        id: item.id,
        subject: args.subject,
        memoryKey: item.memory_key as CareRelationshipMemoryItem['memoryKey'],
        valueJson: item.value_json,
        purposeScope: item.purpose_scope,
        provenanceKind: item.provenance_kind as CareRelationshipMemoryItem['provenanceKind'],
        sourceRef: item.source_ref,
        confidence: item.confidence as CareRelationshipMemoryItem['confidence'],
        freshnessState: item.freshness_state as CareRelationshipMemoryItem['freshnessState'],
        sensitivityClass: item.sensitivity_class as CareRelationshipMemoryItem['sensitivityClass'],
        observedAtIso: item.observed_at,
        lastConfirmedAtIso: typeof item.last_confirmed_at === 'string' ? item.last_confirmed_at : undefined,
        reviewAfterIso: typeof item.review_after === 'string' ? item.review_after : undefined,
        expiresAtIso: typeof item.expires_at === 'string' ? item.expires_at : undefined,
        memoryContractVersion: item.memory_contract_version,
        status: 'ACTIVE',
        supersedesMemoryId: isUuid(item.supersedes_memory_id) ? item.supersedes_memory_id : undefined,
        createdAtIso: typeof item.created_at === 'string' ? item.created_at : undefined,
      };
    });
  }

  async updateMemory(args: {
    subject: CareMemorySubject;
    candidate: CareMemoryCandidate;
    memoryContractVersion: string;
  }): Promise<{ memoryId: string }> {
    const { data, error } = await this.client.rpc('care_memory_update', {
      ...subjectRpcArgs(args.subject),
      p_memory_key: args.candidate.memoryKey,
      p_value_json: args.candidate.valueJson,
      p_purpose_scope: args.candidate.purposeScope,
      p_provenance_kind: args.candidate.provenanceKind,
      p_source_ref: args.candidate.sourceRef,
      p_confidence: args.candidate.confidence,
      p_freshness_state: args.candidate.freshnessState,
      p_sensitivity_class: args.candidate.sensitivityClass,
      p_observed_at: args.candidate.observedAtIso,
      p_last_confirmed_at: args.candidate.lastConfirmedAtIso ?? null,
      p_review_after: args.candidate.reviewAfterIso ?? null,
      p_expires_at: args.candidate.expiresAtIso ?? null,
      p_memory_contract_version: args.memoryContractVersion,
    });
    if (error) throw rpcErrorCode('CARE_MEMORY_UPDATE', error);
    if (!isUuid(data)) throw new Error('CARE_MEMORY_UPDATE_RESPONSE_INVALID');
    return { memoryId: data };
  }

  async forgetMemory(args: {
    subject: CareMemorySubject;
    selector: CareMemoryForgetSelector;
    memoryContractVersion: string;
  }): Promise<{ tombstoneMemoryId?: string }> {
    const { data, error } = await this.client.rpc('care_memory_forget', {
      ...subjectRpcArgs(args.subject),
      p_memory_key: args.selector.memoryKey,
      p_purpose_scope: args.selector.purposeScope,
      p_source_ref: args.selector.sourceRef,
      p_observed_at: args.selector.observedAtIso,
      p_memory_contract_version: args.memoryContractVersion,
    });
    if (error) throw rpcErrorCode('CARE_MEMORY_FORGET', error);
    if (data === null) return {};
    if (!isUuid(data)) throw new Error('CARE_MEMORY_FORGET_RESPONSE_INVALID');
    return { tombstoneMemoryId: data };
  }
}

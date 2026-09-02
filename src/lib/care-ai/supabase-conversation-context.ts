import { createClient } from '@supabase/supabase-js';
import type {
  CareChannelIdentityRef,
  CareConversationContextRepository,
  CareConversationDirection,
  CareConversationTurn,
} from './conversation-context';

const URL_ENV = 'SUPABASE_URL';
const SERVICE_ROLE_ENV = 'SUPABASE_SERVICE_ROLE_KEY';

type CareContextRpcError = {
  message: string;
  code?: string;
};

export type CareContextRpcClient = {
  rpc(
    functionName: string,
    args: Record<string, unknown>,
  ): PromiseLike<{ data: unknown; error: CareContextRpcError | null }>;
};

function rpcErrorCode(prefix: string, error: CareContextRpcError): Error {
  const safeCode = error.code && /^[A-Z0-9_]+$/i.test(error.code) ? error.code : 'RPC_FAILED';
  return new Error(`${prefix}_${safeCode}`);
}

function isHex64(value: unknown): value is string {
  return typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
}

function assertIdentity(identity: CareChannelIdentityRef): void {
  if (!isHex64(identity.accountScopeHash) || !isHex64(identity.externalSubjectHash)) {
    throw new Error('CARE_CONTEXT_IDENTITY_HASH_INVALID');
  }
}

export function createCareConversationContextRpcClient(): CareContextRpcClient {
  const url = process.env[URL_ENV];
  const serviceRoleKey = process.env[SERVICE_ROLE_ENV];
  if (!url) throw new Error('CARE_CONTEXT_SUPABASE_URL_MISSING');
  if (!serviceRoleKey) throw new Error('CARE_CONTEXT_SUPABASE_SERVICE_ROLE_KEY_MISSING');

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        'x-essence-runtime': 'p07-care-context',
      },
    },
  });
}

export class SupabaseCareConversationContextRepository implements CareConversationContextRepository {
  constructor(private readonly client: CareContextRpcClient) {}

  async loadRecent(args: {
    identity: CareChannelIdentityRef;
    nowIso: string;
    maxMessages: number;
  }): Promise<CareConversationTurn[]> {
    assertIdentity(args.identity);
    if (!Number.isInteger(args.maxMessages) || args.maxMessages < 1 || args.maxMessages > 32) {
      throw new Error('CARE_CONTEXT_MAX_MESSAGES_INVALID');
    }

    const { data, error } = await this.client.rpc('care_context_load_recent', {
      p_channel: args.identity.channel,
      p_account_scope_hash: args.identity.accountScopeHash,
      p_external_subject_hash: args.identity.externalSubjectHash,
      p_now: args.nowIso,
      p_max_messages: args.maxMessages,
    });
    if (error) throw rpcErrorCode('CARE_CONTEXT_LOAD', error);
    if (!Array.isArray(data)) throw new Error('CARE_CONTEXT_LOAD_RESPONSE_INVALID');

    return data.map((row) => {
      const item = row as {
        direction?: unknown;
        content_server_only?: unknown;
        created_at?: unknown;
      };
      if (
        (item.direction !== 'INBOUND' && item.direction !== 'OUTBOUND')
        || typeof item.content_server_only !== 'string'
        || !item.content_server_only.trim()
        || typeof item.created_at !== 'string'
      ) {
        throw new Error('CARE_CONTEXT_LOAD_ROW_INVALID');
      }
      return {
        direction: item.direction,
        text: item.content_server_only,
        createdAt: item.created_at,
      };
    });
  }

  async appendTurn(args: {
    identity: CareChannelIdentityRef;
    direction: CareConversationDirection;
    text: string;
    externalMessageHash?: string;
    expiresAtIso: string;
    contextPolicyVersion: string;
    idleCutoffIso: string;
  }): Promise<{ conversationId: string }> {
    assertIdentity(args.identity);
    if (!args.text.trim()) throw new Error('CARE_CONTEXT_APPEND_TEXT_REQUIRED');
    if (args.text.length > 8000) throw new Error('CARE_CONTEXT_APPEND_TEXT_TOO_LONG');
    if (args.externalMessageHash && !isHex64(args.externalMessageHash)) {
      throw new Error('CARE_CONTEXT_EXTERNAL_MESSAGE_HASH_INVALID');
    }
    if (!args.contextPolicyVersion.trim()) throw new Error('CARE_CONTEXT_POLICY_VERSION_REQUIRED');

    const { data, error } = await this.client.rpc('care_context_append_turn', {
      p_channel: args.identity.channel,
      p_account_scope_hash: args.identity.accountScopeHash,
      p_external_subject_hash: args.identity.externalSubjectHash,
      p_direction: args.direction,
      p_content: args.text,
      p_external_message_hash: args.externalMessageHash ?? null,
      p_expires_at: args.expiresAtIso,
      p_context_policy_version: args.contextPolicyVersion,
      p_idle_cutoff_at: args.idleCutoffIso,
    });
    if (error) throw rpcErrorCode('CARE_CONTEXT_APPEND', error);
    if (typeof data !== 'string' || !/^[0-9a-f-]{36}$/i.test(data)) {
      throw new Error('CARE_CONTEXT_APPEND_RESPONSE_INVALID');
    }
    return { conversationId: data };
  }
}

import type { NextApiRequest, NextApiResponse } from 'next';
import type { CareChannel } from '../../../lib/care-ai/contracts';
import {
  buildBoundedConversation,
  careConversationCharCount,
  careConversationToModelTurns,
  deriveCareChannelIdentity,
  hashCareExternalMessageId,
  safeCareContextError,
  type CareChannelIdentityRef,
  type CareConversationContextRepository,
  type CareConversationTurn,
} from '../../../lib/care-ai/conversation-context';
import {
  createD1MetaCustomerGuardStore,
  createD1MetaIdempotencyStore,
  parseMetaWebhook,
  sendMetaText,
  type MetaCustomerGuardStore,
  type MetaD1Database,
  type MetaIdempotencyStore,
  verifyMetaPayloadSignature,
  verifyMetaWebhook,
} from '../../../lib/care-ai/meta-channel';
import {
  careModelFailureDecision,
  runCareModel,
  safeCareModelFailureDiagnostic,
  type CareModelProvider,
} from '../../../lib/care-ai/provider-neutral-model';
import type { CareRelationshipMemoryRepository } from '../../../lib/care-ai/relationship-memory';
import {
  careMemoryReadConfigFromEnv,
  loadCareMemoryRuntimeTurn,
  safeCareMemoryError,
} from '../../../lib/care-ai/relationship-memory-runtime';
import {
  applyDeterministicCareMemoryWrite,
  careMemoryWriteConfigFromEnv,
} from '../../../lib/care-ai/relationship-memory-write-runtime';
import {
  createCareConversationContextRpcClient,
  SupabaseCareConversationContextRepository,
} from '../../../lib/care-ai/supabase-conversation-context';
import {
  createCareRelationshipMemoryRpcClient,
  SupabaseCareRelationshipMemoryRepository,
} from '../../../lib/care-ai/supabase-relationship-memory';

function sandboxEnabled(): boolean {
  return process.env.CARE_META_SANDBOX_ENABLED === 'true';
}

function liveTestEnabled(): boolean {
  return sandboxEnabled() && process.env.CARE_META_LIVE_TEST_ENABLED === 'true';
}

function outboundEnabled(): boolean {
  return liveTestEnabled() && process.env.CARE_META_OUTBOUND_ENABLED === 'true';
}

function customerModeEnabled(): boolean {
  return liveTestEnabled() && process.env.CARE_META_CUSTOMER_MODE_ENABLED === 'true';
}

function conversationContextEnabled(): boolean {
  return liveTestEnabled() && process.env.CARE_META_CONVERSATION_CONTEXT_ENABLED === 'true';
}

function durableMemoryReadRequested(): boolean {
  return liveTestEnabled() && process.env.CARE_META_DURABLE_MEMORY_READ_ENABLED === 'true';
}

function durableMemoryReadEnabled(): boolean {
  return durableMemoryReadRequested() && conversationContextEnabled();
}

function durableMemoryWriteRequested(): boolean {
  return liveTestEnabled() && process.env.CARE_META_DURABLE_MEMORY_WRITE_ENABLED === 'true';
}

function durableMemoryWriteEnabled(): boolean {
  return durableMemoryWriteRequested() && conversationContextEnabled();
}

function instagramEnabled(): boolean {
  return liveTestEnabled() && process.env.CARE_META_INSTAGRAM_ENABLED === 'true';
}

function instagramOutboundEnabled(): boolean {
  return outboundEnabled() && instagramEnabled() && process.env.CARE_META_INSTAGRAM_OUTBOUND_ENABLED === 'true';
}

function channelEnabled(channel: CareChannel): boolean {
  if (channel === 'facebook_messenger') return true;
  if (channel === 'instagram') return instagramEnabled();
  return false;
}

function channelOutboundEnabled(channel: CareChannel): boolean {
  if (channel === 'facebook_messenger') return outboundEnabled();
  if (channel === 'instagram') return instagramOutboundEnabled();
  return false;
}

function allowedTestSenderIds(): Set<string> {
  return new Set(
    (process.env.CARE_META_TEST_SENDER_IDS || '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean),
  );
}

function boundedIntegerEnv(name: string, fallback: number, min: number, max: number): number {
  const raw = process.env[name];
  const value = raw ? Number(raw) : fallback;
  if (!Number.isInteger(value) || value < min || value > max) throw new Error(`${name}_INVALID`);
  return value;
}

function requiredBoundedIntegerEnv(name: string, min: number, max: number): number {
  const raw = process.env[name];
  if (!raw) throw new Error(`${name}_REQUIRED`);
  const value = Number(raw);
  if (!Number.isInteger(value) || value < min || value > max) throw new Error(`${name}_INVALID`);
  return value;
}

function idempotencyTtlSeconds(): number {
  return boundedIntegerEnv('CARE_META_IDEMPOTENCY_TTL_SECONDS', 86400, 300, 604800);
}

function customerGuardConfig() {
  return {
    maxTextChars: boundedIntegerEnv('CARE_META_CUSTOMER_MAX_TEXT_CHARS', 2000, 1, 8000),
    senderLimit: boundedIntegerEnv('CARE_META_CUSTOMER_SENDER_MAX_MESSAGES', 12, 1, 100),
    senderWindowSeconds: boundedIntegerEnv('CARE_META_CUSTOMER_SENDER_WINDOW_SECONDS', 600, 10, 86400),
    globalLimit: boundedIntegerEnv('CARE_META_CUSTOMER_GLOBAL_MAX_MESSAGES', 120, 1, 10000),
    globalWindowSeconds: boundedIntegerEnv('CARE_META_CUSTOMER_GLOBAL_WINDOW_SECONDS', 3600, 10, 86400),
    dailyLimit: boundedIntegerEnv('CARE_META_CUSTOMER_DAILY_MAX_MESSAGES', 500, 1, 10000),
    dailyWindowSeconds: boundedIntegerEnv('CARE_META_CUSTOMER_DAILY_WINDOW_SECONDS', 86400, 10, 86400),
  };
}

function conversationContextConfig() {
  const secret = process.env.CARE_META_CONTEXT_IDENTITY_HMAC_SECRET || '';
  if (!secret) throw new Error('CARE_CONTEXT_IDENTITY_HMAC_SECRET_REQUIRED');
  return {
    secret,
    ttlSeconds: requiredBoundedIntegerEnv('CARE_META_CONVERSATION_CONTEXT_TTL_SECONDS', 300, 86400),
    idleSeconds: boundedIntegerEnv('CARE_META_CONVERSATION_IDLE_SECONDS', 86400, 300, 604800),
    maxMessages: boundedIntegerEnv('CARE_CONTEXT_RECENT_MESSAGES_MAX', 8, 1, 32),
    maxChars: boundedIntegerEnv('CARE_CONTEXT_RECENT_CHARS_MAX', 6000, 256, 24000),
    policyVersion: process.env.CARE_META_CONVERSATION_CONTEXT_POLICY_VERSION || 'p07-phase-a-v0.1',
  };
}

async function metaD1Database(): Promise<MetaD1Database> {
  try {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare');
    const { env } = await getCloudflareContext({ async: true });
    const db = (env as unknown as { CARE_META_IDEMPOTENCY_DB?: MetaD1Database }).CARE_META_IDEMPOTENCY_DB;
    if (!db) throw new Error('CARE_META_IDEMPOTENCY_STORE_MISSING');
    return db;
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('CARE_META_')) throw error;
    throw new Error('CARE_META_IDEMPOTENCY_STORE_UNAVAILABLE');
  }
}

function allowedCompatibleHosts(): string[] {
  return (process.env.CARE_MODEL_ALLOWED_COMPATIBLE_HOSTS || '')
    .split(',')
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean);
}

async function readRawBody(req: NextApiRequest): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return Buffer.concat(chunks);
}

function headerValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function metaSendConfig(
  channel: CareChannel,
  expectedAccountId?: string,
): {
  channel: 'facebook_messenger' | 'instagram';
  sendEndpoint: string;
  accessToken: string;
  expectedAccountId?: string;
} {
  if (channel === 'facebook_messenger') {
    return {
      channel,
      sendEndpoint: process.env.CARE_META_MESSENGER_SEND_ENDPOINT || '',
      accessToken: process.env.CARE_META_MESSENGER_ACCESS_TOKEN || '',
      expectedAccountId,
    };
  }
  if (channel === 'instagram') {
    return {
      channel,
      sendEndpoint: process.env.CARE_META_INSTAGRAM_SEND_ENDPOINT || '',
      accessToken: process.env.CARE_META_INSTAGRAM_ACCESS_TOKEN || '',
      expectedAccountId,
    };
  }
  throw new Error('CARE_META_CHANNEL_NOT_SENDABLE');
}

function modelConfig() {
  return {
    provider: (process.env.CARE_MODEL_PROVIDER || '') as CareModelProvider,
    model: process.env.CARE_MODEL_NAME || '',
    apiKey: process.env.CARE_MODEL_API_KEY || '',
    baseUrl: process.env.CARE_MODEL_BASE_URL || undefined,
    allowedCompatibleHosts: allowedCompatibleHosts(),
    timeoutMs: boundedIntegerEnv('CARE_MODEL_TIMEOUT_MS', 12000, 2000, 30000),
  };
}

function safeError(error: unknown): string {
  if (!(error instanceof Error)) return 'CARE_META_UNKNOWN_ERROR';
  if (
    error.message.startsWith('CARE_META_')
    || error.message.startsWith('CARE_MODEL_')
    || error.message.startsWith('CARE_CONTEXT_')
    || error.message.startsWith('CARE_MEMORY_')
  ) {
    return error.message.slice(0, 120);
  }
  return 'CARE_META_TEST_BRIDGE_ERROR';
}

async function claimCustomerCapacity(args: {
  store: MetaCustomerGuardStore;
  senderId: string;
  accountId: string;
  channel: CareChannel;
}): Promise<boolean> {
  const limits = customerGuardConfig();
  const sender = await args.store.claim({
    scope: `sender:${args.channel}:${args.accountId}:${args.senderId}`,
    limit: limits.senderLimit,
    windowSeconds: limits.senderWindowSeconds,
  });
  if (!sender.allowed) return false;

  const global = await args.store.claim({
    scope: `global:${args.channel}:${args.accountId}:hour`,
    limit: limits.globalLimit,
    windowSeconds: limits.globalWindowSeconds,
  });
  if (!global.allowed) return false;

  const daily = await args.store.claim({
    scope: `global:${args.channel}:${args.accountId}:day`,
    limit: limits.dailyLimit,
    windowSeconds: limits.dailyWindowSeconds,
  });
  return daily.allowed;
}

async function prepareConversation(args: {
  repository: CareConversationContextRepository;
  identity: CareChannelIdentityRef;
  text: string;
  externalMessageId: string;
  nowMs: number;
  ttlSeconds: number;
  idleSeconds: number;
  maxMessages: number;
  maxChars: number;
  policyVersion: string;
}): Promise<{ modelTurns: string[]; loadedTurns: number; modelChars: number }> {
  let prior: CareConversationTurn[] = [];
  try {
    prior = await args.repository.loadRecent({
      identity: args.identity,
      nowIso: new Date(args.nowMs).toISOString(),
      maxMessages: Math.max(1, args.maxMessages - 1),
    });
  } catch (error) {
    console.error('CARE_CONTEXT_LOAD_DEGRADED', { safeErrorCode: safeCareContextError(error) });
  }

  const bounded = buildBoundedConversation(prior, args.text, {
    maxMessages: args.maxMessages,
    maxChars: args.maxChars,
  });

  try {
    await args.repository.appendTurn({
      identity: args.identity,
      direction: 'INBOUND',
      text: args.text,
      externalMessageHash: hashCareExternalMessageId(args.externalMessageId),
      expiresAtIso: new Date(args.nowMs + args.ttlSeconds * 1000).toISOString(),
      contextPolicyVersion: args.policyVersion,
      idleCutoffIso: new Date(args.nowMs - args.idleSeconds * 1000).toISOString(),
    });
  } catch (error) {
    console.error('CARE_CONTEXT_WRITE_DEGRADED', { safeErrorCode: safeCareContextError(error), direction: 'INBOUND' });
  }

  return {
    modelTurns: careConversationToModelTurns(bounded),
    loadedTurns: prior.length,
    modelChars: careConversationCharCount(bounded),
  };
}

async function recordOutboundConversation(args: {
  repository: CareConversationContextRepository;
  identity: CareChannelIdentityRef;
  text: string;
  externalMessageId?: string;
  nowMs: number;
  ttlSeconds: number;
  idleSeconds: number;
  policyVersion: string;
}): Promise<void> {
  try {
    await args.repository.appendTurn({
      identity: args.identity,
      direction: 'OUTBOUND',
      text: args.text,
      externalMessageHash: args.externalMessageId ? hashCareExternalMessageId(args.externalMessageId) : undefined,
      expiresAtIso: new Date(args.nowMs + args.ttlSeconds * 1000).toISOString(),
      contextPolicyVersion: args.policyVersion,
      idleCutoffIso: new Date(args.nowMs - args.idleSeconds * 1000).toISOString(),
    });
  } catch (error) {
    console.error('CARE_CONTEXT_WRITE_DEGRADED', { safeErrorCode: safeCareContextError(error), direction: 'OUTBOUND' });
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');
  if (!sandboxEnabled()) return res.status(404).json({ error: 'CARE_META_SANDBOX_DISABLED' });

  if (req.method === 'GET') {
    const expectedToken = process.env.CARE_META_VERIFY_TOKEN || '';
    if (!expectedToken) return res.status(503).json({ error: 'CARE_META_VERIFY_TOKEN_MISSING' });
    const challenge = verifyMetaWebhook({
      mode: req.query['hub.mode'],
      verifyToken: req.query['hub.verify_token'],
      challenge: req.query['hub.challenge'],
      expectedToken,
    });
    if (!challenge) return res.status(403).send('Forbidden');
    return res.status(200).send(challenge);
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });

  const appSecret = process.env.CARE_META_APP_SECRET || '';
  if (!appSecret) return res.status(503).json({ error: 'CARE_META_APP_SECRET_MISSING' });

  try {
    const rawBody = await readRawBody(req);
    const signatureHeader = headerValue(req.headers['x-hub-signature-256']);
    if (!verifyMetaPayloadSignature({ rawBody, signatureHeader, appSecret })) {
      return res.status(401).json({ error: 'CARE_META_SIGNATURE_INVALID' });
    }

    const payload = JSON.parse(rawBody.toString('utf8')) as unknown;
    const messages = parseMetaWebhook(payload).slice(0, 3);

    if (!liveTestEnabled()) {
      return res.status(200).json({
        accepted: true,
        parsedCount: messages.length,
        channels: messages.map((message) => message.channel),
        modelCalled: false,
        outboundSent: false,
        note: 'Signed Meta receipt only. Model/outbound remain behind explicit live-processing gates.',
      });
    }

    const allowedSenders = allowedTestSenderIds();
    const customerEnabled = customerModeEnabled();
    if (!allowedSenders.size && !customerEnabled) {
      return res.status(503).json({ error: 'CARE_META_TEST_SENDER_ALLOWLIST_MISSING' });
    }

    const outputs: Array<{
      channel: CareChannel;
      duplicate: boolean;
      customerMode: boolean;
      blockedByAllowlist: boolean;
      blockedByChannelGate: boolean;
      blockedByAbuseGuard: boolean;
      blockedByRateLimit: boolean;
      modelCalled: boolean;
      modelFallbackUsed?: boolean;
      contextEnabled?: boolean;
      contextLoadedTurns?: number;
      memoryReadEnabled?: boolean;
      memoryLoadedItems?: number;
      memoryUsedItems?: number;
      memoryWriteEnabled?: boolean;
      memoryWriteEligible?: boolean;
      memoryWriteCandidateCount?: number;
      memoryWriteUpdatedCount?: number;
      memoryWriteReason?: string;
      outboundSent: boolean;
      messageId?: string;
      replyPreview?: string;
    }> = [];

    let dbPromise: Promise<MetaD1Database> | undefined;
    let idempotencyStorePromise: Promise<MetaIdempotencyStore> | undefined;
    let customerStorePromise: Promise<MetaCustomerGuardStore> | undefined;
    let conversationRepository: CareConversationContextRepository | undefined;
    let relationshipMemoryRepository: CareRelationshipMemoryRepository | undefined;

    for (const message of messages) {
      const allowlisted = allowedSenders.has(message.externalSenderId);
      const customerRequest = !allowlisted && customerEnabled;

      if (!channelEnabled(message.channel)) {
        outputs.push({
          channel: message.channel,
          duplicate: false,
          customerMode: false,
          blockedByAllowlist: false,
          blockedByChannelGate: true,
          blockedByAbuseGuard: false,
          blockedByRateLimit: false,
          modelCalled: false,
          outboundSent: false,
        });
        continue;
      }

      if (!allowlisted && !customerEnabled) {
        outputs.push({
          channel: message.channel,
          duplicate: false,
          customerMode: false,
          blockedByAllowlist: true,
          blockedByChannelGate: false,
          blockedByAbuseGuard: false,
          blockedByRateLimit: false,
          modelCalled: false,
          outboundSent: false,
        });
        continue;
      }

      if (customerRequest && message.text.length > customerGuardConfig().maxTextChars) {
        outputs.push({
          channel: message.channel,
          duplicate: false,
          customerMode: true,
          blockedByAllowlist: false,
          blockedByChannelGate: false,
          blockedByAbuseGuard: true,
          blockedByRateLimit: false,
          modelCalled: false,
          outboundSent: false,
        });
        continue;
      }

      const messageId = message.externalMessageId?.trim();
      if (!messageId) throw new Error('CARE_META_MESSAGE_ID_REQUIRED');
      dbPromise ||= metaD1Database();
      idempotencyStorePromise ||= dbPromise.then((db) => createD1MetaIdempotencyStore(db));
      const firstSeen = await (await idempotencyStorePromise).claim({
        channel: message.channel,
        externalMessageId: messageId,
        ttlSeconds: idempotencyTtlSeconds(),
      });
      if (!firstSeen) {
        outputs.push({
          channel: message.channel,
          duplicate: true,
          customerMode: customerRequest,
          blockedByAllowlist: false,
          blockedByChannelGate: false,
          blockedByAbuseGuard: false,
          blockedByRateLimit: false,
          modelCalled: false,
          outboundSent: false,
        });
        continue;
      }

      const accountId = message.externalRecipientId?.trim();
      if (!accountId) throw new Error('CARE_META_ACCOUNT_ID_REQUIRED');

      if (customerRequest) {
        customerStorePromise ||= dbPromise.then((db) => createD1MetaCustomerGuardStore(db));
        const capacityAvailable = await claimCustomerCapacity({
          store: await customerStorePromise,
          senderId: message.externalSenderId,
          accountId,
          channel: message.channel,
        });
        if (!capacityAvailable) {
          outputs.push({
            channel: message.channel,
            duplicate: false,
            customerMode: true,
            blockedByAllowlist: false,
            blockedByChannelGate: false,
            blockedByAbuseGuard: false,
            blockedByRateLimit: true,
            modelCalled: false,
            outboundSent: false,
          });
          continue;
        }
      }

      const contextOn = conversationContextEnabled();
      const memoryReadOn = durableMemoryReadEnabled();
      const memoryWriteOn = durableMemoryWriteEnabled();
      let contextIdentity: CareChannelIdentityRef | undefined;
      let contextLoadedTurns = 0;
      let memoryLoadedItems = 0;
      let memoryUsedItems = 0;
      let memoryModelChars = 0;
      let memoryWriteEligible = false;
      let memoryWriteCandidateCount = 0;
      let memoryWriteUpdatedCount = 0;
      let memoryWriteReason: string | undefined;
      let modelTurns = [message.text];
      let contextConfig: ReturnType<typeof conversationContextConfig> | undefined;

      if (contextOn) {
        contextConfig = conversationContextConfig();
        conversationRepository ||= new SupabaseCareConversationContextRepository(
          createCareConversationContextRpcClient(),
        );
        contextIdentity = deriveCareChannelIdentity({
          secret: contextConfig.secret,
          channel: message.channel,
          accountId,
          externalSubjectId: message.externalSenderId,
        });
        const prepared = await prepareConversation({
          repository: conversationRepository,
          identity: contextIdentity,
          text: message.text,
          externalMessageId: messageId,
          nowMs: Date.now(),
          ttlSeconds: contextConfig.ttlSeconds,
          idleSeconds: contextConfig.idleSeconds,
          maxMessages: contextConfig.maxMessages,
          maxChars: contextConfig.maxChars,
          policyVersion: contextConfig.policyVersion,
        });
        modelTurns = prepared.modelTurns;
        contextLoadedTurns = prepared.loadedTurns;
        console.info('CARE_CONTEXT_READY', {
          loadedTurns: prepared.loadedTurns,
          modelTurns: prepared.modelTurns.length,
          modelChars: prepared.modelChars,
          policyVersion: contextConfig.policyVersion,
        });
      }

      if (durableMemoryReadRequested() && !contextOn) {
        console.error('CARE_MEMORY_READ_DEGRADED', { safeErrorCode: 'CARE_MEMORY_CONTEXT_REQUIRED' });
      }
      if (durableMemoryWriteRequested() && !contextOn) {
        console.error('CARE_MEMORY_WRITE_DEGRADED', { safeErrorCode: 'CARE_MEMORY_CONTEXT_REQUIRED' });
      }

      if (memoryReadOn && contextIdentity) {
        try {
          const memoryConfig = careMemoryReadConfigFromEnv(process.env);
          relationshipMemoryRepository ||= new SupabaseCareRelationshipMemoryRepository(
            createCareRelationshipMemoryRpcClient(),
          );
          const memory = await loadCareMemoryRuntimeTurn({
            repository: relationshipMemoryRepository,
            identity: contextIdentity,
            config: memoryConfig,
            nowIso: new Date().toISOString(),
          });
          memoryLoadedItems = memory.loadedItems;
          memoryUsedItems = memory.usedItems;
          memoryModelChars = memory.modelChars;
          if (memory.modelTurn) modelTurns = [memory.modelTurn, ...modelTurns];
          console.info('CARE_MEMORY_READ_READY', {
            loadedItems: memory.loadedItems,
            usedItems: memory.usedItems,
            modelChars: memory.modelChars,
            purposeScope: memoryConfig.purposeScope,
            memoryContractVersion: memoryConfig.memoryContractVersion,
          });
        } catch (error) {
          console.error('CARE_MEMORY_READ_DEGRADED', { safeErrorCode: safeCareMemoryError(error) });
        }
      }

      const currentModelConfig = modelConfig();
      const modelStartedAtMs = Date.now();
      let modelFallbackUsed = false;
      let decision;
      try {
        decision = await runCareModel({
          config: currentModelConfig,
          channel: message.channel,
          turns: modelTurns,
        });
        console.info('CARE_MODEL_PROVIDER_SUCCESS', {
          provider: currentModelConfig.provider,
          model: currentModelConfig.model,
          elapsedMs: Date.now() - modelStartedAtMs,
          timeoutMs: currentModelConfig.timeoutMs,
          contextEnabled: contextOn,
          contextTurns: modelTurns.length,
          memoryReadEnabled: memoryReadOn,
          memoryItems: memoryUsedItems,
          memoryChars: memoryModelChars,
        });
      } catch (error) {
        const diagnostic = safeCareModelFailureDiagnostic(error, currentModelConfig);
        console.error('CARE_MODEL_PROVIDER_FAILURE', {
          ...diagnostic,
          elapsedMs: Date.now() - modelStartedAtMs,
          timeoutMs: currentModelConfig.timeoutMs,
          contextEnabled: contextOn,
          contextTurns: modelTurns.length,
          memoryReadEnabled: memoryReadOn,
          memoryItems: memoryUsedItems,
          memoryChars: memoryModelChars,
        });
        decision = careModelFailureDecision(message.channel);
        modelFallbackUsed = true;
      }

      if (!channelOutboundEnabled(message.channel)) {
        outputs.push({
          channel: message.channel,
          duplicate: false,
          customerMode: customerRequest,
          blockedByAllowlist: false,
          blockedByChannelGate: false,
          blockedByAbuseGuard: false,
          blockedByRateLimit: false,
          modelCalled: true,
          modelFallbackUsed,
          contextEnabled: contextOn,
          contextLoadedTurns,
          memoryReadEnabled: memoryReadOn,
          memoryLoadedItems,
          memoryUsedItems,
          memoryWriteEnabled: memoryWriteOn,
          memoryWriteEligible,
          memoryWriteCandidateCount,
          memoryWriteUpdatedCount,
          outboundSent: false,
          replyPreview: decision.reply,
        });
        continue;
      }

      const sendStartedAtMs = Date.now();
      const sent = await sendMetaText({
        config: metaSendConfig(message.channel, accountId),
        recipientId: message.externalSenderId,
        text: decision.reply,
      });
      console.info('CARE_META_SEND_SUCCESS', {
        channel: message.channel,
        elapsedMs: Date.now() - sendStartedAtMs,
        contextEnabled: contextOn,
        memoryReadEnabled: memoryReadOn,
        memoryWriteEnabled: memoryWriteOn,
      });

      if (contextOn && contextIdentity && contextConfig && conversationRepository) {
        await recordOutboundConversation({
          repository: conversationRepository,
          identity: contextIdentity,
          text: decision.reply,
          externalMessageId: sent.messageId,
          nowMs: Date.now(),
          ttlSeconds: contextConfig.ttlSeconds,
          idleSeconds: contextConfig.idleSeconds,
          policyVersion: contextConfig.policyVersion,
        });
      }

      if (memoryWriteOn && contextIdentity) {
        try {
          const writeConfig = careMemoryWriteConfigFromEnv(process.env);
          relationshipMemoryRepository ||= new SupabaseCareRelationshipMemoryRepository(
            createCareRelationshipMemoryRpcClient(),
          );
          const writeResult = await applyDeterministicCareMemoryWrite({
            repository: relationshipMemoryRepository,
            identity: contextIdentity,
            modelMemoryDecision: decision.memoryDecision,
            currentCustomerText: message.text,
            sourceRef: `meta:${hashCareExternalMessageId(messageId)}`,
            observedAtIso: new Date().toISOString(),
            config: writeConfig,
          });
          memoryWriteEligible = writeResult.eligible;
          memoryWriteCandidateCount = writeResult.candidateCount;
          memoryWriteUpdatedCount = writeResult.updatedCount;
          memoryWriteReason = writeResult.reason;
          console.info('CARE_MEMORY_WRITE_READY', {
            eligible: writeResult.eligible,
            candidateCount: writeResult.candidateCount,
            updatedCount: writeResult.updatedCount,
            reason: writeResult.reason,
            purposeScope: writeConfig.purposeScope,
            memoryContractVersion: writeConfig.memoryContractVersion,
          });
        } catch (error) {
          memoryWriteReason = safeCareMemoryError(error);
          console.error('CARE_MEMORY_WRITE_DEGRADED', { safeErrorCode: memoryWriteReason });
        }
      }

      outputs.push({
        channel: message.channel,
        duplicate: false,
        customerMode: customerRequest,
        blockedByAllowlist: false,
        blockedByChannelGate: false,
        blockedByAbuseGuard: false,
        blockedByRateLimit: false,
        modelCalled: true,
        modelFallbackUsed,
        contextEnabled: contextOn,
        contextLoadedTurns,
        memoryReadEnabled: memoryReadOn,
        memoryLoadedItems,
        memoryUsedItems,
        memoryWriteEnabled: memoryWriteOn,
        memoryWriteEligible,
        memoryWriteCandidateCount,
        memoryWriteUpdatedCount,
        memoryWriteReason,
        outboundSent: true,
        messageId: sent.messageId,
      });
    }

    const igEnabled = instagramEnabled();
    const igOutboundEnabled = instagramOutboundEnabled();
    const contextOn = conversationContextEnabled();
    const memoryReadOn = durableMemoryReadEnabled();
    const memoryWriteOn = durableMemoryWriteEnabled();
    return res.status(200).json({
      accepted: true,
      liveTest: true,
      customerModeEnabled: customerEnabled,
      outboundGateEnabled: outboundEnabled(),
      instagramEnabled: igEnabled,
      instagramOutboundEnabled: igOutboundEnabled,
      conversationContextEnabled: contextOn,
      durableMemoryReadEnabled: memoryReadOn,
      durableMemoryWriteEnabled: memoryWriteOn,
      guardMode: customerEnabled ? 'META_CUSTOMER_TEXT_REPLY_GUARDED' : 'META_CONTROLLED_LIVE_TEXT_REPLY_ONLY',
      processed: outputs,
      note: memoryReadOn && memoryWriteOn
        ? `Messenger${igEnabled ? ' + Instagram' : ''} replies may use bounded recent-turn context plus allowlisted durable relationship-memory READ/WRITE. Writes happen only after successful outbound and only for deterministic allowed candidates.`
        : memoryReadOn
          ? `Messenger${igEnabled ? ' + Instagram' : ''} replies may use bounded recent-turn context plus allowlisted durable relationship-memory READ. Durable memory WRITE remains disabled.`
          : contextOn
            ? `Messenger${igEnabled ? ' + Instagram' : ''} replies may use bounded recent-turn context. Durable relationship-memory READ/WRITE remains disabled.`
            : `Messenger${igEnabled ? ' + Instagram' : ''} text-only, inbound-triggered replies remain on the current single-turn path; conversation context and durable memory are feature-gated off.`,
    });
  } catch (error) {
    return res.status(502).json({ error: safeError(error) });
  }
}

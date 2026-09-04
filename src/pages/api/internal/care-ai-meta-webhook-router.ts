import type { NextApiRequest, NextApiResponse } from 'next';
import {
  facebookCommentExternalMessageId,
  parseFacebookPageFeedComments,
  sendFacebookPageCommentReply,
} from '../../../lib/care-ai/facebook-comment-channel';
import {
  assertOfficialMetaSendEndpoint,
  createD1MetaCustomerGuardStore,
  createD1MetaIdempotencyStore,
  type MetaCustomerGuardStore,
  type MetaD1Database,
  type MetaIdempotencyStore,
} from '../../../lib/care-ai/meta-channel';
import {
  careModelFailureDecision,
  runCareModel,
  safeCareModelFailureDiagnostic,
  type CareModelProvider,
} from '../../../lib/care-ai/provider-neutral-model';
import { findRuntimeProduct } from '../../../lib/care-ai/runtime-knowledge';
import messengerHandler from './care-ai-meta-webhook-handler';

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

function facebookCommentEnabled(): boolean {
  return liveTestEnabled() && process.env.CARE_META_FACEBOOK_COMMENT_ENABLED === 'true';
}

function facebookCommentOutboundEnabled(): boolean {
  return outboundEnabled()
    && facebookCommentEnabled()
    && process.env.CARE_META_FACEBOOK_COMMENT_OUTBOUND_ENABLED === 'true';
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

function idempotencyTtlSeconds(): number {
  return boundedIntegerEnv('CARE_META_IDEMPOTENCY_TTL_SECONDS', 86400, 300, 604800);
}

function allowedCompatibleHosts(): string[] {
  return (process.env.CARE_MODEL_ALLOWED_COMPATIBLE_HOSTS || '')
    .split(',')
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean);
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

async function readRawBody(req: NextApiRequest): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return Buffer.concat(chunks);
}

function replayRequest(req: NextApiRequest, rawBody: Buffer): NextApiRequest {
  return new Proxy(req, {
    get(target, property, receiver) {
      if (property === Symbol.asyncIterator) {
        return async function* replay() {
          yield rawBody;
        };
      }
      return Reflect.get(target, property, receiver);
    },
  }) as NextApiRequest;
}

interface CapturedResponse {
  statusCode: number;
  body: unknown;
  headers: Record<string, unknown>;
}

function captureResponse(): { response: NextApiResponse; captured: CapturedResponse } {
  const captured: CapturedResponse = { statusCode: 200, body: undefined, headers: {} };
  const response = {
    setHeader(name: string, value: unknown) {
      captured.headers[name.toLowerCase()] = value;
      return response;
    },
    status(code: number) {
      captured.statusCode = code;
      return response;
    },
    json(body: unknown) {
      captured.body = body;
      return response;
    },
    send(body: unknown) {
      captured.body = body;
      return response;
    },
    end(body?: unknown) {
      captured.body = body;
      return response;
    },
  } as unknown as NextApiResponse;
  return { response, captured };
}

function safeError(error: unknown): string {
  if (!(error instanceof Error)) return 'CARE_META_COMMENT_UNKNOWN_ERROR';
  if (error.message.startsWith('CARE_META_') || error.message.startsWith('CARE_MODEL_')) {
    return error.message.slice(0, 120);
  }
  return 'CARE_META_COMMENT_BRIDGE_ERROR';
}

async function claimCommentCapacity(args: {
  store: MetaCustomerGuardStore;
  senderId: string;
  pageId: string;
}): Promise<boolean> {
  const limits = customerGuardConfig();
  const sender = await args.store.claim({
    scope: `sender:facebook_comment:${args.pageId}:${args.senderId}`,
    limit: limits.senderLimit,
    windowSeconds: limits.senderWindowSeconds,
  });
  if (!sender.allowed) return false;
  const global = await args.store.claim({
    scope: `global:facebook_comment:${args.pageId}:hour`,
    limit: limits.globalLimit,
    windowSeconds: limits.globalWindowSeconds,
  });
  if (!global.allowed) return false;
  const daily = await args.store.claim({
    scope: `global:facebook_comment:${args.pageId}:day`,
    limit: limits.dailyLimit,
    windowSeconds: limits.dailyWindowSeconds,
  });
  return daily.allowed;
}

function publicAutoReplyEligible(text: string): boolean {
  // Phase 1 intentionally limits autonomous public replies to recognized current products.
  // Other comments remain visible to humans and can be expanded only after bounded live evidence.
  return text.length <= 800 && Boolean(findRuntimeProduct(text));
}

function forwardCaptured(res: NextApiResponse, captured: CapturedResponse) {
  for (const [name, value] of Object.entries(captured.headers)) res.setHeader(name, value as string | number | readonly string[]);
  if (typeof captured.body === 'string' || Buffer.isBuffer(captured.body)) {
    return res.status(captured.statusCode).send(captured.body);
  }
  return res.status(captured.statusCode).json(captured.body ?? {});
}

export default async function router(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return messengerHandler(req, res);
  if (!sandboxEnabled()) return messengerHandler(req, res);

  try {
    const rawBody = await readRawBody(req);
    const replay = replayRequest(req, rawBody);
    const { response: capturedResponse, captured } = captureResponse();

    // The proven Messenger handler remains the authority for signature verification and
    // continues to process any Messenger/Instagram events in the same signed batch.
    await messengerHandler(replay, capturedResponse);
    if (captured.statusCode !== 200) return forwardCaptured(res, captured);

    let payload: unknown;
    try {
      payload = JSON.parse(rawBody.toString('utf8')) as unknown;
    } catch {
      return forwardCaptured(res, captured);
    }

    const comments = parseFacebookPageFeedComments(payload).slice(0, 2);
    if (!comments.length) return forwardCaptured(res, captured);

    const commentEnabled = facebookCommentEnabled();
    const commentOutbound = facebookCommentOutboundEnabled();
    const existingBody = captured.body && typeof captured.body === 'object'
      ? captured.body as Record<string, unknown>
      : { messengerResult: captured.body };

    if (!commentEnabled) {
      return res.status(200).json({
        ...existingBody,
        facebookCommentEnabled: false,
        facebookCommentOutboundEnabled: false,
        facebookComments: comments.map(() => ({
          accepted: true,
          gatedOff: true,
          modelCalled: false,
          outboundSent: false,
        })),
        note: 'Signed Page feed comments detected, but the dedicated P07 comment gate remains OFF.',
      });
    }

    const allowedSenders = allowedTestSenderIds();
    const customerEnabled = customerModeEnabled();
    if (!allowedSenders.size && !customerEnabled) {
      return res.status(503).json({ error: 'CARE_META_TEST_SENDER_ALLOWLIST_MISSING' });
    }

    const sendEndpoint = process.env.CARE_META_MESSENGER_SEND_ENDPOINT || '';
    const accessToken = process.env.CARE_META_MESSENGER_ACCESS_TOKEN || '';
    const currentModelConfig = modelConfig();
    let dbPromise: Promise<MetaD1Database> | undefined;
    let idempotencyStorePromise: Promise<MetaIdempotencyStore> | undefined;
    let customerStorePromise: Promise<MetaCustomerGuardStore> | undefined;

    const outputs: Array<{
      accepted: boolean;
      duplicate: boolean;
      customerMode: boolean;
      blockedByAllowlist: boolean;
      blockedByAbuseGuard: boolean;
      blockedByRateLimit: boolean;
      requiresHumanReview: boolean;
      modelCalled: boolean;
      modelFallbackUsed: boolean;
      outboundSent: boolean;
    }> = [];

    for (const comment of comments) {
      // Fail closed on events for a Page other than the Page pinned in the existing Messenger endpoint.
      assertOfficialMetaSendEndpoint(sendEndpoint, 'facebook_messenger', comment.pageId);
      const allowlisted = allowedSenders.has(comment.senderId);
      const customerRequest = !allowlisted && customerEnabled;

      if (!allowlisted && !customerEnabled) {
        outputs.push({
          accepted: true,
          duplicate: false,
          customerMode: false,
          blockedByAllowlist: true,
          blockedByAbuseGuard: false,
          blockedByRateLimit: false,
          requiresHumanReview: false,
          modelCalled: false,
          modelFallbackUsed: false,
          outboundSent: false,
        });
        continue;
      }

      if (customerRequest && comment.message.length > customerGuardConfig().maxTextChars) {
        outputs.push({
          accepted: true,
          duplicate: false,
          customerMode: true,
          blockedByAllowlist: false,
          blockedByAbuseGuard: true,
          blockedByRateLimit: false,
          requiresHumanReview: false,
          modelCalled: false,
          modelFallbackUsed: false,
          outboundSent: false,
        });
        continue;
      }

      dbPromise ||= metaD1Database();
      idempotencyStorePromise ||= dbPromise.then((db) => createD1MetaIdempotencyStore(db));
      const firstSeen = await (await idempotencyStorePromise).claim({
        channel: 'facebook_messenger',
        externalMessageId: facebookCommentExternalMessageId(comment),
        ttlSeconds: idempotencyTtlSeconds(),
      });
      if (!firstSeen) {
        outputs.push({
          accepted: true,
          duplicate: true,
          customerMode: customerRequest,
          blockedByAllowlist: false,
          blockedByAbuseGuard: false,
          blockedByRateLimit: false,
          requiresHumanReview: false,
          modelCalled: false,
          modelFallbackUsed: false,
          outboundSent: false,
        });
        continue;
      }

      if (customerRequest) {
        customerStorePromise ||= dbPromise.then((db) => createD1MetaCustomerGuardStore(db));
        const capacity = await claimCommentCapacity({
          store: await customerStorePromise,
          senderId: comment.senderId,
          pageId: comment.pageId,
        });
        if (!capacity) {
          outputs.push({
            accepted: true,
            duplicate: false,
            customerMode: true,
            blockedByAllowlist: false,
            blockedByAbuseGuard: false,
            blockedByRateLimit: true,
            requiresHumanReview: false,
            modelCalled: false,
            modelFallbackUsed: false,
            outboundSent: false,
          });
          continue;
        }
      }

      if (!publicAutoReplyEligible(comment.message)) {
        outputs.push({
          accepted: true,
          duplicate: false,
          customerMode: customerRequest,
          blockedByAllowlist: false,
          blockedByAbuseGuard: false,
          blockedByRateLimit: false,
          requiresHumanReview: true,
          modelCalled: false,
          modelFallbackUsed: false,
          outboundSent: false,
        });
        continue;
      }

      const modelStartedAtMs = Date.now();
      let decision;
      let modelFallbackUsed = false;
      try {
        decision = await runCareModel({
          config: currentModelConfig,
          channel: 'facebook_messenger',
          turns: [comment.message],
          surface: 'public_comment',
        });
        console.info('CARE_META_COMMENT_MODEL_SUCCESS', {
          elapsedMs: Date.now() - modelStartedAtMs,
          timeoutMs: currentModelConfig.timeoutMs,
        });
      } catch (error) {
        modelFallbackUsed = true;
        const diagnostic = safeCareModelFailureDiagnostic(error, currentModelConfig);
        console.error('CARE_META_COMMENT_MODEL_FAILURE', {
          ...diagnostic,
          elapsedMs: Date.now() - modelStartedAtMs,
          timeoutMs: currentModelConfig.timeoutMs,
        });
        decision = careModelFailureDecision('facebook_messenger');
      }

      // Public comments fail closed on provider/model failure; never post a generic fallback publicly.
      if (modelFallbackUsed || !commentOutbound) {
        outputs.push({
          accepted: true,
          duplicate: false,
          customerMode: customerRequest,
          blockedByAllowlist: false,
          blockedByAbuseGuard: false,
          blockedByRateLimit: false,
          requiresHumanReview: modelFallbackUsed,
          modelCalled: true,
          modelFallbackUsed,
          outboundSent: false,
        });
        continue;
      }

      const sendStartedAtMs = Date.now();
      await sendFacebookPageCommentReply({
        messengerSendEndpoint: sendEndpoint,
        accessToken,
        pageId: comment.pageId,
        commentId: comment.commentId,
        text: decision.reply,
      });
      console.info('CARE_META_COMMENT_SEND_SUCCESS', {
        elapsedMs: Date.now() - sendStartedAtMs,
      });
      outputs.push({
        accepted: true,
        duplicate: false,
        customerMode: customerRequest,
        blockedByAllowlist: false,
        blockedByAbuseGuard: false,
        blockedByRateLimit: false,
        requiresHumanReview: false,
        modelCalled: true,
        modelFallbackUsed: false,
        outboundSent: true,
      });
    }

    return res.status(200).json({
      ...existingBody,
      facebookCommentEnabled: commentEnabled,
      facebookCommentOutboundEnabled: commentOutbound,
      facebookComments: outputs,
      note: commentOutbound
        ? 'Facebook Page comments use a separate public-safe product-comment gate. No durable memory/context is read and no private DM is sent by this phase.'
        : 'Facebook Page comment parsing/model path is prepared, but public comment outbound remains OFF.',
    });
  } catch (error) {
    return res.status(502).json({ error: safeError(error) });
  }
}

import type { NextApiRequest, NextApiResponse } from 'next';
import {
  facebookCommentExternalMessageId,
  parseFacebookPageFeedComments,
} from '../../../lib/care-ai/facebook-comment-channel';
import {
  parseMetaWebhook,
  verifyMetaPayloadSignature,
  type MetaD1Database,
} from '../../../lib/care-ai/meta-channel';
import {
  D1CareOperabilityStore,
  markCareOperabilitySafely,
  safeCareOperabilityErrorCode,
  type CareOperabilityChannel,
  type CareOperabilityStage,
  type CareOperabilityStore,
} from '../../../lib/care-ai/operability';
import router from './care-ai-meta-webhook-router';

interface CapturedResponse {
  statusCode: number;
  body: unknown;
}

interface OperabilityTarget {
  channel: CareOperabilityChannel;
  externalMessageId: string;
}

type UnknownRecord = Record<string, unknown>;

function eventsEnabled(): boolean {
  return process.env.CARE_META_SANDBOX_ENABLED === 'true'
    && process.env.CARE_META_LIVE_TEST_ENABLED === 'true'
    && process.env.CARE_META_OPERABILITY_EVENTS_ENABLED === 'true';
}

function headerValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function record(value: unknown): UnknownRecord | undefined {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as UnknownRecord : undefined;
}

function truthy(value: unknown): boolean {
  return value === true;
}

async function metaD1Database(): Promise<MetaD1Database> {
  try {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare');
    const { env } = await getCloudflareContext({ async: true });
    const db = (env as unknown as { CARE_META_IDEMPOTENCY_DB?: MetaD1Database }).CARE_META_IDEMPOTENCY_DB;
    if (!db) throw new Error('CARE_OPERABILITY_STORE_MISSING');
    return db;
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('CARE_')) throw error;
    throw new Error('CARE_OPERABILITY_STORE_UNAVAILABLE');
  }
}

function parseTargets(rawBody: Buffer): { messages: OperabilityTarget[]; comments: OperabilityTarget[] } {
  let payload: unknown;
  try {
    payload = JSON.parse(rawBody.toString('utf8')) as unknown;
  } catch {
    return { messages: [], comments: [] };
  }

  const messages = parseMetaWebhook(payload)
    .slice(0, 3)
    .flatMap((message): OperabilityTarget[] => {
      const externalMessageId = message.externalMessageId?.trim();
      if (!externalMessageId || (message.channel !== 'facebook_messenger' && message.channel !== 'instagram')) return [];
      return [{ channel: message.channel, externalMessageId }];
    });

  const comments = parseFacebookPageFeedComments(payload)
    .slice(0, 2)
    .map((comment): OperabilityTarget => ({
      channel: 'facebook_comment',
      externalMessageId: facebookCommentExternalMessageId(comment),
    }));

  return { messages, comments };
}

async function markTargets(
  store: CareOperabilityStore,
  targets: OperabilityTarget[],
  stage: CareOperabilityStage,
  customerMode: boolean,
  error?: unknown,
): Promise<void> {
  for (const target of targets) {
    await markCareOperabilitySafely({
      store,
      channel: target.channel,
      externalMessageId: target.externalMessageId,
      stage,
      customerMode,
      error,
    });
  }
}

export function careOperabilityStagesForOutcome(value: unknown): CareOperabilityStage[] {
  const output = record(value);
  if (!output) return [];
  if (truthy(output.duplicate)) return ['DUPLICATE'];

  const modelCalled = truthy(output.modelCalled);
  const modelFallbackUsed = truthy(output.modelFallbackUsed);
  const outboundSent = truthy(output.outboundSent);
  const gated = truthy(output.gatedOff) || truthy(output.blockedByChannelGate);
  const policyNoReply = truthy(output.requiresHumanReview)
    || truthy(output.blockedByAllowlist)
    || truthy(output.blockedByAbuseGuard)
    || truthy(output.blockedByRateLimit);

  if (!modelCalled) {
    if (gated) return ['OUTBOUND_GATED'];
    if (policyNoReply) return ['POLICY_NO_AUTO_REPLY'];
    return [];
  }

  const stages: CareOperabilityStage[] = [modelFallbackUsed ? 'MODEL_FAILURE' : 'MODEL_SUCCESS'];
  if (outboundSent) stages.push('OUTBOUND_SUCCESS');
  else if (!modelFallbackUsed) stages.push('OUTBOUND_GATED');
  return stages;
}

export function careOperabilityStageForFailedRequest(errorCode: string): CareOperabilityStage {
  return /MODEL/.test(errorCode) ? 'MODEL_FAILURE' : 'OUTBOUND_FAILURE';
}

function observedResponse(res: NextApiResponse, captured: CapturedResponse): NextApiResponse {
  const proxy = new Proxy(res, {
    get(target, property, receiver) {
      if (property === 'status') {
        return (code: number) => {
          captured.statusCode = code;
          target.status(code);
          return proxy;
        };
      }
      if (property === 'json') {
        return (body: unknown) => {
          captured.body = body;
          return target.json(body);
        };
      }
      if (property === 'send') {
        return (body: unknown) => {
          captured.body = body;
          return target.send(body);
        };
      }
      if (property === 'end') {
        return (body?: unknown) => {
          if (body !== undefined) captured.body = body;
          return target.end(body as never);
        };
      }
      if (property === 'setHeader') {
        return (name: string, value: string | number | readonly string[]) => {
          target.setHeader(name, value);
          return proxy;
        };
      }
      const original = Reflect.get(target, property, receiver);
      return typeof original === 'function' ? original.bind(target) : original;
    },
    set(target, property, value, receiver) {
      if (property === 'statusCode' && typeof value === 'number') captured.statusCode = value;
      return Reflect.set(target, property, value, receiver);
    },
  }) as NextApiResponse;
  return proxy;
}

function teeRequest(
  req: NextApiRequest,
  chunks: Buffer[],
  onComplete: (rawBody: Buffer) => Promise<void>,
): NextApiRequest {
  let completed = false;
  return new Proxy(req, {
    get(target, property, receiver) {
      if (property === Symbol.asyncIterator) {
        return async function* iterator() {
          for await (const chunk of target) {
            const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
            chunks.push(buffer);
            yield buffer;
          }
          if (!completed) {
            completed = true;
            try {
              await onComplete(Buffer.concat(chunks));
            } catch (error) {
              console.error('CARE_OPERABILITY_RECEIPT_DEGRADED', {
                safeErrorCode: safeCareOperabilityErrorCode(error),
              });
            }
          }
        };
      }
      return Reflect.get(target, property, receiver);
    },
  }) as NextApiRequest;
}

async function finalizeSuccessfulResponse(args: {
  store: CareOperabilityStore;
  rawBody: Buffer;
  captured: CapturedResponse;
}): Promise<void> {
  const body = record(args.captured.body);
  if (!body) return;
  const targets = parseTargets(args.rawBody);

  const processed = Array.isArray(body.processed) ? body.processed : [];
  for (let index = 0; index < Math.min(processed.length, targets.messages.length); index += 1) {
    const output = record(processed[index]);
    if (!output) continue;
    const customerMode = truthy(output.customerMode);
    for (const stage of careOperabilityStagesForOutcome(output)) {
      await markTargets(args.store, [targets.messages[index]], stage, customerMode);
    }
  }

  const facebookComments = Array.isArray(body.facebookComments) ? body.facebookComments : [];
  for (let index = 0; index < Math.min(facebookComments.length, targets.comments.length); index += 1) {
    const output = record(facebookComments[index]);
    if (!output) continue;
    const customerMode = truthy(output.customerMode);
    for (const stage of careOperabilityStagesForOutcome(output)) {
      await markTargets(args.store, [targets.comments[index]], stage, customerMode);
    }
  }
}

async function finalizeFailedResponse(args: {
  store: CareOperabilityStore;
  rawBody: Buffer;
  captured: CapturedResponse;
}): Promise<void> {
  const body = record(args.captured.body);
  const rawError = typeof body?.error === 'string' ? body.error : 'CARE_OPERABILITY_HANDLER_FAILURE';
  const safeError = safeCareOperabilityErrorCode(rawError);
  const stage = careOperabilityStageForFailedRequest(safeError);
  const targets = parseTargets(args.rawBody);
  const allTargets = [...targets.messages, ...targets.comments];
  await markTargets(args.store, allTargets, stage, true, safeError);
}

export default async function operabilityWrappedMetaWebhook(req: NextApiRequest, res: NextApiResponse) {
  if (!eventsEnabled() || req.method !== 'POST') return router(req, res);

  const chunks: Buffer[] = [];
  const captured: CapturedResponse = { statusCode: 200, body: undefined };
  let storePromise: Promise<CareOperabilityStore> | undefined;
  const getStore = () => {
    storePromise ||= metaD1Database().then((db) => new D1CareOperabilityStore(db));
    return storePromise;
  };

  const observedReq = teeRequest(req, chunks, async (rawBody) => {
    const appSecret = process.env.CARE_META_APP_SECRET || '';
    if (!appSecret) return;
    const signatureHeader = headerValue(req.headers['x-hub-signature-256']);
    if (!verifyMetaPayloadSignature({ rawBody, signatureHeader, appSecret })) return;

    const targets = parseTargets(rawBody);
    if (!targets.messages.length && !targets.comments.length) return;
    const store = await getStore();
    await markTargets(store, [...targets.messages, ...targets.comments], 'RECEIVED', true);
  });

  const result = await router(observedReq, observedResponse(res, captured));

  try {
    const rawBody = Buffer.concat(chunks);
    const store = await getStore();
    if (captured.statusCode >= 500) {
      await finalizeFailedResponse({ store, rawBody, captured });
    } else if (captured.statusCode === 200) {
      await finalizeSuccessfulResponse({ store, rawBody, captured });
    }
  } catch (error) {
    console.error('CARE_OPERABILITY_FINALIZE_DEGRADED', {
      safeErrorCode: safeCareOperabilityErrorCode(error),
    });
  }

  return result;
}

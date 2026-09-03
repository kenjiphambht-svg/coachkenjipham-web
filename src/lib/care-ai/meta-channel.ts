import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import type { CareChannel } from './contracts';

export interface CareInboundMessage {
  channel: CareChannel;
  externalSenderId: string;
  externalRecipientId?: string;
  externalMessageId?: string;
  text: string;
  timestamp?: number;
  rawKind: 'website' | 'meta_messaging';
}

interface MetaMessagingEvent {
  sender?: { id?: string };
  recipient?: { id?: string };
  timestamp?: number;
  message?: { text?: string; mid?: string; is_echo?: boolean; is_self?: boolean };
}

interface MetaWebhookPayload {
  object?: string;
  entry?: Array<{ messaging?: MetaMessagingEvent[] }>;
}

type MetaSendChannel = Extract<CareChannel, 'facebook_messenger' | 'instagram'>;
type MetaMessengerSenderAction = 'typing_on' | 'typing_off';

export interface MetaSendConfig {
  channel: MetaSendChannel;
  sendEndpoint: string;
  accessToken: string;
  expectedAccountId?: string;
}

export interface MetaIdempotencyStore {
  claim(args: {
    channel: CareChannel;
    externalMessageId: string;
    ttlSeconds: number;
    nowMs?: number;
  }): Promise<boolean>;
}

export interface MetaCustomerGuardStore {
  claim(args: {
    scope: string;
    limit: number;
    windowSeconds: number;
    nowMs?: number;
  }): Promise<{ allowed: boolean; count?: number }>;
}

export interface MetaD1PreparedStatement {
  bind(...values: unknown[]): MetaD1PreparedStatement;
  first<T = Record<string, unknown>>(): Promise<T | null>;
}

export interface MetaD1Database {
  prepare(sql: string): MetaD1PreparedStatement;
}

const META_MESSENGER_SEND_HOST = 'graph.facebook.com';
const META_INSTAGRAM_SEND_HOST = 'graph.instagram.com';
const META_DELIVERY_CLAIM_TABLE = 'care_meta_delivery_claims';
const META_CUSTOMER_RATE_LIMIT_TABLE = 'care_meta_customer_rate_limits';
const META_MESSENGER_TYPING_MIN_VISIBLE_MS = 180;

function textFromEvent(event: MetaMessagingEvent): string | undefined {
  if (event.message?.is_echo || event.message?.is_self) return undefined;
  if (event.message?.text?.trim()) return event.message.text.trim();
  return undefined;
}

export function websiteInbound(text: string): CareInboundMessage {
  return {
    channel: 'website',
    externalSenderId: 'synthetic-website-user',
    text: text.trim(),
    rawKind: 'website',
  };
}

export function parseMetaWebhook(payload: unknown): CareInboundMessage[] {
  if (!payload || typeof payload !== 'object') return [];
  const body = payload as MetaWebhookPayload;
  const channel: CareChannel | undefined =
    body.object === 'page' ? 'facebook_messenger' : body.object === 'instagram' ? 'instagram' : undefined;
  if (!channel) return [];

  const messages: CareInboundMessage[] = [];
  for (const entry of body.entry || []) {
    for (const event of entry.messaging || []) {
      const text = textFromEvent(event);
      const senderId = event.sender?.id;
      if (!text || !senderId) continue;
      messages.push({
        channel,
        externalSenderId: senderId,
        externalRecipientId: event.recipient?.id,
        externalMessageId: event.message?.mid,
        text,
        timestamp: event.timestamp,
        rawKind: 'meta_messaging',
      });
    }
  }
  return messages;
}

export function syntheticChannelInbound(channel: CareChannel, text: string): CareInboundMessage {
  if (channel === 'website') return websiteInbound(text);
  return {
    channel,
    externalSenderId: channel === 'facebook_messenger' ? 'synthetic-psid' : 'synthetic-igsid',
    externalRecipientId: channel === 'facebook_messenger' ? 'synthetic-page-id' : 'synthetic-ig-id',
    externalMessageId: `synthetic-${channel}`,
    text: text.trim(),
    timestamp: Date.now(),
    rawKind: 'meta_messaging',
  };
}

export function formatMetaTextSendPayload(channel: MetaSendChannel, recipientId: string, text: string) {
  const payload = {
    recipient: { id: recipientId },
    message: { text },
  };
  if (channel === 'instagram') return payload;
  return {
    ...payload,
    messaging_type: 'RESPONSE',
  };
}

export function formatMetaMessengerSenderActionPayload(
  recipientId: string,
  senderAction: MetaMessengerSenderAction,
) {
  return {
    recipient: { id: recipientId },
    sender_action: senderAction,
  };
}

export function assertOfficialMetaSendEndpoint(
  raw: string,
  channel: MetaSendChannel,
  expectedAccountId?: string,
): string {
  let endpoint: URL;
  try {
    endpoint = new URL(raw);
  } catch {
    throw new Error('CARE_META_SEND_ENDPOINT_INVALID');
  }
  const expectedHost = channel === 'instagram' ? META_INSTAGRAM_SEND_HOST : META_MESSENGER_SEND_HOST;
  if (
    endpoint.protocol !== 'https:' ||
    endpoint.hostname.toLowerCase() !== expectedHost ||
    endpoint.port ||
    endpoint.username || endpoint.password ||
    endpoint.search ||
    endpoint.hash
  ) {
    throw new Error('CARE_META_SEND_ENDPOINT_NOT_OFFICIAL');
  }
  const match = endpoint.pathname.match(/^\/v\d+\.\d+\/([^/]+)\/messages\/?$/);
  if (!match) throw new Error('CARE_META_SEND_ENDPOINT_PATH_INVALID');
  const accountId = decodeURIComponent(match[1]);
  if (expectedAccountId && accountId !== expectedAccountId) {
    throw new Error(
      channel === 'instagram' ? 'CARE_META_SEND_ENDPOINT_INSTAGRAM_ACCOUNT_MISMATCH' : 'CARE_META_SEND_ENDPOINT_PAGE_MISMATCH',
    );
  }
  return endpoint.toString();
}

function safeMetaErrorNumber(value: unknown): string | undefined {
  if (typeof value === 'number' && Number.isInteger(value) && value >= 0) return String(value);
  if (typeof value === 'string' && /^\d{1,10}$/.test(value)) return value;
  return undefined;
}

async function metaSendFailure(response: Response): Promise<Error> {
  let code: string | undefined;
  let subcode: string | undefined;
  try {
    const payload = (await response.json()) as { error?: { code?: unknown; error_subcode?: unknown } };
    code = safeMetaErrorNumber(payload.error?.code);
    subcode = safeMetaErrorNumber(payload.error?.error_subcode);
  } catch {
    // Upstream error body is intentionally ignored unless it contains safe numeric diagnostics.
  }

  const diagnostic = { status: response.status, code: code ?? null, subcode: subcode ?? null };
  console.error('CARE_META_SEND_FAILURE', diagnostic);

  let errorCode = `CARE_META_SEND_HTTP_${response.status}`;
  if (code) errorCode += `_CODE_${code}`;
  if (subcode) errorCode += `_SUBCODE_${subcode}`;
  return new Error(errorCode);
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendMessengerSenderAction(args: {
  endpoint: string;
  accessToken: string;
  recipientId: string;
  senderAction: MetaMessengerSenderAction;
}): Promise<boolean> {
  try {
    const response = await fetch(args.endpoint, {
      method: 'POST',
      redirect: 'manual',
      headers: {
        Authorization: `Bearer ${args.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formatMetaMessengerSenderActionPayload(args.recipientId, args.senderAction)),
    });
    if (!response.ok) {
      console.warn('CARE_META_TYPING_DEGRADED', { status: response.status, senderAction: args.senderAction });
      return false;
    }
    return true;
  } catch {
    console.warn('CARE_META_TYPING_DEGRADED', { status: null, senderAction: args.senderAction });
    return false;
  }
}

export async function sendMetaText(args: {
  config: MetaSendConfig;
  recipientId: string;
  text: string;
}): Promise<{ recipientId?: string; messageId?: string }> {
  if (!args.config.sendEndpoint) throw new Error('CARE_META_SEND_ENDPOINT_REQUIRED');
  if (!args.config.accessToken) throw new Error('CARE_META_ACCESS_TOKEN_REQUIRED');
  const endpoint = assertOfficialMetaSendEndpoint(
    args.config.sendEndpoint,
    args.config.channel,
    args.config.expectedAccountId,
  );

  let typingOn = false;
  if (args.config.channel === 'facebook_messenger') {
    typingOn = await sendMessengerSenderAction({
      endpoint,
      accessToken: args.config.accessToken,
      recipientId: args.recipientId,
      senderAction: 'typing_on',
    });
    if (typingOn) await wait(META_MESSENGER_TYPING_MIN_VISIBLE_MS);
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      redirect: 'manual',
      headers: {
        Authorization: `Bearer ${args.config.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formatMetaTextSendPayload(args.config.channel, args.recipientId, args.text)),
    });
    if (!response.ok) throw await metaSendFailure(response);
    const payload = (await response.json()) as { recipient_id?: string; message_id?: string };
    return { recipientId: payload.recipient_id, messageId: payload.message_id };
  } finally {
    if (typingOn) {
      await sendMessengerSenderAction({
        endpoint,
        accessToken: args.config.accessToken,
        recipientId: args.recipientId,
        senderAction: 'typing_off',
      });
    }
  }
}

function deliveryClaimKey(channel: CareChannel, externalMessageId: string): string {
  return createHash('sha256').update(`${channel}\u0000${externalMessageId}`, 'utf8').digest('hex');
}

function customerScopeKey(scope: string): string {
  return createHash('sha256').update(`care-meta-customer\u0000${scope}`, 'utf8').digest('hex');
}

export function createD1MetaIdempotencyStore(db: MetaD1Database): MetaIdempotencyStore {
  return {
    async claim({ channel, externalMessageId, ttlSeconds, nowMs = Date.now() }) {
      if (!externalMessageId.trim()) throw new Error('CARE_META_MESSAGE_ID_REQUIRED');
      if (!Number.isInteger(ttlSeconds) || ttlSeconds < 300 || ttlSeconds > 604800) {
        throw new Error('CARE_META_IDEMPOTENCY_TTL_INVALID');
      }
      const claimKey = deliveryClaimKey(channel, externalMessageId);
      const expiresAtMs = nowMs + ttlSeconds * 1000;
      const result = await db
        .prepare(
          `INSERT INTO ${META_DELIVERY_CLAIM_TABLE} (claim_key, expires_at_ms)\n` +
            `VALUES (?1, ?2)\n` +
            `ON CONFLICT(claim_key) DO UPDATE SET expires_at_ms = excluded.expires_at_ms\n` +
            `WHERE ${META_DELIVERY_CLAIM_TABLE}.expires_at_ms <= ?3\n` +
            `RETURNING claim_key`,
        )
        .bind(claimKey, expiresAtMs, nowMs)
        .first<{ claim_key: string }>();
      return result?.claim_key === claimKey;
    },
  };
}

export function createD1MetaCustomerGuardStore(db: MetaD1Database): MetaCustomerGuardStore {
  return {
    async claim({ scope, limit, windowSeconds, nowMs = Date.now() }) {
      if (!scope.trim()) throw new Error('CARE_META_CUSTOMER_RATE_SCOPE_REQUIRED');
      if (!Number.isInteger(limit) || limit < 1 || limit > 10000) {
        throw new Error('CARE_META_CUSTOMER_RATE_LIMIT_INVALID');
      }
      if (!Number.isInteger(windowSeconds) || windowSeconds < 10 || windowSeconds > 86400) {
        throw new Error('CARE_META_CUSTOMER_RATE_WINDOW_INVALID');
      }
      const scopeKey = customerScopeKey(scope);
      const expiresAtMs = nowMs + windowSeconds * 1000;
      const result = await db
        .prepare(
          `INSERT INTO ${META_CUSTOMER_RATE_LIMIT_TABLE} (scope_key, window_started_ms, count, expires_at_ms)\n` +
            `VALUES (?1, ?2, 1, ?3)\n` +
            `ON CONFLICT(scope_key) DO UPDATE SET\n` +
            `window_started_ms = CASE WHEN ${META_CUSTOMER_RATE_LIMIT_TABLE}.expires_at_ms <= ?2 THEN ?2 ELSE ${META_CUSTOMER_RATE_LIMIT_TABLE}.window_started_ms END,\n` +
            `count = CASE WHEN ${META_CUSTOMER_RATE_LIMIT_TABLE}.expires_at_ms <= ?2 THEN 1 ELSE ${META_CUSTOMER_RATE_LIMIT_TABLE}.count + 1 END,\n` +
            `expires_at_ms = CASE WHEN ${META_CUSTOMER_RATE_LIMIT_TABLE}.expires_at_ms <= ?2 THEN ?3 ELSE ${META_CUSTOMER_RATE_LIMIT_TABLE}.expires_at_ms END\n` +
            `WHERE ${META_CUSTOMER_RATE_LIMIT_TABLE}.expires_at_ms <= ?2 OR ${META_CUSTOMER_RATE_LIMIT_TABLE}.count < ?4\n` +
            `RETURNING count`,
        )
        .bind(scopeKey, nowMs, expiresAtMs, limit)
        .first<{ count: number }>();
      return result ? { allowed: true, count: result.count } : { allowed: false };
    },
  };
}

export function verifyMetaWebhook(args: {
  mode?: string | string[];
  verifyToken?: string | string[];
  challenge?: string | string[];
  expectedToken: string;
}): string | null {
  const mode = Array.isArray(args.mode) ? args.mode[0] : args.mode;
  const token = Array.isArray(args.verifyToken) ? args.verifyToken[0] : args.verifyToken;
  const challenge = Array.isArray(args.challenge) ? args.challenge[0] : args.challenge;
  if (mode === 'subscribe' && token === args.expectedToken && challenge) return challenge;
  return null;
}

export function verifyMetaPayloadSignature(args: {
  rawBody: Buffer;
  signatureHeader?: string;
  appSecret: string;
}): boolean {
  if (!args.signatureHeader?.startsWith('sha256=') || !args.appSecret) return false;
  const receivedHex = args.signatureHeader.slice('sha256='.length);
  if (!/^[a-f0-9]{64}$/i.test(receivedHex)) return false;
  const expected = Buffer.from(createHmac('sha256', args.appSecret).update(args.rawBody).digest('hex'), 'utf8');
  const received = Buffer.from(receivedHex.toLowerCase(), 'utf8');
  return expected.length === received.length && timingSafeEqual(expected, received);
}

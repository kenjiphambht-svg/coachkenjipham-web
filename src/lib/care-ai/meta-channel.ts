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
  message?: { text?: string; mid?: string };
}

interface MetaWebhookPayload {
  object?: string;
  entry?: Array<{ messaging?: MetaMessagingEvent[] }>;
}

export interface MetaSendConfig {
  sendEndpoint: string;
  accessToken: string;
  expectedPageId?: string;
}

export interface MetaIdempotencyStore {
  claim(args: {
    channel: CareChannel;
    externalMessageId: string;
    ttlSeconds: number;
    nowMs?: number;
  }): Promise<boolean>;
}

export interface MetaD1PreparedStatement {
  bind(...values: unknown[]): MetaD1PreparedStatement;
  first<T = Record<string, unknown>>(): Promise<T | null>;
}

export interface MetaD1Database {
  prepare(sql: string): MetaD1PreparedStatement;
}

const META_SEND_HOST = 'graph.facebook.com';
const META_DELIVERY_CLAIM_TABLE = 'care_meta_delivery_claims';

function textFromEvent(event: MetaMessagingEvent): string | undefined {
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

export function formatMetaTextSendPayload(recipientId: string, text: string) {
  return {
    recipient: { id: recipientId },
    messaging_type: 'RESPONSE',
    message: { text },
  };
}

export function assertOfficialMetaSendEndpoint(raw: string, expectedPageId?: string): string {
  let endpoint: URL;
  try {
    endpoint = new URL(raw);
  } catch {
    throw new Error('CARE_META_SEND_ENDPOINT_INVALID');
  }
  if (
    endpoint.protocol !== 'https:' ||
    endpoint.hostname.toLowerCase() !== META_SEND_HOST ||
    endpoint.port ||
    endpoint.username ||
    endpoint.password ||
    endpoint.search ||
    endpoint.hash
  ) {
    throw new Error('CARE_META_SEND_ENDPOINT_NOT_OFFICIAL');
  }
  const match = endpoint.pathname.match(/^\/v\d+\.\d+\/([^/]+)\/messages\/?$/);
  if (!match) throw new Error('CARE_META_SEND_ENDPOINT_PATH_INVALID');
  const pageId = decodeURIComponent(match[1]);
  if (expectedPageId && pageId !== expectedPageId) throw new Error('CARE_META_SEND_ENDPOINT_PAGE_MISMATCH');
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

export async function sendMetaText(args: {
  config: MetaSendConfig;
  recipientId: string;
  text: string;
}): Promise<{ recipientId?: string; messageId?: string }> {
  if (!args.config.sendEndpoint) throw new Error('CARE_META_SEND_ENDPOINT_REQUIRED');
  if (!args.config.accessToken) throw new Error('CARE_META_ACCESS_TOKEN_REQUIRED');
  const endpoint = assertOfficialMetaSendEndpoint(args.config.sendEndpoint, args.config.expectedPageId);
  const response = await fetch(endpoint, {
    method: 'POST',
    redirect: 'manual',
    headers: {
      Authorization: `Bearer ${args.config.accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formatMetaTextSendPayload(args.recipientId, args.text)),
  });
  if (!response.ok) throw await metaSendFailure(response);
  const payload = (await response.json()) as { recipient_id?: string; message_id?: string };
  return { recipientId: payload.recipient_id, messageId: payload.message_id };
}

function deliveryClaimKey(channel: CareChannel, externalMessageId: string): string {
  return createHash('sha256').update(`${channel}\u0000${externalMessageId}`, 'utf8').digest('hex');
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

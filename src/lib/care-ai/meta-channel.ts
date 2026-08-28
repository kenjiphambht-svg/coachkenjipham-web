import { createHmac, timingSafeEqual } from 'node:crypto';
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
  postback?: { title?: string; payload?: string };
}

interface MetaWebhookPayload {
  object?: string;
  entry?: Array<{ messaging?: MetaMessagingEvent[] }>;
}

export interface MetaSendConfig {
  sendEndpoint: string;
  accessToken: string;
}

function textFromEvent(event: MetaMessagingEvent): string | undefined {
  if (event.message?.text?.trim()) return event.message.text.trim();
  if (event.postback?.title?.trim()) return event.postback.title.trim();
  if (event.postback?.payload?.trim()) return event.postback.payload.trim();
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
    message: { text },
  };
}

export async function sendMetaText(args: {
  config: MetaSendConfig;
  recipientId: string;
  text: string;
}): Promise<{ recipientId?: string; messageId?: string }> {
  if (!args.config.sendEndpoint) throw new Error('CARE_META_SEND_ENDPOINT_REQUIRED');
  if (!args.config.accessToken) throw new Error('CARE_META_ACCESS_TOKEN_REQUIRED');
  const endpoint = new URL(args.config.sendEndpoint);
  if (endpoint.protocol !== 'https:' || endpoint.username || endpoint.password) throw new Error('CARE_META_SEND_ENDPOINT_INVALID');
  const response = await fetch(endpoint.toString(), {
    method: 'POST',
    redirect: 'error',
    headers: {
      Authorization: `Bearer ${args.config.accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formatMetaTextSendPayload(args.recipientId, args.text)),
  });
  if (!response.ok) throw new Error(`CARE_META_SEND_HTTP_${response.status}`);
  const payload = (await response.json()) as { recipient_id?: string; message_id?: string };
  return { recipientId: payload.recipient_id, messageId: payload.message_id };
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

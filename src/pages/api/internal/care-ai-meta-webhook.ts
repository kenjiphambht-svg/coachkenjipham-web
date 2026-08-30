import type { NextApiRequest, NextApiResponse } from 'next';
import type { CareChannel } from '../../../lib/care-ai/contracts';
import {
  createD1MetaIdempotencyStore,
  parseMetaWebhook,
  sendMetaText,
  type MetaD1Database,
  type MetaIdempotencyStore,
  verifyMetaPayloadSignature,
  verifyMetaWebhook,
} from '../../../lib/care-ai/meta-channel';
import { runCareModel, type CareModelProvider } from '../../../lib/care-ai/provider-neutral-model';

export const config = { api: { bodyParser: false } };

function sandboxEnabled(): boolean {
  return process.env.CARE_META_SANDBOX_ENABLED === 'true';
}

function liveTestEnabled(): boolean {
  return sandboxEnabled() && process.env.CARE_META_LIVE_TEST_ENABLED === 'true';
}

function outboundEnabled(): boolean {
  return liveTestEnabled() && process.env.CARE_META_OUTBOUND_ENABLED === 'true';
}

function allowedTestSenderIds(): Set<string> {
  return new Set(
    (process.env.CARE_META_TEST_SENDER_IDS || '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean),
  );
}

function idempotencyTtlSeconds(): number {
  const value = Number(process.env.CARE_META_IDEMPOTENCY_TTL_SECONDS || '');
  if (!Number.isInteger(value) || value < 300 || value > 604800) {
    throw new Error('CARE_META_IDEMPOTENCY_TTL_INVALID');
  }
  return value;
}

async function metaIdempotencyStore(): Promise<MetaIdempotencyStore> {
  try {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare');
    const { env } = await getCloudflareContext({ async: true });
    const db = (env as unknown as { CARE_META_IDEMPOTENCY_DB?: MetaD1Database }).CARE_META_IDEMPOTENCY_DB;
    if (!db) throw new Error('CARE_META_IDEMPOTENCY_STORE_MISSING');
    return createD1MetaIdempotencyStore(db);
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('CARE_META_IDEMPOTENCY_')) throw error;
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

function metaSendConfig(channel: CareChannel, expectedPageId?: string): { sendEndpoint: string; accessToken: string; expectedPageId?: string } {
  if (channel === 'facebook_messenger') {
    return {
      sendEndpoint: process.env.CARE_META_MESSENGER_SEND_ENDPOINT || '',
      accessToken: process.env.CARE_META_MESSENGER_ACCESS_TOKEN || '',
      expectedPageId,
    };
  }
  if (channel === 'instagram') {
    return {
      sendEndpoint: process.env.CARE_META_INSTAGRAM_SEND_ENDPOINT || '',
      accessToken: process.env.CARE_META_INSTAGRAM_ACCESS_TOKEN || '',
      expectedPageId,
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
  };
}

function safeError(error: unknown): string {
  if (!(error instanceof Error)) return 'CARE_META_UNKNOWN_ERROR';
  if (error.message.startsWith('CARE_META_') || error.message.startsWith('CARE_MODEL_')) return error.message.slice(0, 120);
  return 'CARE_META_TEST_BRIDGE_ERROR';
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
        note: 'Signed Meta receipt only. Model/outbound remain behind explicit controlled-live gates.',
      });
    }

    const allowedSenders = allowedTestSenderIds();
    if (!allowedSenders.size) {
      return res.status(503).json({ error: 'CARE_META_TEST_SENDER_ALLOWLIST_MISSING' });
    }

    const outputs: Array<{
      channel: CareChannel;
      duplicate: boolean;
      blockedByAllowlist: boolean;
      blockedByChannelGate: boolean;
      modelCalled: boolean;
      outboundSent: boolean;
      messageId?: string;
      replyPreview?: string;
    }> = [];
    let storePromise: Promise<MetaIdempotencyStore> | undefined;

    for (const message of messages) {
      if (message.channel !== 'facebook_messenger') {
        outputs.push({
          channel: message.channel,
          duplicate: false,
          blockedByAllowlist: false,
          blockedByChannelGate: true,
          modelCalled: false,
          outboundSent: false,
        });
        continue;
      }

      if (!allowedSenders.has(message.externalSenderId)) {
        outputs.push({
          channel: message.channel,
          duplicate: false,
          blockedByAllowlist: true,
          blockedByChannelGate: false,
          modelCalled: false,
          outboundSent: false,
        });
        continue;
      }

      const messageId = message.externalMessageId?.trim();
      if (!messageId) throw new Error('CARE_META_MESSAGE_ID_REQUIRED');
      storePromise ||= metaIdempotencyStore();
      const firstSeen = await (await storePromise).claim({
        channel: message.channel,
        externalMessageId: messageId,
        ttlSeconds: idempotencyTtlSeconds(),
      });
      if (!firstSeen) {
        outputs.push({
          channel: message.channel,
          duplicate: true,
          blockedByAllowlist: false,
          blockedByChannelGate: false,
          modelCalled: false,
          outboundSent: false,
        });
        continue;
      }

      const decision = await runCareModel({
        config: modelConfig(),
        channel: message.channel,
        turns: [message.text],
      });

      if (!outboundEnabled()) {
        outputs.push({
          channel: message.channel,
          duplicate: false,
          blockedByAllowlist: false,
          blockedByChannelGate: false,
          modelCalled: true,
          outboundSent: false,
          replyPreview: decision.reply,
        });
        continue;
      }

      const pageId = message.externalRecipientId?.trim();
      if (!pageId) throw new Error('CARE_META_PAGE_ID_REQUIRED');
      const sent = await sendMetaText({
        config: metaSendConfig(message.channel, pageId),
        recipientId: message.externalSenderId,
        text: decision.reply,
      });
      outputs.push({
        channel: message.channel,
        duplicate: false,
        blockedByAllowlist: false,
        blockedByChannelGate: false,
        modelCalled: true,
        outboundSent: true,
        messageId: sent.messageId,
      });
    }

    return res.status(200).json({
      accepted: true,
      liveTest: true,
      outboundGateEnabled: outboundEnabled(),
      guardMode: 'MESSENGER_PAGE_CONTROLLED_LIVE_TEXT_REPLY_ONLY',
      processed: outputs,
      note: 'Messenger/Page text-only, inbound-triggered RESPONSE replies only. Persistent idempotency is required; Instagram and proactive follow-up remain closed.',
    });
  } catch (error) {
    return res.status(502).json({ error: safeError(error) });
  }
}

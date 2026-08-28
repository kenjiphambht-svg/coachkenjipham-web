import type { NextApiRequest, NextApiResponse } from 'next';
import type { CareChannel } from '../../../lib/care-ai/contracts';
import {
  parseMetaWebhook,
  sendMetaText,
  verifyMetaPayloadSignature,
  verifyMetaWebhook,
} from '../../../lib/care-ai/meta-channel';
import { runCareModel, type CareModelProvider } from '../../../lib/care-ai/provider-neutral-model';

export const config = { api: { bodyParser: false } };

const processedMessageIds = new Set<string>();

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

function metaSendConfig(channel: CareChannel): { sendEndpoint: string; accessToken: string } {
  if (channel === 'facebook_messenger') {
    return {
      sendEndpoint: process.env.CARE_META_MESSENGER_SEND_ENDPOINT || '',
      accessToken: process.env.CARE_META_MESSENGER_ACCESS_TOKEN || '',
    };
  }
  if (channel === 'instagram') {
    return {
      sendEndpoint: process.env.CARE_META_INSTAGRAM_SEND_ENDPOINT || '',
      accessToken: process.env.CARE_META_INSTAGRAM_ACCESS_TOKEN || '',
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
        note: 'Signed Meta sandbox receipt only. Model/outbound remain behind explicit live-test gates.',
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
      modelCalled: boolean;
      outboundSent: boolean;
      messageId?: string;
      replyPreview?: string;
    }> = [];

    for (const message of messages) {
      if (!allowedSenders.has(message.externalSenderId)) {
        outputs.push({
          channel: message.channel,
          duplicate: false,
          blockedByAllowlist: true,
          modelCalled: false,
          outboundSent: false,
        });
        continue;
      }

      const messageId = message.externalMessageId;
      if (messageId && processedMessageIds.has(messageId)) {
        outputs.push({
          channel: message.channel,
          duplicate: true,
          blockedByAllowlist: false,
          modelCalled: false,
          outboundSent: false,
        });
        continue;
      }
      if (messageId) processedMessageIds.add(messageId);

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
          modelCalled: true,
          outboundSent: false,
          replyPreview: decision.reply,
        });
        continue;
      }

      const sent = await sendMetaText({
        config: metaSendConfig(message.channel),
        recipientId: message.externalSenderId,
        text: decision.reply,
      });
      outputs.push({
        channel: message.channel,
        duplicate: false,
        blockedByAllowlist: false,
        modelCalled: true,
        outboundSent: true,
        messageId: sent.messageId,
      });
    }

    return res.status(200).json({
      accepted: true,
      liveTest: true,
      outboundGateEnabled: outboundEnabled(),
      guardMode: 'MODEL_ONLY_FREEFORM_TEST',
      processed: outputs,
      note: 'TEST SENDER ALLOWLIST ONLY. Process-local dedupe is not Production reliability evidence.',
    });
  } catch (error) {
    return res.status(502).json({ error: safeError(error) });
  }
}

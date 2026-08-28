import { createHmac } from 'node:crypto';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  formatMetaTextSendPayload,
  parseMetaWebhook,
  sendMetaText,
  syntheticChannelInbound,
  verifyMetaPayloadSignature,
  verifyMetaWebhook,
} from '../src/lib/care-ai/meta-channel';

afterEach(() => vi.restoreAllMocks());

describe('Care AI Meta sandbox adapters', () => {
  it('parses Messenger webhook messages into the common Care envelope', () => {
    const parsed = parseMetaWebhook({
      object: 'page',
      entry: [{ messaging: [{ sender: { id: 'PSID-1' }, recipient: { id: 'PAGE-1' }, timestamp: 123, message: { mid: 'm-1', text: 'Xin chào' } }] }],
    });
    expect(parsed).toEqual([{ channel: 'facebook_messenger', externalSenderId: 'PSID-1', externalRecipientId: 'PAGE-1', externalMessageId: 'm-1', text: 'Xin chào', timestamp: 123, rawKind: 'meta_messaging' }]);
  });

  it('parses Instagram messaging webhook messages into the same Care envelope', () => {
    const parsed = parseMetaWebhook({
      object: 'instagram',
      entry: [{ messaging: [{ sender: { id: 'IGSID-1' }, recipient: { id: 'IG-1' }, timestamp: 456, message: { mid: 'ig-m-1', text: 'Cho mình hỏi thêm' } }] }],
    });
    expect(parsed[0]).toMatchObject({ channel: 'instagram', externalSenderId: 'IGSID-1', externalMessageId: 'ig-m-1', text: 'Cho mình hỏi thêm' });
  });

  it('supports Website, Messenger and Instagram simulators without real provider traffic', () => {
    expect(syntheticChannelInbound('website', 'A').rawKind).toBe('website');
    expect(syntheticChannelInbound('facebook_messenger', 'B').externalSenderId).toBe('synthetic-psid');
    expect(syntheticChannelInbound('instagram', 'C').externalSenderId).toBe('synthetic-igsid');
  });

  it('formats Meta Send API text payload without sending it', () => {
    expect(formatMetaTextSendPayload('RECIPIENT', 'Hello')).toEqual({ recipient: { id: 'RECIPIENT' }, message: { text: 'Hello' } });
  });

  it('can exercise the outbound adapter with a mocked endpoint and bearer token only', async () => {
    const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ recipient_id: 'R', message_id: 'M' }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
    const result = await sendMetaText({
      config: { sendEndpoint: 'https://meta.example/messages', accessToken: 'meta-secret' },
      recipientId: 'RECIPIENT',
      text: 'Hello',
    });
    expect(result).toEqual({ recipientId: 'R', messageId: 'M' });
    const [url, init] = spy.mock.calls[0];
    expect(url).toBe('https://meta.example/messages');
    expect((init?.headers as Record<string, string>).Authorization).toBe('Bearer meta-secret');
    expect(String(init?.body)).not.toContain('meta-secret');
  });

  it('verifies webhook challenge only with the expected sandbox token', () => {
    expect(verifyMetaWebhook({ mode: 'subscribe', verifyToken: 'ok', challenge: '123', expectedToken: 'ok' })).toBe('123');
    expect(verifyMetaWebhook({ mode: 'subscribe', verifyToken: 'bad', challenge: '123', expectedToken: 'ok' })).toBeNull();
  });

  it('validates X-Hub-Signature-256 against the exact raw payload', () => {
    const rawBody = Buffer.from('{"object":"page","entry":[]}');
    const appSecret = 'test-app-secret';
    const signature = createHmac('sha256', appSecret).update(rawBody).digest('hex');
    expect(verifyMetaPayloadSignature({ rawBody, signatureHeader: `sha256=${signature}`, appSecret })).toBe(true);
    expect(verifyMetaPayloadSignature({ rawBody: Buffer.from('{"changed":true}'), signatureHeader: `sha256=${signature}`, appSecret })).toBe(false);
    expect(verifyMetaPayloadSignature({ rawBody, signatureHeader: undefined, appSecret })).toBe(false);
  });
});

import { createHmac } from 'node:crypto';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  assertOfficialMetaSendEndpoint,
  createD1MetaIdempotencyStore,
  formatMetaTextSendPayload,
  parseMetaWebhook,
  sendMetaText,
  syntheticChannelInbound,
  type MetaD1Database,
  verifyMetaPayloadSignature,
  verifyMetaWebhook,
} from '../src/lib/care-ai/meta-channel';

afterEach(() => vi.restoreAllMocks());

describe('Care AI Meta sandbox adapters', () => {
  it('parses Messenger webhook text messages into the common Care envelope', () => {
    const parsed = parseMetaWebhook({
      object: 'page',
      entry: [{ messaging: [{ sender: { id: 'PSID-1' }, recipient: { id: 'PAGE-1' }, timestamp: 123, message: { mid: 'm-1', text: 'Xin chào' } }] }],
    });
    expect(parsed).toEqual([{ channel: 'facebook_messenger', externalSenderId: 'PSID-1', externalRecipientId: 'PAGE-1', externalMessageId: 'm-1', text: 'Xin chào', timestamp: 123, rawKind: 'meta_messaging' }]);
  });

  it('parses Instagram messaging webhook text into the same Care envelope', () => {
    const parsed = parseMetaWebhook({
      object: 'instagram',
      entry: [{ messaging: [{ sender: { id: 'IGSID-1' }, recipient: { id: 'IG-1' }, timestamp: 456, message: { mid: 'ig-m-1', text: 'Cho mình hỏi thêm' } }] }],
    });
    expect(parsed[0]).toMatchObject({ channel: 'instagram', externalSenderId: 'IGSID-1', externalMessageId: 'ig-m-1', text: 'Cho mình hỏi thêm' });
  });

  it('keeps the controlled-live inbound parser text-only', () => {
    const parsed = parseMetaWebhook({
      object: 'page',
      entry: [{ messaging: [{ sender: { id: 'PSID-1' }, recipient: { id: 'PAGE-1' }, postback: { title: 'Button', payload: 'PAYLOAD' } }] }],
    });
    expect(parsed).toEqual([]);
  });

  it('supports Website, Messenger and Instagram simulators without real provider traffic', () => {
    expect(syntheticChannelInbound('website', 'A').rawKind).toBe('website');
    expect(syntheticChannelInbound('facebook_messenger', 'B').externalSenderId).toBe('synthetic-psid');
    expect(syntheticChannelInbound('instagram', 'C').externalSenderId).toBe('synthetic-igsid');
  });

  it('formats Meta Send API text payload as an inbound RESPONSE reply', () => {
    expect(formatMetaTextSendPayload('RECIPIENT', 'Hello')).toEqual({
      recipient: { id: 'RECIPIENT' },
      messaging_type: 'RESPONSE',
      message: { text: 'Hello' },
    });
  });

  it('pins outbound to the official Meta Graph send endpoint and the inbound Page', async () => {
    const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ recipient_id: 'R', message_id: 'M' }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
    const endpoint = 'https://graph.facebook.com/v22.0/PAGE-1/messages';
    const result = await sendMetaText({
      config: { sendEndpoint: endpoint, accessToken: 'meta-secret', expectedPageId: 'PAGE-1' },
      recipientId: 'RECIPIENT',
      text: 'Hello',
    });
    expect(result).toEqual({ recipientId: 'R', messageId: 'M' });
    const [url, init] = spy.mock.calls[0];
    expect(url).toBe(endpoint);
    expect(init?.redirect).toBe('manual');
    expect((init?.headers as Record<string, string>).Authorization).toBe('Bearer meta-secret');
    expect(String(init?.body)).not.toContain('meta-secret');
    expect(JSON.parse(String(init?.body))).toMatchObject({ messaging_type: 'RESPONSE' });
  });

  it('rejects arbitrary HTTPS hosts, non-send paths and Page mismatches before any outbound fetch', async () => {
    const spy = vi.spyOn(globalThis, 'fetch');
    expect(() => assertOfficialMetaSendEndpoint('https://meta.example/v22.0/PAGE-1/messages', 'PAGE-1')).toThrow('CARE_META_SEND_ENDPOINT_NOT_OFFICIAL');
    expect(() => assertOfficialMetaSendEndpoint('https://graph.facebook.com/v22.0/PAGE-1/feed', 'PAGE-1')).toThrow('CARE_META_SEND_ENDPOINT_PATH_INVALID');
    expect(() => assertOfficialMetaSendEndpoint('https://graph.facebook.com/v22.0/PAGE-2/messages', 'PAGE-1')).toThrow('CARE_META_SEND_ENDPOINT_PAGE_MISMATCH');
    expect(() => assertOfficialMetaSendEndpoint('https://graph.facebook.com/v22.0/PAGE-1/messages?access_token=x', 'PAGE-1')).toThrow('CARE_META_SEND_ENDPOINT_NOT_OFFICIAL');
    expect(spy).not.toHaveBeenCalled();
  });

  it('uses one atomic persistent D1 claim and stores only a hashed delivery key', async () => {
    let sql = '';
    let bindings: unknown[] = [];
    let shouldClaim = true;
    const db: MetaD1Database = {
      prepare(query) {
        sql = query;
        const statement = {
          bind(...values: unknown[]) {
            bindings = values;
            return statement;
          },
          async first<T>() {
            return (shouldClaim ? { claim_key: bindings[0] } : null) as T | null;
          },
        };
        return statement;
      },
    };
    const store = createD1MetaIdempotencyStore(db);
    const first = await store.claim({ channel: 'facebook_messenger', externalMessageId: 'raw-meta-mid-123', ttlSeconds: 3600, nowMs: 1000 });
    expect(first).toBe(true);
    expect(sql).toContain('ON CONFLICT(claim_key)');
    expect(sql).toContain('RETURNING claim_key');
    expect(bindings[0]).not.toBe('raw-meta-mid-123');
    expect(String(bindings[0])).toMatch(/^[a-f0-9]{64}$/);
    expect(bindings.slice(1)).toEqual([3601000, 1000]);

    shouldClaim = false;
    const duplicate = await store.claim({ channel: 'facebook_messenger', externalMessageId: 'raw-meta-mid-123', ttlSeconds: 3600, nowMs: 2000 });
    expect(duplicate).toBe(false);
    await expect(store.claim({ channel: 'facebook_messenger', externalMessageId: 'x', ttlSeconds: 60 })).rejects.toThrow('CARE_META_IDEMPOTENCY_TTL_INVALID');
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

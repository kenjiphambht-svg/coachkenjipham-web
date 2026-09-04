import { createHmac } from 'node:crypto';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  assertOfficialMetaSendEndpoint,
  createD1MetaIdempotencyStore,
  formatMetaMessengerSenderActionPayload,
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
    expect(parsed[0]).toMatchObject({ channel: 'instagram', externalSenderId: 'IGSID-1', externalRecipientId: 'IG-1', externalMessageId: 'ig-m-1', text: 'Cho mình hỏi thêm' });
  });

  it('filters Meta echo/self messages so outbound replies cannot recurse back into Care', () => {
    expect(
      parseMetaWebhook({
        object: 'page',
        entry: [{ messaging: [{ sender: { id: 'PAGE-1' }, recipient: { id: 'PSID-1' }, message: { mid: 'echo-1', text: 'Bot reply', is_echo: true } }] }],
      }),
    ).toEqual([]);
    expect(
      parseMetaWebhook({
        object: 'instagram',
        entry: [{ messaging: [{ sender: { id: 'IG-1' }, recipient: { id: 'IGSID-1' }, message: { mid: 'self-1', text: 'Bot reply', is_self: true } }] }],
      }),
    ).toEqual([]);
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

  it('formats Messenger response, sender actions and Instagram native text payloads', () => {
    expect(formatMetaTextSendPayload('facebook_messenger', 'RECIPIENT', 'Hello')).toEqual({
      recipient: { id: 'RECIPIENT' },
      messaging_type: 'RESPONSE',
      message: { text: 'Hello' },
    });
    expect(formatMetaMessengerSenderActionPayload('RECIPIENT', 'typing_on')).toEqual({
      recipient: { id: 'RECIPIENT' },
      sender_action: 'typing_on',
    });
    expect(formatMetaMessengerSenderActionPayload('RECIPIENT', 'typing_off')).toEqual({
      recipient: { id: 'RECIPIENT' },
      sender_action: 'typing_off',
    });
    expect(formatMetaTextSendPayload('instagram', 'IGSID', 'Hello IG')).toEqual({
      recipient: { id: 'IGSID' },
      message: { text: 'Hello IG' },
    });
  });

  it('shows Messenger typing around the reply while preserving the pinned official endpoint', async () => {
    const spy = vi.spyOn(globalThis, 'fetch').mockImplementation(async () =>
      new Response(JSON.stringify({ recipient_id: 'R', message_id: 'M' }), { status: 200, headers: { 'Content-Type': 'application/json' } }),
    );
    const endpoint = 'https://graph.facebook.com/v26.0/PAGE-1/messages';
    const result = await sendMetaText({
      config: { channel: 'facebook_messenger', sendEndpoint: endpoint, accessToken: 'meta-secret', expectedAccountId: 'PAGE-1' },
      recipientId: 'RECIPIENT',
      text: 'Hello',
    });
    expect(result).toEqual({ recipientId: 'R', messageId: 'M' });
    expect(spy).toHaveBeenCalledTimes(3);
    for (const [url, init] of spy.mock.calls) {
      expect(url).toBe(endpoint);
      expect(init?.redirect).toBe('manual');
      expect((init?.headers as Record<string, string>).Authorization).toBe('Bearer meta-secret');
      expect(String(init?.body)).not.toContain('meta-secret');
    }
    expect(JSON.parse(String(spy.mock.calls[0][1]?.body))).toEqual({ recipient: { id: 'RECIPIENT' }, sender_action: 'typing_on' });
    expect(JSON.parse(String(spy.mock.calls[1][1]?.body))).toMatchObject({ messaging_type: 'RESPONSE', message: { text: 'Hello' } });
    expect(JSON.parse(String(spy.mock.calls[2][1]?.body))).toEqual({ recipient: { id: 'RECIPIENT' }, sender_action: 'typing_off' });
  });

  it('keeps Messenger reply fail-open when typing_on is rejected', async () => {
    let call = 0;
    vi.spyOn(globalThis, 'fetch').mockImplementation(async () => {
      call += 1;
      if (call === 1) return new Response('{}', { status: 500, headers: { 'Content-Type': 'application/json' } });
      return new Response(JSON.stringify({ recipient_id: 'R', message_id: 'M' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    });
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const result = await sendMetaText({
      config: {
        channel: 'facebook_messenger',
        sendEndpoint: 'https://graph.facebook.com/v26.0/PAGE-1/messages',
        accessToken: 'meta-secret',
        expectedAccountId: 'PAGE-1',
      },
      recipientId: 'RECIPIENT',
      text: 'Hello',
    });
    expect(result).toEqual({ recipientId: 'R', messageId: 'M' });
    expect(call).toBe(2);
    expect(warnSpy).toHaveBeenCalledWith('CARE_META_TYPING_DEGRADED', { status: 500, senderAction: 'typing_on' });
  });

  it('pins Instagram outbound to graph.instagram.com and the inbound Instagram professional account', async () => {
    const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ recipient_id: 'IGSID-1', message_id: 'IG-M-2' }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
    const endpoint = 'https://graph.instagram.com/v26.0/IG-1/messages';
    const result = await sendMetaText({
      config: { channel: 'instagram', sendEndpoint: endpoint, accessToken: 'ig-secret', expectedAccountId: 'IG-1' },
      recipientId: 'IGSID-1',
      text: 'Hello IG',
    });
    expect(result).toEqual({ recipientId: 'IGSID-1', messageId: 'IG-M-2' });
    expect(spy).toHaveBeenCalledTimes(1);
    const [url, init] = spy.mock.calls[0];
    expect(url).toBe(endpoint);
    expect(init?.redirect).toBe('manual');
    expect((init?.headers as Record<string, string>).Authorization).toBe('Bearer ig-secret');
    expect(String(init?.body)).not.toContain('ig-secret');
    expect(JSON.parse(String(init?.body))).toEqual({ recipient: { id: 'IGSID-1' }, message: { text: 'Hello IG' } });
  });

  it('emits only safe numeric diagnostics when Meta Send API rejects outbound', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (_url, init) => {
      const body = JSON.parse(String(init?.body));
      if (body.sender_action) {
        return new Response('{}', { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      return new Response(
        JSON.stringify({
          error: {
            message: 'Sensitive upstream message mentioning PSID-SECRET and TOKEN-SECRET',
            type: 'OAuthException',
            code: 190,
            error_subcode: 463,
            fbtrace_id: 'TRACE-SECRET',
          },
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    });
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    await expect(
      sendMetaText({
        config: {
          channel: 'facebook_messenger',
          sendEndpoint: 'https://graph.facebook.com/v26.0/PAGE-1/messages',
          accessToken: 'TOKEN-SECRET',
          expectedAccountId: 'PAGE-1',
        },
        recipientId: 'PSID-SECRET',
        text: 'PRIVATE-MESSAGE',
      }),
    ).rejects.toThrow('CARE_META_SEND_HTTP_400_CODE_190_SUBCODE_463');

    expect(errorSpy).toHaveBeenCalledWith('CARE_META_SEND_FAILURE', { status: 400, code: '190', subcode: '463' });
    const serializedLogs = JSON.stringify(errorSpy.mock.calls);
    expect(serializedLogs).not.toContain('PSID-SECRET');
    expect(serializedLogs).not.toContain('TOKEN-SECRET');
    expect(serializedLogs).not.toContain('PRIVATE-MESSAGE');
    expect(serializedLogs).not.toContain('TRACE-SECRET');
  });

  it('rejects arbitrary hosts, cross-channel Graph hosts, non-send paths and account mismatches before fetch', async () => {
    const spy = vi.spyOn(globalThis, 'fetch');
    expect(() => assertOfficialMetaSendEndpoint('https://meta.example/v26.0/PAGE-1/messages', 'facebook_messenger', 'PAGE-1')).toThrow('CARE_META_SEND_ENDPOINT_NOT_OFFICIAL');
    expect(() => assertOfficialMetaSendEndpoint('https://graph.facebook.com/v26.0/PAGE-1/feed', 'facebook_messenger', 'PAGE-1')).toThrow('CARE_META_SEND_ENDPOINT_PATH_INVALID');
    expect(() => assertOfficialMetaSendEndpoint('https://graph.facebook.com/v26.0/PAGE-2/messages', 'facebook_messenger', 'PAGE-1')).toThrow('CARE_META_SEND_ENDPOINT_PAGE_MISMATCH');
    expect(() => assertOfficialMetaSendEndpoint('https://graph.facebook.com/v26.0/PAGE-1/messages?access_token=x', 'facebook_messenger', 'PAGE-1')).toThrow('CARE_META_SEND_ENDPOINT_NOT_OFFICIAL');
    expect(() => assertOfficialMetaSendEndpoint('https://graph.facebook.com/v26.0/IG-1/messages', 'instagram', 'IG-1')).toThrow('CARE_META_SEND_ENDPOINT_NOT_OFFICIAL');
    expect(() => assertOfficialMetaSendEndpoint('https://graph.instagram.com/v26.0/IG-2/messages', 'instagram', 'IG-1')).toThrow('CARE_META_SEND_ENDPOINT_INSTAGRAM_ACCOUNT_MISMATCH');
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

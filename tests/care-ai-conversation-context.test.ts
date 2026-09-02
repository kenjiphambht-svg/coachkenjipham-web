import { describe, expect, it } from 'vitest';
import {
  buildBoundedConversation,
  careConversationCharCount,
  careConversationToModelTurns,
  deriveCareChannelIdentity,
  hashCareExternalMessageId,
} from '../src/lib/care-ai/conversation-context';

describe('P07 Care conversation context', () => {
  const secret = 'synthetic-only-context-hmac-secret-000000000000';

  it('derives stable pseudonymous channel identity hashes without persisting raw IDs', () => {
    const first = deriveCareChannelIdentity({
      secret,
      channel: 'facebook_messenger',
      accountId: 'page-102524972270814',
      externalSubjectId: 'psid-123456',
    });
    const second = deriveCareChannelIdentity({
      secret,
      channel: 'facebook_messenger',
      accountId: 'page-102524972270814',
      externalSubjectId: 'psid-123456',
    });

    expect(first).toEqual(second);
    expect(first.accountScopeHash).toMatch(/^[a-f0-9]{64}$/);
    expect(first.externalSubjectHash).toMatch(/^[a-f0-9]{64}$/);
    expect(JSON.stringify(first)).not.toContain('102524972270814');
    expect(JSON.stringify(first)).not.toContain('123456');
  });

  it('keeps channel/account scopes isolated', () => {
    const messenger = deriveCareChannelIdentity({
      secret,
      channel: 'facebook_messenger',
      accountId: 'account-a',
      externalSubjectId: 'same-user',
    });
    const instagram = deriveCareChannelIdentity({
      secret,
      channel: 'instagram',
      accountId: 'account-a',
      externalSubjectId: 'same-user',
    });
    const otherPage = deriveCareChannelIdentity({
      secret,
      channel: 'facebook_messenger',
      accountId: 'account-b',
      externalSubjectId: 'same-user',
    });

    expect(messenger.externalSubjectHash).not.toBe(instagram.externalSubjectHash);
    expect(messenger.accountScopeHash).not.toBe(otherPage.accountScopeHash);
  });

  it('hashes external message IDs before persistence', () => {
    const hashed = hashCareExternalMessageId('m_mid_raw_123');
    expect(hashed).toMatch(/^[a-f0-9]{64}$/);
    expect(hashed).not.toContain('m_mid_raw_123');
  });

  it('builds chronological multi-turn context and preserves assistant turns', () => {
    const bounded = buildBoundedConversation(
      [
        { direction: 'INBOUND', text: 'Essence là gì?' },
        { direction: 'OUTBOUND', text: 'Essence giúp bạn nhìn rõ hơn điều đang diễn ra.' },
      ],
      'Vậy nó giúp gì cho anh?',
      { maxMessages: 8, maxChars: 6000 },
    );

    expect(careConversationToModelTurns(bounded)).toEqual([
      'Customer: Essence là gì?',
      'Care: Essence giúp bạn nhìn rõ hơn điều đang diễn ra.',
      'Customer: Vậy nó giúp gì cho anh?',
    ]);
  });

  it('trims oldest turns first while always retaining the current inbound', () => {
    const bounded = buildBoundedConversation(
      [
        { direction: 'INBOUND', text: '1111111111' },
        { direction: 'OUTBOUND', text: '2222222222' },
        { direction: 'INBOUND', text: '3333333333' },
        { direction: 'OUTBOUND', text: '4444444444' },
      ],
      'current',
      { maxMessages: 3, maxChars: 256 },
    );

    expect(bounded.map((turn) => turn.text)).toEqual(['3333333333', '4444444444', 'current']);
    expect(careConversationCharCount(bounded)).toBeLessThanOrEqual(256);
  });

  it('rejects weak identity HMAC secrets and invalid budgets', () => {
    expect(() => deriveCareChannelIdentity({
      secret: 'too-short',
      channel: 'facebook_messenger',
      accountId: 'page',
      externalSubjectId: 'sender',
    })).toThrow('CARE_CONTEXT_IDENTITY_HMAC_SECRET_TOO_SHORT');

    expect(() => buildBoundedConversation([], 'hello', { maxMessages: 0, maxChars: 6000 }))
      .toThrow('CARE_CONTEXT_MAX_MESSAGES_INVALID');
  });
});

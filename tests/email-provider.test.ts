import { describe, expect, it } from 'vitest';
import { EMAIL_DEFAULTS, MockEmailProvider } from '@/lib/email/provider';

describe('B6 mock email provider', () => {
  it('deduplicates idempotency keys without retaining sensitive payload', async () => {
    const provider = new MockEmailProvider();
    const message = { idempotencyKey: 'evt-1', templateVersion: 'payment-confirmed-v1', to: 'parent@example.test', subject: 'Đã xác nhận', text: 'Kenji đã xác nhận.' };
    await provider.send(message); await provider.send(message);
    expect(provider.sent).toHaveLength(1);
    expect(JSON.stringify(provider.sent[0])).not.toContain('child_name');
  });
});

it('uses the corrected internal operational mailbox without changing the public reply-to mailbox', () => {
  expect(EMAIL_DEFAULTS.internalAlert).toBe('kenjipham.bht@gmail.com');
  expect(EMAIL_DEFAULTS.replyTo).toBe('contact@coachkenjipham.com');
});

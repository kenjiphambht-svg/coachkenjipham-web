export interface OutboundEmail {
  idempotencyKey: string;
  templateVersion: string;
  to: string;
  subject: string;
  text: string;
}

export interface EmailProvider {
  send(message: OutboundEmail): Promise<{ providerMessageId: string }>;
}

/** Safe default until Resend credentials are connected. Never includes intake answers. */
export class MockEmailProvider implements EmailProvider {
  readonly sent: OutboundEmail[] = [];
  async send(message: OutboundEmail) {
    if (this.sent.some((item) => item.idempotencyKey === message.idempotencyKey)) {
      return { providerMessageId: `mock-dedup-${message.idempotencyKey}` };
    }
    this.sent.push(message);
    return { providerMessageId: `mock-${this.sent.length}` };
  }
}

export const EMAIL_DEFAULTS = {
  fromName: 'Kenji Phạm',
  replyTo: 'contact@coachkenjipham.com',
  proposedSender: 'hello@mail.coachkenjipham.com',
  internalAlert: 'kenjipham.bht@gmail.com',
  readiness: 'waiting_for_kenji' as const,
};

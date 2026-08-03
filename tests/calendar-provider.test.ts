import { describe, expect, it } from 'vitest';
import { MockCalendarProvider } from '@/lib/calendar/provider';

describe('B7 private calendar mock', () => {
  it('is idempotent and never returns a provider URL', async () => {
    const provider = new MockCalendarProvider();
    const input = { tokenHash: 'a'.repeat(64), mode: 'online' as const, idempotencyKey: 'booking-1' };
    const first = await provider.createInlineBooking(input);
    const second = await provider.createInlineBooking(input);
    expect(first.bookingId).toBe(second.bookingId);
    expect(JSON.stringify(first)).not.toContain('http');
  });
});

export type BookingMode = 'online' | 'in_person';

export interface CalendarBookingRequest {
  tokenHash: string;
  mode: BookingMode;
  idempotencyKey: string;
}

export interface CalendarProvider {
  createInlineBooking(request: CalendarBookingRequest): Promise<{ bookingId: string }>;
}

/** B7 default: a deterministic mock. It never exposes a Cal.com URL. */
export class MockCalendarProvider implements CalendarProvider {
  private readonly keys = new Map<string, string>();
  async createInlineBooking(request: CalendarBookingRequest) {
    const existing = this.keys.get(request.idempotencyKey);
    if (existing) return { bookingId: existing };
    const id = `mock-cal-${this.keys.size + 1}`;
    this.keys.set(request.idempotencyKey, id);
    return { bookingId: id };
  }
}

export const CALENDAR_READINESS = 'waiting_for_kenji' as const;

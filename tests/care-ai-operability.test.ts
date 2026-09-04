import { describe, expect, it, vi } from 'vitest';
import type { MetaD1Database, MetaD1PreparedStatement } from '../src/lib/care-ai/meta-channel';
import {
  careOperabilityEventKey,
  careOperabilityHealthDegraded,
  D1CareOperabilityStore,
  markCareOperabilitySafely,
  safeCareOperabilityErrorCode,
} from '../src/lib/care-ai/operability';

function fakeDb(firstResult: unknown) {
  const first = vi.fn(async () => firstResult);
  let statement: MetaD1PreparedStatement;
  const bind = vi.fn(() => statement);
  statement = { bind, first } as unknown as MetaD1PreparedStatement;
  const prepare = vi.fn(() => statement);
  return {
    db: { prepare } as MetaD1Database,
    prepare,
    bind,
    first,
  };
}

describe('Care operability', () => {
  it('hashes external message ids into stable channel-scoped opaque event keys', () => {
    const messenger = careOperabilityEventKey('facebook_messenger', 'mid.123-secret');
    const comment = careOperabilityEventKey('facebook_comment', 'mid.123-secret');

    expect(messenger).toMatch(/^[0-9a-f]{64}$/);
    expect(messenger).not.toContain('mid.123-secret');
    expect(comment).not.toBe(messenger);
    expect(careOperabilityEventKey('facebook_messenger', 'mid.123-secret')).toBe(messenger);
  });

  it('allows only bounded CARE_* diagnostics', () => {
    expect(safeCareOperabilityErrorCode(new Error('CARE_META_SEND_HTTP_500'))).toBe('CARE_META_SEND_HTTP_500');
    expect(safeCareOperabilityErrorCode(new Error('upstream leaked body'))).toBe('CARE_OPERABILITY_UNKNOWN_ERROR');
  });

  it('treats recent model/send failures or pending replies as degraded', () => {
    expect(careOperabilityHealthDegraded({ modelFailures: 0, outboundFailures: 0, pendingReplies: 0 })).toBe(false);
    expect(careOperabilityHealthDegraded({ modelFailures: 1, outboundFailures: 0, pendingReplies: 0 })).toBe(true);
    expect(careOperabilityHealthDegraded({ modelFailures: 0, outboundFailures: 1, pendingReplies: 0 })).toBe(true);
    expect(careOperabilityHealthDegraded({ modelFailures: 0, outboundFailures: 0, pendingReplies: 1 })).toBe(true);
  });

  it('writes only opaque event state through D1', async () => {
    const fake = fakeDb({ event_key: 'a'.repeat(64) });
    const store = new D1CareOperabilityStore(fake.db);

    await store.mark({
      eventKey: 'a'.repeat(64),
      channel: 'facebook_messenger',
      stage: 'RECEIVED',
      customerMode: true,
      nowMs: 1_800_000_000_000,
    });

    expect(fake.prepare).toHaveBeenCalledTimes(1);
    expect(fake.bind.mock.calls[0]).toEqual([
      'a'.repeat(64),
      'facebook_messenger',
      1,
      'RECEIVED',
      0,
      0,
      null,
      1_800_000_000_000,
      1_800_000_000_000,
    ]);
  });

  it('parses aggregate D1 health counts safely', async () => {
    const fake = fakeDb({ model_failures: '2', outbound_failures: 1, pending_replies: null });
    const store = new D1CareOperabilityStore(fake.db);

    await expect(store.health({
      nowMs: 1_800_000_000_000,
      lookbackMs: 900_000,
      pendingAgeMs: 90_000,
    })).resolves.toEqual({ modelFailures: 2, outboundFailures: 1, pendingReplies: 0 });
  });

  it('never lets telemetry-store failure break the Care reply path', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const store = {
      mark: vi.fn(async () => { throw new Error('CARE_OPERABILITY_WRITE_FAILED'); }),
      health: vi.fn(),
    };

    await expect(markCareOperabilitySafely({
      store,
      channel: 'facebook_messenger',
      externalMessageId: 'mid.customer-event',
      stage: 'RECEIVED',
      customerMode: true,
    })).resolves.toBeUndefined();

    expect(errorSpy).toHaveBeenCalledWith('CARE_OPERABILITY_WRITE_DEGRADED', expect.objectContaining({
      channel: 'facebook_messenger',
      stage: 'RECEIVED',
      safeErrorCode: 'CARE_OPERABILITY_WRITE_FAILED',
    }));
    errorSpy.mockRestore();
  });
});

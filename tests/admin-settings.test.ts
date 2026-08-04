import { describe, expect, it } from 'vitest';

import { DEFAULT_ADMIN_SETTINGS, getActiveSettings, hydrateOperationalSettings, validateSettingsPayload } from '@/lib/admin/settings';

describe('Admin versioned settings', () => {
  it('keeps release and provider readiness off by default', () => {
    expect(DEFAULT_ADMIN_SETTINGS.hatmam.publicActivationEnabled).toBe(false);
    expect(DEFAULT_ADMIN_SETTINGS.integrations.privateStorageReady).toBe(false);
    expect(DEFAULT_ADMIN_SETTINGS.integrations.deletionWorkflowReady).toBe(false);
    expect(DEFAULT_ADMIN_SETTINGS.integrations.resendReadiness).toBe('off');
    expect(DEFAULT_ADMIN_SETTINGS.integrations.calcomReadiness).toBe('off');
  });

  it('hydrates the earlier staging JSON shape without losing the locked defaults', () => {
    const settings = hydrateOperationalSettings({
      hatmam: { hm01_price_vnd: 2_000_000, hm02_price_vnd: 3_500_000, capacity_month: 10 },
      integrations: { resend: 'waiting_for_kenji', calcom: 'waiting_for_kenji' },
    });
    expect(settings.hatmam.hm01LaunchPriceVnd).toBe(2_000_000);
    expect(settings.hatmam.hm02LaunchPriceVnd).toBe(3_500_000);
    expect(settings.lang.responseSlaMinutes).toBe(60);
    expect(settings.integrations.resendReadiness).toBe('off');
  });

  it('selects the active version and preserves its effective values', () => {
    const { row, values } = getActiveSettings([
      { id: 'old', version: 1, values: {}, active: false, created_by: 'system', created_at: '2026-08-01T00:00:00Z', activated_at: null },
      { id: 'current', version: 2, values: { lang: { price_vnd: 11_000_000 } }, active: true, created_by: 'admin', created_at: '2026-08-03T00:00:00Z', activated_at: '2026-08-03T00:00:00Z' },
    ]);
    expect(row?.id).toBe('current');
    expect(values.lang.priceVnd).toBe(11_000_000);
  });

  it('rejects invalid deadlines, negative values, mismatched capacity and unlocked release flags server-side', () => {
    const valid = structuredClone(DEFAULT_ADMIN_SETTINGS);
    expect(validateSettingsPayload(valid)).toEqual(valid);
    expect(() => validateSettingsPayload({ ...valid, hatmam: { ...valid.hatmam, hm01ReferencePriceVnd: 1 } })).toThrow(/tham chiếu/i);
    expect(() => validateSettingsPayload({ ...valid, lang: { ...valid.lang, capacityMonth: -1 } })).toThrow(/Capacity Lặng/i);
    expect(() => validateSettingsPayload({ ...valid, lang: { ...valid.lang, bookingDefaults: { ...valid.lang.bookingDefaults, hardMonthlyCapacity: 4 } } })).toThrow(/Hard capacity/i);
    expect(() => validateSettingsPayload({ ...valid, integrations: { ...valid.integrations, privateStorageReady: true } })).toThrow(/khóa OFF/i);
  });
});

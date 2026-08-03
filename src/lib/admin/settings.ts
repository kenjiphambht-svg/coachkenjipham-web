import {
  ADMIN_EMAIL,
  BOOKING_DEFAULTS,
  HATMAM_HM01_PRICE_VND,
  HATMAM_HM01_REFERENCE_VND,
  HATMAM_HM02_PRICE_VND,
  HATMAM_HM02_REFERENCE_VND,
  LANG_PRICE_VND,
} from './operational';

export interface AdminOperationalSettings {
  lang: {
    priceVnd: number;
    capacityMonth: number;
    responseSlaMinutes: number;
    paymentConfirmationSlaMinutes: number;
    sessionDurationMinutes: number;
    publicLocationLabel: string;
    bookingDefaults: {
      tuesday0930: boolean;
      thursday1430: boolean;
      postSessionBufferMinutes: number;
      minNoticeHours: number;
      bookingHorizonDays: number;
      rescheduleDeadlineHours: number;
      maxBookingsPerWeek: number;
      hardMonthlyCapacity: number;
    };
  };
  hatmam: {
    hm01Name: string;
    hm01LaunchPriceVnd: number;
    hm01ReferencePriceVnd: number;
    hm02Name: string;
    hm02LaunchPriceVnd: number;
    hm02ReferencePriceVnd: number;
    capacityMonth: number;
    deliveryBusinessDays: number;
    revisionWindowDays: number;
    rawIntakeRetentionMonths: number;
    publicationRetentionMonths: number;
    publicActivationEnabled: boolean;
  };
  integrations: {
    privateStorageReady: boolean;
    deletionWorkflowReady: boolean;
    resendReadiness: 'off' | 'waiting_for_secure_session' | 'verified';
    calcomReadiness: 'off' | 'waiting_for_secure_session' | 'verified';
  };
}

export interface OperationalSettingsVersionRow {
  id: string;
  version: number;
  values: unknown;
  active: boolean;
  created_by: string;
  created_at: string;
  activated_at: string | null;
}

export const DEFAULT_ADMIN_SETTINGS: AdminOperationalSettings = {
  lang: {
    priceVnd: LANG_PRICE_VND,
    capacityMonth: 5,
    responseSlaMinutes: 60,
    paymentConfirmationSlaMinutes: 60,
    sessionDurationMinutes: 90,
    publicLocationLabel: 'Lê Hồng Phong, Sài Gòn',
    bookingDefaults: {
      tuesday0930: true,
      thursday1430: true,
      postSessionBufferMinutes: BOOKING_DEFAULTS.postSessionBufferMinutes,
      minNoticeHours: BOOKING_DEFAULTS.minNoticeHours,
      bookingHorizonDays: BOOKING_DEFAULTS.bookingHorizonDays,
      rescheduleDeadlineHours: BOOKING_DEFAULTS.rescheduleDeadlineHours,
      maxBookingsPerWeek: BOOKING_DEFAULTS.maxBookingsPerWeek,
      hardMonthlyCapacity: BOOKING_DEFAULTS.hardMonthlyCapacity,
    },
  },
  hatmam: {
    hm01Name: 'Ấn phẩm Bản Sắc',
    hm01LaunchPriceVnd: HATMAM_HM01_PRICE_VND,
    hm01ReferencePriceVnd: HATMAM_HM01_REFERENCE_VND,
    hm02Name: 'Trò Chuyện Cùng Kenji',
    hm02LaunchPriceVnd: HATMAM_HM02_PRICE_VND,
    hm02ReferencePriceVnd: HATMAM_HM02_REFERENCE_VND,
    capacityMonth: 10,
    deliveryBusinessDays: 5,
    revisionWindowDays: 7,
    rawIntakeRetentionMonths: 12,
    publicationRetentionMonths: 24,
    publicActivationEnabled: false,
  },
  integrations: {
    privateStorageReady: false,
    deletionWorkflowReady: false,
    resendReadiness: 'off',
    calcomReadiness: 'off',
  },
};

export function hydrateOperationalSettings(values: unknown): AdminOperationalSettings {
  const raw = asRecord(values);
  const lang = asRecord(raw.lang);
  const hatmam = asRecord(raw.hatmam);
  const integrations = asRecord(raw.integrations);
  const bookingDefaults = asRecord(lang.bookingDefaults ?? lang.booking_defaults);

  return {
    lang: {
      priceVnd: numberOr(lang.priceVnd ?? lang.price_vnd, DEFAULT_ADMIN_SETTINGS.lang.priceVnd),
      capacityMonth: numberOr(
        lang.capacityMonth ?? lang.capacity_month,
        DEFAULT_ADMIN_SETTINGS.lang.capacityMonth
      ),
      responseSlaMinutes: numberOr(
        lang.responseSlaMinutes ?? lang.response_sla_minutes,
        DEFAULT_ADMIN_SETTINGS.lang.responseSlaMinutes
      ),
      paymentConfirmationSlaMinutes: numberOr(
        lang.paymentConfirmationSlaMinutes ?? lang.payment_confirmation_sla_minutes,
        DEFAULT_ADMIN_SETTINGS.lang.paymentConfirmationSlaMinutes
      ),
      sessionDurationMinutes: numberOr(
        lang.sessionDurationMinutes ?? lang.session_duration_minutes,
        DEFAULT_ADMIN_SETTINGS.lang.sessionDurationMinutes
      ),
      publicLocationLabel: stringOr(
        lang.publicLocationLabel ?? lang.public_location_label,
        DEFAULT_ADMIN_SETTINGS.lang.publicLocationLabel
      ),
      bookingDefaults: {
        tuesday0930: booleanOr(
          bookingDefaults.tuesday0930 ?? bookingDefaults.tuesday_0930,
          DEFAULT_ADMIN_SETTINGS.lang.bookingDefaults.tuesday0930
        ),
        thursday1430: booleanOr(
          bookingDefaults.thursday1430 ?? bookingDefaults.thursday_1430,
          DEFAULT_ADMIN_SETTINGS.lang.bookingDefaults.thursday1430
        ),
        postSessionBufferMinutes: numberOr(
          bookingDefaults.postSessionBufferMinutes ?? bookingDefaults.post_session_buffer_minutes,
          DEFAULT_ADMIN_SETTINGS.lang.bookingDefaults.postSessionBufferMinutes
        ),
        minNoticeHours: numberOr(
          bookingDefaults.minNoticeHours ?? bookingDefaults.min_notice_hours,
          DEFAULT_ADMIN_SETTINGS.lang.bookingDefaults.minNoticeHours
        ),
        bookingHorizonDays: numberOr(
          bookingDefaults.bookingHorizonDays ?? bookingDefaults.booking_horizon_days,
          DEFAULT_ADMIN_SETTINGS.lang.bookingDefaults.bookingHorizonDays
        ),
        rescheduleDeadlineHours: numberOr(
          bookingDefaults.rescheduleDeadlineHours ?? bookingDefaults.reschedule_deadline_hours,
          DEFAULT_ADMIN_SETTINGS.lang.bookingDefaults.rescheduleDeadlineHours
        ),
        maxBookingsPerWeek: numberOr(
          bookingDefaults.maxBookingsPerWeek ?? bookingDefaults.max_bookings_per_week,
          DEFAULT_ADMIN_SETTINGS.lang.bookingDefaults.maxBookingsPerWeek
        ),
        hardMonthlyCapacity: numberOr(
          bookingDefaults.hardMonthlyCapacity ?? bookingDefaults.hard_monthly_capacity,
          DEFAULT_ADMIN_SETTINGS.lang.bookingDefaults.hardMonthlyCapacity
        ),
      },
    },
    hatmam: {
      hm01Name: stringOr(hatmam.hm01Name ?? hatmam.hm01_name, DEFAULT_ADMIN_SETTINGS.hatmam.hm01Name),
      hm01LaunchPriceVnd: numberOr(
        hatmam.hm01LaunchPriceVnd ?? hatmam.hm01_price_vnd,
        DEFAULT_ADMIN_SETTINGS.hatmam.hm01LaunchPriceVnd
      ),
      hm01ReferencePriceVnd: numberOr(
        hatmam.hm01ReferencePriceVnd ?? hatmam.hm01_reference_price_vnd,
        DEFAULT_ADMIN_SETTINGS.hatmam.hm01ReferencePriceVnd
      ),
      hm02Name: stringOr(hatmam.hm02Name ?? hatmam.hm02_name, DEFAULT_ADMIN_SETTINGS.hatmam.hm02Name),
      hm02LaunchPriceVnd: numberOr(
        hatmam.hm02LaunchPriceVnd ?? hatmam.hm02_price_vnd,
        DEFAULT_ADMIN_SETTINGS.hatmam.hm02LaunchPriceVnd
      ),
      hm02ReferencePriceVnd: numberOr(
        hatmam.hm02ReferencePriceVnd ?? hatmam.hm02_reference_price_vnd,
        DEFAULT_ADMIN_SETTINGS.hatmam.hm02ReferencePriceVnd
      ),
      capacityMonth: numberOr(
        hatmam.capacityMonth ?? hatmam.capacity_month,
        DEFAULT_ADMIN_SETTINGS.hatmam.capacityMonth
      ),
      deliveryBusinessDays: numberOr(
        hatmam.deliveryBusinessDays ?? hatmam.delivery_business_days,
        DEFAULT_ADMIN_SETTINGS.hatmam.deliveryBusinessDays
      ),
      revisionWindowDays: numberOr(
        hatmam.revisionWindowDays ?? hatmam.revision_window_days,
        DEFAULT_ADMIN_SETTINGS.hatmam.revisionWindowDays
      ),
      rawIntakeRetentionMonths: numberOr(
        hatmam.rawIntakeRetentionMonths ?? hatmam.raw_intake_retention_months,
        DEFAULT_ADMIN_SETTINGS.hatmam.rawIntakeRetentionMonths
      ),
      publicationRetentionMonths: numberOr(
        hatmam.publicationRetentionMonths ?? hatmam.publication_retention_months,
        DEFAULT_ADMIN_SETTINGS.hatmam.publicationRetentionMonths
      ),
      publicActivationEnabled: booleanOr(
        hatmam.publicActivationEnabled ?? hatmam.public_activation_enabled,
        DEFAULT_ADMIN_SETTINGS.hatmam.publicActivationEnabled
      ),
    },
    integrations: {
      privateStorageReady: booleanOr(
        integrations.privateStorageReady ?? integrations.private_storage_ready,
        DEFAULT_ADMIN_SETTINGS.integrations.privateStorageReady
      ),
      deletionWorkflowReady: booleanOr(
        integrations.deletionWorkflowReady ?? integrations.deletion_workflow_ready,
        DEFAULT_ADMIN_SETTINGS.integrations.deletionWorkflowReady
      ),
      resendReadiness: readinessOr(integrations.resendReadiness ?? integrations.resend, DEFAULT_ADMIN_SETTINGS.integrations.resendReadiness),
      calcomReadiness: readinessOr(integrations.calcomReadiness ?? integrations.calcom, DEFAULT_ADMIN_SETTINGS.integrations.calcomReadiness),
    },
  };
}

export function getActiveSettings(rows: OperationalSettingsVersionRow[]) {
  const active = rows.find((row) => row.active) ?? rows[0];
  return {
    row: active,
    values: hydrateOperationalSettings(active?.values ?? DEFAULT_ADMIN_SETTINGS),
  };
}

export function sanitizeSettingsPayload(input: unknown): AdminOperationalSettings {
  return hydrateOperationalSettings(input);
}

export function getSettingsAuditActor(adminEmail: string = ADMIN_EMAIL) {
  return `human:settings (${adminEmail})`;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function numberOr(value: unknown, fallback: number) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function stringOr(value: unknown, fallback: string) {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function booleanOr(value: unknown, fallback: boolean) {
  return typeof value === 'boolean' ? value : fallback;
}

function readinessOr(
  value: unknown,
  fallback: AdminOperationalSettings['integrations']['resendReadiness']
) {
  return value === 'verified' ||
    value === 'waiting_for_secure_session' ||
    value === 'off'
    ? value
    : fallback;
}

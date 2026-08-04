import {
  ADMIN_EMAIL,
  BOOKING_DEFAULTS,
  HATMAM_HM01_PRICE_VND,
  HATMAM_HM01_REFERENCE_VND,
  HATMAM_HM02_PRICE_VND,
  HATMAM_HM02_REFERENCE_VND,
  LANG_PRICE_VND,
} from './operational';
import { DomainError } from '@/lib/domain/errors';

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

export function validateSettingsPayload(input: unknown): AdminOperationalSettings {
  const root = requiredRecord(input, 'Dữ liệu cài đặt không hợp lệ.');
  const lang = requiredRecord(root.lang, 'Thiếu nhóm cài đặt Lặng.');
  const hatmam = requiredRecord(root.hatmam, 'Thiếu nhóm cài đặt Hạt Mầm.');
  const integrations = requiredRecord(root.integrations, 'Thiếu nhóm tích hợp.');
  const booking = requiredRecord(lang.bookingDefaults, 'Thiếu booking defaults.');

  const values: AdminOperationalSettings = {
    lang: {
      priceVnd: requiredInteger(lang.priceVnd, 'Giá Lặng', 0, 100_000_000),
      capacityMonth: requiredInteger(lang.capacityMonth, 'Capacity Lặng', 1, 100),
      responseSlaMinutes: requiredInteger(lang.responseSlaMinutes, 'SLA phản hồi', 1, 1440),
      paymentConfirmationSlaMinutes: requiredInteger(lang.paymentConfirmationSlaMinutes, 'SLA xác nhận tiền', 1, 1440),
      sessionDurationMinutes: requiredInteger(lang.sessionDurationMinutes, 'Thời lượng phiên', 15, 480),
      publicLocationLabel: requiredText(lang.publicLocationLabel, 'Địa điểm công khai', 200),
      bookingDefaults: {
        tuesday0930: requiredBoolean(booking.tuesday0930, 'Lịch Thứ Ba'),
        thursday1430: requiredBoolean(booking.thursday1430, 'Lịch Thứ Năm'),
        postSessionBufferMinutes: requiredInteger(booking.postSessionBufferMinutes, 'Buffer', 0, 480),
        minNoticeHours: requiredInteger(booking.minNoticeHours, 'Notice tối thiểu', 0, 720),
        bookingHorizonDays: requiredInteger(booking.bookingHorizonDays, 'Booking horizon', 1, 365),
        rescheduleDeadlineHours: requiredInteger(booking.rescheduleDeadlineHours, 'Reschedule deadline', 0, 720),
        maxBookingsPerWeek: requiredInteger(booking.maxBookingsPerWeek, 'Booking mỗi tuần', 1, 20),
        hardMonthlyCapacity: requiredInteger(booking.hardMonthlyCapacity, 'Hard capacity', 1, 100),
      },
    },
    hatmam: {
      hm01Name: requiredText(hatmam.hm01Name, 'Tên HM-01', 120),
      hm01LaunchPriceVnd: requiredInteger(hatmam.hm01LaunchPriceVnd, 'Giá launch HM-01', 0, 100_000_000),
      hm01ReferencePriceVnd: requiredInteger(hatmam.hm01ReferencePriceVnd, 'Giá reference HM-01', 0, 100_000_000),
      hm02Name: requiredText(hatmam.hm02Name, 'Tên HM-02', 120),
      hm02LaunchPriceVnd: requiredInteger(hatmam.hm02LaunchPriceVnd, 'Giá launch HM-02', 0, 100_000_000),
      hm02ReferencePriceVnd: requiredInteger(hatmam.hm02ReferencePriceVnd, 'Giá reference HM-02', 0, 100_000_000),
      capacityMonth: requiredInteger(hatmam.capacityMonth, 'Capacity Hạt Mầm', 1, 100),
      deliveryBusinessDays: requiredInteger(hatmam.deliveryBusinessDays, 'Hạn giao', 1, 60),
      revisionWindowDays: requiredInteger(hatmam.revisionWindowDays, 'Revision window', 0, 60),
      rawIntakeRetentionMonths: requiredInteger(hatmam.rawIntakeRetentionMonths, 'Raw intake retention', 1, 120),
      publicationRetentionMonths: requiredInteger(hatmam.publicationRetentionMonths, 'Publication retention', 1, 120),
      publicActivationEnabled: requiredBoolean(hatmam.publicActivationEnabled, 'Public activation'),
    },
    integrations: {
      privateStorageReady: requiredBoolean(integrations.privateStorageReady, 'Private Storage'),
      deletionWorkflowReady: requiredBoolean(integrations.deletionWorkflowReady, 'Deletion workflow'),
      resendReadiness: requiredReadiness(integrations.resendReadiness, 'Resend'),
      calcomReadiness: requiredReadiness(integrations.calcomReadiness, 'Cal.com'),
    },
  };

  if (values.hatmam.hm01ReferencePriceVnd < values.hatmam.hm01LaunchPriceVnd || values.hatmam.hm02ReferencePriceVnd < values.hatmam.hm02LaunchPriceVnd) {
    throw new DomainError('VALIDATION_FAILED', 'Giá tham chiếu không được thấp hơn giá launch.');
  }
  if (values.lang.bookingDefaults.hardMonthlyCapacity !== values.lang.capacityMonth) {
    throw new DomainError('VALIDATION_FAILED', 'Hard capacity phải khớp capacity Lặng đang hiệu lực.');
  }
  if (
    values.hatmam.publicActivationEnabled ||
    values.integrations.privateStorageReady ||
    values.integrations.deletionWorkflowReady ||
    values.integrations.resendReadiness !== 'off' ||
    values.integrations.calcomReadiness !== 'off'
  ) {
    throw new DomainError('VALIDATION_FAILED', 'Release gates và provider readiness đang bị khóa OFF trong staging.');
  }
  return values;
}

/** Compatibility alias used by historical callers. New writes must validate. */
export const sanitizeSettingsPayload = validateSettingsPayload;

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

function requiredRecord(value: unknown, message: string) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new DomainError('VALIDATION_FAILED', message);
  }
  return value as Record<string, unknown>;
}

function requiredInteger(value: unknown, label: string, min: number, max: number) {
  if (!Number.isInteger(value) || (value as number) < min || (value as number) > max) {
    throw new DomainError('VALIDATION_FAILED', `${label} phải là số nguyên từ ${min} đến ${max}.`);
  }
  return value as number;
}

function requiredText(value: unknown, label: string, max: number) {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > max) {
    throw new DomainError('VALIDATION_FAILED', `${label} không được để trống hoặc quá ${max} ký tự.`);
  }
  return value.trim();
}

function requiredBoolean(value: unknown, label: string) {
  if (typeof value !== 'boolean') throw new DomainError('VALIDATION_FAILED', `${label} không hợp lệ.`);
  return value;
}

function requiredReadiness(value: unknown, label: string): AdminOperationalSettings['integrations']['resendReadiness'] {
  if (value !== 'off' && value !== 'waiting_for_secure_session' && value !== 'verified') {
    throw new DomainError('VALIDATION_FAILED', `${label} readiness không hợp lệ.`);
  }
  return value;
}

// ============================================================
// Test cửa nhận — work order B0 mục 7, ca 5 (thiếu trường bắt buộc)
// + honeypot + rate limit + màn hình chặn an toàn.
// ============================================================

import { beforeEach, describe, expect, it } from 'vitest';

import {
  assertNotBot,
  assertNotCrisis,
  checkRateLimit,
  isCrisisAnswer,
  parseBody,
  resetRateLimits,
} from '@/lib/api/guard';
import {
  contactMessageSchema,
  hatMamOrderSchema,
  langApplicationSchema,
} from '@/lib/api/schemas';
import { DomainError } from '@/lib/domain/errors';

const validLang = {
  q1_situation: 'Tôi đang thấy rối.',
  q2_level: 'A',
  q3_prior_help: 'A',
  q4_want: 'Nhìn rõ hơn.',
  q5_openness: 'A',
  applicant_name: 'Nguyễn Văn Test',
  applicant_contact: 'test@example.com',
  consent: true,
};

describe('ca 5 — gọi API thiếu trường bắt buộc thì trả lỗi đúng', () => {
  it('thiếu lời nhắn ở form liên hệ', () => {
    try {
      parseBody(contactMessageSchema, { name: 'Test', contact: 'test@example.com' });
      throw new Error('lẽ ra phải ném lỗi');
    } catch (err) {
      const e = err as DomainError;
      expect(e.code).toBe('VALIDATION_FAILED');
      expect((e.details?.fields as Record<string, string>).message).toContain('lời nhắn');
    }
  });

  it('thiếu đồng ý ở form Lặng', () => {
    const { consent, ...withoutConsent } = validLang;
    void consent;
    try {
      parseBody(langApplicationSchema, withoutConsent);
      throw new Error('lẽ ra phải ném lỗi');
    } catch (err) {
      const e = err as DomainError;
      expect(e.code).toBe('VALIDATION_FAILED');
      expect(Object.keys(e.details?.fields as object)).toContain('consent');
    }
  });

  it('câu 2 ngoài A/B/C/D bị từ chối', () => {
    expect(() => parseBody(langApplicationSchema, { ...validLang, q2_level: 'Z' })).toThrowError(
      DomainError
    );
  });

  it('gói Hạt Mầm lạ bị từ chối', () => {
    expect(() =>
      parseBody(hatMamOrderSchema, {
        package: 'goi-99',
        parent_name: 'Test',
        parent_contact: 'test@example.com',
      })
    ).toThrowError(DomainError);
  });

  it('dữ liệu đủ thì đi qua', () => {
    const parsed = parseBody(langApplicationSchema, validLang);
    expect(parsed.applicant_name).toBe('Nguyễn Văn Test');
  });

  it('lỗi trả về KHÔNG kèm nội dung người dùng nhập', () => {
    try {
      parseBody(contactMessageSchema, {
        name: 'Test',
        contact: 'test@example.com',
        message: '',
      });
    } catch (err) {
      const serialized = JSON.stringify((err as DomainError).toResponse());
      expect(serialized).not.toContain('test@example.com');
    }
  });
});

describe('honeypot', () => {
  it('trường ẩn có giá trị → coi là bot', () => {
    try {
      assertNotBot({ company: 'Acme Corp' });
      throw new Error('lẽ ra phải ném lỗi');
    } catch (err) {
      expect((err as DomainError).code).toBe('SPAM_SUSPECTED');
    }
  });

  it('trường ẩn trống → người thật, đi tiếp', () => {
    expect(() => assertNotBot({ company: '' })).not.toThrow();
    expect(() => assertNotBot({})).not.toThrow();
  });
});

describe('màn hình chặn an toàn — câu 2 = C (FD-C, phải giữ nguyên vẹn)', () => {
  it('nhận diện đúng câu trả lời khủng hoảng', () => {
    expect(isCrisisAnswer({ q2_level: 'C' })).toBe(true);
    expect(isCrisisAnswer({ q2_level: 'A' })).toBe(false);
    expect(isCrisisAnswer({ q2_level: 'B' })).toBe(false);
    expect(isCrisisAnswer({ q2_level: 'D' })).toBe(false);
  });

  it('chặn và hướng tới chuyên gia y tế, không tạo hồ sơ', () => {
    try {
      assertNotCrisis({ q2_level: 'C' });
      throw new Error('lẽ ra phải ném lỗi');
    } catch (err) {
      const e = err as DomainError;
      expect(e.details?.crisis).toBe(true);
      expect(e.userMessage).toContain('chuyên môn y tế');
    }
  });

  it('không chặn các lựa chọn còn lại', () => {
    for (const level of ['A', 'B', 'D']) {
      expect(() => assertNotCrisis({ q2_level: level })).not.toThrow();
    }
  });
});

describe('rate limit theo IP', () => {
  beforeEach(() => resetRateLimits());

  it('cho qua đúng số lần cho phép rồi chặn', () => {
    const opts = { limit: 3, windowMs: 60_000 };
    const t0 = 1_000_000;
    for (let i = 0; i < 3; i += 1) {
      expect(() => checkRateLimit('1.2.3.4', opts, t0)).not.toThrow();
    }
    try {
      checkRateLimit('1.2.3.4', opts, t0);
      throw new Error('lẽ ra phải ném lỗi');
    } catch (err) {
      expect((err as DomainError).code).toBe('RATE_LIMITED');
    }
  });

  it('mở lại sau khi hết cửa sổ', () => {
    const opts = { limit: 1, windowMs: 60_000 };
    const t0 = 1_000_000;
    checkRateLimit('5.6.7.8', opts, t0);
    expect(() => checkRateLimit('5.6.7.8', opts, t0)).toThrowError(DomainError);
    expect(() => checkRateLimit('5.6.7.8', opts, t0 + 60_001)).not.toThrow();
  });

  it('đếm riêng theo từng IP', () => {
    const opts = { limit: 1, windowMs: 60_000 };
    const t0 = 1_000_000;
    checkRateLimit('1.1.1.1', opts, t0);
    expect(() => checkRateLimit('2.2.2.2', opts, t0)).not.toThrow();
  });
});

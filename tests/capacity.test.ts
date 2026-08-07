// ============================================================
// Test bộ đếm suất — work order B0 mục 7, ca 3.
// ============================================================

import { describe, expect, it } from 'vitest';

import { assertCapacityAvailable, evaluateCapacity, toMonthKey } from '@/lib/domain/capacity';
import { DomainError } from '@/lib/domain/errors';
import { transitionLang, type Actor } from '@/lib/domain/state-machine';

const kenji: Actor = { kind: 'human', id: 'user-kenji' };

describe('ca 3 — vượt 5 suất/tháng thì bị chặn', () => {
  it('còn chỗ khi đã dùng 0..4', () => {
    for (let used = 0; used < 5; used += 1) {
      const r = evaluateCapacity({ monthKey: '2026-09-01', usedSlots: used });
      expect(r.hasRoom).toBe(true);
      expect(r.remaining).toBe(5 - used);
    }
  });

  it('hết chỗ khi đã dùng đúng 5', () => {
    const r = evaluateCapacity({ monthKey: '2026-09-01', usedSlots: 5 });
    expect(r.hasRoom).toBe(false);
    expect(r.remaining).toBe(0);
  });

  it('assertCapacityAvailable ném CAPACITY_FULL ở suất thứ 6', () => {
    expect(() =>
      assertCapacityAvailable({ monthKey: '2026-09-01', usedSlots: 5 })
    ).toThrowError(DomainError);

    try {
      assertCapacityAvailable({ monthKey: '2026-09-01', usedSlots: 5 });
    } catch (err) {
      const e = err as DomainError;
      expect(e.code).toBe('CAPACITY_FULL');
      expect(e.userMessage).toContain('09/2026');
    }
  });

  it('tôn trọng giới hạn riêng của tháng khi Kenji hạ xuống', () => {
    expect(evaluateCapacity({ monthKey: '2026-10-01', usedSlots: 3, maxSlots: 3 }).hasRoom).toBe(false);
    expect(evaluateCapacity({ monthKey: '2026-10-01', usedSlots: 2, maxSlots: 3 }).hasRoom).toBe(true);
  });
});

describe('bộ đếm khoá ĐÚNG ở bước phát link thanh toán (FD-C)', () => {
  it('chặn accepted -> awaiting_payment khi tháng đã đầy', () => {
    expect(() =>
      transitionLang({
        applicationId: 'app-1',
        from: 'accepted',
        to: 'awaiting_payment',
        actor: kenji,
        capacity: { monthKey: '2026-09-01', usedSlots: 5 },
      })
    ).toThrowError(DomainError);
  });

  it('đòi phải có tháng dự kiến trước khi khoá suất', () => {
    try {
      transitionLang({
        applicationId: 'app-1',
        from: 'accepted',
        to: 'awaiting_payment',
        actor: kenji,
      });
      throw new Error('lẽ ra phải ném lỗi');
    } catch (err) {
      expect((err as DomainError).code).toBe('TARGET_MONTH_REQUIRED');
    }
  });

  it('KHÔNG khoá suất ở bước cuối — khách trả tiền rồi mới biết hết chỗ là lỗi nghiêm trọng', () => {
    // awaiting_payment -> paid không cần capacity, không bao giờ ném CAPACITY_FULL.
    const r = transitionLang({
      applicationId: 'app-1',
      from: 'awaiting_payment',
      to: 'paid',
      actor: kenji,
    });
    expect(r.to).toBe('paid');
    expect(r.capacity).toBeUndefined();
  });

  it('trả về thông tin suất khi khoá thành công', () => {
    const r = transitionLang({
      applicationId: 'app-1',
      from: 'accepted',
      to: 'awaiting_payment',
      actor: kenji,
      capacity: { monthKey: '2026-09-01', usedSlots: 2 },
    });
    expect(r.capacity).toMatchObject({ usedSlots: 2, maxSlots: 5, remaining: 3 });
  });
});

describe('toMonthKey — luôn quy về ngày mùng 1', () => {
  it.each([
    ['2026-09-17T10:30:00Z', '2026-09-01'],
    ['2026-01-01T00:00:00Z', '2026-01-01'],
    ['2026-12-31T23:59:59Z', '2026-12-01'],
  ])('%s -> %s', (input, expected) => {
    expect(toMonthKey(input)).toBe(expected);
  });

  it('ném lỗi rõ ràng khi tháng không hợp lệ', () => {
    expect(() => toMonthKey('không-phải-ngày')).toThrowError(DomainError);
  });
});

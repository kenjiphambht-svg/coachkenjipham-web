// ============================================================
// BỘ ĐẾM SUẤT LẶNG — tối đa 5 phiên/tháng (L0 C-05).
//
// QUYẾT ĐỊNH FOUNDER 02/08/2026 về cách đếm:
//   Lúc khoá suất (accepted → awaiting_payment) hệ CHƯA biết ngày diễn ra
//   phiên, vì bước xếp lịch nằm sau bước trả tiền. Nên Kenji CHỌN THÁNG
//   DỰ KIẾN ngay khi bấm "Nhận". Suất khoá vào đúng tháng đó.
//   Đếm theo THÁNG DIỄN RA PHIÊN, không phải tháng nộp hồ sơ.
//
// Toàn bộ file này là hàm thuần — không đụng cơ sở dữ liệu, để test được
// không cần kết nối. Bên gọi chịu trách nhiệm đếm và truyền số vào.
// ============================================================

import { DomainError } from './errors';
import { LANG_DEFAULT_MONTHLY_SLOTS } from './states';

/** Chuẩn hoá một mốc thời gian về ngày mùng 1 của tháng, dạng YYYY-MM-01. */
export function toMonthKey(input: Date | string): string {
  const d = typeof input === 'string' ? new Date(input) : input;
  if (Number.isNaN(d.getTime())) {
    throw new DomainError(
      'VALIDATION_FAILED',
      'Tháng dự kiến không hợp lệ. Chọn lại giúp tôi một tháng nhé.'
    );
  }
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  return `${year}-${month}-01`;
}

export interface CapacityCheck {
  /** Tháng dự kiến diễn ra phiên. */
  monthKey: string;
  /** Số hồ sơ đang chiếm suất trong tháng đó (bên gọi đếm từ CSDL). */
  usedSlots: number;
  /** Giới hạn của tháng đó; bỏ trống thì dùng mặc định 5. */
  maxSlots?: number | null;
}

export interface CapacityResult {
  monthKey: string;
  usedSlots: number;
  maxSlots: number;
  remaining: number;
  hasRoom: boolean;
}

export function evaluateCapacity({
  monthKey,
  usedSlots,
  maxSlots,
}: CapacityCheck): CapacityResult {
  const limit =
    maxSlots === null || maxSlots === undefined
      ? LANG_DEFAULT_MONTHLY_SLOTS
      : maxSlots;
  const remaining = Math.max(0, limit - usedSlots);
  return {
    monthKey,
    usedSlots,
    maxSlots: limit,
    remaining,
    hasRoom: usedSlots < limit,
  };
}

/**
 * Chặn cứng: hết suất thì ném lỗi kèm lý do rõ, không âm thầm cho qua.
 * Gọi hàm này TRƯỚC khi cho phép accepted → awaiting_payment.
 */
export function assertCapacityAvailable(check: CapacityCheck): CapacityResult {
  const result = evaluateCapacity(check);
  if (!result.hasRoom) {
    const [year, month] = result.monthKey.split('-');
    throw new DomainError(
      'CAPACITY_FULL',
      `Tháng ${month}/${year} đã đủ ${result.maxSlots} phiên. ` +
        `Chọn tháng khác cho hồ sơ này, hoặc chỉnh giới hạn của tháng nếu bạn thực sự muốn nhận thêm.`,
      { monthKey: result.monthKey, usedSlots: result.usedSlots, maxSlots: result.maxSlots }
    );
  }
  return result;
}

// ============================================================
// Cửa nhận: validate + honeypot + rate limit.
//
// LUẬT LOG CỦA FILE NÀY (work order B0 mục 4):
//   KHÔNG log nội dung form. Chỉ log id + thời gian + mã lỗi.
//   Nội dung khách viết là thứ riêng tư nhất họ gửi cho Kenji.
// ============================================================

import type { NextApiRequest } from 'next';
import type { ZodType } from 'zod';

import { DomainError } from '@/lib/domain/errors';
import { LANG_Q2_CRISIS_ANSWER } from './schemas';

// ---------- Validate ----------

export function parseBody<T>(schema: ZodType<T>, body: unknown): T {
  const result = schema.safeParse(body);
  if (!result.success) {
    // Gom lỗi theo trường, chỉ lấy thông điệp — KHÔNG kèm giá trị người dùng nhập.
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const key = issue.path.join('.') || '_';
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    throw new DomainError(
      'VALIDATION_FAILED',
      'Còn vài chỗ chưa đủ thông tin. Xem lại giúp tôi nhé.',
      { fields: fieldErrors }
    );
  }
  return result.data;
}

// ---------- Honeypot ----------

/**
 * Bot thường điền mọi input thấy trong DOM; người thật không thấy trường ẩn
 * nên luôn để trống. Có giá trị → coi là bot.
 */
export function assertNotBot(input: { company?: string }): void {
  if (input.company && input.company.trim() !== '') {
    throw new DomainError(
      'SPAM_SUSPECTED',
      'Không gửi được lời nhắn này. Nếu bạn là người thật, thử lại giúp tôi nhé.'
    );
  }
}

// ---------- Màn hình chặn an toàn (FD-2026-08-02 FD-C) ----------

/**
 * Câu 2 = "C" nghĩa là người gửi đang có ý nghĩ tự làm hại bản thân hoặc
 * người khác. Hệ KHÔNG tạo hồ sơ, KHÔNG thu thêm dữ liệu — trả về tín hiệu
 * để tầng trên hiện màn hình hướng dẫn tìm chuyên gia y tế.
 *
 * Logic này đang tồn tại ở giao diện tại src/pages/lang-90/dat-phien.tsx.
 * Đưa xuống tầng dữ liệu để nó không thể rơi mất khi giao diện được dựng lại.
 */
export function isCrisisAnswer(input: { q2_level?: string }): boolean {
  return input.q2_level === LANG_Q2_CRISIS_ANSWER;
}

export function assertNotCrisis(input: { q2_level?: string }): void {
  if (isCrisisAnswer(input)) {
    throw new DomainError(
      'VALIDATION_FAILED',
      'Điều bạn vừa chia sẻ cần một người có chuyên môn y tế đi cùng, không phải một phiên coaching. ' +
        'Xin bạn liên hệ bác sĩ hoặc chuyên gia sức khoẻ tâm thần sớm nhất có thể.',
      { crisis: true }
    );
  }
}

// ---------- Rate limit ----------

interface Bucket {
  count: number;
  resetAt: number;
}

// Bộ nhớ trong tiến trình. Đủ cho B0 (chưa nối form public, lưu lượng bằng 0).
// TODO(vòng sau): khi nối form thật, chuyển sang bộ đếm dùng chung
// (Upstash/Redis hoặc bảng Postgres) — bộ nhớ trong không sống sót qua
// serverless cold start và không chia sẻ giữa các instance.
const buckets = new Map<string, Bucket>();

export interface RateLimitOptions {
  /** Số lần cho phép trong một cửa sổ. */
  limit: number;
  /** Độ dài cửa sổ, tính bằng mili giây. */
  windowMs: number;
}

export const DEFAULT_RATE_LIMIT: RateLimitOptions = {
  limit: 5,
  windowMs: 10 * 60 * 1000, // 5 lần / 10 phút
};

export function getClientIp(req: NextApiRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return forwarded[0].split(',')[0].trim();
  }
  return req.socket?.remoteAddress ?? 'unknown';
}

/** Dùng được cho test: cho phép truyền mốc thời gian. */
export function checkRateLimit(
  key: string,
  options: RateLimitOptions = DEFAULT_RATE_LIMIT,
  now: number = Date.now()
): void {
  const bucket = buckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + options.windowMs });
    return;
  }

  if (bucket.count >= options.limit) {
    const waitMinutes = Math.max(1, Math.ceil((bucket.resetAt - now) / 60000));
    throw new DomainError(
      'RATE_LIMITED',
      `Đã gửi khá nhiều lần trong thời gian ngắn. Thử lại sau khoảng ${waitMinutes} phút nhé.`
    );
  }

  bucket.count += 1;
}

/** Chỉ dùng trong test. */
export function resetRateLimits(): void {
  buckets.clear();
}

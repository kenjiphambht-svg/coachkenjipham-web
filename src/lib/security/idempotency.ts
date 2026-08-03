// ============================================================
// Idempotency cho public write API.
//
// Key gốc chỉ xuất hiện trong HTTP header của request. CSDL lưu hash; request
// hash phân biệt việc vô tình dùng lại cùng key cho nội dung khác.
// ============================================================

import { createHash } from 'node:crypto';

import { DomainError } from '@/lib/domain/errors';

const IDEMPOTENCY_KEY_PATTERN = /^[A-Za-z0-9_-]{16,200}$/;

export function requireIdempotencyKey(value: string | string[] | undefined): string {
  const key = Array.isArray(value) ? undefined : value?.trim();
  if (!key || !IDEMPOTENCY_KEY_PATTERN.test(key)) {
    throw new DomainError(
      'VALIDATION_FAILED',
      'Không thể xác nhận lần gửi này. Tải lại trang rồi thử lại giúp tôi nhé.'
    );
  }
  return key;
}

export function hashIdempotencyKey(key: string): string {
  return createHash('sha256').update(`essence-idempotency:v1:${key}`, 'utf8').digest('hex');
}

export function hashRequestPayload(payload: unknown): string {
  return createHash('sha256').update(JSON.stringify(payload), 'utf8').digest('hex');
}

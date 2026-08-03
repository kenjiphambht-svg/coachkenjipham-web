// ============================================================
// Rate limit dùng chung Postgres — chỉ gọi từ API server-side.
//
// Không lưu IP/raw key: bảng chỉ nhận SHA-256 fingerprint. Hàm RPC không
// mở cho anon/authenticated; route phải xác thực/validate request trước.
// ============================================================

import { createHash } from 'node:crypto';
import type { SupabaseClient } from '@supabase/supabase-js';

import { DomainError } from '@/lib/domain/errors';
import type { RateLimitOptions } from '@/lib/api/guard';

export function hashRateLimitKey(key: string): string {
  return createHash('sha256').update(`essence-rate-limit:v1:${key}`, 'utf8').digest('hex');
}

export async function checkPostgresRateLimit(
  db: SupabaseClient,
  key: string,
  options: RateLimitOptions
): Promise<void> {
  const { data, error } = await db.rpc('consume_rate_limit', {
    p_key_hash: hashRateLimitKey(key),
    p_limit: options.limit,
    p_window_seconds: Math.ceil(options.windowMs / 1000),
  });

  if (error) throw error;
  if (data !== true) {
    const waitMinutes = Math.max(1, Math.ceil(options.windowMs / 60000));
    throw new DomainError(
      'RATE_LIMITED',
      `Đã gửi khá nhiều lần trong thời gian ngắn. Thử lại sau khoảng ${waitMinutes} phút nhé.`
    );
  }
}

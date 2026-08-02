// ============================================================
// Đọc biến môi trường. Thiếu biến → báo lỗi RÕ RÀNG, không trắng trang.
// Không file nào khác được đọc process.env cho Supabase.
// ============================================================

import { DomainError } from '@/lib/domain/errors';

export interface SupabasePublicEnv {
  url: string;
  anonKey: string;
}

function read(name: string): string | undefined {
  const value = process.env[name];
  return value && value.trim() !== '' ? value.trim() : undefined;
}

/**
 * Biến công khai (được nhúng vào bundle trình duyệt). Chỉ URL + anon key —
 * hai giá trị này vốn được thiết kế để lộ ra client; RLS mới là thứ giữ
 * dữ liệu, không phải sự bí mật của anon key.
 */
export function getSupabasePublicEnv(): SupabasePublicEnv {
  const url = read('NEXT_PUBLIC_SUPABASE_URL');
  const anonKey = read('NEXT_PUBLIC_SUPABASE_ANON_KEY');

  const missing: string[] = [];
  if (!url) missing.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!anonKey) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');

  if (missing.length > 0) {
    throw new DomainError(
      'CONFIG_MISSING',
      `Chưa cấu hình kết nối cơ sở dữ liệu. Thiếu biến môi trường: ${missing.join(', ')}. ` +
        `Xem .env.example để biết cần đặt những gì.`,
      { missing }
    );
  }

  return { url: url as string, anonKey: anonKey as string };
}

/**
 * Service role key — TOÀN QUYỀN, bỏ qua RLS.
 * CHỈ được gọi trong code chạy phía máy chủ (API route, getServerSideProps,
 * script seed). Tên biến cố ý KHÔNG có tiền tố NEXT_PUBLIC_ để Next.js
 * không bao giờ nhúng nó vào bundle gửi xuống trình duyệt.
 */
export function getSupabaseServiceRoleKey(): string {
  if (typeof window !== 'undefined') {
    throw new DomainError(
      'CONFIG_MISSING',
      'Lỗi lập trình: service role key bị gọi từ phía trình duyệt. Key này chỉ được dùng ở máy chủ.'
    );
  }

  const key = read('SUPABASE_SERVICE_ROLE_KEY');
  if (!key) {
    throw new DomainError(
      'CONFIG_MISSING',
      'Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY. Xem .env.example.',
      { missing: ['SUPABASE_SERVICE_ROLE_KEY'] }
    );
  }
  return key;
}

/** Kiểm tra nhanh, không ném lỗi — dùng để hiện màn hình hướng dẫn thay vì crash. */
export function isSupabaseConfigured(): boolean {
  try {
    getSupabasePublicEnv();
    return true;
  } catch {
    return false;
  }
}

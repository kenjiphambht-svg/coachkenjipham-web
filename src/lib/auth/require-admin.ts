// ============================================================
// Lớp khoá THỨ HAI: getServerSideProps của mọi trang admin gọi hàm này.
// Middleware có thể bị cấu hình sai; lớp này vẫn chặn.
// ============================================================

import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import type { SupabaseClient } from '@supabase/supabase-js';

import { createServerSupabase } from '@/lib/db/client';
import { isSupabaseConfigured } from '@/lib/db/env';
import { ADMIN_LOGIN_PATH } from './admin-gate';

export interface AdminContext {
  db: SupabaseClient;
  adminEmail: string;
}

type Handler<P> = (
  ctx: GetServerSidePropsContext,
  admin: AdminContext
) => Promise<GetServerSidePropsResult<P>>;

const redirectToLogin: GetServerSidePropsResult<never> = {
  redirect: { destination: ADMIN_LOGIN_PATH, permanent: false },
};

/**
 * Bọc getServerSideProps của một trang admin.
 *
 * Ba điều kiện phải đúng hết mới chạy handler:
 *   1. Có cấu hình Supabase.
 *   2. Có người dùng đã xác thực (getUser, không phải getSession).
 *   3. Người đó nằm trong bảng admin_users và đang is_active.
 *
 * Bước 3 đọc qua client mang session người dùng, nên chính RLS xác nhận
 * quyền — không tự tin vào một lá cờ nào ở phía ứng dụng.
 */
export function withAdmin<P extends Record<string, unknown>>(handler: Handler<P>) {
  return async (
    ctx: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<P>> => {
    if (!isSupabaseConfigured()) {
      return redirectToLogin as GetServerSidePropsResult<P>;
    }

    const db = createServerSupabase({ req: ctx.req, res: ctx.res });

    const {
      data: { user },
      error: userError,
    } = await db.auth.getUser();

    if (userError || !user) {
      return redirectToLogin as GetServerSidePropsResult<P>;
    }

    const { data: adminRow, error: adminError } = await db
      .from('admin_users')
      .select('email, is_active')
      .eq('user_id', user.id)
      .maybeSingle();

    if (adminError || !adminRow || adminRow.is_active !== true) {
      // Đăng nhập được nhưng không phải admin → vẫn không thấy gì.
      return redirectToLogin as GetServerSidePropsResult<P>;
    }

    return handler(ctx, { db, adminEmail: adminRow.email as string });
  };
}

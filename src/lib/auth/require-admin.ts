// ============================================================
// Lớp khoá THỨ HAI: getServerSideProps của mọi trang admin gọi hàm này.
// Middleware có thể bị cấu hình sai; lớp này vẫn chặn.
// ============================================================

import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import type { SupabaseClient } from '@supabase/supabase-js';

import { createServerSupabase } from '@/lib/db/client';
import { isSupabaseConfigured } from '@/lib/db/env';
import { DomainError } from '@/lib/domain/errors';
import { ADMIN_LOGIN_PATH, ADMIN_MFA_PATH } from './admin-gate';

export interface AdminContext {
  db: SupabaseClient;
  adminId: string;
  adminEmail: string;
}

type Handler<P> = (
  ctx: GetServerSidePropsContext,
  admin: AdminContext
) => Promise<GetServerSidePropsResult<P>>;

const redirectToLogin: GetServerSidePropsResult<never> = {
  redirect: { destination: ADMIN_LOGIN_PATH, permanent: false },
};

const redirectToMfa: GetServerSidePropsResult<never> = {
  redirect: { destination: ADMIN_MFA_PATH, permanent: false },
};

/**
 * Xác thực danh tính admin cho SSR lẫn API route.
 *
 * Cần AAL2 trước khi đọc `admin_users`: policy RLS ở migration 0003 cũng
 * thực thi cùng điều kiện này, nên không có đường nào chỉ dựa vào UI.
 */
export async function requireAdmin(db: SupabaseClient): Promise<AdminContext> {
  const {
    data: { user },
    error: userError,
  } = await db.auth.getUser();

  if (userError || !user) {
    throw new DomainError('UNAUTHORIZED', 'Cần đăng nhập.');
  }

  const { data: assurance, error: assuranceError } =
    await db.auth.mfa.getAuthenticatorAssuranceLevel();
  if (assuranceError || assurance?.currentLevel !== 'aal2') {
    throw new DomainError(
      'MFA_REQUIRED',
      'Cần xác minh bằng ứng dụng xác thực trước khi vào khu vực quản trị.'
    );
  }

  const { data: adminRow, error: adminError } = await db
    .from('admin_users')
    .select('id, email, is_active')
    .eq('user_id', user.id)
    .maybeSingle();

  if (adminError || !adminRow || adminRow.is_active !== true) {
    throw new DomainError('UNAUTHORIZED', 'Tài khoản này không có quyền quản trị.');
  }

  return { db, adminId: adminRow.id as string, adminEmail: adminRow.email as string };
}

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

    try {
      const admin = await requireAdmin(db);
      return handler(ctx, admin);
    } catch (error) {
      if (error instanceof DomainError && error.code === 'MFA_REQUIRED') {
        return redirectToMfa as GetServerSidePropsResult<P>;
      }
      // Đăng nhập được nhưng không phải admin → vẫn không thấy gì.
      return redirectToLogin as GetServerSidePropsResult<P>;
    }
  };
}

// ============================================================
// Supabase client. Ba loại, dùng đúng chỗ:
//
//   browser  — trong component client. Mang session của người đăng nhập,
//              chịu RLS đầy đủ.
//   server   — trong getServerSideProps / API route. Đọc session từ cookie,
//              CHỊU RLS — đây là loại dùng cho mọi truy vấn admin.
//   admin    — service_role, BỎ QUA RLS. Chỉ cho việc hệ thống (webhook
//              ngân hàng, seed). Không dùng để phục vụ màn hình admin,
//              vì làm vậy là vô hiệu hoá chính lớp RLS ta vừa dựng.
// ============================================================

import { createBrowserClient, createServerClient, serializeCookieHeader } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';

import { getSupabasePublicEnv, getSupabaseServiceRoleKey } from './env';

export function createBrowserSupabase() {
  const { url, anonKey } = getSupabasePublicEnv();
  return createBrowserClient(url, anonKey);
}

type ServerCtx =
  | { req: GetServerSidePropsContext['req']; res: GetServerSidePropsContext['res'] }
  | { req: NextApiRequest; res: NextApiResponse };

/**
 * Client phía máy chủ, mang session của người đang đăng nhập.
 * RLS áp dụng đầy đủ — nếu người này không phải admin, họ không đọc
 * được gì, kể cả khi code quên kiểm tra quyền.
 */
export function createServerSupabase({ req, res }: ServerCtx) {
  const { url, anonKey } = getSupabasePublicEnv();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        const cookies = req.cookies ?? {};
        return Object.entries(cookies).map(([name, value]) => ({
          name,
          value: value ?? '',
        }));
      },
      setAll(cookiesToSet) {
        const serialized = cookiesToSet.map(({ name, value, options }) =>
          serializeCookieHeader(name, value, {
            ...options,
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            path: '/',
          })
        );
        res.setHeader('Set-Cookie', serialized);
      },
    },
  });
}

/**
 * Client toàn quyền, BỎ QUA RLS.
 *
 * Chỉ dùng khi thao tác thực sự là của hệ thống chứ không của một người:
 * ghi nhận tiền từ webhook ngân hàng, chèn audit_log, chạy seed.
 * Không dùng cho màn hình admin.
 */
export function createAdminSupabase() {
  const { url } = getSupabasePublicEnv();
  return createClient(url, getSupabaseServiceRoleKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

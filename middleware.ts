// ============================================================
// Middleware — chặn /admin/* khi chưa đăng nhập.
//
// matcher chỉ khớp /admin/*. Mọi route của trang khách KHÔNG đi qua file
// này, nên hành vi trang khách không đổi một chút nào.
//
// Đây là lớp khoá THỨ NHẤT. Lớp thứ hai là getServerSideProps của từng
// trang admin, lớp thứ ba là RLS trong cơ sở dữ liệu. Middleware bị lỗi
// cấu hình thì hai lớp kia vẫn giữ được dữ liệu.
// ============================================================

import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

import { ADMIN_LOGIN_PATH, decideAdminAccess } from '@/lib/auth/admin-gate';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });
  const { pathname } = request.nextUrl;
  if (pathname === '/admin/quen-mat-khau' || pathname === '/admin/dat-lai-mat-khau') {
    response.headers.set('Cache-Control', 'no-store');
    response.headers.set('Referrer-Policy', 'no-referrer');
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Thiếu cấu hình: KHÔNG mở cửa. Đẩy về trang đăng nhập, nơi có thông báo
  // rõ ràng cho người vận hành. Fail đóng, không fail mở.
  if (!url || !anonKey) {
    if (pathname === ADMIN_LOGIN_PATH) return response;
    const redirect = request.nextUrl.clone();
    redirect.pathname = ADMIN_LOGIN_PATH;
    return NextResponse.redirect(redirect);
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  // getUser() xác thực token với máy chủ Supabase.
  // KHÔNG dùng getSession() ở đây — session đọc từ cookie chưa được kiểm
  // chứng, nên không đủ tin cậy để làm cổng bảo mật.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // `getUser()` chỉ xác minh đăng nhập. Khu vực admin còn đòi AAL2; nếu
  // tra AAL lỗi thì giữ `false` để fail-closed sang màn hình xác minh.
  let hasAal2 = false;
  if (user) {
    const { data: assurance } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    hasAal2 = assurance?.currentLevel === 'aal2';
  }

  const decision = decideAdminAccess({ pathname, hasSession: Boolean(user), hasAal2 });

  if (decision.action === 'allow') return response;

  const redirect = request.nextUrl.clone();
  redirect.pathname = decision.destination as string;
  redirect.search = '';
  return NextResponse.redirect(redirect);
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};

// ============================================================
// Luật chặn /admin/* — tách khỏi middleware.ts để test được mà không cần
// dựng cả runtime Edge.
// ============================================================

export const ADMIN_LOGIN_PATH = '/admin/dang-nhap';

/** Đường dẫn admin nào được xem mà chưa đăng nhập. Chỉ đúng trang đăng nhập. */
const PUBLIC_ADMIN_PATHS = new Set<string>([ADMIN_LOGIN_PATH]);

export function isAdminPath(pathname: string): boolean {
  return pathname === '/admin' || pathname.startsWith('/admin/');
}

export interface GateDecision {
  action: 'allow' | 'redirect-to-login' | 'redirect-to-dashboard';
  destination?: string;
}

/**
 * Quyết định cho một request vào /admin/*.
 *
 * Mặc định là CHẶN: chỉ trả 'allow' khi có session thật. Chưa đăng nhập
 * thì không thấy bất kỳ dữ liệu nào — kể cả khung trang.
 */
export function decideAdminAccess(params: {
  pathname: string;
  hasSession: boolean;
}): GateDecision {
  const { pathname, hasSession } = params;

  if (!isAdminPath(pathname)) return { action: 'allow' };

  const isLoginPage = PUBLIC_ADMIN_PATHS.has(pathname);

  if (hasSession) {
    // Đã đăng nhập mà còn mở trang đăng nhập → đẩy về tổng quan.
    return isLoginPage
      ? { action: 'redirect-to-dashboard', destination: '/admin' }
      : { action: 'allow' };
  }

  if (isLoginPage) return { action: 'allow' };

  return { action: 'redirect-to-login', destination: ADMIN_LOGIN_PATH };
}

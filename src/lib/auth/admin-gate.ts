// ============================================================
// Luật chặn /admin/* — tách khỏi middleware.ts để test được mà không cần
// dựng cả runtime Edge.
// ============================================================

export const ADMIN_LOGIN_PATH = '/admin/dang-nhap';
export const ADMIN_MFA_PATH = '/admin/xac-minh-mfa';
export const ADMIN_RECOVERY_PATH = '/admin/quen-mat-khau';
export const ADMIN_RESET_PASSWORD_PATH = '/admin/dat-lai-mat-khau';

/** Đường dẫn admin nào được xem mà chưa đăng nhập. Chỉ đúng trang đăng nhập. */
const PUBLIC_ADMIN_PATHS = new Set<string>([ADMIN_LOGIN_PATH, ADMIN_MFA_PATH, ADMIN_RECOVERY_PATH, ADMIN_RESET_PASSWORD_PATH]);

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
  hasAal2?: boolean;
}): GateDecision {
  const { pathname, hasSession, hasAal2 = false } = params;

  if (!isAdminPath(pathname)) return { action: 'allow' };

  const isLoginPage = pathname === ADMIN_LOGIN_PATH;
  const isMfaPage = pathname === ADMIN_MFA_PATH;
  const isRecoveryPage = pathname === ADMIN_RECOVERY_PATH || pathname === ADMIN_RESET_PASSWORD_PATH;
  const isPublicAdminPage = PUBLIC_ADMIN_PATHS.has(pathname);

  if (hasSession) {
    // Session chỉ ở AAL1 chưa được phép thấy dữ liệu quản trị. Người dùng
    // phải vào đúng màn hình xác minh/enroll MFA; mọi route khác fail-closed.
    if (!hasAal2) {
      return isMfaPage || isRecoveryPage
        ? { action: 'allow' }
        : { action: 'redirect-to-login', destination: ADMIN_MFA_PATH };
    }

    // Đã đạt AAL2 mà còn mở login/MFA → đẩy về tổng quan.
    return isLoginPage || isMfaPage || isRecoveryPage
      ? { action: 'redirect-to-dashboard', destination: '/admin' }
      : { action: 'allow' };
  }

  if (isPublicAdminPage) return { action: 'allow' };

  return { action: 'redirect-to-login', destination: ADMIN_LOGIN_PATH };
}

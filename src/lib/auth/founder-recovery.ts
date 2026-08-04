export const FOUNDER_ADMIN_EMAIL = 'kenjipham.bht@gmail.com';

export const RECOVERY_CONFIRMATION =
  'Nếu địa chỉ này có quyền truy cập, một email đặt lại mật khẩu sẽ được gửi. Hãy kiểm tra cả Spam và Quảng cáo.';

export function normalizeFounderEmail(value: unknown) {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

export function isCanonicalFounderEmail(value: unknown) {
  return normalizeFounderEmail(value) === FOUNDER_ADMIN_EMAIL;
}

export function passwordPolicyError(password: string, confirmation: string) {
  if (password !== confirmation) return 'Hai lần nhập mật khẩu chưa khớp.';
  if (password.length < 12) return 'Mật khẩu cần ít nhất 12 ký tự.';
  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) {
    return 'Mật khẩu cần có chữ thường, chữ hoa và ít nhất một số.';
  }
  return null;
}

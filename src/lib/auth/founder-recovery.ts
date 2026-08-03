import { DomainError } from '@/lib/domain/errors';

export const FOUNDER_ADMIN_EMAIL = 'kenjipham.bht@gmail.com';
const STAGING_PREVIEW_HOST = /^sg-307d0acd-2be8-4e65-a316-9997b5e2e979-[a-z0-9-]+\.vercel\.app$/;

export const RECOVERY_CONFIRMATION =
  'Nếu địa chỉ này có quyền truy cập, một email đặt lại mật khẩu sẽ được gửi. Hãy kiểm tra cả Spam và Quảng cáo.';

export function normalizeFounderEmail(value: unknown) {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

export function isCanonicalFounderEmail(value: unknown) {
  return normalizeFounderEmail(value) === FOUNDER_ADMIN_EMAIL;
}

/** Only the preconfigured staging Vercel preview family can receive recovery redirects. */
export function getTrustedRecoveryRedirect(host: string | undefined) {
  const normalized = (host ?? '').split(':')[0].toLowerCase();
  if (!STAGING_PREVIEW_HOST.test(normalized)) {
    throw new DomainError('CONFIG_MISSING', 'Recovery callback staging chưa được allowlist.');
  }
  return `https://${normalized}/admin/dat-lai-mat-khau`;
}

export function passwordPolicyError(password: string, confirmation: string) {
  if (password !== confirmation) return 'Hai lần nhập mật khẩu chưa khớp.';
  if (password.length < 12) return 'Mật khẩu cần ít nhất 12 ký tự.';
  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) {
    return 'Mật khẩu cần có chữ thường, chữ hoa và ít nhất một số.';
  }
  return null;
}

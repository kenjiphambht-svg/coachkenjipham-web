import { DomainError } from '@/lib/domain/errors';

// Branch alias only: it follows the latest PR #134 Preview deployment and is
// never derived from a request header, client value or commit-specific host.
const APPROVED_RECOVERY_ORIGIN =
  'https://sg-307d0acd-2be8-4e65-a316-999-git-5a6b97-kenji-pham-s-projects.vercel.app';
const RECOVERY_PATH = '/admin/dat-lai-mat-khau';

export function buildCanonicalRecoveryRedirect(shareQuery: string | undefined) {
  const parsed = new URLSearchParams(shareQuery ?? '');
  const shareValue = parsed.get('_vercel_share');
  if (parsed.size !== 1 || !shareValue || !/^[A-Za-z0-9_-]+$/.test(shareValue)) {
    throw new DomainError('CONFIG_MISSING', 'Recovery callback staging chưa được cấu hình an toàn.');
  }

  const redirect = new URL(RECOVERY_PATH, APPROVED_RECOVERY_ORIGIN);
  redirect.searchParams.set('_vercel_share', shareValue);
  return redirect.toString();
}

/** Server-only: Vercel share access is never placed in client code or Git. */
export function getCanonicalRecoveryRedirect() {
  return buildCanonicalRecoveryRedirect(process.env.VERCEL_ADMIN_RECOVERY_SHARE_QUERY);
}

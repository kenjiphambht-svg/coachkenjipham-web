import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

import {
  FOUNDER_ADMIN_EMAIL,
  getTrustedRecoveryRedirect,
  isCanonicalFounderEmail,
  passwordPolicyError,
  RECOVERY_CONFIRMATION,
} from '@/lib/auth/founder-recovery';

describe('Founder password recovery', () => {
  it('only treats the canonical admin email as a recipient, without exposing that decision to the caller', () => {
    expect(isCanonicalFounderEmail(` ${FOUNDER_ADMIN_EMAIL.toUpperCase()} `)).toBe(true);
    expect(isCanonicalFounderEmail('someone-else@example.com')).toBe(false);
    expect(RECOVERY_CONFIRMATION).toContain('Nếu địa chỉ này có quyền truy cập');
  });

  it('only accepts the preconfigured staging Vercel callback family', () => {
    expect(
      getTrustedRecoveryRedirect('sg-307d0acd-2be8-4e65-a316-9997b5e2e979-git-5a6b97-kenji-pham-s-projects.vercel.app')
    ).toBe('https://sg-307d0acd-2be8-4e65-a316-9997b5e2e979-git-5a6b97-kenji-pham-s-projects.vercel.app/admin/dat-lai-mat-khau');
    expect(() => getTrustedRecoveryRedirect('attacker.example')).toThrow('allowlist');
  });

  it('blocks mismatched and weak passwords before an Auth update', () => {
    expect(passwordPolicyError('Abcdef123456', 'Abcdef123457')).toContain('chưa khớp');
    expect(passwordPolicyError('weak', 'weak')).toContain('ít nhất 12');
    expect(passwordPolicyError('abcdefgh1234', 'abcdefgh1234')).toContain('chữ hoa');
    expect(passwordPolicyError('StrongPass123', 'StrongPass123')).toBeNull();
  });

  it('keeps recovery bound to an active admin and does not grant roles or reset MFA', () => {
    const resetRoute = readFileSync(
      resolve(process.cwd(), 'src/pages/api/admin/auth/dat-lai-mat-khau.ts'),
      'utf8'
    );
    expect(resetRoute).toContain(".from('admin_users')");
    expect(resetRoute).toContain(".select('is_active')");
    expect(resetRoute).toContain('!admin?.is_active');
    expect(resetRoute).toContain('db.auth.updateUser({ password })');
    expect(resetRoute).not.toContain('.auth.admin');
    expect(resetRoute).not.toContain(".insert(");
    expect(resetRoute).not.toContain('mfa.unenroll');
  });
});

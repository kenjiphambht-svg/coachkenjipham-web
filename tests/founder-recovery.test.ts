import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

import {
  FOUNDER_ADMIN_EMAIL,
  isCanonicalFounderEmail,
  passwordPolicyError,
  RECOVERY_CONFIRMATION,
} from '@/lib/auth/founder-recovery';
import { buildCanonicalRecoveryRedirect } from '@/lib/auth/founder-recovery-server';

describe('Founder password recovery', () => {
  it('only treats the canonical admin email as a recipient, without exposing that decision to the caller', () => {
    expect(isCanonicalFounderEmail(` ${FOUNDER_ADMIN_EMAIL.toUpperCase()} `)).toBe(true);
    expect(isCanonicalFounderEmail('someone-else@example.com')).toBe(false);
    expect(RECOVERY_CONFIRMATION).toContain('Nếu địa chỉ này có quyền truy cập');
  });

  it('uses only the exact approved branch alias and one server-side share query', () => {
    expect(
      buildCanonicalRecoveryRedirect('_vercel_share=BranchAccessOnly')
    ).toBe('https://sg-307d0acd-2be8-4e65-a316-999-git-5a6b97-kenji-pham-s-projects.vercel.app/admin/dat-lai-mat-khau?_vercel_share=BranchAccessOnly');
    expect(() => buildCanonicalRecoveryRedirect('_vercel_share=ok&redirect=https://attacker.example')).toThrow('cấu hình an toàn');
    expect(() => buildCanonicalRecoveryRedirect(undefined)).toThrow('cấu hình an toàn');
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

  it('uses an implicit recovery link so a server-initiated email can be opened on the Founder device', () => {
    const recoveryRoute = readFileSync(
      resolve(process.cwd(), 'src/pages/api/admin/auth/quen-mat-khau.ts'),
      'utf8'
    );
    const recoveryClient = readFileSync(
      resolve(process.cwd(), 'src/lib/db/client.ts'),
      'utf8'
    );
    const resetPage = readFileSync(
      resolve(process.cwd(), 'src/pages/admin/dat-lai-mat-khau.tsx'),
      'utf8'
    );
    expect(recoveryRoute).toContain('createRecoverySupabase');
    expect(recoveryClient).toContain("flowType: 'implicit'");
    expect(resetPage).toContain("fragment.get('type') === 'recovery'");
  });
});

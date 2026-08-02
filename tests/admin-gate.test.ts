// ============================================================
// Test cổng admin — work order B0 mục 7, ca 6.
// ============================================================

import { describe, expect, it } from 'vitest';

import { ADMIN_LOGIN_PATH, decideAdminAccess, isAdminPath } from '@/lib/auth/admin-gate';

describe('ca 6 — mở /admin khi chưa đăng nhập thì bị đẩy ra', () => {
  it.each([
    '/admin',
    '/admin/lang',
    '/admin/lang/abc-123',
    '/admin/hat-mam',
    '/admin/lien-he',
  ])('%s → đẩy về trang đăng nhập', (pathname) => {
    const decision = decideAdminAccess({ pathname, hasSession: false });
    expect(decision.action).toBe('redirect-to-login');
    expect(decision.destination).toBe(ADMIN_LOGIN_PATH);
  });

  it('trang đăng nhập vẫn xem được khi chưa đăng nhập', () => {
    expect(decideAdminAccess({ pathname: ADMIN_LOGIN_PATH, hasSession: false }).action).toBe(
      'allow'
    );
  });

  it('đã đăng nhập thì vào được mọi trang admin', () => {
    for (const pathname of ['/admin', '/admin/lang', '/admin/hat-mam', '/admin/lien-he']) {
      expect(decideAdminAccess({ pathname, hasSession: true }).action).toBe('allow');
    }
  });

  it('đã đăng nhập mà mở trang đăng nhập thì về tổng quan', () => {
    const decision = decideAdminAccess({ pathname: ADMIN_LOGIN_PATH, hasSession: true });
    expect(decision.action).toBe('redirect-to-dashboard');
    expect(decision.destination).toBe('/admin');
  });
});

describe('mặc định là CHẶN — không có đường nào lọt', () => {
  it('đường dẫn admin lạ chưa tồn tại vẫn bị chặn', () => {
    expect(
      decideAdminAccess({ pathname: '/admin/mot-trang-chua-ton-tai', hasSession: false }).action
    ).toBe('redirect-to-login');
  });

  it('không nhầm route trang khách thành route admin', () => {
    for (const pathname of ['/', '/lang-90', '/lien-he', '/administrator', '/admin-cu']) {
      expect(isAdminPath(pathname)).toBe(false);
      expect(decideAdminAccess({ pathname, hasSession: false }).action).toBe('allow');
    }
  });

  it('nhận đúng các đường dẫn admin', () => {
    expect(isAdminPath('/admin')).toBe(true);
    expect(isAdminPath('/admin/')).toBe(true);
    expect(isAdminPath('/admin/lang/1')).toBe(true);
  });
});

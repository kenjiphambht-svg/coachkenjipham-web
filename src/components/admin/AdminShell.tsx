// ============================================================
// Khung trang admin. CHỈ dùng trong /admin/* — không phải component dùng
// chung, cố ý để riêng trong thư mục admin/ theo work order B0.
//
// noindex đặt ở đây, nên MỌI trang admin bọc bằng shell này đều có, không
// phụ thuộc việc người viết trang sau có nhớ thêm hay không.
// ============================================================

import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { ReactNode } from 'react';

const NAV = [
  { href: '/admin', label: 'Tổng quan' },
  { href: '/admin/lang', label: 'Lặng' },
  { href: '/admin/hat-mam', label: 'Hạt Mầm' },
  { href: '/admin/lien-he', label: 'Liên hệ' },
];

export default function AdminShell({
  title,
  adminEmail,
  children,
}: {
  title: string;
  adminEmail?: string;
  children: ReactNode;
}) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>{`${title} · Quản trị Essence`}</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-e26-ivory text-e26-text">
        <header className="border-b border-e26-border bg-e26-white">
          <div className="max-w-[1100px] mx-auto px-4 py-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="font-serif text-lg">Quản trị</span>
            <nav className="flex flex-wrap gap-x-1 gap-y-1 flex-1">
              {NAV.map((item) => {
                const active =
                  item.href === '/admin'
                    ? router.pathname === '/admin'
                    : router.pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`font-sans text-[14px] px-3 py-2 rounded-none transition-colors ${
                      active
                        ? 'bg-e26-cream text-e26-text font-medium'
                        : 'text-e26-text-2 hover:text-e26-gold-deep'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            {adminEmail && (
              <form action="/api/admin/dang-xuat" method="post" className="flex items-center gap-3">
                <span className="font-sans text-[13px] text-e26-text-2 hidden sm:inline">
                  {adminEmail}
                </span>
                <button
                  type="submit"
                  className="font-sans text-[13px] underline underline-offset-4 text-e26-text-2 hover:text-e26-gold-deep"
                >
                  Đăng xuất
                </button>
              </form>
            )}
          </div>
        </header>

        <main className="max-w-[1100px] mx-auto px-4 py-6 md:py-8">
          <h1 className="font-serif text-[24px] md:text-[30px] mb-6">{title}</h1>
          {children}
        </main>
      </div>
    </>
  );
}

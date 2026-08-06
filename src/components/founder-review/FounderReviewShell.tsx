// ============================================================
// Khung trang Founder Review Preview — WP3.5-A2.
//
// Cố ý HOÀN TOÀN TÁCH RIÊNG khỏi AdminShell/@/components/admin: không
// import admin navigation, không import withAdmin/requireAdmin, không có
// bất kỳ liên kết nào tới Admin thật, thanh toán, xuất bản, cài đặt hay
// Launch Core.
//
// noindex đặt ở đây để mọi trang bọc bằng shell này đều có, không phụ
// thuộc việc người viết trang sau có nhớ thêm hay không (cùng lý do với
// AdminShell).
//
// Không dùng localStorage/cookie: "Reset phiên" chỉ là điều hướng tới cùng
// route, chỉ giữ lại scenario hợp lệ hiện tại trong query string.
// ============================================================

import Head from 'next/head';
import Link from 'next/link';
// `React` is imported explicitly (Package C3 addition) even though Next's
// build never needs it (automatic JSX runtime): this repo's
// vitest.config.mts has no @vitejs/plugin-react, so Vitest's esbuild JSX
// transform falls back to classic mode, which needs `React` in scope in
// every file with JSX — this file is now rendered directly by
// TodayReview.test.tsx (test 20, the locked-banner check).
import React, { type ReactNode } from 'react';

import { buildSafeSyntheticQuery, buildScenarioOnlyQuery, type ScenarioPreset } from '@/lib/wp3-5/review-selectors';

const NAV_ITEMS = [
  { href: '/founder-review/wp3-5-a', label: 'Hôm nay' },
  { href: '/founder-review/quan-he', label: 'Quan hệ' },
  { href: '/founder-review/hanh-trinh', label: 'Hành trình' },
  { href: '/founder-review/cham-soc', label: 'Chăm sóc & Phục hồi' },
] as const;

const LOCKED_BANNER_TEXT =
  'Founder Review Preview — Dữ liệu mô phỏng. Mọi thay đổi chỉ tồn tại trong phiên xem hiện tại, không gửi, không lưu và không kết nối hệ thống thật.';

export interface FounderReviewShellProps {
  readonly title: string;
  readonly scenario: ScenarioPreset;
  readonly currentPathname: string;
  readonly children: ReactNode;
}

export default function FounderReviewShell({ title, scenario, currentPathname, children }: FounderReviewShellProps) {
  const resetHref = { pathname: currentPathname, query: buildScenarioOnlyQuery(scenario) };

  return (
    <>
      <Head>
        <title>{`${title} · Founder Review Preview`}</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-e26-ivory text-e26-text">
        <header className="border-b border-e26-border bg-e26-white">
          <div className="max-w-[1240px] mx-auto px-4 py-3">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="font-serif text-lg">Founder Review Preview</span>
              <span className="font-sans text-[12px] uppercase tracking-[0.14em] text-e26-text-2">
                Scenario: {scenario}
              </span>
              <span className="font-sans text-[12px] text-e26-text-2">Synthetic · No send · No save</span>
              <Link
                href={resetHref}
                className="ml-auto font-sans text-[13px] underline underline-offset-4 text-e26-text-2 hover:text-e26-gold-deep"
              >
                Reset phiên
              </Link>
            </div>

            <nav
              className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-5"
              aria-label="Điều hướng Founder Review Preview"
            >
              {NAV_ITEMS.map((item) => {
                const href = { pathname: item.href, query: buildSafeSyntheticQuery({ scenario }) };
                const active = currentPathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={href}
                    className={`font-sans text-[14px] px-3 py-2 transition-colors ${
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
          </div>
        </header>

        <div className="max-w-[1240px] mx-auto px-4 pt-4">
          <p className="border border-e26-border bg-e26-cream px-4 py-3 font-sans text-[13px] leading-relaxed text-e26-text-2">
            {LOCKED_BANNER_TEXT}
          </p>
        </div>

        <main className="max-w-[1240px] mx-auto px-4 py-6 md:py-8">
          <h1 className="font-serif text-[24px] md:text-[30px] mb-6">{title}</h1>
          {children}
        </main>
      </div>
    </>
  );
}

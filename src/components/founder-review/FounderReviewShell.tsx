// ============================================================
// Khung trang Founder Review Preview — WP3.5-A2 clarity milestone.
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
//
// This shell now owns ReviewPreferencesProvider and ReviewStateProvider —
// the single source of both for all four workspaces — so AI Trợ lý and
// Thiết lập phiên (both rendered here) reach the same simulated-action
// overlay and display preferences that the workspace body reads. Both
// providers are React state only; nothing is written outside the tree.
// ============================================================

import Head from 'next/head';
import Link from 'next/link';
// `React` is imported explicitly (Package C3 addition) even though Next's
// build never needs it (automatic JSX runtime): this repo's
// vitest.config.mts has no @vitejs/plugin-react, so Vitest's esbuild JSX
// transform falls back to classic mode, which needs `React` in scope in
// every file with JSX — this file is now rendered directly by
// TodayReview.test.tsx (test 20, the locked-banner check).
import React, { useState, type ReactNode } from 'react';

import { buildSafeSyntheticQuery, buildScenarioOnlyQuery, type ScenarioPreset } from '@/lib/wp3-5/review-selectors';
import { ReviewStateProvider } from './ReviewStateContext';
import { ReviewPreferencesProvider } from './SessionPreferencesContext';
import AIAssistantPanel from './AIAssistantPanel';
import SessionSettingsPanel from './SessionSettingsPanel';

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
  return (
    <ReviewPreferencesProvider>
      <ReviewStateProvider>
        <FounderReviewShellInner title={title} scenario={scenario} currentPathname={currentPathname}>
          {children}
        </FounderReviewShellInner>
      </ReviewStateProvider>
    </ReviewPreferencesProvider>
  );
}

function FounderReviewShellInner({ title, scenario, currentPathname, children }: FounderReviewShellProps) {
  const resetHref = { pathname: currentPathname, query: buildScenarioOnlyQuery(scenario) };
  const [aiOpen, setAiOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

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
              <span className="font-serif text-[19px] font-bold text-e26-black">Founder Review Preview</span>
              <span className="font-sans text-[12px] font-bold uppercase tracking-[0.14em] text-e26-text-2">
                Scenario: {scenario}
              </span>
              <span className="font-sans text-[12px] font-medium text-e26-text-2">Synthetic · No send · No save</span>

              <div className="ml-auto flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setAiOpen(true)}
                  data-testid="open-ai-assistant"
                  className="font-sans text-[13px] font-semibold text-e26-text hover:text-e26-gold-deep"
                >
                  AI Trợ lý
                </button>
                <button
                  type="button"
                  onClick={() => setSettingsOpen(true)}
                  data-testid="open-session-settings"
                  className="font-sans text-[13px] font-semibold text-e26-text hover:text-e26-gold-deep"
                >
                  Thiết lập
                </button>
                <Link
                  href={resetHref}
                  className="font-sans text-[13px] font-semibold underline underline-offset-4 text-e26-text-2 hover:text-e26-gold-deep"
                >
                  Reset phiên
                </Link>
              </div>
            </div>

            <nav
              className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-1"
              aria-label="Điều hướng Founder Review Preview"
            >
              {NAV_ITEMS.map((item) => {
                const href = { pathname: item.href, query: buildSafeSyntheticQuery({ scenario }) };
                const active = currentPathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={href}
                    aria-current={active ? 'page' : undefined}
                    className={`font-sans text-[14px] font-semibold px-3 py-2 transition-colors ${
                      active ? 'bg-e26-black text-e26-white' : 'text-e26-text hover:text-e26-gold-deep'
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
          <p className="border border-e26-border bg-e26-cream px-4 py-3 font-sans text-[13px] font-medium leading-relaxed text-e26-text-2">
            {LOCKED_BANNER_TEXT}
          </p>
        </div>

        <main className="max-w-[1240px] mx-auto px-4 py-6 md:py-8">
          <h1 className="font-serif text-[28px] md:text-[34px] font-bold text-e26-black mb-6">{title}</h1>
          {children}
        </main>
      </div>

      {aiOpen && <AIAssistantPanel scenario={scenario} onClose={() => setAiOpen(false)} />}
      {settingsOpen && (
        <SessionSettingsPanel scenario={scenario} currentPathname={currentPathname} onClose={() => setSettingsOpen(false)} />
      )}
    </>
  );
}

// ============================================================
// Thiết lập phiên (Session Settings) — WP3.5-A2 clarity milestone.
//
// Local-only Founder controls: scenario, display density, which summary
// blocks show, whether priority buckets start expanded, whether
// operational guidance text shows, and two reset actions. Everything here
// is React state or a navigation to an approved synthetic query — no
// localStorage, sessionStorage, cookie, IndexedDB or network call.
//
// Navigation uses `next/link` rather than `next/router`'s `useRouter()`:
// `useRouter()` requires Next's RouterContext, which is only present while
// a real Next.js page is actually rendering a request — it throws
// ("NextRouter was not mounted") when this component is rendered directly
// (as every Founder Review component test here does, via
// react-dom/server's renderToStaticMarkup, since this repo has no
// jsdom/happy-dom). `Link` has no such requirement and matches the
// pattern already used by FounderReviewShell's own "Reset phiên" link.
//
// `React` is imported explicitly for Vitest's classic-mode JSX transform.
// ============================================================

import React from 'react';
import Link from 'next/link';

import { buildScenarioOnlyQuery, SCENARIO_PRESETS, type ScenarioPreset } from '@/lib/wp3-5/review-selectors';
import { useReviewState } from './ReviewStateContext';
import { useReviewPreferences, type Density } from './SessionPreferencesContext';
import { SectionHeading } from './founder-review-ui';
import styles from './founder-review.module.css';

export interface SessionSettingsPanelProps {
  readonly scenario: ScenarioPreset;
  readonly currentPathname: string;
  readonly onClose: () => void;
}

const SCENARIO_LABEL: Readonly<Record<ScenarioPreset, string>> = {
  quiet: 'Quiet — ngày yên',
  normal: 'Normal — ngày thường (mặc định)',
  peak: 'Peak — ngày cao điểm',
  recovery: 'Recovery — ngày phục hồi',
};

export default function SessionSettingsPanel({ scenario, currentPathname, onClose }: SessionSettingsPanelProps) {
  const { dispatch: reviewDispatch } = useReviewState();
  const { state: prefs, dispatch: prefsDispatch } = useReviewPreferences();

  function resetSimulatedActions() {
    reviewDispatch({ type: 'RESET' });
  }

  function resetPreferencesOnly() {
    // The navigation below (Link to a scenario-only URL) already gives the
    // Founder a clean, selection-free view; dispatching here additionally
    // clears the overlay and preferences immediately, in case the target
    // route reuses the same mounted page tree instead of remounting it.
    reviewDispatch({ type: 'RESET' });
    prefsDispatch({ type: 'RESET' });
  }

  return (
    <>
      <div className={styles.drawerBackdrop} onClick={onClose} role="presentation" />
      <aside
        className={`${styles.drawerPanel} px-5 py-6`}
        role="dialog"
        aria-label="Thiết lập phiên"
        data-testid="session-settings-panel"
      >
        <button
          type="button"
          onClick={onClose}
          className="font-sans text-[13px] font-semibold text-e26-text-2 underline underline-offset-4 hover:text-e26-gold-deep mb-4"
        >
          Đóng
        </button>

        <h2 className="font-serif text-[22px] font-bold text-e26-black mb-1">Thiết lập phiên</h2>
        <p className="border border-e26-border bg-e26-cream px-3 py-2 font-sans text-[12px] font-medium text-e26-text-2 mb-5">
          Chỉ áp dụng cho phiên xem hiện tại, chỉ lưu trong bộ nhớ trình duyệt. Không dùng localStorage, cookie hay
          máy chủ. Tải lại trang sẽ trở về mặc định.
        </p>

        <SectionHeading>Scenario</SectionHeading>
        <div className="flex flex-wrap gap-2 mb-5" role="group" aria-label="Chọn scenario">
          {SCENARIO_PRESETS.map((preset) => (
            <Link
              key={preset}
              href={{ pathname: currentPathname, query: buildScenarioOnlyQuery(preset) }}
              aria-current={scenario === preset ? 'true' : undefined}
              data-testid={`settings-scenario-${preset}`}
              className={`border px-3 py-2 font-sans text-[13px] font-semibold transition-colors ${
                scenario === preset
                  ? 'border-e26-gold-deep bg-e26-cream text-e26-gold-deep'
                  : 'border-e26-border bg-e26-white text-e26-text hover:border-e26-gold-deep'
              }`}
            >
              {SCENARIO_LABEL[preset]}
            </Link>
          ))}
        </div>

        <SectionHeading>Mật độ hiển thị</SectionHeading>
        <div className="flex gap-2 mb-5" role="radiogroup" aria-label="Chọn mật độ hiển thị">
          {(['comfortable', 'compact'] as const satisfies readonly Density[]).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => prefsDispatch({ type: 'SET_DENSITY', density: d })}
              aria-pressed={prefs.density === d}
              data-testid={`settings-density-${d}`}
              className={`border px-3 py-2 font-sans text-[13px] font-semibold transition-colors ${
                prefs.density === d
                  ? 'border-e26-gold-deep bg-e26-cream text-e26-gold-deep'
                  : 'border-e26-border bg-e26-white text-e26-text hover:border-e26-gold-deep'
              }`}
            >
              {d === 'comfortable' ? 'Thoải mái' : 'Gọn'}
            </button>
          ))}
        </div>

        <SectionHeading>Hiển thị</SectionHeading>
        <div className="space-y-2 mb-5">
          <SettingsToggle
            label="Số liệu tổng quan (Hôm nay)"
            checked={prefs.showSummaryMetrics}
            onChange={() => prefsDispatch({ type: 'TOGGLE_SUMMARY_METRICS' })}
            testId="settings-toggle-metrics"
          />
          <SettingsToggle
            label="Mở sẵn các nhóm ưu tiên"
            checked={prefs.bucketsExpandedByDefault}
            onChange={() => prefsDispatch({ type: 'TOGGLE_BUCKETS_EXPANDED' })}
            testId="settings-toggle-buckets"
          />
          <SettingsToggle
            label="Ghi chú hướng dẫn vận hành"
            checked={prefs.showGuidanceText}
            onChange={() => prefsDispatch({ type: 'TOGGLE_GUIDANCE_TEXT' })}
            testId="settings-toggle-guidance"
          />
        </div>

        <SectionHeading>Đặt lại</SectionHeading>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={resetSimulatedActions}
            data-testid="settings-reset-simulated"
            className="border border-e26-border bg-e26-white px-3 py-2 font-sans text-[13px] font-semibold text-e26-text hover:border-e26-gold-deep hover:text-e26-gold-deep text-left"
          >
            Đặt lại hành động mô phỏng
          </button>
          <Link
            href={{ pathname: currentPathname, query: buildScenarioOnlyQuery(scenario) }}
            onClick={resetPreferencesOnly}
            data-testid="settings-reset-session"
            className="border border-e26-border bg-e26-white px-3 py-2 font-sans text-[13px] font-semibold text-e26-text hover:border-e26-gold-deep hover:text-e26-gold-deep text-left"
          >
            Đặt lại toàn bộ phiên
          </Link>
        </div>
      </aside>
    </>
  );
}

function SettingsToggle({
  label,
  checked,
  onChange,
  testId,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  testId: string;
}) {
  return (
    <label className="flex items-center justify-between gap-3 border border-e26-border bg-e26-white px-3 py-2 cursor-pointer">
      <span className="font-sans text-[13px] font-medium text-e26-text">{label}</span>
      <input type="checkbox" checked={checked} onChange={onChange} data-testid={testId} />
    </label>
  );
}

// ============================================================
// Shared visual primitives for the Founder Review workspace — WP3.5-A2
// clarity milestone.
//
// One small system reused by all four workspaces (Hôm nay, Quan hệ, Hành
// trình, Chăm sóc & Phục hồi) plus AI Trợ lý and Thiết lập phiên, so the
// four pages read as one operating console rather than four unrelated
// pages. Only existing ESSENCE 2026 tokens are used (e26-*); no new colors,
// no new dependency.
//
// Typography intent (Founder feedback: too light/faint, weak hierarchy):
//   - page title:      font-serif, bold, e26-black
//   - section heading: font-serif, semibold, e26-text
//   - record title:    font-sans, semibold, e26-text — heavier than metadata
//   - operational fact: font-sans, medium, e26-text — dark, not gray
//   - metadata:        font-sans, medium, e26-text-2 — secondary but not faint
//   - synthetic ID:    font-sans, tabular-nums, e26-text-2, small — visible
//                       without competing with the human-readable content
//
// `React` is imported explicitly because this repo's vitest.config.mts has
// no @vitejs/plugin-react, so Vitest's esbuild JSX transform runs classic
// mode and needs `React` in scope in every file with JSX.
// ============================================================

import React, { type ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Section heading — bucket titles, detail-panel section titles
// ---------------------------------------------------------------------------

export function SectionHeading({ children, testId }: { children: ReactNode; testId?: string }) {
  return (
    <h3
      className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-e26-text-2 mb-2"
      data-testid={testId}
    >
      {children}
    </h3>
  );
}

export function WorkspaceHeading({ children }: { children: ReactNode }) {
  return <h2 className="font-serif text-[20px] font-semibold text-e26-black mb-3">{children}</h2>;
}

// ---------------------------------------------------------------------------
// Synthetic ID — small, tabular, secondary; never the loudest thing on a card
// ---------------------------------------------------------------------------

export function IdTag({ children }: { children: ReactNode }) {
  return <span className="font-sans text-[12px] font-medium tabular-nums text-e26-text-2">{children}</span>;
}

// ---------------------------------------------------------------------------
// State badges — deliberately high-contrast for the states that must stand
// out (blocked, Founder decision required) without turning the page into a
// color chart. Neutral/eligible/silence stay quiet.
// ---------------------------------------------------------------------------

export type BadgeVariant = 'neutral' | 'blocked' | 'founder' | 'eligible' | 'silence';

const BADGE_CLASS: Readonly<Record<BadgeVariant, string>> = {
  neutral: 'border border-e26-border bg-e26-cream text-e26-text',
  blocked: 'bg-e26-black text-e26-white',
  founder: 'border border-e26-gold-deep bg-e26-cream text-e26-gold-deep',
  eligible: 'border border-e26-border bg-e26-white text-e26-text',
  silence: 'border border-e26-border bg-e26-cream text-e26-text-2',
};

export function Badge({
  variant = 'neutral',
  children,
  testId,
}: {
  variant?: BadgeVariant;
  children: ReactNode;
  testId?: string;
}) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap px-2 py-0.5 font-sans text-[11px] font-semibold uppercase tracking-[0.06em] ${BADGE_CLASS[variant]}`}
      data-testid={testId}
    >
      {children}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Summary stat tile — Hôm nay's top-of-page metrics
// ---------------------------------------------------------------------------

export function StatTile({
  label,
  value,
  risk = false,
  testId,
}: {
  label: string;
  value: string | number;
  risk?: boolean;
  testId?: string;
}) {
  return (
    <div
      className={`px-3 py-2 border ${
        risk ? 'bg-e26-black text-e26-white border-e26-black' : 'bg-e26-cream text-e26-text border-e26-border'
      }`}
      data-testid={testId}
    >
      <p
        className={`font-sans text-[11px] font-bold uppercase tracking-[0.1em] ${
          risk ? 'text-e26-white/80' : 'text-e26-text-2'
        }`}
      >
        {label}
      </p>
      <p className="font-serif text-[24px] font-bold">{value}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Directory / record card — the clickable list-item pattern shared by all
// four workspace directories. An urgent card gets a solid left accent bar
// instead of extra color, matching the "calm but not faint" instruction.
// ---------------------------------------------------------------------------

export function RecordCard({
  title,
  meta,
  selected,
  urgent,
  onClick,
  testId,
  dataAttrs,
}: {
  title: ReactNode;
  meta: ReactNode;
  selected?: boolean;
  urgent?: boolean;
  onClick: () => void;
  testId?: string;
  dataAttrs?: Record<string, string>;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={testId}
      {...dataAttrs}
      className={`w-full text-left border-y border-r px-3 py-2 font-sans text-[13px] transition-colors ${
        urgent ? 'border-l-4 border-l-e26-black' : 'border-l border-l-e26-border'
      } ${
        selected
          ? 'border-e26-gold-deep bg-e26-cream'
          : 'border-e26-border bg-e26-white hover:bg-e26-cream'
      }`}
    >
      <span className="block font-sans text-[14px] font-semibold text-e26-text">{title}</span>
      <span className="block text-e26-text-2 text-[12px] font-medium mt-0.5">{meta}</span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Detail-panel section wrapper
// ---------------------------------------------------------------------------

export function DetailSection({ title, children, testId }: { title: string; children: ReactNode; testId?: string }) {
  return (
    <section className="mb-6" data-testid={testId}>
      <SectionHeading>{title}</SectionHeading>
      {children}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Primary / secondary action links — bounded gold usage (AGENTS.md: at most
// one solid gold CTA visible per page/viewport). These are neutral-fill
// utility links; the single gold accent budget is spent on active nav state
// only.
// ---------------------------------------------------------------------------

export function ActionLink({ children, testId, className = '' }: { children: ReactNode; testId?: string; className?: string }) {
  return (
    <span
      data-testid={testId}
      className={`inline-block border border-e26-border bg-e26-white px-3 py-2 font-sans text-[13px] font-semibold text-e26-text hover:border-e26-gold-deep hover:text-e26-gold-deep transition-colors ${className}`}
    >
      {children}
    </span>
  );
}

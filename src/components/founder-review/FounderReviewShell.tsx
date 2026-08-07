import Head from 'next/head';
import Link from 'next/link';
import React, { useState, type ReactNode } from 'react';

import {
  buildSafeSyntheticQuery,
  type ProductLensId,
  type ScenarioPreset,
} from '@/lib/wp3-5/review-selectors';
import type { CareId, JourneyId, RelationshipId } from '@/lib/wp3-5/review-manifest';
import { ReviewStateProvider } from './ReviewStateContext';
import { ReviewPreferencesProvider } from './SessionPreferencesContext';
import AIAssistantPanel, { type AssistantWorkspace } from './AIAssistantPanel';
import SessionSettingsPanel from './SessionSettingsPanel';
import ProductLens from './ProductLens';
import styles from './founder-review.module.css';

const NAV_ITEMS = [
  { href: '/founder-review/wp3-5-a', label: 'Hôm nay', workspace: 'today' },
  { href: '/founder-review/quan-he', label: 'Quan hệ', workspace: 'relationships' },
  { href: '/founder-review/hanh-trinh', label: 'Hành trình', workspace: 'journeys' },
  { href: '/founder-review/cham-soc', label: 'Chăm sóc & Phục hồi', workspace: 'care' },
] as const;

const LOCKED_BANNER_TEXT =
  'Founder Review Preview — Dữ liệu mô phỏng. Mọi thay đổi chỉ tồn tại trong phiên xem hiện tại, không gửi, không lưu và không kết nối hệ thống thật.';

export interface FounderReviewShellProps {
  readonly title: string;
  readonly scenario: ScenarioPreset;
  readonly product?: ProductLensId;
  readonly currentPathname: string;
  readonly workspace?: AssistantWorkspace;
  readonly relationshipId?: RelationshipId | null;
  readonly journeyId?: JourneyId | null;
  readonly careId?: CareId | null;
  readonly showProductLens?: boolean;
  readonly children: ReactNode;
}

export default function FounderReviewShell(props: FounderReviewShellProps) {
  return (
    <ReviewPreferencesProvider>
      <ReviewStateProvider>
        <FounderReviewShellInner {...props} product={props.product ?? 'all'} />
      </ReviewStateProvider>
    </ReviewPreferencesProvider>
  );
}

function FounderReviewShellInner({
  title,
  scenario,
  product = 'all',
  currentPathname,
  workspace = 'today',
  relationshipId = null,
  journeyId = null,
  careId = null,
  showProductLens = true,
  children,
}: FounderReviewShellProps) {
  const resetHref = { pathname: currentPathname, query: buildSafeSyntheticQuery({ scenario }) };
  const [aiOpen, setAiOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className={styles.console}>
      <Head>
        <title>{`${title} · Founder Review Preview`}</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerTop}>
            <span className={styles.brand}>Founder Operating Console</span>
            <div className={styles.contextMeta}>
              <span>Scenario: {scenario}</span>
              <span className={styles.syntheticPill}>Synthetic · Read-only</span>
            </div>
            <div className={styles.utility}>
              <button type="button" onClick={() => setAiOpen(true)} data-testid="open-ai-assistant">AI Trợ lý</button>
              <button type="button" onClick={() => setSettingsOpen(true)} data-testid="open-session-settings">Thiết lập phiên</button>
              <Link href={resetHref}>Đặt lại</Link>
            </div>
          </div>
          <nav className={styles.nav} aria-label="Điều hướng Founder Review Preview">
            {NAV_ITEMS.map((item) => {
              const active = currentPathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={{ pathname: item.href, query: buildSafeSyntheticQuery({ scenario, product }) }}
                  aria-current={active ? 'page' : undefined}
                  className={active ? styles.navActive : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <div className={styles.bannerWrap}><p className={styles.banner}>{LOCKED_BANNER_TEXT}</p></div>

      <main className={styles.content}>
        <p className={styles.eyebrow}>Founder Review · Operational Clarity</p>
        <h1 className={styles.pageHeading}>{title}</h1>
        <p className={styles.pageLead}>Nhìn việc cần làm, lý do cần làm và bước hợp lệ tiếp theo — không phải tự diễn giải từ một bảng dữ liệu dài.</p>
        {showProductLens && (
          <ProductLens
            scenario={scenario}
            product={product}
            pathname={currentPathname}
            preserve={{ relationship: relationshipId, journey: journeyId, care: careId }}
          />
        )}
        {children}
      </main>

      {aiOpen && (
        <AIAssistantPanel
          scenario={scenario}
          product={product}
          workspace={workspace}
          relationshipId={relationshipId}
          journeyId={journeyId}
          careId={careId}
          onClose={() => setAiOpen(false)}
        />
      )}
      {settingsOpen && (
        <SessionSettingsPanel
          scenario={scenario}
          product={product}
          currentPathname={currentPathname}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </div>
  );
}

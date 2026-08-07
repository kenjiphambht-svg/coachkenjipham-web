// ============================================================
// Component tests for the WP3.5-A2 clarity milestone: AI Trợ lý, Thiết lập
// phiên, ReviewPreferencesContext, and the shared FounderReviewShell
// utility bar that hosts both across all four workspaces.
//
// Same constraint as the other Founder Review component tests: no
// jsdom/happy-dom is installed and this milestone adds no dependency, so
// these render with react-dom/server's renderToStaticMarkup (no DOM
// needed) and exercise the pure `reviewPreferencesReducer` directly for
// interaction behavior.
// ============================================================

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { RELATIONSHIP_IDS, DOOR_IDS } from '@/lib/wp3-5/review-manifest';
import { getTodayItemsForScenario, getDoorBlockers } from '@/lib/wp3-5/review-selectors';

import AIAssistantPanel from './AIAssistantPanel';
import SessionSettingsPanel from './SessionSettingsPanel';
import FounderReviewShell from './FounderReviewShell';
import TodayReview from './TodayReview';
import RelationshipReview from './RelationshipReview';
import JourneyReview from './JourneyReview';
import CareReview from './CareReview';
import { ReviewStateProvider } from './ReviewStateContext';
import {
  ReviewPreferencesProvider,
  reviewPreferencesReducer,
  DEFAULT_REVIEW_PREFERENCES,
  type ReviewPreferencesState,
} from './SessionPreferencesContext';
import { Badge } from './founder-review-ui';

function renderPanel(node: React.ReactNode): string {
  return renderToStaticMarkup(
    <ReviewPreferencesProvider>
      <ReviewStateProvider>{node}</ReviewStateProvider>
    </ReviewPreferencesProvider>
  );
}

// ---------------------------------------------------------------------------
// AI Trợ lý
// ---------------------------------------------------------------------------

describe('AI Trợ lý — visible content and safety disclosure', () => {
  it('always shows the Preview/synthetic disclaimer', () => {
    const html = renderPanel(<AIAssistantPanel scenario="peak" onClose={() => undefined} />);
    expect(html).toContain('Không gửi');
    expect(html).toContain('Không lưu');
    expect(html).toContain('Không gọi mô hình AI thật');
  });

  it('the summary line matches the same selectors Hôm nay uses (peak = 18 items)', () => {
    const html = renderPanel(<AIAssistantPanel scenario="peak" onClose={() => undefined} />);
    const todayCount = getTodayItemsForScenario('peak').length;
    expect(todayCount).toBe(18);
    expect(html).toContain(`${todayCount} việc trong Hôm nay`);
  });

  it('lists Cánh cửa đủ điều kiện exactly matching the derived eligibility selector', () => {
    const html = renderPanel(<AIAssistantPanel scenario="peak" onClose={() => undefined} />);
    const eligible = DOOR_IDS.filter((id) => getDoorBlockers(id)?.eligible);
    for (const id of eligible) {
      expect(html).toContain(`data-testid="ai-eligible-doors"`);
      expect(html).toContain(id);
    }
  });

  it('is deterministic — two renders with the same scenario produce identical output', () => {
    const a = renderPanel(<AIAssistantPanel scenario="peak" onClose={() => undefined} />);
    const b = renderPanel(<AIAssistantPanel scenario="peak" onClose={() => undefined} />);
    expect(a).toBe(b);
  });

  it('links only use approved synthetic query parameters and preserve scenario', () => {
    const html = renderPanel(<AIAssistantPanel scenario="recovery" onClose={() => undefined} />);
    const hrefs = [...html.matchAll(/href="([^"]*\/founder-review\/[^"]*)"/g)].map((m) =>
      m[1].replace(/&amp;/g, '&')
    );
    expect(hrefs.length).toBeGreaterThan(0);
    for (const href of hrefs) {
      const [, qs] = href.split('?');
      const query = new URLSearchParams(qs ?? '');
      for (const key of query.keys()) {
        expect(['scenario', 'relationship', 'journey', 'care']).toContain(key);
      }
      expect(query.get('scenario')).toBe('recovery');
    }
  });

  it('does not invent facts, score, or infer psychology — no forbidden language', () => {
    const html = renderPanel(<AIAssistantPanel scenario="peak" onClose={() => undefined} />);
    expect(/\bscore\b/i.test(html)).toBe(false);
    expect(/probability/i.test(html)).toBe(false);
    expect(/\bprofile\b/i.test(html)).toBe(false);
    expect(/diagnosis|psychological/i.test(html)).toBe(false);
  });

  it('never mutates canonical universe data (relationship list unaffected by rendering the panel)', () => {
    const before = [...RELATIONSHIP_IDS];
    renderPanel(<AIAssistantPanel scenario="peak" onClose={() => undefined} />);
    expect([...RELATIONSHIP_IDS]).toEqual(before);
  });
});

// ---------------------------------------------------------------------------
// Thiết lập phiên — pure reducer behavior
// ---------------------------------------------------------------------------

describe('Thiết lập phiên — reviewPreferencesReducer is pure and immutable', () => {
  it('SET_DENSITY only changes density', () => {
    const before: ReviewPreferencesState = DEFAULT_REVIEW_PREFERENCES;
    const after = reviewPreferencesReducer(before, { type: 'SET_DENSITY', density: 'compact' });
    expect(before).toEqual(DEFAULT_REVIEW_PREFERENCES); // input untouched
    expect(after).toEqual({ ...DEFAULT_REVIEW_PREFERENCES, density: 'compact' });
  });

  it('each toggle flips exactly its own field', () => {
    let state = DEFAULT_REVIEW_PREFERENCES;
    state = reviewPreferencesReducer(state, { type: 'TOGGLE_SUMMARY_METRICS' });
    expect(state.showSummaryMetrics).toBe(false);
    expect(state.bucketsExpandedByDefault).toBe(DEFAULT_REVIEW_PREFERENCES.bucketsExpandedByDefault);

    state = reviewPreferencesReducer(state, { type: 'TOGGLE_BUCKETS_EXPANDED' });
    expect(state.bucketsExpandedByDefault).toBe(false);

    state = reviewPreferencesReducer(state, { type: 'TOGGLE_GUIDANCE_TEXT' });
    expect(state.showGuidanceText).toBe(false);
  });

  it('RESET returns exactly the default preferences', () => {
    let state = DEFAULT_REVIEW_PREFERENCES;
    state = reviewPreferencesReducer(state, { type: 'SET_DENSITY', density: 'compact' });
    state = reviewPreferencesReducer(state, { type: 'TOGGLE_SUMMARY_METRICS' });
    expect(state).not.toEqual(DEFAULT_REVIEW_PREFERENCES);

    const reset = reviewPreferencesReducer(state, { type: 'RESET' });
    expect(reset).toEqual(DEFAULT_REVIEW_PREFERENCES);
    expect(reset).toBe(DEFAULT_REVIEW_PREFERENCES);
  });
});

describe('Thiết lập phiên — panel renders the documented local-only controls', () => {
  it('shows scenario, density, display toggles and both reset actions', () => {
    const html = renderPanel(
      <SessionSettingsPanel scenario="normal" currentPathname="/founder-review/wp3-5-a" onClose={() => undefined} />
    );
    for (const preset of ['quiet', 'normal', 'peak', 'recovery']) {
      expect(html).toContain(`data-testid="settings-scenario-${preset}"`);
    }
    expect(html).toContain('data-testid="settings-density-comfortable"');
    expect(html).toContain('data-testid="settings-density-compact"');
    expect(html).toContain('data-testid="settings-toggle-metrics"');
    expect(html).toContain('data-testid="settings-toggle-buckets"');
    expect(html).toContain('data-testid="settings-toggle-guidance"');
    expect(html).toContain('data-testid="settings-reset-simulated"');
    expect(html).toContain('data-testid="settings-reset-session"');
  });

  it('discloses that settings are local-only, no persistence', () => {
    const html = renderPanel(
      <SessionSettingsPanel scenario="normal" currentPathname="/founder-review/wp3-5-a" onClose={() => undefined} />
    );
    expect(html).toContain('Tải lại trang sẽ trở về mặc định');
  });
});

// ---------------------------------------------------------------------------
// Visible from all four workspaces
// ---------------------------------------------------------------------------

describe('AI Trợ lý and Thiết lập are visible from all four workspaces', () => {
  const cases: Array<{ title: string; path: string; body: React.ReactNode }> = [
    { title: 'Hôm nay', path: '/founder-review/wp3-5-a', body: <TodayReview initialScenario="peak" /> },
    { title: 'Quan hệ', path: '/founder-review/quan-he', body: <RelationshipReview scenario="peak" /> },
    { title: 'Hành trình', path: '/founder-review/hanh-trinh', body: <JourneyReview scenario="peak" /> },
    { title: 'Chăm sóc & Phục hồi', path: '/founder-review/cham-soc', body: <CareReview scenario="peak" /> },
  ];

  for (const { title, path, body } of cases) {
    it(`${title} — utility bar shows both entry points and the workspace nav item is active`, () => {
      const html = renderToStaticMarkup(
        <FounderReviewShell title={title} scenario="peak" currentPathname={path}>
          {body}
        </FounderReviewShell>
      );
      expect(html).toContain('data-testid="open-ai-assistant"');
      expect(html).toContain('data-testid="open-session-settings"');
      expect(html).toContain('aria-current="page"');
    });
  }
});

// ---------------------------------------------------------------------------
// Shared badge primitive — used for the blocked / Founder / eligible states
// ---------------------------------------------------------------------------

describe('Badge — state variants are visually distinct without excessive color', () => {
  it('blocked uses a solid dark fill; eligible and neutral stay quiet', () => {
    const blocked = renderToStaticMarkup(<Badge variant="blocked">Đang bị chặn</Badge>);
    const eligible = renderToStaticMarkup(<Badge variant="eligible">Đủ điều kiện</Badge>);
    expect(blocked).toContain('bg-e26-black');
    expect(eligible).not.toContain('bg-e26-black');
  });
});

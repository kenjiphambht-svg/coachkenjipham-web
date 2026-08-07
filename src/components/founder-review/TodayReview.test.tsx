// ============================================================
// Component tests for TodayReview / ReviewItemDrawer / ReviewStateContext.
//
// This repo has no jsdom/happy-dom installed (vitest.config.mts runs the
// `node` environment) and this task must not add a dependency. So these
// tests render with `react-dom/server`'s `renderToStaticMarkup` — which
// needs no DOM — and assert on the resulting HTML string for structure,
// and call the exported pure `reviewOverlayReducer` directly (no render at
// all) for the local-overlay interaction behavior. Real click-driven DOM
// interaction is exercised manually per the C3 manual QA step, not here.
// ============================================================

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
// `React` in scope is required because this file writes JSX directly and
// this repo's vitest.config.mts has no @vitejs/plugin-react (Vitest's
// esbuild JSX transform falls back to classic mode without it).
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { PRIORITY_BUCKETS, TODAY_QUEUE_MANIFEST, TODAY_QUEUE_IDS } from '@/lib/wp3-5/review-manifest';
import { SCENARIO_PRESET_ITEMS, SCENARIO_PRESETS } from '@/lib/wp3-5/review-universe';

import TodayReview, { type TodayReviewProps } from './TodayReview';
import ReviewItemDrawer from './ReviewItemDrawer';
import FounderReviewShell from './FounderReviewShell';
import {
  ReviewStateProvider,
  reviewOverlayReducer,
  INITIAL_REVIEW_OVERLAY_STATE,
  type ReviewOverlayState,
} from './ReviewStateContext';
import { ReviewPreferencesProvider } from './SessionPreferencesContext';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * WP3.5-A2 clarity milestone: ReviewStateProvider and ReviewPreferencesProvider
 * now live in FounderReviewShell (shared across all four workspaces, reachable
 * from AI Trợ lý and Thiết lập phiên), so TodayReview only *consumes* them.
 * Tests that render TodayReview standalone (not wrapped in the Shell) supply
 * both providers directly through this helper.
 */
function renderToday(props: TodayReviewProps): string {
  return renderToStaticMarkup(
    <ReviewPreferencesProvider>
      <ReviewStateProvider>
        <TodayReview {...props} />
      </ReviewStateProvider>
    </ReviewPreferencesProvider>
  );
}

function bucketOrderIn(html: string): string[] {
  // renderToStaticMarkup HTML-escapes attribute values (e.g. "&" -> "&amp;");
  // unescape before comparing against PRIORITY_BUCKETS' literal "&". The
  // negative lookahead excludes the sibling `bucket-toggle-<bucket>` testid
  // (the WP3.5-A2 clarity milestone's expand/collapse control), which would
  // otherwise also match the `bucket-` prefix.
  const matches = [...html.matchAll(/data-testid="bucket-(?!toggle-)([^"]+)"/g)];
  return matches.map((m) => m[1].replace(/&amp;/g, '&'));
}

function itemIdsIn(html: string): string[] {
  const matches = [...html.matchAll(/data-item-ids="([^"]+)"/g)];
  return matches.flatMap((m) => m[1].split(',').filter(Boolean));
}

// ---------------------------------------------------------------------------
// 1. Six buckets render in locked order
// ---------------------------------------------------------------------------

describe('1. Six buckets render in locked order', () => {
  it('peak scenario renders all six bucket sections in the locked order', () => {
    const html = renderToday({ initialScenario: 'peak' });
    expect(bucketOrderIn(html)).toEqual([...PRIORITY_BUCKETS]);
  });
});

// ---------------------------------------------------------------------------
// 2. Peak shows 18 items, exactly 3 per bucket
// ---------------------------------------------------------------------------

describe('2. Peak shows 18 items, exactly 3 per bucket', () => {
  it('holds', () => {
    const html = renderToday({ initialScenario: 'peak' });
    const ids = itemIdsIn(html);
    expect(ids).toHaveLength(18);
    expect([...ids].sort()).toEqual([...TODAY_QUEUE_IDS].sort());

    for (const bucket of PRIORITY_BUCKETS) {
      const count = ids.filter((id) => TODAY_QUEUE_MANIFEST[id].priorityBucket === bucket).length;
      expect(count).toBe(3);
    }
  });
});

// ---------------------------------------------------------------------------
// 3. Scenario filter changes visible items deterministically
// ---------------------------------------------------------------------------

describe('3. Scenario filter changes visible items deterministically', () => {
  it('each scenario renders exactly its locked item set, and repeated renders agree', () => {
    for (const scenario of SCENARIO_PRESETS) {
      const htmlA = renderToday({ initialScenario: scenario });
      const htmlB = renderToday({ initialScenario: scenario });
      expect([...itemIdsIn(htmlA)].sort()).toEqual([...SCENARIO_PRESET_ITEMS[scenario]].slice().sort());
      expect(itemIdsIn(htmlA)).toEqual(itemIdsIn(htmlB));
    }
  });
});

// ---------------------------------------------------------------------------
// 4. Safety & Recovery appears before Next Door
// ---------------------------------------------------------------------------

describe('4. Safety & Recovery appears before Next Door', () => {
  it('in the rendered bucket order', () => {
    const html = renderToday({ initialScenario: 'peak' });
    const order = bucketOrderIn(html);
    expect(order.indexOf('Safety & Recovery')).toBeLessThan(order.indexOf('Next Door Review'));
  });
});

// ---------------------------------------------------------------------------
// 5. Q-017 shows no Door proposal
// ---------------------------------------------------------------------------

describe('5. Q-017 shows no Door proposal', () => {
  it('the collapsed bucket metadata still flags that Q-017 has no formal Door proposal', () => {
    const html = renderToday({ initialScenario: 'peak' });
    expect(html).toMatch(/data-no-door-ids="[^"]*Q-017[^"]*"/);
  });

  it('the drawer for Q-017 explicitly says there is no formal Door proposal', () => {
    const html = renderToStaticMarkup(
      <ReviewStateProvider>
        <ReviewItemDrawer todayId="Q-017" scenario="peak" onClose={() => undefined} />
      </ReviewStateProvider>
    );
    expect(html).toContain('Chưa có đề xuất Cánh cửa tiếp theo chính thức.');
  });
});

// ---------------------------------------------------------------------------
// 6-7. SYN-002 / SYN-016 duplicate queue items remain separate
// ---------------------------------------------------------------------------

describe('6. SYN-002 duplicate queue items remain separate', () => {
  it('Q-003 and Q-007 both render as distinct cards tagged with SYN-002', () => {
    const html = renderToday({ initialScenario: 'peak' });
    expect(html).toContain('data-testid="today-item-Q-003" data-relationship="SYN-002"');
    expect(html).toContain('data-testid="today-item-Q-007" data-relationship="SYN-002"');
  });
});

describe('7. SYN-016 duplicate queue items remain separate', () => {
  it('Q-015 and Q-018 both render as distinct cards tagged with SYN-016', () => {
    const html = renderToday({ initialScenario: 'peak' });
    expect(itemIdsIn(html)).toContain('Q-015');
    expect(itemIdsIn(html)).toContain('Q-018');
    expect(TODAY_QUEUE_MANIFEST['Q-015'].relationshipId).toBe('SYN-016');
    expect(TODAY_QUEUE_MANIFEST['Q-018'].relationshipId).toBe('SYN-016');
  });
});

// ---------------------------------------------------------------------------
// 8. Opening a Today item shows canonical Relationship context
// ---------------------------------------------------------------------------

describe('8. Opening a Today item shows canonical Relationship context', () => {
  it('ReviewItemDrawer for Q-003 shows SYN-002 / Bình', () => {
    const html = renderToStaticMarkup(
      <ReviewStateProvider>
        <ReviewItemDrawer todayId="Q-003" scenario="peak" onClose={() => undefined} />
      </ReviewStateProvider>
    );
    expect(html).toContain('Bình');
    expect(html).toContain('SYN-002');
  });
});

// ---------------------------------------------------------------------------
// 9. Link to Quan hệ contains only approved query parameters
// ---------------------------------------------------------------------------

describe('9. Link to Quan hệ contains only approved query parameters', () => {
  it('the drawer’s "Mở Quan hệ" href only contains scenario and relationship', () => {
    const html = renderToStaticMarkup(
      <ReviewStateProvider>
        <ReviewItemDrawer todayId="Q-003" scenario="peak" onClose={() => undefined} />
      </ReviewStateProvider>
    );
    const match = html.match(/href="(\/founder-review\/quan-he\?[^"]*)"/);
    expect(match).not.toBeNull();
    const href = match![1].replace(/&amp;/g, '&');
    const query = new URLSearchParams(href.split('?')[1]);
    expect([...query.keys()].sort()).toEqual(['relationship', 'scenario']);
    expect(query.get('scenario')).toBe('peak');
    expect(query.get('relationship')).toBe('SYN-002');
  });
});

// ---------------------------------------------------------------------------
// 14. Door blockers are displayed from derived logic
// ---------------------------------------------------------------------------

describe('14. Door blockers are displayed from derived logic', () => {
  it('the drawer for an eligible door (Q-016 / DOOR-001) and a blocked one (Q-018 / DOOR-006) differ', () => {
    const eligibleHtml = renderToStaticMarkup(
      <ReviewStateProvider>
        <ReviewItemDrawer todayId="Q-016" scenario="peak" onClose={() => undefined} />
      </ReviewStateProvider>
    );
    const blockedHtml = renderToStaticMarkup(
      <ReviewStateProvider>
        <ReviewItemDrawer todayId="Q-018" scenario="peak" onClose={() => undefined} />
      </ReviewStateProvider>
    );
    expect(eligibleHtml).toContain('Không bị chặn');
    expect(blockedHtml).toContain('Đang bị chặn');
  });
});

// ---------------------------------------------------------------------------
// 15-16. Local overlay interaction, tested against the pure reducer directly
// ---------------------------------------------------------------------------

describe('15. Simulated actions update only local overlay state', () => {
  it('APPLY_ACTION only ever adds an entry keyed by the acted-on item id, immutably', () => {
    const before: ReviewOverlayState = INITIAL_REVIEW_OVERLAY_STATE;
    const after = reviewOverlayReducer(before, { type: 'APPLY_ACTION', itemId: 'Q-003', action: 'mark_reviewed' });
    expect(before).toEqual(INITIAL_REVIEW_OVERLAY_STATE); // input never mutated
    expect(after).not.toBe(before);
    expect(after['Q-003']).toEqual({ actions: ['mark_reviewed'], lastAction: 'mark_reviewed' });
    expect(Object.keys(after)).toEqual(['Q-003']);

    const after2 = reviewOverlayReducer(after, { type: 'APPLY_ACTION', itemId: 'Q-003', action: 'defer' });
    expect(after2['Q-003']).toEqual({ actions: ['mark_reviewed', 'defer'], lastAction: 'defer' });
    expect(after).not.toBe(after2); // still immutable, previous snapshot untouched
    expect(after['Q-003']).toEqual({ actions: ['mark_reviewed'], lastAction: 'mark_reviewed' });
  });
});

describe('16. Reset removes simulated changes', () => {
  it('RESET returns exactly the initial (empty) overlay state', () => {
    let state: ReviewOverlayState = INITIAL_REVIEW_OVERLAY_STATE;
    state = reviewOverlayReducer(state, { type: 'APPLY_ACTION', itemId: 'Q-003', action: 'mark_reviewed' });
    state = reviewOverlayReducer(state, { type: 'APPLY_ACTION', itemId: 'Q-016', action: 'defer' });
    expect(Object.keys(state)).toHaveLength(2);

    const reset = reviewOverlayReducer(state, { type: 'RESET' });
    expect(reset).toEqual(INITIAL_REVIEW_OVERLAY_STATE);
    expect(reset).toBe(INITIAL_REVIEW_OVERLAY_STATE);
  });
});

// ---------------------------------------------------------------------------
// 17-18. No persistence API, no network write — source scan
// ---------------------------------------------------------------------------

function stripComments(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
}

const FILES_TO_SCAN = [
  'TodayReview.tsx',
  'ReviewItemDrawer.tsx',
  'ReviewFilters.tsx',
  'ReviewStateContext.tsx',
  'FounderReviewShell.tsx',
  'FounderReviewPlaceholder.tsx',
  'RelationshipReview.tsx',
  'JourneyReview.tsx',
  'CareReview.tsx',
  'founder-review-ui.tsx',
  'SessionPreferencesContext.tsx',
  'AIAssistantPanel.tsx',
  'SessionSettingsPanel.tsx',
  'ProductLens.tsx',
  'CustomerRoomPreview.tsx',
];

describe('17. No persistence API is used', () => {
  it('scans every founder-review component for actual storage API calls', () => {
    // Requires real usage syntax (a following `.` or `[`), not just the bare
    // word — SessionSettingsPanel.tsx's own disclosure text tells the
    // Founder "Không dùng localStorage, cookie..." in plain prose, which a
    // bare-word scan would false-positive on exactly like it's trying to
    // detect the *absence* of.
    for (const file of FILES_TO_SCAN) {
      const source = stripComments(readFileSync(join(__dirname, file), 'utf-8'));
      expect(/\blocalStorage\s*[.[]/.test(source)).toBe(false);
      expect(/\bsessionStorage\s*[.[]/.test(source)).toBe(false);
      expect(/\bindexedDB\s*[.[]/i.test(source)).toBe(false);
      expect(/document\.cookie/.test(source)).toBe(false);
    }
  });
});

describe('18. No network write occurs', () => {
  it('scans every founder-review component for network APIs', () => {
    for (const file of FILES_TO_SCAN) {
      const source = stripComments(readFileSync(join(__dirname, file), 'utf-8'));
      expect(/\bfetch\(/.test(source)).toBe(false);
      expect(/XMLHttpRequest/.test(source)).toBe(false);
      expect(/axios/i.test(source)).toBe(false);
    }
  });
});

// ---------------------------------------------------------------------------
// 19. No score/probability/profile language
// ---------------------------------------------------------------------------

describe('19. No score/probability/profile language appears', () => {
  it('neither the rendered peak screen nor the source files use score/probability/profile wording', () => {
    const html = renderToday({ initialScenario: 'peak' });
    expect(/score/i.test(html)).toBe(false);
    expect(/probability/i.test(html)).toBe(false);
    expect(/profile/i.test(html)).toBe(false);

    for (const file of FILES_TO_SCAN) {
      const source = stripComments(readFileSync(join(__dirname, file), 'utf-8'));
      expect(/\bscore\b/i.test(source)).toBe(false);
      expect(/probability/i.test(source)).toBe(false);
      expect(/\bprofile\b/i.test(source)).toBe(false);
    }
  });
});

// ---------------------------------------------------------------------------
// 20. Locked preview banner remains visible
// ---------------------------------------------------------------------------

describe('20. Locked preview banner remains visible', () => {
  it('renders on the Hôm nay screen wrapped in FounderReviewShell', () => {
    const html = renderToStaticMarkup(
      <FounderReviewShell title="Hôm nay" scenario="peak" currentPathname="/founder-review/wp3-5-a">
        <TodayReview initialScenario="peak" />
      </FounderReviewShell>
    );
    expect(html).toContain(
      'Founder Review Preview — Dữ liệu mô phỏng. Mọi thay đổi chỉ tồn tại trong phiên xem hiện tại, không gửi, không lưu và không kết nối hệ thống thật.'
    );
  });
});

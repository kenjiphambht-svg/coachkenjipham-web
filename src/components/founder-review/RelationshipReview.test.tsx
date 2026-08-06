// ============================================================
// Component tests for RelationshipReview.
//
// Same constraint as TodayReview.test.tsx: no jsdom/happy-dom installed, so
// these render with `react-dom/server`'s `renderToStaticMarkup` and assert
// on the resulting HTML string. Real click-driven directory selection is
// exercised manually per the C3 manual QA step.
// ============================================================

// `React` in scope is required because this file writes JSX directly and
// this repo's vitest.config.mts has no @vitejs/plugin-react (Vitest's
// esbuild JSX transform falls back to classic mode without it).
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { RELATIONSHIP_IDS, JOURNEY_OWNERSHIP } from '@/lib/wp3-5/review-manifest';

import RelationshipReview from './RelationshipReview';

function relationshipCardIdsIn(html: string): string[] {
  const matches = [...html.matchAll(/data-testid="relationship-card-([^"]+)"/g)];
  return matches.map((m) => m[1]);
}

// ---------------------------------------------------------------------------
// 10. All 16 Relationships render
// ---------------------------------------------------------------------------

describe('10. All 16 Relationships render', () => {
  it('the directory lists all 16 canonical Relationship ids', () => {
    const html = renderToStaticMarkup(<RelationshipReview scenario="peak" />);
    const ids = relationshipCardIdsIn(html);
    expect(ids).toHaveLength(16);
    expect([...ids].sort()).toEqual([...RELATIONSHIP_IDS].sort());
  });
});

// ---------------------------------------------------------------------------
// 11. Valid relationship query opens the correct record
// ---------------------------------------------------------------------------

describe('11. Valid relationship query opens the correct record', () => {
  it('initialRelationshipId=SYN-002 renders the SYN-002 detail panel', () => {
    const html = renderToStaticMarkup(<RelationshipReview scenario="peak" initialRelationshipId="SYN-002" />);
    expect(html).toContain('data-testid="relationship-detail-SYN-002"');
    expect(html).toContain('Bình');
    expect(html).not.toContain('data-testid="relationship-no-selection"');
  });
});

// ---------------------------------------------------------------------------
// 12. Invalid relationship query does not open unrelated data
// ---------------------------------------------------------------------------

describe('12. Invalid relationship query does not open unrelated data', () => {
  it('a null initialRelationshipId (what an invalid query resolves to) shows the plain directory, no detail panel', () => {
    const html = renderToStaticMarkup(<RelationshipReview scenario="peak" initialRelationshipId={null} />);
    expect(html).toContain('data-testid="relationship-no-selection"');
    for (const id of RELATIONSHIP_IDS) {
      expect(html).not.toContain(`data-testid="relationship-detail-${id}"`);
    }
    // The directory itself is still the full, un-filtered 16 — invalid input is not reflected anywhere.
    expect(relationshipCardIdsIn(html)).toHaveLength(16);
  });
});

// ---------------------------------------------------------------------------
// 13. Multiple Journeys remain distinct
// ---------------------------------------------------------------------------

describe('13. Multiple Journeys remain distinct', () => {
  it('SYN-002 (JRN-002, JRN-003) renders both journeys as separate blocks, not merged', () => {
    const html = renderToStaticMarkup(<RelationshipReview scenario="peak" initialRelationshipId="SYN-002" />);
    expect(html).toContain('data-testid="journey-JRN-002"');
    expect(html).toContain('data-testid="journey-JRN-003"');
    expect(JOURNEY_OWNERSHIP['JRN-002']).toBe('SYN-002');
    expect(JOURNEY_OWNERSHIP['JRN-003']).toBe('SYN-002');
  });

  it('SYN-016 (JRN-023, JRN-024) also renders both journeys distinctly', () => {
    const html = renderToStaticMarkup(<RelationshipReview scenario="peak" initialRelationshipId="SYN-016" />);
    expect(html).toContain('data-testid="journey-JRN-023"');
    expect(html).toContain('data-testid="journey-JRN-024"');
  });
});

// ---------------------------------------------------------------------------
// 14 (relationship-side). Door blockers displayed from derived logic
// ---------------------------------------------------------------------------

describe('14. Door blockers are displayed from derived logic (Quan hệ detail)', () => {
  it('SYN-006 (eligible DOOR-001) and SYN-016 (blocked DOOR-006, founder_deferred) differ', () => {
    const eligible = renderToStaticMarkup(<RelationshipReview scenario="peak" initialRelationshipId="SYN-006" />);
    const blocked = renderToStaticMarkup(<RelationshipReview scenario="peak" initialRelationshipId="SYN-016" />);
    expect(eligible).toContain('data-testid="door-status-SYN-006"');
    expect(eligible).toContain('Đủ điều kiện');
    expect(blocked).toContain('data-testid="door-status-SYN-016"');
    expect(blocked).toContain('Đang bị chặn');
  });
});

// ---------------------------------------------------------------------------
// Sensitive-field guard, matching the C3 privacy requirement
// ---------------------------------------------------------------------------

describe('No sensitive child fields, diagnosis, psychology or sales-signal language', () => {
  it('the rendered detail panel for every relationship stays clean', () => {
    for (const id of RELATIONSHIP_IDS) {
      const html = renderToStaticMarkup(<RelationshipReview scenario="peak" initialRelationshipId={id} />);
      expect(/diagnosis|psychological|school name|date of birth/i.test(html)).toBe(false);
      expect(/\bscore\b/i.test(html)).toBe(false);
      expect(/probability/i.test(html)).toBe(false);
    }
  });
});

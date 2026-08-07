// ============================================================
// Component tests for the Hành trình workspace.
//
// Same constraint as the other Founder Review component tests: no
// jsdom/happy-dom is installed and this milestone adds no dependency, so
// these render with react-dom/server's renderToStaticMarkup (no DOM needed)
// and assert on the resulting HTML string.
// ============================================================

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { JOURNEY_IDS, JOURNEY_OWNERSHIP, CARE_OWNERSHIP, DOOR_OWNERSHIP } from '@/lib/wp3-5/review-manifest';
import { JOURNEY_RECORDS } from '@/lib/wp3-5/review-universe';

import JourneyReview from './JourneyReview';

function journeyCardIdsIn(html: string): string[] {
  return [...html.matchAll(/data-testid="journey-card-([^"]+)"/g)].map((m) => m[1]);
}

describe('Hành trình — all 24 Journey instances render', () => {
  it('lists every canonical Journey id', () => {
    const html = renderToStaticMarkup(<JourneyReview scenario="peak" />);
    const ids = journeyCardIdsIn(html);
    expect(ids).toHaveLength(24);
    expect([...ids].sort()).toEqual([...JOURNEY_IDS].sort());
  });

  it('reports the count honestly', () => {
    const html = renderToStaticMarkup(<JourneyReview scenario="peak" />);
    expect(html).toContain('24/24 hành trình');
  });
});

describe('Hành trình — multiple Journeys under one Relationship stay distinct', () => {
  it('SYN-002 owns JRN-002 and JRN-003 as two separate cards', () => {
    const html = renderToStaticMarkup(<JourneyReview scenario="peak" />);
    expect(html).toContain('data-testid="journey-card-JRN-002" data-relationship="SYN-002"');
    expect(html).toContain('data-testid="journey-card-JRN-003" data-relationship="SYN-002"');
    expect(JOURNEY_OWNERSHIP['JRN-002']).toBe('SYN-002');
    expect(JOURNEY_OWNERSHIP['JRN-003']).toBe('SYN-002');
  });

  it('the detail panel says which of the sibling journeys is being viewed', () => {
    const html = renderToStaticMarkup(<JourneyReview scenario="peak" initialJourneyId="JRN-003" />);
    expect(html).toContain('1 trong 2 hành trình của Quan hệ này');
  });
});

describe('Hành trình — valid query opens the correct record', () => {
  it('initialJourneyId=JRN-003 opens JRN-003 and no other detail panel', () => {
    const html = renderToStaticMarkup(<JourneyReview scenario="peak" initialJourneyId="JRN-003" />);
    expect(html).toContain('data-testid="journey-detail-JRN-003"');
    expect(html).not.toContain('data-testid="journey-no-selection"');
    const otherDetails = JOURNEY_IDS.filter(
      (id) => id !== 'JRN-003' && html.includes(`data-testid="journey-detail-${id}"`)
    );
    expect(otherDetails).toEqual([]);
  });
});

describe('Hành trình — invalid query fails safely', () => {
  it('a null initialJourneyId (what an invalid ?journey= resolves to) shows the full directory, no detail', () => {
    const html = renderToStaticMarkup(<JourneyReview scenario="peak" initialJourneyId={null} />);
    expect(html).toContain('data-testid="journey-no-selection"');
    for (const id of JOURNEY_IDS) {
      expect(html).not.toContain(`data-testid="journey-detail-${id}"`);
    }
    expect(journeyCardIdsIn(html)).toHaveLength(24);
  });
});

describe('Hành trình — Now / Next / Owner / Due / Blocked', () => {
  it('shows all five for a blocked journey, including the blocker reason', () => {
    const html = renderToStaticMarkup(<JourneyReview scenario="peak" initialJourneyId="JRN-003" />);
    const rec = JOURNEY_RECORDS['JRN-003'];
    expect(rec.blocked).toBe(true);
    expect(html).toContain('Now:');
    expect(html).toContain('Next:');
    expect(html).toContain('Owner:');
    expect(html).toContain('Due:');
    expect(html).toContain('data-testid="journey-blocked-JRN-003"');
    expect(html).toContain('Blocked: Có');
  });

  it('shows Blocked: Không for an unblocked journey', () => {
    const html = renderToStaticMarkup(<JourneyReview scenario="peak" initialJourneyId="JRN-009" />);
    expect(JOURNEY_RECORDS['JRN-009'].blocked).toBe(false);
    expect(html).toContain('Blocked: Không');
  });
});

describe('Hành trình — linked Care, Promise, Timeline and Door context', () => {
  it('JRN-003 shows its canonical Care case, its Promise and its timeline', () => {
    const html = renderToStaticMarkup(<JourneyReview scenario="peak" initialJourneyId="JRN-003" />);
    expect(CARE_OWNERSHIP['CARE-001'].journeyId).toBe('JRN-003');
    expect(html).toContain('data-testid="journey-care-CARE-001"');
    expect(html).toContain('PROM-002');
    expect(html).toContain('Timeline của hành trình');
  });

  it('SYN-002 anchors DOOR-003 to JRN-002 (the closed Lặng), not to JRN-003 where its blockers live', () => {
    // Canonical manifest §B: DOOR-003 | SYN-002 | JRN-002. The blocking
    // promise/care sit on the sibling JRN-003, so the Door surfaces on
    // JRN-002 only — this split is canonical and must not be reconciled away.
    expect(DOOR_OWNERSHIP['DOOR-003'].journeyId).toBe('JRN-002');

    const onDoorJourney = renderToStaticMarkup(<JourneyReview scenario="peak" initialJourneyId="JRN-002" />);
    expect(onDoorJourney).toContain('data-testid="journey-door-JRN-002"');
    expect(onDoorJourney).toContain('DOOR-003');

    const onBlockerJourney = renderToStaticMarkup(<JourneyReview scenario="peak" initialJourneyId="JRN-003" />);
    expect(onBlockerJourney).toContain('Không có đề xuất Cánh cửa tiếp theo chính thức trên hành trình này.');
  });

  it('Door blockers are shown from derived logic, not stored truth', () => {
    const blocked = renderToStaticMarkup(<JourneyReview scenario="peak" initialJourneyId="JRN-002" />);
    expect(blocked).toContain('data-testid="journey-door-JRN-002"');
    expect(blocked).toContain('Đang bị chặn');
    expect(blocked).toContain('Còn lời hứa quá hạn chặn cánh cửa này.');

    const eligible = renderToStaticMarkup(<JourneyReview scenario="peak" initialJourneyId="JRN-009" />);
    expect(eligible).toContain('data-testid="journey-door-JRN-009"');
    expect(eligible).toContain('Đủ điều kiện');
  });

  it('a journey with no Door proposal says so plainly', () => {
    const html = renderToStaticMarkup(<JourneyReview scenario="peak" initialJourneyId="JRN-021" />);
    expect(html).toContain('Không có đề xuất Cánh cửa tiếp theo chính thức trên hành trình này.');
  });
});

describe('Hành trình — navigation back to the owning Relationship', () => {
  it('links to the correct SYN id using only approved query params, preserving scenario', () => {
    const html = renderToStaticMarkup(<JourneyReview scenario="recovery" initialJourneyId="JRN-003" />);
    expect(html).toContain('data-testid="journey-to-relationship-JRN-003"');
    const match = html.match(/href="(\/founder-review\/quan-he\?[^"]*)"/);
    expect(match).not.toBeNull();
    const query = new URLSearchParams(match![1].replace(/&amp;/g, '&').split('?')[1]);
    expect([...query.keys()].sort()).toEqual(['relationship', 'scenario']);
    expect(query.get('relationship')).toBe('SYN-002');
    expect(query.get('scenario')).toBe('recovery');
  });

  it('the Care cross-link carries only scenario + care', () => {
    const html = renderToStaticMarkup(<JourneyReview scenario="quiet" initialJourneyId="JRN-003" />);
    const match = html.match(/href="(\/founder-review\/cham-soc\?[^"]*)"/);
    expect(match).not.toBeNull();
    const query = new URLSearchParams(match![1].replace(/&amp;/g, '&').split('?')[1]);
    expect([...query.keys()].sort()).toEqual(['care', 'scenario']);
    expect(query.get('scenario')).toBe('quiet');
  });
});

describe('Hành trình — no forbidden language', () => {
  it('no score, probability or profile wording appears for any journey', () => {
    for (const id of JOURNEY_IDS) {
      const html = renderToStaticMarkup(<JourneyReview scenario="peak" initialJourneyId={id} />);
      expect(/\bscore\b/i.test(html)).toBe(false);
      expect(/probability/i.test(html)).toBe(false);
      expect(/\bprofile\b/i.test(html)).toBe(false);
      expect(/diagnosis|psychological/i.test(html)).toBe(false);
    }
  });
});

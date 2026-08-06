// ============================================================
// Component tests for the Chăm sóc & Phục hồi workspace.
//
// Rendered with react-dom/server's renderToStaticMarkup (no DOM needed),
// matching the other Founder Review component tests.
// ============================================================

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { CARE_IDS, CARE_OWNERSHIP } from '@/lib/wp3-5/review-manifest';
import { CARE_RECORDS } from '@/lib/wp3-5/review-universe';

import CareReview from './CareReview';

function careCardIdsIn(html: string): string[] {
  return [...html.matchAll(/data-testid="care-card-([^"]+)"/g)].map((m) => m[1]);
}

describe('Chăm sóc — all 14 cases render', () => {
  it('lists every canonical Care id across the queues', () => {
    const html = renderToStaticMarkup(<CareReview scenario="peak" />);
    const ids = careCardIdsIn(html);
    expect(ids).toHaveLength(14);
    expect([...ids].sort()).toEqual([...CARE_IDS].sort());
    expect(html).toContain('14/14 case');
  });
});

describe('Chăm sóc — active, silence and historical states are distinguished', () => {
  it('renders all three queues, each holding the right cases', () => {
    const html = renderToStaticMarkup(<CareReview scenario="peak" />);
    expect(html).toContain('data-testid="care-queue-active"');
    expect(html).toContain('data-testid="care-queue-silence"');
    expect(html).toContain('data-testid="care-queue-history"');

    // Closed cases belong to the history queue only.
    const closed = CARE_IDS.filter((id) => CARE_RECORDS[id].status === 'closed');
    expect(closed.length).toBeGreaterThan(0);
    const historySlice = html.slice(html.indexOf('data-testid="care-queue-history"'));
    for (const id of closed) {
      expect(historySlice).toContain(`data-testid="care-card-${id}"`);
    }
  });

  it('CARE-004 (Giang, 30-day quiet) sits in the deliberate-silence queue', () => {
    const html = renderToStaticMarkup(<CareReview scenario="peak" />);
    const silenceStart = html.indexOf('data-testid="care-queue-silence"');
    const historyStart = html.indexOf('data-testid="care-queue-history"');
    const silenceSlice = html.slice(silenceStart, historyStart > silenceStart ? historyStart : undefined);
    expect(silenceSlice).toContain('data-testid="care-card-CARE-004"');
  });
});

describe('Chăm sóc — Relationship and Journey ownership is canonical', () => {
  it('every card carries its canonical SYN and JRN ownership', () => {
    const html = renderToStaticMarkup(<CareReview scenario="peak" />);
    for (const id of CARE_IDS) {
      const own = CARE_OWNERSHIP[id];
      expect(html).toContain(
        `data-testid="care-card-${id}" data-relationship="${own.relationshipId}" data-journey="${own.journeyId}"`
      );
    }
  });
});

describe('Chăm sóc — owner, due, next action and blocker are visible', () => {
  it('the detail panel shows all four for CARE-001', () => {
    const html = renderToStaticMarkup(<CareReview scenario="peak" initialCareId="CARE-001" />);
    expect(html).toContain('data-testid="care-detail-CARE-001"');
    expect(html).toContain('Next action:');
    expect(html).toContain('Owner:');
    expect(html).toContain('Due:');
    expect(html).toContain('Điều kiện đóng:');
    expect(html).toContain('data-testid="care-offer-CARE-001"');
    expect(html).toContain('đang chặn');
  });
});

describe('Chăm sóc — Deliberate Silence is visibly valid', () => {
  it('CARE-004 states that keeping quiet is a valid action', () => {
    const html = renderToStaticMarkup(<CareReview scenario="peak" initialCareId="CARE-004" />);
    expect(html).toContain('data-testid="care-silence-CARE-004"');
    expect(html).toContain('Giữ yên là một hành động hợp lệ ở đây.');
  });
});

describe('Chăm sóc — Care and Recovery precede Offer', () => {
  it('impact/containment and next action render before the Next Door consequence', () => {
    const html = renderToStaticMarkup(<CareReview scenario="peak" initialCareId="CARE-001" />);
    const impactIdx = html.indexOf('Ảnh hưởng &amp; Containment');
    const nextActionIdx = html.indexOf('Next action:');
    const doorIdx = html.indexOf('Ảnh hưởng tới Cánh cửa tiếp theo');
    expect(impactIdx).toBeGreaterThan(-1);
    expect(doorIdx).toBeGreaterThan(-1);
    expect(impactIdx).toBeLessThan(doorIdx);
    expect(nextActionIdx).toBeLessThan(doorIdx);
  });

  it('Next Door stays Founder-reviewed only — no send or auto-approve control', () => {
    const html = renderToStaticMarkup(<CareReview scenario="peak" initialCareId="CARE-001" />);
    expect(html).toContain('Chỉ Founder xem xét — không tự gửi, không tự duyệt.');
    expect(/gửi cho khách|auto-send|tự động gửi/i.test(html)).toBe(false);
  });
});

describe('Chăm sóc — navigation to Relationship and Journey', () => {
  it('links carry only approved query params and preserve scenario', () => {
    const html = renderToStaticMarkup(<CareReview scenario="recovery" initialCareId="CARE-001" />);
    expect(html).toContain('data-testid="care-to-relationship-CARE-001"');
    expect(html).toContain('data-testid="care-to-journey-CARE-001"');

    const rel = html.match(/href="(\/founder-review\/quan-he\?[^"]*)"/);
    const relQuery = new URLSearchParams(rel![1].replace(/&amp;/g, '&').split('?')[1]);
    expect([...relQuery.keys()].sort()).toEqual(['relationship', 'scenario']);
    expect(relQuery.get('relationship')).toBe(CARE_OWNERSHIP['CARE-001'].relationshipId);
    expect(relQuery.get('scenario')).toBe('recovery');

    const jrn = html.match(/href="(\/founder-review\/hanh-trinh\?[^"]*)"/);
    const jrnQuery = new URLSearchParams(jrn![1].replace(/&amp;/g, '&').split('?')[1]);
    expect([...jrnQuery.keys()].sort()).toEqual(['journey', 'scenario']);
    expect(jrnQuery.get('journey')).toBe(CARE_OWNERSHIP['CARE-001'].journeyId);
    expect(jrnQuery.get('scenario')).toBe('recovery');
  });
});

describe('Chăm sóc — invalid query fails safely', () => {
  it('a null initialCareId shows the queues with no detail panel', () => {
    const html = renderToStaticMarkup(<CareReview scenario="peak" initialCareId={null} />);
    expect(html).toContain('data-testid="care-no-selection"');
    for (const id of CARE_IDS) {
      expect(html).not.toContain(`data-testid="care-detail-${id}"`);
    }
    expect(careCardIdsIn(html)).toHaveLength(14);
  });
});

describe('Chăm sóc — no forbidden language', () => {
  it('no score, probability, profile or diagnosis wording for any case', () => {
    for (const id of CARE_IDS) {
      const html = renderToStaticMarkup(<CareReview scenario="peak" initialCareId={id} />);
      expect(/\bscore\b/i.test(html)).toBe(false);
      expect(/probability/i.test(html)).toBe(false);
      expect(/\bprofile\b/i.test(html)).toBe(false);
      expect(/diagnosis|psychological/i.test(html)).toBe(false);
    }
  });
});

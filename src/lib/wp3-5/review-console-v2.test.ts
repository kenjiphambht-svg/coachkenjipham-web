import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import { JOURNEY_IDS, RELATIONSHIP_IDS, TODAY_QUEUE_MANIFEST } from './review-manifest';
import { JOURNEY_RECORDS } from './review-universe';
import {
  PRODUCT_LENS_OPTIONS,
  buildSafeSyntheticQuery,
  getActionFirstTodayItems,
  getTodayItemsForProduct,
  parseSyntheticQuery,
  relationshipMatchesProductLens,
} from './review-selectors';
import { READING_ROOM_FIXTURES, validateRoomFixtureBoundary } from './review-room-fixtures';
import {
  getMissingDecisionFacts,
  getProductContext,
  getReadingRoomStatus,
  getTodayPriorities,
} from './review-ai-tools';

describe('Founder Console V2 Product Lens', () => {
  it('derives exactly the product families present in canonical Journey truth', () => {
    const truth = [...new Set(JOURNEY_IDS.map((id) => JOURNEY_RECORDS[id].productLine))].sort();
    const options = PRODUCT_LENS_OPTIONS.map((option) => option.productLine).filter(Boolean).sort();
    expect(options).toEqual(truth);
    expect(PRODUCT_LENS_OPTIONS[0]).toEqual({ id: 'all', label: 'Tất cả', productLine: null });
  });

  it('filters Today and Relationship directories through Journey ownership only', () => {
    const lang = getTodayItemsForProduct('peak', 'lang');
    expect(lang.length).toBeGreaterThan(0);
    for (const id of lang) expect(JOURNEY_RECORDS[TODAY_QUEUE_MANIFEST[id].journeyId].productLine).toBe('Lặng');
    const readingRelationships = RELATIONSHIP_IDS.filter((id) => relationshipMatchesProductLens(id, 'reading-room'));
    expect(readingRelationships).toEqual(['SYN-003', 'SYN-004', 'SYN-013', 'SYN-016']);
  });

  it('accepts only enumerated Product Lens and Relationship tabs in URL state', () => {
    expect(parseSyntheticQuery({ scenario: 'peak', product: 'hat-mam', tab: 'room' })).toMatchObject({ product: 'hat-mam', tab: 'room' });
    expect(parseSyntheticQuery({ product: 'DROP TABLE', tab: '<script>' })).toMatchObject({ product: 'all', tab: undefined });
    expect(buildSafeSyntheticQuery({ scenario: 'peak', product: 'reading-room', relationship: 'SYN-003', tab: 'room' })).toEqual({ scenario: 'peak', product: 'reading-room', relationship: 'SYN-003', tab: 'room' });
  });
});

describe('presentation-only Customer Room boundary', () => {
  it('every fixture maps to existing synthetic Relationship/Journey/product and applicable entitlement truth', () => {
    for (const room of READING_ROOM_FIXTURES) expect(validateRoomFixtureBoundary(room)).toBe(true);
  });

  it('SYN-002 intentionally has no room while supported examples do', () => {
    expect(getReadingRoomStatus('SYN-002').data).toBeNull();
    expect(getReadingRoomStatus('SYN-003').data?.fixtureBoundary).toBe('presentation_only');
  });
});

describe('future-ready deterministic assistant tools', () => {
  const context = { scenario: 'peak', product: 'reading-room', workspace: 'today' } as const;

  it('returns deterministic action priorities with supporting synthetic IDs', () => {
    const expected = getActionFirstTodayItems('peak', 'reading-room');
    const first = getTodayPriorities(context);
    const second = getTodayPriorities(context);
    expect(first).toEqual(second);
    expect(first.data.map((item) => item.id)).toEqual(expected);
    expect(first.evidenceIds).toEqual(expected);
  });

  it('keeps tool outputs narrow and evidence-backed', () => {
    const product = getProductContext(context);
    expect(product.data.journeyIds.every((id) => JOURNEY_RECORDS[id].productLine === 'Reading Room')).toBe(true);
    const missing = getMissingDecisionFacts('SYN-002');
    expect(missing.evidenceIds).toContain('SYN-002');
    expect(missing.evidenceIds).toContain('PROM-002');
  });

  it('contains no provider, SDK, HTTP or secret dependency', () => {
    const source = readFileSync(new URL('./review-ai-tools.ts', import.meta.url), 'utf8');
    expect(source).not.toMatch(/@supabase|openai|anthropic|ai-sdk|\bfetch\(|axios|XMLHttpRequest|api[_-]?key/i);
  });
});

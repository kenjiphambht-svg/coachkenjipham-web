import { describe, expect, it } from 'vitest';

import {
  RELATIONSHIP_IDS,
  JOURNEY_IDS,
  JOURNEY_OWNERSHIP,
  CARE_IDS,
  TODAY_QUEUE_IDS,
  TODAY_QUEUE_MANIFEST,
  PRIORITY_BUCKETS,
  SCENARIO_PRESETS,
} from './review-manifest';

import { DOOR_RECORDS, JOURNEY_RECORDS, CARE_RECORDS } from './review-universe';

import {
  resolveScenario,
  getTodayItemsForScenario,
  sortTodayItemsByPriority,
  resolveRelationshipContext,
  resolveJourneyContext,
  resolveCareContext,
  findLinkedPromiseAndDoor,
  getTimelineEventsForRelationship,
  getJourneysForRelationship,
  getCareAndPromisesForJourney,
  getDoorBlockers,
  parseSyntheticQuery,
  buildSafeSyntheticQuery,
  buildScenarioOnlyQuery,
  DEFAULT_SCENARIO_PRESET,
} from './review-selectors';

// ---------------------------------------------------------------------------
// 1-2. Scenario defaulting
// ---------------------------------------------------------------------------

describe('1. normal is default', () => {
  it('resolveScenario(undefined) is normal', () => {
    expect(DEFAULT_SCENARIO_PRESET).toBe('normal');
    expect(resolveScenario(undefined)).toBe('normal');
  });
});

describe('2. invalid scenario defaults safely', () => {
  it('garbage, empty, numeric and array-shaped input all default to normal', () => {
    expect(resolveScenario('not-a-scenario')).toBe('normal');
    expect(resolveScenario('')).toBe('normal');
    expect(resolveScenario(42)).toBe('normal');
    expect(resolveScenario(null)).toBe('normal');
    expect(resolveScenario({})).toBe('normal');
    expect(resolveScenario('PEAK')).toBe('normal'); // case-sensitive, not fuzzy-matched
  });
});

// ---------------------------------------------------------------------------
// 3-4. Determinism and peak composition
// ---------------------------------------------------------------------------

describe('3. quiet, normal, peak and recovery are deterministic', () => {
  it('repeated calls return identical, non-random lists', () => {
    for (const scenario of SCENARIO_PRESETS) {
      const a = getTodayItemsForScenario(scenario);
      const b = getTodayItemsForScenario(scenario);
      expect(a).toEqual(b);
    }
  });
});

describe('4. peak returns all 18 Today items', () => {
  it('holds', () => {
    expect([...getTodayItemsForScenario('peak')].sort()).toEqual([...TODAY_QUEUE_IDS].sort());
  });
});

// ---------------------------------------------------------------------------
// 5-6. Bucket ordering
// ---------------------------------------------------------------------------

describe('5. six bucket ordering is locked', () => {
  it('sorting any subset respects the six locked buckets', () => {
    const sorted = sortTodayItemsByPriority([...TODAY_QUEUE_IDS].reverse());
    const buckets = sorted.map((id) => TODAY_QUEUE_MANIFEST[id].priorityBucket);
    const uniqueInOrder = [...new Set(buckets)];
    expect(uniqueInOrder).toEqual([...PRIORITY_BUCKETS]);
  });
});

describe('6. Safety & Recovery precedes Next Door', () => {
  it('in any sorted subset containing both buckets', () => {
    const sorted = sortTodayItemsByPriority([...TODAY_QUEUE_IDS]);
    const safetyIndex = sorted.findIndex((id) => TODAY_QUEUE_MANIFEST[id].priorityBucket === 'Safety & Recovery');
    const nextDoorIndex = sorted.findIndex((id) => TODAY_QUEUE_MANIFEST[id].priorityBucket === 'Next Door Review');
    expect(safetyIndex).toBeGreaterThanOrEqual(0);
    expect(nextDoorIndex).toBeGreaterThan(safetyIndex);
  });
});

// ---------------------------------------------------------------------------
// 7. Canonical resolution
// ---------------------------------------------------------------------------

describe('7. Relationship/Journey/Care resolution is canonical', () => {
  it('resolves to the exact same record the universe holds, for every id', () => {
    for (const rid of RELATIONSHIP_IDS) {
      expect(resolveRelationshipContext(rid)?.id).toBe(rid);
    }
    for (const jid of JOURNEY_IDS) {
      const rec = resolveJourneyContext(jid);
      expect(rec).toEqual(JOURNEY_RECORDS[jid]);
      expect(rec?.relationshipId).toBe(JOURNEY_OWNERSHIP[jid]);
    }
    for (const cid of CARE_IDS) {
      expect(resolveCareContext(cid)).toEqual(CARE_RECORDS[cid]);
    }
  });
});

// ---------------------------------------------------------------------------
// 8-11. Locked queue-ownership facts, reachable through the selector layer
// ---------------------------------------------------------------------------

describe('8. SYN-002 duplicate queue appearances remain correct', () => {
  it('Q-003 and Q-007 both resolve to SYN-002 through the selectors', () => {
    expect(resolveRelationshipContext(TODAY_QUEUE_MANIFEST['Q-003'].relationshipId)?.id).toBe('SYN-002');
    expect(resolveRelationshipContext(TODAY_QUEUE_MANIFEST['Q-007'].relationshipId)?.id).toBe('SYN-002');
  });
});

describe('9. SYN-016 duplicate queue appearances remain correct', () => {
  it('Q-015 and Q-018 both resolve to SYN-016 through the selectors', () => {
    expect(resolveRelationshipContext(TODAY_QUEUE_MANIFEST['Q-015'].relationshipId)?.id).toBe('SYN-016');
    expect(resolveRelationshipContext(TODAY_QUEUE_MANIFEST['Q-018'].relationshipId)?.id).toBe('SYN-016');
  });
});

describe('10. Q-010 belongs only to SYN-003', () => {
  it('holds through the selector layer', () => {
    expect(TODAY_QUEUE_MANIFEST['Q-010'].relationshipId).toBe('SYN-003');
    const owners = TODAY_QUEUE_IDS.filter((id) => TODAY_QUEUE_MANIFEST[id].relationshipId === 'SYN-003');
    expect(owners).toEqual(['Q-010']);
  });
});

describe('11. Q-017 has no Door', () => {
  it('findLinkedPromiseAndDoor returns no door for Q-017', () => {
    const linked = findLinkedPromiseAndDoor('Q-017');
    expect(linked.door).toBeUndefined();
    expect(linked.promise).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// 12. Invalid ids never produce unrelated records
// ---------------------------------------------------------------------------

describe('12. Invalid IDs never produce unrelated records', () => {
  it('every resolver safely returns undefined/empty for garbage input, never a wrong or coerced record', () => {
    expect(resolveRelationshipContext('SYN-999')).toBeUndefined();
    expect(resolveRelationshipContext('JRN-001')).toBeUndefined();
    expect(resolveRelationshipContext('')).toBeUndefined();
    expect(resolveRelationshipContext(undefined)).toBeUndefined();
    expect(resolveRelationshipContext(['SYN-001'])).toBeUndefined();

    expect(resolveJourneyContext('JRN-999')).toBeUndefined();
    expect(resolveJourneyContext('SYN-001')).toBeUndefined();

    expect(resolveCareContext('CARE-999')).toBeUndefined();
    expect(resolveCareContext('JRN-001')).toBeUndefined();

    expect(getJourneysForRelationship('SYN-999')).toEqual([]);
    expect(getJourneysForRelationship('not-an-id')).toEqual([]);

    expect(getCareAndPromisesForJourney('JRN-999')).toEqual({ care: [], promises: [] });

    expect(getTimelineEventsForRelationship('SYN-999')).toEqual([]);

    expect(getDoorBlockers('DOOR-999')).toBeUndefined();
    expect(getDoorBlockers('SYN-001')).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// 13. Safe query generation emits synthetic IDs only
// ---------------------------------------------------------------------------

describe('13. Safe query generation emits synthetic IDs only', () => {
  it('buildSafeSyntheticQuery drops anything not a canonical id and never reflects raw input', () => {
    const query = buildSafeSyntheticQuery({
      scenario: 'peak',
      relationship: 'SYN-003',
      journey: '<script>alert(1)</script>',
      care: 'CARE-002',
    });
    expect(query).toEqual({ scenario: 'peak', relationship: 'SYN-003', care: 'CARE-002' });
    expect(Object.keys(query).sort()).toEqual(['care', 'relationship', 'scenario']);
    expect(Object.values(query).join(' ')).not.toContain('<script>');
  });

  it('parseSyntheticQuery ignores unrecognized keys and array values, taking only the first element', () => {
    const parsed = parseSyntheticQuery({
      scenario: ['peak', 'quiet'],
      relationship: 'SYN-006',
      unrelatedKey: 'DROP TABLE users;',
      journey: 'not-a-real-journey',
    } as Record<string, string | readonly string[] | undefined>);
    expect(parsed.scenario).toBe('peak');
    expect(parsed.relationship).toBe('SYN-006');
    expect(parsed.journey).toBeUndefined();
    expect(parsed.care).toBeUndefined();
    expect(Object.keys(parsed)).not.toContain('unrelatedKey');
  });

  it('buildScenarioOnlyQuery for Reset phiên keeps only a validated scenario', () => {
    expect(buildScenarioOnlyQuery('recovery')).toEqual({ scenario: 'recovery' });
    expect(buildScenarioOnlyQuery('garbage')).toEqual({ scenario: 'normal' });
  });
});

// ---------------------------------------------------------------------------
// 14. Door blockers remain derived rather than mutated
// ---------------------------------------------------------------------------

describe('14. Door blockers remain derived rather than mutated', () => {
  it('getDoorBlockers delegates to the existing pure logic and DOOR_RECORDS carries no stored offerBlocked field', () => {
    for (const doorId of Object.keys(DOOR_RECORDS)) {
      expect(Object.keys(DOOR_RECORDS[doorId as keyof typeof DOOR_RECORDS])).not.toContain('offerBlocked');
      expect(Object.keys(DOOR_RECORDS[doorId as keyof typeof DOOR_RECORDS])).not.toContain('blocked');
      expect(Object.keys(DOOR_RECORDS[doorId as keyof typeof DOOR_RECORDS])).not.toContain('eligible');
    }
    const result = getDoorBlockers('DOOR-001');
    expect(result?.eligible).toBe(true);
    expect(result?.blocked).toBe(false);

    const blockedResult = getDoorBlockers('DOOR-006');
    expect(blockedResult?.blocked).toBe(true);
    expect(blockedResult?.eligible).toBe(false);

    // Calling the selector repeatedly must never mutate the underlying records.
    const before = JSON.stringify(DOOR_RECORDS);
    getDoorBlockers('DOOR-002');
    getDoorBlockers('DOOR-003');
    const after = JSON.stringify(DOOR_RECORDS);
    expect(after).toBe(before);
  });
});

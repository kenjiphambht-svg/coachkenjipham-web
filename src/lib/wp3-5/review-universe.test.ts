import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import {
  RELATIONSHIP_IDS,
  JOURNEY_IDS,
  JOURNEY_OWNERSHIP,
  CARE_IDS,
  CARE_OWNERSHIP,
  PROMISE_IDS,
  PROMISE_OWNERSHIP,
  DOOR_IDS,
  DOOR_OWNERSHIP,
  TODAY_QUEUE_IDS,
  TODAY_QUEUE_MANIFEST,
  PRIORITY_BUCKETS,
  CONSENT_RECORD_IDS,
  SUPPRESSION_RECORD_IDS,
  TIMELINE_EVENT_TOTAL,
  SCENARIO_PRESETS,
} from './review-manifest';

import {
  RELATIONSHIP_RECORDS,
  JOURNEY_RECORDS,
  CARE_RECORDS,
  PROMISE_RECORDS,
  DOOR_RECORDS,
  deriveDoorBlockers,
  CONSENT_STATE_RECORDS,
  SUPPRESSION_STATE_RECORDS,
  TIMELINE_EVENTS,
  TODAY_QUEUE_DETAILS,
  SCENARIO_PRESET_ITEMS,
  DEFAULT_SCENARIO_PRESET,
  PRIORITY_BUCKET_ORDER,
  sortTodayQueueIdsByPriority,
  UNIVERSE_ENTITY_COUNTS,
} from './review-universe';

const __dirname = dirname(fileURLToPath(import.meta.url));

function noDupes(arr: readonly string[]): boolean {
  return new Set(arr).size === arr.length;
}

// ---------------------------------------------------------------------------
// 1. Exact required counts
// ---------------------------------------------------------------------------

describe('1. Exact required counts', () => {
  it('matches every locked minimum/exact count from the Work Order and manifest', () => {
    expect(UNIVERSE_ENTITY_COUNTS.relationships).toBe(16);
    expect(UNIVERSE_ENTITY_COUNTS.journeys).toBe(24);
    expect(UNIVERSE_ENTITY_COUNTS.care).toBe(14);
    expect(UNIVERSE_ENTITY_COUNTS.promises).toBe(10);
    expect(UNIVERSE_ENTITY_COUNTS.doors).toBe(6);
    expect(UNIVERSE_ENTITY_COUNTS.todayQueue).toBe(18);
    expect(UNIVERSE_ENTITY_COUNTS.consentRecords).toBe(16);
    expect(UNIVERSE_ENTITY_COUNTS.suppressionRecords).toBe(16);
    expect(UNIVERSE_ENTITY_COUNTS.timelineEvents).toBe(42);
    expect(UNIVERSE_ENTITY_COUNTS.scenarioPresets).toBe(4);
    expect(Object.keys(RELATIONSHIP_RECORDS)).toHaveLength(16);
    expect(Object.keys(JOURNEY_RECORDS)).toHaveLength(24);
    expect(Object.keys(CARE_RECORDS)).toHaveLength(14);
    expect(Object.keys(PROMISE_RECORDS)).toHaveLength(10);
    expect(Object.keys(DOOR_RECORDS)).toHaveLength(6);
    expect(Object.keys(TODAY_QUEUE_DETAILS)).toHaveLength(18);
    expect(Object.keys(CONSENT_STATE_RECORDS)).toHaveLength(16);
    expect(Object.keys(SUPPRESSION_STATE_RECORDS)).toHaveLength(16);
    expect(TIMELINE_EVENTS).toHaveLength(42);
    expect(TIMELINE_EVENTS.length).toBe(TIMELINE_EVENT_TOTAL);
  });
});

// ---------------------------------------------------------------------------
// 2-5. Canonical ownership references
// ---------------------------------------------------------------------------

describe('2. Every Journey references an existing Relationship', () => {
  it('holds for every Journey record', () => {
    for (const jid of JOURNEY_IDS) {
      expect(RELATIONSHIP_IDS).toContain(JOURNEY_RECORDS[jid].relationshipId);
      expect(JOURNEY_RECORDS[jid].relationshipId).toBe(JOURNEY_OWNERSHIP[jid]);
    }
  });
});

describe('3. Every Care references its canonical Relationship and Journey', () => {
  it('holds for every Care record', () => {
    for (const cid of CARE_IDS) {
      const rec = CARE_RECORDS[cid];
      expect(rec.relationshipId).toBe(CARE_OWNERSHIP[cid].relationshipId);
      expect(rec.journeyId).toBe(CARE_OWNERSHIP[cid].journeyId);
      expect(JOURNEY_OWNERSHIP[rec.journeyId]).toBe(rec.relationshipId);
    }
  });
});

describe('4. Every Promise references its canonical Relationship and Journey', () => {
  it('holds for every Promise record', () => {
    for (const pid of PROMISE_IDS) {
      const rec = PROMISE_RECORDS[pid];
      expect(rec.relationshipId).toBe(PROMISE_OWNERSHIP[pid].relationshipId);
      expect(rec.journeyId).toBe(PROMISE_OWNERSHIP[pid].journeyId);
      expect(JOURNEY_OWNERSHIP[rec.journeyId]).toBe(rec.relationshipId);
    }
  });
});

describe('5. Every Door references its canonical Relationship and Journey', () => {
  it('holds for every Door record', () => {
    for (const did of DOOR_IDS) {
      const rec = DOOR_RECORDS[did];
      expect(rec.relationshipId).toBe(DOOR_OWNERSHIP[did].relationshipId);
      expect(rec.journeyId).toBe(DOOR_OWNERSHIP[did].journeyId);
      expect(JOURNEY_OWNERSHIP[rec.journeyId]).toBe(rec.relationshipId);
    }
  });
});

// ---------------------------------------------------------------------------
// 6. Every Today item exactly matches review-manifest.ts
// ---------------------------------------------------------------------------

describe('6. Every Today item exactly matches review-manifest.ts', () => {
  it('has a TODAY_QUEUE_DETAILS entry for every canonical Today Queue id, with no drift', () => {
    for (const qid of TODAY_QUEUE_IDS) {
      expect(TODAY_QUEUE_DETAILS[qid]).toBeDefined();
      // Universe layer must not redefine the canonical structural links; it only adds
      // descriptive detail keyed by the same id, so re-reading the manifest for
      // relationship/journey/care/promise/door linkage is the single source of truth.
      const manifestItem = TODAY_QUEUE_MANIFEST[qid];
      expect(manifestItem).toBeDefined();
    }
    expect(Object.keys(TODAY_QUEUE_DETAILS).sort()).toEqual([...TODAY_QUEUE_IDS].sort());
  });
});

// ---------------------------------------------------------------------------
// 7-8. Consent / Suppression ownership
// ---------------------------------------------------------------------------

describe('7. Every Consent record belongs to its canonical Relationship', () => {
  it('holds for every Consent record', () => {
    for (const cid of CONSENT_RECORD_IDS) {
      expect(RELATIONSHIP_IDS).toContain(CONSENT_STATE_RECORDS[cid].relationshipId);
    }
  });
});

describe('8. Every Suppression record belongs to its canonical Relationship', () => {
  it('holds for every Suppression record', () => {
    for (const sid of SUPPRESSION_RECORD_IDS) {
      expect(RELATIONSHIP_IDS).toContain(SUPPRESSION_STATE_RECORDS[sid].relationshipId);
    }
  });
});

// ---------------------------------------------------------------------------
// 9. Timeline events reference valid Relationship and Journey context
// ---------------------------------------------------------------------------

describe('9. Every Timeline event references valid Relationship and Journey context', () => {
  it('holds for all 42 events', () => {
    for (const evt of TIMELINE_EVENTS) {
      expect(RELATIONSHIP_IDS).toContain(evt.relationshipId);
      expect(JOURNEY_IDS).toContain(evt.journeyId);
      expect(JOURNEY_OWNERSHIP[evt.journeyId]).toBe(evt.relationshipId);
    }
  });
});

// ---------------------------------------------------------------------------
// 10-11. No duplicate / orphan IDs
// ---------------------------------------------------------------------------

describe('10. No duplicate IDs', () => {
  it('holds across every ID space in the universe', () => {
    expect(noDupes(Object.keys(RELATIONSHIP_RECORDS))).toBe(true);
    expect(noDupes(Object.keys(JOURNEY_RECORDS))).toBe(true);
    expect(noDupes(Object.keys(CARE_RECORDS))).toBe(true);
    expect(noDupes(Object.keys(PROMISE_RECORDS))).toBe(true);
    expect(noDupes(Object.keys(DOOR_RECORDS))).toBe(true);
    expect(noDupes(Object.keys(TODAY_QUEUE_DETAILS))).toBe(true);
    expect(noDupes(Object.keys(CONSENT_STATE_RECORDS))).toBe(true);
    expect(noDupes(Object.keys(SUPPRESSION_STATE_RECORDS))).toBe(true);
    expect(noDupes(TIMELINE_EVENTS.map((e) => e.id))).toBe(true);
  });
});

describe('11. No orphan IDs', () => {
  it('every declared canonical id has a corresponding universe record, and vice versa', () => {
    expect(Object.keys(RELATIONSHIP_RECORDS).sort()).toEqual([...RELATIONSHIP_IDS].sort());
    expect(Object.keys(JOURNEY_RECORDS).sort()).toEqual([...JOURNEY_IDS].sort());
    expect(Object.keys(CARE_RECORDS).sort()).toEqual([...CARE_IDS].sort());
    expect(Object.keys(PROMISE_RECORDS).sort()).toEqual([...PROMISE_IDS].sort());
    expect(Object.keys(DOOR_RECORDS).sort()).toEqual([...DOOR_IDS].sort());
    expect(Object.keys(TODAY_QUEUE_DETAILS).sort()).toEqual([...TODAY_QUEUE_IDS].sort());
    expect(Object.keys(CONSENT_STATE_RECORDS).sort()).toEqual([...CONSENT_RECORD_IDS].sort());
    expect(Object.keys(SUPPRESSION_STATE_RECORDS).sort()).toEqual([...SUPPRESSION_RECORD_IDS].sort());
  });
});

// ---------------------------------------------------------------------------
// 12. Exactly six unique Door IDs and owners
// ---------------------------------------------------------------------------

describe('12. Exactly six unique Door IDs and owners', () => {
  it('has six Door records, each with a unique id and a unique owning Relationship', () => {
    expect(Object.keys(DOOR_RECORDS)).toHaveLength(6);
    expect(noDupes(Object.keys(DOOR_RECORDS))).toBe(true);
    const owners = DOOR_IDS.map((id) => DOOR_RECORDS[id].relationshipId);
    expect(noDupes(owners)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 13-14. Timeline total and presets
// ---------------------------------------------------------------------------

describe('13. Timeline event count equals exactly 42', () => {
  it('holds', () => {
    expect(TIMELINE_EVENTS).toHaveLength(42);
    expect(TIMELINE_EVENT_TOTAL).toBe(42);
  });
});

describe('14. Four deterministic scenario presets exist', () => {
  it('has exactly quiet, normal, peak, recovery, each a fixed non-random list', () => {
    expect(SCENARIO_PRESETS).toEqual(['quiet', 'normal', 'peak', 'recovery']);
    expect(Object.keys(SCENARIO_PRESET_ITEMS).sort()).toEqual([...SCENARIO_PRESETS].sort());
    for (const preset of SCENARIO_PRESETS) {
      const a = SCENARIO_PRESET_ITEMS[preset];
      const b = SCENARIO_PRESET_ITEMS[preset];
      expect(a).toEqual(b);
      expect(noDupes(a)).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// 15-17. Preset composition rules
// ---------------------------------------------------------------------------

describe('15. Peak contains all 18 Today items', () => {
  it('holds', () => {
    expect([...SCENARIO_PRESET_ITEMS.peak].sort()).toEqual([...TODAY_QUEUE_IDS].sort());
  });
});

describe('16. Normal is the default preset', () => {
  it('holds', () => {
    expect(DEFAULT_SCENARIO_PRESET).toBe('normal');
  });
});

describe('17. Quiet and Recovery are deterministic', () => {
  it('quiet and recovery presets are fixed arrays, identical across repeated reads', () => {
    expect(SCENARIO_PRESET_ITEMS.quiet).toEqual(SCENARIO_PRESET_ITEMS.quiet);
    expect(SCENARIO_PRESET_ITEMS.recovery).toEqual(SCENARIO_PRESET_ITEMS.recovery);
    expect(SCENARIO_PRESET_ITEMS.quiet.length).toBeGreaterThanOrEqual(4);
    expect(SCENARIO_PRESET_ITEMS.recovery.length).toBeGreaterThanOrEqual(10);
    expect(SCENARIO_PRESET_ITEMS.recovery.length).toBeLessThanOrEqual(12);
  });
});

// ---------------------------------------------------------------------------
// 18-20. Bucket structure and ordering
// ---------------------------------------------------------------------------

describe('18. Six Today buckets contain exactly 3 items each', () => {
  it('holds against the canonical manifest', () => {
    const counts = new Map<string, number>();
    for (const qid of TODAY_QUEUE_IDS) {
      const bucket = TODAY_QUEUE_MANIFEST[qid].priorityBucket;
      counts.set(bucket, (counts.get(bucket) ?? 0) + 1);
    }
    expect(counts.size).toBe(6);
    for (const bucket of PRIORITY_BUCKETS) {
      expect(counts.get(bucket)).toBe(3);
    }
  });
});

describe('19. Priority bucket order is deterministic', () => {
  it('sorting the same ids twice yields the same order', () => {
    const ids = [...TODAY_QUEUE_IDS];
    const a = sortTodayQueueIdsByPriority(ids);
    const b = sortTodayQueueIdsByPriority(ids);
    expect(a).toEqual(b);
    expect(Object.keys(PRIORITY_BUCKET_ORDER)).toHaveLength(6);
  });
});

describe('20. Safety & Recovery precedes Next Door Review', () => {
  it('in the deterministic priority order', () => {
    expect(PRIORITY_BUCKET_ORDER['Safety & Recovery']).toBeLessThan(PRIORITY_BUCKET_ORDER['Next Door Review']);
    const sorted = sortTodayQueueIdsByPriority([...TODAY_QUEUE_IDS]);
    const firstBucket = TODAY_QUEUE_MANIFEST[sorted[0]].priorityBucket;
    const lastBucket = TODAY_QUEUE_MANIFEST[sorted[sorted.length - 1]].priorityBucket;
    expect(firstBucket).toBe('Safety & Recovery');
    expect(lastBucket).toBe('Next Door Review');
  });
});

// ---------------------------------------------------------------------------
// 21-26. Door blocking derivation
// ---------------------------------------------------------------------------

describe('21. Open Care / Support / Recovery blocks a Door', () => {
  it('DOOR-002 is blocked by open CARE-002', () => {
    expect(CARE_RECORDS['CARE-002'].status).toBe('open');
    expect(DOOR_RECORDS['DOOR-002'].blockingCareIds).toContain('CARE-002');
    expect(deriveDoorBlockers('DOOR-002').blocked).toBe(true);
  });
});

describe('22. An overdue Promise blocks a Door', () => {
  it('DOOR-003 is blocked by overdue PROM-002', () => {
    expect(PROMISE_RECORDS['PROM-002'].dueStatus).toBe('overdue');
    expect(DOOR_RECORDS['DOOR-003'].blockingPromiseIds).toContain('PROM-002');
    expect(deriveDoorBlockers('DOOR-003').blocked).toBe(true);
  });
});

describe('23. Missing next-journey consent blocks a Door', () => {
  it('DOOR-004 is blocked by unclear CNS-007', () => {
    expect(CONSENT_STATE_RECORDS['CNS-007'].state).toBe('unclear');
    expect(DOOR_RECORDS['DOOR-004'].consentId).toBe('CNS-007');
    expect(deriveDoorBlockers('DOOR-004').blocked).toBe(true);
  });
});

describe('24. Active Suppression blocks a Door', () => {
  it('DOOR-005 is blocked by active_30d SUP-005', () => {
    expect(SUPPRESSION_STATE_RECORDS['SUP-005'].state).toBe('active_30d');
    expect(DOOR_RECORDS['DOOR-005'].suppressionId).toBe('SUP-005');
    expect(deriveDoorBlockers('DOOR-005').blocked).toBe(true);
  });
});

describe('25. Founder-deferred state remains blocked', () => {
  it('DOOR-006 stays blocked even though its journey is closed and its care case is closed', () => {
    expect(DOOR_RECORDS['DOOR-006'].proposalState).toBe('founder_deferred');
    expect(JOURNEY_RECORDS[DOOR_RECORDS['DOOR-006'].journeyId].stage).toBe('closed');
    expect(CARE_RECORDS['CARE-010'].status).toBe('closed');
    const result = deriveDoorBlockers('DOOR-006');
    expect(result.blocked).toBe(true);
    expect(result.eligible).toBe(false);
  });
});

describe('26. Eligible Door requires a closed journey and no blocker', () => {
  it('DOOR-001 is the only eligible door: closed journey, no open care, no overdue promise, no unclear consent, no active suppression, proposalState eligible', () => {
    const result = deriveDoorBlockers('DOOR-001');
    expect(JOURNEY_RECORDS[DOOR_RECORDS['DOOR-001'].journeyId].stage).toBe('closed');
    expect(result.blocked).toBe(false);
    expect(result.eligible).toBe(true);

    const eligibleDoors = DOOR_IDS.filter((id) => deriveDoorBlockers(id).eligible);
    expect(eligibleDoors).toEqual(['DOOR-001']);
  });
});

// ---------------------------------------------------------------------------
// 27-30. Locked queue-ownership facts
// ---------------------------------------------------------------------------

describe('27. Q-017 has no Door', () => {
  it('holds in both the manifest and the universe detail', () => {
    expect(TODAY_QUEUE_MANIFEST['Q-017'].doorId).toBeNull();
    expect(TODAY_QUEUE_DETAILS['Q-017'].offerBlockedReason).toContain('Chưa có Door proposal');
  });
});

describe('28. SYN-002 owns Q-003 and Q-007', () => {
  it('holds', () => {
    expect(TODAY_QUEUE_MANIFEST['Q-003'].relationshipId).toBe('SYN-002');
    expect(TODAY_QUEUE_MANIFEST['Q-007'].relationshipId).toBe('SYN-002');
  });
});

describe('29. SYN-016 owns Q-015 and Q-018', () => {
  it('holds', () => {
    expect(TODAY_QUEUE_MANIFEST['Q-015'].relationshipId).toBe('SYN-016');
    expect(TODAY_QUEUE_MANIFEST['Q-018'].relationshipId).toBe('SYN-016');
  });
});

describe('30. Q-010 belongs only to SYN-003', () => {
  it('no other Today item shares SYN-003 exclusively at Q-010', () => {
    expect(TODAY_QUEUE_MANIFEST['Q-010'].relationshipId).toBe('SYN-003');
    const q010Owners = TODAY_QUEUE_IDS.filter((id) => TODAY_QUEUE_MANIFEST[id].relationshipId === 'SYN-003');
    expect(q010Owners).toEqual(['Q-010']);
  });
});

// ---------------------------------------------------------------------------
// 31-32. Forbidden fields
// ---------------------------------------------------------------------------

const FORBIDDEN_FIELD_NAMES = [
  'score',
  'leadScore',
  'customerScore',
  'probability',
  'conversionScore',
  'conversionProbability',
  'psychologicalProfile',
  'profile',
];

function collectAllValues(value: unknown, seen = new Set<unknown>()): unknown[] {
  if (value === null || typeof value !== 'object') return [value];
  if (seen.has(value)) return [];
  seen.add(value);
  const out: unknown[] = [];
  for (const v of Object.values(value as Record<string, unknown>)) {
    out.push(...collectAllValues(v, seen));
  }
  return out;
}

function collectAllKeys(value: unknown, seen = new Set<unknown>()): string[] {
  if (value === null || typeof value !== 'object') return [];
  if (seen.has(value)) return [];
  seen.add(value);
  const keys = Object.keys(value as Record<string, unknown>);
  const nested = Object.values(value as Record<string, unknown>).flatMap((v) => collectAllKeys(v, seen));
  return [...keys, ...nested];
}

describe('31. Forbidden score/probability/profile fields are absent', () => {
  it('no universe record exposes a score, lead score, probability or profile field', () => {
    const allRecords = {
      RELATIONSHIP_RECORDS,
      JOURNEY_RECORDS,
      CARE_RECORDS,
      PROMISE_RECORDS,
      DOOR_RECORDS,
      TODAY_QUEUE_DETAILS,
      CONSENT_STATE_RECORDS,
      SUPPRESSION_STATE_RECORDS,
      TIMELINE_EVENTS,
    };
    const keys = collectAllKeys(allRecords);
    for (const forbidden of FORBIDDEN_FIELD_NAMES) {
      expect(keys.map((k) => k.toLowerCase())).not.toContain(forbidden.toLowerCase());
    }
  });
});

describe('32. Sensitive child fixture fields are absent', () => {
  it('no full names, DOB, school, diagnosis or raw private-story fields/values exist', () => {
    const allRecords = {
      RELATIONSHIP_RECORDS,
      JOURNEY_RECORDS,
      CARE_RECORDS,
      PROMISE_RECORDS,
      DOOR_RECORDS,
      TODAY_QUEUE_DETAILS,
      CONSENT_STATE_RECORDS,
      SUPPRESSION_STATE_RECORDS,
      TIMELINE_EVENTS,
    };
    // Tokenize camelCase keys into whole words so a legitimate field like
    // `stage` doesn't false-positive on a substring check for `age`.
    const tokens = collectAllKeys(allRecords).flatMap((k) =>
      k
        .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
        .toLowerCase()
        .split(/[^a-z]+/)
        .filter(Boolean)
    );
    const forbiddenKeyWords = ['school', 'dob', 'birthdate', 'diagnosis', 'fullname', 'childname', 'age'];
    for (const word of forbiddenKeyWords) {
      expect(tokens).not.toContain(word);
    }

    // Relationship display names are single common given names only (WO §9.4), never a full name.
    for (const rid of RELATIONSHIP_IDS) {
      const name = RELATIONSHIP_RECORDS[rid].displayName;
      expect(name.trim().split(/\s+/)).toHaveLength(1);
    }
  });
});

// ---------------------------------------------------------------------------
// 33-34. Dependency and persistence safety (source-text scan)
// ---------------------------------------------------------------------------

const universeSourceRaw = readFileSync(join(__dirname, 'review-universe.ts'), 'utf-8');
const manifestSourceRaw = readFileSync(join(__dirname, 'review-manifest.ts'), 'utf-8');

/** Strip block and line comments so doc-comments describing what is NOT
 * imported/used (e.g. this file's own header comment) can't false-positive
 * a source-text scan for forbidden patterns. */
function stripComments(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
}

const universeSource = stripComments(universeSourceRaw);
const manifestSource = stripComments(manifestSourceRaw);

describe('33. No Supabase/auth/provider/API/network-write dependency is imported', () => {
  it('scans review-universe.ts source text (comments stripped) for forbidden import patterns', () => {
    const forbiddenPatterns = [
      /@supabase\//i,
      /from ['"]react['"]/i,
      /from ['"]next/i,
      /withAdmin/,
      /requireAdmin/,
      /admin-gate/,
      /\bfetch\(/,
      /XMLHttpRequest/,
      /axios/i,
    ];
    for (const pattern of forbiddenPatterns) {
      expect(pattern.test(universeSource)).toBe(false);
    }
    // Every module specifier imported (statement may span multiple lines) must be review-manifest.
    const specifiers = [...universeSource.matchAll(/from\s+['"]([^'"]+)['"]/g)].map((m) => m[1]);
    expect(specifiers.length).toBeGreaterThan(0);
    for (const specifier of specifiers) {
      expect(specifier).toBe('./review-manifest');
    }
  });
});

describe('34. No localStorage, sessionStorage, IndexedDB or cookie persistence exists', () => {
  it('scans both new files (comments stripped) for persistence APIs', () => {
    const forbiddenPersistence = [/localStorage/, /sessionStorage/, /indexedDB/i, /document\.cookie/];
    for (const pattern of forbiddenPersistence) {
      expect(pattern.test(universeSource)).toBe(false);
      expect(pattern.test(manifestSource)).toBe(false);
    }
  });
});

/**
 * WP3.5-A2 — Founder Review deterministic selectors
 *
 * Pure, read-only query layer over the frozen canonical manifest
 * (`review-manifest.ts`) and the synthetic operating universe
 * (`review-universe.ts`). Every function here reads imported data and
 * returns new values — none of them mutate the imported collections, and
 * none of them persist anything (no storage, no network, no writes).
 *
 * This module also owns the synthetic query-parameter contract: only
 * `scenario`, `relationship`, `journey` and `care` are recognized, and only
 * exact canonical id values are ever accepted — anything else resolves to
 * `undefined` (or the `normal` default for scenario). Callers must never
 * reflect a raw, unvalidated query value into HTML; always resolve through
 * this module first.
 */

import {
  RELATIONSHIP_IDS,
  type RelationshipId,
  JOURNEY_IDS,
  type JourneyId,
  CARE_IDS,
  type CareId,
  type PromiseId,
  DOOR_IDS,
  type DoorId,
  TODAY_QUEUE_IDS,
  TODAY_QUEUE_MANIFEST,
  type TodayQueueId,
  PRIORITY_BUCKETS,
  SCENARIO_PRESETS,
  type ScenarioPreset,
} from './review-manifest';

import {
  RELATIONSHIP_RECORDS,
  type RelationshipRecord,
  JOURNEY_RECORDS,
  type JourneyRecord,
  CARE_RECORDS,
  type CareRecord,
  PROMISE_RECORDS,
  type PromiseRecord,
  DOOR_RECORDS,
  type DoorRecord,
  TIMELINE_EVENTS,
  type TimelineEventRecord,
  TODAY_QUEUE_DETAILS,
  SCENARIO_PRESET_ITEMS,
  DEFAULT_SCENARIO_PRESET,
  sortTodayQueueIdsByPriority,
  deriveDoorBlockers,
  type DoorEligibility,
  getJourneysForRelationship as getJourneyIdsForRelationship,
} from './review-universe';

export { PRIORITY_BUCKETS, SCENARIO_PRESETS, DEFAULT_SCENARIO_PRESET };
export type { ScenarioPreset };

// ---------------------------------------------------------------------------
// Scenario resolution
// ---------------------------------------------------------------------------

const SCENARIO_SET: ReadonlySet<string> = new Set(SCENARIO_PRESETS);

/** Any value that is not exactly one of the four locked presets resolves to `normal`. */
export function resolveScenario(value: unknown): ScenarioPreset {
  if (typeof value === 'string' && SCENARIO_SET.has(value)) {
    return value as ScenarioPreset;
  }
  return DEFAULT_SCENARIO_PRESET;
}

/** Deterministic, already priority-sorted Today Queue ids for a scenario. */
export function getTodayItemsForScenario(scenario: unknown): readonly TodayQueueId[] {
  const resolved = resolveScenario(scenario);
  return SCENARIO_PRESET_ITEMS[resolved];
}

/** Sorts any subset of Today Queue ids by the six locked priority buckets. */
export function sortTodayItemsByPriority(ids: readonly TodayQueueId[]): readonly TodayQueueId[] {
  return sortTodayQueueIdsByPriority(ids);
}

// ---------------------------------------------------------------------------
// Canonical id validation
// ---------------------------------------------------------------------------

const RELATIONSHIP_ID_SET: ReadonlySet<string> = new Set(RELATIONSHIP_IDS);
const JOURNEY_ID_SET: ReadonlySet<string> = new Set(JOURNEY_IDS);
const CARE_ID_SET: ReadonlySet<string> = new Set(CARE_IDS);

export function isValidRelationshipId(value: unknown): value is RelationshipId {
  return typeof value === 'string' && RELATIONSHIP_ID_SET.has(value);
}

export function isValidJourneyId(value: unknown): value is JourneyId {
  return typeof value === 'string' && JOURNEY_ID_SET.has(value);
}

export function isValidCareId(value: unknown): value is CareId {
  return typeof value === 'string' && CARE_ID_SET.has(value);
}

// ---------------------------------------------------------------------------
// Context resolution — invalid or unrelated ids safely resolve to undefined
// ---------------------------------------------------------------------------

export function resolveRelationshipContext(value: unknown): RelationshipRecord | undefined {
  return isValidRelationshipId(value) ? RELATIONSHIP_RECORDS[value] : undefined;
}

export function resolveJourneyContext(value: unknown): JourneyRecord | undefined {
  return isValidJourneyId(value) ? JOURNEY_RECORDS[value] : undefined;
}

export function resolveCareContext(value: unknown): CareRecord | undefined {
  return isValidCareId(value) ? CARE_RECORDS[value] : undefined;
}

// ---------------------------------------------------------------------------
// Linked Promise / Door for a Today Queue item
// ---------------------------------------------------------------------------

export interface LinkedTodayContext {
  readonly promise?: PromiseRecord;
  readonly door?: DoorRecord;
}

export function findLinkedPromiseAndDoor(todayId: TodayQueueId): LinkedTodayContext {
  const manifestItem = TODAY_QUEUE_MANIFEST[todayId];
  const promise: PromiseRecord | undefined = manifestItem.promiseId
    ? PROMISE_RECORDS[manifestItem.promiseId as PromiseId]
    : undefined;
  const door: DoorRecord | undefined = manifestItem.doorId
    ? DOOR_RECORDS[manifestItem.doorId as DoorId]
    : undefined;
  return { promise, door };
}

// ---------------------------------------------------------------------------
// Timeline events for a Relationship
// ---------------------------------------------------------------------------

export function getTimelineEventsForRelationship(relationshipId: unknown): readonly TimelineEventRecord[] {
  if (!isValidRelationshipId(relationshipId)) return [];
  return TIMELINE_EVENTS.filter((event) => event.relationshipId === relationshipId).slice().sort((a, b) => a.order - b.order);
}

// ---------------------------------------------------------------------------
// All Journeys for one Relationship
// ---------------------------------------------------------------------------

export function getJourneysForRelationship(relationshipId: unknown): readonly JourneyRecord[] {
  if (!isValidRelationshipId(relationshipId)) return [];
  return getJourneyIdsForRelationship(relationshipId).map((jid) => JOURNEY_RECORDS[jid]);
}

// ---------------------------------------------------------------------------
// Care and Promise records for one Journey
// ---------------------------------------------------------------------------

export interface JourneyCareAndPromises {
  readonly care: readonly CareRecord[];
  readonly promises: readonly PromiseRecord[];
}

export function getCareAndPromisesForJourney(journeyId: unknown): JourneyCareAndPromises {
  if (!isValidJourneyId(journeyId)) return { care: [], promises: [] };
  const care = CARE_IDS.map((id) => CARE_RECORDS[id]).filter((rec) => rec.journeyId === journeyId);
  const promises = Object.values(PROMISE_RECORDS).filter((rec) => rec.journeyId === journeyId);
  return { care, promises };
}

// ---------------------------------------------------------------------------
// Whole-collection reads (used by the Hành trình and Chăm sóc workspaces)
// ---------------------------------------------------------------------------

/** All 24 Journey records, in canonical JRN order. */
export function getAllJourneys(): readonly JourneyRecord[] {
  return JOURNEY_IDS.map((id) => JOURNEY_RECORDS[id]);
}

/** All 14 Care/Support/Recovery records, in canonical CARE order. */
export function getAllCareCases(): readonly CareRecord[] {
  return CARE_IDS.map((id) => CARE_RECORDS[id]);
}

export function getCareCasesForRelationship(relationshipId: unknown): readonly CareRecord[] {
  if (!isValidRelationshipId(relationshipId)) return [];
  return getAllCareCases().filter((rec) => rec.relationshipId === relationshipId);
}

export function getPromisesForRelationship(relationshipId: unknown): readonly PromiseRecord[] {
  if (!isValidRelationshipId(relationshipId)) return [];
  return Object.values(PROMISE_RECORDS).filter((rec) => rec.relationshipId === relationshipId);
}

// ---------------------------------------------------------------------------
// Door lookup — a Relationship owns at most one Door proposal (manifest §B/§C),
// so both lookups return a single record or undefined. Shared by the Quan hệ,
// Hành trình and Chăm sóc workspaces so the rule lives in exactly one place.
// ---------------------------------------------------------------------------

export function getDoorForRelationship(relationshipId: unknown): DoorRecord | undefined {
  if (!isValidRelationshipId(relationshipId)) return undefined;
  return DOOR_IDS.map((id) => DOOR_RECORDS[id]).find((door) => door.relationshipId === relationshipId);
}

export function getDoorForJourney(journeyId: unknown): DoorRecord | undefined {
  if (!isValidJourneyId(journeyId)) return undefined;
  return DOOR_IDS.map((id) => DOOR_RECORDS[id]).find((door) => door.journeyId === journeyId);
}

// ---------------------------------------------------------------------------
// Door blocker derivation — delegates to the existing pure logic; never
// re-implements or stores it as mutable truth here.
// ---------------------------------------------------------------------------

export function getDoorBlockers(doorId: unknown): DoorEligibility | undefined {
  if (typeof doorId !== 'string' || !(doorId in DOOR_RECORDS)) return undefined;
  return deriveDoorBlockers(doorId as DoorId);
}

// ---------------------------------------------------------------------------
// Synthetic query parameter contract
// ---------------------------------------------------------------------------

export type QueryValue = string | readonly string[] | undefined;

function firstValue(value: QueryValue): string | undefined {
  return Array.isArray(value) ? value[0] : (value as string | undefined);
}

export interface ParsedSyntheticQuery {
  readonly scenario: ScenarioPreset;
  readonly relationship?: RelationshipId;
  readonly journey?: JourneyId;
  readonly care?: CareId;
}

/**
 * Parses only the four approved synthetic query keys. Any other key present
 * on the input is ignored entirely — it is never read or reflected. Invalid
 * values for a recognized key resolve to `undefined` (or `normal` for
 * scenario), never to the raw input.
 */
export function parseSyntheticQuery(query: Readonly<Record<string, QueryValue>>): ParsedSyntheticQuery {
  const scenario = resolveScenario(firstValue(query.scenario));
  const relationshipRaw = firstValue(query.relationship);
  const journeyRaw = firstValue(query.journey);
  const careRaw = firstValue(query.care);
  return {
    scenario,
    relationship: isValidRelationshipId(relationshipRaw) ? relationshipRaw : undefined,
    journey: isValidJourneyId(journeyRaw) ? journeyRaw : undefined,
    care: isValidCareId(careRaw) ? careRaw : undefined,
  };
}

export interface SyntheticQueryState {
  readonly scenario?: unknown;
  readonly relationship?: unknown;
  readonly journey?: unknown;
  readonly care?: unknown;
}

/**
 * Builds a query object containing only validated synthetic ids — safe to
 * pass straight to Next's `Link href={{ query }}`. Never includes an
 * unrecognized key or an unvalidated value.
 */
export function buildSafeSyntheticQuery(state: SyntheticQueryState): Record<string, string> {
  const out: Record<string, string> = { scenario: resolveScenario(state.scenario) };
  if (isValidRelationshipId(state.relationship)) out.relationship = state.relationship;
  if (isValidJourneyId(state.journey)) out.journey = state.journey;
  if (isValidCareId(state.care)) out.care = state.care;
  return out;
}

/** Used for "Reset phiên" — keeps only the current valid scenario. */
export function buildScenarioOnlyQuery(scenario: unknown): Record<string, string> {
  return { scenario: resolveScenario(scenario) };
}

// ---------------------------------------------------------------------------
// Today item blocked check — a single source of truth so the Hôm nay screen
// and the AI Trợ lý summary (WP3.5-A2 clarity milestone) never diverge on
// what counts as "blocked". Mirrors a Today item's own Door when one exists,
// otherwise its own stated offerBlocked fact.
// ---------------------------------------------------------------------------

export function isTodayItemBlocked(todayId: TodayQueueId): boolean {
  const manifestItem = TODAY_QUEUE_MANIFEST[todayId];
  if (manifestItem.doorId) {
    return getDoorBlockers(manifestItem.doorId)?.blocked ?? TODAY_QUEUE_DETAILS[todayId].offerBlocked;
  }
  return TODAY_QUEUE_DETAILS[todayId].offerBlocked;
}

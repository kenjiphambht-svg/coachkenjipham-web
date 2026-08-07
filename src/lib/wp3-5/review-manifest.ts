/**
 * WP3.5-A2 — Canonical Founder Review Manifest
 *
 * Single machine-readable canonical source of structural IDs and ownership
 * for WP3.5-A2, transcribed field-for-field from the Founder-approved
 * `WP3.5-A2_CANONICAL_ENTITY_MANIFEST.md` (Status: LOCKED FOR IMPLEMENTATION,
 * Gate: B APPROVED), frozen verbatim at
 * docs/decisions/WO-WP3.5-A2-FOUNDER-REVIEW-PREVIEW.md.
 *
 * This module does not renumber or reinterpret any canonical ID from that
 * source. Per its File 2 contract, it deliberately contains no UI copy, no
 * synthetic biographies, no scenario narratives, no dates, no selectors, no
 * offerBlocked logic, no React, no routes, no environment variables, no
 * Supabase, no auth, no APIs, no providers and no individual timeline event
 * fixtures. It is the sole canonical mapping — do not maintain a duplicate.
 */

// ---------------------------------------------------------------------------
// A. Relationship IDs — manifest §C / §D (Relationships: 16)
// ---------------------------------------------------------------------------

export const RELATIONSHIP_IDS = [
  'SYN-001',
  'SYN-002',
  'SYN-003',
  'SYN-004',
  'SYN-005',
  'SYN-006',
  'SYN-007',
  'SYN-008',
  'SYN-009',
  'SYN-010',
  'SYN-011',
  'SYN-012',
  'SYN-013',
  'SYN-014',
  'SYN-015',
  'SYN-016',
] as const;

export type RelationshipId = (typeof RELATIONSHIP_IDS)[number];

// ---------------------------------------------------------------------------
// B. Journey IDs with Relationship ownership — manifest §C (Journeys: 24)
// ---------------------------------------------------------------------------

export const JOURNEY_IDS = [
  'JRN-001', 'JRN-002', 'JRN-003', 'JRN-004', 'JRN-005', 'JRN-006',
  'JRN-007', 'JRN-008', 'JRN-009', 'JRN-010', 'JRN-011', 'JRN-012',
  'JRN-013', 'JRN-014', 'JRN-015', 'JRN-016', 'JRN-017', 'JRN-018',
  'JRN-019', 'JRN-020', 'JRN-021', 'JRN-022', 'JRN-023', 'JRN-024',
] as const;

export type JourneyId = (typeof JOURNEY_IDS)[number];

export const JOURNEY_OWNERSHIP: Readonly<Record<JourneyId, RelationshipId>> = {
  'JRN-001': 'SYN-001',
  'JRN-002': 'SYN-002',
  'JRN-003': 'SYN-002',
  'JRN-004': 'SYN-003',
  'JRN-005': 'SYN-003',
  'JRN-006': 'SYN-004',
  'JRN-007': 'SYN-004',
  'JRN-008': 'SYN-005',
  'JRN-009': 'SYN-006',
  'JRN-010': 'SYN-007',
  'JRN-011': 'SYN-007',
  'JRN-012': 'SYN-008',
  'JRN-013': 'SYN-008',
  'JRN-014': 'SYN-009',
  'JRN-015': 'SYN-010',
  'JRN-016': 'SYN-011',
  'JRN-017': 'SYN-012',
  'JRN-018': 'SYN-013',
  'JRN-019': 'SYN-013',
  'JRN-020': 'SYN-014',
  'JRN-021': 'SYN-015',
  'JRN-022': 'SYN-015',
  'JRN-023': 'SYN-016',
  'JRN-024': 'SYN-016',
} as const;

// ---------------------------------------------------------------------------
// C. Care IDs with exact Relationship and Journey ownership — manifest §C
//    (Care Cases: 14)
// ---------------------------------------------------------------------------

export const CARE_IDS = [
  'CARE-001', 'CARE-002', 'CARE-003', 'CARE-004', 'CARE-005', 'CARE-006',
  'CARE-007', 'CARE-008', 'CARE-009', 'CARE-010', 'CARE-011', 'CARE-012',
  'CARE-013', 'CARE-014',
] as const;

export type CareId = (typeof CARE_IDS)[number];

export interface OwnedByRelationshipAndJourney {
  readonly relationshipId: RelationshipId;
  readonly journeyId: JourneyId;
}

export const CARE_OWNERSHIP: Readonly<Record<CareId, OwnedByRelationshipAndJourney>> = {
  'CARE-001': { relationshipId: 'SYN-002', journeyId: 'JRN-003' },
  'CARE-002': { relationshipId: 'SYN-003', journeyId: 'JRN-004' },
  'CARE-003': { relationshipId: 'SYN-004', journeyId: 'JRN-006' },
  'CARE-004': { relationshipId: 'SYN-005', journeyId: 'JRN-008' },
  'CARE-005': { relationshipId: 'SYN-007', journeyId: 'JRN-010' },
  'CARE-006': { relationshipId: 'SYN-009', journeyId: 'JRN-014' },
  'CARE-007': { relationshipId: 'SYN-013', journeyId: 'JRN-019' },
  'CARE-008': { relationshipId: 'SYN-014', journeyId: 'JRN-020' },
  'CARE-009': { relationshipId: 'SYN-015', journeyId: 'JRN-021' },
  'CARE-010': { relationshipId: 'SYN-016', journeyId: 'JRN-023' },
  'CARE-011': { relationshipId: 'SYN-001', journeyId: 'JRN-001' },
  'CARE-012': { relationshipId: 'SYN-002', journeyId: 'JRN-002' },
  'CARE-013': { relationshipId: 'SYN-003', journeyId: 'JRN-004' },
  'CARE-014': { relationshipId: 'SYN-006', journeyId: 'JRN-009' },
} as const;

// ---------------------------------------------------------------------------
// D. Promise IDs with exact Relationship and Journey ownership — manifest §C
//    (Promises: 10)
// ---------------------------------------------------------------------------

export const PROMISE_IDS = [
  'PROM-001', 'PROM-002', 'PROM-003', 'PROM-004', 'PROM-005',
  'PROM-006', 'PROM-007', 'PROM-008', 'PROM-009', 'PROM-010',
] as const;

export type PromiseId = (typeof PROMISE_IDS)[number];

export const PROMISE_OWNERSHIP: Readonly<Record<PromiseId, OwnedByRelationshipAndJourney>> = {
  'PROM-001': { relationshipId: 'SYN-001', journeyId: 'JRN-001' },
  'PROM-002': { relationshipId: 'SYN-002', journeyId: 'JRN-003' },
  'PROM-003': { relationshipId: 'SYN-008', journeyId: 'JRN-012' },
  'PROM-004': { relationshipId: 'SYN-010', journeyId: 'JRN-015' },
  'PROM-005': { relationshipId: 'SYN-011', journeyId: 'JRN-016' },
  'PROM-006': { relationshipId: 'SYN-012', journeyId: 'JRN-017' },
  'PROM-007': { relationshipId: 'SYN-013', journeyId: 'JRN-019' },
  'PROM-008': { relationshipId: 'SYN-014', journeyId: 'JRN-020' },
  'PROM-009': { relationshipId: 'SYN-015', journeyId: 'JRN-021' },
  'PROM-010': { relationshipId: 'SYN-016', journeyId: 'JRN-023' },
} as const;

// ---------------------------------------------------------------------------
// E. Door IDs with exact Relationship and Journey ownership — manifest §B
//    (Door Proposals: exactly 6)
// ---------------------------------------------------------------------------

export const DOOR_IDS = [
  'DOOR-001', 'DOOR-002', 'DOOR-003', 'DOOR-004', 'DOOR-005', 'DOOR-006',
] as const;

export type DoorId = (typeof DOOR_IDS)[number];

export const DOOR_PROPOSAL_STATES = [
  'eligible',
  'blocked_recovery',
  'blocked_promise',
  'blocked_consent',
  'blocked_suppression',
  'founder_deferred',
] as const;

export type DoorProposalState = (typeof DOOR_PROPOSAL_STATES)[number];

export interface DoorOwnershipRecord {
  readonly relationshipId: RelationshipId;
  readonly journeyId: JourneyId;
  readonly consentId: ConsentRecordId;
  readonly suppressionId: SuppressionRecordId;
  readonly blockingCareIds: readonly CareId[];
  readonly blockingPromiseIds: readonly PromiseId[];
  readonly proposalState: DoorProposalState;
}

export const DOOR_OWNERSHIP: Readonly<Record<DoorId, DoorOwnershipRecord>> = {
  'DOOR-001': {
    relationshipId: 'SYN-006',
    journeyId: 'JRN-009',
    consentId: 'CNS-006',
    suppressionId: 'SUP-006',
    blockingCareIds: [],
    blockingPromiseIds: [],
    proposalState: 'eligible',
  },
  'DOOR-002': {
    relationshipId: 'SYN-003',
    journeyId: 'JRN-004',
    consentId: 'CNS-003',
    suppressionId: 'SUP-003',
    blockingCareIds: ['CARE-002'],
    blockingPromiseIds: [],
    proposalState: 'blocked_recovery',
  },
  'DOOR-003': {
    relationshipId: 'SYN-002',
    journeyId: 'JRN-002',
    consentId: 'CNS-002',
    suppressionId: 'SUP-002',
    blockingCareIds: [],
    blockingPromiseIds: ['PROM-002'],
    proposalState: 'blocked_promise',
  },
  'DOOR-004': {
    relationshipId: 'SYN-007',
    journeyId: 'JRN-010',
    consentId: 'CNS-007',
    suppressionId: 'SUP-007',
    blockingCareIds: [],
    blockingPromiseIds: [],
    proposalState: 'blocked_consent',
  },
  'DOOR-005': {
    relationshipId: 'SYN-005',
    journeyId: 'JRN-008',
    consentId: 'CNS-005',
    suppressionId: 'SUP-005',
    blockingCareIds: [],
    blockingPromiseIds: [],
    proposalState: 'blocked_suppression',
  },
  'DOOR-006': {
    relationshipId: 'SYN-016',
    journeyId: 'JRN-023',
    consentId: 'CNS-016',
    suppressionId: 'SUP-016',
    blockingCareIds: [],
    blockingPromiseIds: [],
    proposalState: 'founder_deferred',
  },
} as const;

// ---------------------------------------------------------------------------
// F. Today Queue IDs with Relationship, Journey, Care, Promise and Door
//    links — manifest §A (Today Queue Items: 18)
// ---------------------------------------------------------------------------

export const TODAY_QUEUE_IDS = [
  'Q-001', 'Q-002', 'Q-003', 'Q-004', 'Q-005', 'Q-006',
  'Q-007', 'Q-008', 'Q-009', 'Q-010', 'Q-011', 'Q-012',
  'Q-013', 'Q-014', 'Q-015', 'Q-016', 'Q-017', 'Q-018',
] as const;

export type TodayQueueId = (typeof TODAY_QUEUE_IDS)[number];

export const PRIORITY_BUCKETS = [
  'Safety & Recovery',
  'Founder Gate',
  'Promise & Deadline',
  'Care & Support',
  'Waiting & Deliberate Silence',
  'Next Door Review',
] as const;

export type PriorityBucket = (typeof PRIORITY_BUCKETS)[number];

export interface TodayQueueRecord {
  readonly priorityBucket: PriorityBucket;
  readonly relationshipId: RelationshipId;
  readonly journeyId: JourneyId;
  readonly careId: CareId | null;
  readonly promiseId: PromiseId | null;
  readonly doorId: DoorId | null;
}

export const TODAY_QUEUE_MANIFEST: Readonly<Record<TodayQueueId, TodayQueueRecord>> = {
  'Q-001': { priorityBucket: 'Safety & Recovery', relationshipId: 'SYN-004', journeyId: 'JRN-006', careId: 'CARE-003', promiseId: null, doorId: null },
  'Q-002': { priorityBucket: 'Safety & Recovery', relationshipId: 'SYN-013', journeyId: 'JRN-019', careId: 'CARE-007', promiseId: 'PROM-007', doorId: null },
  'Q-003': { priorityBucket: 'Safety & Recovery', relationshipId: 'SYN-002', journeyId: 'JRN-003', careId: 'CARE-001', promiseId: 'PROM-002', doorId: 'DOOR-003' },
  'Q-004': { priorityBucket: 'Founder Gate', relationshipId: 'SYN-001', journeyId: 'JRN-001', careId: null, promiseId: 'PROM-001', doorId: null },
  'Q-005': { priorityBucket: 'Founder Gate', relationshipId: 'SYN-008', journeyId: 'JRN-012', careId: null, promiseId: 'PROM-003', doorId: null },
  'Q-006': { priorityBucket: 'Founder Gate', relationshipId: 'SYN-010', journeyId: 'JRN-015', careId: null, promiseId: 'PROM-004', doorId: null },
  'Q-007': { priorityBucket: 'Promise & Deadline', relationshipId: 'SYN-002', journeyId: 'JRN-003', careId: 'CARE-001', promiseId: 'PROM-002', doorId: 'DOOR-003' },
  'Q-008': { priorityBucket: 'Promise & Deadline', relationshipId: 'SYN-011', journeyId: 'JRN-016', careId: null, promiseId: 'PROM-005', doorId: null },
  'Q-009': { priorityBucket: 'Promise & Deadline', relationshipId: 'SYN-012', journeyId: 'JRN-017', careId: null, promiseId: 'PROM-006', doorId: null },
  'Q-010': { priorityBucket: 'Care & Support', relationshipId: 'SYN-003', journeyId: 'JRN-004', careId: 'CARE-002', promiseId: null, doorId: 'DOOR-002' },
  'Q-011': { priorityBucket: 'Care & Support', relationshipId: 'SYN-009', journeyId: 'JRN-014', careId: 'CARE-006', promiseId: null, doorId: null },
  'Q-012': { priorityBucket: 'Care & Support', relationshipId: 'SYN-007', journeyId: 'JRN-010', careId: 'CARE-005', promiseId: null, doorId: 'DOOR-004' },
  'Q-013': { priorityBucket: 'Waiting & Deliberate Silence', relationshipId: 'SYN-005', journeyId: 'JRN-008', careId: 'CARE-004', promiseId: null, doorId: 'DOOR-005' },
  'Q-014': { priorityBucket: 'Waiting & Deliberate Silence', relationshipId: 'SYN-014', journeyId: 'JRN-020', careId: 'CARE-008', promiseId: 'PROM-008', doorId: null },
  'Q-015': { priorityBucket: 'Waiting & Deliberate Silence', relationshipId: 'SYN-016', journeyId: 'JRN-023', careId: 'CARE-010', promiseId: 'PROM-010', doorId: 'DOOR-006' },
  'Q-016': { priorityBucket: 'Next Door Review', relationshipId: 'SYN-006', journeyId: 'JRN-009', careId: null, promiseId: null, doorId: 'DOOR-001' },
  'Q-017': { priorityBucket: 'Next Door Review', relationshipId: 'SYN-015', journeyId: 'JRN-021', careId: 'CARE-009', promiseId: 'PROM-009', doorId: null },
  'Q-018': { priorityBucket: 'Next Door Review', relationshipId: 'SYN-016', journeyId: 'JRN-023', careId: 'CARE-010', promiseId: 'PROM-010', doorId: 'DOOR-006' },
} as const;

// ---------------------------------------------------------------------------
// G. Consent IDs, CNS-001 through CNS-016
// ---------------------------------------------------------------------------

export const CONSENT_RECORD_IDS = [
  'CNS-001', 'CNS-002', 'CNS-003', 'CNS-004', 'CNS-005', 'CNS-006',
  'CNS-007', 'CNS-008', 'CNS-009', 'CNS-010', 'CNS-011', 'CNS-012',
  'CNS-013', 'CNS-014', 'CNS-015', 'CNS-016',
] as const;

export type ConsentRecordId = (typeof CONSENT_RECORD_IDS)[number];

// ---------------------------------------------------------------------------
// H. Suppression IDs, SUP-001 through SUP-016
// ---------------------------------------------------------------------------

export const SUPPRESSION_RECORD_IDS = [
  'SUP-001', 'SUP-002', 'SUP-003', 'SUP-004', 'SUP-005', 'SUP-006',
  'SUP-007', 'SUP-008', 'SUP-009', 'SUP-010', 'SUP-011', 'SUP-012',
  'SUP-013', 'SUP-014', 'SUP-015', 'SUP-016',
] as const;

export type SuppressionRecordId = (typeof SUPPRESSION_RECORD_IDS)[number];

/**
 * Ownership: manifest §B establishes a consistent one-to-one numeric
 * correspondence between Relationship, Consent Record and Suppression
 * Record for every pair it names explicitly (CNS-002/SUP-002 <-> SYN-002,
 * CNS-003/SUP-003 <-> SYN-003, CNS-005/SUP-005 <-> SYN-005,
 * CNS-006/SUP-006 <-> SYN-006, CNS-007/SUP-007 <-> SYN-007,
 * CNS-016/SUP-016 <-> SYN-016 — zero exceptions). Applied uniformly across
 * all 16 as the sole ownership rule; this is a structural transcription of
 * the manifest's own numbering convention, not a reinterpretation of it.
 */
export const CONSENT_OWNERSHIP: Readonly<Record<ConsentRecordId, RelationshipId>> = {
  'CNS-001': 'SYN-001',
  'CNS-002': 'SYN-002',
  'CNS-003': 'SYN-003',
  'CNS-004': 'SYN-004',
  'CNS-005': 'SYN-005',
  'CNS-006': 'SYN-006',
  'CNS-007': 'SYN-007',
  'CNS-008': 'SYN-008',
  'CNS-009': 'SYN-009',
  'CNS-010': 'SYN-010',
  'CNS-011': 'SYN-011',
  'CNS-012': 'SYN-012',
  'CNS-013': 'SYN-013',
  'CNS-014': 'SYN-014',
  'CNS-015': 'SYN-015',
  'CNS-016': 'SYN-016',
} as const;

export const SUPPRESSION_OWNERSHIP: Readonly<Record<SuppressionRecordId, RelationshipId>> = {
  'SUP-001': 'SYN-001',
  'SUP-002': 'SYN-002',
  'SUP-003': 'SYN-003',
  'SUP-004': 'SYN-004',
  'SUP-005': 'SYN-005',
  'SUP-006': 'SYN-006',
  'SUP-007': 'SYN-007',
  'SUP-008': 'SYN-008',
  'SUP-009': 'SYN-009',
  'SUP-010': 'SYN-010',
  'SUP-011': 'SYN-011',
  'SUP-012': 'SYN-012',
  'SUP-013': 'SYN-013',
  'SUP-014': 'SYN-014',
  'SUP-015': 'SYN-015',
  'SUP-016': 'SYN-016',
} as const;

export const SUPPRESSION_STATUSES = ['inactive', 'active_30d'] as const;
export type SuppressionStatus = (typeof SUPPRESSION_STATUSES)[number];

export const CONSENT_FLAGS = ['unclear'] as const;
export type ConsentFlag = (typeof CONSENT_FLAGS)[number];

/**
 * Only the records manifest §B explicitly annotates with a suppression
 * status are included here. Records not named in §B carry no
 * manifest-stated status and must not be inferred as active or inactive.
 */
export const KNOWN_SUPPRESSION_STATUS: Readonly<Partial<Record<SuppressionRecordId, SuppressionStatus>>> = {
  'SUP-002': 'inactive',
  'SUP-003': 'inactive',
  'SUP-005': 'active_30d',
  'SUP-006': 'inactive',
  'SUP-007': 'inactive',
  'SUP-016': 'inactive',
} as const;

/**
 * Only the record manifest §B explicitly flags is included here (CNS-007
 * "unclear"). Records not flagged there carry no manifest-stated qualifier
 * and must not be inferred as clear.
 */
export const KNOWN_CONSENT_FLAGS: Readonly<Partial<Record<ConsentRecordId, ConsentFlag>>> = {
  'CNS-007': 'unclear',
} as const;

// ---------------------------------------------------------------------------
// I. Timeline allocation counts — manifest §C "Timeline count" column,
//    totaling exactly 42
// ---------------------------------------------------------------------------

export const TIMELINE_EVENT_COUNTS: Readonly<Record<RelationshipId, number>> = {
  'SYN-001': 3,
  'SYN-002': 4,
  'SYN-003': 3,
  'SYN-004': 3,
  'SYN-005': 2,
  'SYN-006': 2,
  'SYN-007': 3,
  'SYN-008': 3,
  'SYN-009': 2,
  'SYN-010': 2,
  'SYN-011': 2,
  'SYN-012': 2,
  'SYN-013': 3,
  'SYN-014': 2,
  'SYN-015': 3,
  'SYN-016': 3,
} as const;

export const TIMELINE_EVENT_TOTAL = 42 as const;

// ---------------------------------------------------------------------------
// J. Scenario Presets — four, deterministic
// ---------------------------------------------------------------------------

export const SCENARIO_PRESETS = ['quiet', 'normal', 'peak', 'recovery'] as const;
export type ScenarioPreset = (typeof SCENARIO_PRESETS)[number];

// ---------------------------------------------------------------------------
// K. Expected manifest totals — manifest §D "Locked totals"
// ---------------------------------------------------------------------------

export const EXPECTED_MANIFEST_TOTALS = {
  relationships: RELATIONSHIP_IDS.length,
  journeys: JOURNEY_IDS.length,
  care: CARE_IDS.length,
  promises: PROMISE_IDS.length,
  doors: DOOR_IDS.length,
  todayQueue: TODAY_QUEUE_IDS.length,
  consentRecords: CONSENT_RECORD_IDS.length,
  suppressionRecords: SUPPRESSION_RECORD_IDS.length,
  timelineEvents: TIMELINE_EVENT_TOTAL,
  scenarioPresets: SCENARIO_PRESETS.length,
} as const;

export type ExpectedManifestTotals = typeof EXPECTED_MANIFEST_TOTALS;

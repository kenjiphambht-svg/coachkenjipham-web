/**
 * Provider-free local tool boundary for a future Founder assistant.
 * Every tool is a pure selector over synthetic truth. There is no AI SDK,
 * model routing, HTTP, provider import, secret, or write capability here.
 */

import { TODAY_QUEUE_MANIFEST as TODAY_MANIFEST, type CareId, type JourneyId, type RelationshipId, type TodayQueueId } from './review-manifest';
import { CARE_RECORDS, JOURNEY_RECORDS, PROMISE_RECORDS, TODAY_QUEUE_DETAILS } from './review-universe';
import {
  getActionFirstTodayItems,
  getCareCasesForRelationship,
  getDoorBlockers,
  getDoorForRelationship,
  getJourneysForRelationship,
  getPromisesForRelationship,
  getProductLinesForRelationship,
  getTodayItemsForProduct,
  isTodayItemBlocked,
  journeyMatchesProductLens,
  resolveCareContext,
  resolveJourneyContext,
  resolveProductLens,
  resolveRelationshipContext,
  type ProductLensId,
  type ScenarioPreset,
} from './review-selectors';
import { getRoomFixtureForRelationship } from './review-room-fixtures';

export type FounderAssistantToolName =
  | 'get_today_priorities'
  | 'get_relationship_context'
  | 'get_product_context'
  | 'get_reading_room_status'
  | 'get_open_care_cases'
  | 'get_due_promises'
  | 'get_door_blockers'
  | 'get_missing_decision_facts';

export interface FounderAssistantContext {
  readonly scenario: ScenarioPreset;
  readonly product: ProductLensId;
  readonly workspace: 'today' | 'relationships' | 'journeys' | 'care' | 'room';
  readonly relationshipId?: RelationshipId | null;
  readonly journeyId?: JourneyId | null;
  readonly careId?: CareId | null;
}

export interface ToolEvidence<T> {
  readonly tool: FounderAssistantToolName;
  readonly evidenceIds: readonly string[];
  readonly data: T;
}

export function getTodayPriorities(
  context: Pick<FounderAssistantContext, 'scenario' | 'product'>
): ToolEvidence<readonly { id: TodayQueueId; relationshipId: RelationshipId; journeyId: JourneyId; whyNow: string; blocked: boolean }[]> {
  const data = getActionFirstTodayItems(context.scenario, context.product).map((id) => {
    const manifest = requireTodayManifest(id);
    return {
      id,
      relationshipId: manifest.relationshipId,
      journeyId: manifest.journeyId,
      whyNow: TODAY_QUEUE_DETAILS[id].whyNow,
      blocked: isTodayItemBlocked(id),
    };
  });
  return { tool: 'get_today_priorities', evidenceIds: data.map((item) => item.id), data };
}

function requireTodayManifest(id: TodayQueueId) {
  // Late import is intentionally avoided; this helper keeps the return type narrow.
  return TODAY_MANIFEST[id];
}

export function getRelationshipContextTool(
  relationshipId: unknown
): ToolEvidence<NonNullable<ReturnType<typeof resolveRelationshipContext>> | null> {
  const relationship = resolveRelationshipContext(relationshipId);
  return {
    tool: 'get_relationship_context',
    evidenceIds: relationship ? [relationship.id, ...getJourneysForRelationship(relationship.id).map((j) => j.id)] : [],
    data: relationship ?? null,
  };
}

export function getProductContext(
  context: Pick<FounderAssistantContext, 'scenario' | 'product'>
): ToolEvidence<{ product: ProductLensId; journeyIds: readonly JourneyId[]; todayIds: readonly TodayQueueId[] }> {
  const product = resolveProductLens(context.product);
  const journeyIds = Object.values(JOURNEY_RECORDS).filter((j) => journeyMatchesProductLens(j, product)).map((j) => j.id);
  const todayIds = getTodayItemsForProduct(context.scenario, product);
  return { tool: 'get_product_context', evidenceIds: [...journeyIds, ...todayIds], data: { product, journeyIds, todayIds } };
}

export function getReadingRoomStatus(relationshipId: unknown): ToolEvidence<ReturnType<typeof getRoomFixtureForRelationship> | null> {
  const room = getRoomFixtureForRelationship(relationshipId);
  return { tool: 'get_reading_room_status', evidenceIds: room ? [room.id, room.relationshipId, room.journeyId] : [], data: room ?? null };
}

export function getOpenCareCases(context: FounderAssistantContext): ToolEvidence<readonly typeof CARE_RECORDS[CareId][]> {
  const selectedRelationship = resolveRelationshipContext(context.relationshipId);
  const selectedJourney = resolveJourneyContext(context.journeyId);
  const selectedCare = resolveCareContext(context.careId);
  const data = Object.values(CARE_RECORDS).filter((care) => {
    if (care.status !== 'open') return false;
    if (selectedCare) return care.id === selectedCare.id;
    if (selectedJourney) return care.journeyId === selectedJourney.id;
    if (selectedRelationship) return care.relationshipId === selectedRelationship.id;
    return journeyMatchesProductLens(JOURNEY_RECORDS[care.journeyId], context.product);
  });
  return { tool: 'get_open_care_cases', evidenceIds: data.map((care) => care.id), data };
}

export function getDuePromises(context: FounderAssistantContext) {
  const relationship = resolveRelationshipContext(context.relationshipId);
  const journey = resolveJourneyContext(context.journeyId);
  const data = Object.values(PROMISE_RECORDS).filter((promise) => {
    if (!['overdue', 'due_today'].includes(promise.dueStatus)) return false;
    if (journey) return promise.journeyId === journey.id;
    if (relationship) return promise.relationshipId === relationship.id;
    return journeyMatchesProductLens(JOURNEY_RECORDS[promise.journeyId], context.product);
  });
  return { tool: 'get_due_promises' as const, evidenceIds: data.map((promise) => promise.id), data };
}

export function getDoorBlockersTool(relationshipId: unknown) {
  const door = getDoorForRelationship(relationshipId);
  const result = door ? getDoorBlockers(door.id) : undefined;
  return {
    tool: 'get_door_blockers' as const,
    evidenceIds: door ? [door.id, ...door.blockingCareIds, ...door.blockingPromiseIds] : [],
    data: door && result ? { door, result } : null,
  };
}

export function getMissingDecisionFacts(relationshipId: unknown) {
  const relationship = resolveRelationshipContext(relationshipId);
  if (!relationship) return { tool: 'get_missing_decision_facts' as const, evidenceIds: [], data: [] as readonly string[] };
  const journeys = getJourneysForRelationship(relationship.id);
  const openCare = getCareCasesForRelationship(relationship.id).filter((care) => care.status === 'open');
  const duePromises = getPromisesForRelationship(relationship.id).filter((promise) => promise.dueStatus === 'overdue');
  const door = getDoorForRelationship(relationship.id);
  const missing = [
    ...journeys.filter((journey) => journey.blocked).map((journey) => `${journey.id}: ${journey.blockedReason}`),
    ...openCare.map((care) => `${care.id}: cần đóng Care/Recovery trước Offer`),
    ...duePromises.map((promise) => `${promise.id}: lời hứa quá hạn`),
    ...(door && getDoorBlockers(door.id)?.blocked ? [`${door.id}: cánh cửa đang bị chặn`] : []),
  ];
  const evidenceIds = [
    relationship.id,
    ...journeys.map((journey) => journey.id),
    ...openCare.map((care) => care.id),
    ...duePromises.map((promise) => promise.id),
    ...(door ? [door.id] : []),
  ];
  return { tool: 'get_missing_decision_facts' as const, evidenceIds, data: missing };
}

export function getContextProductLines(context: FounderAssistantContext): readonly string[] {
  return context.relationshipId ? getProductLinesForRelationship(context.relationshipId) : [];
}

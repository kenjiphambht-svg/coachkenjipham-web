// ============================================================
// Today item review drawer — WP3.5-A2 Package C3.
//
// Takes a single `todayId` prop (kept as an explicit, controlled prop
// rather than something only reachable via a simulated click) so it can be
// unit-tested by direct render, since this repo has no jsdom/happy-dom for
// DOM-interaction testing.
//
// Shows linked Relationship, Journey, Care, Promise and Door proposal
// (when one exists), a relevant timeline excerpt, the allowed simulated
// actions, and navigation to the exact Relationship/Journey/Care routes —
// using only approved synthetic query parameters via buildSafeSyntheticQuery.
// ============================================================

// `React` is imported explicitly for the same reason documented at the top
// of TodayReview.tsx — required for Vitest's esbuild JSX transform.
import React from 'react';
import Link from 'next/link';

import {
  resolveRelationshipContext,
  resolveJourneyContext,
  findLinkedPromiseAndDoor,
  getTimelineEventsForRelationship,
  getDoorBlockers,
  buildSafeSyntheticQuery,
  type ScenarioPreset,
} from '@/lib/wp3-5/review-selectors';
import { TODAY_QUEUE_MANIFEST, type TodayQueueId } from '@/lib/wp3-5/review-manifest';
import { TODAY_QUEUE_DETAILS } from '@/lib/wp3-5/review-universe';
import {
  SIMULATED_ACTION_TYPES,
  SIMULATED_ACTION_LABEL,
  useReviewState,
  getOverlayForItem,
  type SimulatedActionType,
} from './ReviewStateContext';
import styles from './founder-review.module.css';

export interface ReviewItemDrawerProps {
  readonly todayId: TodayQueueId;
  readonly scenario: ScenarioPreset;
  readonly onClose: () => void;
}

export default function ReviewItemDrawer({ todayId, scenario, onClose }: ReviewItemDrawerProps) {
  const { state, dispatch } = useReviewState();
  const manifestItem = TODAY_QUEUE_MANIFEST[todayId];
  const detail = TODAY_QUEUE_DETAILS[todayId];
  const relationship = resolveRelationshipContext(manifestItem.relationshipId);
  const journey = resolveJourneyContext(manifestItem.journeyId);
  const { promise, door } = findLinkedPromiseAndDoor(todayId);
  const doorEligibility = door ? getDoorBlockers(door.id) : undefined;
  const timeline = relationship ? getTimelineEventsForRelationship(relationship.id) : [];
  const overlay = getOverlayForItem(state, todayId);

  const relationshipHref = relationship
    ? { pathname: '/founder-review/quan-he', query: buildSafeSyntheticQuery({ scenario, relationship: relationship.id }) }
    : undefined;
  const journeyHref = journey
    ? { pathname: '/founder-review/hanh-trinh', query: buildSafeSyntheticQuery({ scenario, journey: journey.id }) }
    : undefined;
  const careHref = manifestItem.careId
    ? { pathname: '/founder-review/cham-soc', query: buildSafeSyntheticQuery({ scenario, care: manifestItem.careId }) }
    : undefined;

  function applyAction(action: SimulatedActionType) {
    dispatch({ type: 'APPLY_ACTION', itemId: todayId, action });
  }

  return (
    <>
      <div className={styles.drawerBackdrop} onClick={onClose} role="presentation" />
      <aside
        className={`${styles.drawerPanel} px-5 py-6`}
        role="dialog"
        aria-label={`Chi tiết ${todayId}`}
        data-testid="review-item-drawer"
      >
        <button
          type="button"
          onClick={onClose}
          className="font-sans text-[13px] text-e26-text-2 underline underline-offset-4 hover:text-e26-gold-deep mb-4"
        >
          Đóng
        </button>

        <h2 className="font-serif text-[20px] text-e26-text mb-1">{todayId}</h2>
        <p className="font-sans text-[13px] text-e26-text-2 mb-4">{manifestItem.priorityBucket}</p>

        {relationship && (
          <section className="mb-4">
            <h3 className="font-sans text-[12px] uppercase tracking-[0.12em] text-e26-text-2 mb-1">Quan hệ</h3>
            <p className="font-serif text-[16px] text-e26-text">
              {relationship.displayName} · {relationship.id}
            </p>
            <p className="font-sans text-[13px] text-e26-text-2 mt-1">{relationship.currentOperatingTruth}</p>
            {relationshipHref && (
              <Link
                href={relationshipHref}
                className="inline-block mt-2 font-sans text-[13px] underline underline-offset-4 text-e26-text hover:text-e26-gold-deep"
              >
                Mở Quan hệ →
              </Link>
            )}
          </section>
        )}

        {journey && (
          <section className="mb-4">
            <h3 className="font-sans text-[12px] uppercase tracking-[0.12em] text-e26-text-2 mb-1">Hành trình</h3>
            <p className="font-serif text-[15px] text-e26-text">
              {journey.id} · {journey.productLine}
            </p>
            <p className="font-sans text-[13px] text-e26-text-2 mt-1">Now: {journey.now}</p>
            <p className="font-sans text-[13px] text-e26-text-2 mt-1">Next: {journey.next}</p>
            <p className="font-sans text-[13px] text-e26-text-2 mt-1">
              Owner: {journey.owner} · Due: {journey.due}
            </p>
            {journeyHref && (
              <Link
                href={journeyHref}
                className="inline-block mt-2 font-sans text-[13px] underline underline-offset-4 text-e26-text hover:text-e26-gold-deep"
              >
                Mở Hành trình →
              </Link>
            )}
          </section>
        )}

        {manifestItem.careId && (
          <section className="mb-4">
            <h3 className="font-sans text-[12px] uppercase tracking-[0.12em] text-e26-text-2 mb-1">Care</h3>
            <p className="font-sans text-[13px] text-e26-text-2">{manifestItem.careId}</p>
            {careHref && (
              <Link
                href={careHref}
                className="inline-block mt-2 font-sans text-[13px] underline underline-offset-4 text-e26-text hover:text-e26-gold-deep"
              >
                Mở Chăm sóc →
              </Link>
            )}
          </section>
        )}

        {promise && (
          <section className="mb-4">
            <h3 className="font-sans text-[12px] uppercase tracking-[0.12em] text-e26-text-2 mb-1">Lời hứa</h3>
            <p className="font-sans text-[13px] text-e26-text-2">{promise.promiseText}</p>
            <p className="font-sans text-[13px] text-e26-text-2 mt-1">Trạng thái: {promise.dueStatus}</p>
          </section>
        )}

        <section className="mb-4">
          <h3 className="font-sans text-[12px] uppercase tracking-[0.12em] text-e26-text-2 mb-1">Cánh cửa tiếp theo</h3>
          {door ? (
            <>
              <p className="font-sans text-[13px] text-e26-text-2">{door.proposedDoor}</p>
              <p className="font-sans text-[13px] text-e26-text-2 mt-1">
                Trạng thái: {door.proposalState} · {doorEligibility?.blocked ? 'Đang bị chặn' : 'Không bị chặn'}
              </p>
              {doorEligibility && doorEligibility.reasons.length > 0 && (
                <ul className="mt-1 list-disc list-inside font-sans text-[12px] text-e26-text-2">
                  {doorEligibility.reasons.map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <p className="font-sans text-[13px] text-e26-text-2">Chưa có đề xuất Cánh cửa tiếp theo chính thức.</p>
          )}
        </section>

        {timeline.length > 0 && (
          <section className="mb-4">
            <h3 className="font-sans text-[12px] uppercase tracking-[0.12em] text-e26-text-2 mb-1">Timeline (trích)</h3>
            <ul className="space-y-1 font-sans text-[13px] text-e26-text-2">
              {timeline.slice(0, 5).map((event) => (
                <li key={event.id}>
                  {event.order}. {event.type}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mb-2">
          <h3 className="font-sans text-[12px] uppercase tracking-[0.12em] text-e26-text-2 mb-2">
            Hành động mô phỏng
          </h3>
          <p className="font-sans text-[12px] text-e26-text-2 mb-2">Mô phỏng — Không lưu — Không gửi</p>
          <div className="flex flex-wrap gap-2">
            {SIMULATED_ACTION_TYPES.map((action) => (
              <button
                key={action}
                type="button"
                onClick={() => applyAction(action)}
                className="border border-e26-border px-3 py-2 font-sans text-[13px] hover:bg-e26-cream text-e26-text"
              >
                {SIMULATED_ACTION_LABEL[action]}
              </button>
            ))}
          </div>
          {overlay && (
            <p className="font-sans text-[12px] text-e26-text-2 mt-2" data-testid="drawer-overlay-status">
              Đã mô phỏng: {overlay.actions.map((a) => SIMULATED_ACTION_LABEL[a]).join(', ')} (chỉ trong phiên này)
            </p>
          )}
        </section>

        <p className="font-sans text-[11px] text-e26-text-2 mt-4 pt-4 border-t border-e26-border">{detail.riskOrDeadlineFact}</p>
      </aside>
    </>
  );
}

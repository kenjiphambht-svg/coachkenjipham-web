// ============================================================
// Hôm nay screen — WP3.5-A2 Package C3.
//
// Six locked priority buckets, in locked order, showing every Today Queue
// item for the current scenario. All filtering is client-local (useState);
// nothing is written outside React memory. Clicking an item opens
// ReviewItemDrawer with full canonical context.
//
// `initialScenario` / `initialOpenItemId` are accepted as props (not only
// derived from the URL) specifically so this component is directly
// render-testable without simulating a click — this repo has no
// jsdom/happy-dom installed.
// ============================================================

// `React` is imported explicitly (in addition to the named hooks) even
// though Next's own build uses the automatic JSX runtime and never needs
// it: this repo's vitest.config.mts has no @vitejs/plugin-react, so
// Vitest's esbuild JSX transform falls back to classic mode, which
// requires `React` in scope in every file containing JSX. Harmless under
// Next; required under Vitest.
import React, { useMemo, useState } from 'react';

import {
  resolveRelationshipContext,
  getDoorBlockers,
  type ScenarioPreset,
} from '@/lib/wp3-5/review-selectors';
import { PRIORITY_BUCKETS, TODAY_QUEUE_MANIFEST, type TodayQueueId, type PriorityBucket } from '@/lib/wp3-5/review-manifest';
import { TODAY_QUEUE_DETAILS, SCENARIO_PRESET_ITEMS } from '@/lib/wp3-5/review-universe';
import ReviewFilters, { type TodayFiltersState, type BlockedFilter } from './ReviewFilters';
import ReviewItemDrawer from './ReviewItemDrawer';
import { ReviewStateProvider, useReviewState } from './ReviewStateContext';

function isItemBlocked(itemId: TodayQueueId): boolean {
  const manifestItem = TODAY_QUEUE_MANIFEST[itemId];
  if (manifestItem.doorId) {
    return getDoorBlockers(manifestItem.doorId)?.blocked ?? TODAY_QUEUE_DETAILS[itemId].offerBlocked;
  }
  return TODAY_QUEUE_DETAILS[itemId].offerBlocked;
}

function bucketLabel(bucket: PriorityBucket): string {
  const RENAME: Record<PriorityBucket, string> = {
    'Safety & Recovery': 'Safety & Recovery',
    'Founder Gate': 'Founder Decision',
    'Promise & Deadline': 'Promise / Deadline',
    'Care & Support': 'Care Follow-up',
    'Waiting & Deliberate Silence': 'Deliberate Silence',
    'Next Door Review': 'Next Door Review',
  };
  return RENAME[bucket];
}

function TodayReviewInner({
  initialScenario,
  initialOpenItemId = null,
}: {
  initialScenario: ScenarioPreset;
  initialOpenItemId?: TodayQueueId | null;
}) {
  const [filters, setFilters] = useState<TodayFiltersState>({
    scenario: initialScenario,
    bucket: 'all',
    owner: 'all',
    blocked: 'all',
    search: '',
  });
  const [openItemId, setOpenItemId] = useState<TodayQueueId | null>(initialOpenItemId);
  const { state: overlayState, dispatch: overlayDispatch } = useReviewState();
  const overlayCount = Object.keys(overlayState).length;

  const scenarioItemIds = SCENARIO_PRESET_ITEMS[filters.scenario];

  const owners = useMemo(() => {
    const set = new Set<string>();
    for (const id of scenarioItemIds) set.add(TODAY_QUEUE_DETAILS[id].owner);
    return [...set].sort();
  }, [scenarioItemIds]);

  const filteredIds = useMemo(() => {
    const search = filters.search.trim().toLowerCase();
    return scenarioItemIds.filter((id) => {
      const manifestItem = TODAY_QUEUE_MANIFEST[id];
      const detail = TODAY_QUEUE_DETAILS[id];
      if (filters.bucket !== 'all' && manifestItem.priorityBucket !== filters.bucket) return false;
      if (filters.owner !== 'all' && detail.owner !== filters.owner) return false;
      const blocked = isItemBlocked(id);
      if (filters.blocked === 'blocked' && !blocked) return false;
      if (filters.blocked === 'unblocked' && blocked) return false;
      if (search) {
        const relationship = resolveRelationshipContext(manifestItem.relationshipId);
        const haystack = `${manifestItem.relationshipId} ${relationship?.displayName ?? ''}`.toLowerCase();
        if (!haystack.includes(search)) return false;
      }
      return true;
    });
  }, [scenarioItemIds, filters]);

  function onFiltersChange(next: Partial<TodayFiltersState>) {
    setFilters((prev) => ({ ...prev, ...next }));
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <p className="font-sans text-[12px] text-e26-text-2" data-testid="overlay-count">
          {overlayCount > 0 ? `${overlayCount} việc đã có hành động mô phỏng trong phiên này.` : 'Chưa có hành động mô phỏng nào trong phiên này.'}
        </p>
        <button
          type="button"
          onClick={() => overlayDispatch({ type: 'RESET' })}
          className="font-sans text-[13px] underline underline-offset-4 text-e26-text-2 hover:text-e26-gold-deep"
          data-testid="reset-simulation"
        >
          Reset mô phỏng
        </button>
      </div>

      <ReviewFilters filters={filters} owners={owners} onChange={onFiltersChange} />

      <div className="space-y-8">
        {PRIORITY_BUCKETS.map((bucket) => {
          const bucketIds = filteredIds.filter((id) => TODAY_QUEUE_MANIFEST[id].priorityBucket === bucket);
          if (bucketIds.length === 0) return null;
          return (
            <section key={bucket} data-testid={`bucket-${bucket}`}>
              <h2 className="font-serif text-[18px] text-e26-text mb-3">{bucketLabel(bucket)}</h2>
              <div className="space-y-3">
                {bucketIds.map((id) => {
                  const manifestItem = TODAY_QUEUE_MANIFEST[id];
                  const detail = TODAY_QUEUE_DETAILS[id];
                  const relationship = resolveRelationshipContext(manifestItem.relationshipId);
                  const blocked = isItemBlocked(id);
                  return (
                    <article
                      key={id}
                      className="border border-e26-border bg-e26-white p-4 cursor-pointer hover:border-e26-gold-deep transition-colors"
                      onClick={() => setOpenItemId(id)}
                      data-testid={`today-item-${id}`}
                      data-relationship={manifestItem.relationshipId}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <span className="font-sans text-[12px] uppercase tracking-[0.1em] text-e26-text-2">
                          {id} · {relationship?.displayName} · {relationship?.id}
                        </span>
                        {blocked && (
                          <span className="border border-e26-border bg-e26-cream px-2 py-1 font-sans text-[11px] text-e26-text-2">
                            Đang bị chặn
                          </span>
                        )}
                      </div>
                      <p className="font-sans text-[13px] text-e26-text-2 mt-1">
                        Hành trình: {manifestItem.journeyId} · Owner: {detail.owner} · Due: {detail.riskOrDeadlineFact}
                      </p>
                      <p className="font-sans text-[14px] mt-2">{detail.whatHappened}</p>
                      {!manifestItem.doorId && bucket === 'Next Door Review' && (
                        <p className="font-sans text-[12px] text-e26-text-2 mt-1" data-testid={`no-door-${id}`}>
                          Không có đề xuất Cánh cửa tiếp theo chính thức.
                        </p>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {openItemId && (
        <ReviewItemDrawer todayId={openItemId} scenario={filters.scenario} onClose={() => setOpenItemId(null)} />
      )}
    </div>
  );
}

export interface TodayReviewProps {
  readonly initialScenario: ScenarioPreset;
  readonly initialOpenItemId?: TodayQueueId | null;
}

export default function TodayReview(props: TodayReviewProps) {
  return (
    <ReviewStateProvider>
      <TodayReviewInner {...props} />
    </ReviewStateProvider>
  );
}

export type { BlockedFilter };

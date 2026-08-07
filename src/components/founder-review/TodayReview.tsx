// ============================================================
// Hôm nay screen — WP3.5-A2 clarity milestone.
//
// Six locked priority buckets, in locked order, showing every Today Queue
// item for the current scenario. All filtering is client-local (useState);
// nothing is written outside React memory. Clicking an item opens
// ReviewItemDrawer with full canonical context.
//
// `ReviewStateProvider` now lives in FounderReviewShell (shared across all
// four workspaces so AI Trợ lý and Thiết lập phiên can reach the same
// simulated-action overlay), so this component only *consumes*
// `useReviewState()` — it no longer wraps itself in a Provider.
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
import React, { useEffect, useMemo, useState } from 'react';

import { resolveRelationshipContext, isTodayItemBlocked, type ScenarioPreset } from '@/lib/wp3-5/review-selectors';
import { PRIORITY_BUCKETS, TODAY_QUEUE_MANIFEST, type TodayQueueId, type PriorityBucket } from '@/lib/wp3-5/review-manifest';
import { TODAY_QUEUE_DETAILS, SCENARIO_PRESET_ITEMS } from '@/lib/wp3-5/review-universe';
import ReviewFilters, { type TodayFiltersState, type BlockedFilter } from './ReviewFilters';
import ReviewItemDrawer from './ReviewItemDrawer';
import { useReviewState } from './ReviewStateContext';
import { useReviewPreferences } from './SessionPreferencesContext';
import { Badge } from './founder-review-ui';

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

export interface TodayReviewProps {
  readonly initialScenario: ScenarioPreset;
  readonly initialOpenItemId?: TodayQueueId | null;
}

export default function TodayReview({ initialScenario, initialOpenItemId = null }: TodayReviewProps) {
  const [filters, setFilters] = useState<TodayFiltersState>({
    scenario: initialScenario,
    bucket: 'all',
    owner: 'all',
    blocked: 'all',
    search: '',
  });
  const [openItemId, setOpenItemId] = useState<TodayQueueId | null>(initialOpenItemId);

  // `initialScenario` is only used to seed local state on first mount. The
  // Thiết lập phiên scenario switcher navigates to this same pathname with a
  // new `?scenario=` (a same-page client-side transition, not a remount),
  // so without this sync the SSR-derived summary tiles (owned by the page)
  // would show the new scenario while the bucket list below kept rendering
  // the previous one. Re-sync scenario only — other filters (bucket, owner,
  // blocked, search) are left as the Founder set them, matching how
  // changing scenario via the Scenario dropdown already behaves.
  useEffect(() => {
    setFilters((prev) => (prev.scenario === initialScenario ? prev : { ...prev, scenario: initialScenario }));
  }, [initialScenario]);

  const { state: overlayState, dispatch: overlayDispatch } = useReviewState();
  const { state: prefs } = useReviewPreferences();
  const [collapsed, setCollapsed] = useState<Partial<Record<PriorityBucket, boolean>>>({});
  const overlayCount = Object.keys(overlayState).length;
  const cardPad = prefs.density === 'compact' ? 'p-3' : 'p-4';
  const bucketGap = prefs.density === 'compact' ? 'space-y-5' : 'space-y-8';

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
      const blocked = isTodayItemBlocked(id);
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

  // `collapsed[bucket]` stores an explicit "is collapsed" override once the
  // Founder has clicked a bucket; until then it follows the session
  // preference default (Thiết lập phiên → "Mở sẵn các nhóm ưu tiên").
  function isBucketOpen(bucket: PriorityBucket): boolean {
    const override = collapsed[bucket];
    return override === undefined ? prefs.bucketsExpandedByDefault : !override;
  }

  function toggleBucket(bucket: PriorityBucket) {
    setCollapsed((prev) => ({ ...prev, [bucket]: isBucketOpen(bucket) }));
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <p className="font-sans text-[12px] font-medium text-e26-text-2" data-testid="overlay-count">
          {overlayCount > 0
            ? `${overlayCount} việc đã có hành động mô phỏng trong phiên này.`
            : 'Chưa có hành động mô phỏng nào trong phiên này.'}
        </p>
        <button
          type="button"
          onClick={() => overlayDispatch({ type: 'RESET' })}
          className="font-sans text-[13px] font-semibold underline underline-offset-4 text-e26-text-2 hover:text-e26-gold-deep"
          data-testid="reset-simulation"
        >
          Reset mô phỏng
        </button>
      </div>

      <ReviewFilters filters={filters} owners={owners} onChange={onFiltersChange} />

      <div className={bucketGap}>
        {PRIORITY_BUCKETS.map((bucket) => {
          const bucketIds = filteredIds.filter((id) => TODAY_QUEUE_MANIFEST[id].priorityBucket === bucket);
          if (bucketIds.length === 0) return null;
          const open = isBucketOpen(bucket);
          const bucketBlockedCount = bucketIds.filter((id) => isTodayItemBlocked(id)).length;
          return (
            <section key={bucket} data-testid={`bucket-${bucket}`}>
              <button
                type="button"
                onClick={() => toggleBucket(bucket)}
                className="w-full flex items-center justify-between gap-2 text-left mb-3"
                data-testid={`bucket-toggle-${bucket}`}
                aria-expanded={open}
              >
                <span className="flex items-center gap-2">
                  <h2 className="font-serif text-[19px] font-bold text-e26-black">{bucketLabel(bucket)}</h2>
                  <span className="font-sans text-[12px] font-semibold text-e26-text-2">({bucketIds.length})</span>
                  {bucketBlockedCount > 0 && <Badge variant="blocked">{bucketBlockedCount} bị chặn</Badge>}
                </span>
                <span className="font-sans text-[12px] font-semibold text-e26-text-2">{open ? '−' : '+'}</span>
              </button>
              {open && (
                <div className={prefs.density === 'compact' ? 'space-y-2' : 'space-y-3'}>
                  {bucketIds.map((id) => {
                    const manifestItem = TODAY_QUEUE_MANIFEST[id];
                    const detail = TODAY_QUEUE_DETAILS[id];
                    const relationship = resolveRelationshipContext(manifestItem.relationshipId);
                    const blocked = isTodayItemBlocked(id);
                    return (
                      <article
                        key={id}
                        className={`border-y border-r border-e26-border bg-e26-white ${cardPad} cursor-pointer hover:border-e26-gold-deep transition-colors ${
                          blocked ? 'border-l-4 border-l-e26-black' : 'border-l border-l-e26-border'
                        } ${detail.founderDecisionRequired ? 'ring-1 ring-inset ring-e26-gold-deep' : ''}`}
                        onClick={() => setOpenItemId(id)}
                        data-testid={`today-item-${id}`}
                        data-relationship={manifestItem.relationshipId}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <span className="font-sans text-[15px] font-semibold text-e26-text">
                            {relationship?.displayName} · {relationship?.id}
                          </span>
                          <div className="flex items-center gap-1.5">
                            {detail.founderDecisionRequired && <Badge variant="founder">Founder</Badge>}
                            {blocked && <Badge variant="blocked">Đang bị chặn</Badge>}
                          </div>
                        </div>
                        <p className="font-sans text-[12px] font-medium tabular-nums text-e26-text-2 mt-1">
                          {id} · Hành trình: {manifestItem.journeyId} · Owner: {detail.owner} · Due:{' '}
                          {detail.riskOrDeadlineFact}
                        </p>
                        {prefs.showGuidanceText && (
                          <p className="font-sans text-[14px] font-medium text-e26-text mt-2">{detail.whatHappened}</p>
                        )}
                        {!manifestItem.doorId && bucket === 'Next Door Review' && (
                          <p className="font-sans text-[12px] font-medium text-e26-text-2 mt-1" data-testid={`no-door-${id}`}>
                            Không có đề xuất Cánh cửa tiếp theo chính thức.
                          </p>
                        )}
                      </article>
                    );
                  })}
                </div>
              )}
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

export type { BlockedFilter };

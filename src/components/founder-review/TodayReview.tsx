import React, { useEffect, useMemo, useState } from 'react';

import {
  getActionFirstTodayItems,
  getTodayItemsForProduct,
  isTodayItemBlocked,
  resolveJourneyContext,
  resolveRelationshipContext,
  type ProductLensId,
  type ScenarioPreset,
} from '@/lib/wp3-5/review-selectors';
import { PRIORITY_BUCKETS, TODAY_QUEUE_MANIFEST, type PriorityBucket, type TodayQueueId } from '@/lib/wp3-5/review-manifest';
import { CARE_RECORDS, JOURNEY_RECORDS, PROMISE_RECORDS, RELATIONSHIP_RECORDS, TODAY_QUEUE_DETAILS } from '@/lib/wp3-5/review-universe';
import ReviewFilters, { type BlockedFilter, type TodayFiltersState } from './ReviewFilters';
import ReviewItemDrawer from './ReviewItemDrawer';
import { useReviewPreferences } from './SessionPreferencesContext';
import { useReviewState } from './ReviewStateContext';
import styles from './founder-review.module.css';

const BUCKET_LABEL: Readonly<Record<PriorityBucket, string>> = {
  'Safety & Recovery': 'An toàn & Phục hồi',
  'Founder Gate': 'Cần anh quyết',
  'Promise & Deadline': 'Lời hứa & Hạn',
  'Care & Support': 'Theo dõi Chăm sóc',
  'Waiting & Deliberate Silence': 'Chủ động im lặng',
  'Next Door Review': 'Xem xét Cánh cửa tiếp theo',
};

export interface TodayReviewProps {
  readonly initialScenario: ScenarioPreset;
  readonly product?: ProductLensId;
  readonly initialOpenItemId?: TodayQueueId | null;
}

export default function TodayReview({ initialScenario, product = 'all', initialOpenItemId = null }: TodayReviewProps) {
  const [filters, setFilters] = useState<TodayFiltersState>({
    scenario: initialScenario, bucket: 'all', owner: 'all', blocked: 'all', search: '',
  });
  const [openItemId, setOpenItemId] = useState<TodayQueueId | null>(initialOpenItemId);
  const [collapsed, setCollapsed] = useState<Partial<Record<PriorityBucket, boolean>>>({});
  const { state: overlayState, dispatch: overlayDispatch } = useReviewState();
  const { state: prefs } = useReviewPreferences();

  useEffect(() => {
    setFilters((previous) => previous.scenario === initialScenario ? previous : { ...previous, scenario: initialScenario });
  }, [initialScenario]);

  const productIds = getTodayItemsForProduct(filters.scenario, product);
  const actionIds = getActionFirstTodayItems(filters.scenario, product);
  const owners = useMemo(
    () => [...new Set(productIds.map((id) => TODAY_QUEUE_DETAILS[id].owner))].sort(),
    [productIds]
  );

  const filteredIds = useMemo(() => {
    const search = filters.search.trim().toLowerCase();
    return productIds.filter((id) => {
      const manifest = TODAY_QUEUE_MANIFEST[id];
      const detail = TODAY_QUEUE_DETAILS[id];
      if (filters.bucket !== 'all' && manifest.priorityBucket !== filters.bucket) return false;
      if (filters.owner !== 'all' && detail.owner !== filters.owner) return false;
      const blocked = isTodayItemBlocked(id);
      if (filters.blocked === 'blocked' && !blocked) return false;
      if (filters.blocked === 'unblocked' && blocked) return false;
      if (search) {
        const relationship = resolveRelationshipContext(manifest.relationshipId);
        const journey = resolveJourneyContext(manifest.journeyId);
        const haystack = `${id} ${manifest.relationshipId} ${relationship?.displayName ?? ''} ${journey?.productLine ?? ''}`.toLowerCase();
        if (!haystack.includes(search)) return false;
      }
      return true;
    });
  }, [filters, productIds]);

  const openCare = Object.values(CARE_RECORDS).filter(
    (care) => care.status === 'open' && productIds.some((id) => TODAY_QUEUE_MANIFEST[id].relationshipId === care.relationshipId)
  );
  const duePromises = Object.values(PROMISE_RECORDS).filter(
    (promise) => ['overdue', 'due_today'].includes(promise.dueStatus) &&
      productIds.some((id) => TODAY_QUEUE_MANIFEST[id].relationshipId === promise.relationshipId)
  );
  const founderDecisions = productIds.filter((id) => TODAY_QUEUE_DETAILS[id].founderDecisionRequired);
  const blockedCount = productIds.filter((id) => isTodayItemBlocked(id)).length;

  function isBucketOpen(bucket: PriorityBucket): boolean {
    const override = collapsed[bucket];
    if (override !== undefined) return !override;
    return prefs.bucketsExpandedByDefault || PRIORITY_BUCKETS.indexOf(bucket) < 3;
  }

  function toggleBucket(bucket: PriorityBucket) {
    setCollapsed((previous) => ({ ...previous, [bucket]: isBucketOpen(bucket) }));
  }

  return (
    <div>
      <section className={styles.sectionBlock} data-testid="action-first-today">
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.eyebrow}>Mức 1</p>
            <h2 className={styles.sectionTitle}>Việc anh cần xử lý</h2>
            <p className={styles.sectionIntro}>3–5 việc quan trọng nhất, chọn trực tiếp từ hàng đợi hiện tại.</p>
          </div>
          <span className={styles.badge}>{actionIds.length} việc ưu tiên</span>
        </div>
        {actionIds.length === 0 ? (
          <div className={styles.emptyState}>Không có việc phù hợp với Product Lens này trong scenario hiện tại.</div>
        ) : (
          <div className={styles.actionList}>
            {actionIds.map((id) => {
              const manifest = TODAY_QUEUE_MANIFEST[id];
              const detail = TODAY_QUEUE_DETAILS[id];
              const relationship = RELATIONSHIP_RECORDS[manifest.relationshipId];
              const journey = JOURNEY_RECORDS[manifest.journeyId];
              const blocked = isTodayItemBlocked(id);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setOpenItemId(id)}
                  className={`${styles.actionCard} ${blocked ? styles.actionCardWarning : ''}`}
                  data-testid={`action-first-${id}`}
                >
                  <span className={styles.actionIdentity}>
                    <strong>{relationship.displayName}</strong>
                    <span>{relationship.id} · {journey.productLine} · {id}</span>
                  </span>
                  <span className={styles.actionMain}>
                    <strong>{detail.whatHappened}</strong>
                    <p>{detail.whyNow} {blocked && detail.offerBlockedReason ? `Chặn: ${detail.offerBlockedReason}` : ''}</p>
                  </span>
                  <span className={styles.actionNext}>
                    Bước hợp lệ tiếp theo
                    <strong>{detail.nextBestCare}</strong>
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {prefs.showSummaryMetrics && (
        <section className={styles.sectionBlock} data-testid="risk-overview">
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.eyebrow}>Mức 2</p>
              <h2 className={styles.sectionTitle}>Hạn, rủi ro và sức chứa</h2>
              <p className={styles.sectionIntro}>Chỉ hiển thị sự thật hiện có; không suy diễn capacity, doanh thu hay SLA.</p>
            </div>
          </div>
          <div className={styles.riskGrid}>
            <Metric label="Care / Recovery đang mở" value={openCare.length} note={openCare.map((c) => c.id).slice(0, 3).join(' · ') || 'Không có'} warn={openCare.length > 0} />
            <Metric label="Lời hứa quá hạn / đến hạn" value={duePromises.length} note={duePromises.map((p) => p.id).slice(0, 3).join(' · ') || 'Không có'} warn={duePromises.length > 0} />
            <Metric label="Founder decisions chờ" value={founderDecisions.length} note={founderDecisions.slice(0, 3).join(' · ') || 'Không có'} />
            <Metric label="Việc đang bị chặn" value={blockedCount} note="Blocker được suy ra từ Care, Promise, Consent, Suppression và Door" warn={blockedCount > 0} />
          </div>
        </section>
      )}

      <section className={styles.sectionBlock} data-testid="full-queue">
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.eyebrow}>Mức 3</p>
            <h2 className={styles.sectionTitle}>Toàn bộ hàng đợi</h2>
            <p className={styles.sectionIntro}>Giữ đủ sáu nhóm chuẩn; nhóm thấp hơn thu gọn nhưng vẫn cho thấy số lượng, số bị chặn và việc đầu tiên.</p>
          </div>
          <span className={styles.badge}>{filteredIds.length}/{productIds.length} việc</span>
        </div>
        <div className={styles.toolbar}>
          <span className={styles.recordMeta} data-testid="overlay-count">
            {Object.keys(overlayState).length > 0 ? `${Object.keys(overlayState).length} việc có hành động mô phỏng.` : 'Chưa có hành động mô phỏng.'}
          </span>
          <button type="button" className={styles.button} onClick={() => overlayDispatch({ type: 'RESET' })} data-testid="reset-simulation">Đặt lại mô phỏng</button>
        </div>
        <ReviewFilters filters={filters} owners={owners} onChange={(next) => setFilters((previous) => ({ ...previous, ...next }))} />
        <div>
          {PRIORITY_BUCKETS.map((bucket) => {
            const ids = filteredIds.filter((id) => TODAY_QUEUE_MANIFEST[id].priorityBucket === bucket);
            if (ids.length === 0) return null;
            const blocked = ids.filter((id) => isTodayItemBlocked(id)).length;
            const open = isBucketOpen(bucket);
            return (
              <section
                key={bucket}
                data-testid={`bucket-${bucket}`}
                data-item-ids={ids.join(',')}
                data-no-door-ids={ids.filter((id) => !TODAY_QUEUE_MANIFEST[id].doorId).join(',')}
              >
                <button type="button" className={styles.queueHeader} onClick={() => toggleBucket(bucket)} aria-expanded={open} data-testid={`bucket-toggle-${bucket}`}>
                  <span className={styles.queueHeaderTitle}>
                    <h3>{BUCKET_LABEL[bucket]}</h3>
                    <span className={styles.badge}>{ids.length}</span>
                    {blocked > 0 && <span className={`${styles.badge} ${styles.badgeWarning}`}>{blocked} bị chặn</span>}
                  </span>
                  <span>{open ? 'Thu gọn −' : 'Mở +'} </span>
                </button>
                {!open && (
                  <div className={styles.queuePreview}>
                    <span>Đầu tiên: {ids[0]} · {TODAY_QUEUE_DETAILS[ids[0]].whatHappened}</span>
                    <strong>{resolveJourneyContext(TODAY_QUEUE_MANIFEST[ids[0]].journeyId)?.productLine}</strong>
                  </div>
                )}
                {open && (
                  <div className={styles.queueCards}>
                    {ids.map((id) => <QueueCard key={id} id={id} showGuidance={prefs.showGuidanceText} onOpen={() => setOpenItemId(id)} />)}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </section>

      {openItemId && <ReviewItemDrawer todayId={openItemId} scenario={filters.scenario} product={product} onClose={() => setOpenItemId(null)} />}
    </div>
  );
}

function Metric({ label, value, note, warn = false }: { label: string; value: number; note: string; warn?: boolean }) {
  return (
    <div className={`${styles.metric} ${warn ? styles.metricWarn : ''}`}>
      <div className={styles.metricLabel}>{label}</div>
      <div className={styles.metricValue}>{value}</div>
      <div className={styles.metricNote}>{note}</div>
    </div>
  );
}

function QueueCard({ id, showGuidance, onOpen }: { id: TodayQueueId; showGuidance: boolean; onOpen: () => void }) {
  const manifest = TODAY_QUEUE_MANIFEST[id];
  const detail = TODAY_QUEUE_DETAILS[id];
  const relationship = RELATIONSHIP_RECORDS[manifest.relationshipId];
  const journey = JOURNEY_RECORDS[manifest.journeyId];
  const blocked = isTodayItemBlocked(id);
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`${styles.recordCard} ${styles.recordCardButton} ${blocked ? styles.recordCardWarn : ''} ${detail.founderDecisionRequired ? styles.recordCardFounder : ''}`}
      data-testid={`today-item-${id}`}
      data-relationship={manifest.relationshipId}
    >
      <span className={styles.recordTop}>
        <span>
          <span className={styles.recordTitle}>{relationship.displayName} · {relationship.id}</span>
          <span className={styles.recordMeta}>{id} · {journey.productLine} · {journey.id} · {detail.riskOrDeadlineFact}</span>
        </span>
        <span className={styles.badgeRow}>
          <span className={styles.badge}>{journey.productLine}</span>
          {detail.founderDecisionRequired && <span className={`${styles.badge} ${styles.badgeFounder}`}>Founder quyết</span>}
          {blocked && <span className={`${styles.badge} ${styles.badgeWarning}`}>Đang bị chặn</span>}
        </span>
      </span>
      {showGuidance && <span className={styles.recordFact}>{detail.whatHappened}</span>}
      {!manifest.doorId && manifest.priorityBucket === 'Next Door Review' && (
        <span className={styles.recordMeta} data-testid={`no-door-${id}`}>Không có đề xuất Cánh cửa tiếp theo chính thức.</span>
      )}
    </button>
  );
}

export type { BlockedFilter };

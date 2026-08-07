import React, { useMemo, useState } from 'react';
import Link from 'next/link';

import {
  buildSafeSyntheticQuery,
  getCareCasesForRelationship,
  getDoorBlockers,
  getDoorForRelationship,
  getJourneysForRelationship,
  getPromisesForRelationship,
  getProductLinesForRelationship,
  getTimelineEventsForRelationship,
  relationshipMatchesProductLens,
  resolveRelationshipContext,
  type ProductLensId,
  type RelationshipTabId,
  type ScenarioPreset,
} from '@/lib/wp3-5/review-selectors';
import { CONSENT_RECORD_IDS, RELATIONSHIP_IDS, SUPPRESSION_RECORD_IDS, type RelationshipId } from '@/lib/wp3-5/review-manifest';
import {
  CONSENT_STATE_RECORDS,
  FOUNDER_GATE_IDS,
  FOUNDER_GATE_RECORDS,
  ORDER_PAYMENT_TRUTH_RECORDS,
  PUBLICATION_ENTITLEMENT_TRUTH_RECORDS,
  RELATIONSHIP_RECORDS,
  SUPPRESSION_STATE_RECORDS,
} from '@/lib/wp3-5/review-universe';
import CustomerRoomPreview from './CustomerRoomPreview';
import styles from './founder-review.module.css';

const TABS: readonly { id: RelationshipTabId; label: string }[] = [
  { id: 'overview', label: 'Tổng quan' },
  { id: 'products', label: 'Sản phẩm' },
  { id: 'room', label: 'Phòng đọc' },
  { id: 'journeys', label: 'Hành trình' },
  { id: 'care', label: 'Chăm sóc' },
  { id: 'promises', label: 'Lời hứa' },
  { id: 'timeline', label: 'Dòng thời gian' },
];

export interface RelationshipReviewProps {
  readonly scenario: ScenarioPreset;
  readonly product?: ProductLensId;
  readonly initialRelationshipId?: RelationshipId | null;
  readonly initialTab?: RelationshipTabId;
}

export default function RelationshipReview({ scenario, product = 'all', initialRelationshipId = null, initialTab = 'overview' }: RelationshipReviewProps) {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<RelationshipId | null>(initialRelationshipId);
  const [stateFilter, setStateFilter] = useState<'all' | 'attention' | 'open-care'>('all');

  const filteredIds = useMemo(() => RELATIONSHIP_IDS.filter((id) => {
    const record = RELATIONSHIP_RECORDS[id];
    if (!relationshipMatchesProductLens(id, product)) return false;
    if (search.trim() && !`${id} ${record.displayName}`.toLowerCase().includes(search.trim().toLowerCase())) return false;
    if (stateFilter === 'open-care' && !getCareCasesForRelationship(id).some((care) => care.status === 'open')) return false;
    if (stateFilter === 'attention') {
      const door = getDoorForRelationship(id);
      const needsAttention = getCareCasesForRelationship(id).some((care) => care.status === 'open') ||
        getPromisesForRelationship(id).some((promise) => promise.dueStatus === 'overdue' || promise.dueStatus === 'due_today') ||
        (door ? getDoorBlockers(door.id)?.blocked : false);
      if (!needsAttention) return false;
    }
    return true;
  }), [product, search, stateFilter]);

  const selected = selectedId ? resolveRelationshipContext(selectedId) : undefined;

  return (
    <div className={styles.workspaceGrid}>
      <aside className={styles.directory}>
        <div className={styles.filterStack}>
          <input className={styles.input} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm tên hoặc SYN-ID" data-testid="relationship-search" />
          <select className={styles.select} value={stateFilter} onChange={(event) => setStateFilter(event.target.value as typeof stateFilter)}>
            <option value="all">Mọi trạng thái</option>
            <option value="attention">Cần chú ý</option>
            <option value="open-care">Có Care/Recovery mở</option>
          </select>
        </div>
        <p className={styles.recordMeta}>{filteredIds.length}/{RELATIONSHIP_IDS.length} quan hệ · Product Lens: {product === 'all' ? 'Tất cả' : product}</p>
        <ul className={styles.directoryList} data-testid="relationship-directory">
          {filteredIds.map((id) => {
            const record = RELATIONSHIP_RECORDS[id];
            const lines = getProductLinesForRelationship(id);
            return (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(id)}
                  data-testid={`relationship-card-${id}`}
                  className={`${styles.directoryButton} ${selectedId === id ? styles.directorySelected : ''}`}
                >
                  <strong>{record.displayName} · {record.id}</strong>
                  <span>{lines.join(' · ')}</span>
                  <span>{record.currentOperatingTruth}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      <section>
        {!selected && <div className={styles.emptyState} data-testid="relationship-no-selection">Chọn một Quan hệ để thấy việc cần chú ý, sản phẩm, hành trình và Phòng đọc.</div>}
        {selected && (
          <div data-testid={`relationship-detail-${selected.id}`}>
            <RelationshipHeader relationshipId={selected.id} />
            <nav className={styles.tabs} aria-label="Các phần của Quan hệ">
              {TABS.map((tab) => (
                <Link
                  key={tab.id}
                  href={{ pathname: '/founder-review/quan-he', query: buildSafeSyntheticQuery({ scenario, product, relationship: selected.id, tab: tab.id }) }}
                  className={initialTab === tab.id ? styles.tabActive : undefined}
                  aria-current={initialTab === tab.id ? 'page' : undefined}
                  data-testid={`relationship-tab-${tab.id}`}
                >
                  {tab.label}
                </Link>
              ))}
            </nav>
            <RelationshipTabContent tab={initialTab} relationshipId={selected.id} scenario={scenario} product={product} />
          </div>
        )}
      </section>
    </div>
  );
}

function RelationshipHeader({ relationshipId }: { relationshipId: RelationshipId }) {
  const record = RELATIONSHIP_RECORDS[relationshipId];
  const journeys = getJourneysForRelationship(relationshipId);
  const care = getCareCasesForRelationship(relationshipId).filter((item) => item.status === 'open');
  const promises = getPromisesForRelationship(relationshipId).filter((item) => !['completed_on_time', 'missed_then_recovered'].includes(item.dueStatus));
  const door = getDoorForRelationship(relationshipId);
  const blockers = door ? getDoorBlockers(door.id) : undefined;
  const nextJourney = journeys.find((journey) => journey.stage !== 'closed') ?? journeys[0];
  return (
    <header className={styles.detailHeader}>
      <p className={styles.eyebrow}>Synthetic Relationship</p>
      <h2>{record.displayName} · {record.id}</h2>
      <p>{record.journeyTruth}</p>
      <div className={styles.attentionStrip}>
        <div className={styles.attentionCell}><span>Cần nhìn ngay</span><strong>{record.currentOperatingTruth}</strong></div>
        <div className={styles.attentionCell}><span>Đang chặn</span><strong>{care.length > 0 ? care.map((item) => item.id).join(' · ') : blockers?.blocked ? blockers.reasons[0] : 'Không có blocker hiện tại'}</strong></div>
        <div className={styles.attentionCell}><span>Bước hợp lệ tiếp theo</span><strong>{care[0]?.nextAction ?? nextJourney?.next ?? 'Founder tiếp tục review'}</strong></div>
      </div>
      <div className={styles.badgeRow} style={{ marginTop: 9 }}>
        {getProductLinesForRelationship(relationshipId).map((line) => <span key={line} className={styles.badge}>{line}</span>)}
        {promises.length > 0 && <span className={`${styles.badge} ${styles.badgeFounder}`}>{promises.length} lời hứa đang mở</span>}
        {care.length > 0 && <span className={`${styles.badge} ${styles.badgeWarning}`}>{care.length} Care/Recovery mở</span>}
      </div>
    </header>
  );
}

function RelationshipTabContent({ tab, relationshipId, scenario, product }: { tab: RelationshipTabId; relationshipId: RelationshipId; scenario: ScenarioPreset; product: ProductLensId }) {
  if (tab === 'room') return <CustomerRoomPreview relationshipId={relationshipId} scenario={scenario} product={product} />;
  if (tab === 'products') return <ProductsView relationshipId={relationshipId} scenario={scenario} product={product} />;
  if (tab === 'journeys') return <JourneysView relationshipId={relationshipId} scenario={scenario} product={product} />;
  if (tab === 'care') return <CareView relationshipId={relationshipId} scenario={scenario} product={product} />;
  if (tab === 'promises') return <PromisesView relationshipId={relationshipId} />;
  if (tab === 'timeline') return <TimelineView relationshipId={relationshipId} />;
  return <OverviewView relationshipId={relationshipId} scenario={scenario} product={product} />;
}

function OverviewView({ relationshipId, scenario, product }: { relationshipId: RelationshipId; scenario: ScenarioPreset; product: ProductLensId }) {
  const consent = CONSENT_RECORD_IDS.map((id) => CONSENT_STATE_RECORDS[id]).find((item) => item.relationshipId === relationshipId);
  const suppression = SUPPRESSION_RECORD_IDS.map((id) => SUPPRESSION_STATE_RECORDS[id]).find((item) => item.relationshipId === relationshipId);
  const gates = FOUNDER_GATE_IDS.map((id) => FOUNDER_GATE_RECORDS[id]).filter((item) => item.relationshipId === relationshipId);
  const door = getDoorForRelationship(relationshipId);
  const eligibility = door ? getDoorBlockers(door.id) : undefined;
  return (
    <div className={styles.contentGrid}>
      <div className={`${styles.panel} ${styles.panelWide}`}><h3>Hành trình không bị gộp</h3><JourneyCards relationshipId={relationshipId} scenario={scenario} product={product} /></div>
      <div className={styles.panel}><h3>Consent & Suppression</h3><p>Consent {consent?.id}: {consent?.state}</p><p>{consent?.note}</p><p>Suppression {suppression?.id}: {suppression?.state}</p><p>{suppression?.note}</p></div>
      <div className={styles.panel}><h3>Founder decisions</h3>{gates.length ? gates.map((gate) => <p key={gate.id}><strong>{gate.id}</strong> · {gate.decisionNeeded} · {gate.dueLabel}</p>) : <p>Không có Founder Gate đang chờ.</p>}</div>
      <div className={styles.panel}><h3>Order & Payment truth</h3><p>{ORDER_PAYMENT_TRUTH_RECORDS[relationshipId].state}</p><p>{ORDER_PAYMENT_TRUTH_RECORDS[relationshipId].note}</p></div>
      <div className={styles.panel}><h3>Publication & Entitlement truth</h3><p>{PUBLICATION_ENTITLEMENT_TRUTH_RECORDS[relationshipId].state}</p><p>{PUBLICATION_ENTITLEMENT_TRUTH_RECORDS[relationshipId].note}</p></div>
      <div className={`${styles.panel} ${styles.panelWide}`}><h3>Cánh cửa tiếp theo</h3>{door ? <><div className={styles.badgeRow}><span className={styles.badge}>{door.id}</span><span data-testid={`door-status-${relationshipId}`} className={`${styles.badge} ${eligibility?.eligible ? styles.badgeSuccess : styles.badgeWarning}`}>{eligibility?.eligible ? 'Đủ điều kiện' : 'Đang bị chặn'}</span></div><p>{door.proposedDoor}</p>{eligibility?.reasons.map((reason) => <p key={reason}>{reason}</p>)}</> : <p>Không có đề xuất Cánh cửa tiếp theo chính thức.</p>}</div>
    </div>
  );
}

function ProductsView({ relationshipId, scenario, product }: { relationshipId: RelationshipId; scenario: ScenarioPreset; product: ProductLensId }) {
  return (
    <div className={styles.contentGrid}>
      <div className={`${styles.panel} ${styles.panelWide}`}><h3>Sản phẩm sở hữu</h3><JourneyCards relationshipId={relationshipId} scenario={scenario} product={product} /></div>
      <div className={styles.panel}><h3>Payment snapshot</h3><p>{ORDER_PAYMENT_TRUTH_RECORDS[relationshipId].state}</p><p>{ORDER_PAYMENT_TRUTH_RECORDS[relationshipId].note}</p></div>
      <div className={styles.panel}><h3>Entitlement snapshot</h3><p>{PUBLICATION_ENTITLEMENT_TRUTH_RECORDS[relationshipId].state}</p><p>{PUBLICATION_ENTITLEMENT_TRUTH_RECORDS[relationshipId].note}</p></div>
    </div>
  );
}

function JourneysView({ relationshipId, scenario, product }: { relationshipId: RelationshipId; scenario: ScenarioPreset; product: ProductLensId }) {
  return <div className={styles.contentGrid}><div className={`${styles.panel} ${styles.panelWide}`}><h3>Mọi Journey instance</h3><JourneyCards relationshipId={relationshipId} scenario={scenario} product={product} /></div></div>;
}

function JourneyCards({ relationshipId, scenario, product }: { relationshipId: RelationshipId; scenario: ScenarioPreset; product: ProductLensId }) {
  return <div className={styles.queueCards}>{getJourneysForRelationship(relationshipId).map((journey) => (
    <div key={journey.id} className={`${styles.recordCard} ${journey.blocked ? styles.recordCardWarn : ''}`} data-testid={`journey-${journey.id}`}>
      <div className={styles.recordTop}><span><strong className={styles.recordTitle}>{journey.productLine}</strong><span className={styles.recordMeta}>{journey.id} · {journey.stage}</span></span><Link className={styles.button} href={{ pathname: '/founder-review/hanh-trinh', query: buildSafeSyntheticQuery({ scenario, product, journey: journey.id }) }}>Mở →</Link></div>
      <p className={styles.recordFact}>Now: {journey.now}</p><p className={styles.recordMeta}>Next: {journey.next} · Owner: {journey.owner} · Due: {journey.due}</p>
    </div>
  ))}</div>;
}

function CareView({ relationshipId, scenario, product }: { relationshipId: RelationshipId; scenario: ScenarioPreset; product: ProductLensId }) {
  const cases = getCareCasesForRelationship(relationshipId);
  return <div className={styles.queueCards}>{cases.length ? cases.map((care) => <div key={care.id} className={`${styles.recordCard} ${care.status === 'open' ? styles.recordCardWarn : ''}`}><div className={styles.recordTop}><strong>{care.id} · {care.type}</strong><Link className={styles.button} href={{ pathname: '/founder-review/cham-soc', query: buildSafeSyntheticQuery({ scenario, product, care: care.id }) }}>Mở →</Link></div><p>{care.impact}</p><p className={styles.recordMeta}>Next: {care.nextAction} · Due: {care.due}</p></div>) : <div className={styles.emptyState}>Không có Care/Recovery cho Quan hệ này.</div>}</div>;
}

function PromisesView({ relationshipId }: { relationshipId: RelationshipId }) {
  const promises = getPromisesForRelationship(relationshipId);
  return <div className={styles.queueCards}>{promises.length ? promises.map((promise) => <div key={promise.id} className={`${styles.recordCard} ${promise.dueStatus === 'overdue' ? styles.recordCardWarn : ''}`}><strong>{promise.id}</strong><p>{promise.promiseText}</p><p className={styles.recordMeta}>{promise.dueStatus}</p></div>) : <div className={styles.emptyState}>Không có lời hứa nào.</div>}</div>;
}

function TimelineView({ relationshipId }: { relationshipId: RelationshipId }) {
  return <div className={styles.queueCards}>{getTimelineEventsForRelationship(relationshipId).map((event) => <div key={event.id} className={styles.recordCard}><strong>{event.id} · {event.type}</strong><p className={styles.recordMeta}>{event.visibility === 'customer_facing' ? 'Customer visible' : 'Founder internal'} · {event.journeyId}</p></div>)}</div>;
}

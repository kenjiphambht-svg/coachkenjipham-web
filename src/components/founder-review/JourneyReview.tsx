// ============================================================
// Hành trình workspace — WP3.5-A2.
//
// All 24 Journey instances, each kept as its own record (a Relationship with
// several Journeys never collapses into one combined object). Filtering and
// search are client-local only; nothing is written outside React memory.
//
// `initialJourneyId` arrives already validated by the page's
// getServerSideProps via parseSyntheticQuery, so an invalid `?journey=` value
// reaches this component only as null — the directory then renders normally
// and the raw input is never reflected anywhere.
//
// `React` is imported explicitly because this repo's vitest.config.mts has no
// @vitejs/plugin-react, so Vitest's esbuild JSX transform runs in classic mode.
// ============================================================

import React, { useMemo, useState } from 'react';
import Link from 'next/link';

import {
  getAllJourneys,
  resolveJourneyContext,
  resolveRelationshipContext,
  getCareAndPromisesForJourney,
  getTimelineEventsForRelationship,
  getDoorForJourney,
  getDoorBlockers,
  buildSafeSyntheticQuery,
  type ScenarioPreset,
} from '@/lib/wp3-5/review-selectors';
import type { JourneyId } from '@/lib/wp3-5/review-manifest';
import type { JourneyRecord, JourneyStage } from '@/lib/wp3-5/review-universe';
import { DetailSection as Section, Badge, IdTag } from './founder-review-ui';

type StageFilter =
  | 'all'
  | 'open'
  | 'waiting_founder'
  | 'waiting_customer'
  | 'care'
  | 'recovery'
  | 'silence'
  | 'closed';

const STAGE_FILTER_LABEL: Readonly<Record<StageFilter, string>> = {
  all: 'Tất cả trạng thái',
  open: 'Đang mở',
  waiting_founder: 'Chờ Founder',
  waiting_customer: 'Chờ khách',
  care: 'Đang chăm sóc',
  recovery: 'Đang phục hồi',
  silence: 'Đang im lặng',
  closed: 'Đã khép',
};

const STAGE_FILTERS = Object.keys(STAGE_FILTER_LABEL) as readonly StageFilter[];

/** Vietnamese label for each canonical stage — display only, never a new truth. */
const STAGE_LABEL: Readonly<Record<JourneyStage, string>> = {
  intake_submitted: 'Đã nộp intake',
  under_review: 'Đang xem xét',
  waiting_founder: 'Chờ Founder',
  waiting_customer: 'Chờ khách',
  payment_reported: 'Đã báo thanh toán',
  payment_confirmed: 'Đã xác nhận thanh toán',
  booking_eligible: 'Đủ điều kiện đặt lịch',
  active: 'Đang diễn ra',
  publication_ready: 'Bản nháp sẵn sàng',
  delivered: 'Đã giao',
  access_active: 'Access đang hoạt động',
  support_open: 'Support đang mở',
  recovery_open: 'Recovery đang mở',
  deliberate_silence: 'Im lặng có chủ đích',
  completed: 'Đã hoàn tất',
  closed: 'Đã khép',
};

function matchesStageFilter(journey: JourneyRecord, filter: StageFilter): boolean {
  switch (filter) {
    case 'all':
      return true;
    case 'open':
      return journey.stage !== 'closed';
    case 'waiting_founder':
      return journey.stage === 'waiting_founder' || journey.stage === 'publication_ready';
    case 'waiting_customer':
      return journey.stage === 'waiting_customer' || journey.stage === 'payment_reported';
    case 'care':
      return journey.stage === 'support_open';
    case 'recovery':
      return journey.stage === 'recovery_open';
    case 'silence':
      return journey.stage === 'deliberate_silence';
    case 'closed':
      return journey.stage === 'closed';
    default:
      return true;
  }
}

export interface JourneyReviewProps {
  readonly scenario: ScenarioPreset;
  readonly initialJourneyId?: JourneyId | null;
}

export default function JourneyReview({ scenario, initialJourneyId = null }: JourneyReviewProps) {
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<StageFilter>('all');
  const [blockedOnly, setBlockedOnly] = useState(false);
  const [selectedId, setSelectedId] = useState<JourneyId | null>(initialJourneyId);

  const journeys = getAllJourneys();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return journeys.filter((journey) => {
      if (!matchesStageFilter(journey, stageFilter)) return false;
      if (blockedOnly && !journey.blocked) return false;
      if (q) {
        const relationship = resolveRelationshipContext(journey.relationshipId);
        const haystack =
          `${journey.id} ${journey.relationshipId} ${relationship?.displayName ?? ''} ${journey.productLine}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [journeys, search, stageFilter, blockedOnly]);

  const selected = selectedId ? resolveJourneyContext(selectedId) : undefined;

  return (
    <div className="grid lg:grid-cols-[340px_1fr] gap-6">
      <div>
        <p className="font-sans text-[12px] text-e26-text-2 mb-2" data-testid="journey-count">
          {filtered.length}/{journeys.length} hành trình
        </p>

        <div className="flex flex-col gap-2 mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo JRN-ID, SYN-ID hoặc tên"
            className="border border-e26-border bg-e26-white px-3 py-2 font-sans text-[13px] text-e26-text"
            data-testid="journey-search"
          />
          <select
            className="border border-e26-border bg-e26-white px-2 py-2 font-sans text-[13px] text-e26-text"
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value as StageFilter)}
            data-testid="journey-stage-filter"
            aria-label="Lọc theo trạng thái hành trình"
          >
            {STAGE_FILTERS.map((f) => (
              <option key={f} value={f}>
                {STAGE_FILTER_LABEL[f]}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2 font-sans text-[13px] text-e26-text-2">
            <input
              type="checkbox"
              checked={blockedOnly}
              onChange={(e) => setBlockedOnly(e.target.checked)}
              data-testid="journey-blocked-filter"
            />
            Chỉ hiện hành trình đang bị chặn
          </label>
        </div>

        <ul className="space-y-2" data-testid="journey-directory">
          {filtered.map((journey) => {
            const relationship = resolveRelationshipContext(journey.relationshipId);
            return (
              <li key={journey.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(journey.id)}
                  data-testid={`journey-card-${journey.id}`}
                  data-relationship={journey.relationshipId}
                  className={`w-full text-left border px-3 py-2 font-sans text-[13px] transition-colors ${
                    selectedId === journey.id
                      ? 'border-e26-gold-deep bg-e26-cream'
                      : 'border-e26-border bg-e26-white hover:bg-e26-cream'
                  }`}
                >
                  <span className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-sans text-[14px] font-semibold text-e26-text">
                      {journey.id} · {journey.productLine}
                    </span>
                    {journey.blocked && <Badge variant="blocked">Đang bị chặn</Badge>}
                  </span>
                  <span className="block text-e26-text-2 text-[12px] font-medium mt-0.5">
                    {relationship?.displayName} · {journey.relationshipId} · {STAGE_LABEL[journey.stage]}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        {!selected && (
          <p className="font-sans text-[14px] text-e26-text-2" data-testid="journey-no-selection">
            Chọn một Hành trình trong danh sách bên trái để xem chi tiết.
          </p>
        )}
        {selected && <JourneyDetail journey={selected} scenario={scenario} />}
      </div>
    </div>
  );
}


function JourneyDetail({ journey, scenario }: { journey: JourneyRecord; scenario: ScenarioPreset }) {
  const relationship = resolveRelationshipContext(journey.relationshipId);
  const { care, promises } = getCareAndPromisesForJourney(journey.id);
  const door = getDoorForJourney(journey.id);
  const doorEligibility = door ? getDoorBlockers(door.id) : undefined;
  const timeline = getTimelineEventsForRelationship(journey.relationshipId).filter(
    (event) => event.journeyId === journey.id
  );
  const siblingCount = relationship
    ? getAllJourneys().filter((j) => j.relationshipId === relationship.id).length
    : 0;

  return (
    <div data-testid={`journey-detail-${journey.id}`}>
      <h2 className="font-serif text-[24px] font-bold text-e26-black mb-1">
        {journey.id} · {journey.productLine}
      </h2>
      <p className="font-sans text-[13px] font-semibold text-e26-text-2 mb-4">
        {relationship?.displayName} · {journey.relationshipId} · {STAGE_LABEL[journey.stage]}
        {siblingCount > 1 && ` · 1 trong ${siblingCount} hành trình của Quan hệ này`}
      </p>

      <Section title="Now / Next / Owner / Due / Blocked">
        <div
          className={`border p-4 space-y-1 ${journey.blocked ? 'border-l-4 border-l-e26-black border-e26-border bg-e26-white' : 'border-e26-border bg-e26-white'}`}
        >
          <p className="font-sans text-[14px] font-medium text-e26-text">Now: {journey.now}</p>
          <p className="font-sans text-[14px] font-medium text-e26-text">Next: {journey.next}</p>
          <p className="font-sans text-[13px] font-medium text-e26-text-2">
            Owner: {journey.owner} · Due: {journey.due}
          </p>
          <p className="font-sans text-[13px] font-semibold text-e26-text" data-testid={`journey-blocked-${journey.id}`}>
            Blocked: {journey.blocked ? `Có — ${journey.blockedReason}` : 'Không'}
          </p>
        </div>
      </Section>

      <Section title="Hợp đồng giai đoạn">
        <p className="font-sans text-[13px] text-e26-text-2">Điều kiện vào: {journey.entryConditionSummary}</p>
        <p className="font-sans text-[13px] text-e26-text-2 mt-1">Điều kiện khép: {journey.exitConditionSummary}</p>
        <p className="font-sans text-[13px] text-e26-text-2 mt-1">Mốc gần nhất: {journey.latestMilestone}</p>
      </Section>

      <Section title="Hành động hợp lệ (mô phỏng)">
        <ul className="flex flex-wrap gap-2">
          {journey.validActions.map((action) => (
            <li
              key={action}
              className="border border-e26-border bg-e26-cream px-3 py-1 font-sans text-[12px] text-e26-text-2"
            >
              {action}
            </li>
          ))}
        </ul>
        <p className="font-sans text-[11px] text-e26-text-2 mt-2">Mô phỏng — Không lưu — Không gửi</p>
      </Section>

      <Section title={`Care / Support / Recovery (${care.length})`}>
        {care.length === 0 ? (
          <p className="font-sans text-[13px] text-e26-text-2">Không có case nào trên hành trình này.</p>
        ) : (
          <div className="space-y-2">
            {care.map((c) => (
              <div key={c.id} className="border border-e26-border bg-e26-white p-3" data-testid={`journey-care-${c.id}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-sans text-[13px] text-e26-text">
                    {c.id} · {c.type} · {c.status === 'open' ? 'Đang mở' : 'Đã đóng'}
                  </span>
                  <Link
                    href={{ pathname: '/founder-review/cham-soc', query: buildSafeSyntheticQuery({ scenario, care: c.id }) }}
                    className="font-sans text-[12px] underline underline-offset-4 text-e26-text-2 hover:text-e26-gold-deep"
                  >
                    Mở Chăm sóc →
                  </Link>
                </div>
                <p className="font-sans text-[12px] text-e26-text-2 mt-1">{c.nextAction}</p>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section title={`Lời hứa (${promises.length})`}>
        {promises.length === 0 ? (
          <p className="font-sans text-[13px] text-e26-text-2">Không có lời hứa nào trên hành trình này.</p>
        ) : (
          <ul className="space-y-1 font-sans text-[13px] text-e26-text-2">
            {promises.map((p) => (
              <li key={p.id}>
                {p.id} · {p.promiseText} · {p.dueStatus}
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="Cánh cửa tiếp theo">
        {door ? (
          <>
            <div className="flex items-center gap-2 mb-1">
              <IdTag>{door.id}</IdTag>
              <span data-testid={`journey-door-${journey.id}`}>
                <Badge variant={doorEligibility?.eligible ? 'eligible' : 'blocked'}>
                  {doorEligibility?.eligible ? 'Đủ điều kiện' : 'Đang bị chặn'}
                </Badge>
              </span>
            </div>
            <p className="font-sans text-[13px] font-medium text-e26-text">
              {door.proposedDoor} · {door.proposalState}
            </p>
            {doorEligibility && doorEligibility.reasons.length > 0 && (
              <ul className="mt-1 list-disc list-inside font-sans text-[12px] text-e26-text-2">
                {doorEligibility.reasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            )}
            <p className="font-sans text-[11px] text-e26-text-2 mt-2">
              Chỉ Founder xem xét — không tự gửi, không tự duyệt.
            </p>
          </>
        ) : (
          <p className="font-sans text-[13px] text-e26-text-2">
            Không có đề xuất Cánh cửa tiếp theo chính thức trên hành trình này.
          </p>
        )}
      </Section>

      <Section title={`Timeline của hành trình (${timeline.length})`}>
        {timeline.length === 0 ? (
          <p className="font-sans text-[13px] text-e26-text-2">Chưa có sự kiện nào gắn với hành trình này.</p>
        ) : (
          <ul className="space-y-1 font-sans text-[13px] text-e26-text-2">
            {timeline.map((event) => (
              <li key={event.id}>
                {event.order}. {event.type} · {event.visibility === 'customer_facing' ? 'khách thấy' : 'nội bộ'}
              </li>
            ))}
          </ul>
        )}
      </Section>

      <div className="flex flex-wrap gap-3 border-t border-e26-border pt-4">
        {relationship && (
          <Link
            href={{
              pathname: '/founder-review/quan-he',
              query: buildSafeSyntheticQuery({ scenario, relationship: relationship.id }),
            }}
            className="border border-e26-border px-4 py-2 font-sans text-[13px] text-e26-text hover:text-e26-gold-deep hover:border-e26-gold-deep transition-colors"
            data-testid={`journey-to-relationship-${journey.id}`}
          >
            ← Mở Quan hệ {relationship.displayName} · {relationship.id}
          </Link>
        )}
        <Link
          href={{ pathname: '/founder-review/wp3-5-a', query: buildSafeSyntheticQuery({ scenario }) }}
          className="border border-e26-border px-4 py-2 font-sans text-[13px] text-e26-text hover:text-e26-gold-deep hover:border-e26-gold-deep transition-colors"
        >
          ← Về Hôm nay
        </Link>
      </div>
    </div>
  );
}

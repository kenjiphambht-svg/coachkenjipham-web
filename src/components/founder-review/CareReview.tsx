// ============================================================
// Chăm sóc & Phục hồi workspace — WP3.5-A2.
//
// All 14 Care / Support / Recovery cases, split so that Care and Recovery
// visibly PRECEDE any commercial proposal area (WO §19.4): the queues render
// first, and the Next Door impact of each case is stated as a consequence of
// the care state, never as an offer surface.
//
// Deliberate Silence is surfaced as a valid, first-class state rather than an
// absence of action.
//
// `initialCareId` arrives already validated by the page's getServerSideProps,
// so an invalid `?care=` value reaches this component only as null.
//
// `React` is imported explicitly for Vitest's classic-mode JSX transform.
// ============================================================

import React, { useMemo, useState } from 'react';
import Link from 'next/link';

import {
  getAllCareCases,
  resolveCareContext,
  resolveRelationshipContext,
  resolveJourneyContext,
  getDoorForRelationship,
  getDoorBlockers,
  buildSafeSyntheticQuery,
  type ScenarioPreset,
} from '@/lib/wp3-5/review-selectors';
import { SUPPRESSION_RECORD_IDS, type CareId } from '@/lib/wp3-5/review-manifest';
import { SUPPRESSION_STATE_RECORDS, type CareRecord, type CareCaseType } from '@/lib/wp3-5/review-universe';
import { DetailSection as Section, Badge, IdTag } from './founder-review-ui';

type StatusFilter = 'all' | 'open' | 'closed';
type TypeFilter = 'all' | CareCaseType;
type OfferFilter = 'all' | 'blocking' | 'not_blocking';

const TYPE_LABEL: Readonly<Record<CareCaseType, string>> = {
  care: 'Chăm sóc',
  support: 'Support',
  recovery: 'Phục hồi',
  access: 'Access',
  promise: 'Lời hứa',
};

const TYPE_FILTERS: readonly TypeFilter[] = ['all', 'care', 'support', 'recovery', 'access', 'promise'];

/** A case is "deliberate silence" when its own journey is in that stage. */
function isDeliberateSilence(rec: CareRecord): boolean {
  return resolveJourneyContext(rec.journeyId)?.stage === 'deliberate_silence';
}

function suppressionForRelationship(relationshipId: string) {
  return SUPPRESSION_RECORD_IDS.map((id) => SUPPRESSION_STATE_RECORDS[id]).find(
    (s) => s.relationshipId === relationshipId
  );
}

export interface CareReviewProps {
  readonly scenario: ScenarioPreset;
  readonly initialCareId?: CareId | null;
}

export default function CareReview({ scenario, initialCareId = null }: CareReviewProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [offerFilter, setOfferFilter] = useState<OfferFilter>('all');
  const [selectedId, setSelectedId] = useState<CareId | null>(initialCareId);

  const allCases = getAllCareCases();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allCases.filter((rec) => {
      if (statusFilter !== 'all' && rec.status !== statusFilter) return false;
      if (typeFilter !== 'all' && rec.type !== typeFilter) return false;
      if (offerFilter === 'blocking' && !rec.offerBlocked) return false;
      if (offerFilter === 'not_blocking' && rec.offerBlocked) return false;
      if (q) {
        const relationship = resolveRelationshipContext(rec.relationshipId);
        const haystack =
          `${rec.id} ${rec.relationshipId} ${rec.journeyId} ${relationship?.displayName ?? ''}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [allCases, search, statusFilter, typeFilter, offerFilter]);

  const activeCases = filtered.filter((c) => c.status === 'open' && !isDeliberateSilence(c));
  const silenceCases = filtered.filter((c) => c.status === 'open' && isDeliberateSilence(c));
  const historicalCases = filtered.filter((c) => c.status === 'closed');

  const selected = selectedId ? resolveCareContext(selectedId) : undefined;

  return (
    <div className="grid lg:grid-cols-[360px_1fr] gap-6">
      <div>
        <p className="font-sans text-[12px] text-e26-text-2 mb-2" data-testid="care-count">
          {filtered.length}/{allCases.length} case
        </p>

        <div className="flex flex-col gap-2 mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo CARE-ID, SYN-ID, JRN-ID hoặc tên"
            className="border border-e26-border bg-e26-white px-3 py-2 font-sans text-[13px] text-e26-text"
            data-testid="care-search"
          />
          <select
            className="border border-e26-border bg-e26-white px-2 py-2 font-sans text-[13px] text-e26-text"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            aria-label="Lọc theo trạng thái"
          >
            <option value="all">Mọi trạng thái</option>
            <option value="open">Đang mở</option>
            <option value="closed">Đã đóng</option>
          </select>
          <select
            className="border border-e26-border bg-e26-white px-2 py-2 font-sans text-[13px] text-e26-text"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
            aria-label="Lọc theo loại case"
          >
            {TYPE_FILTERS.map((t) => (
              <option key={t} value={t}>
                {t === 'all' ? 'Mọi loại' : TYPE_LABEL[t]}
              </option>
            ))}
          </select>
          <select
            className="border border-e26-border bg-e26-white px-2 py-2 font-sans text-[13px] text-e26-text"
            value={offerFilter}
            onChange={(e) => setOfferFilter(e.target.value as OfferFilter)}
            aria-label="Lọc theo ảnh hưởng tới Cánh cửa tiếp theo"
          >
            <option value="all">Mọi ảnh hưởng tới Cánh cửa</option>
            <option value="blocking">Đang chặn Cánh cửa</option>
            <option value="not_blocking">Không chặn Cánh cửa</option>
          </select>
        </div>

        <CareQueue title="Đang mở — Chăm sóc & Phục hồi" testId="care-queue-active" cases={activeCases} selectedId={selectedId} onSelect={setSelectedId} />
        <CareQueue title="Im lặng có chủ đích (hành động hợp lệ)" testId="care-queue-silence" cases={silenceCases} selectedId={selectedId} onSelect={setSelectedId} />
        <CareQueue title="Lịch sử — đã đóng" testId="care-queue-history" cases={historicalCases} selectedId={selectedId} onSelect={setSelectedId} />
      </div>

      <div>
        {!selected && (
          <p className="font-sans text-[14px] text-e26-text-2" data-testid="care-no-selection">
            Chọn một case bên trái để xem chi tiết.
          </p>
        )}
        {selected && <CareDetail care={selected} scenario={scenario} />}
      </div>
    </div>
  );
}

function CareQueue({
  title,
  testId,
  cases,
  selectedId,
  onSelect,
}: {
  title: string;
  testId: string;
  cases: readonly CareRecord[];
  selectedId: CareId | null;
  onSelect: (id: CareId) => void;
}) {
  if (cases.length === 0) return null;
  return (
    <div className="mb-5" data-testid={testId}>
      <h3 className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-e26-text-2 mb-2">
        {title} ({cases.length})
      </h3>
      <ul className="space-y-2">
        {cases.map((rec) => {
          const relationship = resolveRelationshipContext(rec.relationshipId);
          return (
            <li key={rec.id}>
              <button
                type="button"
                onClick={() => onSelect(rec.id)}
                data-testid={`care-card-${rec.id}`}
                data-relationship={rec.relationshipId}
                data-journey={rec.journeyId}
                className={`w-full text-left border px-3 py-2 font-sans text-[13px] transition-colors ${
                  rec.offerBlocked ? 'border-l-4 border-l-e26-black' : 'border-l border-l-e26-border'
                } ${
                  selectedId === rec.id
                    ? 'border-e26-gold-deep bg-e26-cream'
                    : 'border-e26-border bg-e26-white hover:bg-e26-cream'
                }`}
              >
                <span className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-sans text-[14px] font-semibold text-e26-text">
                    {rec.id} · {TYPE_LABEL[rec.type]}
                  </span>
                  {rec.offerBlocked && <Badge variant="blocked">Chặn Cánh cửa</Badge>}
                </span>
                <span className="block text-e26-text-2 text-[12px] font-medium mt-0.5">
                  {relationship?.displayName} · {rec.relationshipId} · {rec.journeyId}
                </span>
                <span className="block text-e26-text-2 text-[12px] font-medium mt-0.5">Due: {rec.due}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}


function CareDetail({ care, scenario }: { care: CareRecord; scenario: ScenarioPreset }) {
  const relationship = resolveRelationshipContext(care.relationshipId);
  const journey = resolveJourneyContext(care.journeyId);
  const door = getDoorForRelationship(care.relationshipId);
  const doorEligibility = door ? getDoorBlockers(door.id) : undefined;
  const suppression = suppressionForRelationship(care.relationshipId);
  const silence = isDeliberateSilence(care);

  return (
    <div data-testid={`care-detail-${care.id}`}>
      <h2 className="font-serif text-[24px] font-bold text-e26-black mb-1">
        {care.id} · {TYPE_LABEL[care.type]}
      </h2>
      <p className="font-sans text-[13px] font-semibold text-e26-text-2 mb-4">
        {relationship?.displayName} · {care.relationshipId} · {care.journeyId} ·{' '}
        {care.status === 'open' ? 'Đang mở' : 'Đã đóng'}
        {silence && ' · Im lặng có chủ đích'}
      </p>

      {silence && (
        <p
          className="border-l-4 border-l-e26-gold-deep border border-e26-border bg-e26-cream px-4 py-3 font-sans text-[13px] font-medium text-e26-text mb-5"
          data-testid={`care-silence-${care.id}`}
        >
          Giữ yên là một hành động hợp lệ ở đây. Không liên hệ trước ngày review đã hẹn.
        </p>
      )}

      <Section title="Ảnh hưởng & Containment">
        <p className="font-sans text-[14px] font-medium text-e26-text">{care.impact}</p>
        <p className="font-sans text-[13px] font-medium text-e26-text-2 mt-2">Containment: {care.containment}</p>
      </Section>

      <Section title="Next action / Owner / Due / Điều kiện đóng">
        <div className={`border p-4 space-y-1 border-e26-border bg-e26-white ${care.offerBlocked ? 'border-l-4 border-l-e26-black' : ''}`}>
          <p className="font-sans text-[14px] font-medium text-e26-text">Next action: {care.nextAction}</p>
          <p className="font-sans text-[13px] font-medium text-e26-text-2">
            Owner: {care.owner} · Due: {care.due}
          </p>
          <p className="font-sans text-[13px] font-medium text-e26-text-2">Điều kiện đóng: {care.closeCondition}</p>
        </div>
      </Section>

      <Section title="Suppression">
        <p className="font-sans text-[13px] font-medium text-e26-text-2">
          {suppression?.id}: {suppression?.state} — {suppression?.note}
        </p>
        <p className="font-sans text-[13px] font-medium text-e26-text-2 mt-1">Ảnh hưởng từ case này: {care.suppressionEffect}</p>
      </Section>

      {/* Care and Recovery above; the Next Door consequence is stated last, as an
          outcome of the care state — never as a commercial surface. */}
      <Section title="Ảnh hưởng tới Cánh cửa tiếp theo">
        <p className="font-sans text-[13px] font-semibold text-e26-text" data-testid={`care-offer-${care.id}`}>
          Case này {care.offerBlocked ? 'đang chặn' : 'không chặn'} Cánh cửa tiếp theo.
        </p>
        {door ? (
          <>
            <div className="flex items-center gap-2 mt-1">
              <IdTag>{door.id}</IdTag>
              <Badge variant={doorEligibility?.eligible ? 'eligible' : 'blocked'}>
                {doorEligibility?.eligible ? 'Đủ điều kiện' : 'Đang bị chặn'}
              </Badge>
            </div>
            <p className="font-sans text-[13px] font-medium text-e26-text mt-1">{door.proposalState}</p>
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
          <p className="font-sans text-[13px] text-e26-text-2 mt-1">
            Quan hệ này chưa có đề xuất Cánh cửa tiếp theo chính thức.
          </p>
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
            data-testid={`care-to-relationship-${care.id}`}
          >
            ← Mở Quan hệ {relationship.displayName} · {relationship.id}
          </Link>
        )}
        {journey && (
          <Link
            href={{
              pathname: '/founder-review/hanh-trinh',
              query: buildSafeSyntheticQuery({ scenario, journey: journey.id }),
            }}
            className="border border-e26-border px-4 py-2 font-sans text-[13px] text-e26-text hover:text-e26-gold-deep hover:border-e26-gold-deep transition-colors"
            data-testid={`care-to-journey-${care.id}`}
          >
            ← Mở Hành trình {journey.id}
          </Link>
        )}
      </div>
    </div>
  );
}

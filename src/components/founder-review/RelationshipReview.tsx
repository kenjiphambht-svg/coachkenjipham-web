// ============================================================
// Quan hệ screen — WP3.5-A2 Package C3.
//
// Directory of all 16 Relationships with deterministic client-local search
// and filters, plus a selected-Relationship detail panel showing every
// linked entity kept as its own separate record (Journeys are never merged
// into one combined mutable object — each JourneyRecord renders on its
// own).
//
// `initialRelationshipId` is a validated id or null, resolved by the page's
// getServerSideProps via review-selectors — an invalid query value never
// reaches this component as anything other than null, so the directory
// renders normally with no reflection of unvalidated input.
// ============================================================

// `React` is imported explicitly for the same reason documented at the top
// of TodayReview.tsx — Vitest's esbuild JSX transform (no
// @vitejs/plugin-react in this repo's vitest.config.mts) needs it in scope;
// Next's own automatic runtime does not.
import React, { useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';

import {
  resolveRelationshipContext,
  getJourneysForRelationship,
  getTimelineEventsForRelationship,
  getDoorBlockers,
  buildSafeSyntheticQuery,
  type ScenarioPreset,
} from '@/lib/wp3-5/review-selectors';
import {
  RELATIONSHIP_IDS,
  CARE_IDS,
  CONSENT_RECORD_IDS,
  SUPPRESSION_RECORD_IDS,
  DOOR_IDS,
  type RelationshipId,
} from '@/lib/wp3-5/review-manifest';
import {
  RELATIONSHIP_RECORDS,
  CARE_RECORDS,
  PROMISE_RECORDS,
  CONSENT_STATE_RECORDS,
  SUPPRESSION_STATE_RECORDS,
  FOUNDER_GATE_RECORDS,
  FOUNDER_GATE_IDS,
  ORDER_PAYMENT_TRUTH_RECORDS,
  PUBLICATION_ENTITLEMENT_TRUTH_RECORDS,
  DOOR_RECORDS,
} from '@/lib/wp3-5/review-universe';

type JourneyStateFilter = 'all' | 'open' | 'closed';
type OpenCareFilter = 'all' | 'has_open_care' | 'no_open_care';
type DoorFilter = 'all' | 'eligible' | 'blocked' | 'no_door';

function relationshipDoor(relationshipId: RelationshipId) {
  return DOOR_IDS.map((id) => DOOR_RECORDS[id]).find((door) => door.relationshipId === relationshipId);
}

function relationshipHasOpenCare(relationshipId: RelationshipId): boolean {
  return CARE_IDS.some((id) => CARE_RECORDS[id].relationshipId === relationshipId && CARE_RECORDS[id].status === 'open');
}

function relationshipHasOpenJourney(relationshipId: RelationshipId): boolean {
  return getJourneysForRelationship(relationshipId).some((journey) => journey.stage !== 'closed');
}

export interface RelationshipReviewProps {
  readonly scenario: ScenarioPreset;
  readonly initialRelationshipId?: RelationshipId | null;
}

export default function RelationshipReview({ scenario, initialRelationshipId = null }: RelationshipReviewProps) {
  const [search, setSearch] = useState('');
  const [journeyStateFilter, setJourneyStateFilter] = useState<JourneyStateFilter>('all');
  const [openCareFilter, setOpenCareFilter] = useState<OpenCareFilter>('all');
  const [doorFilter, setDoorFilter] = useState<DoorFilter>('all');
  const [selectedId, setSelectedId] = useState<RelationshipId | null>(initialRelationshipId);

  const filteredIds = useMemo(() => {
    const q = search.trim().toLowerCase();
    return RELATIONSHIP_IDS.filter((id) => {
      const rec = RELATIONSHIP_RECORDS[id];
      if (q && !`${id} ${rec.displayName}`.toLowerCase().includes(q)) return false;

      if (journeyStateFilter === 'open' && !relationshipHasOpenJourney(id)) return false;
      if (journeyStateFilter === 'closed' && relationshipHasOpenJourney(id)) return false;

      if (openCareFilter === 'has_open_care' && !relationshipHasOpenCare(id)) return false;
      if (openCareFilter === 'no_open_care' && relationshipHasOpenCare(id)) return false;

      if (doorFilter !== 'all') {
        const door = relationshipDoor(id);
        if (doorFilter === 'no_door' && door) return false;
        if (doorFilter !== 'no_door') {
          if (!door) return false;
          const eligibility = getDoorBlockers(door.id);
          if (doorFilter === 'eligible' && !eligibility?.eligible) return false;
          if (doorFilter === 'blocked' && !eligibility?.blocked) return false;
        }
      }

      return true;
    });
  }, [search, journeyStateFilter, openCareFilter, doorFilter]);

  const selected = selectedId ? resolveRelationshipContext(selectedId) : undefined;

  return (
    <div className="grid lg:grid-cols-[320px_1fr] gap-6">
      <div>
        <div className="flex flex-col gap-2 mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên hoặc SYN-ID"
            className="border border-e26-border bg-e26-white px-3 py-2 font-sans text-[13px] text-e26-text"
            data-testid="relationship-search"
          />
          <select
            className="border border-e26-border bg-e26-white px-2 py-2 font-sans text-[13px] text-e26-text"
            value={journeyStateFilter}
            onChange={(e) => setJourneyStateFilter(e.target.value as JourneyStateFilter)}
          >
            <option value="all">Mọi trạng thái hành trình</option>
            <option value="open">Có hành trình đang mở</option>
            <option value="closed">Tất cả hành trình đã khép</option>
          </select>
          <select
            className="border border-e26-border bg-e26-white px-2 py-2 font-sans text-[13px] text-e26-text"
            value={openCareFilter}
            onChange={(e) => setOpenCareFilter(e.target.value as OpenCareFilter)}
          >
            <option value="all">Mọi trạng thái Care</option>
            <option value="has_open_care">Có Care/Recovery đang mở</option>
            <option value="no_open_care">Không có Care/Recovery đang mở</option>
          </select>
          <select
            className="border border-e26-border bg-e26-white px-2 py-2 font-sans text-[13px] text-e26-text"
            value={doorFilter}
            onChange={(e) => setDoorFilter(e.target.value as DoorFilter)}
          >
            <option value="all">Mọi trạng thái Cánh cửa</option>
            <option value="eligible">Đủ điều kiện</option>
            <option value="blocked">Đang bị chặn</option>
            <option value="no_door">Không có đề xuất</option>
          </select>
        </div>

        <ul className="space-y-2" data-testid="relationship-directory">
          {filteredIds.map((id) => {
            const rec = RELATIONSHIP_RECORDS[id];
            return (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(id)}
                  data-testid={`relationship-card-${id}`}
                  className={`w-full text-left border px-3 py-2 font-sans text-[13px] transition-colors ${
                    selectedId === id ? 'border-e26-gold-deep bg-e26-cream' : 'border-e26-border bg-e26-white hover:bg-e26-cream'
                  }`}
                >
                  <span className="font-medium text-e26-text">
                    {rec.displayName} · {rec.id}
                  </span>
                  <span className="block text-e26-text-2 mt-1">{rec.journeyTruth}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        {!selected && (
          <p className="font-sans text-[14px] text-e26-text-2" data-testid="relationship-no-selection">
            Chọn một Quan hệ trong danh sách bên trái để xem chi tiết.
          </p>
        )}

        {selected && (
          <div data-testid={`relationship-detail-${selected.id}`}>
            <h2 className="font-serif text-[22px] text-e26-text mb-1">
              {selected.displayName} · {selected.id}
            </h2>
            <p className="font-sans text-[13px] text-e26-text-2 mb-1">{selected.journeyTruth}</p>
            <p className="font-sans text-[14px] text-e26-text mt-2 mb-6">{selected.currentOperatingTruth}</p>

            <RelationshipJourneys relationshipId={selected.id} scenario={scenario} />
            <RelationshipCare relationshipId={selected.id} scenario={scenario} />
            <RelationshipPromises relationshipId={selected.id} />
            <RelationshipConsentSuppression relationshipId={selected.id} />
            <RelationshipFounderGates relationshipId={selected.id} />
            <RelationshipTruths relationshipId={selected.id} />
            <RelationshipDoor relationshipId={selected.id} />
            <RelationshipTimeline relationshipId={selected.id} />
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-6">
      <h3 className="font-sans text-[12px] uppercase tracking-[0.12em] text-e26-text-2 mb-2">{title}</h3>
      {children}
    </section>
  );
}

function RelationshipJourneys({ relationshipId, scenario }: { relationshipId: RelationshipId; scenario: ScenarioPreset }) {
  const journeys = getJourneysForRelationship(relationshipId);
  return (
    <Section title={`Hành trình (${journeys.length})`}>
      <div className="space-y-2">
        {journeys.map((journey) => (
          <div key={journey.id} className="border border-e26-border bg-e26-white p-3" data-testid={`journey-${journey.id}`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-serif text-[15px] text-e26-text">
                {journey.id} · {journey.productLine}
              </span>
              <Link
                href={{ pathname: '/founder-review/hanh-trinh', query: buildSafeSyntheticQuery({ scenario, journey: journey.id }) }}
                className="font-sans text-[12px] underline underline-offset-4 text-e26-text-2 hover:text-e26-gold-deep"
              >
                Mở →
              </Link>
            </div>
            <p className="font-sans text-[13px] text-e26-text-2 mt-1">Now: {journey.now}</p>
            <p className="font-sans text-[13px] text-e26-text-2 mt-1">Next: {journey.next}</p>
            <p className="font-sans text-[12px] text-e26-text-2 mt-1">
              Owner: {journey.owner} · Due: {journey.due} · Blocked: {journey.blocked ? 'Có' : 'Không'}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function RelationshipCare({ relationshipId, scenario }: { relationshipId: RelationshipId; scenario: ScenarioPreset }) {
  const cases = CARE_IDS.map((id) => CARE_RECORDS[id]).filter((rec) => rec.relationshipId === relationshipId);
  const active = cases.filter((c) => c.status === 'open');
  const historical = cases.filter((c) => c.status === 'closed');
  return (
    <Section title={`Care / Support / Recovery (${cases.length})`}>
      {active.length > 0 && (
        <div className="mb-3">
          <p className="font-sans text-[12px] text-e26-text-2 mb-1">Đang mở</p>
          <div className="space-y-2">
            {active.map((c) => (
              <div key={c.id} className="border border-e26-border bg-e26-cream p-3" data-testid={`care-${c.id}`}>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-sans text-[13px] text-e26-text">
                    {c.id} · {c.type}
                  </span>
                  <Link
                    href={{ pathname: '/founder-review/cham-soc', query: buildSafeSyntheticQuery({ scenario, care: c.id }) }}
                    className="font-sans text-[12px] underline underline-offset-4 text-e26-text-2 hover:text-e26-gold-deep"
                  >
                    Mở →
                  </Link>
                </div>
                <p className="font-sans text-[12px] text-e26-text-2 mt-1">{c.impact}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {historical.length > 0 && (
        <div>
          <p className="font-sans text-[12px] text-e26-text-2 mb-1">Lịch sử (đã đóng)</p>
          <ul className="space-y-1 font-sans text-[12px] text-e26-text-2">
            {historical.map((c) => (
              <li key={c.id}>{c.id} · {c.closeCondition}</li>
            ))}
          </ul>
        </div>
      )}
      {cases.length === 0 && <p className="font-sans text-[13px] text-e26-text-2">Không có case nào.</p>}
    </Section>
  );
}

function RelationshipPromises({ relationshipId }: { relationshipId: RelationshipId }) {
  const promises = Object.values(PROMISE_RECORDS).filter((p) => p.relationshipId === relationshipId);
  return (
    <Section title={`Lời hứa (${promises.length})`}>
      {promises.length === 0 ? (
        <p className="font-sans text-[13px] text-e26-text-2">Không có lời hứa nào.</p>
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
  );
}

function RelationshipConsentSuppression({ relationshipId }: { relationshipId: RelationshipId }) {
  const consent = CONSENT_RECORD_IDS.map((id) => CONSENT_STATE_RECORDS[id]).find((c) => c.relationshipId === relationshipId);
  const suppression = SUPPRESSION_RECORD_IDS.map((id) => SUPPRESSION_STATE_RECORDS[id]).find(
    (s) => s.relationshipId === relationshipId
  );
  return (
    <Section title="Consent & Suppression">
      <p className="font-sans text-[13px] text-e26-text-2">
        Consent ({consent?.id}): {consent?.state} — {consent?.note}
      </p>
      <p className="font-sans text-[13px] text-e26-text-2 mt-1">
        Suppression ({suppression?.id}): {suppression?.state} — {suppression?.note}
      </p>
    </Section>
  );
}

function RelationshipFounderGates({ relationshipId }: { relationshipId: RelationshipId }) {
  const gates = FOUNDER_GATE_IDS.map((id) => FOUNDER_GATE_RECORDS[id]).filter((g) => g.relationshipId === relationshipId);
  if (gates.length === 0) return null;
  return (
    <Section title={`Founder Gate (${gates.length})`}>
      <ul className="space-y-1 font-sans text-[13px] text-e26-text-2">
        {gates.map((g) => (
          <li key={g.id}>
            {g.decisionNeeded} · {g.dueLabel} · {g.status}
          </li>
        ))}
      </ul>
    </Section>
  );
}

function RelationshipTruths({ relationshipId }: { relationshipId: RelationshipId }) {
  const payment = ORDER_PAYMENT_TRUTH_RECORDS[relationshipId];
  const publication = PUBLICATION_ENTITLEMENT_TRUTH_RECORDS[relationshipId];
  return (
    <Section title="Order/Payment & Publication/Entitlement truth">
      <p className="font-sans text-[13px] text-e26-text-2">Payment: {payment.state} — {payment.note}</p>
      <p className="font-sans text-[13px] text-e26-text-2 mt-1">Publication/Entitlement: {publication.state} — {publication.note}</p>
    </Section>
  );
}

function RelationshipDoor({ relationshipId }: { relationshipId: RelationshipId }) {
  const door = relationshipDoor(relationshipId);
  const eligibility = door ? getDoorBlockers(door.id) : undefined;
  return (
    <Section title="Cánh cửa tiếp theo">
      {door ? (
        <>
          <p className="font-sans text-[13px] text-e26-text-2">
            {door.id} · {door.proposedDoor} · {door.proposalState}
          </p>
          <p className="font-sans text-[13px] text-e26-text-2 mt-1" data-testid={`door-status-${relationshipId}`}>
            {eligibility?.eligible ? 'Đủ điều kiện' : 'Đang bị chặn'}
          </p>
          {eligibility && eligibility.reasons.length > 0 && (
            <ul className="mt-1 list-disc list-inside font-sans text-[12px] text-e26-text-2">
              {eligibility.reasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <p className="font-sans text-[13px] text-e26-text-2">Không có đề xuất Cánh cửa tiếp theo chính thức.</p>
      )}
    </Section>
  );
}

function RelationshipTimeline({ relationshipId }: { relationshipId: RelationshipId }) {
  const events = getTimelineEventsForRelationship(relationshipId);
  return (
    <Section title={`Timeline (${events.length})`}>
      <ul className="space-y-1 font-sans text-[13px] text-e26-text-2">
        {events.map((event) => (
          <li key={event.id}>
            {event.order}. {event.type}
          </li>
        ))}
      </ul>
    </Section>
  );
}

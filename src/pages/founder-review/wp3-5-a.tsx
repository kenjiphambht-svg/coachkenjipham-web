// ============================================================
// /founder-review/wp3-5-a — Founder Review Preview (Hôm nay).
//
// Package C3: complete Hôm nay screen — six locked priority buckets,
// filters, item drawer with cross-links, local-only simulated actions.
// Hành trình and Chăm sóc remain the Package C2 placeholders.
//
// Guarded server-side by founderReviewGuard — flag off => notFound (404).
// No Supabase, no admin auth, no network, no writes.
// ============================================================

import type { GetServerSideProps } from 'next';
import Link from 'next/link';

import FounderReviewShell from '@/components/founder-review/FounderReviewShell';
import TodayReview from '@/components/founder-review/TodayReview';
import { founderReviewGuard } from '@/lib/wp3-5/founder-review-guard';
import {
  parseSyntheticQuery,
  getTodayItemsForScenario,
  getDoorBlockers,
  buildSafeSyntheticQuery,
  type ScenarioPreset,
} from '@/lib/wp3-5/review-selectors';
import { RELATIONSHIP_IDS, JOURNEY_IDS, DOOR_IDS, CARE_IDS, PROMISE_IDS } from '@/lib/wp3-5/review-manifest';
import { CARE_RECORDS, PROMISE_RECORDS } from '@/lib/wp3-5/review-universe';

const PATHNAME = '/founder-review/wp3-5-a';

const OTHER_AREAS = [
  { href: '/founder-review/quan-he', label: 'Quan hệ' },
  { href: '/founder-review/hanh-trinh', label: 'Hành trình' },
  { href: '/founder-review/cham-soc', label: 'Chăm sóc & Phục hồi' },
] as const;

interface PageProps {
  readonly scenario: ScenarioPreset;
  readonly todayItemCount: number;
  readonly relationshipCount: number;
  readonly journeyCount: number;
  readonly openCareCount: number;
  readonly overduePromiseCount: number;
  readonly eligibleDoorCount: number;
}

export default function FounderReviewWp35APage({
  scenario,
  todayItemCount,
  relationshipCount,
  journeyCount,
  openCareCount,
  overduePromiseCount,
  eligibleDoorCount,
}: PageProps) {
  return (
    <FounderReviewShell title="Hôm nay" scenario={scenario} currentPathname={PATHNAME}>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6 mb-6">
        {[
          { label: 'Việc trong Hôm nay', value: todayItemCount },
          { label: 'Quan hệ', value: relationshipCount },
          { label: 'Hành trình', value: journeyCount },
          { label: 'Care đang mở', value: openCareCount },
          { label: 'Lời hứa quá hạn', value: overduePromiseCount },
          { label: 'Cánh cửa đủ điều kiện', value: eligibleDoorCount },
        ].map((stat) => (
          <div key={stat.label} className="border border-e26-border bg-e26-cream px-3 py-2">
            <p className="font-sans text-[11px] uppercase tracking-[0.1em] text-e26-text-2">{stat.label}</p>
            <p className="font-serif text-[20px] text-e26-text">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        {OTHER_AREAS.map((area) => (
          <Link
            key={area.href}
            href={{ pathname: area.href, query: buildSafeSyntheticQuery({ scenario }) }}
            className="border border-e26-border px-4 py-2 font-sans text-[13px] text-e26-text hover:text-e26-gold-deep hover:border-e26-gold-deep transition-colors"
          >
            {area.label} →
          </Link>
        ))}
      </div>

      <TodayReview initialScenario={scenario} />
    </FounderReviewShell>
  );
}

export const getServerSideProps: GetServerSideProps<PageProps> = founderReviewGuard<PageProps>(async (ctx) => {
  const { scenario } = parseSyntheticQuery(ctx.query);
  const todayItemCount = getTodayItemsForScenario(scenario).length;
  const openCareCount = CARE_IDS.filter((id) => CARE_RECORDS[id].status === 'open').length;
  const overduePromiseCount = PROMISE_IDS.filter((id) => PROMISE_RECORDS[id].dueStatus === 'overdue').length;
  const eligibleDoorCount = DOOR_IDS.filter((id) => getDoorBlockers(id)?.eligible).length;

  return {
    props: {
      scenario,
      todayItemCount,
      relationshipCount: RELATIONSHIP_IDS.length,
      journeyCount: JOURNEY_IDS.length,
      openCareCount,
      overduePromiseCount,
      eligibleDoorCount,
    },
  };
});

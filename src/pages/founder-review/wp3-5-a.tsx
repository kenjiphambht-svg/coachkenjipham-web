// ============================================================
// /founder-review/wp3-5-a — Founder Review Preview (Hôm nay).
//
// Complete Hôm nay screen — six locked priority buckets, filters, item
// drawer with cross-links, local-only simulated actions, AI Trợ lý and
// Thiết lập phiên (both provided by FounderReviewShell).
//
// Guarded server-side by founderReviewGuard — flag off => notFound (404).
// No Supabase, no admin auth, no network, no writes.
// ============================================================

import type { GetServerSideProps } from 'next';
import Link from 'next/link';

import FounderReviewShell from '@/components/founder-review/FounderReviewShell';
import TodayReview from '@/components/founder-review/TodayReview';
import { StatTile, ActionLink } from '@/components/founder-review/founder-review-ui';
import { useReviewPreferences } from '@/components/founder-review/SessionPreferencesContext';
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

function TodaySummaryMetrics(props: Omit<PageProps, 'scenario'>) {
  const { state: prefs } = useReviewPreferences();
  if (!prefs.showSummaryMetrics) return null;
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6 mb-6" data-testid="summary-metrics">
      <StatTile label="Việc trong Hôm nay" value={props.todayItemCount} />
      <StatTile label="Quan hệ" value={props.relationshipCount} />
      <StatTile label="Hành trình" value={props.journeyCount} />
      <StatTile label="Care đang mở" value={props.openCareCount} risk={props.openCareCount > 0} />
      <StatTile label="Lời hứa quá hạn" value={props.overduePromiseCount} risk={props.overduePromiseCount > 0} />
      <StatTile label="Cánh cửa đủ điều kiện" value={props.eligibleDoorCount} />
    </div>
  );
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
      <TodaySummaryMetrics
        todayItemCount={todayItemCount}
        relationshipCount={relationshipCount}
        journeyCount={journeyCount}
        openCareCount={openCareCount}
        overduePromiseCount={overduePromiseCount}
        eligibleDoorCount={eligibleDoorCount}
      />

      <div className="flex flex-wrap gap-3 mb-8">
        {OTHER_AREAS.map((area) => (
          <Link key={area.href} href={{ pathname: area.href, query: buildSafeSyntheticQuery({ scenario }) }}>
            <ActionLink>{area.label} →</ActionLink>
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

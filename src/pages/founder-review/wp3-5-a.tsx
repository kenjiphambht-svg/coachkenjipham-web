// ============================================================
// /founder-review/wp3-5-a — Founder Review Preview landing (Hôm nay).
//
// Package C2 scope: route skeleton only. Full Hôm nay screen (buckets,
// filters, item detail, cross-links) is Package C3/C4. This page renders a
// compact, scenario-scoped summary through real synthetic selectors.
//
// Guarded server-side by founderReviewGuard — flag off => notFound (404).
// No Supabase, no admin auth, no network, no writes.
// ============================================================

import type { GetServerSideProps } from 'next';
import Link from 'next/link';

import FounderReviewShell from '@/components/founder-review/FounderReviewShell';
import FounderReviewPlaceholder from '@/components/founder-review/FounderReviewPlaceholder';
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
      <FounderReviewPlaceholder
        heading="Tổng quan Hôm nay"
        description="Route skeleton — màn hình Hôm nay đầy đủ (bucket, filter, chi tiết việc) thuộc Package C3/C4. Các số dưới đây lấy từ dữ liệu mô phỏng thật theo scenario hiện tại."
        stats={[
          { label: 'Việc trong Hôm nay', value: todayItemCount },
          { label: 'Quan hệ', value: relationshipCount },
          { label: 'Hành trình', value: journeyCount },
          { label: 'Care/Support/Recovery đang mở', value: openCareCount },
          { label: 'Lời hứa quá hạn', value: overduePromiseCount },
          { label: 'Cánh cửa đủ điều kiện', value: eligibleDoorCount },
        ]}
      >
        <div className="flex flex-wrap gap-3 mt-2">
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
      </FounderReviewPlaceholder>
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

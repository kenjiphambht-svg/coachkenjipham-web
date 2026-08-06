// ============================================================
// /founder-review/hanh-trinh — Founder Review Preview (Hành trình).
//
// Package C2 scope: route skeleton only. Full Journey list/filter screen is
// Package C3/C4. Renders a compact, scenario-scoped summary through real
// synthetic selectors, plus one resolved Journey if a valid `journey`
// query id is present.
//
// Guarded server-side by founderReviewGuard — flag off => notFound (404).
// No Supabase, no admin auth, no network, no writes.
// ============================================================

import type { GetServerSideProps } from 'next';

import FounderReviewShell from '@/components/founder-review/FounderReviewShell';
import FounderReviewPlaceholder from '@/components/founder-review/FounderReviewPlaceholder';
import { founderReviewGuard } from '@/lib/wp3-5/founder-review-guard';
import { parseSyntheticQuery, resolveJourneyContext, type ScenarioPreset } from '@/lib/wp3-5/review-selectors';
import { JOURNEY_IDS } from '@/lib/wp3-5/review-manifest';
import type { JourneyRecord } from '@/lib/wp3-5/review-universe';

const PATHNAME = '/founder-review/hanh-trinh';

interface PageProps {
  readonly scenario: ScenarioPreset;
  readonly journeyCount: number;
  readonly journey: JourneyRecord | null;
}

export default function FounderReviewHanhTrinhPage({ scenario, journeyCount, journey }: PageProps) {
  return (
    <FounderReviewShell title="Hành trình" scenario={scenario} currentPathname={PATHNAME}>
      <FounderReviewPlaceholder
        heading="Tổng quan Hành trình"
        description="Route skeleton — danh sách và filter theo trạng thái đầy đủ thuộc Package C3/C4. Dùng ?journey=JRN-001..JRN-024 để xem một hành trình mô phỏng cụ thể."
        stats={[{ label: 'Tổng số Hành trình', value: journeyCount }]}
        note="ID hợp lệ: JRN-001 đến JRN-024. ID không hợp lệ sẽ không hiển thị gì thêm."
      >
        {journey && (
          <div className="border border-e26-border bg-e26-cream px-4 py-3 mt-2">
            <p className="font-serif text-[16px] text-e26-text">
              {journey.id} · {journey.productLine}
            </p>
            <p className="font-sans text-[13px] text-e26-text-2 mt-1">Hiện tại: {journey.now}</p>
            <p className="font-sans text-[13px] text-e26-text-2 mt-1">Kế tiếp: {journey.next}</p>
            <p className="font-sans text-[12px] text-e26-text-2 mt-2">
              Owner: {journey.owner} · Due: {journey.due} · Blocked: {journey.blocked ? 'Có' : 'Không'}
            </p>
          </div>
        )}
      </FounderReviewPlaceholder>
    </FounderReviewShell>
  );
}

export const getServerSideProps: GetServerSideProps<PageProps> = founderReviewGuard<PageProps>(async (ctx) => {
  const { scenario, journey: journeyId } = parseSyntheticQuery(ctx.query);
  const journey = resolveJourneyContext(journeyId) ?? null;

  return {
    props: {
      scenario,
      journeyCount: JOURNEY_IDS.length,
      journey,
    },
  };
});

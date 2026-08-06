// ============================================================
// /founder-review/cham-soc — Founder Review Preview (Chăm sóc & Phục hồi).
//
// Package C2 scope: route skeleton only. Full Care/Support/Recovery queue
// screen is Package C3/C4. Renders a compact, scenario-scoped summary
// through real synthetic selectors, plus one resolved Care case if a valid
// `care` query id is present.
//
// Guarded server-side by founderReviewGuard — flag off => notFound (404).
// No Supabase, no admin auth, no network, no writes.
// ============================================================

import type { GetServerSideProps } from 'next';

import FounderReviewShell from '@/components/founder-review/FounderReviewShell';
import FounderReviewPlaceholder from '@/components/founder-review/FounderReviewPlaceholder';
import { founderReviewGuard } from '@/lib/wp3-5/founder-review-guard';
import { parseSyntheticQuery, resolveCareContext, type ScenarioPreset } from '@/lib/wp3-5/review-selectors';
import { CARE_IDS } from '@/lib/wp3-5/review-manifest';
import { CARE_RECORDS, type CareRecord } from '@/lib/wp3-5/review-universe';

const PATHNAME = '/founder-review/cham-soc';

interface PageProps {
  readonly scenario: ScenarioPreset;
  readonly careCount: number;
  readonly openCareCount: number;
  readonly care: CareRecord | null;
}

export default function FounderReviewChamSocPage({ scenario, careCount, openCareCount, care }: PageProps) {
  return (
    <FounderReviewShell title="Chăm sóc & Phục hồi" scenario={scenario} currentPathname={PATHNAME}>
      <FounderReviewPlaceholder
        heading="Tổng quan Chăm sóc & Phục hồi"
        description="Route skeleton — hàng đợi Care/Support/Recovery đầy đủ (impact, containment, close condition) thuộc Package C3/C4. Care và Recovery luôn đứng trước Offer. Dùng ?care=CARE-001..CARE-014 để xem một case mô phỏng cụ thể."
        stats={[
          { label: 'Tổng số case', value: careCount },
          { label: 'Đang mở', value: openCareCount },
        ]}
        note="ID hợp lệ: CARE-001 đến CARE-014. ID không hợp lệ sẽ không hiển thị gì thêm."
      >
        {care && (
          <div className="border border-e26-border bg-e26-cream px-4 py-3 mt-2">
            <p className="font-serif text-[16px] text-e26-text">
              {care.id} · {care.type} · {care.status === 'open' ? 'Đang mở' : 'Đã đóng'}
            </p>
            <p className="font-sans text-[13px] text-e26-text-2 mt-1">{care.impact}</p>
            <p className="font-sans text-[13px] text-e26-text-2 mt-1">Next action: {care.nextAction}</p>
            <p className="font-sans text-[12px] text-e26-text-2 mt-2">
              Owner: {care.owner} · Due: {care.due} · Offer blocked: {care.offerBlocked ? 'Có' : 'Không'}
            </p>
          </div>
        )}
      </FounderReviewPlaceholder>
    </FounderReviewShell>
  );
}

export const getServerSideProps: GetServerSideProps<PageProps> = founderReviewGuard<PageProps>(async (ctx) => {
  const { scenario, care: careId } = parseSyntheticQuery(ctx.query);
  const care = resolveCareContext(careId) ?? null;
  const openCareCount = CARE_IDS.filter((id) => CARE_RECORDS[id].status === 'open').length;

  return {
    props: {
      scenario,
      careCount: CARE_IDS.length,
      openCareCount,
      care,
    },
  };
});

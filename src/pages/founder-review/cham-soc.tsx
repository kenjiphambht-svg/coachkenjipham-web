// ============================================================
// /founder-review/cham-soc — Founder Review Preview (Chăm sóc & Phục hồi).
//
// Complete workspace: all 14 Care / Support / Recovery cases split into
// active, deliberate-silence and historical queues, with filters and a full
// detail panel. Care and Recovery render before any Next Door consequence,
// which appears only as an outcome of the care state (WO §19.4).
//
// Guarded server-side by founderReviewGuard — flag off => notFound (404).
// No Supabase, no admin auth, no network, no writes.
// ============================================================

import type { GetServerSideProps } from 'next';

import FounderReviewShell from '@/components/founder-review/FounderReviewShell';
import CareReview from '@/components/founder-review/CareReview';
import { founderReviewGuard } from '@/lib/wp3-5/founder-review-guard';
import { parseSyntheticQuery, type ScenarioPreset } from '@/lib/wp3-5/review-selectors';
import type { CareId } from '@/lib/wp3-5/review-manifest';

const PATHNAME = '/founder-review/cham-soc';

interface PageProps {
  readonly scenario: ScenarioPreset;
  readonly initialCareId: CareId | null;
}

export default function FounderReviewChamSocPage({ scenario, initialCareId }: PageProps) {
  return (
    <FounderReviewShell title="Chăm sóc & Phục hồi" scenario={scenario} currentPathname={PATHNAME}>
      <CareReview scenario={scenario} initialCareId={initialCareId} />
    </FounderReviewShell>
  );
}

export const getServerSideProps: GetServerSideProps<PageProps> = founderReviewGuard<PageProps>(async (ctx) => {
  const { scenario, care } = parseSyntheticQuery(ctx.query);

  return {
    props: {
      scenario,
      initialCareId: care ?? null,
    },
  };
});

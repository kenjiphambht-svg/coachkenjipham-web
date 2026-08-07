// ============================================================
// /founder-review/hanh-trinh — Founder Review Preview (Hành trình).
//
// Complete workspace: all 24 Journey instances with deterministic
// client-local search/filters and a full detail panel (Now/Next/Owner/Due/
// Blocked, stage contract, valid actions, linked Care, Promises, Door and
// Timeline, plus navigation back to the owning Relationship).
//
// Guarded server-side by founderReviewGuard — flag off => notFound (404).
// No Supabase, no admin auth, no network, no writes.
// ============================================================

import type { GetServerSideProps } from 'next';

import FounderReviewShell from '@/components/founder-review/FounderReviewShell';
import JourneyReview from '@/components/founder-review/JourneyReview';
import { founderReviewGuard } from '@/lib/wp3-5/founder-review-guard';
import { parseSyntheticQuery, type ProductLensId, type ScenarioPreset } from '@/lib/wp3-5/review-selectors';
import type { JourneyId } from '@/lib/wp3-5/review-manifest';

const PATHNAME = '/founder-review/hanh-trinh';

interface PageProps {
  readonly scenario: ScenarioPreset;
  readonly product: ProductLensId;
  readonly initialJourneyId: JourneyId | null;
}

export default function FounderReviewHanhTrinhPage({ scenario, product, initialJourneyId }: PageProps) {
  return (
    <FounderReviewShell title="Hành trình" scenario={scenario} product={product} currentPathname={PATHNAME} workspace="journeys" journeyId={initialJourneyId}>
      <JourneyReview scenario={scenario} product={product} initialJourneyId={initialJourneyId} />
    </FounderReviewShell>
  );
}

export const getServerSideProps: GetServerSideProps<PageProps> = founderReviewGuard<PageProps>(async (ctx) => {
  const { scenario, product, journey } = parseSyntheticQuery(ctx.query);

  return {
    props: {
      scenario,
      product,
      initialJourneyId: journey ?? null,
    },
  };
});

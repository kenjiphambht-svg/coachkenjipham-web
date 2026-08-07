import type { GetServerSideProps } from 'next';

import FounderReviewShell from '@/components/founder-review/FounderReviewShell';
import TodayReview from '@/components/founder-review/TodayReview';
import { founderReviewGuard } from '@/lib/wp3-5/founder-review-guard';
import { parseSyntheticQuery, type ProductLensId, type ScenarioPreset } from '@/lib/wp3-5/review-selectors';

const PATHNAME = '/founder-review/wp3-5-a';

interface PageProps {
  readonly scenario: ScenarioPreset;
  readonly product: ProductLensId;
}

export default function FounderReviewWp35APage({ scenario, product }: PageProps) {
  return (
    <FounderReviewShell title="Hôm nay" scenario={scenario} product={product} currentPathname={PATHNAME} workspace="today">
      <TodayReview initialScenario={scenario} product={product} />
    </FounderReviewShell>
  );
}

export const getServerSideProps: GetServerSideProps<PageProps> = founderReviewGuard<PageProps>(async (ctx) => {
  const { scenario, product } = parseSyntheticQuery(ctx.query);
  return { props: { scenario, product } };
});

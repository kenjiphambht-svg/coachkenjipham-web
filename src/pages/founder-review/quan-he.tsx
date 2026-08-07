// ============================================================
// /founder-review/quan-he — Founder Review Preview (Quan hệ).
//
// Package C3: complete Quan hệ screen — directory of all 16 Relationships,
// deterministic client-local search/filters, and a full detail panel
// (Journeys, Care, Promises, Consent, Suppression, Founder Gates,
// Order/Payment truth, Publication/Entitlement truth, Timeline, Door).
//
// Guarded server-side by founderReviewGuard — flag off => notFound (404).
// No Supabase, no admin auth, no network, no writes.
// ============================================================

import type { GetServerSideProps } from 'next';

import FounderReviewShell from '@/components/founder-review/FounderReviewShell';
import RelationshipReview from '@/components/founder-review/RelationshipReview';
import { founderReviewGuard } from '@/lib/wp3-5/founder-review-guard';
import { parseSyntheticQuery, type ProductLensId, type RelationshipTabId, type ScenarioPreset } from '@/lib/wp3-5/review-selectors';
import type { RelationshipId } from '@/lib/wp3-5/review-manifest';

const PATHNAME = '/founder-review/quan-he';

interface PageProps {
  readonly scenario: ScenarioPreset;
  readonly product: ProductLensId;
  readonly initialRelationshipId: RelationshipId | null;
  readonly initialTab: RelationshipTabId;
}

export default function FounderReviewQuanHePage({ scenario, product, initialRelationshipId, initialTab }: PageProps) {
  return (
    <FounderReviewShell title="Quan hệ" scenario={scenario} product={product} currentPathname={PATHNAME} workspace="relationships" relationshipId={initialRelationshipId}>
      <RelationshipReview scenario={scenario} product={product} initialRelationshipId={initialRelationshipId} initialTab={initialTab} />
    </FounderReviewShell>
  );
}

export const getServerSideProps: GetServerSideProps<PageProps> = founderReviewGuard<PageProps>(async (ctx) => {
  const { scenario, product, relationship, tab } = parseSyntheticQuery(ctx.query);

  return {
    props: {
      scenario,
      product,
      initialRelationshipId: relationship ?? null,
      initialTab: tab ?? 'overview',
    },
  };
});

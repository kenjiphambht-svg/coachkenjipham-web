// ============================================================
// /founder-review/quan-he — Founder Review Preview (Quan hệ).
//
// Package C2 scope: route skeleton only. Full Relationship 360 screen is
// Package C3/C4. Renders a compact, scenario-scoped summary through real
// synthetic selectors, plus one resolved Relationship if a valid
// `relationship` query id is present.
//
// Guarded server-side by founderReviewGuard — flag off => notFound (404).
// No Supabase, no admin auth, no network, no writes.
// ============================================================

import type { GetServerSideProps } from 'next';

import FounderReviewShell from '@/components/founder-review/FounderReviewShell';
import FounderReviewPlaceholder from '@/components/founder-review/FounderReviewPlaceholder';
import { founderReviewGuard } from '@/lib/wp3-5/founder-review-guard';
import {
  parseSyntheticQuery,
  resolveRelationshipContext,
  getJourneysForRelationship,
  type ScenarioPreset,
} from '@/lib/wp3-5/review-selectors';
import { RELATIONSHIP_IDS } from '@/lib/wp3-5/review-manifest';
import type { RelationshipRecord } from '@/lib/wp3-5/review-universe';

const PATHNAME = '/founder-review/quan-he';

interface PageProps {
  readonly scenario: ScenarioPreset;
  readonly relationshipCount: number;
  readonly relationship: RelationshipRecord | null;
  readonly journeyCount: number;
}

export default function FounderReviewQuanHePage({ scenario, relationshipCount, relationship, journeyCount }: PageProps) {
  return (
    <FounderReviewShell title="Quan hệ" scenario={scenario} currentPathname={PATHNAME}>
      <FounderReviewPlaceholder
        heading="Tổng quan Quan hệ"
        description="Route skeleton — danh sách và Relationship 360 đầy đủ thuộc Package C3/C4. Dùng ?relationship=SYN-001..SYN-016 để xem một hồ sơ mô phỏng cụ thể."
        stats={[{ label: 'Tổng số Quan hệ', value: relationshipCount }]}
        note="ID hợp lệ: SYN-001 đến SYN-016. ID không hợp lệ sẽ không hiển thị gì thêm."
      >
        {relationship && (
          <div className="border border-e26-border bg-e26-cream px-4 py-3 mt-2">
            <p className="font-serif text-[16px] text-e26-text">
              {relationship.displayName} · {relationship.id}
            </p>
            <p className="font-sans text-[13px] text-e26-text-2 mt-1">{relationship.journeyTruth}</p>
            <p className="font-sans text-[13px] text-e26-text-2 mt-1">{relationship.currentOperatingTruth}</p>
            <p className="font-sans text-[12px] text-e26-text-2 mt-2">
              Số hành trình liên quan: {journeyCount}
            </p>
          </div>
        )}
      </FounderReviewPlaceholder>
    </FounderReviewShell>
  );
}

export const getServerSideProps: GetServerSideProps<PageProps> = founderReviewGuard<PageProps>(async (ctx) => {
  const { scenario, relationship: relationshipId } = parseSyntheticQuery(ctx.query);
  const relationship = resolveRelationshipContext(relationshipId) ?? null;
  const journeyCount = relationship ? getJourneysForRelationship(relationship.id).length : 0;

  return {
    props: {
      scenario,
      relationshipCount: RELATIONSHIP_IDS.length,
      relationship,
      journeyCount,
    },
  };
});

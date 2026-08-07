import type { GetServerSideProps } from 'next';

import CustomerRoomPreview from '@/components/founder-review/CustomerRoomPreview';
import FounderReviewShell from '@/components/founder-review/FounderReviewShell';
import { founderReviewGuard } from '@/lib/wp3-5/founder-review-guard';
import { getRoomFixtureForRelationship } from '@/lib/wp3-5/review-room-fixtures';
import { parseSyntheticQuery, type ProductLensId, type ScenarioPreset } from '@/lib/wp3-5/review-selectors';
import type { RelationshipId } from '@/lib/wp3-5/review-manifest';

const PATHNAME = '/founder-review/phong-doc';

interface PageProps {
  readonly scenario: ScenarioPreset;
  readonly product: ProductLensId;
  readonly relationshipId: RelationshipId | null;
}

export default function FounderReviewPhongDocPage({ scenario, product, relationshipId }: PageProps) {
  return (
    <FounderReviewShell title="Xem như khách hàng" scenario={scenario} product={product} currentPathname={PATHNAME} workspace="room" relationshipId={relationshipId} showProductLens={false}>
      {relationshipId ? <CustomerRoomPreview relationshipId={relationshipId} scenario={scenario} product={product} customerView /> : <p>Link Phòng đọc không hợp lệ hoặc chưa có fixture trong Preview.</p>}
    </FounderReviewShell>
  );
}

export const getServerSideProps: GetServerSideProps<PageProps> = founderReviewGuard<PageProps>(async (ctx) => {
  const { scenario, product, relationship, journey } = parseSyntheticQuery(ctx.query);
  const room = relationship ? getRoomFixtureForRelationship(relationship) : undefined;
  const valid = room && journey === room.journeyId;
  return { props: { scenario, product, relationshipId: valid && relationship ? relationship : null } };
});

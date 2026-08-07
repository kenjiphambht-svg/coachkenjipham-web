import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import CustomerRoomPreview from './CustomerRoomPreview';
import RelationshipReview from './RelationshipReview';
import { getServerSideProps } from '@/pages/founder-review/phong-doc';

describe('Founder and Customer Room views', () => {
  it('Founder view labels all access boundaries and provides the customer-view route', () => {
    const html = renderToStaticMarkup(<CustomerRoomPreview relationshipId="SYN-003" scenario="peak" product="reading-room" />);
    expect(html).toContain('Founder internal');
    expect(html).toContain('Customer private');
    expect(html).toContain('Customer visible');
    expect(html).toContain('Presentation-only fixture');
    expect(html).toContain('data-testid="view-as-customer"');
    expect(html).toContain('/founder-review/phong-doc?');
  });

  it('Customer view contains customer-visible structure but no Founder-private operating detail', () => {
    const html = renderToStaticMarkup(<CustomerRoomPreview relationshipId="SYN-003" scenario="peak" product="reading-room" customerView />);
    expect(html).toContain('Không gian riêng của khách hàng');
    expect(html).toContain('Nội dung của bạn');
    expect(html).toContain('Trở về Founder view');
    expect(html).not.toContain('DOOR-');
    expect(html).not.toContain('CARE-');
    expect(html).not.toContain('Founder internal');
  });

  it('unsupported SYN-002 Room tab shows the exact empty state', () => {
    const html = renderToStaticMarkup(<RelationshipReview scenario="peak" initialRelationshipId="SYN-002" initialTab="room" />);
    expect(html).toContain('Chưa có Phòng đọc trong Preview cho sản phẩm này.');
  });

  it('customer route fails closed when Journey is missing or invalid', async () => {
    const original = process.env.FOUNDER_REVIEW_ENABLED;
    process.env.FOUNDER_REVIEW_ENABLED = '1';
    const missing = await getServerSideProps({ query: { scenario: 'peak', relationship: 'SYN-003' } } as never);
    const invalid = await getServerSideProps({ query: { scenario: 'peak', relationship: 'SYN-003', journey: 'JRN-999' } } as never);
    if (original === undefined) delete process.env.FOUNDER_REVIEW_ENABLED;
    else process.env.FOUNDER_REVIEW_ENABLED = original;
    expect(missing).toMatchObject({ props: { relationshipId: null } });
    expect(invalid).toMatchObject({ props: { relationshipId: null } });
  });
});

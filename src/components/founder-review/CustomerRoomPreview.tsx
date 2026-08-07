import React from 'react';
import Link from 'next/link';

import type { RelationshipId } from '@/lib/wp3-5/review-manifest';
import {
  buildSafeSyntheticQuery,
  getCareCasesForRelationship,
  getDoorBlockers,
  getDoorForRelationship,
  type ProductLensId,
  type ScenarioPreset,
} from '@/lib/wp3-5/review-selectors';
import { PUBLICATION_ENTITLEMENT_TRUTH_RECORDS, RELATIONSHIP_RECORDS } from '@/lib/wp3-5/review-universe';
import { getRoomFixtureForRelationship } from '@/lib/wp3-5/review-room-fixtures';
import styles from './founder-review.module.css';

export interface CustomerRoomPreviewProps {
  readonly relationshipId: RelationshipId;
  readonly scenario: ScenarioPreset;
  readonly product: ProductLensId;
  readonly customerView?: boolean;
}

const STATUS_LABEL = {
  available: 'Đang mở trong Preview',
  draft: 'Bản nháp — khách chưa thể xem',
  access_issue: 'Access đang có vấn đề',
  suspended: 'Đang tạm dừng',
  closed: 'Đã khép',
} as const;

export default function CustomerRoomPreview({ relationshipId, scenario, product, customerView = false }: CustomerRoomPreviewProps) {
  const relationship = RELATIONSHIP_RECORDS[relationshipId];
  const room = getRoomFixtureForRelationship(relationshipId);
  if (!room) {
    return <div className={styles.emptyState}>Chưa có Phòng đọc trong Preview cho sản phẩm này.</div>;
  }

  const entitlement = PUBLICATION_ENTITLEMENT_TRUTH_RECORDS[relationshipId];
  const openSupport = getCareCasesForRelationship(relationshipId).filter((care) => care.status === 'open');
  const door = getDoorForRelationship(relationshipId);
  const doorState = door ? getDoorBlockers(door.id) : undefined;
  const founderHref = {
    pathname: '/founder-review/quan-he',
    query: buildSafeSyntheticQuery({ scenario, product, relationship: relationshipId, tab: 'room' }),
  };
  const customerHref = {
    pathname: '/founder-review/phong-doc',
    query: buildSafeSyntheticQuery({ scenario, product, relationship: relationshipId, journey: room.journeyId }),
  };

  if (customerView) {
    return (
      <div className={styles.customerFrame} data-testid={`customer-room-${room.id}`}>
        <div className={styles.customerPaper}>
          <div className={styles.badgeRow}>
            <span className={`${styles.badge} ${styles.badgePrivate}`}>Không gian riêng của khách hàng</span>
            <span className={`${styles.badge} ${styles.badgePreview}`}>Dữ liệu thử · Preview only</span>
          </div>
          <h1>{room.title}</h1>
          <p>{relationship.displayName}, đây là cách không gian riêng có thể xuất hiện với khách hàng. Không có ghi chú nội bộ của Founder trong màn hình này.</p>
          <div className={styles.panel}>
            <h2>Trạng thái hiện tại</h2>
            <p><strong>{STATUS_LABEL[room.status]}</strong></p>
            <p>{room.progressLabel}</p>
          </div>
          <h2>Nội dung của bạn</h2>
          <ol className={styles.roomToc}>
            {room.sections.map((section, index) => (
              <li key={section.id}><span>{String(index + 1).padStart(2, '0')} · {section.title}</span><span>{section.access === 'shared_material' ? 'Tài liệu dùng chung' : 'Riêng tư'}</span></li>
            ))}
          </ol>
          <h2>Tài liệu</h2>
          <p>{room.resourceState === 'available_preview' ? 'Bản PDF mẫu sẵn sàng trong Preview.' : room.resourceState === 'blocked_by_access' ? 'Tài liệu tạm thời chưa mở được vì access đang được xử lý.' : 'Chưa có tài liệu khả dụng.'}</p>
          {openSupport.length > 0 && <p className={styles.banner}>Có một yêu cầu hỗ trợ đang được xử lý. Màn hình khách hàng chỉ hiển thị trạng thái chung, không hiển thị chi tiết nội bộ.</p>}
          <Link className={styles.button} href={founderHref}>← Trở về Founder view</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.roomHero} data-testid={`founder-room-${room.id}`}>
      <div className={styles.roomHeader}>
        <div>
          <div className={styles.badgeRow}>
            <span className={`${styles.badge} ${styles.badgePrivate}`}>Founder internal</span>
            <span className={`${styles.badge} ${styles.badgePreview}`}>Presentation-only fixture</span>
          </div>
          <h2 className={styles.roomTitle}>{room.title}</h2>
          <p className={styles.recordMeta}>{room.id} · {room.productLine} · {room.journeyId}</p>
        </div>
        <Link className={styles.buttonPrimary} href={customerHref} data-testid="view-as-customer">Xem như khách hàng →</Link>
      </div>
      <div className={styles.roomBody}>
        <div>
          <h3 className={styles.sectionTitle}>Mục lục & tiến độ</h3>
          <p className={styles.sectionIntro}>{room.progressLabel}</p>
          <ol className={styles.roomToc}>
            {room.sections.map((section, index) => (
              <li key={section.id}>
                <span>{String(index + 1).padStart(2, '0')} · {section.title}</span>
                <span className={styles.badge}>{section.access === 'shared_material' ? 'Shared material' : 'Customer visible'}</span>
              </li>
            ))}
          </ol>
        </div>
        <aside className={styles.roomAside}>
          <h3 className={styles.sectionTitle}>Access & vận hành</h3>
          <p><strong>{STATUS_LABEL[room.status]}</strong></p>
          <p className={styles.recordMeta}>Version: {room.currentVersion}</p>
          <p className={styles.recordMeta}>Entitlement: {entitlement.state}</p>
          <p className={styles.recordMeta}>Resource: {room.resourceState}</p>
          <p className={styles.recordMeta}>Support mở: {openSupport.length > 0 ? openSupport.map((care) => care.id).join(' · ') : 'Không có'}</p>
          <p className={styles.recordMeta}>Next Door: {!door ? 'Chưa có đề xuất chính thức' : doorState?.blocked ? `${door.id} đang bị chặn` : `${door.id} đủ điều kiện Founder review`}</p>
          <div className={styles.badgeRow}>
            <span className={`${styles.badge} ${styles.badgePrivate}`}>Customer private</span>
            <span className={styles.badge}>Customer visible</span>
            <span className={`${styles.badge} ${styles.badgePreview}`}>Preview only</span>
          </div>
        </aside>
      </div>
    </div>
  );
}

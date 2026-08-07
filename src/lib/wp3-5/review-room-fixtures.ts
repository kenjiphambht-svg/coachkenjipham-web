/**
 * Presentation-only Customer Room fixtures for Founder Review Preview.
 *
 * These records demonstrate information architecture only. They point to
 * existing synthetic Relationships/Journeys and never redefine entitlement,
 * consent, Care, Promise, Door, payment, or commercial truth. They are not a
 * claim that a Production room exists.
 */

import type { JourneyId, RelationshipId } from './review-manifest';
import { JOURNEY_RECORDS, PUBLICATION_ENTITLEMENT_TRUTH_RECORDS, type ProductLine } from './review-universe';

export type RoomAccessLevel = 'customer_private' | 'customer_visible' | 'shared_material' | 'preview_only';
export type RoomStatus = 'available' | 'draft' | 'access_issue' | 'suspended' | 'closed';
export type ResourceState = 'available_preview' | 'not_available' | 'blocked_by_access';

export interface ReadingRoomSectionFixture {
  readonly id: string;
  readonly title: string;
  readonly access: 'customer_visible' | 'shared_material';
}

export interface ReadingRoomFixture {
  readonly id: `ROOM-${string}`;
  readonly relationshipId: RelationshipId;
  readonly journeyId: JourneyId;
  readonly productLine: ProductLine;
  readonly title: string;
  readonly status: RoomStatus;
  readonly currentVersion: string;
  readonly progressLabel: string;
  readonly resourceState: ResourceState;
  readonly sections: readonly ReadingRoomSectionFixture[];
  readonly fixtureBoundary: 'presentation_only';
}

const ROOM_FIXTURES: readonly ReadingRoomFixture[] = [
  {
    id: 'ROOM-SYN-003', relationshipId: 'SYN-003', journeyId: 'JRN-004', productLine: 'Reading Room',
    title: 'Phòng đọc của Chi', status: 'access_issue', currentVersion: 'Bản đọc 1',
    progressLabel: 'Đang ở phần “Điều cần giữ lại”', resourceState: 'blocked_by_access',
    sections: [
      { id: 'RR-003-01', title: 'Lời mở đầu', access: 'customer_visible' },
      { id: 'RR-003-02', title: 'Điều cần giữ lại', access: 'customer_visible' },
      { id: 'RR-003-03', title: 'Tài liệu đi cùng', access: 'shared_material' },
    ], fixtureBoundary: 'presentation_only',
  },
  {
    id: 'ROOM-SYN-004', relationshipId: 'SYN-004', journeyId: 'JRN-006', productLine: 'Reading Room',
    title: 'Phòng đọc của Dung', status: 'suspended', currentVersion: 'Bản đọc 1',
    progressLabel: 'Tạm dừng trong containment', resourceState: 'blocked_by_access',
    sections: [
      { id: 'RR-004-01', title: 'Ấn phẩm riêng', access: 'customer_visible' },
      { id: 'RR-004-02', title: 'Tài liệu đi cùng', access: 'shared_material' },
    ], fixtureBoundary: 'presentation_only',
  },
  {
    id: 'ROOM-SYN-007', relationshipId: 'SYN-007', journeyId: 'JRN-011', productLine: 'Hạt Mầm',
    title: 'Góc đọc Hạt Mầm của Khánh', status: 'available', currentVersion: 'Ấn bản 1',
    progressLabel: 'Ấn phẩm đã giao', resourceState: 'available_preview',
    sections: [
      { id: 'RR-007-01', title: 'Lời gửi riêng', access: 'customer_visible' },
      { id: 'RR-007-02', title: 'Ấn phẩm Hạt Mầm', access: 'customer_visible' },
      { id: 'RR-007-03', title: 'Bản PDF', access: 'shared_material' },
    ], fixtureBoundary: 'presentation_only',
  },
  {
    id: 'ROOM-SYN-010', relationshipId: 'SYN-010', journeyId: 'JRN-015', productLine: 'Hạt Mầm',
    title: 'Góc đọc Hạt Mầm của Ngọc', status: 'draft', currentVersion: 'Bản nháp 1',
    progressLabel: 'Chờ Founder duyệt; khách chưa thể xem', resourceState: 'not_available',
    sections: [
      { id: 'RR-010-01', title: 'Lời gửi riêng', access: 'customer_visible' },
      { id: 'RR-010-02', title: 'Bản thảo Hạt Mầm', access: 'customer_visible' },
    ], fixtureBoundary: 'presentation_only',
  },
  {
    id: 'ROOM-SYN-013', relationshipId: 'SYN-013', journeyId: 'JRN-019', productLine: 'Reading Room',
    title: 'Phòng đọc của Sơn', status: 'access_issue', currentVersion: 'Bản đọc 1',
    progressLabel: 'Entitlement đang được khôi phục', resourceState: 'blocked_by_access',
    sections: [
      { id: 'RR-013-01', title: 'Ấn phẩm đã giao', access: 'customer_visible' },
      { id: 'RR-013-02', title: 'Tài liệu đi cùng', access: 'shared_material' },
    ], fixtureBoundary: 'presentation_only',
  },
  {
    id: 'ROOM-SYN-014', relationshipId: 'SYN-014', journeyId: 'JRN-020', productLine: 'Hạt Mầm',
    title: 'Góc đọc Hạt Mầm của Thảo', status: 'available', currentVersion: 'Ấn bản 1',
    progressLabel: 'Sản phẩm đã giao; đang trong 7 ngày yên', resourceState: 'available_preview',
    sections: [
      { id: 'RR-014-01', title: 'Lời gửi riêng', access: 'customer_visible' },
      { id: 'RR-014-02', title: 'Ấn phẩm Hạt Mầm', access: 'customer_visible' },
      { id: 'RR-014-03', title: 'Bản PDF', access: 'shared_material' },
    ], fixtureBoundary: 'presentation_only',
  },
  {
    id: 'ROOM-SYN-016', relationshipId: 'SYN-016', journeyId: 'JRN-024', productLine: 'Reading Room',
    title: 'Phòng đọc của Vân', status: 'closed', currentVersion: 'Bản lưu 1',
    progressLabel: 'Phòng đọc đã khép', resourceState: 'not_available',
    sections: [{ id: 'RR-016-01', title: 'Nội dung đã khép', access: 'customer_visible' }],
    fixtureBoundary: 'presentation_only',
  },
] as const;

export const READING_ROOM_FIXTURES: readonly ReadingRoomFixture[] = ROOM_FIXTURES;

export function getRoomFixtureForRelationship(relationshipId: unknown): ReadingRoomFixture | undefined {
  return typeof relationshipId === 'string'
    ? READING_ROOM_FIXTURES.find((room) => room.relationshipId === relationshipId)
    : undefined;
}

export function getRoomFixtureForJourney(journeyId: unknown): ReadingRoomFixture | undefined {
  return typeof journeyId === 'string' ? READING_ROOM_FIXTURES.find((room) => room.journeyId === journeyId) : undefined;
}

export function validateRoomFixtureBoundary(room: ReadingRoomFixture): boolean {
  const journey = JOURNEY_RECORDS[room.journeyId];
  return (
    room.fixtureBoundary === 'presentation_only' &&
    journey.relationshipId === room.relationshipId &&
    journey.productLine === room.productLine &&
    PUBLICATION_ENTITLEMENT_TRUTH_RECORDS[room.relationshipId].state !== 'not_applicable'
  );
}

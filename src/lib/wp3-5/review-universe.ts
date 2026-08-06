/**
 * WP3.5-A2 — Synthetic Operating Universe
 *
 * Deterministic, fully connected synthetic records built on top of the
 * canonical identity and ownership frozen in `review-manifest.ts`
 * (docs/decisions/WO-WP3.5-A2-FOUNDER-REVIEW-PREVIEW.md, §9–§18).
 *
 * All facts here are fictional and non-identifying: single common
 * Vietnamese given names paired with a synthetic ID (WO §9.4 format), no
 * real customer or child data, no school names, no exact child ages, no
 * diagnoses, no psychological profiles, no customer/lead scores, no
 * conversion probabilities, no sales-value rankings.
 *
 * This module does not import React, routes, environment configuration,
 * Supabase, auth, providers or any network-write API, and performs no
 * persistence (no localStorage/sessionStorage/IndexedDB/cookies). It does
 * not renumber canonical IDs — everything here is additive synthetic detail
 * layered on top of `review-manifest.ts`, imported and referenced, never
 * redefined.
 */

import {
  RELATIONSHIP_IDS,
  type RelationshipId,
  JOURNEY_IDS,
  JOURNEY_OWNERSHIP,
  type JourneyId,
  CARE_IDS,
  CARE_OWNERSHIP,
  type CareId,
  PROMISE_IDS,
  PROMISE_OWNERSHIP,
  type PromiseId,
  DOOR_IDS,
  DOOR_OWNERSHIP,
  type DoorId,
  type DoorProposalState,
  TODAY_QUEUE_IDS,
  TODAY_QUEUE_MANIFEST,
  type TodayQueueId,
  type PriorityBucket,
  CONSENT_RECORD_IDS,
  CONSENT_OWNERSHIP,
  type ConsentRecordId,
  SUPPRESSION_RECORD_IDS,
  SUPPRESSION_OWNERSHIP,
  type SuppressionRecordId,
  TIMELINE_EVENT_COUNTS,
  TIMELINE_EVENT_TOTAL,
  SCENARIO_PRESETS,
  type ScenarioPreset,
} from './review-manifest';

// ---------------------------------------------------------------------------
// A. Relationships (16) — WO §10 "16 RELATIONSHIP SCENARIOS — LOCKED"
// ---------------------------------------------------------------------------

export interface RelationshipRecord {
  readonly id: RelationshipId;
  /** Single common given name, paired with the id at display time (WO §9.4: "An · SYN-001"). */
  readonly displayName: string;
  readonly journeyTruth: string;
  readonly currentOperatingTruth: string;
  readonly primaryReviewPurpose: string;
}

export const RELATIONSHIP_RECORDS: Readonly<Record<RelationshipId, RelationshipRecord>> = {
  'SYN-001': { id: 'SYN-001', displayName: 'An', journeyTruth: 'Lặng — Under Review', currentOperatingTruth: 'Chờ Founder quyết định fit / wait / decline; phản hồi dự kiến ngày mai.', primaryReviewPurpose: 'Human Decision Gate' },
  'SYN-002': { id: 'SYN-002', displayName: 'Bình', journeyTruth: 'Lặng — Completed', currentOperatingTruth: 'Follow-up đã hứa quá hạn; khách đã nhắc lại; recovery nhẹ đang mở.', primaryReviewPurpose: 'Promise + Recovery before Offer' },
  'SYN-003': { id: 'SYN-003', displayName: 'Chi', journeyTruth: 'Lặng — Closed; Hạt Mầm — Delivered; Reading Room — Active', currentOperatingTruth: 'Không truy cập được Reading Room; support đang mở.', primaryReviewPurpose: 'Access Care; Offer Blocked' },
  'SYN-004': { id: 'SYN-004', displayName: 'Dung', journeyTruth: 'Hạt Mầm — Delivered; Reading Room — Suspended', currentOperatingTruth: 'Nghi ngờ gửi nhầm người nhận; suppression toàn bộ outbound.', primaryReviewPurpose: 'Safety / Containment' },
  'SYN-005': { id: 'SYN-005', displayName: 'Giang', journeyTruth: 'Lặng — Waiting', currentOperatingTruth: 'Khách yêu cầu 30 ngày không liên hệ.', primaryReviewPurpose: 'Deliberate Silence / Suppression' },
  'SYN-006': { id: 'SYN-006', displayName: 'Hà', journeyTruth: 'Lặng — Closed', currentOperatingTruth: 'Đã nhận đủ giá trị, support đóng, consent phù hợp.', primaryReviewPurpose: 'Eligible Next Door — Founder Review only' },
  'SYN-007': { id: 'SYN-007', displayName: 'Khánh', journeyTruth: 'Lặng — Closed; Hạt Mầm — Delivered', currentOperatingTruth: 'Consent cho liên hệ tiếp theo chưa rõ.', primaryReviewPurpose: 'Consent Blocker' },
  'SYN-008': { id: 'SYN-008', displayName: 'Lan', journeyTruth: 'Lặng — Active; Hạt Mầm — Active', currentOperatingTruth: 'Hai journey có việc chồng nhau; Founder cần chọn journey chính để chăm sóc.', primaryReviewPurpose: 'Multi-journey Relationship' },
  'SYN-009': { id: 'SYN-009', displayName: 'Minh', journeyTruth: 'Hạt Mầm — Intake', currentOperatingTruth: 'Thiếu một operational fact tối thiểu; cần hỏi lại mà không thu thập quá mức.', primaryReviewPurpose: 'Privacy / Data Minimization' },
  'SYN-010': { id: 'SYN-010', displayName: 'Ngọc', journeyTruth: 'Hạt Mầm — Publication Ready', currentOperatingTruth: 'Bản nháp sẵn sàng nhưng chờ Founder approval; promise giao đến hạn hôm nay.', primaryReviewPurpose: 'Founder Gate + Promise' },
  'SYN-011': { id: 'SYN-011', displayName: 'Phúc', journeyTruth: 'Lặng — Payment Reported', currentOperatingTruth: 'Khách đã báo thanh toán nhưng chưa được xác nhận; booking chưa hợp lệ.', primaryReviewPurpose: 'State Truth / Blocked Action' },
  'SYN-012': { id: 'SYN-012', displayName: 'Quỳnh', journeyTruth: 'Lặng — Session Completed', currentOperatingTruth: 'Closing note chưa hoàn tất; journey chưa được khép.', primaryReviewPurpose: 'Closing Contract' },
  'SYN-013': { id: 'SYN-013', displayName: 'Sơn', journeyTruth: 'Hạt Mầm — Delivered; Reading Room — Recovery', currentOperatingTruth: 'Entitlement bất ngờ không hoạt động; recovery đang mở.', primaryReviewPurpose: 'Recovery Queue / Offer Blocked' },
  'SYN-014': { id: 'SYN-014', displayName: 'Thảo', journeyTruth: 'Hạt Mầm — Delivered Yesterday', currentOperatingTruth: 'Khách vừa nhận sản phẩm; hệ thống đề xuất im lặng 7 ngày.', primaryReviewPurpose: 'Post-delivery Silence' },
  'SYN-015': { id: 'SYN-015', displayName: 'Uyên', journeyTruth: 'Lặng — Closed; Hạt Mầm — Closed', currentOperatingTruth: 'Outcome được khách tự ghi nhận; chưa có testimonial/public consent; có thể review cánh cửa tiếp theo riêng.', primaryReviewPurpose: 'Proof Consent + Next Door Boundary' },
  'SYN-016': { id: 'SYN-016', displayName: 'Vân', journeyTruth: 'Lặng — Closed; Reading Room — Closed', currentOperatingTruth: 'Recovery đã đóng; khoảng chờ Founder trước đây đã kết thúc; đến ngày review lại.', primaryReviewPurpose: 'Deliberate Wait / Next Door Re-review' },
} as const;

/** Derived read-only lookup — never a stored/duplicated array on the Relationship record. */
export function getJourneysForRelationship(relationshipId: RelationshipId): readonly JourneyId[] {
  return JOURNEY_IDS.filter((jid) => JOURNEY_OWNERSHIP[jid] === relationshipId);
}

// ---------------------------------------------------------------------------
// B. Journey instances (24) — WO §11
// ---------------------------------------------------------------------------

export const JOURNEY_STAGES = [
  'intake_submitted',
  'under_review',
  'waiting_founder',
  'waiting_customer',
  'payment_reported',
  'payment_confirmed',
  'booking_eligible',
  'active',
  'publication_ready',
  'delivered',
  'access_active',
  'support_open',
  'recovery_open',
  'deliberate_silence',
  'completed',
  'closed',
] as const;

export type JourneyStage = (typeof JOURNEY_STAGES)[number];

export type ProductLine = 'Lặng' | 'Hạt Mầm' | 'Reading Room';

export interface JourneyRecord {
  readonly id: JourneyId;
  readonly relationshipId: RelationshipId;
  readonly productLine: ProductLine;
  readonly stage: JourneyStage;
  readonly now: string;
  readonly next: string;
  readonly owner: string;
  readonly due: string;
  readonly blocked: boolean;
  readonly blockedReason: string | null;
  readonly validActions: readonly string[];
  readonly entryConditionSummary: string;
  readonly exitConditionSummary: string;
  readonly latestMilestone: string;
}

function journey(
  id: JourneyId,
  productLine: ProductLine,
  stage: JourneyStage,
  now: string,
  next: string,
  owner: string,
  due: string,
  blockedReason: string | null,
  validActions: readonly string[],
  entryConditionSummary: string,
  exitConditionSummary: string,
  latestMilestone: string
): JourneyRecord {
  return {
    id,
    relationshipId: JOURNEY_OWNERSHIP[id],
    productLine,
    stage,
    now,
    next,
    owner,
    due,
    blocked: blockedReason !== null,
    blockedReason,
    validActions,
    entryConditionSummary,
    exitConditionSummary,
    latestMilestone,
  };
}

export const JOURNEY_RECORDS: Readonly<Record<JourneyId, JourneyRecord>> = {
  'JRN-001': journey('JRN-001', 'Lặng', 'waiting_founder', 'Hồ sơ đã đủ facts vận hành.', 'Founder chọn fit / wait / decline.', 'Kenji', 'Phản hồi dự kiến ngày mai', 'Chờ Founder Human Decision Gate', ['Đánh dấu đã xem', 'Chọn Fit (mô phỏng)', 'Chọn Wait (mô phỏng)', 'Chọn Decline (mô phỏng)'], 'Intake và six-question support report đã đầy đủ.', 'Founder đưa ra quyết định fit/wait/decline.', 'Support report hoàn tất, chờ Human Decision Gate.'),
  'JRN-002': journey('JRN-002', 'Lặng', 'closed', 'Lặng đã hoàn tất.', 'Đang chờ đánh giá cánh cửa tiếp theo.', 'Kenji', 'Không có', 'Cánh cửa tiếp theo bị chặn bởi lời hứa quá hạn trên JRN-003 (PROM-002)', ['Đánh dấu đã xem', 'Xem chi tiết follow-up quá hạn'], 'Khách hoàn tất chu trình Lặng.', 'Đã khép.', 'Buổi Lặng cuối cùng hoàn tất.'),
  'JRN-003': journey('JRN-003', 'Lặng', 'recovery_open', 'Follow-up đã hứa quá hạn 1 ngày.', 'Hoàn tất recovery trước khi xem xét bất kỳ đề xuất nào.', 'Kenji', 'Quá hạn 1 ngày', 'Recovery đang mở (CARE-001)', ['Đánh dấu đã xem', 'Duyệt recovery wording (mô phỏng)', 'Đánh dấu đã hoàn tất follow-up (mô phỏng)'], 'Lời hứa follow-up được ghi nhận sau buổi Lặng.', 'Follow-up hoàn tất và khách xác nhận.', 'Khách nhắc lại về follow-up chưa nhận được.'),
  'JRN-004': journey('JRN-004', 'Reading Room', 'support_open', 'Reading Room không truy cập được dù entitlement đang active.', 'Đóng support trước khi xem xét cánh cửa tiếp theo.', 'Kenji', 'Còn 5 giờ', 'Support đang mở (CARE-002, CARE-013)', ['Đánh dấu đã xem', 'Kiểm tra access state (mô phỏng)', 'Phản hồi qua kênh đã consent (mô phỏng)'], 'Hạt Mầm đã giao, Reading Room được cấp quyền.', 'Access được khôi phục và khách xác nhận.', 'Khách báo không vào được Reading Room.'),
  'JRN-005': journey('JRN-005', 'Hạt Mầm', 'delivered', 'Ấn phẩm Hạt Mầm đã giao.', 'Không có bước tiếp theo trong hành trình giao sản phẩm.', 'Hệ thống', 'Không có', null, ['Đánh dấu đã xem', 'Xem lịch sử giao sản phẩm'], 'Đơn Hạt Mầm được xác nhận thanh toán.', 'Sản phẩm đã giao thành công.', 'Giao ấn phẩm hoàn tất.'),
  'JRN-006': journey('JRN-006', 'Reading Room', 'recovery_open', 'Reading Room bị tạm ngưng vì nghi ngờ gửi nhầm người nhận.', 'Containment và xác minh người nhận trước mọi hành động khác.', 'Kenji', 'Xử lý ngay', 'Safety containment đang mở (CARE-003); toàn bộ outbound đang suppression', ['Đánh dấu đã xem', 'Xác minh người nhận (mô phỏng)', 'Ghi nhận containment (mô phỏng)'], 'Phát hiện dấu hiệu recipient không khớp contact đã xác minh.', 'Recipient được xác minh và containment đóng.', 'Phát hiện dấu hiệu gửi nhầm người nhận.'),
  'JRN-007': journey('JRN-007', 'Hạt Mầm', 'delivered', 'Ấn phẩm đã giao trước khi phát hiện nghi vấn.', 'Không có bước tiếp theo cho đến khi containment đóng.', 'Hệ thống', 'Không có', 'Toàn bộ outbound đang suppression', ['Đánh dấu đã xem', 'Xem lịch sử giao sản phẩm'], 'Đơn Hạt Mầm được xác nhận thanh toán.', 'Sản phẩm đã giao.', 'Giao ấn phẩm hoàn tất trước sự cố.'),
  'JRN-008': journey('JRN-008', 'Lặng', 'deliberate_silence', 'Khách yêu cầu 30 ngày không liên hệ.', 'Không liên hệ trước ngày review; giữ yên có chủ đích.', 'Hệ thống nhắc việc', 'Xem lại sau 30 ngày', 'Suppression active_30d đang hiệu lực (SUP-005)', ['Đánh dấu đã xem', 'Giữ yên (mô phỏng)'], 'Khách chủ động yêu cầu khoảng nghỉ 30 ngày.', 'Đến ngày review đã hẹn.', 'Yêu cầu khoảng nghỉ được ghi nhận và tôn trọng.'),
  'JRN-009': journey('JRN-009', 'Lặng', 'closed', 'Lặng đã khép, không còn care/recovery mở.', 'Founder review cánh cửa tiếp theo (eligible).', 'Kenji', 'Review khi Founder sẵn sàng', null, ['Đánh dấu đã xem', 'Founder review cánh cửa tiếp theo (mô phỏng)'], 'Chu trình Lặng hoàn tất, đã nhận đủ giá trị.', 'Đã khép, không còn blocker.', 'Support case cuối cùng đã đóng.'),
  'JRN-010': journey('JRN-010', 'Lặng', 'closed', 'Lặng đã khép.', 'Không thể xem xét cánh cửa tiếp theo vì consent chưa rõ.', 'Kenji', 'Không có', 'Consent cho liên hệ tiếp theo chưa rõ (CNS-007)', ['Đánh dấu đã xem', 'Làm rõ consent (mô phỏng)'], 'Chu trình Lặng hoàn tất.', 'Đã khép.', 'Buổi Lặng cuối cùng hoàn tất.'),
  'JRN-011': journey('JRN-011', 'Hạt Mầm', 'delivered', 'Ấn phẩm Hạt Mầm đã giao.', 'Không có bước tiếp theo trong hành trình giao sản phẩm.', 'Hệ thống', 'Không có', null, ['Đánh dấu đã xem', 'Xem lịch sử giao sản phẩm'], 'Đơn Hạt Mầm được xác nhận thanh toán.', 'Sản phẩm đã giao.', 'Giao ấn phẩm hoàn tất.'),
  'JRN-012': journey('JRN-012', 'Lặng', 'active', 'Lặng đang diễn ra song song với Hạt Mầm.', 'Founder chọn journey chính để tập trung chăm sóc.', 'Kenji', 'Không có', null, ['Đánh dấu đã xem', 'Chọn journey chính (mô phỏng)'], 'Khách tham gia đồng thời hai hành trình.', 'Founder xác định journey chính.', 'Hai hành trình phát sinh việc trùng thời điểm.'),
  'JRN-013': journey('JRN-013', 'Hạt Mầm', 'active', 'Hạt Mầm đang diễn ra song song với Lặng.', 'Chờ Founder xác định journey chính.', 'Kenji', 'Không có', null, ['Đánh dấu đã xem', 'Xem chi tiết hành trình'], 'Khách tham gia đồng thời hai hành trình.', 'Founder xác định journey chính.', 'Hai hành trình phát sinh việc trùng thời điểm.'),
  'JRN-014': journey('JRN-014', 'Hạt Mầm', 'intake_submitted', 'Intake đã nộp nhưng thiếu một operational fact tối thiểu.', 'Hỏi lại đúng một fact còn thiếu, không thu thập thêm.', 'Kenji', 'Không có', 'Thiếu operational fact tối thiểu (CARE-006)', ['Đánh dấu đã xem', 'Hỏi lại operational fact (mô phỏng)'], 'Khách nộp intake Hạt Mầm.', 'Operational fact còn thiếu được bổ sung.', 'Intake được rà soát và phát hiện thiếu fact.'),
  'JRN-015': journey('JRN-015', 'Hạt Mầm', 'publication_ready', 'Bản nháp đã sẵn sàng, chờ Founder approval.', 'Founder duyệt publication.', 'Kenji', 'Đến hạn hôm nay', 'Chờ Founder Gate approval (PROM-004 đến hạn hôm nay)', ['Đánh dấu đã xem', 'Duyệt publication (mô phỏng)', 'Yêu cầu chỉnh sửa (mô phỏng)'], 'Bản nháp Hạt Mầm hoàn tất sản xuất.', 'Founder duyệt và ấn phẩm được giao.', 'Bản nháp hoàn tất, đang chờ duyệt.'),
  'JRN-016': journey('JRN-016', 'Lặng', 'payment_reported', 'Khách đã báo thanh toán nhưng chưa được xác nhận.', 'Xác minh payment report trước khi booking hợp lệ.', 'Kenji', 'Cần xác minh sớm', 'Payment reported ≠ payment confirmed; booking chưa hợp lệ', ['Đánh dấu đã xem', 'Xác minh payment report (mô phỏng)'], 'Khách báo đã chuyển khoản.', 'Payment được xác nhận và booking hợp lệ.', 'Khách gửi báo cáo thanh toán.'),
  'JRN-017': journey('JRN-017', 'Lặng', 'completed', 'Buổi Lặng cuối cùng đã hoàn tất.', 'Hoàn tất closing note trước khi khép journey.', 'Kenji', 'Cần hoàn tất sớm', 'Closing note chưa hoàn tất (PROM-006)', ['Đánh dấu đã xem', 'Hoàn tất closing note (mô phỏng)'], 'Buổi Lặng cuối cùng diễn ra.', 'Closing note hoàn tất và journey khép.', 'Buổi Lặng cuối cùng hoàn tất, closing note còn treo.'),
  'JRN-018': journey('JRN-018', 'Hạt Mầm', 'delivered', 'Ấn phẩm Hạt Mầm đã giao.', 'Không có bước tiếp theo trong hành trình giao sản phẩm.', 'Hệ thống', 'Không có', null, ['Đánh dấu đã xem', 'Xem lịch sử giao sản phẩm'], 'Đơn Hạt Mầm được xác nhận thanh toán.', 'Sản phẩm đã giao.', 'Giao ấn phẩm hoàn tất.'),
  'JRN-019': journey('JRN-019', 'Reading Room', 'recovery_open', 'Entitlement bất ngờ không hoạt động dù đã giao sản phẩm.', 'Khôi phục access và xác nhận với khách trước hạn đã hứa.', 'Kenji', 'Đang trong recovery', 'Recovery đang mở (CARE-007); lời hứa khôi phục sắp đến hạn (PROM-007)', ['Đánh dấu đã xem', 'Khôi phục entitlement (mô phỏng)', 'Xác nhận với khách (mô phỏng)'], 'Entitlement được cấp sau khi giao sản phẩm.', 'Access được khôi phục và khách xác nhận.', 'Phát hiện entitlement không hoạt động.'),
  'JRN-020': journey('JRN-020', 'Hạt Mầm', 'deliberate_silence', 'Khách vừa nhận sản phẩm hôm qua.', 'Giữ im lặng có chủ đích 7 ngày trước khi liên hệ lại.', 'Hệ thống nhắc việc', 'Xem lại sau 7 ngày', null, ['Đánh dấu đã xem', 'Giữ yên (mô phỏng)'], 'Sản phẩm vừa giao.', 'Đến ngày review sau 7 ngày im lặng.', 'Sản phẩm giao thành công hôm qua.'),
  'JRN-021': journey('JRN-021', 'Lặng', 'closed', 'Lặng đã khép; khách tự ghi nhận outcome tích cực.', 'Founder review cánh cửa tiếp theo, tách khỏi testimonial consent.', 'Kenji', 'Review khi Founder sẵn sàng', null, ['Đánh dấu đã xem', 'Founder review cánh cửa tiếp theo (mô phỏng)'], 'Chu trình Lặng hoàn tất.', 'Đã khép.', 'Khách tự chia sẻ outcome tích cực.'),
  'JRN-022': journey('JRN-022', 'Hạt Mầm', 'closed', 'Hạt Mầm đã khép.', 'Không có bước tiếp theo.', 'Hệ thống', 'Không có', null, ['Đánh dấu đã xem', 'Xem lịch sử'], 'Chu trình Hạt Mầm hoàn tất.', 'Đã khép.', 'Chu trình Hạt Mầm hoàn tất.'),
  'JRN-023': journey('JRN-023', 'Lặng', 'closed', 'Recovery đã đóng; khoảng chờ Founder đã chọn trước đây đã kết thúc.', 'Đến hạn re-review cánh cửa tiếp theo — Founder xem lại hôm nay.', 'Kenji', 'Đến hạn re-review hôm nay', null, ['Đánh dấu đã xem', 'Founder re-review cánh cửa tiếp theo (mô phỏng)'], 'Chu trình Lặng hoàn tất, recovery từng mở rồi đóng.', 'Recovery đóng và khoảng chờ Founder kết thúc.', 'Khoảng chờ Founder đã hoàn tất, đến ngày review lại.'),
  'JRN-024': journey('JRN-024', 'Reading Room', 'closed', 'Reading Room đã khép.', 'Không có bước tiếp theo.', 'Hệ thống', 'Không có', null, ['Đánh dấu đã xem', 'Xem lịch sử'], 'Access từng active.', 'Đã khép.', 'Reading Room khép sau khi hoàn tất.'),
} as const;

// ---------------------------------------------------------------------------
// C. Care / Support / Recovery cases (14) — WO §13
// ---------------------------------------------------------------------------

export type CareCaseType = 'care' | 'support' | 'recovery' | 'access' | 'promise';
export type CareCaseStatus = 'open' | 'closed';

export interface CareRecord {
  readonly id: CareId;
  readonly relationshipId: RelationshipId;
  readonly journeyId: JourneyId;
  readonly type: CareCaseType;
  readonly status: CareCaseStatus;
  readonly impact: string;
  readonly containment: string;
  readonly nextAction: string;
  readonly owner: string;
  readonly due: string;
  readonly closeCondition: string;
  readonly offerBlocked: boolean;
  readonly suppressionEffect: string;
}

function care(
  id: CareId,
  type: CareCaseType,
  status: CareCaseStatus,
  impact: string,
  containment: string,
  nextAction: string,
  owner: string,
  due: string,
  closeCondition: string,
  offerBlocked: boolean,
  suppressionEffect: string
): CareRecord {
  return {
    id,
    relationshipId: CARE_OWNERSHIP[id].relationshipId,
    journeyId: CARE_OWNERSHIP[id].journeyId,
    type,
    status,
    impact,
    containment,
    nextAction,
    owner,
    due,
    closeCondition,
    offerBlocked,
    suppressionEffect,
  };
}

export const CARE_RECORDS: Readonly<Record<CareId, CareRecord>> = {
  'CARE-001': care('CARE-001', 'recovery', 'open', 'Lời hứa follow-up sau Lặng bị đứt, khách đã chủ động nhắc lại.', 'Đặt cánh cửa tiếp theo vào care_first.', 'Duyệt recovery wording và hoàn tất follow-up.', 'Kenji', 'Quá hạn 1 ngày', 'Follow-up hoàn tất và khách xác nhận đã nhận được.', true, 'Không có'),
  'CARE-002': care('CARE-002', 'support', 'open', 'Khách chưa nhận đủ giá trị đã hứa vì không vào được Reading Room.', 'Không giới thiệu sản phẩm khác khi support còn mở.', 'Kiểm tra access state và phản hồi qua kênh đã consent.', 'Kenji', 'Còn 5 giờ', 'Access được khôi phục và khách xác nhận.', true, 'Không marketing trong thời gian support mở'),
  'CARE-003': care('CARE-003', 'recovery', 'open', 'Rủi ro privacy do nghi ngờ gửi nhầm người nhận.', 'Tạm khóa đường gửi; không mở chi tiết trẻ em.', 'Xác minh recipient và ghi closure evidence.', 'Kenji', 'Xử lý ngay', 'Recipient được xác minh đúng và containment đóng.', true, 'Toàn bộ outbound đang suppression'),
  'CARE-004': care('CARE-004', 'support', 'open', 'Khách cần khoảng nghỉ được tôn trọng tuyệt đối.', 'Không liên hệ trước ngày review.', 'Giữ yên, chỉ mở lại đúng ngày đã hẹn.', 'Hệ thống nhắc việc', 'Xem lại sau 30 ngày', 'Đến ngày review đã hẹn.', true, 'Suppression active_30d đang hiệu lực'),
  'CARE-005': care('CARE-005', 'access', 'open', 'Không thể liên hệ tiếp vì consent chưa rõ.', 'Không gửi bất kỳ liên hệ nào cho đến khi rõ consent.', 'Làm rõ consent trước khi xem xét bất kỳ đề xuất nào.', 'Kenji', 'Không có', 'Consent được xác nhận rõ ràng.', true, 'Không có'),
  'CARE-006': care('CARE-006', 'care', 'open', 'Thiếu một operational fact tối thiểu để tiếp tục intake.', 'Chỉ hỏi đúng fact còn thiếu, không thu thập thêm.', 'Hỏi lại operational fact tối thiểu.', 'Kenji', 'Không có', 'Fact còn thiếu được bổ sung.', false, 'Không có'),
  'CARE-007': care('CARE-007', 'recovery', 'open', 'Entitlement bất ngờ không hoạt động dù đã giao sản phẩm.', 'Ưu tiên khôi phục access trước khi xem xét đề xuất khác.', 'Khôi phục entitlement và xác nhận với khách.', 'Kenji', 'Đang trong recovery', 'Access hoạt động trở lại và khách xác nhận.', true, 'Không có'),
  'CARE-008': care('CARE-008', 'support', 'open', 'Khách vừa nhận sản phẩm, cần khoảng im lặng để tự trải nghiệm.', 'Không liên hệ trong 7 ngày.', 'Giữ yên có chủ đích 7 ngày.', 'Hệ thống nhắc việc', 'Xem lại sau 7 ngày', 'Đến ngày review sau 7 ngày.', false, 'Không có'),
  'CARE-009': care('CARE-009', 'care', 'open', 'Outcome tích cực chưa có testimonial/public consent rõ ràng.', 'Không dùng câu chuyện riêng làm sales signal khi chưa có consent công khai.', 'Làm rõ ranh giới testimonial/public consent trước khi review cánh cửa tiếp theo.', 'Kenji', 'Không có', 'Ranh giới testimonial/public consent được làm rõ.', false, 'Không có'),
  'CARE-010': care('CARE-010', 'recovery', 'closed', 'Recovery trước đây đã đóng.', 'Không còn containment cần thiết.', 'Không có nextAction còn mở.', 'Kenji', 'Không có', 'Đã đóng — recovery hoàn tất trước khi khoảng chờ Founder bắt đầu.', false, 'Không có'),
  'CARE-011': care('CARE-011', 'care', 'open', 'Hồ sơ chờ Founder Gate, chưa có quyết định fit/wait/decline.', 'Không chủ động liên hệ trước khi Founder quyết định.', 'Chờ Founder mở workspace và quyết định.', 'Kenji', 'Phản hồi dự kiến ngày mai', 'Founder đưa ra quyết định fit/wait/decline.', false, 'Không có'),
  'CARE-012': care('CARE-012', 'care', 'closed', 'Chu trình Lặng đã hoàn tất.', 'Không có.', 'Không có nextAction còn mở trên journey này.', 'Kenji', 'Không có', 'Đã đóng — chu trình Lặng hoàn tất.', false, 'Không có'),
  'CARE-013': care('CARE-013', 'support', 'open', 'Cùng sự cố access Reading Room, theo dõi song song để tách containment và recovery.', 'Không giới thiệu sản phẩm khác khi support còn mở.', 'Theo dõi tiến độ khôi phục song song với CARE-002.', 'Kenji', 'Còn 5 giờ', 'Access được khôi phục và khách xác nhận.', true, 'Không marketing trong thời gian support mở'),
  'CARE-014': care('CARE-014', 'care', 'closed', 'Case chăm sóc cuối cùng trước khi journey khép.', 'Không có.', 'Không có nextAction còn mở.', 'Kenji', 'Không có', 'Đã đóng — khách đã nhận đủ giá trị.', false, 'Không có'),
} as const;

// ---------------------------------------------------------------------------
// D. Promises / Deadlines (10) — WO §14
// ---------------------------------------------------------------------------

export const PROMISE_DUE_STATUSES = [
  'overdue',
  'due_today',
  'due_tomorrow',
  'upcoming_preparation',
  'completed_on_time',
  'missed_then_recovered',
] as const;

export type PromiseDueStatus = (typeof PROMISE_DUE_STATUSES)[number];

export interface PromiseRecord {
  readonly id: PromiseId;
  readonly relationshipId: RelationshipId;
  readonly journeyId: JourneyId;
  readonly promiseText: string;
  readonly dueStatus: PromiseDueStatus;
  readonly owner: string;
  readonly sourceEvent: string;
  readonly currentTruth: string;
  readonly careConsequenceIfMissed: string;
}

function promise(
  id: PromiseId,
  promiseText: string,
  dueStatus: PromiseDueStatus,
  owner: string,
  sourceEvent: string,
  currentTruth: string,
  careConsequenceIfMissed: string
): PromiseRecord {
  return {
    id,
    relationshipId: PROMISE_OWNERSHIP[id].relationshipId,
    journeyId: PROMISE_OWNERSHIP[id].journeyId,
    promiseText,
    dueStatus,
    owner,
    sourceEvent,
    currentTruth,
    careConsequenceIfMissed,
  };
}

export const PROMISE_RECORDS: Readonly<Record<PromiseId, PromiseRecord>> = {
  'PROM-001': promise('PROM-001', 'ESSENCE phản hồi quyết định fit / wait / decline.', 'due_tomorrow', 'Kenji', 'Support report hoàn tất.', 'Đang chờ Founder.', 'Trì hoãn Human Decision Gate, khách chờ lâu hơn cam kết.'),
  'PROM-002': promise('PROM-002', 'Follow-up sau buổi Lặng cuối cùng.', 'overdue', 'Kenji', 'Buổi Lặng cuối cùng hoàn tất.', 'Quá hạn 1 ngày, khách đã nhắc lại.', 'Recovery cần mở nếu tiếp tục trễ.'),
  'PROM-003': promise('PROM-003', 'Founder chọn journey chính để chăm sóc.', 'due_today', 'Kenji', 'Hai hành trình phát sinh việc trùng thời điểm.', 'Đang chờ Founder chọn.', 'Cả hai hành trình có thể bị chăm sóc chồng chéo hoặc bỏ sót.'),
  'PROM-004': promise('PROM-004', 'Giao ấn phẩm Hạt Mầm sau khi publication được duyệt.', 'due_today', 'Kenji', 'Bản nháp hoàn tất sản xuất.', 'Chờ Founder approval, đến hạn hôm nay.', 'Giao hàng trễ so với cam kết ban đầu.'),
  'PROM-005': promise('PROM-005', 'Xác minh payment report và mở booking.', 'due_today', 'Kenji', 'Khách gửi báo cáo thanh toán.', 'Đang chờ xác minh.', 'Booking tiếp tục không hợp lệ, khách chờ lâu hơn.'),
  'PROM-006': promise('PROM-006', 'Hoàn tất closing note để khép journey.', 'due_today', 'Kenji', 'Buổi Lặng cuối cùng hoàn tất.', 'Closing note chưa hoàn tất.', 'Journey không thể khép đúng hạn.'),
  'PROM-007': promise('PROM-007', 'Khôi phục entitlement và xác nhận với khách.', 'due_today', 'Kenji', 'Phát hiện entitlement không hoạt động.', 'Đang trong recovery.', 'Khách tiếp tục không truy cập được sản phẩm đã mua.'),
  'PROM-008': promise('PROM-008', 'Giữ im lặng có chủ đích 7 ngày sau khi giao sản phẩm.', 'upcoming_preparation', 'Hệ thống nhắc việc', 'Sản phẩm giao thành công.', 'Đang trong 7 ngày im lặng.', 'Liên hệ quá sớm có thể phá vỡ trải nghiệm tự khám phá.'),
  'PROM-009': promise('PROM-009', 'Làm rõ ranh giới testimonial/public consent trước khi review cánh cửa tiếp theo.', 'upcoming_preparation', 'Kenji', 'Khách tự chia sẻ outcome tích cực.', 'Đang chuẩn bị làm rõ ranh giới.', 'Rủi ro dùng câu chuyện riêng làm sales signal khi chưa có consent.'),
  'PROM-010': promise('PROM-010', 'Re-review cánh cửa tiếp theo sau khoảng chờ Founder.', 'due_today', 'Kenji', 'Khoảng chờ Founder trước đây đã kết thúc.', 'Đến hạn re-review hôm nay.', 'Khách tiếp tục chờ lâu hơn dự kiến sau khi wait period đã kết thúc.'),
} as const;

/**
 * Note on WO §14 category coverage ("overdue; due today; due tomorrow;
 * upcoming preparation; completed on time; missed then recovered"): all 10
 * canonical PROM ids are referenced by at least one Today Queue item
 * (review-manifest.ts TODAY_QUEUE_MANIFEST), i.e. every promise here is, by
 * canonical design, something that still needs attention today. 'completed
 * on time' and 'missed then recovered' would contradict that — they are
 * intentionally not forced onto any of the 10 fixed ids rather than
 * fabricated against the locked per-relationship truth in WO §10.
 */

// ---------------------------------------------------------------------------
// E. Next Door proposals (exactly 6) — WO §15, manifest §B/§E
// ---------------------------------------------------------------------------

export const FOUNDER_SIMULATED_DOOR_DECISIONS = ['Đồng ý xem tiếp', 'Giữ lại', 'Chưa phù hợp'] as const;
export type FounderSimulatedDoorDecision = (typeof FOUNDER_SIMULATED_DOOR_DECISIONS)[number];

export interface DoorDescriptiveRecord {
  readonly proposedDoor: string;
  readonly whyItMayFit: string;
  readonly valueAlreadyReceived: string;
  readonly currentJourneyClosed: boolean;
  readonly consentSummary: string;
  readonly suppressionSummary: string;
  readonly openCareRecoverySummary: string;
  readonly promiseBlockerSummary: string;
  readonly exclusionsSummary: string;
  readonly nextBestCareFirstSummary: string;
  /** Founder-only, not auto-set; null means not yet decided in this session. */
  readonly founderOnlySimulatedDecision: FounderSimulatedDoorDecision | null;
}

const DOOR_DESCRIPTIONS: Readonly<Record<DoorId, DoorDescriptiveRecord>> = {
  'DOOR-001': { proposedDoor: 'Đồng hành sâu hơn (cánh cửa kế tiếp)', whyItMayFit: 'Đã hoàn tất Lặng, thể hiện sẵn sàng tiếp tục.', valueAlreadyReceived: 'Đã nhận đủ giá trị từ chu trình Lặng.', currentJourneyClosed: true, consentSummary: 'Phù hợp, cho phép liên hệ về bước tiếp theo.', suppressionSummary: 'Không có suppression.', openCareRecoverySummary: 'Không còn care/recovery mở.', promiseBlockerSummary: 'Không có lời hứa quá hạn.', exclusionsSummary: 'Không có.', nextBestCareFirstSummary: 'Không cần care bổ sung trước khi review.', founderOnlySimulatedDecision: null },
  'DOOR-002': { proposedDoor: 'Đồng hành sâu hơn (đề xuất tạm hoãn)', whyItMayFit: 'Đã nhận Hạt Mầm, nhưng access hiện đang lỗi.', valueAlreadyReceived: 'Đã giao Hạt Mầm.', currentJourneyClosed: false, consentSummary: 'Phù hợp.', suppressionSummary: 'Không có suppression.', openCareRecoverySummary: 'Support đang mở (CARE-002, CARE-013).', promiseBlockerSummary: 'Không có.', exclusionsSummary: 'Không có.', nextBestCareFirstSummary: 'Khôi phục access trước khi xem xét bất kỳ đề xuất nào.', founderOnlySimulatedDecision: null },
  'DOOR-003': { proposedDoor: 'Đồng hành sâu hơn (đề xuất tạm hoãn)', whyItMayFit: 'Đã hoàn tất Lặng.', valueAlreadyReceived: 'Đã hoàn tất chu trình Lặng.', currentJourneyClosed: true, consentSummary: 'Phù hợp.', suppressionSummary: 'Không có suppression.', openCareRecoverySummary: 'Recovery nhẹ đang mở trên hành trình follow-up (CARE-001).', promiseBlockerSummary: 'Follow-up quá hạn 1 ngày (PROM-002).', exclusionsSummary: 'Không có.', nextBestCareFirstSummary: 'Hoàn tất follow-up quá hạn trước khi xem xét đề xuất.', founderOnlySimulatedDecision: null },
  'DOOR-004': { proposedDoor: 'Đồng hành sâu hơn (đề xuất tạm hoãn)', whyItMayFit: 'Đã nhận Hạt Mầm và hoàn tất Lặng.', valueAlreadyReceived: 'Đã hoàn tất Lặng và nhận Hạt Mầm.', currentJourneyClosed: true, consentSummary: 'Chưa rõ cho liên hệ tiếp theo.', suppressionSummary: 'Không có suppression.', openCareRecoverySummary: 'Không có.', promiseBlockerSummary: 'Không có.', exclusionsSummary: 'Không có.', nextBestCareFirstSummary: 'Làm rõ consent trước khi liên hệ thêm.', founderOnlySimulatedDecision: null },
  'DOOR-005': { proposedDoor: 'Đồng hành sâu hơn (đề xuất tạm hoãn)', whyItMayFit: 'Không đánh giá được khi suppression còn hiệu lực.', valueAlreadyReceived: 'Chưa hoàn tất chu trình.', currentJourneyClosed: false, consentSummary: 'Không áp dụng khi suppression còn hiệu lực.', suppressionSummary: 'Suppression active_30d (SUP-005).', openCareRecoverySummary: 'Support giữ yên đang mở (CARE-004).', promiseBlockerSummary: 'Không có.', exclusionsSummary: 'Khách yêu cầu 30 ngày không liên hệ.', nextBestCareFirstSummary: 'Tôn trọng khoảng nghỉ đến ngày review.', founderOnlySimulatedDecision: null },
  'DOOR-006': { proposedDoor: 'Re-review đồng hành sâu hơn', whyItMayFit: 'Recovery đã đóng, khoảng chờ Founder trước đây đã kết thúc.', valueAlreadyReceived: 'Đã hoàn tất Lặng và Reading Room.', currentJourneyClosed: true, consentSummary: 'Phù hợp.', suppressionSummary: 'Không có suppression.', openCareRecoverySummary: 'Đã đóng (CARE-010).', promiseBlockerSummary: 'Không có lời hứa quá hạn.', exclusionsSummary: 'Không có.', nextBestCareFirstSummary: 'Không cần care bổ sung; đến hạn Founder re-review hôm nay.', founderOnlySimulatedDecision: null },
} as const;

export type DoorRecord = (typeof DOOR_OWNERSHIP)[DoorId] & DoorDescriptiveRecord & { readonly id: DoorId };

export const DOOR_RECORDS: Readonly<Record<DoorId, DoorRecord>> = Object.fromEntries(
  DOOR_IDS.map((id) => [id, { id, ...DOOR_OWNERSHIP[id], ...DOOR_DESCRIPTIONS[id] }])
) as Readonly<Record<DoorId, DoorRecord>>;

export interface DoorEligibility {
  readonly blocked: boolean;
  readonly eligible: boolean;
  readonly reasons: readonly string[];
}

/**
 * Pure derivation only — offerBlocked/eligibility for a Door proposal is
 * never stored as mutable fixture truth on the proposal record itself
 * (manifest §E; LOCKED OPERATING TRUTHS). Reads only already-declared
 * canonical/synthetic facts: the door's own journey stage, its explicit
 * canonical blockingCareIds/blockingPromiseIds, consent/suppression state,
 * and its own proposalState.
 */
export function deriveDoorBlockers(doorId: DoorId): DoorEligibility {
  const door = DOOR_RECORDS[doorId];
  const reasons: string[] = [];

  const journeyNotClosed = JOURNEY_RECORDS[door.journeyId].stage !== 'closed';
  if (journeyNotClosed) reasons.push('Hành trình hiện tại chưa khép.');

  const openBlockingCare = door.blockingCareIds.some((cid) => CARE_RECORDS[cid].status === 'open');
  if (openBlockingCare) reasons.push('Còn care/support/recovery đang mở chặn cánh cửa này.');

  const overduePromiseBlock = door.blockingPromiseIds.some((pid) => PROMISE_RECORDS[pid].dueStatus === 'overdue');
  if (overduePromiseBlock) reasons.push('Còn lời hứa quá hạn chặn cánh cửa này.');

  const missingConsent = KNOWN_CONSENT_FLAGS_LOCAL[door.consentId] === 'unclear';
  if (missingConsent) reasons.push('Consent cho liên hệ tiếp theo chưa rõ.');

  const activeSuppression = SUPPRESSION_STATE_RECORDS[door.suppressionId].state !== 'inactive';
  if (activeSuppression) reasons.push('Suppression đang có hiệu lực.');

  const founderDeferred = door.proposalState === 'founder_deferred';
  if (founderDeferred) reasons.push('Founder đã chọn chờ (founder_deferred) — vẫn cần Founder tự quyết định lại.');

  const blocked = journeyNotClosed || openBlockingCare || overduePromiseBlock || missingConsent || activeSuppression || founderDeferred;
  const eligible = !blocked && door.proposalState === 'eligible';

  return { blocked, eligible, reasons };
}

// ---------------------------------------------------------------------------
// F. Consent states (16) and Suppression states (16)
// ---------------------------------------------------------------------------

export type ConsentUniverseState = 'granted' | 'unclear';
export type SuppressionUniverseState = 'inactive' | 'active_7d' | 'active_30d' | 'active_indefinite';

export interface ConsentStateRecord {
  readonly id: ConsentRecordId;
  readonly relationshipId: RelationshipId;
  readonly state: ConsentUniverseState;
  readonly note: string;
}

export interface SuppressionStateRecord {
  readonly id: SuppressionRecordId;
  readonly relationshipId: RelationshipId;
  readonly state: SuppressionUniverseState;
  readonly note: string;
}

/** Manifest §B explicitly flags only CNS-007 as 'unclear'; kept in sync here. */
const KNOWN_CONSENT_FLAGS_LOCAL: Readonly<Partial<Record<ConsentRecordId, 'unclear'>>> = {
  'CNS-007': 'unclear',
} as const;

const CONSENT_STATE_BY_ID: Readonly<Record<ConsentRecordId, { state: ConsentUniverseState; note: string }>> = {
  'CNS-001': { state: 'granted', note: 'Cho phép liên hệ về quyết định Founder Gate.' },
  'CNS-002': { state: 'granted', note: 'Cho phép liên hệ chăm sóc theo kênh đã đăng ký.' },
  'CNS-003': { state: 'granted', note: 'Cho phép liên hệ support theo kênh đã đăng ký.' },
  'CNS-004': { state: 'unclear', note: 'Đang trong review an toàn; chưa xác nhận lại phạm vi liên hệ.' },
  'CNS-005': { state: 'granted', note: 'Cho phép liên hệ đúng vào ngày review đã hẹn.' },
  'CNS-006': { state: 'granted', note: 'Cho phép liên hệ về bước tiếp theo.' },
  'CNS-007': { state: 'unclear', note: 'Chưa rõ cho liên hệ tiếp theo.' },
  'CNS-008': { state: 'granted', note: 'Cho phép liên hệ chăm sóc cho cả hai hành trình.' },
  'CNS-009': { state: 'granted', note: 'Cho phép hỏi lại đúng phần operational fact còn thiếu.' },
  'CNS-010': { state: 'granted', note: 'Cho phép liên hệ về publication approval.' },
  'CNS-011': { state: 'granted', note: 'Cho phép liên hệ xác minh payment report.' },
  'CNS-012': { state: 'granted', note: 'Cho phép liên hệ hoàn tất closing note.' },
  'CNS-013': { state: 'granted', note: 'Cho phép liên hệ về recovery entitlement.' },
  'CNS-014': { state: 'granted', note: 'Cho phép liên hệ sau khoảng im lặng 7 ngày.' },
  'CNS-015': { state: 'granted', note: 'Cho phép liên hệ chung; ranh giới testimonial/public consent theo dõi riêng.' },
  'CNS-016': { state: 'granted', note: 'Cho phép liên hệ về re-review cánh cửa tiếp theo.' },
} as const;

const SUPPRESSION_STATE_BY_ID: Readonly<Record<SuppressionRecordId, { state: SuppressionUniverseState; note: string }>> = {
  'SUP-001': { state: 'inactive', note: 'Không có suppression.' },
  'SUP-002': { state: 'inactive', note: 'Không có suppression.' },
  'SUP-003': { state: 'inactive', note: 'Không marketing trong thời gian support mở (không phải suppression toàn phần).' },
  'SUP-004': { state: 'active_indefinite', note: 'Toàn bộ outbound bị suppression cho đến khi containment đóng.' },
  'SUP-005': { state: 'active_30d', note: 'Khách yêu cầu 30 ngày không liên hệ.' },
  'SUP-006': { state: 'inactive', note: 'Không có suppression.' },
  'SUP-007': { state: 'inactive', note: 'Không có suppression (blocker là consent, không phải suppression).' },
  'SUP-008': { state: 'inactive', note: 'Không có suppression.' },
  'SUP-009': { state: 'inactive', note: 'Không có suppression.' },
  'SUP-010': { state: 'inactive', note: 'Không có suppression.' },
  'SUP-011': { state: 'inactive', note: 'Không có suppression.' },
  'SUP-012': { state: 'inactive', note: 'Không có suppression.' },
  'SUP-013': { state: 'inactive', note: 'Không có suppression.' },
  'SUP-014': { state: 'active_7d', note: 'Im lặng có chủ đích 7 ngày sau khi giao sản phẩm.' },
  'SUP-015': { state: 'inactive', note: 'Không có suppression.' },
  'SUP-016': { state: 'inactive', note: 'Không có suppression.' },
} as const;

export const CONSENT_STATE_RECORDS: Readonly<Record<ConsentRecordId, ConsentStateRecord>> = Object.fromEntries(
  CONSENT_RECORD_IDS.map((id) => [
    id,
    { id, relationshipId: CONSENT_OWNERSHIP[id], ...CONSENT_STATE_BY_ID[id] },
  ])
) as Readonly<Record<ConsentRecordId, ConsentStateRecord>>;

export const SUPPRESSION_STATE_RECORDS: Readonly<Record<SuppressionRecordId, SuppressionStateRecord>> = Object.fromEntries(
  SUPPRESSION_RECORD_IDS.map((id) => [
    id,
    { id, relationshipId: SUPPRESSION_OWNERSHIP[id], ...SUPPRESSION_STATE_BY_ID[id] },
  ])
) as Readonly<Record<SuppressionRecordId, SuppressionStateRecord>>;

// ---------------------------------------------------------------------------
// G. Founder Gates
// ---------------------------------------------------------------------------

export const FOUNDER_GATE_IDS = ['FGATE-001', 'FGATE-002', 'FGATE-003', 'FGATE-004'] as const;
export type FounderGateId = (typeof FOUNDER_GATE_IDS)[number];

export interface FounderGateRecord {
  readonly id: FounderGateId;
  readonly relationshipId: RelationshipId;
  readonly journeyId: JourneyId;
  readonly decisionNeeded: string;
  readonly dueLabel: string;
  readonly status: 'pending' | 'resolved';
}

export const FOUNDER_GATE_RECORDS: Readonly<Record<FounderGateId, FounderGateRecord>> = {
  'FGATE-001': { id: 'FGATE-001', relationshipId: 'SYN-001', journeyId: 'JRN-001', decisionNeeded: 'Fit / Wait / Decline', dueLabel: 'Phản hồi dự kiến ngày mai', status: 'pending' },
  'FGATE-002': { id: 'FGATE-002', relationshipId: 'SYN-008', journeyId: 'JRN-012', decisionNeeded: 'Chọn journey chính để chăm sóc', dueLabel: 'Không có hạn cứng, nên quyết định sớm', status: 'pending' },
  'FGATE-003': { id: 'FGATE-003', relationshipId: 'SYN-010', journeyId: 'JRN-015', decisionNeeded: 'Duyệt publication', dueLabel: 'Đến hạn hôm nay', status: 'pending' },
  'FGATE-004': { id: 'FGATE-004', relationshipId: 'SYN-016', journeyId: 'JRN-023', decisionNeeded: 'Re-review cánh cửa tiếp theo (founder_deferred)', dueLabel: 'Đến hạn re-review hôm nay', status: 'pending' },
} as const;

// ---------------------------------------------------------------------------
// H. Order / Payment truth and Publication / Entitlement truth
// ---------------------------------------------------------------------------

export const PAYMENT_STATES = ['not_applicable', 'reported_not_confirmed', 'confirmed'] as const;
export type PaymentState = (typeof PAYMENT_STATES)[number];

export const PUBLICATION_ENTITLEMENT_STATES = [
  'not_applicable',
  'draft_ready_pending_approval',
  'entitlement_active',
  'entitlement_suspended',
  'entitlement_access_failure',
  'entitlement_closed',
] as const;
export type PublicationEntitlementState = (typeof PUBLICATION_ENTITLEMENT_STATES)[number];

export interface OrderPaymentTruthRecord {
  readonly relationshipId: RelationshipId;
  readonly state: PaymentState;
  readonly note: string;
}

export interface PublicationEntitlementTruthRecord {
  readonly relationshipId: RelationshipId;
  readonly state: PublicationEntitlementState;
  readonly note: string;
}

export const ORDER_PAYMENT_TRUTH_RECORDS: Readonly<Record<RelationshipId, OrderPaymentTruthRecord>> = {
  'SYN-001': { relationshipId: 'SYN-001', state: 'not_applicable', note: 'Chưa qua Human Decision Gate, chưa tới bước thanh toán.' },
  'SYN-002': { relationshipId: 'SYN-002', state: 'confirmed', note: 'Payment đã xác nhận trước khi chu trình Lặng hoàn tất.' },
  'SYN-003': { relationshipId: 'SYN-003', state: 'confirmed', note: 'Payment đã xác nhận trước khi giao Hạt Mầm.' },
  'SYN-004': { relationshipId: 'SYN-004', state: 'confirmed', note: 'Payment đã xác nhận trước khi giao Hạt Mầm.' },
  'SYN-005': { relationshipId: 'SYN-005', state: 'confirmed', note: 'Payment đã xác nhận trước khoảng nghỉ hiện tại.' },
  'SYN-006': { relationshipId: 'SYN-006', state: 'confirmed', note: 'Payment đã xác nhận, chu trình đã khép.' },
  'SYN-007': { relationshipId: 'SYN-007', state: 'confirmed', note: 'Payment đã xác nhận cho cả Lặng và Hạt Mầm.' },
  'SYN-008': { relationshipId: 'SYN-008', state: 'confirmed', note: 'Payment đã xác nhận cho cả hai hành trình đang active.' },
  'SYN-009': { relationshipId: 'SYN-009', state: 'not_applicable', note: 'Còn ở bước intake, chưa tới bước thanh toán.' },
  'SYN-010': { relationshipId: 'SYN-010', state: 'confirmed', note: 'Payment đã xác nhận trước khi sản xuất bản nháp.' },
  'SYN-011': { relationshipId: 'SYN-011', state: 'reported_not_confirmed', note: 'Khách đã báo thanh toán nhưng chưa được xác nhận; booking chưa hợp lệ.' },
  'SYN-012': { relationshipId: 'SYN-012', state: 'confirmed', note: 'Payment đã xác nhận trước buổi Lặng cuối cùng.' },
  'SYN-013': { relationshipId: 'SYN-013', state: 'confirmed', note: 'Payment đã xác nhận trước khi giao Hạt Mầm.' },
  'SYN-014': { relationshipId: 'SYN-014', state: 'confirmed', note: 'Payment đã xác nhận trước khi giao sản phẩm hôm qua.' },
  'SYN-015': { relationshipId: 'SYN-015', state: 'confirmed', note: 'Payment đã xác nhận, cả hai chu trình đã khép.' },
  'SYN-016': { relationshipId: 'SYN-016', state: 'confirmed', note: 'Payment đã xác nhận, cả hai chu trình đã khép.' },
} as const;

export const PUBLICATION_ENTITLEMENT_TRUTH_RECORDS: Readonly<Record<RelationshipId, PublicationEntitlementTruthRecord>> = {
  'SYN-001': { relationshipId: 'SYN-001', state: 'not_applicable', note: 'Lặng only, chưa có publication/entitlement.' },
  'SYN-002': { relationshipId: 'SYN-002', state: 'not_applicable', note: 'Lặng only.' },
  'SYN-003': { relationshipId: 'SYN-003', state: 'entitlement_access_failure', note: 'Entitlement được cấp nhưng access đang lỗi (link exists ≠ access granted).' },
  'SYN-004': { relationshipId: 'SYN-004', state: 'entitlement_suspended', note: 'Reading Room tạm ngưng vì nghi vấn an toàn.' },
  'SYN-005': { relationshipId: 'SYN-005', state: 'not_applicable', note: 'Lặng only.' },
  'SYN-006': { relationshipId: 'SYN-006', state: 'not_applicable', note: 'Lặng only, đã khép.' },
  'SYN-007': { relationshipId: 'SYN-007', state: 'entitlement_active', note: 'Không có sự cố access được báo cáo.' },
  'SYN-008': { relationshipId: 'SYN-008', state: 'entitlement_active', note: 'Hạt Mầm đang active song song với Lặng.' },
  'SYN-009': { relationshipId: 'SYN-009', state: 'not_applicable', note: 'Còn ở bước intake, chưa giao sản phẩm.' },
  'SYN-010': { relationshipId: 'SYN-010', state: 'draft_ready_pending_approval', note: 'Bản nháp sẵn sàng, chờ Founder approve trước khi phát hành.' },
  'SYN-011': { relationshipId: 'SYN-011', state: 'not_applicable', note: 'Lặng, payment còn chưa được xác nhận.' },
  'SYN-012': { relationshipId: 'SYN-012', state: 'not_applicable', note: 'Lặng only.' },
  'SYN-013': { relationshipId: 'SYN-013', state: 'entitlement_access_failure', note: 'Entitlement bất ngờ không hoạt động, đang recovery.' },
  'SYN-014': { relationshipId: 'SYN-014', state: 'entitlement_active', note: 'Sản phẩm giao hôm qua, không có sự cố access được báo cáo.' },
  'SYN-015': { relationshipId: 'SYN-015', state: 'entitlement_closed', note: 'Hạt Mầm — Closed.' },
  'SYN-016': { relationshipId: 'SYN-016', state: 'entitlement_closed', note: 'Reading Room — Closed.' },
} as const;

// ---------------------------------------------------------------------------
// I. Timeline events (exactly 42) — WO §16
// ---------------------------------------------------------------------------

export const TIMELINE_EVENT_TYPES = [
  'intake_received',
  'founder_review_requested',
  'customer_reply',
  'payment_reported',
  'payment_confirmed',
  'booking_eligible',
  'session_completed',
  'publication_approved',
  'product_delivered',
  'entitlement_granted',
  'access_failed',
  'support_opened',
  'containment_applied',
  'recovery_closed',
  'consent_updated',
  'suppression_applied',
  'promise_created',
  'promise_completed',
  'promise_missed',
  'follow_up_completed',
  'next_door_reviewed',
  'founder_chose_wait',
] as const;

export type TimelineEventType = (typeof TIMELINE_EVENT_TYPES)[number];
export type TimelineVisibility = 'internal' | 'customer_facing';

export type TimelineEventId = `EVT-${string}`;

export interface TimelineEventRecord {
  readonly id: TimelineEventId;
  readonly relationshipId: RelationshipId;
  readonly journeyId: JourneyId;
  readonly type: TimelineEventType;
  readonly visibility: TimelineVisibility;
  /** Chronological order within the relationship's own timeline (1-based, not a calendar date). */
  readonly order: number;
}

const CUSTOMER_FACING_EVENT_TYPES: ReadonlySet<TimelineEventType> = new Set([
  'intake_received',
  'customer_reply',
  'payment_reported',
  'payment_confirmed',
  'booking_eligible',
  'session_completed',
  'product_delivered',
  'entitlement_granted',
  'access_failed',
]);

function visibilityFor(type: TimelineEventType): TimelineVisibility {
  return CUSTOMER_FACING_EVENT_TYPES.has(type) ? 'customer_facing' : 'internal';
}

interface TimelineSeed {
  readonly relationshipId: RelationshipId;
  readonly journeyId: JourneyId;
  readonly type: TimelineEventType;
}

const TIMELINE_SEEDS: readonly TimelineSeed[] = [
  // SYN-001 (3)
  { relationshipId: 'SYN-001', journeyId: 'JRN-001', type: 'intake_received' },
  { relationshipId: 'SYN-001', journeyId: 'JRN-001', type: 'founder_review_requested' },
  { relationshipId: 'SYN-001', journeyId: 'JRN-001', type: 'consent_updated' },
  // SYN-002 (4)
  { relationshipId: 'SYN-002', journeyId: 'JRN-002', type: 'session_completed' },
  { relationshipId: 'SYN-002', journeyId: 'JRN-003', type: 'promise_created' },
  { relationshipId: 'SYN-002', journeyId: 'JRN-003', type: 'promise_missed' },
  { relationshipId: 'SYN-002', journeyId: 'JRN-003', type: 'customer_reply' },
  // SYN-003 (3)
  { relationshipId: 'SYN-003', journeyId: 'JRN-005', type: 'product_delivered' },
  { relationshipId: 'SYN-003', journeyId: 'JRN-004', type: 'entitlement_granted' },
  { relationshipId: 'SYN-003', journeyId: 'JRN-004', type: 'access_failed' },
  // SYN-004 (3)
  { relationshipId: 'SYN-004', journeyId: 'JRN-007', type: 'product_delivered' },
  { relationshipId: 'SYN-004', journeyId: 'JRN-006', type: 'containment_applied' },
  { relationshipId: 'SYN-004', journeyId: 'JRN-006', type: 'suppression_applied' },
  // SYN-005 (2)
  { relationshipId: 'SYN-005', journeyId: 'JRN-008', type: 'customer_reply' },
  { relationshipId: 'SYN-005', journeyId: 'JRN-008', type: 'suppression_applied' },
  // SYN-006 (2)
  { relationshipId: 'SYN-006', journeyId: 'JRN-009', type: 'session_completed' },
  { relationshipId: 'SYN-006', journeyId: 'JRN-009', type: 'recovery_closed' },
  // SYN-007 (3)
  { relationshipId: 'SYN-007', journeyId: 'JRN-011', type: 'product_delivered' },
  { relationshipId: 'SYN-007', journeyId: 'JRN-010', type: 'session_completed' },
  { relationshipId: 'SYN-007', journeyId: 'JRN-010', type: 'consent_updated' },
  // SYN-008 (3)
  { relationshipId: 'SYN-008', journeyId: 'JRN-013', type: 'intake_received' },
  { relationshipId: 'SYN-008', journeyId: 'JRN-012', type: 'founder_review_requested' },
  { relationshipId: 'SYN-008', journeyId: 'JRN-012', type: 'booking_eligible' },
  // SYN-009 (2)
  { relationshipId: 'SYN-009', journeyId: 'JRN-014', type: 'intake_received' },
  { relationshipId: 'SYN-009', journeyId: 'JRN-014', type: 'support_opened' },
  // SYN-010 (2)
  { relationshipId: 'SYN-010', journeyId: 'JRN-015', type: 'payment_confirmed' },
  { relationshipId: 'SYN-010', journeyId: 'JRN-015', type: 'founder_review_requested' },
  // SYN-011 (2)
  { relationshipId: 'SYN-011', journeyId: 'JRN-016', type: 'payment_reported' },
  { relationshipId: 'SYN-011', journeyId: 'JRN-016', type: 'founder_review_requested' },
  // SYN-012 (2)
  { relationshipId: 'SYN-012', journeyId: 'JRN-017', type: 'session_completed' },
  { relationshipId: 'SYN-012', journeyId: 'JRN-017', type: 'promise_created' },
  // SYN-013 (3)
  { relationshipId: 'SYN-013', journeyId: 'JRN-018', type: 'product_delivered' },
  { relationshipId: 'SYN-013', journeyId: 'JRN-019', type: 'entitlement_granted' },
  { relationshipId: 'SYN-013', journeyId: 'JRN-019', type: 'access_failed' },
  // SYN-014 (2)
  { relationshipId: 'SYN-014', journeyId: 'JRN-020', type: 'product_delivered' },
  { relationshipId: 'SYN-014', journeyId: 'JRN-020', type: 'suppression_applied' },
  // SYN-015 (3)
  { relationshipId: 'SYN-015', journeyId: 'JRN-021', type: 'session_completed' },
  { relationshipId: 'SYN-015', journeyId: 'JRN-022', type: 'product_delivered' },
  { relationshipId: 'SYN-015', journeyId: 'JRN-021', type: 'customer_reply' },
  // SYN-016 (3)
  { relationshipId: 'SYN-016', journeyId: 'JRN-023', type: 'recovery_closed' },
  { relationshipId: 'SYN-016', journeyId: 'JRN-023', type: 'founder_chose_wait' },
  { relationshipId: 'SYN-016', journeyId: 'JRN-023', type: 'next_door_reviewed' },
];

function buildTimelineEvents(): readonly TimelineEventRecord[] {
  const orderByRelationship = new Map<RelationshipId, number>();
  return TIMELINE_SEEDS.map((seed, index) => {
    const order = (orderByRelationship.get(seed.relationshipId) ?? 0) + 1;
    orderByRelationship.set(seed.relationshipId, order);
    const id = `EVT-${String(index + 1).padStart(3, '0')}` as TimelineEventId;
    return {
      id,
      relationshipId: seed.relationshipId,
      journeyId: seed.journeyId,
      type: seed.type,
      visibility: visibilityFor(seed.type),
      order,
    };
  });
}

export const TIMELINE_EVENTS: readonly TimelineEventRecord[] = buildTimelineEvents();

// ---------------------------------------------------------------------------
// J. Today Queue detail (18) — WO §12 per-item requirement block
// ---------------------------------------------------------------------------

export interface TodayQueueDetail {
  readonly whatHappened: string;
  readonly whyNow: string;
  readonly riskOrDeadlineFact: string;
  readonly owner: string;
  readonly nextBestCare: string;
  readonly offerBlocked: boolean;
  readonly offerBlockedReason: string | null;
  readonly founderDecisionRequired: boolean;
  readonly validSimulatedActions: readonly string[];
}

export const TODAY_QUEUE_DETAILS: Readonly<Record<TodayQueueId, TodayQueueDetail>> = {
  'Q-001': { whatHappened: 'Phát hiện dấu hiệu recipient không khớp với contact đã xác minh khi gửi Hạt Mầm.', whyNow: 'Nghi ngờ gửi nhầm người nhận.', riskOrDeadlineFact: 'Rủi ro privacy nếu không containment ngay.', owner: 'Kenji', nextBestCare: 'Khóa đường gửi, xác minh người nhận, mở recovery case.', offerBlocked: true, offerBlockedReason: 'Containment an toàn đang mở (CARE-003).', founderDecisionRequired: true, validSimulatedActions: ['Đánh dấu đã xem', 'Xác minh người nhận (mô phỏng)', 'Ghi nhận containment (mô phỏng)'] },
  'Q-002': { whatHappened: 'Entitlement Reading Room bất ngờ không hoạt động dù sản phẩm đã giao.', whyNow: 'Recovery đang mở và lời hứa khôi phục sắp đến hạn.', riskOrDeadlineFact: 'PROM-007 đến hạn hôm nay.', owner: 'Kenji', nextBestCare: 'Khôi phục entitlement và xác nhận với khách.', offerBlocked: true, offerBlockedReason: 'Recovery đang mở (CARE-007).', founderDecisionRequired: false, validSimulatedActions: ['Đánh dấu đã xem', 'Khôi phục entitlement (mô phỏng)', 'Xác nhận với khách (mô phỏng)'] },
  'Q-003': { whatHappened: 'Follow-up sau Lặng đã hứa nhưng quá hạn; khách đã chủ động nhắc lại.', whyNow: 'Khách đã nhắc lại tạo customer concern cần xử lý sớm.', riskOrDeadlineFact: 'PROM-002 quá hạn 1 ngày.', owner: 'Kenji', nextBestCare: 'Duyệt recovery wording và hoàn tất follow-up.', offerBlocked: true, offerBlockedReason: 'Cánh cửa tiếp theo (DOOR-003) đang bị chặn bởi lời hứa quá hạn.', founderDecisionRequired: false, validSimulatedActions: ['Đánh dấu đã xem', 'Duyệt recovery wording (mô phỏng)', 'Đánh dấu đã hoàn tất follow-up (mô phỏng)'] },
  'Q-004': { whatHappened: 'Hồ sơ Lặng đã đủ facts vận hành sau six-question support report.', whyNow: 'Quyết định fit/wait/decline chỉ Founder được thực hiện.', riskOrDeadlineFact: 'Phản hồi dự kiến ngày mai (PROM-001).', owner: 'Kenji', nextBestCare: 'Mở đủ ngữ cảnh trong workspace Lặng và ghi rationale tối thiểu.', offerBlocked: false, offerBlockedReason: null, founderDecisionRequired: true, validSimulatedActions: ['Đánh dấu đã xem', 'Chọn Fit (mô phỏng)', 'Chọn Wait (mô phỏng)', 'Chọn Decline (mô phỏng)'] },
  'Q-005': { whatHappened: 'Lặng và Hạt Mầm phát sinh việc chồng nhau trong cùng thời điểm.', whyNow: 'Cần một journey chính để tập trung chăm sóc, tránh bỏ sót.', riskOrDeadlineFact: 'PROM-003 chưa có hạn cứng nhưng nên quyết định sớm.', owner: 'Kenji', nextBestCare: 'Founder chọn journey chính.', offerBlocked: false, offerBlockedReason: null, founderDecisionRequired: true, validSimulatedActions: ['Đánh dấu đã xem', 'Chọn Lặng làm journey chính (mô phỏng)', 'Chọn Hạt Mầm làm journey chính (mô phỏng)'] },
  'Q-006': { whatHappened: 'Bản nháp Hạt Mầm hoàn tất sản xuất và sẵn sàng.', whyNow: 'Chờ Founder approve trước khi giao, lời hứa giao đến hạn hôm nay.', riskOrDeadlineFact: 'PROM-004 đến hạn hôm nay.', owner: 'Kenji', nextBestCare: 'Duyệt publication.', offerBlocked: false, offerBlockedReason: null, founderDecisionRequired: true, validSimulatedActions: ['Đánh dấu đã xem', 'Duyệt publication (mô phỏng)', 'Yêu cầu chỉnh sửa (mô phỏng)'] },
  'Q-007': { whatHappened: 'Follow-up sau Lặng quá hạn (cùng sự việc với Q-003, nhìn từ góc độ lời hứa).', whyNow: 'Lời hứa đã ghi nhận nhưng chưa hoàn thành đúng hạn.', riskOrDeadlineFact: 'Quá hạn 1 ngày.', owner: 'Kenji', nextBestCare: 'Hoàn tất follow-up trước khi cân nhắc bất kỳ đề xuất nào.', offerBlocked: true, offerBlockedReason: 'Cánh cửa tiếp theo (DOOR-003) đang care_first.', founderDecisionRequired: false, validSimulatedActions: ['Đánh dấu đã xem', 'Hoàn tất follow-up (mô phỏng)'] },
  'Q-008': { whatHappened: 'Khách báo đã thanh toán nhưng chưa được xác nhận.', whyNow: 'Booking chưa hợp lệ cho đến khi payment được xác minh.', riskOrDeadlineFact: 'PROM-005 đến hạn hôm nay.', owner: 'Kenji', nextBestCare: 'Xác minh payment report.', offerBlocked: false, offerBlockedReason: null, founderDecisionRequired: false, validSimulatedActions: ['Đánh dấu đã xem', 'Xác minh payment report (mô phỏng)'] },
  'Q-009': { whatHappened: 'Buổi Lặng cuối cùng đã hoàn tất nhưng closing note chưa xong.', whyNow: 'Journey chưa thể khép cho đến khi closing note hoàn tất.', riskOrDeadlineFact: 'PROM-006 đến hạn hôm nay.', owner: 'Kenji', nextBestCare: 'Hoàn tất closing note.', offerBlocked: false, offerBlockedReason: null, founderDecisionRequired: false, validSimulatedActions: ['Đánh dấu đã xem', 'Hoàn tất closing note (mô phỏng)'] },
  'Q-010': { whatHappened: 'Khách không truy cập được Reading Room dù entitlement đang active.', whyNow: 'Support phải đứng trước offer.', riskOrDeadlineFact: 'Còn 5 giờ theo cam kết phản hồi support.', owner: 'Kenji', nextBestCare: 'Kiểm tra access state và hướng dẫn lại qua kênh đã consent.', offerBlocked: true, offerBlockedReason: 'Đề xuất bị chặn đến khi support đóng (DOOR-002).', founderDecisionRequired: false, validSimulatedActions: ['Đánh dấu đã xem', 'Kiểm tra access state (mô phỏng)', 'Phản hồi qua kênh consent (mô phỏng)'] },
  'Q-011': { whatHappened: 'Intake Hạt Mầm thiếu một operational fact tối thiểu.', whyNow: 'Cần hỏi lại đúng phần thiếu mà không thu thập quá mức.', riskOrDeadlineFact: 'Không có hạn cứng.', owner: 'Kenji', nextBestCare: 'Hỏi lại operational fact tối thiểu.', offerBlocked: false, offerBlockedReason: null, founderDecisionRequired: false, validSimulatedActions: ['Đánh dấu đã xem', 'Hỏi lại operational fact (mô phỏng)'] },
  'Q-012': { whatHappened: 'Chưa rõ consent cho liên hệ tiếp theo.', whyNow: 'Cần làm rõ trước khi liên hệ thêm hoặc xem xét cánh cửa tiếp theo.', riskOrDeadlineFact: 'Không có hạn cứng.', owner: 'Kenji', nextBestCare: 'Làm rõ consent trước liên hệ tiếp.', offerBlocked: true, offerBlockedReason: 'DOOR-004 bị chặn bởi consent chưa rõ.', founderDecisionRequired: false, validSimulatedActions: ['Đánh dấu đã xem', 'Làm rõ consent (mô phỏng)'] },
  'Q-013': { whatHappened: 'Khách yêu cầu 30 ngày không liên hệ.', whyNow: 'Suppression đang hiệu lực; im lặng là hành động hợp lệ.', riskOrDeadlineFact: 'Xem lại sau 30 ngày.', owner: 'Hệ thống nhắc việc', nextBestCare: 'Giữ yên và chỉ mở lại đúng ngày review.', offerBlocked: true, offerBlockedReason: 'DOOR-005 bị chặn bởi suppression active_30d.', founderDecisionRequired: false, validSimulatedActions: ['Đánh dấu đã xem', 'Giữ yên (mô phỏng)'] },
  'Q-014': { whatHappened: 'Khách vừa nhận sản phẩm hôm qua.', whyNow: 'Hệ thống đề xuất im lặng 7 ngày để khách tự trải nghiệm.', riskOrDeadlineFact: 'Xem lại sau 7 ngày.', owner: 'Hệ thống nhắc việc', nextBestCare: 'Giữ yên có chủ đích trong 7 ngày.', offerBlocked: false, offerBlockedReason: null, founderDecisionRequired: false, validSimulatedActions: ['Đánh dấu đã xem', 'Giữ yên (mô phỏng)'] },
  'Q-015': { whatHappened: 'Recovery trước đây đã đóng; Founder từng chọn chờ.', whyNow: 'Khoảng chờ đã hoàn tất, đến ngày review lại.', riskOrDeadlineFact: 'Đến hạn re-review hôm nay (PROM-010).', owner: 'Kenji', nextBestCare: 'Không cần care bổ sung; sẵn sàng để Founder re-review.', offerBlocked: true, offerBlockedReason: 'DOOR-006 vẫn ở trạng thái founder_deferred cho đến khi Founder tự quyết định.', founderDecisionRequired: true, validSimulatedActions: ['Đánh dấu đã xem', 'Re-review cánh cửa tiếp theo (mô phỏng)', 'Giữ lại (mô phỏng)'] },
  'Q-016': { whatHappened: 'Đã nhận đủ giá trị, support đóng, consent phù hợp.', whyNow: 'Đủ điều kiện để Founder xem cánh cửa tiếp theo.', riskOrDeadlineFact: 'Không có hạn cứng.', owner: 'Kenji', nextBestCare: 'Không cần care bổ sung trước khi review.', offerBlocked: false, offerBlockedReason: null, founderDecisionRequired: true, validSimulatedActions: ['Đánh dấu đã xem', 'Đồng ý xem tiếp (mô phỏng)', 'Giữ lại (mô phỏng)', 'Chưa phù hợp (mô phỏng)'] },
  'Q-017': { whatHappened: 'Outcome tích cực được khách tự ghi nhận.', whyNow: 'Cần tách rõ ranh giới testimonial/public consent trước khi xem cánh cửa tiếp theo; chưa có formal Door proposal.', riskOrDeadlineFact: 'Không có hạn cứng.', owner: 'Kenji', nextBestCare: 'Làm rõ ranh giới testimonial/public consent.', offerBlocked: false, offerBlockedReason: 'Chưa có Door proposal chính thức cho Q-017.', founderDecisionRequired: false, validSimulatedActions: ['Đánh dấu đã xem', 'Làm rõ ranh giới consent (mô phỏng)'] },
  'Q-018': { whatHappened: 'Cùng sự việc với Q-015, nhìn từ góc độ cánh cửa tiếp theo.', whyNow: 'Đến ngày review lại theo lịch đã hẹn từ lần Founder chọn chờ trước đây.', riskOrDeadlineFact: 'Đến hạn re-review hôm nay.', owner: 'Kenji', nextBestCare: 'Không cần care bổ sung; sẵn sàng để Founder re-review.', offerBlocked: true, offerBlockedReason: 'DOOR-006 vẫn ở trạng thái founder_deferred cho đến khi Founder tự quyết định.', founderDecisionRequired: true, validSimulatedActions: ['Đánh dấu đã xem', 'Re-review cánh cửa tiếp theo (mô phỏng)', 'Giữ lại (mô phỏng)'] },
} as const;

export const PRIORITY_BUCKET_ORDER: Readonly<Record<PriorityBucket, number>> = {
  'Safety & Recovery': 1,
  'Founder Gate': 2,
  'Promise & Deadline': 3,
  'Care & Support': 4,
  'Waiting & Deliberate Silence': 5,
  'Next Door Review': 6,
} as const;

export function sortTodayQueueIdsByPriority(ids: readonly TodayQueueId[]): readonly TodayQueueId[] {
  return [...ids].sort(
    (a, b) =>
      PRIORITY_BUCKET_ORDER[TODAY_QUEUE_MANIFEST[a].priorityBucket] -
      PRIORITY_BUCKET_ORDER[TODAY_QUEUE_MANIFEST[b].priorityBucket]
  );
}

// ---------------------------------------------------------------------------
// K. Scenario presets — four, deterministic (WO §17)
// ---------------------------------------------------------------------------

export const DEFAULT_SCENARIO_PRESET: ScenarioPreset = 'normal';

const QUIET_ITEMS = sortTodayQueueIdsByPriority(['Q-004', 'Q-009', 'Q-013', 'Q-016']);
const NORMAL_ITEMS = sortTodayQueueIdsByPriority([
  'Q-001', 'Q-003', 'Q-004', 'Q-005', 'Q-007', 'Q-008', 'Q-010', 'Q-011', 'Q-013', 'Q-016',
]);
const PEAK_ITEMS = sortTodayQueueIdsByPriority([...TODAY_QUEUE_IDS]);
const RECOVERY_ITEMS = sortTodayQueueIdsByPriority([
  'Q-001', 'Q-002', 'Q-003', 'Q-007', 'Q-008', 'Q-009', 'Q-010', 'Q-011', 'Q-012', 'Q-013', 'Q-014',
]);

export const SCENARIO_PRESET_ITEMS: Readonly<Record<ScenarioPreset, readonly TodayQueueId[]>> = {
  quiet: QUIET_ITEMS,
  normal: NORMAL_ITEMS,
  peak: PEAK_ITEMS,
  recovery: RECOVERY_ITEMS,
} as const;

export function getTodayQueueForPreset(preset: ScenarioPreset): readonly TodayQueueId[] {
  return SCENARIO_PRESET_ITEMS[preset];
}

// Re-export SCENARIO_PRESETS (canonical) so downstream code has a single import surface.
export { SCENARIO_PRESETS };
export type { ScenarioPreset };

// ---------------------------------------------------------------------------
// L. Cross-checks against manifest totals (used by tests, exported for reuse)
// ---------------------------------------------------------------------------

export const UNIVERSE_ENTITY_COUNTS = {
  relationships: RELATIONSHIP_IDS.length,
  journeys: JOURNEY_IDS.length,
  care: CARE_IDS.length,
  promises: PROMISE_IDS.length,
  doors: DOOR_IDS.length,
  todayQueue: TODAY_QUEUE_IDS.length,
  consentRecords: CONSENT_RECORD_IDS.length,
  suppressionRecords: SUPPRESSION_RECORD_IDS.length,
  timelineEvents: TIMELINE_EVENTS.length,
  scenarioPresets: SCENARIO_PRESETS.length,
} as const;

export { TIMELINE_EVENT_COUNTS, TIMELINE_EVENT_TOTAL };

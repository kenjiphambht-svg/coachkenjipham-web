export type PriorityBucket =
  | 'safety_recovery'
  | 'founder_gate'
  | 'promise_deadline'
  | 'care_support'
  | 'waiting_quiet'
  | 'next_door';

export type JourneyState =
  | 'founder_review'
  | 'waiting_customer'
  | 'waiting_payment'
  | 'in_progress'
  | 'waiting_approval'
  | 'recovering'
  | 'deliberate_silence'
  | 'closed';

export type DoorState =
  | 'care_first'
  | 'blocked'
  | 'eligible_for_founder_review'
  | 'founder_deferred'
  | 'customer_declined'
  | 'closed';

export interface FounderQueueItem {
  id: string;
  bucket: PriorityBucket;
  title: string;
  relationship: string;
  journey: string;
  reason: string;
  dueLabel: string;
  owner: string;
  proposedCare: string;
  warning?: string;
}

export interface RelationshipFixture {
  id: string;
  label: string;
  verification: 'Đã xác minh' | 'Chưa xác minh';
  journeys: string[];
  openCare: string[];
  consent: string;
  suppression: string;
  entitlement: string;
  promise: string;
  founderGate: string;
  doorState: DoorState;
  safeNote: string;
}

export interface JourneyFixture {
  id: string;
  relationship: string;
  product: 'Lặng' | 'Hạt Mầm';
  state: JourneyState;
  currentTruth: string;
  nextStep: string;
  dueLabel: string;
  openCareCount: number;
}

export interface CareFixture {
  id: string;
  type: 'Care' | 'Support' | 'Recovery';
  relationship: string;
  title: string;
  impact: string;
  containment: string;
  nextAction: string;
  dueLabel: string;
  owner: string;
  offerBlock: boolean;
}

export const PRIORITY_ORDER: Record<PriorityBucket, number> = {
  safety_recovery: 1,
  founder_gate: 2,
  promise_deadline: 3,
  care_support: 4,
  waiting_quiet: 5,
  next_door: 6,
};

export const PRIORITY_LABEL: Record<PriorityBucket, string> = {
  safety_recovery: 'An toàn, quyền riêng tư & phục hồi',
  founder_gate: 'Quyết định chờ Founder',
  promise_deadline: 'Lời hứa & deadline',
  care_support: 'Chăm sóc & support',
  waiting_quiet: 'Đang chờ / để yên có chủ đích',
  next_door: 'Cánh cửa tiếp theo',
};

export const queueFixtures: FounderQueueItem[] = [
  {
    id: 'q-wrong-recipient',
    bucket: 'safety_recovery' as PriorityBucket,
    title: 'Nghi ngờ gửi sai người nhận',
    relationship: 'Quan hệ M-104',
    journey: 'Hạt Mầm',
    reason: 'Có dấu hiệu recipient không trùng với contact đã xác minh; cần containment trước mọi hành động khác.',
    dueLabel: 'Xử lý ngay',
    owner: 'Kenji',
    proposedCare: 'Khóa đường gửi, xác minh người nhận và mở recovery case.',
    warning: 'Không mở dữ liệu trẻ từ màn hình này.',
  },
  {
    id: 'q-lang-fit',
    bucket: 'founder_gate' as PriorityBucket,
    title: 'Hồ sơ Lặng chờ quyết định fit / wait / decline',
    relationship: 'Quan hệ L-207',
    journey: 'Lặng',
    reason: 'Đã đủ facts vận hành nhưng quyết định phù hợp chỉ Founder được thực hiện.',
    dueLabel: 'Còn 3 giờ',
    owner: 'Kenji',
    proposedCare: 'Mở đủ ngữ cảnh trong workspace Lặng và ghi rationale tối thiểu.',
  },
  {
    id: 'q-followup-overdue',
    bucket: 'promise_deadline' as PriorityBucket,
    title: 'Follow-up sau Lặng đã quá hạn',
    relationship: 'Quan hệ L-118',
    journey: 'Lặng',
    reason: 'ESSENCE đã ghi lời hứa follow-up nhưng chưa hoàn thành đúng hạn.',
    dueLabel: 'Quá hạn 1 ngày',
    owner: 'Kenji',
    proposedCare: 'Mở recovery trước; chưa cân nhắc offer.',
    warning: 'Cánh cửa tiếp theo đang care_first.',
  },
  {
    id: 'q-reading-room',
    bucket: 'care_support' as PriorityBucket,
    title: 'Khách không truy cập được Reading Room',
    relationship: 'Quan hệ M-221',
    journey: 'Hạt Mầm',
    reason: 'Entitlement có nhưng access đang lỗi; support phải đứng trước offer.',
    dueLabel: 'Còn 5 giờ',
    owner: 'Kenji',
    proposedCare: 'Kiểm tra access state và hướng dẫn lại bằng kênh đã consent.',
    warning: 'Offer proposal bị chặn đến khi support đóng.',
  },
  {
    id: 'q-suppressed',
    bucket: 'waiting_quiet' as PriorityBucket,
    title: 'Không gửi gì lúc này',
    relationship: 'Quan hệ L-304',
    journey: 'Lặng',
    reason: 'Khách đang trong khoảng nghỉ đã thống nhất; suppression còn hiệu lực.',
    dueLabel: 'Xem lại sau 10 ngày',
    owner: 'Hệ thống nhắc việc',
    proposedCare: 'Giữ yên và chỉ mở lại khi đến review date.',
  },
  {
    id: 'q-next-door',
    bucket: 'next_door' as PriorityBucket,
    title: 'Cánh cửa tiếp theo đủ điều kiện để Founder xem',
    relationship: 'Quan hệ L-412',
    journey: 'Lặng đã khép',
    reason: 'Journey đã trao đủ giá trị, không còn care/recovery, khách chủ động hỏi về đồng hành sâu hơn và consent cho phép.',
    dueLabel: 'Review trong 3 ngày',
    owner: 'Kenji',
    proposedCare: 'Review fit/non-fit, capacity và wording; không auto-send.',
  },
].sort((a, b) => PRIORITY_ORDER[a.bucket] - PRIORITY_ORDER[b.bucket]);

export const relationshipFixtures: RelationshipFixture[] = [
  {
    id: 'L-118',
    label: 'Quan hệ L-118',
    verification: 'Đã xác minh',
    journeys: ['Lặng · đã hoàn tất', 'Follow-up · đang phục hồi'],
    openCare: ['Recovery: follow-up quá hạn'],
    consent: 'Cho phép liên hệ chăm sóc qua email',
    suppression: 'Không có suppression',
    entitlement: 'Không có entitlement đang mở',
    promise: 'Follow-up sau Lặng · quá hạn 1 ngày',
    founderGate: 'Duyệt recovery wording',
    doorState: 'care_first',
    safeNote: 'Fact: follow-up chưa hoàn thành. Không ghi nội dung câu chuyện riêng.',
  },
  {
    id: 'M-221',
    label: 'Quan hệ M-221',
    verification: 'Đã xác minh',
    journeys: ['Hạt Mầm · đã giao', 'Reading Room · access issue'],
    openCare: ['Support: không truy cập được Reading Room'],
    consent: 'Cho phép support qua email',
    suppression: 'Không marketing trong thời gian support mở',
    entitlement: 'Hạt Mầm · active nhưng access cần xác minh',
    promise: 'Phản hồi support trong ngày',
    founderGate: 'Không có',
    doorState: 'care_first',
    safeNote: 'Chỉ ghi access state và next action; không hiển thị dữ liệu trẻ.',
  },
  {
    id: 'L-412',
    label: 'Quan hệ L-412',
    verification: 'Đã xác minh',
    journeys: ['Lặng · đã khép'],
    openCare: [],
    consent: 'Cho phép liên hệ về bước tiếp theo đã chủ động hỏi',
    suppression: 'Không có suppression',
    entitlement: 'Lặng · completed',
    promise: 'Không còn lời hứa mở',
    founderGate: 'Review Cánh cửa tiếp theo',
    doorState: 'eligible_for_founder_review',
    safeNote: 'Khách chủ động hỏi về đồng hành sâu hơn. Chưa có lời mời nào được gửi.',
  },
];

export const journeyFixtures: JourneyFixture[] = [
  {
    id: 'J-L207',
    relationship: 'Quan hệ L-207',
    product: 'Lặng',
    state: 'founder_review',
    currentTruth: 'Hồ sơ đã đủ facts vận hành; fit decision chưa được đưa ra.',
    nextStep: 'Founder mở workspace Lặng và chọn fit / wait / decline.',
    dueLabel: 'Còn 3 giờ',
    openCareCount: 0,
  },
  {
    id: 'J-M221',
    relationship: 'Quan hệ M-221',
    product: 'Hạt Mầm',
    state: 'recovering',
    currentTruth: 'Ấn phẩm đã giao; Reading Room access đang lỗi.',
    nextStep: 'Đóng support/recovery trước mọi proposal.',
    dueLabel: 'Còn 5 giờ',
    openCareCount: 1,
  },
  {
    id: 'J-L304',
    relationship: 'Quan hệ L-304',
    product: 'Lặng',
    state: 'deliberate_silence',
    currentTruth: 'Khách đang trong khoảng nghỉ đã thống nhất.',
    nextStep: 'Không liên hệ trước review date.',
    dueLabel: 'Xem lại sau 10 ngày',
    openCareCount: 0,
  },
  {
    id: 'J-L412',
    relationship: 'Quan hệ L-412',
    product: 'Lặng',
    state: 'closed',
    currentTruth: 'Journey đã khép, follow-up hoàn tất, không còn blocker.',
    nextStep: 'Founder review Cánh cửa tiếp theo vì khách đã chủ động hỏi.',
    dueLabel: 'Review trong 3 ngày',
    openCareCount: 0,
  },
];

export const careFixtures: CareFixture[] = [
  {
    id: 'C-001',
    type: 'Recovery',
    relationship: 'Quan hệ M-104',
    title: 'Nghi ngờ gửi sai người nhận',
    impact: 'Rủi ro privacy và wrong-recipient.',
    containment: 'Tạm khóa đường gửi; không mở child detail.',
    nextAction: 'Xác minh recipient và ghi closure evidence.',
    dueLabel: 'Ngay',
    owner: 'Kenji',
    offerBlock: true,
  },
  {
    id: 'C-002',
    type: 'Recovery',
    relationship: 'Quan hệ L-118',
    title: 'Follow-up quá hạn',
    impact: 'Lời hứa trải nghiệm bị đứt.',
    containment: 'Đặt proposal vào care_first.',
    nextAction: 'Duyệt recovery wording và hoàn thành follow-up.',
    dueLabel: 'Quá hạn 1 ngày',
    owner: 'Kenji',
    offerBlock: true,
  },
  {
    id: 'C-003',
    type: 'Support',
    relationship: 'Quan hệ M-221',
    title: 'Reading Room access issue',
    impact: 'Khách chưa nhận đủ giá trị đã được hứa.',
    containment: 'Không giới thiệu sản phẩm khác khi support còn mở.',
    nextAction: 'Kiểm tra entitlement/access và phản hồi qua kênh consent.',
    dueLabel: 'Còn 5 giờ',
    owner: 'Kenji',
    offerBlock: true,
  },
];

export const journeyStateLabel: Record<JourneyState, string> = {
  founder_review: 'Cần Founder đọc',
  waiting_customer: 'Chờ khách',
  waiting_payment: 'Chờ thanh toán',
  in_progress: 'Đang thực hiện',
  waiting_approval: 'Chờ phê duyệt',
  recovering: 'Đang phục hồi',
  deliberate_silence: 'Để yên có chủ đích',
  closed: 'Đã khép',
};

export const doorStateLabel: Record<DoorState, string> = {
  care_first: 'Care trước',
  blocked: 'Đang bị chặn',
  eligible_for_founder_review: 'Đủ điều kiện để Founder review',
  founder_deferred: 'Founder để sau',
  customer_declined: 'Khách đã từ chối',
  closed: 'Đã khép',
};

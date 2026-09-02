export type HatMamScenarioKey =
  | 'approved'
  | 'wrong-person'
  | 'entitlement-revoked'
  | 'review-pending'
  | 'new-version-pending'
  | 'access-expired'
  | 'replay-proof'
  | 'delivered-not-confirmed'
  | 'confirmed';

export type TraceState = 'PASS' | 'BLOCKED' | 'PENDING' | 'SEPARATE' | 'IDEMPOTENT';

export type HatMamScenario = {
  key: HatMamScenarioKey;
  at: string;
  label: string;
  overallState: string;
  outcome: 'allow' | 'deny' | 'observe';
  summary: string;
  reasonCode: string;
  currentVersion: number;
  approvedVersion: number | null;
  entitlement: 'ACTIVE' | 'REVOKED';
  access: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
  p11Review: 'APPROVED' | 'PENDING' | 'NEEDS_CHANGES' | 'REJECTED';
  delivery: 'NOT_RECORDED' | 'SUCCEEDED';
  confirmation: 'NOT_RECORDED' | 'CONFIRMED';
  canonicalDeliveryEvents: number;
  readingAllowed: boolean;
};

export const scenarioOrder: HatMamScenarioKey[] = [
  'approved',
  'wrong-person',
  'entitlement-revoked',
  'review-pending',
  'new-version-pending',
  'access-expired',
  'replay-proof',
  'delivered-not-confirmed',
  'confirmed',
];

export const hatMamScenarios: Record<HatMamScenarioKey, HatMamScenario> = {
  approved: {
    key: 'approved',
    at: 'AT-01',
    label: 'Đúng người + đúng quyền + đúng phiên bản',
    overallState: 'ĐƯỢC PHÉP MỞ',
    outcome: 'allow',
    summary: 'Khách giả A có quyền nhận sản phẩm còn hiệu lực và đúng phiên bản Hạt Mầm hiện tại đã được P11 duyệt, đồng thời dấu vết kiểm chứng hợp lệ.',
    reasonCode: 'DELIVERABLE_VERSION_OK',
    currentVersion: 3,
    approvedVersion: 3,
    entitlement: 'ACTIVE',
    access: 'ACTIVE',
    p11Review: 'APPROVED',
    delivery: 'NOT_RECORDED',
    confirmation: 'NOT_RECORDED',
    canonicalDeliveryEvents: 0,
    readingAllowed: true,
  },
  'wrong-person': {
    key: 'wrong-person',
    at: 'AT-02',
    label: 'Khách B dùng đường mở của khách A',
    overallState: 'BỊ CHẶN',
    outcome: 'deny',
    summary: 'Đường mở vẫn tồn tại nhưng người đang đăng nhập không phải chủ của quyền truy cập riêng này.',
    reasonCode: 'PRIVATE_ACCESS_PERSON_MISMATCH',
    currentVersion: 3,
    approvedVersion: 3,
    entitlement: 'ACTIVE',
    access: 'ACTIVE',
    p11Review: 'APPROVED',
    delivery: 'NOT_RECORDED',
    confirmation: 'NOT_RECORDED',
    canonicalDeliveryEvents: 0,
    readingAllowed: false,
  },
  'entitlement-revoked': {
    key: 'entitlement-revoked',
    at: 'AT-03',
    label: 'Quyền nhận sản phẩm đã bị thu hồi',
    overallState: 'BỊ CHẶN',
    outcome: 'deny',
    summary: 'Ấn phẩm vẫn tồn tại và từng được duyệt, nhưng quyền nhận sản phẩm của khách không còn hiệu lực nên phòng đọc phải khóa.',
    reasonCode: 'ENTITLEMENT_NOT_EFFECTIVE',
    currentVersion: 3,
    approvedVersion: 3,
    entitlement: 'REVOKED',
    access: 'ACTIVE',
    p11Review: 'APPROVED',
    delivery: 'NOT_RECORDED',
    confirmation: 'NOT_RECORDED',
    canonicalDeliveryEvents: 0,
    readingAllowed: false,
  },
  'review-pending': {
    key: 'review-pending',
    at: 'AT-04',
    label: 'P11 chưa duyệt phiên bản hiện tại',
    overallState: 'BỊ CHẶN',
    outcome: 'deny',
    summary: 'Máy đã tạo ra ấn phẩm nhưng P11 chưa duyệt đúng phiên bản hiện tại, vì vậy chưa được phép giao hoặc mở cho khách.',
    reasonCode: 'P11_REVIEW_NOT_APPROVED',
    currentVersion: 3,
    approvedVersion: null,
    entitlement: 'ACTIVE',
    access: 'ACTIVE',
    p11Review: 'PENDING',
    delivery: 'NOT_RECORDED',
    confirmation: 'NOT_RECORDED',
    canonicalDeliveryEvents: 0,
    readingAllowed: false,
  },
  'new-version-pending': {
    key: 'new-version-pending',
    at: 'AT-05',
    label: 'Có phiên bản mới nhưng chưa được duyệt',
    overallState: 'CẦN XỬ LÝ',
    outcome: 'deny',
    summary: 'Phiên bản 2 từng được duyệt nhưng phiên bản 3 đã trở thành bản hiện tại và chưa được P11 duyệt. Phê duyệt cũ không được tự chuyển sang phiên bản mới.',
    reasonCode: 'ARTIFACT_VERSION_STALE',
    currentVersion: 3,
    approvedVersion: 2,
    entitlement: 'ACTIVE',
    access: 'ACTIVE',
    p11Review: 'PENDING',
    delivery: 'NOT_RECORDED',
    confirmation: 'NOT_RECORDED',
    canonicalDeliveryEvents: 0,
    readingAllowed: false,
  },
  'access-expired': {
    key: 'access-expired',
    at: 'AT-06',
    label: 'Quyền mở phòng đọc đã hết hạn',
    overallState: 'BỊ CHẶN',
    outcome: 'deny',
    summary: 'Quyền nhận sản phẩm và phê duyệt vẫn đúng, nhưng quyền mở riêng cho đúng phiên bản này đã hết hạn.',
    reasonCode: 'PRIVATE_ACCESS_EXPIRED',
    currentVersion: 3,
    approvedVersion: 3,
    entitlement: 'ACTIVE',
    access: 'EXPIRED',
    p11Review: 'APPROVED',
    delivery: 'NOT_RECORDED',
    confirmation: 'NOT_RECORDED',
    canonicalDeliveryEvents: 0,
    readingAllowed: false,
  },
  'replay-proof': {
    key: 'replay-proof',
    at: 'AT-07',
    label: 'Gửi lại cùng một yêu cầu nhiều lần',
    overallState: 'KHÔNG TẠO BẢN GHI LẶP',
    outcome: 'observe',
    summary: 'Cùng một mã liên kết giao nhận được gửi lại nhiều lần nhưng hệ thống vẫn chỉ giữ một bản ghi “đã giao thành công”.',
    reasonCode: 'REPLAYED_EXISTING',
    currentVersion: 3,
    approvedVersion: 3,
    entitlement: 'ACTIVE',
    access: 'ACTIVE',
    p11Review: 'APPROVED',
    delivery: 'SUCCEEDED',
    confirmation: 'NOT_RECORDED',
    canonicalDeliveryEvents: 1,
    readingAllowed: true,
  },
  'delivered-not-confirmed': {
    key: 'delivered-not-confirmed',
    at: 'AT-09',
    label: 'Đã giao nhưng khách chưa xác nhận',
    overallState: 'ĐÃ GIAO · CHỜ KHÁCH XÁC NHẬN',
    outcome: 'observe',
    summary: 'Đã có bằng chứng giao sản phẩm thành công, nhưng chưa có bằng chứng khách xác nhận đã nhận được.',
    reasonCode: 'DELIVERY_RECORDED_CONFIRMATION_PENDING',
    currentVersion: 3,
    approvedVersion: 3,
    entitlement: 'ACTIVE',
    access: 'ACTIVE',
    p11Review: 'APPROVED',
    delivery: 'SUCCEEDED',
    confirmation: 'NOT_RECORDED',
    canonicalDeliveryEvents: 1,
    readingAllowed: true,
  },
  confirmed: {
    key: 'confirmed',
    at: 'AT-09',
    label: 'Đã giao + khách đã xác nhận',
    overallState: 'KHÁCH ĐÃ XÁC NHẬN',
    outcome: 'observe',
    summary: 'Có hai bằng chứng riêng: hệ thống ghi nhận giao sản phẩm thành công trước, sau đó mới ghi nhận khách đã xác nhận.',
    reasonCode: 'CUSTOMER_CONFIRMED_RECORDED',
    currentVersion: 3,
    approvedVersion: 3,
    entitlement: 'ACTIVE',
    access: 'ACTIVE',
    p11Review: 'APPROVED',
    delivery: 'SUCCEEDED',
    confirmation: 'CONFIRMED',
    canonicalDeliveryEvents: 1,
    readingAllowed: true,
  },
};

export const syntheticIds = {
  person: 'khách-giả-a · 7f91…a204',
  order: 'đơn-giả-001 · 24bd…6011',
  paymentEvidence: 'thanh-toán-giả-001 · ĐÃ XÁC THỰC',
  entitlement: 'quyền-giả-001 · 1a6f…11c8',
  job: 'lệnh-tạo-giả-003 · 917e…b443',
  attempt: 'lần-chạy-003-1 · THÀNH CÔNG',
  machine: 'MÁY_HẠT_MẦM_01 · 60e4128b…',
  artifact: 'ấn-phẩm-giả-001 · 00b7…ca10',
  access: 'quyền-mở-giả-001 · e420…9dd1',
};

export function getTrace(scenario: HatMamScenario) {
  const approvalMatchesCurrent = scenario.approvedVersion === scenario.currentVersion;
  const personPass = scenario.key !== 'wrong-person';
  const entitlementPass = scenario.entitlement === 'ACTIVE';
  const reviewPass = scenario.p11Review === 'APPROVED' && approvalMatchesCurrent;
  const accessPass = scenario.access === 'ACTIVE';

  const entitlementText = scenario.entitlement === 'ACTIVE' ? 'ĐANG HIỆU LỰC' : 'ĐÃ THU HỒI';
  const accessText = scenario.access === 'ACTIVE' ? 'ĐANG HIỆU LỰC' : scenario.access === 'EXPIRED' ? 'ĐÃ HẾT HẠN' : 'ĐÃ THU HỒI';
  const reviewText = scenario.p11Review === 'APPROVED' ? 'ĐÃ DUYỆT' : scenario.p11Review === 'PENDING' ? 'CHỜ DUYỆT' : scenario.p11Review === 'NEEDS_CHANGES' ? 'CẦN SỬA' : 'KHÔNG DUYỆT';

  return [
    { label: 'Danh tính / Người nhận', state: personPass ? 'PASS' : 'BLOCKED', detail: personPass ? syntheticIds.person : 'Người đang đăng nhập không phải chủ của quyền mở này' },
    { label: 'Đơn hàng / Bằng chứng thanh toán', state: 'PASS', detail: `${syntheticIds.order} · ${syntheticIds.paymentEvidence} · bằng chứng thanh toán không tự tạo quyền nhận sản phẩm` },
    { label: 'Quyền nhận sản phẩm', state: entitlementPass ? 'PASS' : 'BLOCKED', detail: `${syntheticIds.entitlement} · ${entitlementText}` },
    { label: 'Lệnh tạo / Lần chạy', state: 'PASS', detail: `${syntheticIds.job} · ${syntheticIds.attempt}` },
    { label: 'Máy tạo / Bản dựng', state: 'PASS', detail: syntheticIds.machine },
    { label: 'Phiên bản ấn phẩm', state: approvalMatchesCurrent ? 'PASS' : 'BLOCKED', detail: `${syntheticIds.artifact} · hiện tại v${scenario.currentVersion} · đã duyệt ${scenario.approvedVersion ? `v${scenario.approvedVersion}` : 'chưa có'}` },
    { label: 'P11 duyệt sản phẩm', state: reviewPass ? 'PASS' : scenario.p11Review === 'PENDING' ? 'PENDING' : 'BLOCKED', detail: `${reviewText} · dấu vết ${reviewPass ? 'ĐÃ XÁC THỰC' : 'CHƯA ĐƯỢC PHÉP GIAO'}` },
    { label: 'Quyền mở phòng đọc', state: personPass && entitlementPass && reviewPass && accessPass ? 'PASS' : 'BLOCKED', detail: `${syntheticIds.access} · ${accessText}` },
    { label: 'Giao sản phẩm thành công', state: scenario.key === 'replay-proof' ? 'IDEMPOTENT' : scenario.delivery === 'SUCCEEDED' ? 'PASS' : 'SEPARATE', detail: scenario.delivery === 'SUCCEEDED' ? `${scenario.canonicalDeliveryEvents} bản ghi chuẩn` : 'Chưa ghi nhận · không tự suy ra từ quyền mở' },
    { label: 'Khách xác nhận đã nhận', state: scenario.confirmation === 'CONFIRMED' ? 'PASS' : 'SEPARATE', detail: scenario.confirmation === 'CONFIRMED' ? 'Bằng chứng riêng đã được ghi nhận' : 'Chưa ghi nhận · không tự suy ra từ việc đã giao' },
  ] as Array<{ label: string; state: TraceState; detail: string }>;
}

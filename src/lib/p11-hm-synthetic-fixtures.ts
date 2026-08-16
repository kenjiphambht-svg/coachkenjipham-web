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
    label: 'Đúng người + đúng quyền + đúng version',
    overallState: 'DELIVERABLE',
    outcome: 'allow',
    summary: 'Khách giả A có entitlement hiệu lực và Artifact Version hiện tại đã được P11 APPROVED/VERIFIED.',
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
    label: 'Khách B dùng locator của A',
    overallState: 'BLOCKED',
    outcome: 'deny',
    summary: 'Locator tồn tại nhưng authenticated Person không khớp private access owner.',
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
    label: 'Entitlement đã revoke',
    overallState: 'BLOCKED',
    outcome: 'deny',
    summary: 'Artifact vẫn tồn tại và từng được duyệt, nhưng quyền nhận sản phẩm không còn hiệu lực.',
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
    label: 'P11 chưa APPROVED',
    overallState: 'BLOCKED',
    outcome: 'deny',
    summary: 'Machine đã tạo output nhưng Product Acceptance của exact version vẫn PENDING.',
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
    label: 'Có version mới chưa duyệt',
    overallState: 'RECOVERY NEEDED',
    outcome: 'deny',
    summary: 'Version 2 từng APPROVED nhưng Version 3 đã trở thành current và chưa được P11 duyệt. Approval cũ không được kế thừa.',
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
    label: 'Private access đã hết hạn',
    overallState: 'BLOCKED',
    outcome: 'deny',
    summary: 'Entitlement và approval vẫn đúng nhưng exact private access evidence đã hết hạn.',
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
    label: 'Retry / replay cùng correlation',
    overallState: 'IDEMPOTENT',
    outcome: 'observe',
    summary: 'Hai lần gửi lại cùng delivery correlation vẫn chỉ có một canonical Delivery Succeeded event.',
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
    label: 'Đã giao, chưa xác nhận',
    overallState: 'DELIVERED · CONFIRMATION PENDING',
    outcome: 'observe',
    summary: 'Delivery Succeeded đã có evidence riêng; Customer Confirmed vẫn chưa được ghi.',
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
    overallState: 'CONFIRMED',
    outcome: 'observe',
    summary: 'Hai evidence riêng cùng tồn tại: Delivery Succeeded trước, Customer Confirmed sau.',
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
  person: 'syn-person-a · 7f91…a204',
  order: 'syn-order-001 · 24bd…6011',
  paymentEvidence: 'syn-pay-001 · VERIFIED',
  entitlement: 'syn-ent-001 · 1a6f…11c8',
  job: 'syn-job-003 · 917e…b443',
  attempt: 'syn-attempt-003-1 · SUCCEEDED',
  machine: 'HAT_MAM_MACHINE_01 · 60e4128b…',
  artifact: 'syn-artifact-001 · 00b7…ca10',
  access: 'syn-access-001 · e420…9dd1',
};

export function getTrace(scenario: HatMamScenario) {
  const approvalMatchesCurrent = scenario.approvedVersion === scenario.currentVersion;
  const personPass = scenario.key !== 'wrong-person';
  const entitlementPass = scenario.entitlement === 'ACTIVE';
  const reviewPass = scenario.p11Review === 'APPROVED' && approvalMatchesCurrent;
  const accessPass = scenario.access === 'ACTIVE';

  return [
    { label: 'Identity / Person', state: personPass ? 'PASS' : 'BLOCKED', detail: personPass ? syntheticIds.person : 'Authenticated Person ≠ access owner' },
    { label: 'Order / Payment context', state: 'PASS', detail: `${syntheticIds.order} · ${syntheticIds.paymentEvidence} · payment evidence không tự tạo entitlement` },
    { label: 'Entitlement', state: entitlementPass ? 'PASS' : 'BLOCKED', detail: `${syntheticIds.entitlement} · ${scenario.entitlement}` },
    { label: 'Production Job / Attempt', state: 'PASS', detail: `${syntheticIds.job} · ${syntheticIds.attempt}` },
    { label: 'Machine / Build', state: 'PASS', detail: syntheticIds.machine },
    { label: 'Artifact Version', state: approvalMatchesCurrent ? 'PASS' : 'BLOCKED', detail: `${syntheticIds.artifact} · current v${scenario.currentVersion} · approved ${scenario.approvedVersion ? `v${scenario.approvedVersion}` : 'none'}` },
    { label: 'P11 Product Acceptance', state: reviewPass ? 'PASS' : scenario.p11Review === 'PENDING' ? 'PENDING' : 'BLOCKED', detail: `${scenario.p11Review} · provenance ${reviewPass ? 'VERIFIED' : 'NOT DELIVERABLE'}` },
    { label: 'Private Access', state: personPass && entitlementPass && reviewPass && accessPass ? 'PASS' : 'BLOCKED', detail: `${syntheticIds.access} · ${scenario.access}` },
    { label: 'Delivery Succeeded', state: scenario.key === 'replay-proof' ? 'IDEMPOTENT' : scenario.delivery === 'SUCCEEDED' ? 'PASS' : 'SEPARATE', detail: scenario.delivery === 'SUCCEEDED' ? `${scenario.canonicalDeliveryEvents} canonical event` : 'Chưa ghi · không suy từ access' },
    { label: 'Customer Confirmed', state: scenario.confirmation === 'CONFIRMED' ? 'PASS' : 'SEPARATE', detail: scenario.confirmation === 'CONFIRMED' ? 'Evidence riêng đã ghi' : 'Chưa ghi · không suy từ Delivery Succeeded' },
  ] as Array<{ label: string; state: TraceState; detail: string }>;
}

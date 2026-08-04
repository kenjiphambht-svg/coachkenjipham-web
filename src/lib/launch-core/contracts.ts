import { DomainError } from '@/lib/domain/errors';

export const LAUNCH_CORE_FLAGS = [
  'lang_intake_enabled', 'lang_payment_enabled', 'lang_booking_provider_enabled',
  'hatmam_intake_enabled', 'hatmam_payment_enabled', 'hatmam_production_enabled',
  'private_storage_ready', 'customer_auth_ready', 'private_reading_room_enabled',
  'pdf_generation_ready', 'email_provider_ready', 'deletion_workflow_ready',
  'launch_core_public_enabled',
] as const;

export type LaunchCoreFlag = (typeof LAUNCH_CORE_FLAGS)[number];

export type PaymentEvidence = {
  requestId: string;
  requestState: 'payment_requested' | 'transfer_reported' | 'evidence_received' | 'under_review' | 'confirmed' | 'rejected' | 'expired' | 'revoked';
  reportedAt: string | null;
  revokedAt: string | null;
  expectedAmountVnd: number;
  reportedAmountVnd: number;
  expectedReference: string;
  reportedReference: string;
  evidenceReference: string;
  evidenceSha256: string;
};

/** Pure contract before the database RPC takes its row lock and writes audit. */
export function assertPaymentConfirmationEligible(evidence: PaymentEvidence) {
  if (!evidence.reportedAt || !['transfer_reported', 'evidence_received', 'under_review'].includes(evidence.requestState)) {
    throw new DomainError('INVALID_TRANSITION', 'Chưa có báo chuyển hợp lệ để xác nhận thanh toán.');
  }
  if (evidence.revokedAt || ['expired', 'revoked', 'confirmed', 'rejected'].includes(evidence.requestState)) {
    throw new DomainError('INVALID_TRANSITION', 'Yêu cầu thanh toán này không còn hiệu lực để xác nhận.');
  }
  if (!/^[a-f0-9]{64}$/.test(evidence.evidenceSha256)) {
    throw new DomainError('VALIDATION_FAILED', 'Bằng chứng thanh toán không có checksum hợp lệ.');
  }
  if (evidence.expectedAmountVnd !== evidence.reportedAmountVnd) {
    throw new DomainError('VALIDATION_FAILED', 'Số tiền không khớp snapshot bất biến của đơn.');
  }
  if (!evidence.expectedReference || evidence.expectedReference !== evidence.reportedReference || evidence.expectedReference !== evidence.evidenceReference) {
    throw new DomainError('VALIDATION_FAILED', 'Nội dung chuyển khoản không khớp yêu cầu thanh toán.');
  }
  return { requestId: evidence.requestId, evidenceSha256: evidence.evidenceSha256 };
}

export function canAccessPrivateReadingRoom(input: {
  verifiedIdentity: boolean;
  entitlementStatus: 'pending' | 'active' | 'suspended' | 'expired' | 'revoked' | 'pending_deletion' | 'deleted';
  expiresAt: string | null;
  now?: Date;
}) {
  const now = input.now ?? new Date();
  return input.verifiedIdentity && input.entitlementStatus === 'active' && (!input.expiresAt || new Date(input.expiresAt) > now);
}

export function buildPrivateObjectPath(input: {
  productCode: 'lang' | 'hatmam';
  orderCode: string;
  publicationCode: string;
  version: number;
}) {
  if (!/^[A-Z0-9-]{3,64}$/.test(input.orderCode) || !/^[A-Z0-9-]{3,64}$/.test(input.publicationCode) || !Number.isInteger(input.version) || input.version < 1) {
    throw new DomainError('VALIDATION_FAILED', 'Mã private asset không an toàn.');
  }
  return `essence/${input.productCode}/${input.orderCode}/${input.publicationCode}/v${input.version}/a5.pdf`;
}

export function planDeletion(input: { privateObjectDeleted: boolean; metadataDeleted: boolean }) {
  if (!input.privateObjectDeleted && input.metadataDeleted) {
    throw new DomainError('INVALID_TRANSITION', 'Không được xóa metadata trước khi private object được xác nhận xóa.');
  }
  return input.privateObjectDeleted
    ? { status: input.metadataDeleted ? 'completed' : 'ready_for_metadata' }
    : { status: 'blocked_object_deletion' };
}

export function launchCoreFlagState(flags: Partial<Record<LaunchCoreFlag, boolean>>) {
  return LAUNCH_CORE_FLAGS.reduce((result, flag) => ({ ...result, [flag]: flags[flag] === true }), {} as Record<LaunchCoreFlag, boolean>);
}

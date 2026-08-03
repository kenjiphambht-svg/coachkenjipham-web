import type { HatMamStatus, LangStatus } from '@/lib/domain/states';

export interface LangSummaryInput {
  order_code: string;
  status: LangStatus;
  target_session_month: string | null;
  q2_level: string;
  q3_prior_help: string;
  q4_want: string;
  q5_openness: string;
  q6_extra: string | null;
  decline_reason?: string | null;
}

export interface SupportSummary {
  headline: string;
  observations: string[];
  operatorNote: string;
  limitation: string;
}

export interface ReceiptPreview {
  fileName: string;
  amountVnd: number;
  transferReference: string;
  checksum: string;
  uploadedAt: string;
  summary: string;
}

export interface PaymentEvidenceView {
  requestId: string;
  receiptFileName: string;
  receiptSha256: string;
  reportedAmountVnd: number;
  transferReference: string;
  reportedAt: string;
  revokedAt: string | null;
}

export interface BookingDefaultsView {
  slots: Array<{ label: string; value: string }>;
  sessionDurationMinutes: number;
  postSessionBufferMinutes: number;
  minNoticeHours: number;
  bookingHorizonDays: number;
  rescheduleDeadlineHours: number;
  maxBookingsPerWeek: number;
  hardMonthlyCapacity: number;
}

export interface HatMamSyntheticState {
  label: string;
  state: 'done' | 'current' | 'pending' | 'blocked';
  note: string;
}

export interface PublicationMock {
  expectedFileName: string;
  contentSha256: string;
  checksumStatus: string;
  reviewChecklist: string[];
  readinessLabel: string;
  releaseNote: string;
}

export interface DeletionMock {
  requestLabel: string;
  consequence: string;
  retryState: string;
  auditState: string;
}

export const ADMIN_EMAIL = 'kenjipham.bht@gmail.com';
export const INTERNAL_ALERT_EMAIL = 'kenjipham.bht@gmail.com';
export const PUBLIC_CONTACT_EMAIL = 'contact@coachkenjipham.com';
export const LANG_PRICE_VND = 10_000_000;
export const HATMAM_HM01_PRICE_VND = 2_000_000;
export const HATMAM_HM02_PRICE_VND = 3_500_000;
export const HATMAM_HM01_REFERENCE_VND = 3_000_000;
export const HATMAM_HM02_REFERENCE_VND = 5_500_000;

export const BOOKING_DEFAULTS: BookingDefaultsView = {
  slots: [
    { label: 'Thứ Ba · 09:30', value: 'tuesday-09:30' },
    { label: 'Thứ Năm · 14:30', value: 'thursday-14:30' },
  ],
  sessionDurationMinutes: 90,
  postSessionBufferMinutes: 60,
  minNoticeHours: 48,
  bookingHorizonDays: 21,
  rescheduleDeadlineHours: 24,
  maxBookingsPerWeek: 2,
  hardMonthlyCapacity: 5,
};

export function formatCurrencyVnd(value: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);
}

export function buildLangSupportSummary(input: LangSummaryInput): SupportSummary {
  const observations: string[] = [];

  if (input.q2_level === 'A') {
    observations.push('Người gửi đang ở trạng thái rối và cần phản hồi nhanh, nhưng chưa có dấu hiệu phải gắn nhãn thay họ.');
  } else if (input.q2_level === 'B') {
    observations.push('Hồ sơ cho thấy người gửi đang ở điểm gãy; cần đọc kỹ ranh giới kỳ vọng trước khi mời bước tiếp.');
  } else if (input.q2_level === 'D') {
    observations.push('Người gửi đến với nhu cầu tự hiểu và soi rõ, phù hợp với giọng vận hành của Lặng nếu ranh giới được giữ rõ.');
  } else {
    observations.push('Hồ sơ cần được đọc chậm để giữ đúng Human Decision Gate trước mọi phản hồi ra ngoài.');
  }

  if (input.q3_prior_help === 'B') {
    observations.push('Đã có quá trình hỗ trợ song song; phản hồi nên tôn trọng tiến trình hiện có, không tranh vai với chuyên môn khác.');
  } else if (input.q3_prior_help === 'A') {
    observations.push('Chưa có hỗ trợ trước đó; email phản hồi nên nói rõ Lặng không thay trị liệu hay chẩn đoán.');
  }

  if (input.q5_openness === 'C') {
    observations.push('Mức sẵn sàng hiện thiên về được lắng nghe hơn là nhận diễn giải mạnh; cần chọn ngôn ngữ mềm và quan sát.');
  } else {
    observations.push('Người gửi có mức mở nhất định cho góc nhìn khác; Kenji vẫn là người quyết định liệu nhịp đó có phù hợp với một phiên Lặng hay không.');
  }

  if ((input.q6_extra ?? '').trim()) {
    observations.push('Phần ghi chú thêm có tín hiệu bối cảnh riêng; nên đọc cùng lý do người này muốn rời phiên với điều gì.');
  }

  return {
    headline: `Tóm tắt hỗ trợ theo quy tắc — dữ liệu thử · ${input.order_code}`,
    observations,
    operatorNote:
      input.status === 'declined' && input.decline_reason
        ? `Hồ sơ đang ở trạng thái đã từ chối. Giữ phản hồi tôn trọng, nhất quán với lý do: ${input.decline_reason}`
        : 'Bộ quy tắc chỉ gom tín hiệu để Kenji đọc nhanh hơn. Quyết định cuối cùng, lý do và cách phản hồi phải do Kenji tự ghi.',
    limitation:
      'Giới hạn của AI: không được phê duyệt, từ chối, chẩn đoán, dán nhãn hay giao tiếp quyết định cuối cùng với khách.',
  };
}

export function buildLangCustomerPreview(input: LangSummaryInput) {
  switch (input.status) {
    case 'under_review':
      return 'Kenji đã mở hồ sơ và đang đọc kỹ sáu câu trả lời của bạn. Nếu hồ sơ phù hợp, bước tiếp theo sẽ là hướng dẫn thanh toán riêng tư.';
    case 'more_info_needed':
      return 'Kenji cần thêm một chút bối cảnh trước khi quyết định bước tiếp theo. Phản hồi gửi ra ngoài nên gọn, rõ câu hỏi và không ép người gửi chia sẻ quá mức.';
    case 'accepted':
      return `Hồ sơ đã phù hợp để tiếp tục. Khi Kenji phát hướng dẫn thanh toán, chuyển khoản cần ghi đúng nội dung LANG ${input.order_code} và không kèm tên khách.`;
    case 'awaiting_payment':
      return `Kenji đã gửi hướng dẫn thanh toán riêng. Sau khi người gửi báo chuyển khoản, Kenji vẫn là người xác nhận tiền vào trước khi phát link đặt lịch.`;
    case 'paid':
      return 'Thanh toán đã được Kenji xác nhận. Bước tiếp theo là phát link đặt lịch riêng tư và giữ đúng giới hạn 5 phiên/tháng.';
    case 'declined':
      return 'Phản hồi nên nói rõ đây không phải lựa chọn phù hợp lúc này, tránh ngôn ngữ phán xét hay hứa hẹn thay thế chuyên môn khác.';
    default:
      return 'Bản xem trước này chỉ là gợi ý vận hành nội bộ; không gửi nguyên văn nếu Kenji chưa duyệt.';
  }
}

export function buildReceiptPreview(kind: 'lang' | 'hatmam', orderCode: string, amountVnd: number): ReceiptPreview {
  const prefix = kind === 'lang' ? 'LANG' : 'HATMAM';
  return {
    fileName: `${prefix.toLowerCase()}-${orderCode.toLowerCase()}-synthetic-receipt.svg`,
    amountVnd,
    transferReference: `${prefix} ${orderCode}`,
    checksum: `synthetic-${prefix.toLowerCase()}-${orderCode.toLowerCase()}-sha256`,
    uploadedAt: '2026-08-03 16:20',
    summary:
      kind === 'lang'
        ? 'Biên nhận thử cho một phiên Lặng. Không có số tài khoản thật, không có tên khách, chỉ dùng để kiểm UX xác nhận chuyển khoản.'
        : 'Biên nhận thử cho một đơn Hạt Mầm. Dùng để kiểm màn hình review thanh toán và audit, không đại diện cho giao dịch thật.',
  };
}

export function paymentEvidenceFromRecord(input: {
  requestId: string;
  receipt_file_name: string;
  receipt_sha256: string;
  reported_amount_vnd: number;
  transfer_reference: string;
  reported_at: string;
  revoked_at: string | null;
}): PaymentEvidenceView {
  return {
    requestId: input.requestId,
    receiptFileName: input.receipt_file_name,
    receiptSha256: input.receipt_sha256,
    reportedAmountVnd: input.reported_amount_vnd,
    transferReference: input.transfer_reference,
    reportedAt: input.reported_at,
    revokedAt: input.revoked_at,
  };
}

export function isHatMamPaymentEvidenceEligible(input: {
  expectedAmountVnd: number | null;
  expectedReference: string;
  paymentRequest: { reported_transfer_at: string | null; revoked_at: string | null; report_reference: string | null } | null;
  evidence: { receipt_sha256: string; reported_amount_vnd: number; transfer_reference: string } | null;
}) {
  return Boolean(
    input.expectedAmountVnd !== null &&
    input.paymentRequest?.reported_transfer_at &&
    !input.paymentRequest.revoked_at &&
    input.evidence?.receipt_sha256 &&
    input.evidence.reported_amount_vnd === input.expectedAmountVnd &&
    input.evidence.transfer_reference === input.expectedReference &&
    input.paymentRequest.report_reference === input.expectedReference
  );
}

export function getHatMamPackageInfo(packageCode: string) {
  if (isHm02Package(packageCode)) {
    return {
      code: 'HM-02',
      name: 'Trò Chuyện Cùng Kenji',
      launchPriceVnd: HATMAM_HM02_PRICE_VND,
      referencePriceVnd: HATMAM_HM02_REFERENCE_VND,
      scope: 'Bao gồm HM-01 + 30 phút trò chuyện với Kenji.',
    };
  }

  return {
    code: 'HM-01',
    name: 'Ấn phẩm Bản Sắc',
    launchPriceVnd: HATMAM_HM01_PRICE_VND,
    referencePriceVnd: HATMAM_HM01_REFERENCE_VND,
    scope: 'Ấn phẩm cá nhân hóa năm chương, file PDF chất lượng cao.',
  };
}

export function isHm02Package(packageCode: string) {
  return packageCode === 'HM-02' || packageCode === 'goi-2';
}

export function buildHatMamStates(status: HatMamStatus): HatMamSyntheticState[] {
  const currentIndex: Record<HatMamStatus, number> = {
    submitted: 0,
    awaiting_payment: 1,
    paid: 2,
    in_production: 3,
    review_pending: 4,
    revision_requested: 5,
    ready: 6,
    delivered: 7,
    cancelled: 0,
  };

  const sequence: Array<{ label: string; note: string }> = [
    { label: 'Hồ sơ mới', note: 'Đơn vừa được ghi nhận, chờ bước thanh toán.' },
    { label: 'Đã báo chuyển khoản', note: 'Có payment report, nhưng Kenji vẫn phải kiểm tra evidence trước khi xác nhận.' },
    { label: 'Đã xác nhận thanh toán', note: 'Số tiền được lấy từ package snapshot của đơn.' },
    { label: 'Đang sản xuất', note: 'Kenji đang đọc và biên tập nội bộ, không tạo chẩn đoán về trẻ.' },
    { label: 'Chờ Kenji duyệt', note: 'Bản thảo chờ mắt đọc cuối cùng của Kenji.' },
    { label: 'Cần chỉnh sửa', note: 'Kenji đã yêu cầu revision; đơn quay lại sản xuất sau khi điều chỉnh.' },
    { label: 'Sẵn sàng', note: 'Nội dung đã sẵn sàng, nhưng delivery thật vẫn bị B4 chặn.' },
    { label: 'Delivery bị B4 chặn', note: 'Không có private Storage E2E nên không phát hành hoặc giao file thật.' },
  ];

  return sequence.map((item, index) => {
    if (item.label === 'Delivery bị B4 chặn') {
      return {
        label: item.label,
        state: 'blocked',
        note: item.note,
      };
    }
    if (index < currentIndex[status]) return { label: item.label, state: 'done', note: item.note };
    if (index === currentIndex[status]) return { label: item.label, state: 'current', note: item.note };
    return { label: item.label, state: 'pending', note: item.note };
  });
}

export function buildPublicationMock(orderCode: string, packageCode: string): PublicationMock {
  return {
    expectedFileName: `${orderCode.toLowerCase()}-${packageCode.toLowerCase()}-ban-sac-synthetic.pdf`,
    contentSha256: `synthetic-publication-${orderCode.toLowerCase()}-sha256`,
    checksumStatus: 'Khớp với metadata synthetic đã chuẩn bị cho UX review.',
    reviewChecklist: [
      'Đúng package snapshot của đơn',
      'Không có dữ liệu trẻ em trong URL, query hay tên file',
      'Có cảnh báo Chưa sẵn sàng vì B4 còn mở',
      'Founder approval vẫn là thao tác fail-closed',
    ],
    readinessLabel: 'Chưa sẵn sàng',
    releaseNote:
      'Private Storage thật chưa sẵn sàng. Màn hình này chỉ cho Founder thấy luồng review metadata/checksum/revoke dưới dữ liệu thử.',
  };
}

export function buildDeletionMock(orderCode: string): DeletionMock {
  return {
    requestLabel: `Yêu cầu thử cho ${orderCode}`,
    consequence:
      'Nếu chạy thật, hệ phải xóa object trước rồi mới xóa metadata. Trong WP1, nút xác nhận chỉ dừng ở màn preview fail-closed.',
    retryState: 'Retry synthetic: cho phép xem lại các bản ghi bị ảnh hưởng mà không chạm dữ liệu thật.',
    auditState: 'Audit synthetic: chỉ ghi bằng chứng preview, không gọi Storage hay SQL destructive.',
  };
}

export function statusTone(state: HatMamSyntheticState['state']) {
  switch (state) {
    case 'done':
      return 'bg-[#eef5ea] text-[#2d5b35] border-[#bdd5bf]';
    case 'current':
      return 'bg-[#faf2dd] text-[#6a5215] border-[#d9c38c]';
    case 'blocked':
      return 'bg-[#f8ece8] text-[#8a4b38] border-[#dcb3a6]';
    default:
      return 'bg-e26-white text-e26-text-2 border-e26-border';
  }
}

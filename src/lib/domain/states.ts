// ============================================================
// BỘ LUẬT TRẠNG THÁI — định nghĩa, không phải comment.
// Mọi thay đổi trạng thái trong hệ PHẢI đi qua transition() ở
// ./state-machine.ts. Không sửa cột status trực tiếp ở bất kỳ đâu.
// ============================================================

export const LANG_STATUSES = [
  'submitted',
  'under_review',
  'accepted',
  'declined',
  'more_info_needed',
  'awaiting_payment',
  'paid',
  'scheduled',
  'completed',
  'cancelled',
] as const;

export type LangStatus = (typeof LANG_STATUSES)[number];

export const HATMAM_STATUSES = [
  'submitted',
  'awaiting_payment',
  'paid',
  'in_production',
  'review_pending',
  'revision_requested',
  'ready',
  'delivered',
  'cancelled',
] as const;

export type HatMamStatus = (typeof HATMAM_STATUSES)[number];

/**
 * Bản đồ chuyển trạng thái Lặng.
 *
 * Hai chặn cứng nằm ngay trong cấu trúc dữ liệu này, không phải ở lời dặn:
 *
 *  1. `scheduled` CHỈ xuất hiện là đích đến của `paid`. Không trạng thái
 *     nào khác dẫn tới nó — nên "xếp lịch khi chưa trả tiền" là điều
 *     bản đồ này không mô tả được, chứ không phải điều bị chặn về sau.
 *
 *  2. `submitted` KHÔNG có đường nào tới `accepted`. Muốn tới `accepted`
 *     bắt buộc đi qua `under_review` — tức là phải có người thật mở hồ sơ
 *     ra đọc. Đây là Cửa 1 (Human Decision Gate) của L0 C-05, và
 *     transition() còn đòi thêm actor là người thật cho bước này.
 */
export const LANG_TRANSITIONS: Record<LangStatus, readonly LangStatus[]> = {
  submitted: ['under_review', 'cancelled'],
  under_review: ['accepted', 'declined', 'more_info_needed', 'cancelled'],
  more_info_needed: ['under_review', 'cancelled'],
  accepted: ['awaiting_payment', 'cancelled'],
  awaiting_payment: ['paid', 'cancelled'],
  paid: ['scheduled', 'cancelled'],
  scheduled: ['completed', 'cancelled'],
  completed: [],
  declined: [],
  cancelled: [],
};

export const HATMAM_TRANSITIONS: Record<HatMamStatus, readonly HatMamStatus[]> = {
  submitted: ['awaiting_payment', 'cancelled'],
  awaiting_payment: ['paid', 'cancelled'],
  paid: ['in_production', 'cancelled'],
  in_production: ['review_pending', 'cancelled'],
  review_pending: ['revision_requested', 'ready', 'cancelled'],
  revision_requested: ['in_production', 'cancelled'],
  // `delivered` remains a historical terminal state only. New deliveries are
  // deliberately impossible while private Storage/B4 is fail-closed.
  ready: ['cancelled'],
  delivered: [],
  cancelled: [],
};

/**
 * Bước duy nhất khoá suất Lặng. Đặt ở đây để bộ đếm và máy trạng thái
 * cùng đọc một nguồn — tránh hai nơi hiểu khác nhau về "khoá lúc nào".
 *
 * FD-2026-08-02 FD-C: khoá tại bước PHÁT LINK THANH TOÁN
 * (accepted → awaiting_payment), KHÔNG phải bước cuối. Khách trả tiền
 * xong mới biết hết chỗ là lỗi nghiêm trọng.
 */
export const LANG_CAPACITY_LOCK_STEP = {
  from: 'accepted' as const,
  to: 'awaiting_payment' as const,
};

/**
 * Những bước bắt buộc do người thật bấm — không hàm tự động nào được
 * phép thực hiện. Cửa 1 của C-05.
 */
export const LANG_HUMAN_ONLY_TARGETS: readonly LangStatus[] = [
  'accepted',
  'declined',
  'more_info_needed',
];

/**
 * Những trạng thái Lặng đang CHIẾM một suất trong tháng.
 *
 * Tính từ awaiting_payment trở đi: khi Kenji đã phát link thanh toán thì
 * chỗ đó coi như đã giữ, dù khách chưa chuyển tiền. Hồ sơ bị `declined`
 * hoặc `cancelled` nhả suất ra lại.
 */
export const LANG_SLOT_HOLDING_STATUSES: readonly LangStatus[] = [
  'awaiting_payment',
  'paid',
  'scheduled',
  'completed',
];

/** Giới hạn mặc định khi lang_capacity không có dòng cho tháng đó (L0 C-05). */
export const LANG_DEFAULT_MONTHLY_SLOTS = 5;

/**
 * Phí một phiên Lặng 90'. Founder chốt 02/08/2026 (B0.1) — xem
 * docs/decisions/2026-08-02-b0-followups.md mục 1. Không đổi mà không
 * có quyết định mới.
 */
export const LANG_SESSION_PRICE_VND = 10_000_000;

/**
 * Hạn dùng của booking token (link chọn lịch qua email), tính bằng giờ.
 * Founder chốt 03/08/2026 (Đính kèm Master Prompt v1.0, Điểm 3): 24 giờ —
 * THAY THẾ quyết định 48h ghi ở B0.1. Xem
 * docs/decisions/2026-08-02-b0-followups.md mục 3 (đã cập nhật).
 *
 * ⚠️ Hằng số này CHƯA được nơi nào trong code đọc — B0 chưa xây bước phát
 * booking token. Đặt sẵn ở đây để khi Phase 3 xây bước đó, con số đến từ
 * một nơi duy nhất đã được duyệt, không phải một số mới ai đó đoán.
 */
export const BOOKING_TOKEN_TTL_HOURS = 24;

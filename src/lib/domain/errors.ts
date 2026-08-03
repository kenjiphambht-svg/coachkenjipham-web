// ============================================================
// Lỗi có cấu trúc. Mỗi lỗi mang 1 mã máy đọc được + 1 câu tiếng Việt
// đọc cho người. Câu tiếng Việt KHÔNG đổ lỗi người dùng.
// ============================================================

export type DomainErrorCode =
  | 'INVALID_TRANSITION'
  | 'HUMAN_DECISION_REQUIRED'
  | 'CAPACITY_FULL'
  | 'TARGET_MONTH_REQUIRED'
  | 'VALIDATION_FAILED'
  | 'RATE_LIMITED'
  | 'SPAM_SUSPECTED'
  | 'NOT_FOUND'
  | 'UNAUTHORIZED'
  | 'MFA_REQUIRED'
  | 'CONCURRENT_UPDATE'
  | 'CONFIG_MISSING';

export class DomainError extends Error {
  readonly code: DomainErrorCode;
  /** Câu hiển thị được cho người dùng cuối, tiếng Việt. */
  readonly userMessage: string;
  readonly details?: Record<string, unknown>;

  constructor(
    code: DomainErrorCode,
    userMessage: string,
    details?: Record<string, unknown>
  ) {
    // message kỹ thuật (log/dev) tách khỏi userMessage (hiển thị).
    super(`${code}: ${userMessage}`);
    this.name = 'DomainError';
    this.code = code;
    this.userMessage = userMessage;
    this.details = details;
  }

  /** Dạng trả về cho client. Không kèm stack, không kèm nội dung form. */
  toResponse() {
    return {
      ok: false as const,
      error: { code: this.code, message: this.userMessage, ...(this.details ? { details: this.details } : {}) },
    };
  }
}

export const HTTP_STATUS_BY_CODE: Record<DomainErrorCode, number> = {
  INVALID_TRANSITION: 409,
  HUMAN_DECISION_REQUIRED: 403,
  CAPACITY_FULL: 409,
  TARGET_MONTH_REQUIRED: 400,
  VALIDATION_FAILED: 400,
  RATE_LIMITED: 429,
  SPAM_SUSPECTED: 400,
  NOT_FOUND: 404,
  UNAUTHORIZED: 401,
  MFA_REQUIRED: 403,
  CONCURRENT_UPDATE: 409,
  CONFIG_MISSING: 500,
};

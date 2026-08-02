// ============================================================
// HÀM CHUYỂN TRẠNG THÁI DUY NHẤT CỦA HỆ.
//
// Không nơi nào trong codebase được phép gán thẳng cột `status`.
// Mọi thay đổi đi qua đây, và mỗi lần đi qua đều sinh một bản ghi audit.
// Sai luật → ném DomainError, không âm thầm cho qua.
// ============================================================

import { DomainError } from './errors';
import {
  HATMAM_TRANSITIONS,
  LANG_CAPACITY_LOCK_STEP,
  LANG_HUMAN_ONLY_TARGETS,
  LANG_TRANSITIONS,
  type HatMamStatus,
  type LangStatus,
} from './states';
import { assertCapacityAvailable, type CapacityCheck, type CapacityResult } from './capacity';

/**
 * Ai thực hiện bước chuyển này.
 *  - `human`  : một người thật bấm nút trong /admin. Bắt buộc kèm id.
 *  - `system` : webhook ngân hàng, cron, tác vụ nền.
 *
 * Phân biệt này là cách hệ thực thi FD-2026-08-02 FD-B:
 * Cửa 1 (nhận/từ chối hồ sơ) chỉ `human` làm được.
 * Cửa 2 (xác nhận tiền vào) `system` làm được — vì đó là sự thật kế toán,
 * không phải phán đoán.
 */
export type Actor =
  | { kind: 'human'; id: string; label?: string }
  | { kind: 'system'; label: string };

export interface AuditEntry {
  actor: string;
  action: string;
  entityType: 'lang_application' | 'hatmam_order';
  entityId: string;
  fromState: string;
  toState: string;
  reason?: string;
}

export interface TransitionResult<S> {
  from: S;
  to: S;
  audit: AuditEntry;
  /** Chỉ có khi bước này khoá suất Lặng. */
  capacity?: CapacityResult;
}

function actorLabel(actor: Actor): string {
  return actor.kind === 'human'
    ? `human:${actor.id}${actor.label ? ` (${actor.label})` : ''}`
    : `system:${actor.label}`;
}

function assertAllowed<S extends string>(
  map: Record<S, readonly S[]>,
  from: S,
  to: S,
  entityLabel: string
): void {
  const allowed = map[from];
  if (!allowed) {
    throw new DomainError(
      'INVALID_TRANSITION',
      `Trạng thái "${from}" không có trong bộ luật ${entityLabel}.`,
      { from, to }
    );
  }
  if (!allowed.includes(to)) {
    throw new DomainError(
      'INVALID_TRANSITION',
      allowed.length === 0
        ? `Hồ sơ đang ở "${from}" — đây là trạng thái kết thúc, không chuyển đi đâu được nữa.`
        : `Không đi thẳng từ "${from}" sang "${to}" được. Từ "${from}" chỉ có thể sang: ${allowed.join(', ')}.`,
      { from, to, allowed }
    );
  }
}

export interface LangTransitionInput {
  applicationId: string;
  from: LangStatus;
  to: LangStatus;
  actor: Actor;
  reason?: string;
  /**
   * Bắt buộc khi bước này là accepted → awaiting_payment.
   * Bên gọi phải đếm sẵn số suất đã dùng của tháng đích.
   */
  capacity?: CapacityCheck;
}

export function transitionLang(input: LangTransitionInput): TransitionResult<LangStatus> {
  const { applicationId, from, to, actor, reason } = input;

  assertAllowed(LANG_TRANSITIONS, from, to, 'Lặng');

  // ---- Cửa 1: Human Decision Gate (L0 C-05, FD-B) ----
  // Không hàm tự động nào được nhận/từ chối/hỏi thêm một hồ sơ.
  if (LANG_HUMAN_ONLY_TARGETS.includes(to) && actor.kind !== 'human') {
    throw new DomainError(
      'HUMAN_DECISION_REQUIRED',
      `Bước sang "${to}" phải do người thật quyết định. Hệ thống không tự duyệt hồ sơ.`,
      { from, to, actor: actorLabel(actor) }
    );
  }

  // ---- Bộ đếm suất: khoá tại bước phát link thanh toán (FD-C) ----
  let capacity: CapacityResult | undefined;
  const isLockStep =
    from === LANG_CAPACITY_LOCK_STEP.from && to === LANG_CAPACITY_LOCK_STEP.to;

  if (isLockStep) {
    if (!input.capacity) {
      throw new DomainError(
        'TARGET_MONTH_REQUIRED',
        'Chưa biết phiên dự kiến diễn ra tháng nào nên chưa khoá được suất. Chọn tháng trước khi phát link thanh toán.',
        { from, to }
      );
    }
    capacity = assertCapacityAvailable(input.capacity);
  }

  return {
    from,
    to,
    capacity,
    audit: {
      actor: actorLabel(actor),
      action: `lang.${from}->${to}`,
      entityType: 'lang_application',
      entityId: applicationId,
      fromState: from,
      toState: to,
      reason,
    },
  };
}

export interface HatMamTransitionInput {
  orderId: string;
  from: HatMamStatus;
  to: HatMamStatus;
  actor: Actor;
  reason?: string;
}

export function transitionHatMam(
  input: HatMamTransitionInput
): TransitionResult<HatMamStatus> {
  const { orderId, from, to, actor, reason } = input;

  assertAllowed(HATMAM_TRANSITIONS, from, to, 'Hạt Mầm');

  return {
    from,
    to,
    audit: {
      actor: actorLabel(actor),
      action: `hatmam.${from}->${to}`,
      entityType: 'hatmam_order',
      entityId: orderId,
      fromState: from,
      toState: to,
      reason,
    },
  };
}

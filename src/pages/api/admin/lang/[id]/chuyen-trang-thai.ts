// ============================================================
// POST /api/admin/lang/[id]/chuyen-trang-thai
//
// Đường DUY NHẤT để đổi trạng thái một hồ sơ Lặng từ giao diện admin.
// Mọi hành động đi qua transitionLang() — không có nhánh nào ghi thẳng
// cột status.
//
// LOG: chỉ id + hành động + thời gian. KHÔNG log nội dung 6 câu trả lời.
// ============================================================

import type { NextApiRequest, NextApiResponse } from 'next';

import { requireAdmin } from '@/lib/auth/require-admin';
import { createAdminSupabase, createServerSupabase } from '@/lib/db/client';
import { getLangApplication } from '@/lib/db/queries';
import { countLangSlotsUsed, getMonthlyLimit } from '@/lib/db/queries';
import { DomainError, HTTP_STATUS_BY_CODE } from '@/lib/domain/errors';
import { transitionLang, type Actor } from '@/lib/domain/state-machine';
import { LANG_SESSION_PRICE_VND, type LangStatus } from '@/lib/domain/states';
import { toMonthKey } from '@/lib/domain/capacity';

type Action =
  | 'start_review'
  | 'accept'
  | 'decline'
  | 'request_more_info'
  | 'issue_payment'
  | 'confirm_payment'
  | 'cancel';

const TARGET_BY_ACTION: Record<Action, LangStatus> = {
  start_review: 'under_review',
  accept: 'accepted',
  decline: 'declined',
  request_more_info: 'more_info_needed',
  issue_payment: 'awaiting_payment',
  confirm_payment: 'paid',
  cancel: 'cancelled',
};

interface TransitionRpcRow {
  from_status: LangStatus;
  to_status: LangStatus;
  capacity_month: string | null;
  capacity_used: number | null;
  capacity_limit: number | null;
}

function throwTransitionRpcError(error: { message?: string }): never {
  switch (error.message) {
    case 'APPLICATION_NOT_FOUND':
      throw new DomainError('NOT_FOUND', 'Không tìm thấy hồ sơ này.');
    case 'CONCURRENT_UPDATE':
      throw new DomainError(
        'CONCURRENT_UPDATE',
        'Hồ sơ vừa được cập nhật ở một cửa sổ khác. Tải lại trang rồi kiểm tra lại giúp tôi nhé.'
      );
    case 'CAPACITY_FULL':
      throw new DomainError(
        'CAPACITY_FULL',
        'Tháng dự kiến đã đủ suất. Chọn tháng khác hoặc điều chỉnh giới hạn trước khi phát link thanh toán.'
      );
    case 'TARGET_MONTH_REQUIRED':
      throw new DomainError(
        'TARGET_MONTH_REQUIRED',
        'Chọn giúp tháng dự kiến diễn ra phiên trước khi tiếp tục.'
      );
    case 'DECLINE_REASON_REQUIRED':
      throw new DomainError('VALIDATION_FAILED', 'Ghi giúp một dòng lý do từ chối.');
    case 'HUMAN_DECISION_REQUIRED':
      throw new DomainError(
        'HUMAN_DECISION_REQUIRED',
        'Bước này phải do người thật quyết định.'
      );
    case 'INVALID_TRANSITION':
      throw new DomainError(
        'INVALID_TRANSITION',
        'Hồ sơ đang ở trạng thái không thể thực hiện hành động này. Tải lại trang rồi thử lại giúp tôi nhé.'
      );
    default:
      throw error;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: { code: 'METHOD_NOT_ALLOWED', message: 'Chỉ nhận POST.' } });
  }

  const id = req.query.id;
  if (typeof id !== 'string') {
    return res.status(400).json({ ok: false, error: { code: 'VALIDATION_FAILED', message: 'Thiếu mã hồ sơ.' } });
  }

  try {
    const db = createServerSupabase({ req, res });
    const admin = await requireAdmin(db);

    // Nút trong /admin luôn do người thật bấm → actor là human.
    // Đây là điều cho phép các bước accepted/declined/more_info_needed đi qua
    // Cửa 1 của C-05. Webhook ngân hàng sau này sẽ dùng actor 'system' và
    // vì vậy KHÔNG thể tự nhận hồ sơ.
    const {
      data: { user },
    } = await db.auth.getUser();
    if (!user) throw new DomainError('UNAUTHORIZED', 'Cần đăng nhập.');
    const actor: Actor = { kind: 'human', id: user.id, label: admin.adminEmail };

    const action = req.body?.action as Action | undefined;
    if (!action || !(action in TARGET_BY_ACTION)) {
      throw new DomainError('VALIDATION_FAILED', 'Hành động không hợp lệ.');
    }

    const application = await getLangApplication(db, id);
    if (!application) throw new DomainError('NOT_FOUND', 'Không tìm thấy hồ sơ này.');

    const from = application.status;
    const to = TARGET_BY_ACTION[action];

    // ---- Chuẩn bị dữ liệu ghi kèm theo từng hành động ----
    let targetSessionMonth: string | null = null;
    let declineReason: string | null = null;
    let capacityInput;

    if (action === 'accept') {
      const raw = req.body?.target_session_month;
      if (typeof raw !== 'string' || !/^\d{4}-\d{2}$/.test(raw)) {
        throw new DomainError(
          'TARGET_MONTH_REQUIRED',
          'Chọn giúp tháng dự kiến diễn ra phiên trước khi nhận hồ sơ.'
        );
      }
      targetSessionMonth = `${raw}-01`;
    }

    if (action === 'decline') {
      const reason = req.body?.reason;
      if (typeof reason !== 'string' || reason.trim() === '') {
        throw new DomainError('VALIDATION_FAILED', 'Ghi giúp một dòng lý do từ chối.');
      }
      declineReason = reason.trim();
    }

    // ---- Bộ đếm suất: chỉ ở bước phát link thanh toán ----
    if (action === 'issue_payment') {
      if (!application.target_session_month) {
        throw new DomainError(
          'TARGET_MONTH_REQUIRED',
          'Hồ sơ này chưa có tháng dự kiến. Nhận lại hồ sơ và chọn tháng trước.'
        );
      }
      const monthKey = toMonthKey(application.target_session_month);
      const [used, limit] = await Promise.all([
        countLangSlotsUsed(db, monthKey),
        getMonthlyLimit(db, monthKey),
      ]);
      capacityInput = { monthKey, usedSlots: used.usedSlots, maxSlots: limit };
    }

    // ---- Bộ luật trạng thái: nguồn sự thật duy nhất ----
    const result = transitionLang({
      applicationId: id,
      from,
      to,
      actor,
      reason: typeof req.body?.reason === 'string' ? req.body.reason : undefined,
      capacity: capacityInput,
    });

    // ---- Ghi nguyên tử ở CSDL ----
    // Chỉ route đã qua requireAdmin() mới lấy được service role để gọi RPC.
    // RPC cũng tự khoá capacity, ghi audit và payment trong cùng transaction.
    const systemDb = createAdminSupabase();
    const { data: transitionRows, error: transitionError } = await systemDb.rpc(
      'transition_lang_application',
      {
        p_application_id: id,
        p_expected_status: from,
        p_next_status: to,
        p_actor: result.audit.actor,
        p_reason: declineReason,
        p_target_session_month: targetSessionMonth,
        p_payment_amount_vnd: action === 'confirm_payment' ? LANG_SESSION_PRICE_VND : null,
      }
    );
    if (transitionError) throwTransitionRpcError(transitionError);

    const applied = (transitionRows as TransitionRpcRow[] | null)?.[0];

    // TODO(vòng sau — B1 email): gửi email theo từng bước.
    //   accept            → thư mời + hướng dẫn bước tiếp theo
    //   decline           → thư từ chối, giọng tôn trọng, có gợi ý hướng khác
    //   issue_payment     → thư kèm hướng dẫn thanh toán
    //   confirm_payment   → thư xác nhận đã nhận tiền (Cửa 2, tự động được)
    // Chưa cài Resend ở vòng này theo work order B0.

    // Log tối thiểu: id + hành động + thời gian. Không nội dung form.
    console.info('[admin] lang transition', {
      applicationId: id,
      action: result.audit.action,
      at: new Date().toISOString(),
    });

    return res.status(200).json({
      ok: true,
      data: {
        from: applied?.from_status ?? result.from,
        to: applied?.to_status ?? result.to,
        capacity:
          applied?.capacity_month &&
          applied.capacity_used !== null &&
          applied.capacity_limit !== null
            ? {
                monthKey: applied.capacity_month,
                usedSlots: applied.capacity_used,
                maxSlots: applied.capacity_limit,
                remaining: Math.max(0, applied.capacity_limit - applied.capacity_used),
              }
            : null,
      },
    });
  } catch (err) {
    if (err instanceof DomainError) {
      return res.status(HTTP_STATUS_BY_CODE[err.code]).json(err.toResponse());
    }
    console.error('[admin] lang transition failed', {
      applicationId: id,
      at: new Date().toISOString(),
    });
    return res.status(500).json({
      ok: false,
      error: { code: 'INTERNAL', message: 'Có trục trặc ở phía hệ thống. Thử lại giúp tôi nhé.' },
    });
  }
}

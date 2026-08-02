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

import { createServerSupabase } from '@/lib/db/client';
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

    // ---- Xác thực + kiểm tra quyền admin ----
    const {
      data: { user },
    } = await db.auth.getUser();
    if (!user) throw new DomainError('UNAUTHORIZED', 'Cần đăng nhập.');

    const { data: adminRow } = await db
      .from('admin_users')
      .select('email, is_active')
      .eq('user_id', user.id)
      .maybeSingle();
    if (!adminRow || adminRow.is_active !== true) {
      throw new DomainError('UNAUTHORIZED', 'Tài khoản này không có quyền quản trị.');
    }

    // Nút trong /admin luôn do người thật bấm → actor là human.
    // Đây là điều cho phép các bước accepted/declined/more_info_needed đi qua
    // Cửa 1 của C-05. Webhook ngân hàng sau này sẽ dùng actor 'system' và
    // vì vậy KHÔNG thể tự nhận hồ sơ.
    const actor: Actor = { kind: 'human', id: user.id, label: adminRow.email as string };

    const action = req.body?.action as Action | undefined;
    if (!action || !(action in TARGET_BY_ACTION)) {
      throw new DomainError('VALIDATION_FAILED', 'Hành động không hợp lệ.');
    }

    const application = await getLangApplication(db, id);
    if (!application) throw new DomainError('NOT_FOUND', 'Không tìm thấy hồ sơ này.');

    const from = application.status;
    const to = TARGET_BY_ACTION[action];

    // ---- Chuẩn bị dữ liệu ghi kèm theo từng hành động ----
    const patch: Record<string, unknown> = { status: to };
    let capacityInput;

    if (action === 'accept') {
      const raw = req.body?.target_session_month;
      if (typeof raw !== 'string' || !/^\d{4}-\d{2}$/.test(raw)) {
        throw new DomainError(
          'TARGET_MONTH_REQUIRED',
          'Chọn giúp tháng dự kiến diễn ra phiên trước khi nhận hồ sơ.'
        );
      }
      patch.target_session_month = `${raw}-01`;
      patch.decided_at = new Date().toISOString();
    }

    if (action === 'decline') {
      const reason = req.body?.reason;
      if (typeof reason !== 'string' || reason.trim() === '') {
        throw new DomainError('VALIDATION_FAILED', 'Ghi giúp một dòng lý do từ chối.');
      }
      patch.decline_reason = reason.trim();
      patch.decided_at = new Date().toISOString();
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

    // ---- Ghi trạng thái mới ----
    const { error: updateError } = await db
      .from('lang_applications')
      .update(patch)
      .eq('id', id)
      .eq('status', from); // khoá lạc quan: chặn hai tab cùng bấm

    if (updateError) throw updateError;

    // ---- Ghi audit (bắt buộc, mọi lần chuyển) ----
    const { error: auditError } = await db.from('audit_log').insert({
      actor: result.audit.actor,
      action: result.audit.action,
      entity_type: result.audit.entityType,
      entity_id: result.audit.entityId,
      from_state: result.audit.fromState,
      to_state: result.audit.toState,
      reason: result.audit.reason ?? null,
    });
    if (auditError) {
      // Không chặn hành động đã thành công, nhưng phải kêu to.
      console.error('[admin] audit_log insert failed', {
        applicationId: id,
        action: result.audit.action,
        at: new Date().toISOString(),
      });
    }

    // ---- Cửa 2 (FD-B/B0.1): "Đã nhận tiền" phải để lại một dòng sổ sách ----
    // Trước bản vá này nút chỉ đổi status, không ghi gì vào payments — nghĩa
    // là không có bằng chứng kế toán cho việc Kenji vừa xác nhận. Giai đoạn
    // đầu là Kenji tự bấm (không webhook), nhưng đây vẫn là "sự thật kế
    // toán" nên phải có dòng ghi lại, không chỉ đổi một cột trạng thái.
    if (action === 'confirm_payment') {
      const { error: paymentError } = await db.from('payments').insert({
        subject: 'lang',
        subject_id: id,
        amount_vnd: LANG_SESSION_PRICE_VND,
        status: 'confirmed',
        confirmed_at: new Date().toISOString(),
      });
      if (paymentError) {
        // Trạng thái hồ sơ đã đổi thành công (transitionLang + update ở trên
        // đã qua) — không rollback nó ở đây, vì rollback một transition đã
        // audit lại là một việc khác cần thiết kế riêng. Kêu to để không ai
        // âm thầm mất một dòng sổ sách.
        console.error('[admin] payments insert failed sau confirm_payment', {
          applicationId: id,
          at: new Date().toISOString(),
        });
      }
    }

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
      data: { from: result.from, to: result.to, capacity: result.capacity ?? null },
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

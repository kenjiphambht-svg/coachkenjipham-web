import type { NextApiRequest, NextApiResponse } from 'next';

import { requireAdmin } from '@/lib/auth/require-admin';
import { createAdminSupabase, createServerSupabase } from '@/lib/db/client';
import { getHatMamOrder, getHatMamPackageSnapshot } from '@/lib/db/queries';
import { DomainError, HTTP_STATUS_BY_CODE } from '@/lib/domain/errors';
import { transitionHatMam, type Actor } from '@/lib/domain/state-machine';
import { type HatMamStatus } from '@/lib/domain/states';

type Action = 'issue_payment' | 'confirm_payment' | 'start_production' | 'submit_for_review' | 'request_revision' | 'mark_ready' | 'cancel';

const targetByAction: Record<Action, HatMamStatus> = {
  issue_payment: 'awaiting_payment',
  confirm_payment: 'paid',
  start_production: 'in_production',
  submit_for_review: 'review_pending',
  request_revision: 'revision_requested',
  mark_ready: 'ready',
  cancel: 'cancelled',
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: { code: 'METHOD_NOT_ALLOWED', message: 'Chỉ nhận POST.' } });
  }

  const id = req.query.id;
  if (typeof id !== 'string') {
    return res.status(400).json({ ok: false, error: { code: 'VALIDATION_FAILED', message: 'Thiếu mã đơn.' } });
  }

  try {
    const db = createServerSupabase({ req, res });
    const admin = await requireAdmin(db);
    const {
      data: { user },
    } = await db.auth.getUser();
    if (!user) throw new DomainError('UNAUTHORIZED', 'Cần đăng nhập.');

    const action = req.body?.action as Action | undefined;
    if (!action || !(action in targetByAction)) {
      throw new DomainError('VALIDATION_FAILED', 'Hành động không hợp lệ.');
    }

    const order = await getHatMamOrder(db, id);
    if (!order) throw new DomainError('NOT_FOUND', 'Không tìm thấy đơn Hạt Mầm.');

    const actor: Actor = { kind: 'human', id: user.id, label: admin.adminEmail };
    const result = transitionHatMam({
      orderId: id,
      from: order.status,
      to: targetByAction[action],
      actor,
    });

    const snapshot = action === 'confirm_payment' ? await getHatMamPackageSnapshot(db, id) : null;
    if (action === 'confirm_payment' && !snapshot) {
      throw new DomainError('VALIDATION_FAILED', 'Đơn chưa có package snapshot nên không thể xác nhận thanh toán.');
    }
    const systemDb = createAdminSupabase();
    const amount = action === 'confirm_payment' ? Number(snapshot?.amount_vnd) : null;
    const { error: transitionError } = await systemDb.rpc('transition_hatmam_order', {
      p_order_id: id,
      p_expected_status: result.from,
      p_next_status: result.to,
      p_actor: result.audit.actor,
      p_payment_amount_vnd: amount,
    });
    if (transitionError) {
      if (transitionError.message === 'CONCURRENT_UPDATE') {
        throw new DomainError('CONCURRENT_UPDATE', 'Đơn vừa được cập nhật ở nơi khác. Tải lại rồi kiểm tra lại.');
      }
      if (transitionError.message === 'INVALID_TRANSITION') {
        throw new DomainError('INVALID_TRANSITION', 'Đơn đang ở trạng thái không thể thực hiện hành động này.');
      }
      if (transitionError.message === 'PAYMENT_EVIDENCE_INVALID') {
        throw new DomainError('VALIDATION_FAILED', 'Chưa đủ evidence thanh toán hợp lệ: cần payment report, receipt, số tiền và nội dung chuyển khoản khớp package snapshot.');
      }
      throw transitionError;
    }

    return res.status(200).json({ ok: true, data: { from: result.from, to: result.to } });
  } catch (error) {
    if (error instanceof DomainError) {
      return res.status(HTTP_STATUS_BY_CODE[error.code]).json(error.toResponse());
    }
    console.error('[admin] hatmam transition failed', { orderId: id, at: new Date().toISOString() });
    return res.status(500).json({
      ok: false,
      error: { code: 'INTERNAL', message: 'Có trục trặc ở phía hệ thống. Thử lại giúp tôi nhé.' },
    });
  }
}

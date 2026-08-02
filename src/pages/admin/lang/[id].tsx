// ============================================================
// /admin/lang/[id] — chi tiết hồ sơ Lặng + nút hành động.
//
// Mỗi nút gọi hàm chuyển trạng thái duy nhất ở src/lib/domain/state-machine.ts
// (qua API /api/admin/lang/[id]/chuyen-trang-thai). Có xác nhận trước khi chạy.
//
// B0: nút KHÔNG gửi email. Chỗ gọi email để TODO rõ ràng ở API route.
// ============================================================

import { useRouter } from 'next/router';
import { useState } from 'react';
import type { GetServerSideProps } from 'next';

import AdminShell from '@/components/admin/AdminShell';
import { Card, LANG_STATUS_VI, StatusBadge, formatDate, formatMonth } from '@/components/admin/ui';
import { withAdmin } from '@/lib/auth/require-admin';
import {
  countLangSlotsUsed,
  getLangApplication,
  getMonthlyLimit,
  type LangApplicationRow,
} from '@/lib/db/queries';
import { evaluateCapacity, toMonthKey } from '@/lib/domain/capacity';

interface MonthOption {
  value: string; // YYYY-MM
  label: string;
  remaining: number;
  maxSlots: number;
}

interface Props {
  adminEmail: string;
  application: LangApplicationRow;
  monthOptions: MonthOption[];
}

const Q2_VI: Record<string, string> = {
  A: 'Hoang mang, mất phương hướng',
  B: 'Đang ở điểm gãy',
  C: '⚠️ Có ý nghĩ tự làm hại — hồ sơ này lẽ ra đã bị chặn ở form',
  D: 'Đang ổn, muốn hiểu mình hơn',
};
const Q3_VI: Record<string, string> = {
  A: 'Chưa bao giờ',
  B: 'Có — vẫn đang trong quá trình',
  C: 'Có — đã dừng',
};
const Q5_VI: Record<string, string> = {
  A: 'Sẵn sàng nghe góc nhìn khác',
  B: 'Không chắc — sẵn sàng thử',
  C: 'Chỉ cần người lắng nghe',
};

function Answer({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <div className="font-sans text-[13px] text-e26-text-2 mb-1">{label}</div>
      <div className="font-sans text-[15px] leading-[1.7] whitespace-pre-line">{children}</div>
    </div>
  );
}

export default function AdminLangDetail({ adminEmail, application, monthOptions }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [month, setMonth] = useState(monthOptions[0]?.value ?? '');
  const [reason, setReason] = useState('');

  const status = application.status;

  const run = async (
    action: string,
    payload: Record<string, unknown>,
    confirmText: string
  ) => {
    if (!window.confirm(confirmText)) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/lang/${application.id}/chuyen-trang-thai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...payload }),
      });
      const body = await res.json();
      if (!res.ok || !body.ok) {
        setError(body?.error?.message ?? 'Chưa thực hiện được. Thử lại giúp tôi nhé.');
        setBusy(false);
        return;
      }
      router.replace(router.asPath);
      setBusy(false);
    } catch {
      setError('Mất kết nối. Thử lại giúp tôi nhé.');
      setBusy(false);
    }
  };

  const btn =
    'font-sans text-[14px] px-4 py-3 border border-e26-text hover:border-e26-gold-deep hover:text-e26-gold-deep transition-colors disabled:opacity-50 w-full sm:w-auto';
  const btnPrimary =
    'font-sans font-medium text-[13px] tracking-[0.08em] uppercase px-6 py-3 bg-e26-gold text-e26-black hover:bg-e26-gold-deep hover:text-e26-ivory transition-colors disabled:opacity-50 w-full sm:w-auto';

  const selectedMonth = monthOptions.find((m) => m.value === month);

  return (
    <AdminShell title={`Hồ sơ ${application.order_code}`} adminEmail={adminEmail}>
      <div className="grid lg:grid-cols-[1fr_340px] gap-5">
        <div>
          <Card title="Sáu câu trả lời">
            <Answer label="Câu 1 — điều đang trải qua">{application.q1_situation}</Answer>
            <Answer label="Câu 2 — mức độ hiện tại">
              {Q2_VI[application.q2_level] ?? application.q2_level}
            </Answer>
            <Answer label="Câu 3 — đã làm việc với chuyên gia">
              {Q3_VI[application.q3_prior_help] ?? application.q3_prior_help}
            </Answer>
            <Answer label="Câu 4 — muốn rời phiên với điều gì">{application.q4_want}</Answer>
            <Answer label="Câu 5 — sẵn sàng nghe góc nhìn khác">
              {Q5_VI[application.q5_openness] ?? application.q5_openness}
            </Answer>
            <Answer label="Câu 6 — muốn Kenji biết trước">
              {application.q6_extra?.trim() || '(không có)'}
            </Answer>
          </Card>
        </div>

        <div className="space-y-4">
          <Card title="Thông tin">
            <dl className="font-sans text-[14px] space-y-2">
              <div className="flex justify-between gap-3">
                <dt className="text-e26-text-2">Trạng thái</dt>
                <dd>
                  <StatusBadge>{LANG_STATUS_VI[status]}</StatusBadge>
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-e26-text-2">Tên gọi</dt>
                <dd className="text-right">{application.applicant_name}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-e26-text-2">Liên hệ</dt>
                <dd className="text-right break-all">{application.applicant_contact}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-e26-text-2">Tháng dự kiến</dt>
                <dd>{formatMonth(application.target_session_month)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-e26-text-2">Ngày gửi</dt>
                <dd className="text-right">{formatDate(application.created_at)}</dd>
              </div>
              {application.decline_reason && (
                <div>
                  <dt className="text-e26-text-2 mb-1">Lý do từ chối</dt>
                  <dd className="whitespace-pre-line">{application.decline_reason}</dd>
                </div>
              )}
            </dl>
          </Card>

          <Card title="Hành động">
            {error && (
              <p className="font-sans text-[13px] text-e26-gold-deep mb-3" role="alert">
                {error}
              </p>
            )}

            <div className="space-y-3">
              {status === 'submitted' && (
                <button
                  className={btnPrimary}
                  disabled={busy}
                  onClick={() =>
                    run('start_review', {}, 'Bắt đầu đọc hồ sơ này?')
                  }
                >
                  Bắt đầu đọc
                </button>
              )}

              {(status === 'under_review' || status === 'more_info_needed') && (
                <>
                  {status === 'under_review' && (
                    <div className="pb-3 border-b border-e26-border">
                      <label
                        htmlFor="month"
                        className="block font-sans text-[13px] text-e26-text-2 mb-2"
                      >
                        Tháng dự kiến diễn ra phiên
                      </label>
                      <select
                        id="month"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        className="w-full px-3 py-2.5 border border-e26-border bg-e26-white font-sans text-[14px] focus:outline-none focus:border-e26-gold-deep mb-3"
                      >
                        {monthOptions.map((m) => (
                          <option key={m.value} value={m.value} disabled={m.remaining <= 0}>
                            {m.label} — còn {m.remaining}/{m.maxSlots} suất
                            {m.remaining <= 0 ? ' (đã đầy)' : ''}
                          </option>
                        ))}
                      </select>
                      <button
                        className={btnPrimary}
                        disabled={busy || !selectedMonth || selectedMonth.remaining <= 0}
                        onClick={() =>
                          run(
                            'accept',
                            { target_session_month: month },
                            `Nhận hồ sơ này cho tháng ${selectedMonth?.label}?`
                          )
                        }
                      >
                        Nhận
                      </button>
                    </div>
                  )}

                  {status === 'under_review' && (
                    <button
                      className={btn}
                      disabled={busy}
                      onClick={() =>
                        run('request_more_info', {}, 'Chuyển hồ sơ sang "cần hỏi thêm"?')
                      }
                    >
                      Hỏi thêm
                    </button>
                  )}

                  {status === 'more_info_needed' && (
                    <button
                      className={btnPrimary}
                      disabled={busy}
                      onClick={() => run('start_review', {}, 'Quay lại đọc hồ sơ này?')}
                    >
                      Quay lại đọc
                    </button>
                  )}

                  {status === 'under_review' && (
                    <div>
                      <label
                        htmlFor="reason"
                        className="block font-sans text-[13px] text-e26-text-2 mb-2"
                      >
                        Lý do từ chối
                      </label>
                      <textarea
                        id="reason"
                        rows={3}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full px-3 py-2.5 border border-e26-border bg-e26-white font-sans text-[14px] resize-none focus:outline-none focus:border-e26-gold-deep mb-2"
                      />
                      <button
                        className={btn}
                        disabled={busy || reason.trim() === ''}
                        onClick={() =>
                          run('decline', { reason }, 'Từ chối hồ sơ này?')
                        }
                      >
                        Từ chối
                      </button>
                    </div>
                  )}
                </>
              )}

              {status === 'accepted' && (
                <button
                  className={btnPrimary}
                  disabled={busy}
                  onClick={() =>
                    run(
                      'issue_payment',
                      {},
                      `Phát link thanh toán? Việc này khoá 1 suất của tháng ${formatMonth(
                        application.target_session_month
                      )}.`
                    )
                  }
                >
                  Phát link thanh toán
                </button>
              )}

              {status === 'awaiting_payment' && (
                <button
                  className={btnPrimary}
                  disabled={busy}
                  onClick={() =>
                    run('confirm_payment', {}, 'Xác nhận đã nhận đủ tiền cho hồ sơ này?')
                  }
                >
                  Đã nhận tiền
                </button>
              )}

              {status === 'paid' && (
                <p className="font-sans text-[14px] text-e26-text-2">
                  Đã nhận tiền. Bước xếp lịch và phát link đặt lịch riêng sẽ làm ở vòng sau.
                </p>
              )}

              {['declined', 'cancelled', 'completed'].includes(status) && (
                <p className="font-sans text-[14px] text-e26-text-2">
                  Hồ sơ đã kết thúc — không còn hành động nào.
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </AdminShell>
  );
}

export const getServerSideProps: GetServerSideProps = withAdmin(async (ctx, { db, adminEmail }) => {
  const id = ctx.params?.id;
  if (typeof id !== 'string') return { notFound: true };

  const application = await getLangApplication(db, id);
  if (!application) return { notFound: true };

  // 6 tháng tới, kèm số suất còn lại — để Kenji thấy trước khi bấm Nhận,
  // không phải nhận xong mới biết tháng đó đã đầy.
  const now = new Date();
  const monthOptions: MonthOption[] = [];
  for (let i = 0; i < 6; i += 1) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + i, 1));
    const monthKey = toMonthKey(d);
    const [used, limit] = await Promise.all([
      countLangSlotsUsed(db, d),
      getMonthlyLimit(db, d),
    ]);
    const cap = evaluateCapacity({ monthKey, usedSlots: used.usedSlots, maxSlots: limit });
    monthOptions.push({
      value: monthKey.slice(0, 7),
      label: `${String(d.getUTCMonth() + 1).padStart(2, '0')}/${d.getUTCFullYear()}`,
      remaining: cap.remaining,
      maxSlots: cap.maxSlots,
    });
  }

  return { props: { adminEmail, application, monthOptions } };
});

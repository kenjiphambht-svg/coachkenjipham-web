// ============================================================
// /admin — tổng quan: đếm hồ sơ theo trạng thái + suất Lặng còn lại.
// ============================================================

import Link from 'next/link';
import type { GetServerSideProps } from 'next';

import AdminShell from '@/components/admin/AdminShell';
import {
  Card,
  HATMAM_STATUS_VI,
  LANG_STATUS_VI,
  OperationalNotice,
  ReadinessBadge,
  StatTile,
} from '@/components/admin/ui';
import { withAdmin } from '@/lib/auth/require-admin';
import {
  countLangSlotsUsed,
  countUnhandledMessages,
  getHatMamStatusCounts,
  getLangStatusCounts,
  getReleaseGates,
  getMonthlyLimit,
  listDeletionRequests,
  listPayments,
} from '@/lib/db/queries';
import { evaluateCapacity } from '@/lib/domain/capacity';
import type { HatMamStatus, LangStatus } from '@/lib/domain/states';

interface Props {
  adminEmail: string;
  langCounts: Partial<Record<LangStatus, number>>;
  hatMamCounts: Partial<Record<HatMamStatus, number>>;
  unhandledMessages: number;
  capacity: { monthKey: string; usedSlots: number; maxSlots: number; remaining: number };
  pendingPayments: number;
  pendingDeletions: number;
  gates: { privateStorageReady: boolean; deletionWorkflowReady: boolean; publicActivationEnabled: boolean };
}

export default function AdminDashboard({
  adminEmail,
  langCounts,
  hatMamCounts,
  unhandledMessages,
  capacity,
  pendingPayments,
  pendingDeletions,
  gates,
}: Props) {
  const [year, month] = capacity.monthKey.split('-');

  return (
    <AdminShell title="Tổng quan" adminEmail={adminEmail}>
      <OperationalNotice title="Việc Kenji cần nhìn ngay hôm nay">
        Đây là control room nội bộ. Mọi dữ liệu đang hiển thị trên staging là dữ liệu thử; AI chỉ tóm tắt để hỗ trợ đọc, không quyết định thay Kenji.
      </OperationalNotice>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-6">
        <StatTile
          label={`Suất Lặng còn lại (${month}/${year})`}
          value={`${capacity.remaining}/${capacity.maxSlots}`}
        />
        <StatTile
          label="Hồ sơ Lặng chờ đọc"
          value={(langCounts.submitted ?? 0) + (langCounts.under_review ?? 0)}
        />
        <StatTile label="Thanh toán chờ xác nhận" value={pendingPayments} />
        <StatTile
          label="Đơn Hạt Mầm đang chạy"
          value={
            (hatMamCounts.paid ?? 0) +
            (hatMamCounts.in_production ?? 0) +
            (hatMamCounts.ready ?? 0)
          }
        />
        <StatTile label="Yêu cầu xóa chờ xem" value={pendingDeletions} />
        <StatTile label="Tin nhắn chưa xử lý" value={unhandledMessages} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        <Card title="Cảnh báo readiness">
          <ul className="font-sans text-[14px] space-y-2">
            <li className="flex items-center justify-between gap-3">
              <span>Private Storage</span>
              <ReadinessBadge ready={gates.privateStorageReady}>
                {gates.privateStorageReady ? 'Sẵn sàng' : 'Chưa sẵn sàng'}
              </ReadinessBadge>
            </li>
            <li className="flex items-center justify-between gap-3">
              <span>Deletion workflow</span>
              <ReadinessBadge ready={gates.deletionWorkflowReady}>
                {gates.deletionWorkflowReady ? 'Sẵn sàng' : 'Chưa sẵn sàng'}
              </ReadinessBadge>
            </li>
            <li className="flex items-center justify-between gap-3">
              <span>Public activation</span>
              <ReadinessBadge ready={gates.publicActivationEnabled}>
                {gates.publicActivationEnabled ? 'Bật' : 'Tắt'}
              </ReadinessBadge>
            </li>
          </ul>
          <p className="font-sans text-[13px] text-e26-text-2 mt-4">
            Resend và Cal.com vẫn OFF; không có email hay booking thật trong work package này.
          </p>
        </Card>

        <Card title="Đi nhanh">
          <div className="font-sans text-[14px] space-y-2">
            <Link href="/admin/thanh-toan" className="block underline underline-offset-4 hover:text-e26-gold-deep">
              Xem thanh toán cần Kenji xác nhận →
            </Link>
            <Link href="/admin/xuat-ban" className="block underline underline-offset-4 hover:text-e26-gold-deep">
              Xem checklist ấn phẩm →
            </Link>
            <Link href="/admin/xoa-du-lieu" className="block underline underline-offset-4 hover:text-e26-gold-deep">
              Xem trước yêu cầu xóa →
            </Link>
            <Link href="/admin/cai-dat" className="block underline underline-offset-4 hover:text-e26-gold-deep">
              Lưu phiên bản cài đặt mới →
            </Link>
          </div>
        </Card>

        <Card title="SLA cần theo dõi">
          <ul className="font-sans text-[14px] space-y-2 text-e26-text-2">
            <li>Phản hồi hồ sơ Lặng: tối đa 60 phút trong giờ vận hành.</li>
            <li>Xác nhận thanh toán: tối đa 60 phút trong giờ vận hành.</li>
            <li>Hạt Mầm: giao trong 5 ngày làm việc, revision trong 7 ngày.</li>
          </ul>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card title="Hồ sơ Lặng theo trạng thái">
          <ul className="font-sans text-[14px] space-y-1.5">
            {(Object.keys(LANG_STATUS_VI) as LangStatus[]).map((status) => (
              <li key={status} className="flex justify-between gap-4">
                <span className="text-e26-text-2">{LANG_STATUS_VI[status]}</span>
                <span className="font-medium">{langCounts[status] ?? 0}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/admin/lang"
            className="inline-block mt-4 font-sans text-[14px] underline underline-offset-4 hover:text-e26-gold-deep"
          >
            Xem danh sách Lặng →
          </Link>
        </Card>

        <Card title="Đơn Hạt Mầm theo trạng thái">
          <ul className="font-sans text-[14px] space-y-1.5">
            {(Object.keys(HATMAM_STATUS_VI) as HatMamStatus[]).map((status) => (
              <li key={status} className="flex justify-between gap-4">
                <span className="text-e26-text-2">{HATMAM_STATUS_VI[status]}</span>
                <span className="font-medium">{hatMamCounts[status] ?? 0}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/admin/hat-mam"
            className="inline-block mt-4 font-sans text-[14px] underline underline-offset-4 hover:text-e26-gold-deep"
          >
            Xem danh sách Hạt Mầm →
          </Link>
        </Card>
      </div>
    </AdminShell>
  );
}

export const getServerSideProps: GetServerSideProps = withAdmin(async (_ctx, { db, adminEmail }) => {
  const now = new Date();
  const [langCounts, hatMamCounts, unhandledMessages, used, limit] = await Promise.all([
    getLangStatusCounts(db),
    getHatMamStatusCounts(db),
    countUnhandledMessages(db),
    countLangSlotsUsed(db, now),
    getMonthlyLimit(db, now),
  ]);

  const [payments, deletions, releaseGates] = await Promise.all([
    listPayments(db, 'pending'),
    listDeletionRequests(db),
    getReleaseGates(db),
  ]);

  const capacity = evaluateCapacity({
    monthKey: used.monthKey,
    usedSlots: used.usedSlots,
    maxSlots: limit,
  });

  return {
    props: {
      adminEmail,
      langCounts,
      hatMamCounts,
      unhandledMessages,
      capacity: {
        monthKey: capacity.monthKey,
        usedSlots: capacity.usedSlots,
        maxSlots: capacity.maxSlots,
        remaining: capacity.remaining,
      },
      pendingPayments: payments.length,
      pendingDeletions: deletions.filter((row) => !['completed', 'rejected'].includes(row.status)).length,
      gates: {
        privateStorageReady: releaseGates?.private_storage_ready ?? false,
        deletionWorkflowReady: releaseGates?.deletion_workflow_ready ?? false,
        publicActivationEnabled: releaseGates?.public_activation_enabled ?? false,
      },
    },
  };
});

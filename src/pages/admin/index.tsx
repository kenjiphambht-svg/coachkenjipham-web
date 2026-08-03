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
  listDeletionRequests,
  listHatMamOrders,
  listHatMamPaymentRequests,
  listHatMamSyntheticPublications,
  listOperationalSettings,
} from '@/lib/db/queries';
import { evaluateCapacity } from '@/lib/domain/capacity';
import type { HatMamStatus, LangStatus } from '@/lib/domain/states';
import { getActiveSettings } from '@/lib/admin/settings';

interface Props {
  adminEmail: string;
  langCounts: Partial<Record<LangStatus, number>>;
  hatMamCounts: Partial<Record<HatMamStatus, number>>;
  unhandledMessages: number;
  capacity: { monthKey: string; usedSlots: number; maxSlots: number; remaining: number };
  paymentReported: number;
  pendingDeletions: number;
  hatmamCapacity: { used: number; max: number };
  publicationWaiting: number;
  revisionWaiting: number;
  overdue: number;
  langSlaMinutes: number;
  gates: { privateStorageReady: boolean; deletionWorkflowReady: boolean; publicActivationEnabled: boolean };
}

export default function AdminDashboard({
  adminEmail,
  langCounts,
  hatMamCounts,
  unhandledMessages,
  capacity,
  paymentReported,
  pendingDeletions,
  hatmamCapacity,
  publicationWaiting,
  revisionWaiting,
  overdue,
  langSlaMinutes,
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
        <StatTile label="Payment đã báo, chờ Kenji" value={paymentReported} />
        <StatTile
          label="Đơn Hạt Mầm đang chạy"
          value={
            (hatMamCounts.paid ?? 0) +
            (hatMamCounts.in_production ?? 0) +
            (hatMamCounts.review_pending ?? 0) +
            (hatMamCounts.revision_requested ?? 0)
          }
        />
        <StatTile label="Publication chờ duyệt" value={publicationWaiting} />
        <StatTile label="Revision chờ xử lý" value={revisionWaiting} />
        <StatTile label="Yêu cầu xóa chờ xem" value={pendingDeletions} />
        <StatTile label="Việc quá hạn" value={overdue} />
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
            Resend OFF · Cal.com OFF. Booking sắp tới không lấy được vì provider chưa được kết nối.
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
            <li>Phản hồi hồ sơ Lặng: tối đa {langSlaMinutes} phút trong giờ vận hành.</li>
            <li>Xác nhận thanh toán: tối đa 60 phút trong giờ vận hành.</li>
            <li>Hạt Mầm capacity: {hatmamCapacity.used}/{hatmamCapacity.max} · deadline được lấy từ snapshot từng order.</li>
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
  const [langCounts, hatMamCounts, unhandledMessages, used, orders, paymentRequests, deletions, releaseGates, syntheticPublications, settingsRows] = await Promise.all([
    getLangStatusCounts(db),
    getHatMamStatusCounts(db),
    countUnhandledMessages(db),
    countLangSlotsUsed(db, now),
    listHatMamOrders(db),
    listHatMamPaymentRequests(db),
    listDeletionRequests(db),
    getReleaseGates(db),
    listHatMamSyntheticPublications(db),
    listOperationalSettings(db),
  ]);
  const settings = getActiveSettings(settingsRows).values;

  const capacity = evaluateCapacity({
    monthKey: used.monthKey,
    usedSlots: used.usedSlots,
    maxSlots: settings.lang.capacityMonth,
  });
  const isOpenHatMam = (status: HatMamStatus) => !['cancelled', 'delivered'].includes(status);
  const today = now.toISOString().slice(0, 10);
  const hatmamUsed = orders.filter((order) => isOpenHatMam(order.status) && order.target_delivery_month?.slice(0, 7) === today.slice(0, 7)).length;
  const overdue = orders.filter((order) => isOpenHatMam(order.status) && !!order.delivery_due_at && order.delivery_due_at < today).length;

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
      paymentReported: paymentRequests.filter((request) => !!request.reported_transfer_at && !request.revoked_at).length,
      pendingDeletions: deletions.filter((row) => !['completed', 'rejected'].includes(row.status)).length,
      hatmamCapacity: { used: hatmamUsed, max: settings.hatmam.capacityMonth },
      publicationWaiting: (hatMamCounts.review_pending ?? 0) + syntheticPublications.filter((row) => ['draft', 'revision_requested'].includes(row.status)).length,
      revisionWaiting: (hatMamCounts.revision_requested ?? 0) + syntheticPublications.filter((row) => row.status === 'revision_requested').length,
      overdue,
      langSlaMinutes: settings.lang.responseSlaMinutes,
      gates: {
        privateStorageReady: releaseGates?.private_storage_ready ?? false,
        deletionWorkflowReady: releaseGates?.deletion_workflow_ready ?? false,
        publicActivationEnabled: releaseGates?.public_activation_enabled ?? false,
      },
    },
  };
});

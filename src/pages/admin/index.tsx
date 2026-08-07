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
  StatTile,
} from '@/components/admin/ui';
import { withAdmin } from '@/lib/auth/require-admin';
import {
  countLangSlotsUsed,
  countUnhandledMessages,
  getHatMamStatusCounts,
  getLangStatusCounts,
  getMonthlyLimit,
} from '@/lib/db/queries';
import { evaluateCapacity } from '@/lib/domain/capacity';
import type { HatMamStatus, LangStatus } from '@/lib/domain/states';

interface Props {
  adminEmail: string;
  langCounts: Partial<Record<LangStatus, number>>;
  hatMamCounts: Partial<Record<HatMamStatus, number>>;
  unhandledMessages: number;
  capacity: { monthKey: string; usedSlots: number; maxSlots: number; remaining: number };
}

export default function AdminDashboard({
  adminEmail,
  langCounts,
  hatMamCounts,
  unhandledMessages,
  capacity,
}: Props) {
  const [year, month] = capacity.monthKey.split('-');

  return (
    <AdminShell title="Tổng quan" adminEmail={adminEmail}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatTile
          label={`Suất Lặng còn lại (${month}/${year})`}
          value={`${capacity.remaining}/${capacity.maxSlots}`}
        />
        <StatTile
          label="Hồ sơ Lặng chờ đọc"
          value={(langCounts.submitted ?? 0) + (langCounts.under_review ?? 0)}
        />
        <StatTile
          label="Đơn Hạt Mầm đang chạy"
          value={
            (hatMamCounts.paid ?? 0) +
            (hatMamCounts.in_production ?? 0) +
            (hatMamCounts.ready ?? 0)
          }
        />
        <StatTile label="Tin nhắn chưa xử lý" value={unhandledMessages} />
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
    },
  };
});

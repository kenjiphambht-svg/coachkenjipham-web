// ============================================================
// /admin/lang — danh sách hồ sơ Lặng, lọc theo trạng thái.
// ============================================================

import Link from 'next/link';
import { useRouter } from 'next/router';
import type { GetServerSideProps } from 'next';

import AdminShell from '@/components/admin/AdminShell';
import {
  EmptyState,
  LANG_STATUS_VI,
  ScrollTable,
  StatusBadge,
  Td,
  Th,
  formatDate,
  formatMonth,
} from '@/components/admin/ui';
import { withAdmin } from '@/lib/auth/require-admin';
import { listLangApplications } from '@/lib/db/queries';
import { LANG_STATUSES, type LangStatus } from '@/lib/domain/states';

interface Row {
  id: string;
  order_code: string;
  status: LangStatus;
  applicant_name: string;
  applicant_contact: string;
  target_session_month: string | null;
  created_at: string;
}

export default function AdminLangList({
  adminEmail,
  rows,
  activeStatus,
}: {
  adminEmail: string;
  rows: Row[];
  activeStatus: LangStatus | null;
}) {
  const router = useRouter();

  return (
    <AdminShell title="Hồ sơ Lặng" adminEmail={adminEmail}>
      <div className="mb-4">
        <label htmlFor="status-filter" className="block font-sans text-[14px] text-e26-text-2 mb-2">
          Lọc theo trạng thái
        </label>
        <select
          id="status-filter"
          value={activeStatus ?? ''}
          onChange={(e) => {
            const value = e.target.value;
            router.push(value ? `/admin/lang?status=${value}` : '/admin/lang');
          }}
          className="w-full sm:w-auto px-4 py-3 border border-e26-border bg-e26-white font-sans text-[15px] focus:outline-none focus:border-e26-gold-deep"
        >
          <option value="">Tất cả ({rows.length} đang hiện)</option>
          {LANG_STATUSES.map((s) => (
            <option key={s} value={s}>
              {LANG_STATUS_VI[s]}
            </option>
          ))}
        </select>
      </div>

      {rows.length === 0 ? (
        <EmptyState>Chưa có hồ sơ nào ở trạng thái này.</EmptyState>
      ) : (
        <ScrollTable>
          <thead>
            <tr>
              <Th>Mã đơn</Th>
              <Th>Tên gọi</Th>
              <Th>Trạng thái</Th>
              <Th>Tháng dự kiến</Th>
              <Th>Ngày gửi</Th>
              <Th>&nbsp;</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <Td>
                  <span className="font-medium">{row.order_code}</span>
                </Td>
                <Td>{row.applicant_name}</Td>
                <Td>
                  <StatusBadge>{LANG_STATUS_VI[row.status]}</StatusBadge>
                </Td>
                <Td>{formatMonth(row.target_session_month)}</Td>
                <Td>{formatDate(row.created_at)}</Td>
                <Td>
                  <Link
                    href={`/admin/lang/${row.id}`}
                    className="underline underline-offset-4 hover:text-e26-gold-deep whitespace-nowrap"
                  >
                    Mở
                  </Link>
                </Td>
              </tr>
            ))}
          </tbody>
        </ScrollTable>
      )}
    </AdminShell>
  );
}

export const getServerSideProps: GetServerSideProps = withAdmin(async (ctx, { db, adminEmail }) => {
  const raw = ctx.query.status;
  const candidate = Array.isArray(raw) ? raw[0] : raw;
  const activeStatus =
    candidate && (LANG_STATUSES as readonly string[]).includes(candidate)
      ? (candidate as LangStatus)
      : null;

  const rows = await listLangApplications(db, activeStatus ? { status: activeStatus } : undefined);

  return { props: { adminEmail, rows: rows as Row[], activeStatus } };
});

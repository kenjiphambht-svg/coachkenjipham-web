// ============================================================
// /admin/hat-mam — danh sách đơn Hạt Mầm.
//
// LƯU Ý QUAN TRỌNG: màn hình này CỐ Ý không hiển thị bất kỳ dữ liệu nào
// của trẻ. Truy vấn đằng sau (listHatMamOrders) không JOIN sang bảng
// hatmam_child_profiles. Muốn xem hồ sơ trẻ phải là một hành động riêng,
// có chủ đích — sẽ làm ở vòng sau khi có luồng sản xuất ấn phẩm.
// ============================================================

import type { GetServerSideProps } from 'next';

import AdminShell from '@/components/admin/AdminShell';
import {
  EmptyState,
  HATMAM_STATUS_VI,
  ScrollTable,
  StatusBadge,
  Td,
  Th,
  formatDate,
} from '@/components/admin/ui';
import { withAdmin } from '@/lib/auth/require-admin';
import { listHatMamOrders, type HatMamOrderRow } from '@/lib/db/queries';

export default function AdminHatMam({
  adminEmail,
  rows,
}: {
  adminEmail: string;
  rows: HatMamOrderRow[];
}) {
  return (
    <AdminShell title="Đơn Hạt Mầm" adminEmail={adminEmail}>
      <p className="font-sans text-[14px] text-e26-text-2 mb-4 max-w-[640px]">
        Màn hình này chỉ hiện thông tin đơn. Dữ liệu của bé nằm ở bảng riêng, có
        khoá riêng, và không được mở kèm danh sách.
      </p>

      {rows.length === 0 ? (
        <EmptyState>Chưa có đơn nào.</EmptyState>
      ) : (
        <ScrollTable>
          <thead>
            <tr>
              <Th>Mã đơn</Th>
              <Th>Gói</Th>
              <Th>Ba mẹ</Th>
              <Th>Liên hệ</Th>
              <Th>Trạng thái</Th>
              <Th>Ngày tạo</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <Td>
                  <span className="font-medium">{row.order_code}</span>
                </Td>
                <Td>{row.package}</Td>
                <Td>{row.parent_name}</Td>
                <Td className="break-all">{row.parent_contact}</Td>
                <Td>
                  <StatusBadge>{HATMAM_STATUS_VI[row.status]}</StatusBadge>
                </Td>
                <Td>{formatDate(row.created_at)}</Td>
              </tr>
            ))}
          </tbody>
        </ScrollTable>
      )}
    </AdminShell>
  );
}

export const getServerSideProps: GetServerSideProps = withAdmin(async (_ctx, { db, adminEmail }) => {
  const rows = await listHatMamOrders(db);
  return { props: { adminEmail, rows } };
});

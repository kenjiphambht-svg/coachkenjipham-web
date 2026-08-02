// ============================================================
// /admin/lien-he — danh sách tin nhắn liên hệ.
// B0: form công khai /lien-he CHƯA nối vào đây (vẫn dùng mailto như cũ).
// Bảng này hiện chỉ có dữ liệu giả từ seed.
// ============================================================

import type { GetServerSideProps } from 'next';

import AdminShell from '@/components/admin/AdminShell';
import { EmptyState, ScrollTable, StatusBadge, Td, Th, formatDate } from '@/components/admin/ui';
import { withAdmin } from '@/lib/auth/require-admin';
import { listContactMessages, type ContactMessageRow } from '@/lib/db/queries';

export default function AdminContact({
  adminEmail,
  rows,
}: {
  adminEmail: string;
  rows: ContactMessageRow[];
}) {
  return (
    <AdminShell title="Tin nhắn liên hệ" adminEmail={adminEmail}>
      <p className="font-sans text-[14px] text-e26-text-2 mb-4 max-w-[640px]">
        Form <code>/lien-he</code> trên trang khách vẫn đang gửi qua email như cũ —
        chưa nối vào bảng này. Đây là phần việc của vòng sau.
      </p>

      {rows.length === 0 ? (
        <EmptyState>Chưa có tin nhắn nào.</EmptyState>
      ) : (
        <ScrollTable>
          <thead>
            <tr>
              <Th>Tên</Th>
              <Th>Liên hệ</Th>
              <Th>Lời nhắn</Th>
              <Th>Trạng thái</Th>
              <Th>Ngày gửi</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <Td>{row.name}</Td>
                <Td className="break-all">{row.contact}</Td>
                <Td>
                  <span className="block max-w-[420px] whitespace-pre-line">{row.message}</span>
                </Td>
                <Td>
                  <StatusBadge>{row.is_handled ? 'Đã xử lý' : 'Chưa xử lý'}</StatusBadge>
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
  const rows = await listContactMessages(db);
  return { props: { adminEmail, rows } };
});

import Link from 'next/link';
import type { GetServerSideProps } from 'next';

import AdminShell from '@/components/admin/AdminShell';
import {
  Card,
  EmptyState,
  OperationalNotice,
  ReadinessBadge,
  ScrollTable,
  Td,
  Th,
  adminSecondaryButton,
  formatDate,
} from '@/components/admin/ui';
import { withAdmin } from '@/lib/auth/require-admin';
import { buildPublicationMock } from '@/lib/admin/operational';
import {
  getReleaseGates,
  listHatMamOrders,
  listPublications,
  type HatMamOrderRow,
  type PublicationRow,
  type ReleaseGateRow,
} from '@/lib/db/queries';

interface Props {
  adminEmail: string;
  orders: HatMamOrderRow[];
  publications: PublicationRow[];
  gates: ReleaseGateRow | null;
}

export default function AdminPublication({ adminEmail, orders, publications, gates }: Props) {
  const publicationByOrder = new Map(publications.map((publication) => [publication.order_id, publication]));

  return (
    <AdminShell title="Xuất bản riêng tư" adminEmail={adminEmail}>
      <OperationalNotice title="B4 Storage vẫn đang chặn phát hành thật">
        Giao diện cho phép Kenji review metadata, checksum và checklist bằng dữ liệu thử. Upload, phát hành, thu hồi và xóa object thật vẫn bị khóa kín.
      </OperationalNotice>

      <div className="grid md:grid-cols-3 gap-4 my-6">
        <Card title="Private Storage"><ReadinessBadge ready={gates?.private_storage_ready ?? false}>{gates?.private_storage_ready ? 'Sẵn sàng' : 'Chưa sẵn sàng'}</ReadinessBadge></Card>
        <Card title="Public activation"><ReadinessBadge ready={gates?.public_activation_enabled ?? false}>{gates?.public_activation_enabled ? 'Bật' : 'Tắt'}</ReadinessBadge></Card>
        <Card title="Publication metadata"><p className="font-serif text-3xl">{publications.length}</p></Card>
      </div>

      {orders.length === 0 ? (
        <EmptyState>Chưa có đơn Hạt Mầm thử để kiểm UX xuất bản.</EmptyState>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const publication = publicationByOrder.get(order.id);
            const mock = buildPublicationMock(order.order_code, order.package);
            return (
              <Card key={order.id} title={`${order.order_code} · ${order.package}`}>
                <div className="grid lg:grid-cols-[minmax(0,1fr)_300px] gap-5">
                  <div>
                    <p className="font-sans text-[14px]"><span className="text-e26-text-2">PDF kỳ vọng:</span> {mock.expectedFileName}</p>
                    <p className="font-sans text-[13px] text-e26-text-2 break-all mt-2">Checksum: {mock.contentSha256}</p>
                    <p className="font-sans text-[13px] leading-[1.7] text-e26-text-2 mt-3">{mock.checksumStatus}</p>
                    {publication && <p className="font-sans text-[13px] mt-3">Metadata thật (staging) tạo lúc: {formatDate(publication.created_at)}</p>}
                    <ul className="font-sans text-[14px] leading-[1.7] list-disc pl-5 mt-4">
                      {mock.reviewChecklist.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                  <div className="border border-e26-border bg-e26-cream p-4">
                    <p className="font-sans text-[14px] font-medium">{mock.readinessLabel}</p>
                    <p className="font-sans text-[13px] leading-[1.7] text-e26-text-2 mt-2">{mock.releaseNote}</p>
                    <button type="button" className={`${adminSecondaryButton} mt-4`} disabled>Duyệt ấn phẩm (đang khóa)</button>
                    <button type="button" className={`${adminSecondaryButton} mt-3`} disabled>Thu hồi (đang khóa)</button>
                    <button type="button" className={`${adminSecondaryButton} mt-3`} disabled>Xóa (đang khóa)</button>
                    <Link href={`/admin/hat-mam/${order.id}`} className="block font-sans text-[14px] underline underline-offset-4 mt-4 hover:text-e26-gold-deep">Xem hồ sơ được bảo vệ →</Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Card title="Metadata hiện có" >
        {publications.length === 0 ? <EmptyState>Chưa có metadata publication thật trong staging.</EmptyState> : (
          <ScrollTable>
            <thead><tr><Th>Publication ID</Th><Th>Order ID</Th><Th>Tạo lúc</Th><Th>Đã giao lúc</Th></tr></thead>
            <tbody>{publications.map((publication) => <tr key={publication.id}><Td className="break-all">{publication.id}</Td><Td className="break-all">{publication.order_id}</Td><Td>{formatDate(publication.created_at)}</Td><Td>{formatDate(publication.delivered_at)}</Td></tr>)}</tbody>
          </ScrollTable>
        )}
      </Card>
    </AdminShell>
  );
}

export const getServerSideProps: GetServerSideProps = withAdmin(async (_ctx, { db, adminEmail }) => {
  const [orders, publications, gates] = await Promise.all([listHatMamOrders(db), listPublications(db), getReleaseGates(db)]);
  return { props: { adminEmail, orders, publications, gates } };
});

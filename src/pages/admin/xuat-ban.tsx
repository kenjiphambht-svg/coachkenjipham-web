import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import type { GetServerSideProps } from 'next';

import AdminShell from '@/components/admin/AdminShell';
import {
  Card,
  EmptyState,
  OperationalNotice,
  ReadinessBadge,
  ScrollTable,
  StatusBadge,
  Td,
  Th,
  adminPrimaryButton,
  adminSecondaryButton,
  formatDate,
} from '@/components/admin/ui';
import { withAdmin } from '@/lib/auth/require-admin';
import {
  getReleaseGates,
  listAuditRows,
  listHatMamOrders,
  listHatMamSyntheticPublications,
  listPublications,
  type AuditRow,
  type HatMamOrderRow,
  type HatMamSyntheticPublicationRow,
  type PublicationRow,
  type ReleaseGateRow,
} from '@/lib/db/queries';

interface Props {
  adminEmail: string;
  orders: HatMamOrderRow[];
  publications: PublicationRow[];
  synthetic: HatMamSyntheticPublicationRow[];
  auditByOrder: Record<string, AuditRow[]>;
  gates: ReleaseGateRow | null;
}

type Action = 'request_revision' | 'approve' | 'revoke';

const labels: Record<Action, string> = {
  request_revision: 'Yêu cầu chỉnh sửa synthetic',
  approve: 'Duyệt synthetic',
  revoke: 'Thu hồi synthetic',
};

export default function AdminPublication({ adminEmail, orders, publications, synthetic, auditByOrder, gates }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const run = async (orderId: string, action: Action) => {
    if (!window.confirm(`${labels[action]}? Đây là thao tác synthetic, không gọi Storage.`)) return;
    setBusy(`${orderId}:${action}`); setMessage(null);
    try {
      const response = await fetch(`/api/admin/hat-mam/${orderId}/synthetic-publication`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action }),
      });
      const body = await response.json();
      if (!response.ok || !body.ok) { setMessage(body?.error?.message ?? 'Chưa cập nhật được workflow synthetic.'); return; }
      setMessage(`Đã ghi ${labels[action].toLowerCase()} vào audit synthetic.`);
      router.replace(router.asPath);
    } catch { setMessage('Mất kết nối. Hãy thử lại.'); }
    finally { setBusy(null); }
  };

  return (
    <AdminShell title="Xuất bản riêng tư" adminEmail={adminEmail}>
      <OperationalNotice title="Workflow thao tác được — nhưng chỉ là synthetic">
        Có thể duyệt, yêu cầu chỉnh sửa, duyệt lại và thu hồi metadata synthetic. Không upload, phát hành, thu hồi hay xóa bất kỳ Storage object thật nào.
      </OperationalNotice>

      <div className="grid md:grid-cols-3 gap-4 my-6">
        <Card title="Private Storage"><ReadinessBadge ready={gates?.private_storage_ready ?? false}>{gates?.private_storage_ready ? 'Sẵn sàng' : 'OFF · B4 chưa đạt'}</ReadinessBadge></Card>
        <Card title="Public activation"><ReadinessBadge ready={gates?.public_activation_enabled ?? false}>{gates?.public_activation_enabled ? 'Bật' : 'OFF'}</ReadinessBadge></Card>
        <Card title="Synthetic review"><p className="font-serif text-3xl">{synthetic.length}</p></Card>
      </div>

      {message && <p className="font-sans text-[14px] mb-4" role="status">{message}</p>}
      {synthetic.length === 0 ? <EmptyState>Chưa có fixture publication synthetic.</EmptyState> : (
        <div className="space-y-4">
          {synthetic.map((row) => {
            const order = orders.find((candidate) => candidate.id === row.order_id);
            if (!order) return null;
            const audit = auditByOrder[order.id] ?? [];
            const actionKeys: Action[] = row.status === 'approved'
              ? ['request_revision', 'revoke']
              : row.status === 'revoked'
                ? []
                : row.status === 'revision_requested'
                  ? ['approve']
                  : ['request_revision', 'approve'];
            return <Card key={order.id} title={`${order.order_code} · publication synthetic`}>
              <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-5">
                <div className="font-sans text-[14px] leading-[1.7]">
                  <p><span className="text-e26-text-2">Trạng thái review:</span> <StatusBadge>{row.status}</StatusBadge></p>
                  <p className="mt-2"><span className="text-e26-text-2">Checksum metadata:</span> <span className="break-all">{row.checksum_sha256}</span></p>
                  <p><span className="text-e26-text-2">Metadata:</span> synthetic=true · package={String(row.metadata.package ?? order.package)}</p>
                  {row.revision_reason && <p><span className="text-e26-text-2">Revision:</span> {row.revision_reason}</p>}
                  <p className="text-e26-text-2 mt-3">Không có object path, signed URL hay child PII. B4 vẫn chặn delivery thật.</p>
                  <div className="mt-4 border-t border-e26-border pt-3">
                    <p className="font-medium">Synthetic audit history</p>
                    {audit.length === 0 ? <p className="text-e26-text-2 text-[13px]">Chưa có thao tác.</p> : audit.map((item) => <p key={item.id} className="text-[13px]">{item.action} · {formatDate(item.created_at)}</p>)}
                  </div>
                </div>
                <div className="border border-e26-border bg-e26-cream p-4">
                  <p className="font-sans text-[13px] leading-[1.7] text-e26-text-2">Tất cả nút dưới đây chỉ ghi synthetic state + audit.</p>
                  {actionKeys.map((action) => <button key={action} type="button" className={`${action === 'approve' ? adminPrimaryButton : adminSecondaryButton} mt-3`} disabled={busy !== null} onClick={() => run(order.id, action)}>{busy === `${order.id}:${action}` ? 'Đang ghi…' : labels[action]}</button>)}
                  {row.status === 'revoked' && <p className="font-sans text-[13px] mt-3">Đã thu hồi synthetic. Không có object thật nào đã bị tác động.</p>}
                  <Link href={`/admin/hat-mam/${order.id}`} className="block font-sans text-[14px] underline underline-offset-4 mt-4 hover:text-e26-gold-deep">Xem order được bảo vệ →</Link>
                </div>
              </div>
            </Card>;
          })}
        </div>
      )}

      <Card title="Metadata publication thật (read-only)">
        {publications.length === 0 ? <EmptyState>Không có metadata publication thật được thao tác trong WP1.</EmptyState> : <ScrollTable><thead><tr><Th>Publication ID</Th><Th>Order ID</Th><Th>Tạo lúc</Th><Th>Đã giao lúc</Th></tr></thead><tbody>{publications.map((publication) => <tr key={publication.id}><Td className="break-all">{publication.id}</Td><Td className="break-all">{publication.order_id}</Td><Td>{formatDate(publication.created_at)}</Td><Td>{formatDate(publication.delivered_at)}</Td></tr>)}</tbody></ScrollTable>}
      </Card>
    </AdminShell>
  );
}

export const getServerSideProps: GetServerSideProps = withAdmin(async (_ctx, { db, adminEmail }) => {
  const [orders, publications, synthetic, gates] = await Promise.all([listHatMamOrders(db), listPublications(db), listHatMamSyntheticPublications(db), getReleaseGates(db)]);
  const audits = await Promise.all(synthetic.map((row) => listAuditRows(db, 'hatmam_synthetic_publication', row.order_id)));
  return { props: { adminEmail, orders, publications, synthetic, auditByOrder: Object.fromEntries(synthetic.map((row, index) => [row.order_id, audits[index]])), gates } };
});

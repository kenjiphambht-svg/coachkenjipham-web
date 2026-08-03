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
import { buildDeletionMock } from '@/lib/admin/operational';
import {
  getReleaseGates,
  listDeletionRequests,
  listRetentionRules,
  type DeletionRequestRow,
  type ReleaseGateRow,
  type RetentionRuleRow,
} from '@/lib/db/queries';

interface Props {
  adminEmail: string;
  requests: DeletionRequestRow[];
  rules: RetentionRuleRow[];
  gates: ReleaseGateRow | null;
}

const retentionLabels: Record<RetentionRuleRow['subject_type'], string> = {
  hatmam_raw_intake: 'Hồ sơ intake Hạt Mầm',
  hatmam_private_publication: 'Ấn phẩm riêng tư Hạt Mầm',
  lang_private_room: 'Phòng riêng Lặng',
};

export default function AdminDeletion({ adminEmail, requests, rules, gates }: Props) {
  const synthetic = buildDeletionMock('HM-SYNTHETIC-01');

  return (
    <AdminShell title="Xóa dữ liệu & retention" adminEmail={adminEmail}>
      <OperationalNotice title="Không có destructive execution trong staging UI">
        Mọi thao tác ở đây chỉ cho Kenji xem trước phạm vi, hậu quả và audit. Nút xác nhận xóa thật bị khóa cho đến khi B4 object + metadata deletion E2E được xác minh.
      </OperationalNotice>

      <div className="grid md:grid-cols-3 gap-4 my-6">
        <Card title="AAL2"><ReadinessBadge ready>Đã yêu cầu trước khi mở trang</ReadinessBadge></Card>
        <Card title="Deletion workflow"><ReadinessBadge ready={gates?.deletion_workflow_ready ?? false}>{gates?.deletion_workflow_ready ? 'Sẵn sàng' : 'Chưa sẵn sàng'}</ReadinessBadge></Card>
        <Card title="Yêu cầu mở"><p className="font-serif text-3xl">{requests.filter((request) => !['completed', 'rejected'].includes(request.status)).length}</p></Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-5">
        <Card title="Retention rules">
          <ul className="font-sans text-[14px] space-y-3">
            {rules.map((rule) => (
              <li key={rule.subject_type} className="flex items-start justify-between gap-4 border-b border-e26-border pb-3 last:border-0 last:pb-0">
                <span>{retentionLabels[rule.subject_type]}</span>
                <span className="text-right text-e26-text-2">{rule.retention_months} tháng<br />xóa sớm: {rule.early_deletion_available ? 'có' : 'không'}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card title="Preview synthetic">
          <p className="font-sans text-[14px] font-medium">{synthetic.requestLabel}</p>
          <p className="font-sans text-[13px] leading-[1.7] text-e26-text-2 mt-3">{synthetic.consequence}</p>
          <p className="font-sans text-[13px] leading-[1.7] text-e26-text-2 mt-2">{synthetic.retryState}</p>
          <p className="font-sans text-[13px] leading-[1.7] text-e26-text-2 mt-2">{synthetic.auditState}</p>
          <button type="button" className={`${adminPrimaryButton} mt-4`} disabled>Xác nhận xóa (đang khóa)</button>
          <button type="button" className={`${adminSecondaryButton} mt-3`} disabled>Xem affected records (synthetic)</button>
        </Card>
      </div>

      <Card title="Deletion request ledger">
        {requests.length === 0 ? (
          <EmptyState>Chưa có request thật trong staging. Preview synthetic phía trên dùng để kiểm UX.</EmptyState>
        ) : (
          <ScrollTable>
            <thead><tr><Th>Loại dữ liệu</Th><Th>Lý do</Th><Th>Trạng thái</Th><Th>Thử lại</Th><Th>Yêu cầu lúc</Th><Th>Audit</Th></tr></thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <Td>{request.subject_type}</Td>
                  <Td>{request.reason_code}</Td>
                  <Td><StatusBadge>{request.status}</StatusBadge></Td>
                  <Td>{request.execution_attempts}</Td>
                  <Td>{formatDate(request.requested_at)}</Td>
                  <Td>{request.last_error_code ?? (request.completed_at ? `Xong ${formatDate(request.completed_at)}` : 'Chưa chạy')}</Td>
                </tr>
              ))}
            </tbody>
          </ScrollTable>
        )}
      </Card>
    </AdminShell>
  );
}

export const getServerSideProps: GetServerSideProps = withAdmin(async (_ctx, { db, adminEmail }) => {
  const [requests, rules, gates] = await Promise.all([listDeletionRequests(db), listRetentionRules(db), getReleaseGates(db)]);
  return { props: { adminEmail, requests, rules, gates } };
});

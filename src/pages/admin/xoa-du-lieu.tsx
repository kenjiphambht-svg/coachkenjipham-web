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
  listDeletionRequests,
  listHatMamSyntheticDeletionRuns,
  listRetentionRules,
  type AuditRow,
  type DeletionRequestRow,
  type HatMamSyntheticDeletionRunRow,
  type ReleaseGateRow,
  type RetentionRuleRow,
} from '@/lib/db/queries';

interface Props {
  adminEmail: string;
  requests: DeletionRequestRow[];
  rules: RetentionRuleRow[];
  syntheticRuns: HatMamSyntheticDeletionRunRow[];
  auditByRequest: Record<string, AuditRow[]>;
  gates: ReleaseGateRow | null;
}

const retentionLabels: Record<RetentionRuleRow['subject_type'], string> = {
  hatmam_raw_intake: 'Hồ sơ intake Hạt Mầm',
  hatmam_private_publication: 'Ấn phẩm riêng tư Hạt Mầm',
  lang_private_room: 'Phòng riêng Lặng',
};
type Action = 'open' | 'confirm' | 'retry';

export default function AdminDeletion({ adminEmail, requests, rules, syntheticRuns, auditByRequest, gates }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const runByRequest = new Map(syntheticRuns.map((run) => [run.request_id, run]));
  const syntheticRequests = requests.filter((request) => request.execution_evidence?.source === 'wp1-synthetic-fixture');

  const execute = async (requestId: string, action: Action) => {
    const text = action === 'confirm'
      ? 'Xác nhận deletion synthetic? Hệ sẽ ghi FAIL-CLOSED, không gọi Storage hay SQL xóa.'
      : action === 'retry' ? 'Đưa workflow synthetic vào retry state?' : 'Mở affected-record preview synthetic?';
    if (!window.confirm(text)) return;
    setBusy(`${requestId}:${action}`); setResult(null);
    try {
      const response = await fetch(`/api/admin/xoa-du-lieu/${requestId}/synthetic-action`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action }),
      });
      const body = await response.json();
      if (!response.ok || !body.ok) { setResult(body?.error?.message ?? 'Chưa cập nhật được workflow synthetic.'); return; }
      setResult(action === 'confirm' ? 'Đúng như thiết kế: xác nhận đã trả về FAIL-CLOSED; không có dữ liệu hoặc object nào bị xóa.' : 'Đã ghi synthetic workflow và audit evidence.');
      router.replace(router.asPath);
    } catch { setResult('Mất kết nối. Hãy thử lại.'); }
    finally { setBusy(null); }
  };

  return (
    <AdminShell title="Xóa dữ liệu & retention" adminEmail={adminEmail}>
      <OperationalNotice title="Synthetic deletion có thể thao tác, nhưng luôn fail-closed">
        Founder có thể xem affected records, thứ tự object-before-metadata, xác nhận, retry và audit. Không có Storage delete hay SQL destructive trong luồng này.
      </OperationalNotice>
      <div className="grid md:grid-cols-3 gap-4 my-6">
        <Card title="AAL2"><ReadinessBadge ready>Đã yêu cầu trước khi mở trang</ReadinessBadge></Card>
        <Card title="Deletion workflow"><ReadinessBadge ready={gates?.deletion_workflow_ready ?? false}>{gates?.deletion_workflow_ready ? 'Sẵn sàng' : 'OFF · gate B4/B8 mở'}</ReadinessBadge></Card>
        <Card title="Synthetic requests"><p className="font-serif text-3xl">{syntheticRequests.length}</p></Card>
      </div>
      {result && <p className="font-sans text-[14px] mb-4" role="status">{result}</p>}

      <div className="grid lg:grid-cols-2 gap-4 mb-5">
        <Card title="Retention rules"><ul className="font-sans text-[14px] space-y-3">{rules.map((rule) => <li key={rule.subject_type} className="flex items-start justify-between gap-4 border-b border-e26-border pb-3 last:border-0 last:pb-0"><span>{retentionLabels[rule.subject_type]}</span><span className="text-right text-e26-text-2">{rule.retention_months} tháng<br />xóa sớm: {rule.early_deletion_available ? 'có' : 'không'}</span></li>)}</ul></Card>
        <Card title="Đúng thứ tự khi gate được đóng"><ol className="font-sans text-[14px] space-y-2 list-decimal pl-5"><li>Private Storage object</li><li>Publication metadata</li><li>Audit evidence không chứa PII</li></ol><p className="font-sans text-[13px] text-e26-text-2 mt-3">Trong correction pass, ba bước này chỉ hiển thị preview. Bước 1 và 2 tuyệt đối không được gọi.</p></Card>
      </div>

      {syntheticRequests.length === 0 ? <EmptyState>Chưa có deletion fixture synthetic.</EmptyState> : <div className="space-y-4 mb-5">{syntheticRequests.map((request) => {
        const run = runByRequest.get(request.id); const audit = auditByRequest[request.id] ?? [];
        return <Card key={request.id} title={`Deletion synthetic · ${request.reason_code}`}><div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-5"><div className="font-sans text-[14px] leading-[1.7]"><p><span className="text-e26-text-2">Run state:</span> <StatusBadge>{run?.status ?? 'chưa mở preview'}</StatusBadge></p><p><span className="text-e26-text-2">Kết quả gần nhất:</span> {run?.last_result ?? 'PREVIEW_ONLY'}</p><p><span className="text-e26-text-2">Attempts:</span> {run?.attempts ?? 0}</p><p className="font-medium mt-3">Affected records preview</p>{(run?.affected_records ?? ['synthetic publication metadata', 'synthetic deletion audit', 'parent-intake preview']).map((record) => <p key={record} className="text-[13px]">• {record}</p>)}<p className="font-medium mt-3">Execution order preview</p>{(run?.execution_order ?? ['private Storage object (NOT CALLED)', 'publication metadata (NOT CALLED)', 'audit evidence']).map((item, index) => <p key={item} className="text-[13px]">{index + 1}. {item}</p>)}<p className="font-medium mt-3">Synthetic audit evidence</p>{audit.length === 0 ? <p className="text-e26-text-2 text-[13px]">Chưa có thao tác.</p> : audit.map((item) => <p key={item.id} className="text-[13px]">{item.action} · {formatDate(item.created_at)}</p>)}</div><div className="border border-e26-border bg-e26-cream p-4"><p className="font-sans text-[13px] leading-[1.7] text-e26-text-2">Các nút chỉ cập nhật synthetic ledger.</p><button type="button" className={`${adminSecondaryButton} mt-3`} disabled={busy !== null} onClick={() => execute(request.id, 'open')}>{busy === `${request.id}:open` ? 'Đang mở…' : 'Mở affected-record preview'}</button><button type="button" className={`${adminPrimaryButton} mt-3`} disabled={busy !== null} onClick={() => execute(request.id, 'confirm')}>{busy === `${request.id}:confirm` ? 'Đang xác nhận…' : 'Xác nhận xóa synthetic'}</button><button type="button" className={`${adminSecondaryButton} mt-3`} disabled={busy !== null} onClick={() => execute(request.id, 'retry')}>{busy === `${request.id}:retry` ? 'Đang ghi…' : 'Đưa vào retry state'}</button></div></div></Card>;
      })}</div>}

      <Card title="Deletion request ledger (read-only)">{requests.length === 0 ? <EmptyState>Chưa có request.</EmptyState> : <ScrollTable><thead><tr><Th>Loại</Th><Th>Lý do</Th><Th>Trạng thái</Th><Th>Yêu cầu lúc</Th><Th>Execution</Th></tr></thead><tbody>{requests.map((request) => <tr key={request.id}><Td>{request.subject_type}</Td><Td>{request.reason_code}</Td><Td><StatusBadge>{request.status}</StatusBadge></Td><Td>{formatDate(request.requested_at)}</Td><Td>{request.last_error_code ?? 'Không chạy destructive'}</Td></tr>)}</tbody></ScrollTable>}</Card>
    </AdminShell>
  );
}

export const getServerSideProps: GetServerSideProps = withAdmin(async (_ctx, { db, adminEmail }) => {
  const [requests, rules, syntheticRuns, gates] = await Promise.all([listDeletionRequests(db), listRetentionRules(db), listHatMamSyntheticDeletionRuns(db), getReleaseGates(db)]);
  const synthetic = requests.filter((request) => request.execution_evidence?.source === 'wp1-synthetic-fixture');
  const audits = await Promise.all(synthetic.map((request) => listAuditRows(db, 'hatmam_synthetic_deletion', request.id)));
  return { props: { adminEmail, requests, rules, syntheticRuns, auditByRequest: Object.fromEntries(synthetic.map((request, index) => [request.id, audits[index]])), gates } };
});

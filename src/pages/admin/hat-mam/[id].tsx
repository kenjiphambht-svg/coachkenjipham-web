import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import type { GetServerSideProps } from 'next';

import AdminShell from '@/components/admin/AdminShell';
import {
  Card,
  OperationalNotice,
  ReadinessBadge,
  StatusBadge,
  adminPrimaryButton,
  adminSecondaryButton,
  formatDate,
} from '@/components/admin/ui';
import { withAdmin } from '@/lib/auth/require-admin';
import {
  buildDeletionMock,
  buildHatMamStates,
  buildPublicationMock,
  formatCurrencyVnd,
  getHatMamPackageInfo,
  isHatMamPaymentEvidenceEligible,
  paymentEvidenceFromRecord,
  statusTone,
} from '@/lib/admin/operational';
import {
  getChildProfile,
  getHatMamOrder,
  getHatMamPackageSnapshot,
  getHatMamPaymentEvidenceForOrder,
  getHatMamPaymentRequestForOrder,
  getHatMamSyntheticPublication,
  getLatestConsent,
  getPaymentsForSubject,
  getPublicationAsset,
  getPublicationForOrder,
  listAuditRows,
  type AuditRow,
  type HatMamOrderRow,
  type PaymentRow,
  type PublicationAssetRow,
  type PublicationRow,
  type PaymentRequestRow,
  type HatMamPaymentEvidenceRow,
  type HatMamSyntheticPublicationRow,
} from '@/lib/db/queries';

interface Props {
  adminEmail: string;
  order: HatMamOrderRow;
  childProfile: Record<string, unknown> | null;
  packageSnapshot: Record<string, unknown> | null;
  consent: Record<string, unknown> | null;
  payments: PaymentRow[];
  publication: PublicationRow | null;
  publicationAsset: PublicationAssetRow | null;
  paymentRequest: PaymentRequestRow | null;
  paymentEvidence: HatMamPaymentEvidenceRow | null;
  syntheticPublication: HatMamSyntheticPublicationRow | null;
  audit: AuditRow[];
}

type Action = 'issue_payment' | 'confirm_payment' | 'start_production' | 'submit_for_review' | 'request_revision' | 'mark_ready' | 'cancel';

const actionConfig: Partial<Record<HatMamOrderRow['status'], Array<{ action: Action; label: string; confirm: string }>>> = {
  submitted: [{ action: 'issue_payment', label: 'Mở bước thanh toán', confirm: 'Mở bước thanh toán cho đơn Hạt Mầm này?' }],
  awaiting_payment: [{ action: 'confirm_payment', label: 'Xác nhận thanh toán', confirm: 'Xác nhận Kenji đã kiểm tra payment report và receipt?' }],
  paid: [{ action: 'start_production', label: 'Bắt đầu sản xuất', confirm: 'Chuyển đơn sang đang sản xuất?' }],
  in_production: [{ action: 'submit_for_review', label: 'Đưa vào chờ Kenji duyệt', confirm: 'Đưa bản thảo vào tầng Kenji duyệt?' }],
  review_pending: [
    { action: 'request_revision', label: 'Yêu cầu chỉnh sửa', confirm: 'Ghi nhận cần chỉnh sửa và đưa đơn quay lại production?' },
    { action: 'mark_ready', label: 'Đánh dấu sẵn sàng', confirm: 'Xác nhận nội dung đã sẵn sàng, nhưng chưa giao file thật?' },
  ],
  revision_requested: [{ action: 'start_production', label: 'Quay lại sản xuất', confirm: 'Bắt đầu vòng chỉnh sửa?' }],
};

function valueOrDash(value: unknown) {
  return typeof value === 'string' && value.trim() ? value : '—';
}

export default function AdminHatMamDetail({
  adminEmail,
  order,
  childProfile,
  packageSnapshot,
  consent,
  payments,
  publication,
  publicationAsset,
  paymentRequest,
  paymentEvidence,
  syntheticPublication,
  audit,
}: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const packageInfo = getHatMamPackageInfo(order.package);
  const snapshotAmount = typeof packageSnapshot?.amount_vnd === 'number' ? packageSnapshot.amount_vnd : null;
  const snapshotName = valueOrDash(packageSnapshot?.package_name) === '—' ? packageInfo.name : valueOrDash(packageSnapshot?.package_name);
  const evidence = paymentEvidence && paymentRequest?.reported_transfer_at
    ? paymentEvidenceFromRecord({
      requestId: paymentRequest.id,
      receipt_file_name: paymentEvidence.receipt_file_name,
      receipt_sha256: paymentEvidence.receipt_sha256,
      reported_amount_vnd: paymentEvidence.reported_amount_vnd,
      transfer_reference: paymentEvidence.transfer_reference,
      reported_at: paymentRequest.reported_transfer_at,
      revoked_at: paymentRequest.revoked_at,
    })
    : null;
  const paymentEligible = isHatMamPaymentEvidenceEligible({
    expectedAmountVnd: snapshotAmount,
    expectedReference: `HATMAM ${order.order_code}`,
    paymentRequest,
    evidence: paymentEvidence,
  });
  const publicationMock = buildPublicationMock(order.order_code, order.package);
  const deletionMock = buildDeletionMock(order.order_code);
  const nextActions = actionConfig[order.status] ?? [];
  const productionStates = buildHatMamStates(order.status);

  const runAction = async (nextAction: NonNullable<typeof actionConfig[HatMamOrderRow['status']]>[number]) => {
    if (!window.confirm(nextAction.confirm)) return;
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/hat-mam/${order.id}/chuyen-trang-thai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: nextAction.action }),
      });
      const body = await response.json();
      if (!response.ok || !body.ok) {
        setError(body?.error?.message ?? 'Chưa cập nhật được. Hãy tải lại và thử lại.');
        return;
      }
      router.replace(router.asPath);
    } catch {
      setError('Mất kết nối. Hãy thử lại.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AdminShell title={`Hạt Mầm · ${order.order_code}`} adminEmail={adminEmail}>
      <div className="grid lg:grid-cols-[minmax(0,1fr)_360px] gap-5">
        <div className="space-y-4">
          <OperationalNotice title="Dữ liệu được bảo vệ">
            Hồ sơ trẻ chỉ mở trong trang chi tiết sau AAL2. Không sao chép dữ liệu trẻ vào URL, email, log hay ghi chú AI.
          </OperationalNotice>

          <Card title="Đơn & package snapshot">
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3 font-sans text-[14px]">
              <p><span className="text-e26-text-2">Mã đơn:</span> <span className="font-medium">{order.order_code}</span></p>
              <p><span className="text-e26-text-2">Trạng thái:</span> <StatusBadge>{order.status}</StatusBadge></p>
              <p><span className="text-e26-text-2">Gói snapshot:</span> {snapshotName}</p>
              <p><span className="text-e26-text-2">Giá snapshot:</span> {snapshotAmount === null ? '—' : formatCurrencyVnd(snapshotAmount)}</p>
              <p><span className="text-e26-text-2">Hạn giao thực tế:</span> {formatDate(order.delivery_due_at)}</p>
              <p><span className="text-e26-text-2">Hạn revision thực tế:</span> {formatDate(order.revision_deadline_at)}</p>
              <p><span className="text-e26-text-2">Tạo lúc:</span> {formatDate(order.created_at)}</p>
            </div>
            <p className="font-sans text-[13px] leading-[1.7] text-e26-text-2 mt-4">{packageInfo.scope}</p>
            {packageSnapshot && (<>
              <p className="font-sans text-[13px] leading-[1.7] text-e26-text-2 mt-2">
                Snapshot hệ thống: {valueOrDash(packageSnapshot.package_version)} · {valueOrDash(packageSnapshot.delivery_business_days)} ngày làm việc · {valueOrDash(packageSnapshot.revision_window_days)} ngày revision.
              </p>
              <p className="font-sans text-[13px] leading-[1.7] text-e26-text-2 mt-1">
                Retention snapshot: raw intake {valueOrDash(packageSnapshot.raw_intake_retention_months)} tháng · publication {valueOrDash(packageSnapshot.publication_retention_months)} tháng.
              </p>
            </>)}
            {order.delivery_due_at && new Date(order.delivery_due_at).getTime() < Date.now() && order.status !== 'ready' && (
              <p className="font-sans text-[13px] text-e26-gold-deep mt-3">Cảnh báo: đơn đã quá hạn giao theo snapshot và cần Kenji xem ngay.</p>
            )}
          </Card>

          <Card title="Consent & hồ sơ trẻ (mở có chủ đích)">
            <div className="grid md:grid-cols-2 gap-5">
              <div className="font-sans text-[14px] leading-[1.7]">
                <p className="font-medium mb-2">Consent</p>
                <p>Loại: {valueOrDash(consent?.consent_type)}</p>
                <p>Phiên bản: {valueOrDash(consent?.consent_version)}</p>
                <p>Đồng ý lúc: {formatDate(typeof consent?.granted_at === 'string' ? consent.granted_at : null)}</p>
              </div>
              <div className="font-sans text-[14px] leading-[1.7]">
                <p className="font-medium mb-2">Hồ sơ trẻ</p>
                <p>Tên gọi nội bộ: {valueOrDash(childProfile?.child_name)}</p>
                <p>Ngày sinh: {valueOrDash(childProfile?.birth_date)}</p>
                <p>Giờ sinh: {valueOrDash(childProfile?.birth_time)}</p>
                <p>Nơi sinh: {valueOrDash(childProfile?.birth_place)}</p>
              </div>
            </div>
            <div className="font-sans text-[14px] leading-[1.7] mt-4 border-t border-e26-border pt-4">
              <p className="text-e26-text-2">Bối cảnh gia đình</p>
              <p>{valueOrDash(childProfile?.family_context)}</p>
              <p className="text-e26-text-2 mt-3">Câu hỏi của ba mẹ</p>
              <p>{valueOrDash(childProfile?.parent_question)}</p>
            </div>
            <p className="font-sans text-[13px] text-e26-text-2 mt-4">Không đưa nội dung này vào kết luận cố định, chẩn đoán hay dự đoán về trẻ.</p>
          </Card>

          <Card title="Trạng thái sản xuất">
            <ol className="space-y-2">
              {productionStates.map((state) => (
                <li key={state.label} className={`border p-3 font-sans text-[14px] ${statusTone(state.state)}`}>
                  <p className="font-medium">{state.label}</p>
                  <p className="text-[13px] leading-[1.6] mt-1">{state.note}</p>
                </li>
              ))}
            </ol>
          </Card>

          <Card title="Audit history">
            {audit.length === 0 ? (
              <p className="font-sans text-[14px] text-e26-text-2">Chưa có audit record đọc được cho đơn này.</p>
            ) : (
              <ul className="font-sans text-[14px] space-y-3">
                {audit.map((row) => (
                  <li key={row.id} className="border-b border-e26-border pb-3 last:border-0 last:pb-0">
                    <p className="font-medium">{row.action}</p>
                    <p className="text-e26-text-2 text-[13px]">{row.actor} · {formatDate(row.created_at)}</p>
                    {row.reason && <p className="mt-1">{row.reason}</p>}
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div className="space-y-4">
          <Card title="Thanh toán">
            <p className="font-sans text-[14px] mb-3"><span className="text-e26-text-2">Kỳ vọng từ snapshot:</span> {snapshotAmount === null ? '—' : formatCurrencyVnd(snapshotAmount)}</p>
            {evidence ? <div className="border border-e26-border bg-e26-cream p-3 font-sans text-[13px] leading-[1.7]">
              <p className="font-medium">Receipt synthetic · {evidence.receiptFileName}</p>
              <p>Nội dung CK: <span className="font-medium">{evidence.transferReference}</span></p>
              <p>Số tiền báo: {formatCurrencyVnd(evidence.reportedAmountVnd)} · báo lúc {formatDate(evidence.reportedAt)}</p>
              <p className="text-e26-text-2 mt-2 break-all">SHA-256: {evidence.receiptSha256}</p>
              {evidence.revokedAt && <p className="text-e26-gold-deep">Request đã bị thu hồi: không thể xác nhận.</p>}
            </div> : <p className="font-sans text-[13px] leading-[1.7] text-e26-gold-deep">Chưa có receipt/evidence gắn với payment request này; nút xác nhận sẽ bị server từ chối.</p>}
            <div className="mt-4 font-sans text-[13px] text-e26-text-2">
              {payments.length === 0 ? 'Chưa có payment record.' : `${payments.length} payment record · mới nhất: ${payments[0].status}`}
            </div>
          </Card>

          <Card title="Hành động của Kenji">
            {error && <p className="font-sans text-[13px] text-e26-gold-deep mb-3" role="alert">{error}</p>}
            {nextActions.length > 0 ? (
              <div className="space-y-3">{nextActions.map((nextAction) => (
                <button key={nextAction.action} className={adminPrimaryButton} disabled={busy || (nextAction.action === 'confirm_payment' && !paymentEligible)} onClick={() => runAction(nextAction)}>
                  {busy ? 'Đang lưu…' : nextAction.label}
                </button>
              ))}</div>
            ) : (
              <p className="font-sans text-[14px] leading-[1.7] text-e26-text-2">Đơn đã sẵn sàng. Delivery thật vẫn bị B4/private Storage chặn; không có nút giao file.</p>
            )}
            <Link href="/admin/thanh-toan" className={`${adminSecondaryButton} inline-block text-center mt-3`}>
              Xem tất cả thanh toán
            </Link>
          </Card>

          <Card title="Publication · fail-closed">
            <ReadinessBadge ready={false}>{publicationMock.readinessLabel}</ReadinessBadge>
            <p className="font-sans text-[13px] leading-[1.7] mt-3">File kỳ vọng: {publicationMock.expectedFileName}</p>
            <p className="font-sans text-[12px] break-all text-e26-text-2 mt-2">{publicationAsset?.content_sha256 ?? publicationMock.contentSha256}</p>
            <p className="font-sans text-[13px] leading-[1.7] text-e26-text-2 mt-3">{publicationMock.releaseNote}</p>
            {syntheticPublication && <p className="font-sans text-[13px] mt-3">Review synthetic: <span className="font-medium">{syntheticPublication.status}</span> · cập nhật {formatDate(syntheticPublication.updated_at)}</p>}
            {publication && <p className="font-sans text-[13px] mt-3">Có metadata publication tạo lúc {formatDate(publication.created_at)}.</p>}
            <Link href="/admin/xuat-ban" className="inline-block font-sans text-[14px] underline underline-offset-4 mt-4 hover:text-e26-gold-deep">Mở checklist ấn phẩm →</Link>
          </Card>

          <Card title="Retention & deletion · fail-closed">
            <p className="font-sans text-[14px] font-medium">{deletionMock.requestLabel}</p>
            <p className="font-sans text-[13px] leading-[1.7] text-e26-text-2 mt-2">{deletionMock.consequence}</p>
            <p className="font-sans text-[13px] leading-[1.7] text-e26-text-2 mt-2">{deletionMock.retryState}</p>
            <p className="font-sans text-[13px] leading-[1.7] text-e26-text-2 mt-2">{deletionMock.auditState}</p>
            <Link href="/admin/xoa-du-lieu" className="inline-block font-sans text-[14px] underline underline-offset-4 mt-4 hover:text-e26-gold-deep">Xem trước việc xóa →</Link>
          </Card>
        </div>
      </div>
    </AdminShell>
  );
}

export const getServerSideProps: GetServerSideProps = withAdmin(async (ctx, { db, adminEmail }) => {
  const id = ctx.params?.id;
  if (typeof id !== 'string') return { notFound: true };
  const order = await getHatMamOrder(db, id);
  if (!order) return { notFound: true };

  const [childProfile, packageSnapshot, consent, payments, publication, paymentRequest, evidenceRows, syntheticPublication, audit] = await Promise.all([
    getChildProfile(db, id),
    getHatMamPackageSnapshot(db, id),
    getLatestConsent(db, 'hatmam', id),
    getPaymentsForSubject(db, 'hatmam', id),
    getPublicationForOrder(db, id),
    getHatMamPaymentRequestForOrder(db, id),
    getHatMamPaymentEvidenceForOrder(db, id),
    getHatMamSyntheticPublication(db, id),
    listAuditRows(db, 'hatmam_order', id),
  ]);
  const publicationAsset = publication ? await getPublicationAsset(db, publication.id) : null;

  return {
    props: {
      adminEmail,
      order,
      childProfile: childProfile ?? null,
      packageSnapshot: packageSnapshot ?? null,
      consent: consent ?? null,
      payments,
      publication,
      publicationAsset,
      paymentRequest,
      paymentEvidence: evidenceRows[0] ?? null,
      syntheticPublication,
      audit,
    },
  };
});

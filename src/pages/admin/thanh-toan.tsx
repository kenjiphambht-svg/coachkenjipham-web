import Link from 'next/link';
import type { GetServerSideProps } from 'next';

import AdminShell from '@/components/admin/AdminShell';
import {
  Card,
  EmptyState,
  OperationalNotice,
  ScrollTable,
  StatusBadge,
  Td,
  Th,
  formatDate,
} from '@/components/admin/ui';
import { withAdmin } from '@/lib/auth/require-admin';
import {
  buildReceiptPreview,
  formatCurrencyVnd,
  HATMAM_HM01_PRICE_VND,
  HATMAM_HM02_PRICE_VND,
  isHm02Package,
  LANG_PRICE_VND,
} from '@/lib/admin/operational';
import {
  listHatMamOrders,
  listHatMamPaymentRequests,
  listLangApplications,
  listLangPaymentRequests,
  listPayments,
  type HatMamOrderRow,
  type LangApplicationRow,
  type PaymentRequestRow,
  type PaymentRow,
} from '@/lib/db/queries';

interface Props {
  adminEmail: string;
  lang: Array<Pick<LangApplicationRow, 'id' | 'order_code' | 'status'>>;
  hatmam: HatMamOrderRow[];
  langRequests: PaymentRequestRow[];
  hatmamRequests: PaymentRequestRow[];
  payments: PaymentRow[];
}

export default function AdminPayments({
  adminEmail,
  lang,
  hatmam,
  langRequests,
  hatmamRequests,
  payments,
}: Props) {
  const langById = new Map(lang.map((row) => [row.id, row]));
  const hatmamById = new Map(hatmam.map((row) => [row.id, row]));
  const reportedLang = langRequests.filter((row) => row.reported_transfer_at && !row.revoked_at);
  const reportedHatMam = hatmamRequests.filter((row) => row.reported_transfer_at && !row.revoked_at);
  const pending = payments.filter((row) => row.status === 'pending');

  return (
    <AdminShell title="Thanh toán" adminEmail={adminEmail}>
      <OperationalNotice title="Kenji xác nhận tiền vào bằng tay">
        Màn hình này không tự xác nhận ngân hàng. Biên nhận dưới đây là dữ liệu thử; số tài khoản không nằm trong Git, log hay giao diện staging.
      </OperationalNotice>

      <div className="grid md:grid-cols-3 gap-4 my-6">
        <Card title="Đã báo chuyển · Lặng"><p className="font-serif text-3xl">{reportedLang.length}</p></Card>
        <Card title="Đã báo chuyển · Hạt Mầm"><p className="font-serif text-3xl">{reportedHatMam.length}</p></Card>
        <Card title="Payment record chờ xử lý"><p className="font-serif text-3xl">{pending.length}</p></Card>
      </div>

      <div className="space-y-5">
        <Card title="Lặng · chờ Kenji review">
          {reportedLang.length === 0 ? (
            <EmptyState>Chưa có phiếu Lặng nào báo đã chuyển.</EmptyState>
          ) : (
            <ScrollTable>
              <thead><tr><Th>Mã đơn</Th><Th>Biên nhận thử</Th><Th>Số tiền</Th><Th>Trạng thái</Th><Th>&nbsp;</Th></tr></thead>
              <tbody>
                {reportedLang.map((request) => {
                  const row = request.application_id ? langById.get(request.application_id) : undefined;
                  if (!row) return null;
                  const receipt = buildReceiptPreview('lang', row.order_code, LANG_PRICE_VND);
                  return (
                    <tr key={request.id}>
                      <Td>{row.order_code}</Td>
                      <Td><span className="block max-w-[240px]">{receipt.fileName}</span><span className="text-[12px] text-e26-text-2">{receipt.transferReference}</span></Td>
                      <Td>{formatCurrencyVnd(receipt.amountVnd)}</Td>
                      <Td><StatusBadge>{row.status}</StatusBadge></Td>
                      <Td><Link href={`/admin/lang/${row.id}`} className="underline underline-offset-4 hover:text-e26-gold-deep">Xem & xác nhận</Link></Td>
                    </tr>
                  );
                })}
              </tbody>
            </ScrollTable>
          )}
        </Card>

        <Card title="Hạt Mầm · chờ Kenji review">
          {reportedHatMam.length === 0 ? (
            <EmptyState>Chưa có phiếu Hạt Mầm nào báo đã chuyển.</EmptyState>
          ) : (
            <ScrollTable>
              <thead><tr><Th>Mã đơn</Th><Th>Biên nhận thử</Th><Th>Số tiền</Th><Th>Trạng thái</Th><Th>&nbsp;</Th></tr></thead>
              <tbody>
                {reportedHatMam.map((request) => {
                  const row = request.order_id ? hatmamById.get(request.order_id) : undefined;
                  if (!row) return null;
                  const receipt = buildReceiptPreview('hatmam', row.order_code, isHm02Package(row.package) ? HATMAM_HM02_PRICE_VND : HATMAM_HM01_PRICE_VND);
                  return (
                    <tr key={request.id}>
                      <Td>{row.order_code}</Td>
                      <Td><span className="block max-w-[240px]">{receipt.fileName}</span><span className="text-[12px] text-e26-text-2">{receipt.transferReference}</span></Td>
                      <Td>{formatCurrencyVnd(receipt.amountVnd)}</Td>
                      <Td><StatusBadge>{row.status}</StatusBadge></Td>
                      <Td><Link href={`/admin/hat-mam/${row.id}`} className="underline underline-offset-4 hover:text-e26-gold-deep">Xem & xác nhận</Link></Td>
                    </tr>
                  );
                })}
              </tbody>
            </ScrollTable>
          )}
        </Card>

        <Card title="Audit thanh toán">
          {payments.length === 0 ? (
            <EmptyState>Chưa có payment record trong staging.</EmptyState>
          ) : (
            <ScrollTable>
              <thead><tr><Th>Loại</Th><Th>Số tiền</Th><Th>Trạng thái</Th><Th>Xác nhận lúc</Th><Th>Tạo lúc</Th></tr></thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <Td>{payment.subject === 'lang' ? 'Lặng' : 'Hạt Mầm'}</Td>
                    <Td>{formatCurrencyVnd(payment.amount_vnd)}</Td>
                    <Td><StatusBadge>{payment.status}</StatusBadge></Td>
                    <Td>{formatDate(payment.confirmed_at)}</Td>
                    <Td>{formatDate(payment.created_at)}</Td>
                  </tr>
                ))}
              </tbody>
            </ScrollTable>
          )}
        </Card>
      </div>
    </AdminShell>
  );
}

export const getServerSideProps: GetServerSideProps = withAdmin(async (_ctx, { db, adminEmail }) => {
  const [lang, hatmam, langRequests, hatmamRequests, payments] = await Promise.all([
    listLangApplications(db),
    listHatMamOrders(db),
    listLangPaymentRequests(db),
    listHatMamPaymentRequests(db),
    listPayments(db),
  ]);
  return { props: { adminEmail, lang, hatmam, langRequests, hatmamRequests, payments } };
});

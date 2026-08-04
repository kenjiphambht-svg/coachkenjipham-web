import type { GetServerSideProps } from 'next';

import AdminShell from '@/components/admin/AdminShell';
import { Card, OperationalNotice, ReadinessBadge } from '@/components/admin/ui';
import { withAdmin } from '@/lib/auth/require-admin';
import { getReleaseGates, getLangStatusCounts, getHatMamStatusCounts, listDeletionRequests, listHatMamPaymentRequests } from '@/lib/db/queries';
import type { HatMamStatus, LangStatus } from '@/lib/domain/states';

type Props = {
  adminEmail: string;
  lang: Partial<Record<LangStatus, number>>;
  hatmam: Partial<Record<HatMamStatus, number>>;
  reportedPayments: number;
  deletionOpen: number;
  gates: { privateStorageReady: boolean; deletionWorkflowReady: boolean; publicActivationEnabled: boolean };
};

export default function LaunchCoreAdmin({ adminEmail, lang, hatmam, reportedPayments, deletionOpen, gates }: Props) {
  return <AdminShell title="Launch Core" adminEmail={adminEmail}>
    <OperationalNotice title="Ba vertical slice ưu tiên — staging/internal only">
      Lặng, Hạt Mầm và Private Reading Room dùng dữ liệu synthetic khi test. Không provider, public activation hoặc dữ liệu khách nào được bật từ màn hình này.
    </OperationalNotice>
    <div className="grid lg:grid-cols-3 gap-4">
      <Card title="1 · Lặng backend">
        <p className="font-sans text-[14px] text-e26-text-2">Hồ sơ chờ Founder: {(lang.submitted ?? 0) + (lang.under_review ?? 0)} · Payment đã báo: {reportedPayments}</p>
        <ul className="mt-4 font-sans text-[13px] space-y-2 text-e26-text-2"><li>Human decision: bắt buộc</li><li>Booking: chỉ đủ điều kiện sau payment confirmed</li><li>Cal.com: OFF, fail-closed</li></ul>
      </Card>
      <Card title="2 · Hạt Mầm backend">
        <p className="font-sans text-[14px] text-e26-text-2">Production: {(hatmam.in_production ?? 0) + (hatmam.review_pending ?? 0)} · Revision: {hatmam.revision_requested ?? 0}</p>
        <ul className="mt-4 font-sans text-[13px] space-y-2 text-e26-text-2"><li>Consent + immutable snapshot trước payment</li><li>Founder approval trước entitlement</li><li>Không legacy KIDMAP, không dữ liệu trẻ trong URL</li></ul>
      </Card>
      <Card title="3 · Private Reading Room">
        <p className="font-sans text-[14px] text-e26-text-2">Entitlement, versioning và authorization foundation đã được thiết kế; route khách chưa được tạo.</p>
        <ul className="mt-4 font-sans text-[13px] space-y-2 text-e26-text-2"><li>Storage/PDF: provider adapter OFF</li><li>Deletion chờ xử lý: {deletionOpen}</li><li>Direct object access: phải deny</li></ul>
      </Card>
    </div>
    <div className="mt-4"><Card title="Release gates">
      <div className="grid sm:grid-cols-3 gap-3 font-sans text-[14px]">
        <div>Private Storage <ReadinessBadge ready={gates.privateStorageReady}>{gates.privateStorageReady ? 'Sẵn sàng' : 'OFF'}</ReadinessBadge></div>
        <div>Deletion E2E <ReadinessBadge ready={gates.deletionWorkflowReady}>{gates.deletionWorkflowReady ? 'Sẵn sàng' : 'OFF'}</ReadinessBadge></div>
        <div>Public activation <ReadinessBadge ready={gates.publicActivationEnabled}>{gates.publicActivationEnabled ? 'Bật' : 'OFF'}</ReadinessBadge></div>
      </div>
      <p className="font-sans text-[13px] text-e26-text-2 mt-4">Auth/AAL/RLS canonical staging evidence, Security Advisor, Resend, Cal.com, real Storage and real deletion remain open gates.</p>
    </Card></div>
  </AdminShell>;
}

export const getServerSideProps: GetServerSideProps = withAdmin(async (_ctx, { db, adminEmail }) => {
  const [lang, hatmam, requests, deletions, gates] = await Promise.all([getLangStatusCounts(db), getHatMamStatusCounts(db), listHatMamPaymentRequests(db), listDeletionRequests(db), getReleaseGates(db)]);
  return { props: { adminEmail, lang, hatmam, reportedPayments: requests.filter((row) => row.reported_transfer_at && !row.revoked_at).length, deletionOpen: deletions.filter((row) => !['completed', 'rejected'].includes(row.status)).length, gates: { privateStorageReady: gates?.private_storage_ready ?? false, deletionWorkflowReady: gates?.deletion_workflow_ready ?? false, publicActivationEnabled: gates?.public_activation_enabled ?? false } } };
});

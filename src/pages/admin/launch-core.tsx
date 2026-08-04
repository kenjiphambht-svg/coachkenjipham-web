import type { GetServerSideProps } from 'next';

import AdminShell from '@/components/admin/AdminShell';
import { Card, OperationalNotice, ReadinessBadge } from '@/components/admin/ui';
import { withAdmin } from '@/lib/auth/require-admin';
import { getReleaseGates, getLangStatusCounts, getHatMamStatusCounts, listDeletionRequests, listHatMamPaymentRequests } from '@/lib/db/queries';
import type { HatMamStatus, LangStatus } from '@/lib/domain/states';

const technicalEvidence = [
  ['Migrations', 'STAGING VERIFIED', '0001–0027 đồng bộ; forward-only, có manual rollback.'],
  ['RLS & Auth', 'STAGING VERIFIED', 'Anon + non-admin + Admin AAL1 bị chặn; Admin AAL2 mới được phép.'],
  ['Private Storage', 'OFF', 'Không bucket/object/signed download thật. WP4 mới được phép kết nối.'],
  ['PDF A5', 'OFF', 'Chỉ có contract checksum + authorization; chưa sinh PDF thật.'],
  ['Resend', 'OFF', 'Không có provider connection hay email khách.'],
  ['Cal.com', 'OFF', 'Booking chỉ đủ điều kiện sau payment; provider không được gọi.'],
  ['Deletion', 'FAIL-CLOSED', 'Object-first contract; chưa có real object/deletion E2E.'],
  ['Public activation', 'OFF', 'Không public route, indexing hoặc customer delivery.'],
] as const;

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
        <ul className="mt-4 font-sans text-[13px] space-y-2 text-e26-text-2"><li>Human decision: bắt buộc, rule summary không được quyết định phù hợp.</li><li>Payment: snapshot + evidence + transfer reference mới được xác nhận nguyên tử.</li><li>Booking: chỉ đủ điều kiện sau payment confirmed; Cal.com vẫn OFF.</li></ul>
      </Card>
      <Card title="2 · Hạt Mầm backend">
        <p className="font-sans text-[14px] text-e26-text-2">Production: {(hatmam.in_production ?? 0) + (hatmam.review_pending ?? 0)} · Revision: {hatmam.revision_requested ?? 0}</p>
        <ul className="mt-4 font-sans text-[13px] space-y-2 text-e26-text-2"><li>Consent + immutable snapshot trước payment</li><li>Founder approval trước entitlement</li><li>Không legacy KIDMAP, không dữ liệu trẻ trong URL</li></ul>
      </Card>
      <Card title="3 · Private Reading Room">
        <p className="font-sans text-[14px] text-e26-text-2">Verified identity + active entitlement + approved version là điều kiện bắt buộc; route khách chưa được tạo.</p>
        <ul className="mt-4 font-sans text-[13px] space-y-2 text-e26-text-2"><li>Token/ngẫu nhiên không phải quyền truy cập.</li><li>Storage/PDF adapter OFF; direct object access phải deny.</li><li>Deletion chờ xử lý: {deletionOpen} · metadata-first luôn bị chặn.</li></ul>
      </Card>
    </div>
    <div className="mt-4"><Card title="Release gates hiện tại">
      <div className="grid sm:grid-cols-3 gap-3 font-sans text-[14px]">
        <div>Private Storage <ReadinessBadge ready={gates.privateStorageReady}>{gates.privateStorageReady ? 'Sẵn sàng' : 'OFF'}</ReadinessBadge></div>
        <div>Deletion E2E <ReadinessBadge ready={gates.deletionWorkflowReady}>{gates.deletionWorkflowReady ? 'Sẵn sàng' : 'OFF'}</ReadinessBadge></div>
        <div>Public activation <ReadinessBadge ready={gates.publicActivationEnabled}>{gates.publicActivationEnabled ? 'Bật' : 'OFF'}</ReadinessBadge></div>
      </div>
      <p className="font-sans text-[13px] text-e26-text-2 mt-4">Security Advisor mới, real Storage/signed download, real deletion, Resend và Cal.com vẫn là open gates. Không có external gate nào được gọi là ready.</p>
    </Card></div>
    <div className="mt-4"><Card title="Evidence map · Founder đọc nhanh">
      <div className="grid md:grid-cols-2 gap-3">
        {technicalEvidence.map(([label, state, note]) => (
          <div key={label} className="border border-e26-border p-3 font-sans text-[13px] leading-[1.6]">
            <div className="flex items-center justify-between gap-2"><span className="font-medium">{label}</span><ReadinessBadge ready={state === 'STAGING VERIFIED'}>{state}</ReadinessBadge></div>
            <p className="text-e26-text-2 mt-2">{note}</p>
          </div>
        ))}
      </div>
      <p className="font-sans text-[13px] text-e26-text-2 mt-4">WP4 sẽ chỉ xử lý provider connection và real E2E gates sau Founder authorization riêng; WP3 không bật customer delivery.</p>
    </Card></div>
  </AdminShell>;
}

export const getServerSideProps: GetServerSideProps = withAdmin(async (ctx, { db, adminEmail }) => {
  ctx.res.setHeader('Cache-Control', 'no-store');
  ctx.res.setHeader('Referrer-Policy', 'no-referrer');
  const [lang, hatmam, requests, deletions, gates] = await Promise.all([getLangStatusCounts(db), getHatMamStatusCounts(db), listHatMamPaymentRequests(db), listDeletionRequests(db), getReleaseGates(db)]);
  return { props: { adminEmail, lang, hatmam, reportedPayments: requests.filter((row) => row.reported_transfer_at && !row.revoked_at).length, deletionOpen: deletions.filter((row) => !['completed', 'rejected'].includes(row.status)).length, gates: { privateStorageReady: gates?.private_storage_ready ?? false, deletionWorkflowReady: gates?.deletion_workflow_ready ?? false, publicActivationEnabled: gates?.public_activation_enabled ?? false } } };
});

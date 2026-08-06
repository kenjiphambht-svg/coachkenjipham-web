import type { GetServerSideProps } from 'next';

import AdminShell from '@/components/admin/AdminShell';
import {
  FounderPreviewLinks,
  PreviewNotice,
  TodayPreview,
} from '@/components/admin/wp3-5/FounderPreview';
import { withAdmin } from '@/lib/auth/require-admin';

export default function FounderTodayPreviewPage({ adminEmail }: { adminEmail: string }) {
  return (
    <AdminShell title="Hôm nay · WP3.5-A" adminEmail={adminEmail}>
      <PreviewNotice />
      <FounderPreviewLinks />
      <TodayPreview />
    </AdminShell>
  );
}

export const getServerSideProps: GetServerSideProps = withAdmin(async (_ctx, { adminEmail }) => ({
  props: { adminEmail },
}));

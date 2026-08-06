import type { GetServerSideProps } from 'next';

import AdminShell from '@/components/admin/AdminShell';
import { JourneyPreview, PreviewNotice } from '@/components/admin/wp3-5/FounderPreview';
import { withAdmin } from '@/lib/auth/require-admin';

export default function JourneyPage({ adminEmail }: { adminEmail: string }) {
  return (
    <AdminShell title="Hành trình" adminEmail={adminEmail}>
      <PreviewNotice />
      <JourneyPreview />
    </AdminShell>
  );
}

export const getServerSideProps: GetServerSideProps = withAdmin(async (_ctx, { adminEmail }) => ({
  props: { adminEmail },
}));

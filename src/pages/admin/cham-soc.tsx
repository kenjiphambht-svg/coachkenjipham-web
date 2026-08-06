import type { GetServerSideProps } from 'next';

import AdminShell from '@/components/admin/AdminShell';
import { CarePreview, PreviewNotice } from '@/components/admin/wp3-5/FounderPreview';
import { withAdmin } from '@/lib/auth/require-admin';

export default function CarePage({ adminEmail }: { adminEmail: string }) {
  return (
    <AdminShell title="Chăm sóc & Phục hồi" adminEmail={adminEmail}>
      <PreviewNotice />
      <CarePreview />
    </AdminShell>
  );
}

export const getServerSideProps: GetServerSideProps = withAdmin(async (_ctx, { adminEmail }) => ({
  props: { adminEmail },
}));

import type { GetServerSideProps } from 'next';

import AdminShell from '@/components/admin/AdminShell';
import { PreviewNotice, RelationshipPreview } from '@/components/admin/wp3-5/FounderPreview';
import { withAdmin } from '@/lib/auth/require-admin';

export default function RelationshipPage({ adminEmail }: { adminEmail: string }) {
  return (
    <AdminShell title="Quan hệ" adminEmail={adminEmail}>
      <PreviewNotice />
      <RelationshipPreview />
    </AdminShell>
  );
}

export const getServerSideProps: GetServerSideProps = withAdmin(async (_ctx, { adminEmail }) => ({
  props: { adminEmail },
}));

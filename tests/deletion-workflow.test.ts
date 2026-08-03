import { describe, expect, it } from 'vitest';
import { executeApprovedDeletion, MockDeletionProvider } from '@/lib/deletion/workflow';

const approved = {
  id: 'request-1',
  subjectType: 'hatmam_publication' as const,
  subjectId: '00000000-0000-4000-8000-000000000001',
  status: 'approved' as const,
  privateObjectPath: '00000000-0000-4000-8000-000000000001.pdf',
};

describe('B8 deletion workflow', () => {
  it('fails closed until an admin-approved request exists', async () => {
    const provider = new MockDeletionProvider();
    await expect(executeApprovedDeletion({ ...approved, status: 'identity_verified' }, provider)).rejects.toThrow('DELETION_NOT_APPROVED');
    expect(provider.operations).toEqual([]);
  });

  it('removes the private object before metadata and is retry-safe', async () => {
    const provider = new MockDeletionProvider();
    await executeApprovedDeletion(approved, provider);
    await executeApprovedDeletion(approved, provider);
    expect(provider.operations).toEqual([
      'object:00000000-0000-4000-8000-000000000001.pdf',
      'metadata:hatmam_publication:00000000-0000-4000-8000-000000000001',
    ]);
  });

  it('refuses object paths that could contain traversal or query data', async () => {
    const provider = new MockDeletionProvider();
    await expect(executeApprovedDeletion({ ...approved, privateObjectPath: '../child-name.pdf' }, provider)).rejects.toThrow('UNSAFE_PRIVATE_OBJECT_PATH');
    expect(provider.operations).toEqual([]);
  });
});

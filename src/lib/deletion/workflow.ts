export type DeletionSubjectType = 'hatmam_order' | 'hatmam_publication' | 'lang_lead';
export type DeletionRequestStatus = 'received' | 'identity_verified' | 'approved' | 'executing' | 'completed' | 'failed' | 'rejected';

export interface ApprovedDeletionRequest {
  id: string;
  subjectType: DeletionSubjectType;
  subjectId: string;
  status: DeletionRequestStatus;
  /** UUID-only path; never a child's name or other PII. */
  privateObjectPath?: string;
}

export interface DeletionProvider {
  deletePrivateObject(path: string): Promise<void>;
  deleteMetadata(subjectType: DeletionSubjectType, subjectId: string): Promise<void>;
}

export interface DeletionResult {
  requestId: string;
  deletedObject: boolean;
  deletedMetadata: boolean;
}

/**
 * Executes only an already approved request. The caller must persist each
 * terminal state and evidence around this adapter. Object removal precedes
 * metadata removal so a retry can still locate an orphaned private object.
 */
export async function executeApprovedDeletion(
  request: ApprovedDeletionRequest,
  provider: DeletionProvider,
): Promise<DeletionResult> {
  if (request.status !== 'approved') {
    throw new Error('DELETION_NOT_APPROVED');
  }
  if (request.privateObjectPath && !isSafePrivateObjectPath(request.privateObjectPath)) {
    throw new Error('UNSAFE_PRIVATE_OBJECT_PATH');
  }

  if (request.privateObjectPath) await provider.deletePrivateObject(request.privateObjectPath);
  await provider.deleteMetadata(request.subjectType, request.subjectId);
  return {
    requestId: request.id,
    deletedObject: Boolean(request.privateObjectPath),
    deletedMetadata: true,
  };
}

function isSafePrivateObjectPath(path: string) {
  return !path.startsWith('/') && !path.includes('..') && !/[?&#]/.test(path) && /^[a-f0-9-]+(?:\/[a-f0-9-]+)*\.pdf$/i.test(path);
}

/** Deterministic test adapter. It never calls Storage or PostgREST. */
export class MockDeletionProvider implements DeletionProvider {
  readonly operations: string[] = [];
  private readonly completed = new Set<string>();

  async deletePrivateObject(path: string) {
    const key = `object:${path}`;
    if (!this.completed.has(key)) {
      this.completed.add(key);
      this.operations.push(key);
    }
  }

  async deleteMetadata(subjectType: DeletionSubjectType, subjectId: string) {
    const key = `metadata:${subjectType}:${subjectId}`;
    if (!this.completed.has(key)) {
      this.completed.add(key);
      this.operations.push(key);
    }
  }
}

import { DomainError } from '@/lib/domain/errors';

import { buildPrivateObjectPath } from './contracts';

export type ApprovedPrivateAsset = {
  productCode: 'lang' | 'hatmam';
  orderCode: string;
  publicationCode: string;
  version: number;
  checksumSha256: string;
  approved: boolean;
};

export type PrivateDownloadAuthorization = {
  allowed: boolean;
  privateStorageReady: boolean;
  customerAuthReady: boolean;
  privateReadingRoomEnabled: boolean;
};

export interface PrivateStorageAdapter {
  issueShortLivedDownload(input: {
    asset: ApprovedPrivateAsset;
    authorization: PrivateDownloadAuthorization;
  }): Promise<{ objectPath: string; signedUrl: string; expiresAt: string }>;
}

/**
 * WP3's only concrete adapter. It ensures a future caller cannot accidentally
 * turn metadata into a permanent/public URL while Storage and Auth gates are
 * still OFF. The production adapter is intentionally deferred to a separately
 * authorized provider-connection work order.
 */
export class FailClosedPrivateStorageAdapter implements PrivateStorageAdapter {
  async issueShortLivedDownload(input: {
    asset: ApprovedPrivateAsset;
    authorization: PrivateDownloadAuthorization;
  }): Promise<{ objectPath: string; signedUrl: string; expiresAt: string }> {
    const { asset, authorization } = input;
    if (!authorization.allowed || !authorization.privateStorageReady || !authorization.customerAuthReady || !authorization.privateReadingRoomEnabled) {
      throw new DomainError('UNAUTHORIZED', 'Private Reading Room chưa được mở cho delivery.');
    }
    if (!asset.approved || !/^[a-f0-9]{64}$/.test(asset.checksumSha256)) {
      throw new DomainError('VALIDATION_FAILED', 'Private asset chưa có approval hoặc checksum hợp lệ.');
    }

    // This line is unreachable in WP3 because every current release flag is
    // persisted OFF. Keeping it explicit prevents a fake URL from ever being
    // returned by a test harness.
    throw new DomainError(
      'INVALID_TRANSITION',
      `Storage signing adapter is not connected for ${buildPrivateObjectPath(asset)}.`
    );
  }
}

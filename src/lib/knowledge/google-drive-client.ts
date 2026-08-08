import { GOOGLE_DOC_MIME } from './drive-sync';

const DRIVE_API = 'https://www.googleapis.com/drive/v3';

export type DriveApiFile = {
  id: string;
  name: string;
  mimeType: string;
  parents?: string[];
  webViewLink?: string;
  createdTime?: string;
  modifiedTime?: string;
  version?: string;
  md5Checksum?: string;
  trashed?: boolean;
};

export type DriveApiChange = {
  fileId: string;
  removed?: boolean;
  file?: DriveApiFile;
};

export type DrivePage<T> = {
  items: T[];
  nextPageToken?: string;
  newStartPageToken?: string;
};

export type DriveAccessTokenProvider = () => Promise<string>;
export type DriveFetch = typeof fetch;

export class GoogleDriveReadClient {
  constructor(
    private readonly accessToken: DriveAccessTokenProvider,
    private readonly fetcher: DriveFetch = fetch
  ) {}

  private async request(url: string): Promise<Response> {
    const token = await this.accessToken();
    const response = await this.fetcher(url, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!response.ok) {
      throw new Error(`GOOGLE_DRIVE_READ_FAILED_${response.status}`);
    }
    return response;
  }

  async getFile(fileId: string): Promise<DriveApiFile> {
    const fields = [
      'id',
      'name',
      'mimeType',
      'parents',
      'webViewLink',
      'createdTime',
      'modifiedTime',
      'version',
      'md5Checksum',
      'trashed',
    ].join(',');
    const url = `${DRIVE_API}/files/${encodeURIComponent(fileId)}?supportsAllDrives=true&fields=${encodeURIComponent(fields)}`;
    return (await this.request(url)).json() as Promise<DriveApiFile>;
  }

  async listChildren(folderId: string, pageToken?: string): Promise<DrivePage<DriveApiFile>> {
    const params = new URLSearchParams({
      q: `'${folderId.replaceAll("'", "\\'")}' in parents and trashed = false`,
      spaces: 'drive',
      supportsAllDrives: 'true',
      includeItemsFromAllDrives: 'true',
      pageSize: '1000',
      fields:
        'nextPageToken,files(id,name,mimeType,parents,webViewLink,createdTime,modifiedTime,version,md5Checksum,trashed)',
    });
    if (pageToken) params.set('pageToken', pageToken);
    const body = (await this.request(`${DRIVE_API}/files?${params.toString()}`)).json() as Promise<{
      files?: DriveApiFile[];
      nextPageToken?: string;
    }>;
    const result = await body;
    return { items: result.files ?? [], nextPageToken: result.nextPageToken };
  }

  async getStartPageToken(): Promise<string> {
    const response = await this.request(`${DRIVE_API}/changes/startPageToken?supportsAllDrives=true`);
    const data = (await response.json()) as { startPageToken?: string };
    if (!data.startPageToken) throw new Error('GOOGLE_DRIVE_START_TOKEN_MISSING');
    return data.startPageToken;
  }

  async listChanges(pageToken: string): Promise<DrivePage<DriveApiChange>> {
    const params = new URLSearchParams({
      pageToken,
      spaces: 'drive',
      includeRemoved: 'true',
      supportsAllDrives: 'true',
      includeItemsFromAllDrives: 'true',
      pageSize: '1000',
      fields:
        'nextPageToken,newStartPageToken,changes(fileId,removed,file(id,name,mimeType,parents,webViewLink,createdTime,modifiedTime,version,md5Checksum,trashed))',
    });
    const data = (await (await this.request(`${DRIVE_API}/changes?${params.toString()}`)).json()) as {
      changes?: DriveApiChange[];
      nextPageToken?: string;
      newStartPageToken?: string;
    };
    return {
      items: data.changes ?? [],
      nextPageToken: data.nextPageToken,
      newStartPageToken: data.newStartPageToken,
    };
  }

  async readText(file: DriveApiFile): Promise<string> {
    if (file.mimeType === GOOGLE_DOC_MIME) {
      const url = `${DRIVE_API}/files/${encodeURIComponent(file.id)}/export?mimeType=${encodeURIComponent('text/plain')}`;
      return (await this.request(url)).text();
    }

    const textLike = new Set([
      'text/plain',
      'text/markdown',
      'text/html',
      'application/json',
    ]);
    if (!textLike.has(file.mimeType)) {
      throw new Error('GOOGLE_DRIVE_UNSUPPORTED_TEXT_MIME');
    }

    return (await this.request(`${DRIVE_API}/files/${encodeURIComponent(file.id)}?alt=media&supportsAllDrives=true`)).text();
  }
}

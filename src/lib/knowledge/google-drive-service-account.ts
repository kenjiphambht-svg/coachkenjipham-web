const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const DRIVE_READONLY_SCOPE = 'https://www.googleapis.com/auth/drive.readonly';
const DOCS_READONLY_SCOPE = 'https://www.googleapis.com/auth/documents.readonly';
const ENV_NAME = 'ESSENCE_GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON';
const EXPECTED_PROJECT_ID = 'essence-knowledge-sync-staging';
const EXPECTED_SERVICE_ACCOUNT =
  'essence-knowledge-sync-staging@essence-knowledge-sync-staging.iam.gserviceaccount.com';

type ServiceAccountCredential = {
  type: 'service_account';
  project_id: string;
  private_key: string;
  client_email: string;
  token_uri?: string;
};

type CachedToken = {
  value: string;
  expiresAtMs: number;
};

let cachedToken: CachedToken | undefined;

function base64Url(input: Uint8Array | string): string {
  const bytes = typeof input === 'string' ? new TextEncoder().encode(input) : input;
  return Buffer.from(bytes).toString('base64url');
}

function privateKeyBytes(pem: string): Uint8Array {
  const encoded = pem
    .replace(/-----BEGIN PRIVATE KEY-----/g, '')
    .replace(/-----END PRIVATE KEY-----/g, '')
    .replace(/\s/g, '');
  if (!encoded) throw new Error('GOOGLE_DRIVE_SERVICE_ACCOUNT_PRIVATE_KEY_INVALID');
  return Uint8Array.from(Buffer.from(encoded, 'base64'));
}

function readCredential(): ServiceAccountCredential {
  const raw = process.env[ENV_NAME];
  if (!raw) throw new Error('GOOGLE_DRIVE_SERVICE_ACCOUNT_CREDENTIAL_MISSING');

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('GOOGLE_DRIVE_SERVICE_ACCOUNT_CREDENTIAL_INVALID_JSON');
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('GOOGLE_DRIVE_SERVICE_ACCOUNT_CREDENTIAL_INVALID');
  }

  const credential = parsed as Partial<ServiceAccountCredential>;
  if (
    credential.type !== 'service_account' ||
    credential.project_id !== EXPECTED_PROJECT_ID ||
    credential.client_email !== EXPECTED_SERVICE_ACCOUNT ||
    typeof credential.private_key !== 'string'
  ) {
    throw new Error('GOOGLE_DRIVE_SERVICE_ACCOUNT_IDENTITY_MISMATCH');
  }

  if (credential.token_uri && credential.token_uri !== TOKEN_URL) {
    throw new Error('GOOGLE_DRIVE_SERVICE_ACCOUNT_TOKEN_URI_MISMATCH');
  }

  return credential as ServiceAccountCredential;
}

async function createAssertion(credential: ServiceAccountCredential): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = base64Url(
    JSON.stringify({
      iss: credential.client_email,
      scope: `${DRIVE_READONLY_SCOPE} ${DOCS_READONLY_SCOPE}`,
      aud: TOKEN_URL,
      iat: now,
      exp: now + 3600,
    })
  );
  const unsigned = `${header}.${payload}`;

  const key = await crypto.subtle.importKey(
    'pkcs8',
    privateKeyBytes(credential.private_key),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    key,
    new TextEncoder().encode(unsigned)
  );

  return `${unsigned}.${base64Url(new Uint8Array(signature))}`;
}

export async function getEssenceDriveAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAtMs - Date.now() > 60_000) {
    return cachedToken.value;
  }

  const credential = readCredential();
  const assertion = await createAssertion(credential);
  const body = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion,
  });

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error(`GOOGLE_DRIVE_SERVICE_ACCOUNT_TOKEN_FAILED_${response.status}`);
  }

  const data = (await response.json()) as {
    access_token?: string;
    expires_in?: number;
    token_type?: string;
  };
  if (!data.access_token || data.token_type?.toLowerCase() !== 'bearer') {
    throw new Error('GOOGLE_DRIVE_SERVICE_ACCOUNT_TOKEN_INVALID');
  }

  const expiresIn = Math.min(Math.max(data.expires_in ?? 3600, 60), 3600);
  cachedToken = {
    value: data.access_token,
    expiresAtMs: Date.now() + expiresIn * 1000,
  };

  return data.access_token;
}

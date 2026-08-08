import { describe, expect, it } from 'vitest';
import { GoogleDriveReadClient } from '@/lib/knowledge/google-drive-client';

function jsonResponse(value: unknown, status = 200): Response {
  return new Response(JSON.stringify(value), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

describe('GoogleDriveReadClient', () => {
  it('injects the access token at request time and never stores it in a URL', async () => {
    const seen: Array<{ url: string; auth: string | null }> = [];
    const client = new GoogleDriveReadClient(
      async () => 'synthetic-secret-token',
      (async (input, init) => {
        seen.push({
          url: String(input),
          auth: new Headers(init?.headers).get('authorization'),
        });
        return jsonResponse({ id: 'file-1', name: 'Doc', mimeType: 'text/plain' });
      }) as typeof fetch
    );

    await client.getFile('file-1');
    expect(seen[0].auth).toBe('Bearer synthetic-secret-token');
    expect(seen[0].url).not.toContain('synthetic-secret-token');
  });

  it('requests removed changes and returns a new start token', async () => {
    let requested = '';
    const client = new GoogleDriveReadClient(
      async () => 'token',
      (async (input) => {
        requested = String(input);
        return jsonResponse({
          changes: [{ fileId: 'gone', removed: true }],
          newStartPageToken: 'next-stable-token',
        });
      }) as typeof fetch
    );

    const result = await client.listChanges('old-token');
    expect(requested).toContain('/changes?');
    expect(requested).toContain('includeRemoved=true');
    expect(result.items[0]).toMatchObject({ fileId: 'gone', removed: true });
    expect(result.newStartPageToken).toBe('next-stable-token');
  });

  it('inspects Google Docs in inline-suggestions mode before canonical ingestion', async () => {
    let requested = '';
    const client = new GoogleDriveReadClient(
      async () => 'token',
      (async (input) => {
        requested = String(input);
        return jsonResponse({
          documentId: 'doc-1',
          body: {
            content: [
              {
                paragraph: {
                  elements: [{ textRun: { content: 'proposed', suggestedInsertionIds: ['suggestion-1'] } }],
                },
              },
            ],
          },
        });
      }) as typeof fetch
    );

    await expect(client.hasUnresolvedSuggestions('doc-1')).resolves.toBe(true);
    expect(requested).toContain('docs.googleapis.com/v1/documents/doc-1');
    expect(requested).toContain('suggestionsViewMode=SUGGESTIONS_INLINE');
  });

  it('returns false when a Google Doc contains no suggestion markers', async () => {
    const client = new GoogleDriveReadClient(
      async () => 'token',
      (async () => jsonResponse({ body: { content: [{ paragraph: { elements: [] } }] } })) as typeof fetch
    );
    await expect(client.hasUnresolvedSuggestions('doc-clean')).resolves.toBe(false);
  });

  it('reports Docs API failures separately without exposing provider response bodies', async () => {
    const client = new GoogleDriveReadClient(
      async () => 'token',
      (async () => jsonResponse({ error: { message: 'sensitive-provider-detail' } }, 403)) as typeof fetch
    );
    await expect(client.hasUnresolvedSuggestions('doc-denied')).rejects.toThrow('GOOGLE_DOCS_READ_FAILED_403');
  });

  it('resolves Drive shortcuts to the target file before content decisions', async () => {
    let requested = '';
    const client = new GoogleDriveReadClient(
      async () => 'token',
      (async (input) => {
        requested = String(input);
        return jsonResponse({ id: 'target-1', name: 'Target', mimeType: 'text/plain', parents: ['root-1'] });
      }) as typeof fetch
    );

    const target = await client.resolveShortcut({
      id: 'shortcut-1',
      name: 'Shortcut',
      mimeType: 'application/vnd.google-apps.shortcut',
      shortcutDetails: { targetId: 'target-1', targetMimeType: 'text/plain' },
    });
    expect(target.id).toBe('target-1');
    expect(requested).toContain('/files/target-1');
  });

  it('exports Google Docs as plain text', async () => {
    let requested = '';
    const client = new GoogleDriveReadClient(
      async () => 'token',
      (async (input) => {
        requested = String(input);
        return new Response('accepted text', { status: 200 });
      }) as typeof fetch
    );

    const text = await client.readText({
      id: 'doc-1',
      name: 'Doc',
      mimeType: 'application/vnd.google-apps.document',
    });
    expect(text).toBe('accepted text');
    expect(requested).toContain('/export?');
    expect(requested).toContain('text%2Fplain');
  });

  it('rejects binary types instead of silently indexing them as text', async () => {
    const client = new GoogleDriveReadClient(async () => 'token', fetch);
    await expect(
      client.readText({ id: 'pdf-1', name: 'PDF', mimeType: 'application/pdf' })
    ).rejects.toThrow('GOOGLE_DRIVE_UNSUPPORTED_TEXT_MIME');
  });

  it('fails closed on non-2xx Drive responses', async () => {
    const client = new GoogleDriveReadClient(
      async () => 'token',
      (async () => jsonResponse({ error: 'forbidden' }, 403)) as typeof fetch
    );
    await expect(client.getFile('denied')).rejects.toThrow('GOOGLE_DRIVE_READ_FAILED_403');
  });
});

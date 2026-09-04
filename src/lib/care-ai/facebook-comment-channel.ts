import { createHash } from 'node:crypto';
import { assertOfficialMetaSendEndpoint } from './meta-channel';

export interface FacebookCommentInbound {
  pageId: string;
  senderId: string;
  commentId: string;
  postId: string;
  parentId?: string;
  message: string;
  createdTime?: number;
}

interface FacebookFeedChangeValue {
  item?: string;
  verb?: string;
  sender_id?: string | number;
  from?: {
    id?: string | number;
  };
  comment_id?: string;
  post_id?: string;
  parent_id?: string;
  message?: string;
  created_time?: number;
}

interface FacebookFeedPayload {
  object?: string;
  entry?: Array<{
    id?: string;
    changes?: Array<{
      field?: string;
      value?: FacebookFeedChangeValue;
    }>;
  }>;
}

function safeId(value: unknown): string | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > 256 || !/^[A-Za-z0-9:_-]+$/.test(trimmed)) return undefined;
  return trimmed;
}

function safeCommentParseDropDiagnostic(value: FacebookFeedChangeValue): void {
  console.warn('CARE_META_COMMENT_PARSE_DROP', {
    hasSenderId: Boolean(safeId(value.sender_id)),
    hasFromId: Boolean(safeId(value.from?.id)),
    hasCommentId: Boolean(safeId(value.comment_id)),
    hasPostId: Boolean(safeId(value.post_id)),
    hasMessage: typeof value.message === 'string' && Boolean(value.message.trim()),
  });
}

export function parseFacebookPageFeedComments(payload: unknown): FacebookCommentInbound[] {
  if (!payload || typeof payload !== 'object') return [];
  const body = payload as FacebookFeedPayload;
  if (body.object !== 'page') return [];

  const comments: FacebookCommentInbound[] = [];
  for (const entry of body.entry || []) {
    const pageId = safeId(entry.id);
    if (!pageId) continue;
    for (const change of entry.changes || []) {
      if (change.field !== 'feed') continue;
      const value = change.value || {};
      if (value.item !== 'comment' || value.verb !== 'add') continue;
      // Meta Page feed payloads have historically used sender_id, while newer examples
      // also use from.id. Support both without persisting or logging profile/name data.
      const senderId = safeId(value.sender_id) || safeId(value.from?.id);
      const commentId = safeId(value.comment_id);
      const postId = safeId(value.post_id);
      const message = typeof value.message === 'string' ? value.message.trim() : '';
      if (!senderId || !commentId || !postId || !message) {
        safeCommentParseDropDiagnostic(value);
        continue;
      }
      if (senderId === pageId) continue; // Prevent Page-authored reply recursion.
      comments.push({
        pageId,
        senderId,
        commentId,
        postId,
        parentId: safeId(value.parent_id),
        message,
        createdTime: typeof value.created_time === 'number' ? value.created_time : undefined,
      });
    }
  }
  return comments;
}

export function facebookCommentExternalMessageId(comment: Pick<FacebookCommentInbound, 'commentId'>): string {
  return `facebook-comment:${comment.commentId}`;
}

export function facebookCommentSenderScopeHash(senderId: string): string {
  return createHash('sha256').update(`facebook-comment-sender\u0000${senderId}`, 'utf8').digest('hex');
}

export function facebookCommentReplyEndpointFromMessengerEndpoint(
  messengerSendEndpoint: string,
  pageId: string,
  commentId: string,
): string {
  const validated = new URL(assertOfficialMetaSendEndpoint(messengerSendEndpoint, 'facebook_messenger', pageId));
  const versionMatch = validated.pathname.match(/^\/(v\d+\.\d+)\//);
  if (!versionMatch) throw new Error('CARE_META_COMMENT_GRAPH_VERSION_INVALID');
  const safeCommentId = safeId(commentId);
  if (!safeCommentId) throw new Error('CARE_META_COMMENT_ID_INVALID');
  return `${validated.origin}/${versionMatch[1]}/${encodeURIComponent(safeCommentId)}/comments`;
}

function safeMetaErrorNumber(value: unknown): string | undefined {
  if (typeof value === 'number' && Number.isInteger(value) && value >= 0) return String(value);
  if (typeof value === 'string' && /^\d{1,10}$/.test(value)) return value;
  return undefined;
}

async function commentSendFailure(response: Response): Promise<Error> {
  let code: string | undefined;
  let subcode: string | undefined;
  try {
    const payload = (await response.json()) as { error?: { code?: unknown; error_subcode?: unknown } };
    code = safeMetaErrorNumber(payload.error?.code);
    subcode = safeMetaErrorNumber(payload.error?.error_subcode);
  } catch {
    // Raw upstream body is intentionally ignored.
  }
  console.error('CARE_META_COMMENT_SEND_FAILURE', {
    status: response.status,
    code: code ?? null,
    subcode: subcode ?? null,
  });
  let errorCode = `CARE_META_COMMENT_SEND_HTTP_${response.status}`;
  if (code) errorCode += `_CODE_${code}`;
  if (subcode) errorCode += `_SUBCODE_${subcode}`;
  return new Error(errorCode);
}

export async function sendFacebookPageCommentReply(args: {
  messengerSendEndpoint: string;
  accessToken: string;
  pageId: string;
  commentId: string;
  text: string;
}): Promise<{ commentId?: string }> {
  if (!args.accessToken) throw new Error('CARE_META_ACCESS_TOKEN_REQUIRED');
  const text = args.text.trim();
  if (!text) throw new Error('CARE_META_COMMENT_REPLY_TEXT_REQUIRED');
  if (text.length > 1600) throw new Error('CARE_META_COMMENT_REPLY_TEXT_TOO_LONG');
  const endpoint = facebookCommentReplyEndpointFromMessengerEndpoint(
    args.messengerSendEndpoint,
    args.pageId,
    args.commentId,
  );
  const response = await fetch(endpoint, {
    method: 'POST',
    redirect: 'manual',
    headers: {
      Authorization: `Bearer ${args.accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: text }),
  });
  if (!response.ok) throw await commentSendFailure(response);
  const payload = (await response.json()) as { id?: string };
  return { commentId: payload.id };
}

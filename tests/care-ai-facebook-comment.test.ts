import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  facebookCommentExternalMessageId,
  facebookCommentReplyEndpointFromMessengerEndpoint,
  parseFacebookPageFeedComments,
  sendFacebookPageCommentReply,
} from '../src/lib/care-ai/facebook-comment-channel';

afterEach(() => vi.restoreAllMocks());

describe('P07 Facebook Page comment adapter', () => {
  it('parses only new customer comments from Page feed webhooks', () => {
    const parsed = parseFacebookPageFeedComments({
      object: 'page',
      entry: [
        {
          id: 'PAGE-1',
          changes: [
            {
              field: 'feed',
              value: {
                item: 'comment',
                verb: 'add',
                sender_id: 'USER-1',
                comment_id: 'C-1',
                post_id: 'PAGE-1_POST-1',
                parent_id: 'PAGE-1_POST-1',
                created_time: 123,
                message: 'Dấu Ấn Của Bạn giá bao nhiêu?',
              },
            },
            {
              field: 'feed',
              value: {
                item: 'comment',
                verb: 'edit',
                sender_id: 'USER-1',
                comment_id: 'C-2',
                post_id: 'PAGE-1_POST-1',
                message: 'edited',
              },
            },
          ],
        },
      ],
    });
    expect(parsed).toEqual([
      {
        pageId: 'PAGE-1',
        senderId: 'USER-1',
        commentId: 'C-1',
        postId: 'PAGE-1_POST-1',
        parentId: 'PAGE-1_POST-1',
        message: 'Dấu Ấn Của Bạn giá bao nhiêu?',
        createdTime: 123,
      },
    ]);
    expect(facebookCommentExternalMessageId(parsed[0])).toBe('facebook-comment:C-1');
  });

  it('accepts the Meta Page feed from.id commenter shape without using profile name', () => {
    const parsed = parseFacebookPageFeedComments({
      object: 'page',
      entry: [{
        id: 'PAGE-1',
        changes: [{
          field: 'feed',
          value: {
            item: 'comment',
            verb: 'add',
            from: { id: 'USER-2', name: 'SHOULD-NOT-BE-USED' },
            comment_id: 'C-3',
            post_id: 'PAGE-1_POST-1',
            parent_id: 'PAGE-1_POST-1',
            created_time: 456,
            message: 'Tôi muốn hỏi Dấu Ấn giá bao nhiêu',
          },
        }],
      }],
    });
    expect(parsed).toEqual([{
      pageId: 'PAGE-1',
      senderId: 'USER-2',
      commentId: 'C-3',
      postId: 'PAGE-1_POST-1',
      parentId: 'PAGE-1_POST-1',
      message: 'Tôi muốn hỏi Dấu Ấn giá bao nhiêu',
      createdTime: 456,
    }]);
    expect(JSON.stringify(parsed)).not.toContain('SHOULD-NOT-BE-USED');
  });

  it('emits only boolean shape telemetry when a new comment cannot be parsed', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    expect(parseFacebookPageFeedComments({
      object: 'page',
      entry: [{
        id: 'PAGE-1',
        changes: [{
          field: 'feed',
          value: {
            item: 'comment',
            verb: 'add',
            comment_id: 'C-DROP',
            post_id: 'PAGE-1_POST-1',
            message: 'PRIVATE-TEXT',
          },
        }],
      }],
    })).toEqual([]);
    expect(warnSpy).toHaveBeenCalledWith('CARE_META_COMMENT_PARSE_DROP', {
      hasSenderId: false,
      hasFromId: false,
      hasCommentId: true,
      hasPostId: true,
      hasMessage: true,
    });
    expect(JSON.stringify(warnSpy.mock.calls)).not.toContain('PRIVATE-TEXT');
    expect(JSON.stringify(warnSpy.mock.calls)).not.toContain('C-DROP');
    expect(JSON.stringify(warnSpy.mock.calls)).not.toContain('PAGE-1_POST-1');
  });

  it('drops Page-authored comment events to prevent reply recursion', () => {
    expect(parseFacebookPageFeedComments({
      object: 'page',
      entry: [{
        id: 'PAGE-1',
        changes: [{
          field: 'feed',
          value: {
            item: 'comment',
            verb: 'add',
            sender_id: 'PAGE-1',
            comment_id: 'PAGE-REPLY-1',
            post_id: 'PAGE-1_POST-1',
            message: 'Page reply',
          },
        }],
      }],
    })).toEqual([]);
  });

  it('derives the official versioned comment reply endpoint from the pinned Messenger endpoint', () => {
    expect(facebookCommentReplyEndpointFromMessengerEndpoint(
      'https://graph.facebook.com/v26.0/PAGE-1/messages',
      'PAGE-1',
      'PAGE-1_POST-1_COMMENT-1',
    )).toBe('https://graph.facebook.com/v26.0/PAGE-1_POST-1_COMMENT-1/comments');

    expect(() => facebookCommentReplyEndpointFromMessengerEndpoint(
      'https://evil.example/v26.0/PAGE-1/messages',
      'PAGE-1',
      'C-1',
    )).toThrow('CARE_META_SEND_ENDPOINT_NOT_OFFICIAL');
  });

  it('posts a public Page reply with bearer auth and keeps the token out of URL/body', async () => {
    const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ id: 'REPLY-1' }), { status: 200, headers: { 'Content-Type': 'application/json' } }),
    );
    const result = await sendFacebookPageCommentReply({
      messengerSendEndpoint: 'https://graph.facebook.com/v26.0/PAGE-1/messages',
      accessToken: 'PAGE-TOKEN-SECRET',
      pageId: 'PAGE-1',
      commentId: 'C-1',
      text: 'Dấu Ấn Của Bạn đang mở bán ở mức 8.000.000đ.',
    });
    expect(result).toEqual({ commentId: 'REPLY-1' });
    expect(spy).toHaveBeenCalledOnce();
    const [url, init] = spy.mock.calls[0];
    expect(url).toBe('https://graph.facebook.com/v26.0/C-1/comments');
    expect(init?.redirect).toBe('manual');
    expect((init?.headers as Record<string, string>).Authorization).toBe('Bearer PAGE-TOKEN-SECRET');
    expect(String(url)).not.toContain('PAGE-TOKEN-SECRET');
    expect(String(init?.body)).not.toContain('PAGE-TOKEN-SECRET');
    expect(JSON.parse(String(init?.body))).toEqual({ message: 'Dấu Ấn Của Bạn đang mở bán ở mức 8.000.000đ.' });
  });

  it('logs only safe numeric Meta diagnostics on comment reply failure', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({
      error: {
        message: 'Sensitive upstream detail USER-SECRET TOKEN-SECRET',
        code: 200,
        error_subcode: 201,
        fbtrace_id: 'TRACE-SECRET',
      },
    }), { status: 403, headers: { 'Content-Type': 'application/json' } }));
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    await expect(sendFacebookPageCommentReply({
      messengerSendEndpoint: 'https://graph.facebook.com/v26.0/PAGE-1/messages',
      accessToken: 'TOKEN-SECRET',
      pageId: 'PAGE-1',
      commentId: 'C-1',
      text: 'PRIVATE-CONTENT',
    })).rejects.toThrow('CARE_META_COMMENT_SEND_HTTP_403_CODE_200_SUBCODE_201');

    expect(errorSpy).toHaveBeenCalledWith('CARE_META_COMMENT_SEND_FAILURE', {
      status: 403,
      code: '200',
      subcode: '201',
    });
    const logs = JSON.stringify(errorSpy.mock.calls);
    expect(logs).not.toContain('TOKEN-SECRET');
    expect(logs).not.toContain('USER-SECRET');
    expect(logs).not.toContain('PRIVATE-CONTENT');
    expect(logs).not.toContain('TRACE-SECRET');
  });
});

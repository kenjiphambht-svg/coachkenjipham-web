import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const endpointSource = readFileSync('src/pages/api/internal/care-ai-meta-webhook.ts', 'utf8');
const routerSource = readFileSync('src/pages/api/internal/care-ai-meta-webhook-router.ts', 'utf8');
const wranglerSource = readFileSync('wrangler.care-meta.jsonc', 'utf8');

describe('P07 Facebook Page comment runtime wiring', () => {
  it('routes the existing callback through the new router while preserving the proven Messenger handler', () => {
    expect(endpointSource).toContain("import handler from './care-ai-meta-webhook-router'");
    expect(routerSource).toContain("import messengerHandler from './care-ai-meta-webhook-handler'");
    expect(routerSource).toContain('await messengerHandler(replay, capturedResponse)');
  });

  it('keeps comment processing and public outbound behind two explicit runtime gates', () => {
    expect(routerSource).toContain("process.env.CARE_META_FACEBOOK_COMMENT_ENABLED === 'true'");
    expect(routerSource).toContain("process.env.CARE_META_FACEBOOK_COMMENT_OUTBOUND_ENABLED === 'true'");
    expect(routerSource).toContain('outboundEnabled()');
    expect(routerSource).toContain('facebookCommentEnabled()');
    expect(wranglerSource).not.toContain('CARE_META_FACEBOOK_COMMENT_ENABLED');
    expect(wranglerSource).not.toContain('CARE_META_FACEBOOK_COMMENT_OUTBOUND_ENABLED');
  });

  it('does not load conversation or durable relationship memory into public comments', () => {
    expect(routerSource).not.toContain('relationship-memory');
    expect(routerSource).not.toContain('conversation-context');
    expect(routerSource).not.toContain('loadCareMemoryRuntimeTurn');
    expect(routerSource).not.toContain('applyDeterministicCareMemoryWrite');
    expect(routerSource).toContain("surface: 'public_comment'");
  });

  it('restricts autonomous public replies to recognized current products and never auto-DMs in this phase', () => {
    expect(routerSource).toContain('Boolean(findRuntimeProduct(text))');
    expect(routerSource).toContain('requiresHumanReview: true');
    expect(routerSource).toContain('sendFacebookPageCommentReply({');
    expect(routerSource).not.toContain('recipientId: comment.senderId');
    expect(routerSource).not.toContain('sendMetaText({');
  });

  it('fails public outbound closed on model/provider fallback', () => {
    const failureIndex = routerSource.indexOf('modelFallbackUsed = true');
    const guardIndex = routerSource.indexOf('if (modelFallbackUsed || !commentOutbound)');
    const sendIndex = routerSource.indexOf('await sendFacebookPageCommentReply({');
    expect(failureIndex).toBeGreaterThan(-1);
    expect(guardIndex).toBeGreaterThan(failureIndex);
    expect(sendIndex).toBeGreaterThan(guardIndex);
  });

  it('reuses persistent hashed idempotency and rate/cost guards before comment model execution', () => {
    const claimIndex = routerSource.indexOf('createD1MetaIdempotencyStore');
    const rateIndex = routerSource.indexOf('claimCommentCapacity({');
    const modelIndex = routerSource.indexOf('decision = await runCareModel({');
    expect(claimIndex).toBeGreaterThan(-1);
    expect(rateIndex).toBeGreaterThan(-1);
    expect(modelIndex).toBeGreaterThan(rateIndex);
    expect(routerSource).toContain('facebookCommentExternalMessageId(comment)');
    expect(routerSource).not.toContain("console.info('CARE_META_COMMENT_MODEL_SUCCESS', { comment");
  });
});

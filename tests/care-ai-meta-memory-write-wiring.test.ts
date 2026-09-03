import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const handlerSource = readFileSync('src/pages/api/internal/care-ai-meta-webhook-handler.ts', 'utf8');

describe('P07 Meta durable-memory runtime wiring contract', () => {
  it('keeps durable WRITE behind its explicit runtime gate and Step-2 context identity', () => {
    expect(handlerSource).toContain("process.env.CARE_META_DURABLE_MEMORY_WRITE_ENABLED === 'true'");
    expect(handlerSource).toContain('durableMemoryWriteRequested() && conversationContextEnabled()');
  });

  it('attempts durable WRITE only after a successful Meta send', () => {
    const sendIndex = handlerSource.indexOf('const sent = await sendMetaText({');
    const writeIndex = handlerSource.indexOf('const writeResult = await applyDeterministicCareMemoryWrite({');
    expect(sendIndex).toBeGreaterThan(-1);
    expect(writeIndex).toBeGreaterThan(sendIndex);
  });

  it('uses only a hashed inbound message source reference for durable memory', () => {
    expect(handlerSource).toContain('sourceRef: `meta:${hashCareExternalMessageId(messageId)}`');
    expect(handlerSource).not.toContain('sourceRef: messageId');
    expect(handlerSource).not.toContain('sourceRef: message.externalMessageId');
  });

  it('logs only safe write metadata and degrades memory failures without undoing outbound', () => {
    const writeReadyStart = handlerSource.indexOf("console.info('CARE_MEMORY_WRITE_READY'");
    const writeReadyEnd = handlerSource.indexOf('});', writeReadyStart);
    const writeLog = handlerSource.slice(writeReadyStart, writeReadyEnd + 3);
    expect(writeLog).not.toContain('message.text');
    expect(writeLog).not.toContain('currentCustomerText');
    expect(handlerSource).toContain("console.error('CARE_MEMORY_WRITE_DEGRADED', { safeErrorCode: memoryWriteReason });");
    expect(handlerSource.indexOf("console.error('CARE_MEMORY_WRITE_DEGRADED'")).toBeGreaterThan(
      handlerSource.indexOf('const sent = await sendMetaText({'),
    );
  });
});

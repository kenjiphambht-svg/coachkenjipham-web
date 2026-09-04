import fs from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('Care operability wiring', () => {
  it('routes the Meta webhook through the fail-open operability wrapper', () => {
    const entry = fs.readFileSync('src/pages/api/internal/care-ai-meta-webhook.ts', 'utf8');
    const wrapper = fs.readFileSync('src/pages/api/internal/care-ai-meta-operability-wrapper.ts', 'utf8');

    expect(entry).toContain("import handler from './care-ai-meta-operability-wrapper'");
    expect(wrapper).toContain("import router from './care-ai-meta-webhook-router'");
    expect(wrapper).toContain('CARE_META_OPERABILITY_EVENTS_ENABLED');
    expect(wrapper).toContain('verifyMetaPayloadSignature');
    expect(wrapper).toContain("'RECEIVED'");
    expect(wrapper).toContain('markCareOperabilitySafely');
    expect(wrapper).toContain('CARE_OPERABILITY_FINALIZE_DEGRADED');
  });

  it('keeps the health endpoint bearer-protected and aggregate-only', () => {
    const health = fs.readFileSync('src/pages/api/internal/care-ai-meta-operability-health.ts', 'utf8');

    expect(health).toContain('CARE_META_OPERABILITY_HEALTH_TOKEN');
    expect(health).toContain('timingSafeEqual');
    expect(health).toContain('Bearer ');
    expect(health).toContain("status: degraded ? 'degraded' : 'healthy'");
    expect(health).not.toContain('externalSenderId');
    expect(health).not.toContain('message.text');
    expect(health).not.toContain('replyPreview');
  });

  it('keeps the D1 monitoring schema opaque and bounded', () => {
    const migration = fs.readFileSync('cloudflare/d1/20260904_p07_care_operability_state.sql', 'utf8');

    expect(migration).toContain('care_meta_operability_state');
    expect(migration).toContain('expires_at_ms');
    expect(migration).toContain("'DUPLICATE'");
    expect(migration).not.toMatch(/sender_id\s+TEXT/i);
    expect(migration).not.toMatch(/message_text\s+TEXT/i);
    expect(migration).not.toMatch(/reply_text\s+TEXT/i);
    expect(migration).not.toMatch(/access_token\s+TEXT/i);
  });
});

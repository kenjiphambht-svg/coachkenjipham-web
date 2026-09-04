import fs from 'node:fs';
import { describe, expect, it } from 'vitest';
import { syncCareOperabilityProcessEnvFromBindings } from '../src/lib/care-ai/care-operability-runtime-env';

describe('Care operability wiring', () => {
  it('routes the Meta webhook through the fail-open operability wrapper', () => {
    const entry = fs.readFileSync('src/pages/api/internal/care-ai-meta-webhook.ts', 'utf8');
    const wrapper = fs.readFileSync('src/pages/api/internal/care-ai-meta-operability-wrapper.ts', 'utf8');

    expect(entry).toContain("import handler from './care-ai-meta-operability-wrapper'");
    expect(entry).toContain('await hydrateCareOperabilityProcessEnv()');
    expect(entry.indexOf('await hydrateCareOperabilityProcessEnv()')).toBeLessThan(entry.indexOf('return handler(req, res)'));
    expect(wrapper).toContain("import router from './care-ai-meta-webhook-router'");
    expect(wrapper).toContain('CARE_META_OPERABILITY_EVENTS_ENABLED');
    expect(wrapper).toContain('verifyMetaPayloadSignature');
    expect(wrapper).toContain("'RECEIVED'");
    expect(wrapper).toContain('markCareOperabilitySafely');
    expect(wrapper).toContain('CARE_OPERABILITY_FINALIZE_DEGRADED');
  });

  it('bridges provider runtime operability bindings into the process env gate view', () => {
    const target: Record<string, string | undefined> = {
      CARE_META_OPERABILITY_EVENTS_ENABLED: 'false',
      CARE_META_OPERABILITY_HEALTH_ENABLED: 'false',
      UNRELATED_RUNTIME_VALUE: 'keep',
    };

    syncCareOperabilityProcessEnvFromBindings({
      CARE_META_OPERABILITY_EVENTS_ENABLED: 'true',
      CARE_META_OPERABILITY_HEALTH_ENABLED: 'true',
      CARE_META_OPERABILITY_HEALTH_TOKEN: 'x'.repeat(32),
      CARE_META_APP_SECRET: 'must-not-copy',
    }, target);

    expect(target.CARE_META_OPERABILITY_EVENTS_ENABLED).toBe('true');
    expect(target.CARE_META_OPERABILITY_HEALTH_ENABLED).toBe('true');
    expect(target.CARE_META_OPERABILITY_HEALTH_TOKEN).toBe('x'.repeat(32));
    expect(target.CARE_META_APP_SECRET).toBeUndefined();
    expect(target.UNRELATED_RUNTIME_VALUE).toBe('keep');

    syncCareOperabilityProcessEnvFromBindings({}, target);
    expect(target.CARE_META_OPERABILITY_EVENTS_ENABLED).toBeUndefined();
    expect(target.CARE_META_OPERABILITY_HEALTH_ENABLED).toBeUndefined();
    expect(target.CARE_META_OPERABILITY_HEALTH_TOKEN).toBeUndefined();
  });

  it('keeps the health endpoint bearer-protected and hydrates runtime bindings before gate evaluation', () => {
    const health = fs.readFileSync('src/pages/api/internal/care-ai-meta-operability-health.ts', 'utf8');

    expect(health).toContain('CARE_META_OPERABILITY_HEALTH_TOKEN');
    expect(health).toContain('timingSafeEqual');
    expect(health).toContain('Bearer ');
    expect(health).toContain('await hydrateCareOperabilityProcessEnv()');
    expect(health.indexOf('await hydrateCareOperabilityProcessEnv()')).toBeLessThan(health.indexOf('if (!enabled())'));
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

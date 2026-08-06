import { describe, expect, it } from 'vitest';

import { PRIORITY_ORDER, queueFixtures } from './synthetic';

describe('WP3.5-A synthetic founder queue', () => {
  it('sorts deterministic care and risk buckets before next-door opportunities', () => {
    const order = queueFixtures.map((item) => PRIORITY_ORDER[item.bucket]);
    expect(order).toEqual([...order].sort((a, b) => a - b));
    expect(queueFixtures[0]?.bucket).toBe('safety_recovery');
    expect(queueFixtures.at(-1)?.bucket).toBe('next_door');
  });

  it('keeps every queue position explainable by facts', () => {
    for (const item of queueFixtures) {
      expect(item.reason.trim().length).toBeGreaterThan(20);
      expect(item.dueLabel.trim().length).toBeGreaterThan(0);
      expect(item.owner.trim().length).toBeGreaterThan(0);
    }
  });

  it('does not expose any customer score field', () => {
    for (const item of queueFixtures) {
      expect(Object.keys(item)).not.toContain('score');
      expect(Object.keys(item)).not.toContain('customerScore');
      expect(Object.keys(item)).not.toContain('conversionProbability');
    }
  });
});

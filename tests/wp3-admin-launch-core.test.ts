import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const page = readFileSync(resolve(process.cwd(), 'src/pages/admin/launch-core.tsx'), 'utf8');

describe('WP3 Admin Launch Core evidence map', () => {
  it('labels only verified technical gates as verified and keeps all external gates explicitly off', () => {
    expect(page).toMatch(/'STAGING VERIFIED'/);
    expect(page).toMatch(/Private Storage', 'OFF'/);
    expect(page).toMatch(/PDF A5', 'OFF'/);
    expect(page).toMatch(/Resend', 'OFF'/);
    expect(page).toMatch(/Cal\.com', 'OFF'/);
    expect(page).toMatch(/Deletion', 'FAIL-CLOSED'/);
    expect(page).toMatch(/Public activation', 'OFF'/);
  });

  it('makes the protected admin evidence page no-store and no-referrer', () => {
    expect(page).toMatch(/Cache-Control', 'no-store'/);
    expect(page).toMatch(/Referrer-Policy', 'no-referrer'/);
  });
});

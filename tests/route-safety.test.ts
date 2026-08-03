import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = path.resolve(__dirname, '..');
const read = (relativePath: string) => fs.readFileSync(path.join(root, relativePath), 'utf8');

describe('B10 private-route indexing and public-flow safety', () => {
  it.each([
    'src/pages/dat-lich/[token].tsx',
    'src/pages/lang-90/dat-lich/[token].tsx',
    'src/pages/lang-90/thanh-toan/[token].tsx',
    'src/pages/hat-mam/dang-ky.tsx',
  ])('%s declares noindex', (relativePath) => {
    expect(read(relativePath)).toMatch(/name=["']robots["'][^>]*content=["'][^"']*noindex/i);
  });

  it('keeps private booking surfaces free of a direct Cal.com destination', () => {
    const sources = [
      read('src/pages/dat-lich/[token].tsx'),
      read('src/pages/lang-90/dat-lich/[token].tsx'),
    ].join('\n');
    expect(sources).not.toMatch(/https?:\/\/[^\s"']*cal\.com/i);
    expect(sources).not.toMatch(/href=["'][^"']*cal\.com/i);
  });

  it('has no public sitemap artifact and keeps the Tally CTA absent from the Hạt Mầm landing route', () => {
    expect(fs.existsSync(path.join(root, 'public', 'sitemap.xml'))).toBe(false);
    expect(fs.existsSync(path.join(root, 'src', 'pages', 'sitemap.xml.ts'))).toBe(false);
    expect(read('src/pages/an-pham-ban-sac-hat-mam.tsx')).not.toContain('tally.so');
  });

  it.each([
    'src/pages/admin/index.tsx',
    'src/pages/admin/lang/[id].tsx',
    'src/pages/admin/hat-mam.tsx',
    'src/pages/admin/hat-mam/[id].tsx',
    'src/pages/admin/thanh-toan.tsx',
    'src/pages/admin/xuat-ban.tsx',
    'src/pages/admin/xoa-du-lieu.tsx',
    'src/pages/admin/cai-dat.tsx',
  ])('%s inherits noindex from AdminShell', (relativePath) => {
    expect(read(relativePath)).toMatch(/AdminShell/);
  });
});

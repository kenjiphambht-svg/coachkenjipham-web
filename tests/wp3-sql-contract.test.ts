import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const sql = readFileSync(resolve(process.cwd(), 'supabase/migrations/0022_wp3_launch_core_foundation.sql'), 'utf8');

describe('WP3 database contracts', () => {
  it('extends existing product records rather than duplicating order/payment foundations', () => {
    expect(sql).toMatch(/references lang_applications|references hatmam_orders|references publications/i);
    expect(sql).toMatch(/create table product_entitlements/i);
    expect(sql).toMatch(/create table publication_versions/i);
  });

  it('keeps RLS deny-by-default and provider/public flags off', () => {
    expect(sql).toMatch(/enable row level security/i);
    expect(sql).toMatch(/revoke all .* from anon, authenticated/is);
    expect(sql).toMatch(/constraint launch_core_flags_off check \(enabled = false\)/i);
  });

  it('prevents receipt reuse and records immutable approval prerequisites', () => {
    expect(sql).toMatch(/evidence_sha256 text not null unique/i);
    expect(sql).toMatch(/unique\(subject, subject_id\)/i);
    expect(sql).toMatch(/publication_version_approval check/i);
  });
});

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const correctionMigration = readFileSync(
  resolve(process.cwd(), 'supabase/migrations/0020_wp1_founder_acceptance_corrections.sql'),
  'utf8'
);

describe('WP1 database safety contracts', () => {
  it('keeps transition concurrency, payment evidence and immutable snapshot checks inside the transaction', () => {
    expect(correctionMigration).toMatch(/where id = p_order_id for update/i);
    expect(correctionMigration).toMatch(/CONCURRENT_UPDATE/);
    expect(correctionMigration).toMatch(/PAYMENT_EVIDENCE_INVALID/);
    expect(correctionMigration).toMatch(/from hatmam_package_snapshots/);
    expect(correctionMigration).toMatch(/v_evidence_amount <> v_amount/);
  });

  it('keeps publication/deletion acceptance synthetic-only and explicitly fail-closed', () => {
    expect(correctionMigration).toMatch(/SYNTHETIC_ONLY/);
    expect(correctionMigration).toMatch(/FAIL_CLOSED_B4_STORAGE_AND_DELETION_GATE/);
    expect(correctionMigration).toMatch(/private Storage object \(NOT CALLED\)/);
  });

  it('keeps new parent intake snapshots tied to the active versioned settings', () => {
    expect(correctionMigration).toMatch(/operational_settings_versions where active = true/i);
    expect(correctionMigration).toMatch(/package_name/);
    expect(correctionMigration).toMatch(/delivery_business_days/);
    expect(correctionMigration).toMatch(/publication_retention_months/);
  });
});

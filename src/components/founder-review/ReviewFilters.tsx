// ============================================================
// Client-local-only filter controls for the Hôm nay screen — WP3.5-A2
// Package C3. Fully controlled: TodayReview owns the state, this component
// only renders inputs and calls back on change. No storage, no network.
// ============================================================

// `React` is imported explicitly for the same reason documented at the top
// of TodayReview.tsx — required for Vitest's esbuild JSX transform.
import React, { type ChangeEvent } from 'react';

import { PRIORITY_BUCKETS, SCENARIO_PRESETS, type ScenarioPreset } from '@/lib/wp3-5/review-selectors';
import type { PriorityBucket } from '@/lib/wp3-5/review-manifest';
import styles from './founder-review.module.css';

export type BlockedFilter = 'all' | 'blocked' | 'unblocked';

export interface TodayFiltersState {
  readonly scenario: ScenarioPreset;
  readonly bucket: PriorityBucket | 'all';
  readonly owner: string | 'all';
  readonly blocked: BlockedFilter;
  readonly search: string;
}

export interface ReviewFiltersProps {
  readonly filters: TodayFiltersState;
  readonly owners: readonly string[];
  readonly onChange: (next: Partial<TodayFiltersState>) => void;
}

export default function ReviewFilters({ filters, owners, onChange }: ReviewFiltersProps) {
  return (
    <div className={styles.filterBar} aria-label="Bộ lọc Hôm nay">
      <label className={styles.filterLabel}>
        Scenario
        <select
          className={styles.select}
          value={filters.scenario}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange({ scenario: e.target.value as ScenarioPreset })}
        >
          {SCENARIO_PRESETS.map((preset) => (
            <option key={preset} value={preset}>
              {preset}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.filterLabel}>
        Bucket
        <select
          className={styles.select}
          value={filters.bucket}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            onChange({ bucket: e.target.value as PriorityBucket | 'all' })
          }
        >
          <option value="all">Tất cả</option>
          {PRIORITY_BUCKETS.map((bucket) => (
            <option key={bucket} value={bucket}>
              {bucket}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.filterLabel}>
        Owner
        <select
          className={styles.select}
          value={filters.owner}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange({ owner: e.target.value })}
        >
          <option value="all">Tất cả</option>
          {owners.map((owner) => (
            <option key={owner} value={owner}>
              {owner}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.filterLabel}>
        Blocked
        <select
          className={styles.select}
          value={filters.blocked}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange({ blocked: e.target.value as BlockedFilter })}
        >
          <option value="all">Tất cả</option>
          <option value="blocked">Đang bị chặn</option>
          <option value="unblocked">Không bị chặn</option>
        </select>
      </label>

      <label className={`${styles.filterLabel} ${styles.filterGrow}`}>
        Tìm Quan hệ (tên hoặc ID)
        <input
          type="text"
          className={styles.input}
          value={filters.search}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange({ search: e.target.value })}
          placeholder="An hoặc SYN-001"
        />
      </label>
    </div>
  );
}

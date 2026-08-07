import React from 'react';
import Link from 'next/link';

import {
  PRODUCT_LENS_OPTIONS,
  buildSafeSyntheticQuery,
  type ProductLensId,
  type ScenarioPreset,
  type SyntheticQueryState,
} from '@/lib/wp3-5/review-selectors';
import styles from './founder-review.module.css';

export interface ProductLensProps {
  readonly scenario: ScenarioPreset;
  readonly product: ProductLensId;
  readonly pathname: string;
  readonly preserve?: Pick<SyntheticQueryState, 'relationship' | 'journey' | 'care' | 'tab'>;
  readonly compact?: boolean;
}

export default function ProductLens({ scenario, product, pathname, preserve = {}, compact = false }: ProductLensProps) {
  return (
    <section className={`${styles.productLens} ${compact ? styles.productLensCompact : ''}`} aria-label="Lọc theo sản phẩm">
      <div className={styles.productLensLabel}>
        <span>Sản phẩm</span>
        <small>Product Lens</small>
      </div>
      <div className={styles.productLensOptions} role="list">
        {PRODUCT_LENS_OPTIONS.map((option) => (
          <Link
            key={option.id}
            href={{
              pathname,
              query: buildSafeSyntheticQuery({ scenario, product: option.id, ...preserve }),
            }}
            aria-current={product === option.id ? 'true' : undefined}
            data-testid={`product-lens-${option.id}`}
            className={product === option.id ? styles.productLensActive : styles.productLensLink}
          >
            {option.label}
          </Link>
        ))}
      </div>
    </section>
  );
}

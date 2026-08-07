import React, { type ReactNode } from 'react';
import styles from './founder-review.module.css';

export function SectionHeading({ children, testId }: { children: ReactNode; testId?: string }) {
  return <h3 className={styles.eyebrow} data-testid={testId}>{children}</h3>;
}

export function WorkspaceHeading({ children }: { children: ReactNode }) {
  return <h2 className={styles.sectionTitle}>{children}</h2>;
}

export function IdTag({ children }: { children: ReactNode }) {
  return <span className={styles.recordMeta}>{children}</span>;
}

export type BadgeVariant = 'neutral' | 'blocked' | 'founder' | 'eligible' | 'silence';
const BADGE_VARIANT: Readonly<Record<BadgeVariant, string>> = {
  neutral: '',
  blocked: styles.badgeWarning,
  founder: styles.badgeFounder,
  eligible: styles.badgeSuccess,
  silence: styles.badgePreview,
};

export function Badge({ variant = 'neutral', children, testId }: { variant?: BadgeVariant; children: ReactNode; testId?: string }) {
  return <span className={`${styles.badge} ${BADGE_VARIANT[variant]}`} data-testid={testId}>{children}</span>;
}

export function StatTile({ label, value, risk = false, testId }: { label: string; value: string | number; risk?: boolean; testId?: string }) {
  return <div className={`${styles.metric} ${risk ? styles.metricWarn : ''}`} data-testid={testId}><p className={styles.metricLabel}>{label}</p><p className={styles.metricValue}>{value}</p></div>;
}

export function RecordCard({ title, meta, selected, urgent, onClick, testId, dataAttrs }: { title: ReactNode; meta: ReactNode; selected?: boolean; urgent?: boolean; onClick: () => void; testId?: string; dataAttrs?: Record<string, string> }) {
  return <button type="button" onClick={onClick} data-testid={testId} {...dataAttrs} className={`${styles.recordCard} ${styles.recordCardButton} ${urgent ? styles.recordCardWarn : ''} ${selected ? styles.recordCardFounder : ''}`}><span className={styles.recordTitle}>{title}</span><span className={styles.recordMeta}>{meta}</span></button>;
}

export function DetailSection({ title, children, testId }: { title: string; children: ReactNode; testId?: string }) {
  return <section className={styles.sectionBlock} data-testid={testId}><SectionHeading>{title}</SectionHeading>{children}</section>;
}

export function ActionLink({ children, testId, className = '' }: { children: ReactNode; testId?: string; className?: string }) {
  return <span data-testid={testId} className={`${styles.button} ${className}`}>{children}</span>;
}

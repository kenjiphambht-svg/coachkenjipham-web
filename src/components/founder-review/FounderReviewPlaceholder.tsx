// ============================================================
// Placeholder card dùng chung cho các trang Founder Review Preview chưa
// xây màn hình đầy đủ (Quan hệ / Hành trình / Chăm sóc — Package C3/C4).
//
// Chỉ hiển thị summary rút gọn lấy từ review-selectors thật — không có dữ
// liệu tự bịa, không network, không ghi.
// ============================================================

import type { ReactNode } from 'react';

export interface FounderReviewPlaceholderStat {
  readonly label: string;
  readonly value: string | number;
}

export interface FounderReviewPlaceholderProps {
  readonly heading: string;
  readonly description: string;
  readonly stats: readonly FounderReviewPlaceholderStat[];
  readonly note?: string;
  readonly children?: ReactNode;
}

export default function FounderReviewPlaceholder({
  heading,
  description,
  stats,
  note,
  children,
}: FounderReviewPlaceholderProps) {
  return (
    <section className="border border-e26-border bg-e26-white px-5 py-6">
      <h2 className="font-serif text-[18px] md:text-[20px] mb-2 text-e26-text">{heading}</h2>
      <p className="font-sans text-[14px] leading-relaxed text-e26-text-2 mb-4">{description}</p>

      {stats.length > 0 && (
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3 mb-4">
          {stats.map((stat) => (
            <div key={stat.label} className="border border-e26-border bg-e26-cream px-3 py-2">
              <dt className="font-sans text-[11px] uppercase tracking-[0.12em] text-e26-text-2">{stat.label}</dt>
              <dd className="font-serif text-[20px] text-e26-text">{stat.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {children}

      {note && <p className="font-sans text-[12px] text-e26-text-2 mt-4">{note}</p>}
    </section>
  );
}

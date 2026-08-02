// ============================================================
// Mảnh giao diện nhỏ dùng lại trong admin. Để riêng trong admin/ —
// KHÔNG đưa vào src/components/ui/ dùng chung với trang khách.
// Ưu tiên: rõ ràng, đọc được, bấm được trên điện thoại.
// ============================================================

import type { ReactNode } from 'react';
import type { HatMamStatus, LangStatus } from '@/lib/domain/states';

export const LANG_STATUS_VI: Record<LangStatus, string> = {
  submitted: 'Mới gửi',
  under_review: 'Đang đọc',
  accepted: 'Đã nhận',
  declined: 'Đã từ chối',
  more_info_needed: 'Cần hỏi thêm',
  awaiting_payment: 'Chờ thanh toán',
  paid: 'Đã nhận tiền',
  scheduled: 'Đã xếp lịch',
  completed: 'Xong',
  cancelled: 'Đã huỷ',
};

export const HATMAM_STATUS_VI: Record<HatMamStatus, string> = {
  submitted: 'Mới gửi',
  awaiting_payment: 'Chờ thanh toán',
  paid: 'Đã nhận tiền',
  in_production: 'Đang viết',
  ready: 'Viết xong',
  delivered: 'Đã giao',
  cancelled: 'Đã huỷ',
};

export function StatusBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block font-sans text-[12px] px-2 py-1 border border-e26-border bg-e26-white whitespace-nowrap">
      {children}
    </span>
  );
}

export function Card({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="border border-e26-border bg-e26-white p-4 md:p-5">
      {title && <h2 className="font-serif text-lg mb-3">{title}</h2>}
      {children}
    </div>
  );
}

export function StatTile({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="border border-e26-border bg-e26-white p-4">
      <div className="font-sans text-[13px] text-e26-text-2 mb-1">{label}</div>
      <div className="font-serif text-[26px] leading-none">{value}</div>
    </div>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <p className="font-sans text-[14px] text-e26-text-2 py-8 text-center">{children}</p>
  );
}

/**
 * Bảng cuộn ngang được trên điện thoại — không để nội dung đẩy cả trang
 * trượt ngang.
 */
export function ScrollTable({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto border border-e26-border bg-e26-white">
      <table className="w-full min-w-[560px] border-collapse font-sans text-[14px]">
        {children}
      </table>
    </div>
  );
}

export function Th({ children }: { children: ReactNode }) {
  return (
    <th className="text-left font-medium text-e26-text-2 px-3 py-2 border-b border-e26-border whitespace-nowrap">
      {children}
    </th>
  );
}

export function Td({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <td className={`px-3 py-2 border-b border-e26-border align-top ${className}`}>{children}</td>
  );
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatMonth(value: string | null | undefined): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return `${String(d.getUTCMonth() + 1).padStart(2, '0')}/${d.getUTCFullYear()}`;
}

import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

// Hệ 5 vai typography riêng cho /ve-kenji — nguồn: brief "VỀ KENJI VÒNG 1"
// mục 4 (docs/brand/essence-typography-composition-system-v1.md CHƯA có
// trong repo tại thời điểm viết — xem phiếu báo cáo PR). File dùng RIÊNG cho
// route này, không đụng file dùng chung (HomeHeader/HomeFooter/globals.css).
// Nhấn nội bộ Anchor/Accent dùng true italic (font-style: italic) — Cormorant
// Garamond ital,wght@1,400/1,500 đã nạp sẵn ở globals.css, không phải nghiêng
// giả (transform/skew). text-wrap: balance cho khối ngắn (chống mồ côi chữ),
// pretty cho đoạn dài.

type Common = {
  children: ReactNode;
  className?: string;
  id?: string;
};

// Vai 1 — Display Voice. Dùng cho H1 (size mặc định) và tầng B của Signal
// Composition (size="signal" — lớn nhất toàn trang, lớn hơn cả H1).
// NGUỒN CHUẨN: docs/brand/essence-typography-composition-system-v1.md (chỉ
// cho tỷ lệ, không cho px) + số px THẬT đã duyệt trong
// src/components/lang-90/Lang90Composition.tsx (Lang90HeroComposition) —
// KHÔNG phải 04_TYPOGRAPHY_SYSTEM_2026.md (file đó chỉ là đề xuất chờ chốt,
// đã sửa lại 27/07/2026 cho khớp bằng chứng này).
// Mobile hero = 34px — khớp ĐÚNG đỉnh Hero thật của /lang-90 (dòng italic
// cuối, text-[34px]). Trùng hợp: số này cũng chính là số tối đa đo được
// trong Type Lab của /ve-kenji không gây overflow ở 390px (40px làm dòng 2
// H1 tràn 342px→384px, gãy thêm dòng 3 + mồ côi "định." — đã thử giữ break
// point ở câu 1 và tìm cách chia lại 2 dòng khác ở 40px nhưng không có cách
// nào giữ đúng ranh giới ngữ nghĩa "mỗi dòng = 1 câu" mà vừa khung; xuống
// dòng giữa câu vi phạm mục 13 "theo ý nghĩa, không theo chiều rộng" nặng
// hơn — nên 34px là lựa chọn đúng, không phải đường tắt).
// Desktop hero = 68px (sửa từ 64px) — khớp ĐÚNG trần Hero thật của /lang-90
// (lg:text-[68px]), không phải số 52–64 của 04_TYPOGRAPHY_SYSTEM_2026.md.
export function EssenceDisplay({
  children,
  className,
  as: As = "h1",
  size = "hero",
}: Common & { as?: ElementType; size?: "hero" | "signal" }) {
  return (
    <As
      className={cn(
        "font-serif font-medium text-e26-text [text-wrap:balance]",
        size === "hero" &&
          "text-[34px] leading-[1.1] tracking-[-0.01em] md:text-[68px] md:leading-[1.05]",
        size === "signal" &&
          "text-[52px] leading-[0.98] tracking-[-0.015em] md:text-[92px] md:leading-[0.95]",
        className
      )}
    >
      {children}
    </As>
  );
}

// Vai 2 — Anchor Voice. H2 mặc định; truyền level="h3" cho câu hỏi FAQ
// (70–80% cỡ H2). Nhấn nội bộ: bọc cụm chữ bằng <em> ngay trong children —
// true italic, quy tắc chung của trang (một cách duy nhất, không lặp cách
// khác).
// Kiểm tỷ lệ theo essence-typography-composition-system-v1.md mục 11
// ("Anchor = 45–65% Hero"): 42/68 = 62% ở desktop — đúng dải. Ở mobile 30/34
// = 88%, vượt dải 45–65%, nhưng /lang-90 thật (Lang90SectionHeading 30px vs
// Lang90HeroComposition đỉnh 34px mobile) cũng ở đúng tỷ lệ 88% — quy tắc
// tỷ lệ trong file gốc chỉ áp cho desktop, mobile nén khoảng cách tự nhiên.
export function EssenceAnchor({
  children,
  className,
  as: As = "h2",
  level = "h2",
}: Common & { as?: ElementType; level?: "h2" | "h3" }) {
  return (
    <As
      className={cn(
        "font-serif font-medium text-e26-text [text-wrap:balance]",
        level === "h2" && "text-[30px] leading-[1.25] tracking-normal md:text-[42px]",
        level === "h3" && "text-[22px] leading-[1.25] tracking-normal md:text-[32px]",
        className
      )}
    >
      {children}
    </As>
  );
}

// Vai 3 — Reading Voice. Một đoạn = một <EssenceBody>. max-width giữ dòng
// 55–70 ký tự; các đoạn liền kề tự xuống dòng nhờ wrapper cha (space-y-*).
export function EssenceBody({ children, className, as: As = "p" }: Common & { as?: ElementType }) {
  return (
    <As
      className={cn(
        "font-sans font-normal text-e26-text-2 [text-wrap:pretty]",
        "text-[17px] leading-[1.7] tracking-normal md:text-[19px] md:leading-[1.75]",
        "max-w-[660px]",
        className
      )}
    >
      {children}
    </As>
  );
}

// Câu mở đầu bold trong một khối Reading Voice (③ giai đoạn, ⑦ la bàn, ⑦b —
// "câu đầu bold, CÙNG DÒNG với phần còn lại"). Ngoại lệ CÓ CHỦ Ý với luật
// "không bold 600+" của 04_TYPOGRAPHY_SYSTEM_2026.md — brief 27/07/2026 của
// Kenji chỉ định rõ Inter 500–600 cho đúng các câu này.
export function EssenceLeadIn({ children }: { children: ReactNode }) {
  return <strong className="font-semibold">{children}</strong>;
}

// Vai 4 — Accent Voice. True italic Cormorant. Đúng 3 lần trên trang (② ⑥ ⑨).
export function EssenceAccent({ children, className, as: As = "p" }: Common & { as?: ElementType }) {
  return (
    <As
      className={cn(
        "font-serif italic font-normal text-e26-text [text-wrap:balance]",
        "text-[21px] leading-[1.4] tracking-normal md:text-[23px]",
        className
      )}
    >
      {children}
    </As>
  );
}

// Vai 5 — Utility Voice. Nhãn nhỏ uppercase, tracking +0.18em.
export function EssenceUtility({ children, className, as: As = "p" }: Common & { as?: ElementType }) {
  return (
    <As
      className={cn(
        "font-sans font-medium uppercase text-e26-text-2",
        "text-[12px] leading-[1.4] tracking-[0.18em] md:text-[13px]",
        className
      )}
    >
      {children}
    </As>
  );
}

// ④ Signal Composition — khối đứng một mình, hai tầng (A → B), LỆCH CHUẨN CÓ
// CHỦ ĐÍCH so với hệ 3 tầng gốc (Kenji đã chốt: không tự thêm tầng C, khối
// này không được có chữ nào khác ngoài A/B). Nhận đúng hai prop text, không
// nhận children — khoá cứng để không ai lỡ tay thêm CTA/heading vào khối.
export function EssenceSignalComposition({
  tierA,
  tierB,
  className,
}: {
  tierA: ReactNode;
  tierB: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-[820px] text-center", className)}>
      <div
        aria-hidden="true"
        className="mx-auto mb-10 h-px w-14 bg-e26-gold md:mb-14 md:w-16"
      />
      <EssenceBody as="p" className="mx-auto text-e26-text-2">
        {tierA}
      </EssenceBody>
      <EssenceDisplay as="p" size="signal" className="mt-6 md:mt-10">
        {tierB}
      </EssenceDisplay>
    </div>
  );
}

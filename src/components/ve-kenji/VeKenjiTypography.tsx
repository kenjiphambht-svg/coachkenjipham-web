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
// Mobile hero = 34px (brief ghi 40px) — đo thật trong Type Lab: ở 390px,
// dòng 2 của H1 ("Tôi tạo khoảng An định.") ở 40px rộng ~384px, tràn khỏi
// khung 342px, gãy thêm dòng 3 và bỏ "định." mồ côi — vi phạm luật "mobile
// hai dòng" + "không từ mồ côi". 34px vẫn nằm trong dải mobile display hợp
// lệ 34–40px của 04_TYPOGRAPHY_SYSTEM_2026.md mục 6.
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
          "text-[34px] leading-[1.1] tracking-[-0.01em] md:text-[64px] md:leading-[1.05]",
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

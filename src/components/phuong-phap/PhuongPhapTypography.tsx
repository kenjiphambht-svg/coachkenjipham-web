import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

// Hệ 5 vai typography riêng cho /phuong-phap — brief "GÓI 05 — /phuong-phap
// VÒNG 1" mục 3. File RIÊNG cho route này (không import từ
// VeKenjiTypography.tsx, theo đúng quy ước worktree 24/07: component/dữ
// liệu/hình ảnh riêng cho từng trang) — nhưng số đo px giữ NGUYÊN, khoá theo
// nguồn essence-typography-composition-system-v1.md (tỷ lệ) +
// src/components/ve-kenji/VeKenjiTypography.tsx (px thật đã duyệt). Không tự
// chế số đo mới.

type Common = {
  children: ReactNode;
  className?: string;
  id?: string;
};

// Vai 1 — Display Voice. H1 duy nhất (Hero).
export function EssenceDisplay({
  children,
  className,
  as: As = "h1",
}: Common & { as?: ElementType }) {
  return (
    <As
      className={cn(
        "font-serif font-medium text-e26-text [text-wrap:balance]",
        "text-[34px] leading-[1.1] tracking-[-0.01em] md:text-[68px] md:leading-[1.05]",
        className
      )}
    >
      {children}
    </As>
  );
}

// Vai 2 — Anchor Voice. H2 mặc định cho tiêu đề Scene; level="h3" cho tiêu đề
// phụ cùng Scene (Scene ④ đứng cùng Scene ③, không tranh vai H2).
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

// Vai 3 — Reading Voice. Một đoạn = một <EssenceBody>.
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

// Câu mở đầu bold trong một khối Reading Voice — bọc tên 3 giai đoạn ở Scene
// ⑤, theo đúng pattern La bàn của /ve-kenji.
export function EssenceLeadIn({ children }: { children: ReactNode }) {
  return <strong className="font-semibold">{children}</strong>;
}

// Vai 4 — Accent Voice. True italic Cormorant.
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

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
//
// SỬA 29/07/2026 (brief "BỎ ẢNH NỀN, DỰNG CHIỀU SÂU BẰNG CODE"): bỏ ảnh nền ở
// mọi section trừ Signal → bỏ luôn context tone sáng/tối (VeKenjiToneProvider)
// từng thêm ở vòng ảnh trước, vì giờ chỉ còn ④ Signal cần chữ sáng (đã có
// prop `onImage` riêng, không cần context). Đổi độ đậm màu chữ theo "Lớp 4 —
// chiều sâu bằng độ đậm màu chữ" của brief: Body/Anchor/Display #1A1A1A đặc
// (trước đây Body dùng e26-text-2 xám nhạt hơn — brief giờ yêu cầu đặc như
// Anchor/Display để "tiến lên trước"); Utility opacity 0.55; Accent opacity
// 0.75. Dùng chung 1 token gốc #1A1A1A (e26-text), chỉ khác opacity — không
// thêm màu ngoài bảng.

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
// cuối, text-[34px]). Desktop hero = 68px — khớp ĐÚNG trần Hero thật của
// /lang-90 (lg:text-[68px]).
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
// Màu #1A1A1A đặc (không phải e26-text-2 xám) — brief 29/07/2026: chữ chính
// (Body/Anchor/Display) đứng cùng một độ đậm để "tiến lên trước".
export function EssenceBody({ children, className, as: As = "p" }: Common & { as?: ElementType }) {
  return (
    <As
      className={cn(
        "font-sans font-normal text-e26-text [text-wrap:pretty]",
        "text-[17px] leading-[1.7] tracking-normal md:text-[19px] md:leading-[1.75]",
        "max-w-[660px]",
        className
      )}
    >
      {children}
    </As>
  );
}

// Câu mở đầu bold trong một khối Reading Voice (③ giai đoạn, ⑥ ba giai đoạn,
// ⑦ la bàn, ⑦b — "câu đầu bold, CÙNG DÒNG với phần còn lại"). Ngoại lệ CÓ CHỦ
// Ý với luật "không bold 600+" của 04_TYPOGRAPHY_SYSTEM_2026.md — brief
// 27/07/2026 của Kenji chỉ định rõ Inter 500–600 cho đúng các câu này.
//
// SỬA 29/07/2026 (brief "TINH CHỈNH NHỊP & PHÂN VAI" việc 3): khối la bàn ⑦
// và ⑦b có 6+3 câu LeadIn nhưng trông phẳng như văn thường vì cùng cỡ chữ
// với Body, chỉ đậm hơn. Tăng cỡ 18px/20px (chênh ~5–6% so Body 17/19px) +
// màu đặc #1A1A1A tường minh (không kế thừa opacity từ span giải thích bọc
// ngoài ở ⑦/⑦b — xem ve-kenji.tsx) để câu mở đầu LUÔN tiến lên trước dù đứng
// cạnh phần giải thích đã lùi màu.
export function EssenceLeadIn({ children }: { children: ReactNode }) {
  return (
    <strong className="font-semibold text-[18px] md:text-[20px] text-[#1A1A1A]">{children}</strong>
  );
}

// Vai 4 — Accent Voice. True italic Cormorant.
// "Chữ thì thầm" — #1A1A1A/75 (opacity 0.75, lùi nhẹ sau Body/Anchor đặc).
//
// SỬA 29/07/2026 (brief "MẠCH SÁNG TỐI THEO NỘI DUNG + RÚT GỌN" việc 3):
// 3 lần → 6 lần (② ⑥ ⑨ gốc + cuối ⑤ cuối ⑦ cuối ⑦b, chuyển từ EssenceBody
// sang Accent, KHÔNG viết thêm chữ mới — 3 câu chuyển đều là câu chốt sẵn có
// của khối). Vượt chuẩn 2–4 lần của
// docs/brand/essence-typography-composition-system-v1.md — Kenji chốt: chuẩn
// đó viết cho trang thường, /ve-kenji dài gấp ba (91 khối body), nghiêng là
// cách đổi giọng mạnh nhất không cần đổi cỡ chữ/màu, cần nhiều điểm nghỉ hơn
// cho mắt giữa các mảng văn dài.
export function EssenceAccent({ children, className, as: As = "p" }: Common & { as?: ElementType }) {
  return (
    <As
      className={cn(
        "font-serif italic font-normal text-[#1A1A1A]/75 [text-wrap:balance]",
        "text-[21px] leading-[1.4] tracking-normal md:text-[23px]",
        className
      )}
    >
      {children}
    </As>
  );
}

// Vai 5 — Utility Voice. Nhãn nhỏ uppercase, tracking +0.18em.
// "Chữ phụ" — #1A1A1A/55 (opacity 0.55, lùi ra sau nhất).
export function EssenceUtility({ children, className, as: As = "p" }: Common & { as?: ElementType }) {
  return (
    <As
      className={cn(
        "font-sans font-medium uppercase text-[#1A1A1A]/55",
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
// onImage: true khi đặt trên ảnh nền tối (01-khe-van-toi — ngoại lệ ảnh DUY
// NHẤT còn lại trên trang) — đổi sang token chữ sáng (e26-text-dark) thay vì
// thêm text-shadow (cấm). Class ve-kenji-signal-* là điểm neo cho
// useVeKenjiSignalReveal (GSAP).
export function EssenceSignalComposition({
  tierA,
  tierB,
  className,
  onImage = false,
}: {
  tierA: ReactNode;
  tierB: ReactNode;
  className?: string;
  onImage?: boolean;
}) {
  return (
    <div className={cn("mx-auto max-w-[820px] text-center", className)}>
      <div
        aria-hidden="true"
        className="mx-auto mb-10 w-14 overflow-hidden md:mb-14 md:w-16"
      >
        <div className="ve-kenji-signal-hairline h-px w-0 bg-e26-gold" />
      </div>
      <EssenceBody
        as="p"
        className={cn("ve-kenji-signal-tier-a mx-auto", onImage && "text-e26-text-dark-2")}
      >
        {tierA}
      </EssenceBody>
      <EssenceDisplay
        as="p"
        size="signal"
        className={cn("ve-kenji-signal-tier-b mt-6 md:mt-10", onImage && "text-e26-text-dark")}
      >
        {tierB}
      </EssenceDisplay>
    </div>
  );
}

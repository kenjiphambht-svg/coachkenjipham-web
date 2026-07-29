"use client";

import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Reveal rất nhẹ cho các section KHÔNG ảnh của /ve-kenji — brief "BỎ ẢNH
// NỀN, DỰNG CHIỀU SÂU BẰNG CODE" 29/07/2026 mục 4: fade + dịch lên 12px,
// 500ms, once: true. Tĩnh, đúng Page Mode "Grounded Presence" — KHÔNG phải
// hiệu ứng mạnh. Tách riêng khỏi useVeKenjiSignalReveal (Signal có parallax
// ảnh + timing riêng, không dùng chung hook này).
// Dùng cùng nguyên tắc "chỉ kill trigger của chính mình" đã sửa ở
// useMistFadeIn.ts (không có global kill ở đây nên không cần, nhưng
// gsap.context().revert() khi unmount đã tự dọn đúng phạm vi).
export function useVeKenjiSectionReveal(containerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const els = Array.from(container.querySelectorAll<HTMLElement>(".ve-kenji-reveal"));

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(els, { opacity: 1, y: 0 });
        return;
      }

      els.forEach((el) => {
        gsap.set(el, { opacity: 0, y: 12 });
        ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          once: true,
          onEnter: () => {
            gsap.to(el, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
          },
        });
      });
    }, container);

    return () => ctx.revert();
  }, [containerRef]);
}

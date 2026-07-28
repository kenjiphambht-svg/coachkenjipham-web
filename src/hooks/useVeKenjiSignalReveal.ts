"use client";

import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Hiệu ứng riêng cho ④ Signal Composition /ve-kenji — brief "LẮP 5 ẢNH THẬT"
// 29/07/2026. Hai chuyển động TÁCH BIỆT, không trộn logic:
// 1) Parallax ảnh nền — liên tục theo tiến độ cuộn (scrub), dịch Y tối đa
//    8% chiều cao ảnh, KHÔNG đổi opacity/độ sáng (giữ nguyên yêu cầu).
// 2) Reveal vạch vàng + tầng chữ A/B — CHẠY ĐÚNG 1 LẦN (once: true) khi vào
//    viewport, giữ đúng cơ chế .e26-reveal đã dùng toàn trang (entrance một
//    lần), không phải hiệu ứng lặp lại khi cuộn qua cuộn lại.
//
// BUG THẬT đã sửa (27→29/07/2026, đo bằng ScrollTrigger.getAll()): hook
// useMistFadeIn (chạy toàn site qua MistFadeProvider) từng gọi
// `ScrollTrigger.getAll().forEach(kill)` — giết LUÔN trigger của hook này
// ~100ms sau khi tạo, khiến reveal đứng yên ở opacity 0 vĩnh viễn dù đã cuộn
// qua. Đã sửa useMistFadeIn.ts để nó chỉ kill đúng trigger của chính nó.
export function useVeKenjiSignalReveal(containerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const imageEl = container.querySelector<HTMLElement>(".ve-kenji-signal-image");
    const hairlineEl = container.querySelector<HTMLElement>(".ve-kenji-signal-hairline");
    const tierAEl = container.querySelector<HTMLElement>(".ve-kenji-signal-tier-a");
    const tierBEl = container.querySelector<HTMLElement>(".ve-kenji-signal-tier-b");

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        if (hairlineEl) gsap.set(hairlineEl, { width: "100%" });
        if (tierAEl) gsap.set(tierAEl, { opacity: 1, y: 0 });
        if (tierBEl) gsap.set(tierBEl, { opacity: 1, y: 0 });
        return;
      }

      // 1) Parallax liên tục — không once, chạy suốt lúc section trong viewport.
      if (imageEl) {
        gsap.fromTo(
          imageEl,
          { yPercent: -4 },
          {
            yPercent: 4,
            ease: "none",
            scrollTrigger: {
              trigger: container,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }

      // 2) Reveal một lần — vạch vàng (0→100% width, 400ms) + tầng A/B so le 300ms.
      if (hairlineEl) gsap.set(hairlineEl, { width: "0%" });
      if (tierAEl) gsap.set(tierAEl, { opacity: 0, y: 12 });
      if (tierBEl) gsap.set(tierBEl, { opacity: 0, y: 12 });

      ScrollTrigger.create({
        trigger: container,
        start: "top 75%",
        once: true,
        onEnter: () => {
          if (hairlineEl) {
            gsap.to(hairlineEl, { width: "100%", duration: 0.4, ease: "power2.out" });
          }
          if (tierAEl) {
            gsap.to(tierAEl, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
              delay: 0.15,
            });
          }
          if (tierBEl) {
            gsap.to(tierBEl, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
              delay: 0.15 + 0.3,
            });
          }
        },
      });
    }, container);

    return () => ctx.revert();
  }, [containerRef]);
}

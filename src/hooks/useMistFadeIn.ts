'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function useMistFadeIn() {
  const router = useRouter();
  // PHẠM VI (SỬA 02/08/2026, brief MODE 5): hook này KHÔNG còn chạy toàn
  // site — MistFadeProvider đã gỡ khỏi _app.tsx (và xoá file). Giờ chỉ 3
  // trang legacy dùng .fade-in-section tự gọi nó: /kidbook,
  // /thanh-toan-goi-1, /thanh-toan-goi-2 (cả 3 vốn đã tự gọi từ trước —
  // provider toàn site từng làm hook chạy TRÙNG 2 lần trên chính các trang
  // này). Listener routeChangeComplete bên dưới giữ nguyên: giờ gần như
  // không còn việc (mount/unmount theo trang đã lo re-setup), nhưng vô hại
  // nhờ cơ chế own-triggers idempotent — không đổi để giữ 3 trang C-03
  // nguyên trạng runtime tuyệt đối.
  // SỬA 29/07/2026 (bug thật phát hiện khi làm /ve-kenji Signal parallax):
  // hook này (lúc đó chạy TOÀN SITE qua MistFadeProvider/_app.tsx) từng
  // `ScrollTrigger.getAll().forEach(kill)` — giết LUÔN mọi ScrollTrigger
  // của bất kỳ component nào khác trên cùng trang (đo được: trigger tạo
  // trong useVeKenjiSignalReveal bị kill ngay ~100ms sau khi tạo, progress
  // đứng yên ở 0 vĩnh viễn dù đã cuộn qua). Chỉ kill đúng trigger CỦA HOOK
  // NÀY tạo ra (lưu trong ref), không đụng ScrollTrigger của hook khác.
  const ownTriggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // Function to setup animations — extracted so we can call on route change
    const setupAnimations = () => {
      // Chỉ kill trigger CỦA HOOK NÀY từ lần setup trước (không phải toàn cục).
      ownTriggersRef.current.forEach(trigger => trigger.kill());
      ownTriggersRef.current = [];

      const elements = gsap.utils.toArray<HTMLElement>('.fade-in-section');

      if (prefersReducedMotion) {
        gsap.set(elements, { opacity: 1, clearProps: 'all' });
        return;
      }

      elements.forEach((el) => {
        // Reset element to initial state (in case it was animated before)
        gsap.set(el, {
          opacity: 0,
          y: 8,
          filter: 'blur(4px)',
          force3D: true,
        });

        const st = ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            gsap.to(el, {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              duration: 1.4,
              ease: 'power2.out',
              force3D: true,
              onComplete: () => {
                gsap.set(el, {
                  clearProps: 'filter,transform,willChange,opacity',
                });
                el.style.opacity = '1';
              },
            });
          },
        });
        ownTriggersRef.current.push(st);
      });

      // Force ScrollTrigger to recalculate positions after setup
      ScrollTrigger.refresh();
    };

    // Initial setup on mount
    // Use setTimeout to ensure DOM is fully rendered after route change
    const timeoutId = setTimeout(setupAnimations, 100);

    // Re-setup on route change (CRITICAL for client-side navigation)
    const handleRouteChange = () => {
      // Wait for new page DOM to be ready
      setTimeout(setupAnimations, 100);
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    // Cleanup on unmount
    return () => {
      clearTimeout(timeoutId);
      router.events.off('routeChangeComplete', handleRouteChange);
      ownTriggersRef.current.forEach(trigger => trigger.kill());
      ownTriggersRef.current = [];
    };
  }, [router.events]);
}
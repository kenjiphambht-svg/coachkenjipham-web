'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function useMistFadeIn() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // Function to setup animations — extracted so we can call on route change
    const setupAnimations = () => {
      // CRITICAL: Kill all existing ScrollTriggers before creating new ones
      // This prevents stale instances from previous route
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());

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

        ScrollTrigger.create({
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
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [router.events]);
}
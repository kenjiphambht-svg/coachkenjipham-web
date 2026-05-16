'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register plugin once
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function useMistFadeIn() {
  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;
    
    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    
    if (prefersReducedMotion) {
      // Show all elements immediately, no animation
      gsap.set('.fade-in-section', { opacity: 1 });
      return;
    }
    
    // Collect all elements with the class
    const elements = gsap.utils.toArray<HTMLElement>('.fade-in-section');
    
    // Store ScrollTrigger instances for cleanup
    const triggers: ScrollTrigger[] = [];
    
    elements.forEach((el) => {
      // Set initial state — values chosen to avoid subpixel issues
      gsap.set(el, {
        opacity: 0,
        y: 8,                       // 8px (NOT 2px) — avoids Retina subpixel-snap
        filter: 'blur(4px)',        // 4px (NOT 2px) — smoother decay to 0
        force3D: true,              // GPU acceleration
      });
      
      // Create ScrollTrigger for this element
      const trigger = ScrollTrigger.create({
        trigger: el as gsap.DOMTarget,
        start: 'top 85%',           // Element enters when its top hits 85% of viewport
        once: true,                  // Animate only once — performance + design intent
        onEnter: () => {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 1.4,           // Slow, meditative pace
            ease: 'power2.out',      // True deceleration — no overshoot, no bounce
            force3D: true,
            onComplete: () => {
              // CRITICAL: Remove all inline styles and composite layer
              // This prevents the "settling" flicker after animation
              gsap.set(el, {
                clearProps: 'filter,transform,willChange,opacity',
              });
              // Re-set opacity to 1 in case clearProps caused flash
              (el as HTMLElement).style.opacity = '1';
            },
          });
        },
      });
      
      triggers.push(trigger);
    });
    
    // CRITICAL CLEANUP: Kill all triggers on unmount
    // Prevents memory leaks during Next.js client-side navigation
    return () => {
      triggers.forEach((trigger) => trigger.kill());
    };
  }, []);
}
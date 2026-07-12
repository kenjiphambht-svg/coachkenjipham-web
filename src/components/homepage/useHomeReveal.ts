import { useEffect } from "react";

// Reveal "hơi thở" riêng cho homepage: fade-up 250ms / 12px, một lần khi vào viewport.
// Scoped bằng class .e26-reveal (CSS trong globals.css) — KHÔNG đụng useMistFadeIn
// vì hook đó dùng chung với /kidbook và payment pages.
// prefers-reduced-motion: CSS đã force hiển thị tức thì, không transition.
export function useHomeReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".e26-reveal"));

    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

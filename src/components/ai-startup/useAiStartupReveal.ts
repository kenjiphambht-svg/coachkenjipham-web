import { useEffect } from "react";

// Reveal riêng cho /ai-startup: fade-up 0.6s/12px, một lần khi vào viewport.
// Scoped qua class .as-reveal — không đụng .fade-in-section (route live khác
// dùng chung hook mist) và không đụng .e26-reveal/.hm-reveal của các trang khác.
export function useAiStartupReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".as-reveal"));

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

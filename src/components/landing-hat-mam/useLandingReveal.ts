import { useEffect } from "react";

// Reveal cho landing Hạt Mầm: fade-up 0.75s/16px (mobile 0.6s/12px qua CSS),
// một lần khi vào viewport. Scoped qua class .hm-reveal — không đụng
// .fade-in-section (route live) và .e26-reveal (homepage).
export function useLandingReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".hm-reveal"));

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
      { threshold: 0.12 }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

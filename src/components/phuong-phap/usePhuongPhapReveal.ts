import { useEffect } from "react";

export function usePhuongPhapReveal() {
  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-phuong-phap-reveal]")
    );

    if (!('IntersectionObserver' in window)) {
      elements.forEach((element) => element.setAttribute("data-phuong-phap-visible", "true"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute("data-phuong-phap-visible", "true");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );

    let cancelled = false;
    const start = () => {
      if (cancelled) return;
      elements.forEach((element) => observer.observe(element));
    };

    if (document.fonts?.ready) {
      document.fonts.ready.then(start);
    } else {
      start();
    }

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, []);
}

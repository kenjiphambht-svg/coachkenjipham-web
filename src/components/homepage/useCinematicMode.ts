import { useCallback, useEffect, useState } from "react";

// Chế độ "điện ảnh theo cú vuốt" — CHỈ /trang-chu-v2, CHỈ mobile (<768px).
// - Mặc định BẬT trên mobile lần đầu vào trang; desktop không bao giờ áp dụng.
// - prefers-reduced-motion: reduce → không bao giờ bật (kèm double-guard CSS).
// - Không auto-carousel: mọi chuyển cảnh đều do người xem vuốt hoặc bấm nút.
// - Không lưu localStorage: mỗi lần vào lại, mobile mặc định bật (đã chốt với Kenji).
export function useCinematicMode() {
  // Lựa chọn CHỦ ĐỘNG của người dùng qua nút toggle.
  // null = chưa từng bấm → mặc định BẬT khi khả dụng.
  // Tách riêng khỏi "available" để viewport dao động (xoay máy, resize)
  // không bị hiểu nhầm thành "người dùng đã tắt".
  const [userChoice, setUserChoice] = useState<boolean | null>(null);
  const [available, setAvailable] = useState(false);
  const [atEnd, setAtEnd] = useState(false);

  // Quyết định khả dụng: mobile + không reduced-motion
  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const decide = () => {
      setAvailable(mobileQuery.matches && !reducedQuery.matches);
    };

    decide();
    mobileQuery.addEventListener("change", decide);
    reducedQuery.addEventListener("change", decide);
    return () => {
      mobileQuery.removeEventListener("change", decide);
      reducedQuery.removeEventListener("change", decide);
    };
  }, []);

  const active = available && (userChoice === null ? true : userChoice);

  // Gắn/gỡ class trên <html> — cleanup khi rời trang (SPA nav) để không
  // dính snap sang route khác.
  useEffect(() => {
    const root = document.documentElement;
    if (active) {
      root.classList.add("cinema-on");
    } else {
      root.classList.remove("cinema-on");
    }
    return () => root.classList.remove("cinema-on");
  }, [active]);

  // Fade cảnh: cảnh nào chạm "vùng giữa màn hình" thì sáng lên
  useEffect(() => {
    if (!active) return;
    const scenes = Array.from(document.querySelectorAll<HTMLElement>(".cinema-scene"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("scene-active", entry.isIntersecting);
        });
      },
      // Vùng giữa màn: cảnh cao hơn viewport vẫn được coi là active khi
      // đang chiếm giữa màn hình
      { rootMargin: "-30% 0px -30% 0px", threshold: 0 }
    );
    scenes.forEach((s) => io.observe(s));
    return () => {
      io.disconnect();
      scenes.forEach((s) => s.classList.remove("scene-active"));
    };
  }, [active]);

  // Theo dõi đã tới cảnh cuối chưa (để ẩn nút mũi tên)
  useEffect(() => {
    if (!active) {
      setAtEnd(false);
      return;
    }
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const scenes = document.querySelectorAll<HTMLElement>(".cinema-scene");
        const last = scenes[scenes.length - 1];
        if (!last) {
          setAtEnd(true);
          return;
        }
        const rect = last.getBoundingClientRect();
        setAtEnd(rect.top < window.innerHeight * 0.5);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [active]);

  const toggle = useCallback(
    () => setUserChoice((prev) => (prev === null ? false : !prev)),
    []
  );

  // Bấm mũi tên → cuộn mượt sang cảnh kế tiếp
  const goNext = useCallback(() => {
    const scenes = Array.from(document.querySelectorAll<HTMLElement>(".cinema-scene"));
    const currentY = window.scrollY;
    const next = scenes.find(
      (s) => s.getBoundingClientRect().top + currentY > currentY + 12
    );
    next?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return { available, active, atEnd, toggle, goNext };
}

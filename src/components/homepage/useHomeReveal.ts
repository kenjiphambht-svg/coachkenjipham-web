import { useEffect } from "react";

// Reveal "hơi thở" riêng cho homepage: fade-up 250ms / 12px, một lần khi vào viewport.
// Scoped bằng class .e26-reveal (CSS trong globals.css) — KHÔNG đụng useMistFadeIn
// vì hook đó dùng chung với /kidbook và payment pages.
// prefers-reduced-motion: CSS đã force hiển thị tức thì, không transition.
// SỬA 21/07/2026 (brief điều tra hiệu ứng Signature Moment, Việc E) — BUG
// THẬT #1 tìm được (đo trên production build, không phải giới hạn công cụ
// như PR#46 nghi): observer chạy NGAY KHI MOUNT, lúc webfont (Cormorant
// Garamond) chưa nạp — layout lúc đó dùng font fallback (Georgia/system) có
// metrics khác, cả khối chữ Hero ngắn hơn ~100px, nên phần tử Signature
// Moment (nằm sát mép dưới viewport) bị tính là ĐANG giao viewport → nhận
// is-visible + unobserve ngay tại load. Font nạp xong, layout giãn ra, phần
// tử tụt xuống DƯỚI mép màn hình (đo thật: rectTop 1103 > viewport 1024 ở
// scrollY=0 mà vẫn is-visible) — nhưng observer đã unobserve, không sửa lại
// được. Người dùng cuộn tới thì animation đã chạy xong từ đời nào → "không
// thấy hiệu ứng nào". FIX: chờ document.fonts.ready (promise LUÔN resolve
// theo spec, kể cả khi font lỗi) rồi mới bắt đầu observe — lúc đó layout đã
// ổn định, phần tử nào thật sự trên màn hình mới reveal ngay, phần tử dưới
// màn hình reveal đúng lúc cuộn tới. Áp cho MỌI phần tử reveal (lỗi này ảnh
// hưởng mọi phần tử nằm gần ranh giới viewport lúc load, không riêng ②b).
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

    let cancelled = false;
    const start = () => {
      if (cancelled) return;
      els.forEach((el) => io.observe(el));
    };
    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(start);
    } else {
      start();
    }

    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, []);
}

"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/router";

// ═══ PHẢN HỒI CHUYỂN TRANG TOÀN SITE (brief MODE 5, 02/08/2026 — Kenji chọn
// phương án A + C) ═══
//
// A — VẠCH SÁNG MÉP TRÊN: một hairline 2px màu gold thương hiệu
//     (--essence-gold-2026) chạy ngang mép trên viewport khi route bắt đầu
//     đổi, trườn dần về ~72% (rồi nhích chậm — "trickle"), và khi route xong
//     thì chạy nốt về 100% rồi tan mềm. Chuyển trang nhanh (~140-230ms đo
//     thật ở audit) KHÔNG nhấp nháy: vạch không biến mất đột ngột mà luôn
//     hoàn thành trọn chu kỳ chạy-nốt + tan (~550ms) ĐÈ TRÊN trang mới —
//     không chặn/không làm chậm việc hiển thị trang mới một mili giây nào.
//
// SỬA 02/08/2026 (Kenji xem preview PR #119: "quá nhanh, không kịp nhận ra"):
// THỜI LƯỢNG HIỂN THỊ TỐI THIỂU (MIN_VISIBLE_MS) — kỹ thuật chuẩn của
// NProgress/GitHub. Route xong ở ~200ms thì vạch mới trườn được một đoạn đã
// bị lệnh chạy-nốt + tan, mắt không kịp đọc ra là có phản hồi. Nay finish()
// đo thời gian đã trôi từ lúc start(); nếu chưa đủ MIN_VISIBLE_MS thì HOÃN
// đúng phần kết (chạy nốt + tan) cho đủ ngưỡng. Trong lúc hoãn vạch KHÔNG
// đứng hình — transition width 700ms→72% vẫn đang chạy nên nó tiếp tục trườn
// mượt tới ~72% rồi mới chạy nốt.
// ĐÁNH ĐỔI ĐÃ CÂN NHẮC: vạch sống thêm vài trăm ms SAU khi trang mới đã hiện
// (hơi trễ nhịp so với thực tế). Chấp nhận được vì đây là overlay 2px,
// pointer-events:none, aria-hidden — không chặn tương tác, không đọc bởi
// screen reader, và KHÔNG làm chậm render trang mới một mili giây nào (chỉ
// kéo dài phần "diễn", đúng nguyên tắc gốc của component).
// Kèm theo: PEG SÁNG ở mút phải vạch (box-shadow gold toả nhẹ) — lý do vạch
// NProgress dù mỏng vẫn dễ bắt mắt: mắt người bám vào đầu sáng đang chạy,
// không bám vào thân vạch. Không thêm element, không đổi màu thương hiệu.
// C — PHẢN HỒI TẠI LIÊN KẾT: link nội bộ vừa bấm được thêm class
//     .nav-departing (mờ nhẹ, CSS ở globals.css) cho tới khi route xong.
//
// VÌ SAO KHÔNG DÙNG GSAP: hiệu ứng chỉ là width/opacity transition — CSS
// thuần đủ, và giữ chunk _app sạch (mục tiêu 2 của brief: gsap đã được đưa
// ra khỏi bundle dùng chung, chỉ còn ở các trang thật sự dùng).
//
// KHÔNG PHẢI HỆ REVEAL THỨ 8: component này chỉ xử lý CHUYỂN TRANG (router
// events), không đụng bất kỳ class reveal cuộn-trong-trang nào
// (.fade-in-section/.e26-reveal/.hm-reveal/.as-reveal/.ve-kenji-reveal).
//
// prefers-reduced-motion — CHỌN MỘT KIỂU (yêu cầu brief): kiểm bằng JS
// matchMedia TẠI THỜI ĐIỂM sự kiện (không cache lúc mount), nhất quán với
// mọi motion chạy bằng JS trong repo (useMistFadeIn, 2 hook ve-kenji,
// Lang90Reveal). Khi reduce: vạch HIỆN NGUYÊN chiều rộng (không animate
// width — width-growth là "motion" thật) và chỉ tan bằng opacity; còn
// .nav-departing vốn chỉ đổi opacity (không chuyển động) nên không cần
// nhánh reduce — ghi rõ tại globals.css.
//
// AN TOÀN:
// - routeChangeError (điều hướng bị hủy, vd double-click nhanh) xử lý như
//   complete → vạch không bao giờ kẹt.
// - Back/Forward của trình duyệt đi qua đúng router.events → tự hoạt động.
// - Hash-only navigation (vd /#mot-goc-de-quay-lai khi đang ở /) KHÔNG bắn
//   routeChange* → vạch không hiện (đúng: không có chuyển trang thật);
//   .nav-departing được dọn qua hashChangeComplete + safety timeout 3s.
// - Fixed 2px + pointer-events:none + aria-hidden → không CLS, không chặn
//   tương tác, không lọt vào accessibility tree.
// Ngưỡng "kịp nhận ra". 450ms là mức thấp nhất mà một chuyển động ngoại vi
// (mép trên viewport, không phải nơi mắt đang nhìn) còn được đọc ra là có
// chủ đích thay vì một cái chớp. Cộng chu kỳ kết (200ms chạy nốt + 350ms
// tan) → trang nhanh nhất cũng cho tổng ~1s có phản hồi nhìn thấy được.
const MIN_VISIBLE_MS = 450;

export default function NavigationFeedback() {
  const router = useRouter();
  const barRef = useRef<HTMLDivElement>(null);
  const trickleRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const activeRef = useRef(false);
  const startedAtRef = useRef(0);
  const departingRef = useRef<HTMLElement | null>(null);
  const departSafetyRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const reduced = () =>
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const clearTimers = () => {
      if (trickleRef.current) clearInterval(trickleRef.current);
      trickleRef.current = null;
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };

    const clearDeparting = () => {
      departingRef.current?.classList.remove("nav-departing");
      departingRef.current = null;
      if (departSafetyRef.current) clearTimeout(departSafetyRef.current);
      departSafetyRef.current = null;
    };

    const start = () => {
      // Double-click/tap liên tiếp: nếu đang chạy thì giữ nguyên tiến độ,
      // không reset về 0 (tránh giật lùi).
      if (activeRef.current) return;
      activeRef.current = true;
      startedAtRef.current = performance.now();
      clearTimers();

      if (reduced()) {
        // Reduce: hiện tĩnh, không animate width.
        bar.style.transition = "none";
        bar.style.width = "100%";
        bar.style.opacity = "0.85";
        return;
      }

      // Reset tức thì về 0 rồi trườn — force reflow để transition ăn.
      bar.style.transition = "none";
      bar.style.width = "0%";
      bar.style.opacity = "1";
      void bar.offsetWidth;
      bar.style.transition = "width 700ms cubic-bezier(0.22, 1, 0.36, 1)";
      bar.style.width = "72%";

      // Trickle: chuyển trang chậm vẫn thấy "đang xử lý" — nhích dần, trần 92%.
      trickleRef.current = setInterval(() => {
        const cur = parseFloat(bar.style.width) || 0;
        if (cur < 92) {
          bar.style.transition = "width 450ms ease-out";
          bar.style.width = `${Math.min(cur + 2.5, 92)}%`;
        }
      }, 500);
    };

    const finish = () => {
      clearDeparting();
      if (!activeRef.current) return;
      activeRef.current = false;
      // Dừng trickle ngay, nhưng KHÔNG đụng transition width đang chạy —
      // trong lúc chờ đủ ngưỡng vạch vẫn tự trườn tiếp về 72%.
      clearTimers();

      // Chu kỳ kết — tách thành hàm để hoãn nguyên khối khi trang quá nhanh.
      const end = () => {
        if (reduced()) {
          // Reduce: chỉ tan bằng opacity (opacity không phải "motion").
          bar.style.transition = "opacity 250ms ease-out";
          bar.style.opacity = "0";
          timersRef.current.push(
            setTimeout(() => {
              bar.style.transition = "none";
              bar.style.width = "0%";
            }, 300)
          );
          return;
        }

        // Chạy nốt về 100% rồi tan — chu kỳ luôn trọn vẹn, không nhấp nháy.
        bar.style.transition = "width 200ms ease-out";
        bar.style.width = "100%";
        timersRef.current.push(
          setTimeout(() => {
            bar.style.transition = "opacity 350ms ease-out";
            bar.style.opacity = "0";
          }, 220)
        );
        timersRef.current.push(
          setTimeout(() => {
            bar.style.transition = "none";
            bar.style.width = "0%";
          }, 650)
        );
      };

      // Trang chậm (đã qua ngưỡng) → kết ngay, không thêm độ trễ nào.
      // Trang nhanh → hoãn đúng phần còn thiếu. Ngưỡng áp dụng cho CẢ nhánh
      // reduce: ở đó vạch hiện tĩnh nguyên chiều rộng nên càng dễ chớp mất
      // nếu tan ngay.
      const hold = MIN_VISIBLE_MS - (performance.now() - startedAtRef.current);
      if (hold <= 0) end();
      else timersRef.current.push(setTimeout(end, hold));
    };

    // C — đánh dấu link nội bộ vừa bấm. PHẢI nghe ở CAPTURE phase (đo thật
    // 02/08/2026 trên production build: event tới document ở capture nhưng
    // KHÔNG bao giờ tới bubble — một handler trong cây React stopPropagation,
    // listener bubble ở document không hề chạy). Capture luôn thấy event
    // trước mọi handler khác nên miễn nhiễm với stopPropagation phía dưới.
    // KHÔNG lọc theo e.defaultPrevented vì chính next/link preventDefault để
    // điều hướng client-side (lọc theo nó sẽ bỏ sót đúng link cần bắt).
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return;
      const a = (e.target as HTMLElement | null)?.closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || !href.startsWith("/")) return; // chỉ link nội bộ
      if (a.target === "_blank" || a.hasAttribute("download")) return;
      // Hash trong cùng trang → không phải chuyển trang, không dim.
      if (href.includes("#") && a.pathname === window.location.pathname) return;

      clearDeparting();
      a.classList.add("nav-departing");
      departingRef.current = a;
      // Safety: click bị handler khác chặn / điều hướng không xảy ra → tự dọn.
      departSafetyRef.current = setTimeout(clearDeparting, 3000);
    };

    router.events.on("routeChangeStart", start);
    router.events.on("routeChangeComplete", finish);
    router.events.on("routeChangeError", finish);
    router.events.on("hashChangeComplete", clearDeparting);
    document.addEventListener("click", onClick, true);

    return () => {
      router.events.off("routeChangeStart", start);
      router.events.off("routeChangeComplete", finish);
      router.events.off("routeChangeError", finish);
      router.events.off("hashChangeComplete", clearDeparting);
      document.removeEventListener("click", onClick, true);
      clearTimers();
      clearDeparting();
    };
  }, [router.events]);

  return (
    <div
      ref={barRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "2px",
        width: "0%",
        opacity: 0,
        zIndex: 70,
        background: "var(--essence-gold-2026)",
        borderRadius: "0 1px 1px 0",
        // Peg: quầng sáng lệch về phải → mút vạch sáng hơn thân, mắt bám vào
        // đầu đang chạy. Dùng color-mix để giữ nguyên token màu thương hiệu
        // (không hardcode hex); trình duyệt không hỗ trợ color-mix chỉ đơn
        // giản bỏ qua box-shadow — vạch vẫn chạy đúng, không vỡ gì.
        boxShadow:
          "2px 0 8px 0 color-mix(in srgb, var(--essence-gold-2026) 60%, transparent)",
        pointerEvents: "none",
      }}
    />
  );
}

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// Header dùng chung cho toàn site (10 trang, không chỉ /trang-chu-v2) — theo
// BRIEF-CLAUDE-CODE-trang-chu-CHOT.md, quyết định B: menu sổ dạng tấm phủ
// toàn màn hình (không còn 6 link nằm ngang trên thanh header).
// 6 mục đều là link trang thật, không còn anchor cuộn (#essence, #hat-mam,
// #ghi-chep đã bỏ khỏi menu theo BAN-CHOT).
const PRODUCT_LINKS = [
  { href: "/ban-sac-cua-ban", label: "Bản Sắc Của Bạn" },
  { href: "/ban-sac-cua-con", label: "Bản Sắc Của Con" },
];

const TRUST_LINKS = [
  { href: "/ve-kenji", label: "Về Kenji" },
  { href: "/phuong-phap", label: "Phương pháp" },
  { href: "/dieu-essence-khong-hua", label: "Điều Essence không hứa" },
  { href: "/lien-he", label: "Liên hệ" },
];

// Lockup logo — chữ ký Kenji (dòng chính) + wordmark Essence Coaching (phụ đề,
// canh giữa bên dưới). Dùng 2 file SVG có sẵn trong public/brand/logo/, KHÔNG
// sửa nội dung file gốc. Header luôn nằm trên nền kem/trong suốt — không dùng
// bản -dark (để dành cho trang có header trên nền tối sau này, nếu có).
// TINH CHỈNH 18/07/2026 (lần 2): Kenji yêu cầu tăng wordmark gấp đôi so với
// mức 67% vừa chỉnh — h-[14px]/h-[17px] → h-[28px]/h-[34px]. LƯU Ý tự phản
// biện: ở mức này wordmark RỘNG HƠN chữ ký (~130% thay vì phụ đề nhỏ hơn dòng
// chính) — đã chụp ảnh thật gửi kèm báo cáo để Kenji xác nhận đúng ý muốn.
// TINH CHỈNH 19/07/2026 (lần 3) — Header gọn lại: gap giữa 2 dòng lockup đã
// đo thật = 4px (mt-1), đã nằm trong khoảng gợi ý 2-6px nên GIỮ NGUYÊN, chỉ
// kéo sát thêm 1 nấc xuống mt-0.5 (2px) theo đúng tinh thần "sát". Phần lớn
// độ cao header đo được (119px) đến từ padding ngoài (py-4), không phải gap
// này — xem HomeHeader's header/nav padding.
// TINH CHỈNH 20/07/2026 (lần 4) — kéo sát thêm nấc cuối: mt-0.5 (2px) →
// mt-0 (0px), 2 dòng chạm sát nhau thật sự. KHÔNG đổi h-10/h-12/h-[28px]/
// h-[34px] của 2 file SVG — chỉ khoảng cách giữa chúng.
function HeaderLogo() {
  return (
    <span className="flex flex-col items-center">
      <img
        src="/brand/logo/kenji-signature-2026.svg"
        alt="Kenji Phạm"
        className="h-10 md:h-12 w-auto"
      />
      <img
        src="/brand/logo/essence-wordmark-minimal-2026.svg"
        alt="Essence Coaching"
        className="h-[28px] md:h-[34px] w-auto mt-0"
      />
    </span>
  );
}

export default function HomeHeader() {
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  // Escape đóng menu + trả focus về nút MENU.
  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;

      // Focus trap: Tab không thoát ra ngoài tấm phủ.
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    firstLinkRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="relative z-50 bg-e26-ivory border-b border-e26-border px-6">
      {/* TINH CHỈNH 19/07/2026 (lần 4, v8-FINAL) — thu gọn thêm: py-2.5 (10px,
          lần 3) vẫn còn thấy dày → py-1.5 (6px). Áp cùng mức cho cả header
          cuộn (đây) lẫn tấm phủ menu (bên dưới) để nhất quán.
          TINH CHỈNH 20/07/2026 (lần 5) — thu hẹp thêm 1 nấc: py-1.5 (6px) →
          py-1 (4px), CHỈ khung/spacing, KHÔNG đụng kích thước 2 file SVG logo
          (giữ nguyên h-10/h-12 chữ ký, h-[28px]/h-[34px] wordmark). Áp cùng
          mức cho cả 2 chỗ (đây + tấm phủ menu bên dưới). */}
      <div className="max-w-[1120px] mx-auto flex items-center justify-between py-1">
        <Link href="/trang-chu-v2" aria-label="Về trang chủ">
          <HeaderLogo />
        </Link>
        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="site-menu-panel"
          className="font-sans text-sm tracking-[0.16em] uppercase text-e26-text hover:text-e26-gold-deep transition-colors duration-300"
        >
          Menu
        </button>
      </div>

      {/* Tấm phủ toàn màn hình — luôn nằm trong DOM để transition mượt,
          ẩn bằng transform + opacity khi đóng (không unmount). */}
      <div
        id="site-menu-panel"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu điều hướng"
        aria-hidden={!open}
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-50 bg-e26-cream transition-all duration-[400ms] ease-out motion-reduce:transition-none motion-reduce:duration-0 ${
          open
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="max-w-[1120px] mx-auto h-full flex flex-col px-6">
          <div className="flex items-center justify-between py-1">
            <Link href="/trang-chu-v2" aria-label="Về trang chủ" onClick={(e) => e.stopPropagation()}>
              <HeaderLogo />
            </Link>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
                menuButtonRef.current?.focus();
              }}
              className="font-sans text-sm tracking-[0.16em] uppercase text-e26-text hover:text-e26-gold-deep transition-colors duration-300"
            >
              Đóng
            </button>
          </div>

          <nav
            aria-label="Điều hướng trang"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 flex flex-col items-start justify-center gap-8 md:gap-10 pb-16 w-fit"
          >
            <div className="flex flex-col gap-4 md:gap-5">
              {PRODUCT_LINKS.map((link, i) => (
                <Link
                  key={link.href}
                  ref={i === 0 ? firstLinkRef : undefined}
                  href={link.href}
                  className="font-serif font-normal text-[32px] md:text-[44px] leading-tight text-e26-text hover:text-e26-gold-deep transition-colors duration-300 min-h-11"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="w-16 h-px bg-e26-border" aria-hidden="true" />

            <div className="flex flex-col gap-4 md:gap-5">
              {TRUST_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-serif font-normal text-[32px] md:text-[44px] leading-tight text-e26-text hover:text-e26-gold-deep transition-colors duration-300 min-h-11"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// Header dùng chung cho toàn site (nhiều trang, không chỉ trang chủ) — theo
// BRIEF-CLAUDE-CODE-trang-chu-CHOT.md, quyết định B: menu sổ dạng tấm phủ
// toàn màn hình (không còn 6 link nằm ngang trên thanh header).
// (SỬA 07/08/2026: bỏ số đếm cụ thể "10 trang" — route /trang-chu-v2 đã
// retire, số trang dùng chung header có thể đổi theo thời gian nên không
// khoá cứng một con số dễ lỗi thời.)
// 6 mục đều là link trang thật, không còn anchor cuộn (#essence, #hat-mam,
// #ghi-chep đã bỏ khỏi menu theo BAN-CHOT).
const PRODUCT_LINKS = [
  { href: "/ban-sac-cua-ban", label: "Bản Sắc Của Bạn" },
  { href: "/ban-sac-cua-con", label: "Bản Sắc Của Con" },
];

// SỬA 23/07/2026 (brief bổ sung mục menu ⑨, MT4) — thêm "Một góc để quay lại".
// Section ⑨ nằm TRÊN trang chủ (không có route trang riêng — 3 card còn "chưa
// mở"), nên trỏ ANCHOR tới section: href đầy đủ "/#..." để chạy
// đúng CẢ khi đang ở trang khác dùng chung Header (10 trang) — bấm sẽ về trang
// chủ rồi cuộn tới ⑨. Đặt ngay SAU "Điều Essence không hứa" (⑧) và TRƯỚC "Liên
// hệ" — đúng thứ tự mạch cuộn trang (⑧ rồi ⑨), giữ Liên hệ ở cuối theo lệ.
// (Lưu ý: menu vốn đã bỏ anchor #essence/#hat-mam/#ghi-chep theo BAN-CHOT; đây
// là anchor DUY NHẤT được thêm lại theo yêu cầu đích danh của Kenji cho ⑨.)
const TRUST_LINKS = [
  { href: "/ve-kenji", label: "Về Kenji" },
  { href: "/phuong-phap", label: "Phương pháp" },
  { href: "/dieu-essence-khong-hua", label: "Điều Essence không hứa" },
  { href: "/#mot-goc-de-quay-lai", label: "Một góc để quay lại" },
  { href: "/lien-he", label: "Liên hệ" },
];

// Brand Pack v1.0 — shared shell uses the approved ESSENCE master identity only.
// Founder signature is reserved for authorship contexts, not global navigation.
function HeaderLogo() {
  return (
    <span className="flex items-center py-1">
      <img
        src="/brand/essence/02_MASTER_LIGHT.svg"
        alt="ESSENCE"
        className="block h-auto w-[180px] md:w-[210px]"
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
        <Link
          href="/"
          aria-label="Về trang chủ"
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-e26-gold focus-visible:ring-offset-4 focus-visible:ring-offset-e26-ivory"
        >
          <HeaderLogo />
        </Link>
        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="site-menu-panel"
          className="font-sans text-sm tracking-[0.16em] uppercase text-e26-text hover:text-e26-gold-deep transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-e26-gold focus-visible:ring-offset-4 focus-visible:ring-offset-e26-ivory"
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
            <Link
              href="/"
              aria-label="Về trang chủ"
              tabIndex={open ? 0 : -1}
              onClick={(e) => e.stopPropagation()}
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-e26-gold focus-visible:ring-offset-4 focus-visible:ring-offset-e26-cream"
            >
              <HeaderLogo />
            </Link>
            <button
              type="button"
              tabIndex={open ? 0 : -1}
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
                menuButtonRef.current?.focus();
              }}
              className="font-sans text-sm tracking-[0.16em] uppercase text-e26-text hover:text-e26-gold-deep transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-e26-gold focus-visible:ring-offset-4 focus-visible:ring-offset-e26-cream"
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
                  tabIndex={open ? 0 : -1}
                  onClick={() => setOpen(false)}
                  className="font-serif font-normal text-[32px] md:text-[44px] leading-tight text-e26-text hover:text-e26-gold-deep transition-colors duration-300 min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-e26-gold focus-visible:ring-offset-4 focus-visible:ring-offset-e26-cream"
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
                  tabIndex={open ? 0 : -1}
                  onClick={() => setOpen(false)}
                  className="font-serif font-normal text-[32px] md:text-[44px] leading-tight text-e26-text hover:text-e26-gold-deep transition-colors duration-300 min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-e26-gold focus-visible:ring-offset-4 focus-visible:ring-offset-e26-cream"
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

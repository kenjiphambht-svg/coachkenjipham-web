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
      <div className="max-w-[1120px] mx-auto flex items-center justify-between py-4">
        <Link href="/trang-chu-v2" aria-label="Về trang chủ">
          <img
            src="/brand/logo/essence-wordmark-inline-2026.svg"
            alt="Essence Coaching — Kenji Phạm"
            className="h-14 w-auto"
          />
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
          <div className="flex items-center justify-between py-4">
            <Link href="/trang-chu-v2" aria-label="Về trang chủ" onClick={(e) => e.stopPropagation()}>
              <img
                src="/brand/logo/essence-wordmark-inline-2026.svg"
                alt="Essence Coaching — Kenji Phạm"
                className="h-14 w-auto"
              />
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

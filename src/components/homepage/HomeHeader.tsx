import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const PRODUCT_LINKS = [
  { href: "/ban-sac-cua-ban", label: "Bản Sắc Của Bạn" },
  { href: "/ban-sac-cua-con", label: "Bản Sắc Của Con" },
];

const TRUST_LINKS = [
  { href: "/ve-kenji", label: "Về Kenji" },
  { href: "/phuong-phap", label: "Phương pháp" },
  { href: "/dieu-essence-khong-hua", label: "Điều Essence không hứa" },
  { href: "/#mot-goc-de-quay-lai", label: "Một góc để quay lại" },
  { href: "/lien-he", label: "Liên hệ" },
];

const HOME_COACHING_CHILDREN = [
  { href: "/ban-sac-cua-ban", label: "Bản Sắc Của Bạn" },
  { href: "/ban-sac-cua-con", label: "Bản Sắc Của Con" },
  { href: "/phuong-phap", label: "Phương pháp coaching" },
];

const HOME_SHARED_LINKS = [
  { href: "/khoi-dau", label: "Khởi đầu" },
  { href: "/ve-kenji", label: "Về Kenji" },
  { href: "/#goc-doc", label: "Góc đọc" },
  { href: "/lien-he", label: "Liên hệ" },
];

const thresholdMotion = "duration-[420ms] ease-out motion-reduce:transition-none motion-reduce:duration-0";

function HeaderLogo() {
  return (
    <span className="flex items-center py-1">
      <img src="/brand/essence/02_MASTER_LIGHT.svg" alt="ESSENCE" className="block h-auto w-[180px] md:w-[210px]" />
    </span>
  );
}

type HomeHeaderProps = {
  homeIa?: boolean;
};

export default function HomeHeader({ homeIa = false }: HomeHeaderProps) {
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
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

  const closeMenu = () => setOpen(false);

  return (
    <header className="relative z-50 border-b border-e26-border bg-e26-ivory px-6">
      <div className="mx-auto flex max-w-[1120px] items-center justify-between py-1">
        <Link href="/" aria-label="Về trang chủ" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-e26-gold focus-visible:ring-offset-4 focus-visible:ring-offset-e26-ivory">
          <HeaderLogo />
        </Link>
        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="site-menu-panel"
          className={`min-h-11 min-w-11 font-sans text-sm uppercase tracking-[0.16em] text-e26-text transition-colors hover:text-e26-gold-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-e26-gold focus-visible:ring-offset-4 focus-visible:ring-offset-e26-ivory ${thresholdMotion}`}
        >
          Menu
        </button>
      </div>

      <div
        id="site-menu-panel"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu điều hướng"
        aria-hidden={!open}
        onClick={closeMenu}
        className={`fixed inset-0 z-50 overflow-hidden bg-e26-cream transition-all ${thresholdMotion} ${open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-3 opacity-0"}`}
      >
        {homeIa && (
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 78% 18%, color-mix(in srgb, var(--essence-white-2026) 74%, transparent), transparent 32%), linear-gradient(118deg, color-mix(in srgb, var(--essence-ivory-2026) 54%, transparent), transparent 58%)",
            }}
            aria-hidden="true"
          />
        )}

        <div className="relative mx-auto flex h-full max-w-[1120px] flex-col px-6 md:px-10">
          <div className="flex items-center justify-between py-1">
            <Link href="/" aria-label="Về trang chủ" tabIndex={open ? 0 : -1} onClick={(e) => e.stopPropagation()} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-e26-gold focus-visible:ring-offset-4 focus-visible:ring-offset-e26-cream">
              <HeaderLogo />
            </Link>
            <button
              type="button"
              tabIndex={open ? 0 : -1}
              onClick={(e) => {
                e.stopPropagation();
                closeMenu();
                menuButtonRef.current?.focus();
              }}
              className={`min-h-11 min-w-11 font-sans text-sm uppercase tracking-[0.16em] text-e26-text transition-colors hover:text-e26-gold-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-e26-gold focus-visible:ring-offset-4 focus-visible:ring-offset-e26-cream ${thresholdMotion}`}
            >
              Đóng
            </button>
          </div>

          {homeIa ? (
            <nav aria-label="Điều hướng trang" onClick={(e) => e.stopPropagation()} className="relative z-10 flex flex-1 overflow-y-auto pb-10 pt-6 md:items-center md:overflow-visible md:pb-12 md:pt-4">
              <div className="w-full md:grid md:grid-cols-12 md:gap-8">
                <div className={`md:col-span-6 md:col-start-5 lg:col-span-5 lg:col-start-5 transition-transform ${open ? "translate-y-0" : "translate-y-3"} ${thresholdMotion}`}>
                  <div>
                    <Link
                      ref={firstLinkRef}
                      href="/coaching"
                      tabIndex={open ? 0 : -1}
                      onClick={closeMenu}
                      className="group relative inline-flex min-h-11 items-center font-serif text-[34px] font-normal leading-[1.06] tracking-[-0.016em] text-e26-text md:text-[40px] lg:text-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-e26-gold focus-visible:ring-offset-4 focus-visible:ring-offset-e26-cream"
                    >
                      ESSENCE Coaching
                      <span className={`absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-[#E0C068] transition-transform group-hover:scale-x-100 ${thresholdMotion}`} aria-hidden="true" />
                    </Link>

                    <div className="mt-3 flex flex-col items-start md:mt-4">
                      {HOME_COACHING_CHILDREN.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          tabIndex={open ? 0 : -1}
                          onClick={closeMenu}
                          className={`group flex min-h-11 w-fit items-center font-sans text-[14px] leading-[1.5] text-e26-text-2 transition-colors hover:text-e26-text md:text-[15px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-e26-gold focus-visible:ring-offset-4 focus-visible:ring-offset-e26-cream ${thresholdMotion}`}
                        >
                          <span className="mr-3 text-[10px] text-[#E0C068]" aria-hidden="true">—</span>
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 md:mt-7">
                    <Link
                      href="/advisory"
                      tabIndex={open ? 0 : -1}
                      onClick={closeMenu}
                      className="group relative inline-flex min-h-11 items-center font-serif text-[34px] font-normal leading-[1.06] tracking-[-0.016em] text-e26-text md:text-[40px] lg:text-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-e26-gold focus-visible:ring-offset-4 focus-visible:ring-offset-e26-cream"
                    >
                      ESSENCE Advisory
                      <span className={`absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-[#E0C068] transition-transform group-hover:scale-x-100 ${thresholdMotion}`} aria-hidden="true" />
                    </Link>
                  </div>

                  <div className="mt-10 flex flex-col items-start md:mt-12">
                    {HOME_SHARED_LINKS.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        tabIndex={open ? 0 : -1}
                        onClick={closeMenu}
                        className={`group relative flex min-h-11 w-fit items-center font-serif text-[27px] font-normal leading-[1.08] tracking-[-0.012em] text-e26-text md:text-[30px] lg:text-[32px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-e26-gold focus-visible:ring-offset-4 focus-visible:ring-offset-e26-cream`}
                      >
                        {link.label}
                        <span className={`absolute bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-[#E0C068] transition-transform group-hover:scale-x-100 ${thresholdMotion}`} aria-hidden="true" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </nav>
          ) : (
            <nav aria-label="Điều hướng trang" onClick={(e) => e.stopPropagation()} className="flex w-fit flex-1 flex-col items-start justify-center gap-8 pb-16 md:gap-10">
              <div className="flex flex-col gap-4 md:gap-5">
                {PRODUCT_LINKS.map((link, i) => (
                  <Link key={link.href} ref={i === 0 ? firstLinkRef : undefined} href={link.href} tabIndex={open ? 0 : -1} onClick={closeMenu} className="min-h-11 font-serif text-[32px] font-normal leading-tight text-e26-text transition-colors duration-300 hover:text-e26-gold-deep md:text-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-e26-gold focus-visible:ring-offset-4 focus-visible:ring-offset-e26-cream">
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="h-px w-16 bg-e26-border" aria-hidden="true" />

              <div className="flex flex-col gap-4 md:gap-5">
                {TRUST_LINKS.map((link) => (
                  <Link key={link.href} href={link.href} tabIndex={open ? 0 : -1} onClick={closeMenu} className="min-h-11 font-serif text-[32px] font-normal leading-tight text-e26-text transition-colors duration-300 hover:text-e26-gold-deep md:text-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-e26-gold focus-visible:ring-offset-4 focus-visible:ring-offset-e26-cream">
                    {link.label}
                  </Link>
                ))}
              </div>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}

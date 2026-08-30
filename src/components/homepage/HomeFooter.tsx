import Link from "next/link";

type HomeFooterProps = {
  homeIa?: boolean;
};

export default function HomeFooter({ homeIa = false }: HomeFooterProps) {
  return (
    <footer className="relative overflow-hidden bg-e26-black px-6 py-16 md:py-20">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 -left-10 select-none font-serif leading-none text-transparent md:-bottom-24 md:-left-14"
        style={{
          fontSize: "clamp(180px, 32vw, 380px)",
          WebkitTextStroke: "1px var(--essence-text-primary-dark-2026)",
          opacity: 0.13,
        }}
      >
        E
      </span>

      <div className="relative mx-auto max-w-4xl text-center">
        {homeIa ? (
          <nav
            aria-label="Liên kết phụ"
            className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-sans text-xs text-e26-text-dark-2"
          >
            <Link href="/chinh-sach-rieng-tu" className="transition-colors duration-300 hover:text-e26-gold">
              Chính sách &amp; Quyền riêng tư
            </Link>
            <span className="text-[#E0C068]/55" aria-hidden="true">·</span>
            <Link href="/ai-startup" className="transition-colors duration-300 hover:text-e26-gold">
              AI Startup
            </Link>
          </nav>
        ) : (
          <>
            <nav
              aria-label="Trang niềm tin"
              className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-sans text-xs text-e26-text-dark-2"
            >
              <Link href="/ve-kenji" className="transition-colors duration-300 hover:text-e26-gold">
                Về Kenji
              </Link>
              <span aria-hidden="true">·</span>
              <Link href="/phuong-phap" className="transition-colors duration-300 hover:text-e26-gold">
                Phương pháp
              </Link>
              <span aria-hidden="true">·</span>
              <Link href="/dieu-essence-khong-hua" className="transition-colors duration-300 hover:text-e26-gold">
                Điều Essence không hứa
              </Link>
            </nav>

            <nav
              aria-label="Chính sách"
              className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-sans text-xs text-e26-text-dark-2"
            >
              <Link href="/chinh-sach-rieng-tu" className="transition-colors duration-300 hover:text-e26-gold">
                Chính sách riêng tư
              </Link>
            </nav>
          </>
        )}

        <div className="mx-auto mt-10 max-w-md border-t border-e26-border-dark pt-8">
          <p className="mb-1 font-sans text-xs uppercase tracking-[0.24em] text-e26-text-dark-2">
            Kenji Phạm
          </p>
          <p className="mb-6 font-sans text-sm text-e26-text-dark-2">Sài Gòn · 2026</p>

          <p className="font-sans text-sm text-e26-text-dark-2">
            <a
              href="mailto:contact@coachkenjipham.com"
              className="text-e26-text-dark transition-colors duration-300 hover:text-e26-gold"
            >
              contact@coachkenjipham.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

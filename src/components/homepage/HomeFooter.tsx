import Link from "next/link";

type HomeFooterProps = {
  homeIa?: boolean;
};

export default function HomeFooter(_props: HomeFooterProps) {
  return (
    <footer id="lien-he" className="relative scroll-mt-10 overflow-hidden bg-e26-black px-6 py-16 md:py-20">
      <div className="relative mx-auto max-w-4xl text-center">
        <p className="mb-12 font-serif text-lg italic text-e26-text-dark md:text-xl">
          Chuyển dòng chảy — Vững nhịp sống.
        </p>

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

        <div className="mx-auto mt-10 max-w-4xl border-t border-e26-border-dark pt-8">
          <p className="mb-1 font-sans text-xs uppercase tracking-[0.24em] text-e26-text-dark-2">
            Kenji Phạm
          </p>
          <p className="mb-6 font-sans text-sm text-e26-text-dark-2">Sài Gòn · 2026</p>

          <p className="font-sans text-sm text-e26-text-dark-2">
            <a
              href="mailto:hello@kenjipham.com"
              className="text-e26-text-dark transition-colors duration-300 hover:text-e26-gold"
            >
              hello@kenjipham.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

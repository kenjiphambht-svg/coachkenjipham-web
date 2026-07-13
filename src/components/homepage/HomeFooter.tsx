import Link from "next/link";

// Section 8 — Footer: black, tối giản, 3 tầng thông tin.
// Tầng 1: định danh — monogram 2026 (bản -dark cho nền đen) + caption chữ.
// Tầng 2: liên hệ. Tầng 3: đối tác lặng + bản quyền.
export default function HomeFooter() {
  return (
    <footer id="lien-he" className="bg-e26-black px-6 py-16 md:py-20 scroll-mt-10">
      <div className="max-w-4xl mx-auto text-center">
        {/* Tầng 1 — Định danh: monogram nhỏ + caption chữ */}
        <img
          src="/brand/logo/essence-monogram-2026-dark.svg"
          alt="Essence Coaching"
          className="h-10 w-10 mx-auto mb-4"
        />
        <p className="font-sans text-xs tracking-[0.24em] uppercase text-e26-text-dark-2 mb-1">
          Kenji Phạm
        </p>
        <p className="font-sans text-sm text-e26-text-dark-2">Sài Gòn · 2026</p>

        {/* Tầng 2 — Liên hệ */}
        <div className="border-t border-e26-border-dark max-w-md mx-auto mt-10 pt-8">
          <p className="font-sans text-sm text-e26-text-dark-2">
            Liên hệ:{" "}
            <a
              href="mailto:contact@coachkenjipham.com"
              className="text-e26-text-dark hover:text-e26-gold transition-colors duration-300"
            >
              contact@coachkenjipham.com
            </a>
          </p>
        </div>

        {/* Tầng 3 — Trang pháp lý/tin cậy */}
        <div className="border-t border-e26-border-dark max-w-md mx-auto mt-8 pt-8">
          <nav
            aria-label="Trang pháp lý và tin cậy"
            className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-sans text-xs text-e26-text-dark-2"
          >
            <Link href="/dieu-essence-khong-hua" className="hover:text-e26-gold transition-colors duration-300">
              Điều Essence không hứa
            </Link>
            <span aria-hidden="true">·</span>
            <Link href="/chinh-sach-rieng-tu" className="hover:text-e26-gold transition-colors duration-300">
              Chính sách riêng tư
            </Link>
            <span aria-hidden="true">·</span>
            <Link href="/lien-he" className="hover:text-e26-gold transition-colors duration-300">
              Liên hệ
            </Link>
          </nav>
        </div>

        {/* Tầng 4 — Đối tác lặng + bản quyền */}
        <div className="border-t border-e26-border-dark max-w-md mx-auto mt-8 pt-8">
          <p className="font-sans text-xs text-e26-text-dark-2 mb-3">
            Dành cho đối tác &amp; nhà tài trợ —{" "}
            <Link
              href="/ai-startup"
              className="hover:text-e26-gold transition-colors duration-300 underline underline-offset-4 decoration-e26-border-dark"
            >
              Essence AI Startup Dossier
            </Link>
          </p>
          <p className="font-sans text-xs text-e26-text-dark-2">
            © 2026 Essence Coaching
          </p>
        </div>
      </div>
    </footer>
  );
}

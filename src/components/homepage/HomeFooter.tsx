import Link from "next/link";

// Section 8 — Footer: black, tối giản, 3 tầng thông tin.
// Wordmark bằng typography (Cormorant + token e26) — không dùng SVG wordmark cũ
// vì asset đó nhúng vàng cũ #c9a84c và tagline cũ, sai brand 2026.
// Tầng 1: định danh (wordmark). Tầng 2: liên hệ. Tầng 3: đối tác lặng + bản quyền.
export default function HomeFooter() {
  return (
    <footer id="lien-he" className="bg-e26-black px-6 py-16 md:py-20 scroll-mt-10">
      <div className="max-w-4xl mx-auto text-center">
        {/* Tầng 1 — Wordmark / định danh */}
        <p className="font-sans text-xs tracking-[0.24em] uppercase text-e26-text-dark-2 mb-3">
          Kenji Phạm
        </p>
        <p className="font-serif font-light text-3xl md:text-4xl text-e26-text-dark">
          Essence Coaching
        </p>
        <p className="font-sans text-sm text-e26-text-dark-2 mt-3">Sài Gòn · 2026</p>

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

        {/* Tầng 3 — Đối tác lặng + bản quyền */}
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

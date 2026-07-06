import Link from "next/link";

// Section 8 — Footer: black, tối giản. Dòng đối tác lặng (text nhỏ → /ai-startup),
// không CTA lớn, không grid link. Route chưa tồn tại (chính sách riêng tư...) không link.
export default function HomeFooter() {
  return (
    <footer className="bg-e26-black px-6 py-14 md:py-16">
      <div className="max-w-4xl mx-auto text-center">
        <p className="font-serif text-xl text-e26-text-dark mb-1">
          Kenji Phạm · Essence Coaching
        </p>
        <p className="font-sans text-sm text-e26-text-dark-2 mb-8">Sài Gòn · 2026</p>
        <p className="font-sans text-sm text-e26-text-dark-2 mb-2">
          Liên hệ:{" "}
          <a
            href="mailto:contact@coachkenjipham.com"
            className="text-e26-text-dark hover:text-e26-gold transition-colors duration-300"
          >
            contact@coachkenjipham.com
          </a>
        </p>
        <div className="border-t border-e26-border-dark max-w-xs mx-auto mt-8 pt-6">
          <p className="font-sans text-xs text-e26-text-dark-2">
            Dành cho đối tác &amp; nhà tài trợ —{" "}
            <Link
              href="/ai-startup"
              className="hover:text-e26-gold transition-colors duration-300 underline underline-offset-4 decoration-e26-border-dark"
            >
              Essence AI Startup Dossier
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

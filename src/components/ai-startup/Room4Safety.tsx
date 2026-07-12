import { Shield, CheckCircle2 } from "lucide-react";

// ============================================================
// PHÒNG 4 — AN TOÀN (Section: Safety)
// DARK SILENCE DUY NHẤT của toàn trang — đúng quy tắc ≤25% đen toàn trang,
// và đây là section trang trọng nhất (ranh giới an toàn) nên hợp lý nhất để
// đặt khoảng lặng, giống pattern homepage/landing khác trong repo.
// Chữ nguyên văn từ ai-startup-noi-dung-cu.md.
// ============================================================
const BOUNDARIES = [
  "No diagnosis",
  "No deterministic labeling",
  "No crisis handling by AI",
  "Human review for high-risk outputs",
  "Clear escalation and referral boundaries",
  "Coaching language, not clinical claims",
];

export default function Room4Safety() {
  return (
    <section id="safety" className="bg-e26-black px-6 py-20 md:py-32 scroll-mt-16">
      <div className="max-w-[820px] mx-auto text-center">
        <Shield className="as-reveal w-10 h-10 text-e26-gold mx-auto mb-8" />
        <h2 className="as-reveal font-serif font-normal text-[28px] md:text-[38px] leading-tight text-e26-text-dark mb-8">
          Built with human safety boundaries from day one.
        </h2>
        <p className="as-reveal font-sans text-[17px] leading-[1.65] text-e26-text-dark-2 mb-6">
          Essence AI is not therapy, diagnosis, medical advice, crisis intervention, or emergency
          support.
        </p>
        <p className="as-reveal font-sans text-[17px] leading-[1.65] text-e26-text-dark mb-14">
          It is designed for reflective coaching support, emotional self-awareness, guided
          journaling, and action planning. Sensitive cases are flagged for human review or
          referral.
        </p>
        <div className="as-reveal grid md:grid-cols-2 gap-4 text-left">
          {BOUNDARIES.map((b) => (
            <div key={b} className="flex items-start gap-3 border border-e26-border-dark p-4">
              <CheckCircle2 className="w-5 h-5 text-e26-gold flex-shrink-0 mt-0.5" />
              <span className="font-sans text-[15px] text-e26-text-dark">{b}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

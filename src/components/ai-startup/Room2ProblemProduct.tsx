import { Brain, Target, Zap } from "lucide-react";

// ============================================================
// PHÒNG 2 — VẤN ĐỀ & SẢN PHẨM (Section: Vấn đề + Section: Product)
// Nhịp màu: cream → ivory. Chữ nguyên văn từ ai-startup-noi-dung-cu.md.
// ============================================================
export default function Room2ProblemProduct() {
  return (
    <>
      <section className="bg-e26-cream px-6 py-16 md:py-24">
        <div className="max-w-[820px] mx-auto text-center">
          <h2 className="as-reveal font-serif font-normal text-[28px] md:text-[38px] leading-tight text-e26-text mb-8">
            Modern high-performers are not lacking information.
            <br />
            They are drowning in inner noise.
          </h2>
          <p className="as-reveal font-sans text-[17px] leading-[1.65] text-e26-text-2 mb-10">
            Founders, traders, leaders, and solo entrepreneurs often know what to do — but
            emotional loops, fear, over-control, avoidance, and identity conflict keep pulling
            them back.
          </p>
          <div className="as-reveal space-y-2">
            <p className="font-sans text-lg text-e26-text">Most tools give more content.</p>
            <p className="font-serif italic text-2xl text-e26-gold-deep">
              Essence gives a reflective operating system.
            </p>
          </div>
        </div>
      </section>

      <section id="product" className="bg-e26-ivory px-6 py-16 md:py-24 scroll-mt-16">
        <div className="max-w-[1040px] mx-auto">
          <h2 className="as-reveal font-serif font-normal text-[28px] md:text-[38px] leading-tight text-e26-text text-center mb-8">
            A multi-agent coaching intelligence system.
          </h2>
          <p className="as-reveal font-sans text-[17px] leading-[1.65] text-e26-text-2 text-center max-w-2xl mx-auto mb-14">
            Essence transforms raw user input — journal entries, emotional check-ins, life
            context, and decision points — into structured psychological insights and practical
            next steps.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="as-reveal border-t border-e26-border pt-6">
              <Brain className="w-6 h-6 text-e26-gold mb-4" />
              <h3 className="font-serif text-xl text-e26-text mb-2">Emotional Resonance Agent</h3>
              <p className="font-sans text-[15px] text-e26-text-2">Names emotional conflicts safely.</p>
            </div>
            <div className="as-reveal border-t border-e26-border pt-6">
              <Zap className="w-6 h-6 text-e26-gold mb-4" />
              <h3 className="font-serif text-xl text-e26-text mb-2">Horizon Challenge Agent</h3>
              <p className="font-sans text-[15px] text-e26-text-2">
                Asks coaching-grade questions to challenge limiting loops.
              </p>
            </div>
            <div className="as-reveal border-t border-e26-border pt-6">
              <Target className="w-6 h-6 text-e26-gold mb-4" />
              <h3 className="font-serif text-xl text-e26-text mb-2">Vision Reality Agent</h3>
              <p className="font-sans text-[15px] text-e26-text-2">
                Turns insight into action plans, rituals, and dashboard tasks.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

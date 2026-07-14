import AudioNote from "@/components/landing-hat-mam/AudioNote";

// ============================================================
// PHÒNG 1 — HERO + PHÒNG 2 — KHOẢNG LẶNG (dark silence duy nhất)
// Tái dùng nguyên layout/pattern Room1Entrance.tsx (Hạt Mầm) — cùng đã
// dùng cho Room1HeroKP.tsx (Khám Phá). Copy NGUYÊN VĂN theo task.
// ============================================================
export default function Room1HeroGM() {
  return (
    <>
      {/* --- PHÒNG 1 — HERO --- */}
      <section className="bg-e26-ivory px-6 pt-24 pb-20 md:pt-36 md:pb-32">
        <div className="max-w-[1040px] mx-auto">
          <div className="max-w-2xl">
            <p className="hm-reveal font-sans text-xs tracking-[0.08em] uppercase text-e26-gold-deep mb-6">
              Bản Sắc Của Con · 14–21 tuổi
            </p>
            <h1 className="hm-reveal font-serif font-light text-[34px] md:text-[52px] leading-[1.2] text-e26-text mb-8">
              Con vẫn ở trong nhà. Nhưng có một cánh cửa đã khép hờ.
            </h1>
            <p className="hm-reveal hm-d1 font-sans text-[17px] leading-[1.65] text-e26-text-2 mb-10 max-w-xl">
              Tuổi giao mùa — con vừa muốn tách ra để tìm mình, vừa chưa biết mình là ai nếu
              không còn là &ldquo;con của ba mẹ&rdquo;. Ấn phẩm này không giúp ba mẹ giữ con lại.
              Nó giúp ba mẹ đứng đúng khoảng cách.
            </p>

            <div className="hm-reveal hm-d2 mb-12">
              <AudioNote />
            </div>

            <div className="hm-reveal hm-d3 flex flex-col sm:flex-row gap-4">
              <a
                href="#san-pham"
                className="inline-block text-center bg-e26-gold text-e26-black rounded-none font-sans font-medium text-[13px] tracking-[0.08em] uppercase px-9 py-4 hover:bg-e26-gold-deep hover:text-e26-ivory transition-colors duration-300"
              >
                Tìm hiểu ấn phẩm Giao Mùa
              </a>
              <a
                href="#san-pham"
                className="inline-block text-center border border-e26-text text-e26-text rounded-none font-sans font-medium text-[13px] tracking-[0.08em] uppercase px-9 py-4 hover:border-e26-gold-deep hover:text-e26-gold-deep transition-colors duration-300"
              >
                Xem bên trong có gì
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* --- PHÒNG 2 — KHOẢNG LẶNG (dark silence duy nhất giữa trang) --- */}
      <section className="bg-e26-black px-6 min-h-[50vh] md:min-h-[55vh] flex items-center justify-center">
        <div className="max-w-xl mx-auto text-center py-20">
          <p className="hm-reveal hm-reveal-slow font-serif text-xl md:text-2xl leading-[1.9] text-e26-text-dark">
            Con không rời xa ba mẹ.
            <br />
            Con đang đi tìm chính mình — và cần biết đường về vẫn sáng đèn.
          </p>
        </div>
      </section>
    </>
  );
}

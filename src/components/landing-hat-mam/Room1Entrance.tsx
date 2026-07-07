import AudioNote from "./AudioNote";

// ============================================================
// PHÒNG 1 — CỬA VÀO (Section 1 Hero + Section 2 Khoảng lặng)
// Hero: nền ivory, kicker "Bản Sắc Của Con", display Cormorant 56–64px,
// audio note, CTA chính nút vàng (1/3 nút vàng toàn trang) + CTA phụ nút viền.
// Khoảng lặng: dark silence DUY NHẤT giữa trang — 50–60vh desktop, câu nhỏ
// #FAF9F7 fade-in chậm. Copy nguyên văn docs/product/landing-hat-mam-v3-copy.md.
// ============================================================
export default function Room1Entrance() {
  return (
    <>
      {/* --- SECTION 1 — HERO --- */}
      <section className="bg-e26-ivory px-6 pt-24 pb-20 md:pt-36 md:pb-32">
        <div className="max-w-[1040px] mx-auto">
          <div className="max-w-2xl">
            <p className="hm-reveal font-sans text-xs tracking-[0.08em] uppercase text-e26-gold-deep mb-6">
              Bản Sắc Của Con
            </p>
            <h1 className="hm-reveal font-serif font-light text-[40px] md:text-[62px] leading-[1.1] text-e26-text mb-4">
              Bản Sắc Hạt Mầm
            </h1>
            <p className="hm-reveal hm-d1 font-serif text-xl md:text-2xl text-e26-text-2 mb-10">
              Ấn phẩm cá nhân hóa dành cho bé 0–7 tuổi
            </p>

            <p className="hm-reveal hm-d1 font-serif italic text-xl leading-relaxed text-e26-text mb-8">
              Con không đến thế giới này để trở thành một ai đó khác.
              <br />
              Con đến để là chính mình.
            </p>

            <p className="hm-reveal hm-d2 font-sans text-[17px] leading-[1.65] text-e26-text-2 mb-8">
              Bản Sắc Hạt Mầm là một ấn phẩm cá nhân hóa thuộc dòng{" "}
              <span className="font-medium">Bản Sắc Của Con</span>, giúp ba mẹ nhìn thấy Nhịp điệu
              riêng, cảm xúc đầu đời và hạt mầm tài năng của con trong bảy năm đầu tiên.
            </p>

            <div className="hm-reveal hm-d2 font-sans text-[17px] leading-[1.8] text-e26-text mb-6">
              <p>Không dự đoán số phận.</p>
              <p>Không dán nhãn.</p>
              <p>Không kết luận con phải trở thành ai.</p>
            </div>

            <p className="hm-reveal hm-d2 font-sans text-[17px] leading-[1.65] text-e26-text mb-10">
              Chỉ giúp ba mẹ nhìn con rõ hơn — để thương con đúng hơn.
            </p>

            <p className="hm-reveal hm-d3 font-sans text-sm leading-[1.65] text-e26-text-2 mb-10 max-w-xl">
              Nếu con đã lớn hơn 7 tuổi, Kenji vẫn có hai phiên bản riêng:{" "}
              <span className="font-medium">Bản Sắc Khám Phá</span> cho giai đoạn 7–14 và{" "}
              <span className="font-medium">Bản Sắc Giao Mùa</span> cho giai đoạn 14–21.
            </p>

            <div className="hm-reveal hm-d3 mb-12">
              <AudioNote />
            </div>

            <div className="hm-reveal hm-d3 flex flex-col sm:flex-row gap-4">
              <a
                href="#hai-goi"
                className="inline-block text-center bg-e26-gold text-e26-black rounded-none font-sans font-medium text-[13px] tracking-[0.08em] uppercase px-9 py-4 hover:bg-e26-gold-deep hover:text-e26-ivory transition-colors duration-300"
              >
                Mở cuốn sách của con
              </a>
              <a
                href="#hai-goi"
                className="inline-block text-center border border-e26-text text-e26-text rounded-none font-sans font-medium text-[13px] tracking-[0.08em] uppercase px-9 py-4 hover:border-e26-gold-deep hover:text-e26-gold-deep transition-colors duration-300"
              >
                Trò chuyện cùng Kenji
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 2 — KHOẢNG LẶNG (dark silence duy nhất giữa trang) --- */}
      <section className="bg-e26-black px-6 min-h-[50vh] md:min-h-[55vh] flex items-center justify-center">
        <div className="max-w-xl mx-auto text-center py-20">
          <p className="hm-reveal hm-reveal-slow font-serif text-xl md:text-2xl leading-[1.9] text-e26-text-dark">
            Trước khi hiểu con,
            <br />
            ba mẹ có thể chậm lại một chút.
          </p>
          <p className="hm-reveal hm-reveal-slow hm-d2 font-serif text-xl md:text-2xl leading-[1.9] text-e26-text-dark mt-8">
            Vì có những điều về con
            <br />
            không thể nhìn thấy bằng sự vội vàng.
          </p>
        </div>
      </section>
    </>
  );
}

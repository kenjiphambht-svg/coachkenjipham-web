import AudioNote from "@/components/landing-hat-mam/AudioNote";

// ============================================================
// PHÒNG 1 — HERO + PHÒNG 2 — KHOẢNG LẶNG (dark silence duy nhất)
// Tái dùng nguyên layout/pattern của Room1Entrance.tsx (Hạt Mầm): cùng
// class hm-reveal/hm-d*, cùng cấu trúc kicker/headline/sub/CTA đôi +
// khối dark 50–60vh. Copy NGUYÊN VĂN theo task, không tự viết thêm.
// LINE_STATUS = preview: cả 2 CTA đều là điều hướng cuộn (không phải
// hành vi mua), nên vẫn giữ 1 nút vàng + 1 nút viền như Hạt Mầm —
// không có gì để "mua" ở trạng thái preview nên không vi phạm tinh
// thần ẩn giá.
// ============================================================
export default function Room1HeroKP() {
  return (
    <>
      {/* --- PHÒNG 1 — HERO --- */}
      <section className="bg-e26-ivory px-6 pt-24 pb-20 md:pt-36 md:pb-32">
        <div className="max-w-[1040px] mx-auto">
          <div className="max-w-2xl">
            <p className="hm-reveal font-sans text-xs tracking-[0.08em] uppercase text-e26-gold-deep mb-6">
              Bản Sắc Của Con · 7–14 tuổi
            </p>
            <h1 className="hm-reveal font-serif font-light text-[36px] md:text-[54px] leading-[1.15] text-e26-text mb-8">
              Con đang bước ra thế giới. Và thế giới bắt đầu chấm điểm con.
            </h1>
            <p className="hm-reveal hm-d1 font-sans text-[17px] leading-[1.65] text-e26-text-2 mb-10 max-w-xl">
              Trường lớp, bạn bè, những lần đầu thất bại. Con không còn là em bé để ba mẹ đọc hộ
              — nhưng chưa đủ lời để tự kể về mình. Ấn phẩm này là một bản đồ quan sát cho quãng
              đường đó.
            </p>

            <div className="hm-reveal hm-d2 mb-12">
              <AudioNote />
            </div>

            <div className="hm-reveal hm-d3 flex flex-col sm:flex-row gap-4">
              <a
                href="#san-pham"
                className="inline-block text-center bg-e26-gold text-e26-black rounded-none font-sans font-medium text-[13px] tracking-[0.08em] uppercase px-9 py-4 hover:bg-e26-gold-deep hover:text-e26-ivory transition-colors duration-300"
              >
                Tìm hiểu ấn phẩm Khám Phá
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
            Điểm số đo được bài kiểm tra.
            <br />
            Không đo được đứa trẻ.
          </p>
        </div>
      </section>
    </>
  );
}

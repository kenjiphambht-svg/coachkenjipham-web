// Section 1 — Hero: trạng thái con người. Nền ivory, căn trái, 7/12 cột trái,
// 5/12 phải để trống có chủ đích. Display 60–68px desktop / 38px mobile, LH 1.08.
// Điểm vàng duy nhất của viewport: gạch vàng 24px trước kicker.
// Luật: không "AI", không thuật ngữ hệ, không lời hứa (File 04 mục 2.1). Không nút vàng.
export default function HomeHero() {
  return (
    <section className="cinema-scene bg-e26-ivory px-6 pt-28 pb-20 md:py-40">
      <div className="max-w-[1120px] mx-auto">
        <div className="grid md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="e26-reveal font-sans text-sm text-e26-text-2 mb-10">
              <span className="inline-block w-6 h-px bg-e26-gold align-middle mr-3" aria-hidden="true" />
              Kenji Phạm — Essence Coach
            </p>
            <h1 className="e26-reveal font-serif font-light text-[38px] md:text-[66px] leading-[1.08] text-e26-text text-balance">
              Lâu rồi, chưa ai hỏi bạn đang thế nào.
            </h1>
            <p className="e26-reveal font-sans text-[17px] leading-[1.65] text-e26-text-2 mt-10 max-w-xl">
              Bạn vẫn đi làm, vẫn chu toàn cho người khác. Essence Coaching — không gian của
              Kenji Phạm — là nơi bạn dừng lại một nhịp, nhìn rõ mình, rồi tự chọn lại nhịp
              sống của mình.
            </p>
          </div>
          {/* 5/12 phải: khoảng trống có chủ đích */}
        </div>
      </div>
    </section>
  );
}

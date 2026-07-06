// Section 1 — Hero: trạng thái con người. Nền ivory, căn trái, display 56–64px.
// Luật: không "AI", không thuật ngữ hệ, không lời hứa (File 04 mục 2.1). Không nút vàng.
export default function HomeHero() {
  return (
    <section className="bg-e26-ivory px-6 pt-28 pb-24 md:pt-40 md:pb-32">
      <div className="max-w-[1120px] mx-auto">
        <div className="max-w-3xl">
          <p className="fade-in-section font-sans text-sm text-e26-text-2 mb-10">
            Kenji Phạm — Essence Coach
          </p>
          <h1 className="fade-in-section font-serif font-light text-[38px] md:text-[64px] leading-[1.1] text-e26-text text-balance">
            Vẫn đi làm, vẫn lo cho người khác — chỉ là lâu rồi, chưa ai hỏi bạn đang thế nào.
          </h1>
          {/* Điểm vàng duy nhất của viewport hero: một hairline, căn trái */}
          <div className="fade-in-section w-12 h-px bg-e26-gold mt-12" aria-hidden="true" />
          <p className="fade-in-section font-sans text-[17px] leading-[1.65] text-e26-text-2 mt-10 max-w-xl">
            Trang này không vội. Bạn cứ đi chậm từng đoạn, rồi tự chọn cánh cửa phù hợp với mình.
          </p>
        </div>
      </div>
    </section>
  );
}

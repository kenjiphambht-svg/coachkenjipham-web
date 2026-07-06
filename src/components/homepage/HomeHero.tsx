// Section 1 — Hero: trạng thái con người. Nền ivory, không nút vàng, không nền đen.
// Luật: không "AI", không thuật ngữ hệ, không lời hứa (File 04 mục 2.1).
export default function HomeHero() {
  return (
    <section className="bg-e26-ivory px-6 pt-28 pb-24 md:pt-40 md:pb-32">
      <div className="max-w-3xl mx-auto text-center">
        <p className="fade-in-section font-sans text-sm text-e26-text-2 mb-10">
          Kenji Phạm — Essence Coach
        </p>
        <h1 className="fade-in-section font-serif font-light text-4xl md:text-6xl leading-[1.12] text-e26-text text-balance">
          Vẫn đi làm, vẫn lo cho người khác — chỉ là lâu rồi, chưa ai hỏi bạn đang thế nào.
        </h1>
        {/* Điểm vàng duy nhất của viewport hero: một hairline */}
        <div className="fade-in-section w-10 h-px bg-e26-gold mx-auto mt-12" aria-hidden="true" />
        <p className="fade-in-section font-sans text-[17px] leading-[1.65] text-e26-text-2 mt-10 max-w-xl mx-auto">
          Trang này không vội. Bạn cứ đi chậm từng đoạn, rồi tự chọn cánh cửa phù hợp với mình.
        </p>
      </div>
    </section>
  );
}

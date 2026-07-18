import Link from "next/link";
import ImageSlot from "./ImageSlot";

// Section 5 — Hai Cửa. Nền cream. Hai thẻ LỆCH DỌC (thẻ 2 đẩy xuống ở
// desktop), ảnh chồng ảnh: ảnh thẻ 2 chờm nhẹ sang trái vào ảnh thẻ 1 tại
// đường biên giữa hai cột (chỉ ở desktop — mobile xếp thường, không chồng,
// tránh vỡ layout hẹp). Viền vàng quanh thẻ CHỈ hiện khi hover/focus (ĐIỂM
// VÀNG #2) — không tô sẵn bên nào, đúng cả hai thẻ như nhau.
// CTA hai bên CỐ Ý lệch giọng — không phải lỗi: "Mời bạn vào" (Bản Sắc Của
// Bạn) vì đây là chuyện của chính khách, Kenji chủ động mời; "Bạn mở cửa sổ
// này" (Bản Sắc Của Con) vì chuyện của con thuộc quyền ba mẹ, Kenji đứng
// ngoài, không thể "mời" ai vào phòng riêng của con họ.
export default function TwoStates() {
  return (
    <section className="bg-e26-cream px-6 py-16 md:py-32">
      <div className="max-w-[1120px] mx-auto">
        <div className="max-w-2xl mb-16 md:mb-20">
          <p className="e26-reveal font-serif font-normal text-[24px] md:text-[32px] leading-snug text-e26-text mb-6">
            Ở đây có hai cánh cửa.
          </p>
          <p className="e26-reveal font-sans text-[17px] leading-[1.65] text-e26-text-2 mb-5">
            Nhiều người ngồi xuống đây rồi mới nhận ra: cái nhịp làm mình mệt hôm nay, mình học
            được từ hồi còn rất nhỏ. Trong một căn bếp nào đó, khi mình hiểu ra rằng mình im lặng
            thì nhà mới yên. Và chẳng ai kịp nhận ra, mình đang vô tình dạy lại con y như vậy.
          </p>
          <p className="e26-reveal font-sans text-[17px] leading-[1.65] text-e26-text-2">
            Sau cả hai cánh cửa là cùng một khoảng lặng — chỗ để bạn nghe lại nhịp của chính mình.
            Bạn vào bên nào trước cũng đúng.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-14 md:gap-10">
          {/* Thẻ 1 — Bản Sắc Của Bạn */}
          <div className="e26-reveal group border border-transparent hover:border-e26-gold focus-within:border-e26-gold transition-colors duration-300 p-4 -m-4">
            <div className="relative z-0">
              <ImageSlot
                ratio="4/5"
                src="/images/home/kitchen-morning.webp"
                alt="Căn bếp ivory sáng sớm"
              />
            </div>
            <p className="font-sans text-sm tracking-[0.08em] uppercase text-e26-text-2 mt-6 mb-4">
              Bản Sắc Của Bạn
            </p>
            <p className="font-serif text-2xl leading-snug text-e26-text-2 mb-5">
              Có một kiểu mệt không nằm ở công việc. Nó nằm ở chỗ cứ phải gồng lên làm một phiên
              bản nào đó để tồn tại...
            </p>
            <Link
              href="/ban-sac-cua-ban"
              className="font-sans text-[15px] text-e26-text hover:text-e26-gold-deep transition-colors duration-300"
            >
              → Mời bạn vào cửa này
            </Link>
          </div>

          {/* Thẻ 2 — Bản Sắc Của Con (lệch dọc xuống + ảnh chờm sang trái vào thẻ 1, chỉ desktop) */}
          <div className="e26-reveal group border border-transparent hover:border-e26-gold focus-within:border-e26-gold transition-colors duration-300 p-4 -m-4 md:mt-20">
            <div className="relative z-10 md:-ml-10">
              {/* SWAP SLOT: /images/home/child-door-dusk.webp khi có ảnh web-ready */}
              <ImageSlot ratio="4/5" />
            </div>
            <p className="font-sans text-sm tracking-[0.08em] uppercase text-e26-text-2 mt-6 mb-4">
              Bản Sắc Của Con
            </p>
            <p className="font-serif text-2xl leading-snug text-e26-text mb-5">
              Có tối bạn đứng ở cửa phòng, nhìn con ngủ. Thương thì thương lắm. Mà vẫn có gì đó
              chưa gọi được tên. Không phải để sửa con — chỉ là mở thêm một cửa sổ...
            </p>
            <Link
              href="/ban-sac-cua-con"
              className="font-sans text-[15px] text-e26-text hover:text-e26-gold-deep transition-colors duration-300"
            >
              → Bạn mở cửa sổ này
            </Link>
          </div>
        </div>

        <p className="e26-reveal font-sans text-[15px] text-e26-text-2 mt-16 md:mt-20 max-w-md">
          Bạn biết mình đang đứng gần bên nào hơn.
        </p>
      </div>
    </section>
  );
}

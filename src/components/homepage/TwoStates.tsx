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
    <section className="relative bg-e26-cream px-6 py-16 md:py-32">
      {/* VIỆC 3 (19/07/2026) — vật liệu nền dùng chung "vệt nắng" (bg-hero-light),
          opacity rất thấp trên nền cream gốc — cùng kỹ thuật KietTac. z-auto:
          content bên dưới được nâng lên "relative z-10" để luôn nổi trên (đoạn
          intro + câu chốt trước đây không có z-index, cần bọc để không bị lớp
          nền này đè — 2 thẻ card vốn đã có z-10/z-20 riêng, không ảnh hưởng). */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.05]"
        style={{ backgroundImage: "url(/images/home/bg-hero-light.webp)" }}
        aria-hidden="true"
      />
      <div className="relative z-10 max-w-[1120px] mx-auto">
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
          </p>
        </div>

        {/* Hai CARD thật (hệ khối-lớp): mỗi thẻ = khối nền cream-deep (tương
            phản NHẸ với nền cream section — nhất quán họ khối ③⑥), ảnh CHỜM
            MÉP TRÊN của card (kỹ thuật B). Viền vàng khi hover GIỮ NGUYÊN
            (điểm vàng #2) — chuyển lên khối card qua group-hover, hiệu ứng
            không đổi. Lệch dọc thẻ 2 (md:mt-20) GIỮ NGUYÊN. Bỏ md:-ml-10 cũ
            (chờm chéo sang card kia) — nay ảnh chờm mép trên của chính card. */}
        <div className="grid md:grid-cols-2 gap-14 md:gap-10">
          {/* Thẻ 1 — Bản Sắc Của Bạn */}
          <div className="e26-reveal group">
            <figure className="relative z-20 mx-auto w-[88%]">
              <ImageSlot
                ratio="4/5"
                src="/images/home/kitchen-morning.webp"
                alt="Căn bếp ivory sáng sớm"
              />
            </figure>
            <div className="relative z-10 -mt-10 bg-e26-cream-deep border border-transparent group-hover:border-e26-gold focus-within:border-e26-gold transition-colors duration-300 px-6 pt-16 pb-8">
              <p className="font-sans text-sm tracking-[0.08em] uppercase text-e26-text-2 mb-4">
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
          </div>

          {/* Thẻ 2 — Bản Sắc Của Con (lệch dọc xuống, giữ md:mt-20) */}
          <div className="e26-reveal group md:mt-20">
            <figure className="relative z-20 mx-auto w-[88%]">
              <ImageSlot
                ratio="4/5"
                src="/images/home/child-door-dusk.webp"
                alt="Hành lang tối nhìn qua khung cửa, đèn ngủ ấm — không có mặt người"
              />
            </figure>
            <div className="relative z-10 -mt-10 bg-e26-cream-deep border border-transparent group-hover:border-e26-gold focus-within:border-e26-gold transition-colors duration-300 px-6 pt-16 pb-8">
              <p className="font-sans text-sm tracking-[0.08em] uppercase text-e26-text-2 mb-4">
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
        </div>

        {/* Câu chốt cảnh — serif italic, cỡ nhỉnh hơn đoạn thường để nổi lên
            như câu kết (2.2). Giữ nguyên vị trí (dưới 2 thẻ, mt-16/mt-20). */}
        <p className="e26-reveal font-serif italic text-[19px] md:text-[24px] leading-snug text-e26-text mt-16 md:mt-20 max-w-md">
          Bạn biết mình đang đứng gần bên nào hơn.
        </p>
      </div>
    </section>
  );
}

import Link from "next/link";
import ImageSlot from "./ImageSlot";

// Section 5 — Hai Cửa. Nền cream. Hai thẻ LỆCH DỌC (thẻ 2 đẩy xuống ở
// desktop), ảnh chồng ảnh: ảnh thẻ 2 chờm nhẹ sang trái vào ảnh thẻ 1 tại
// đường biên giữa hai cột (chỉ ở desktop — mobile xếp thường, không chồng,
// tránh vỡ layout hẹp). Viền vàng quanh thẻ CHỈ hiện khi hover/focus (ĐIỂM
// VÀNG #2) — không tô sẵn bên nào, đúng cả hai thẻ như nhau.
// SỬA 20/07/2026 (brief V9-FINAL) — nguồn chữ duy nhất: Google Doc
// "HOMEPAGE V9-FINAL". Đổi so với bản trước:
//   - BỎ đoạn intro "Nhiều người tới đây rồi mới nhận ra..." — Doc KHÔNG còn
//     đoạn này, section vào thẳng nhãn → 2 thẻ.
//   - Nhãn mở section hạ từ H2 to (Vai 2 cũ) xuống nhãn nhỏ Vai 5 "Ở ĐÂY CÓ
//     HAI CÁNH CỬA." (Doc đánh dấu [Nhãn nhỏ]).
//   - CTA hai thẻ ĐỔI THÀNH GIỐNG NHAU "Mời bạn vào →" (Doc dùng đúng 1 câu
//     cho cả 2 thẻ) — bản trước có "lệch giọng" cố ý giữa 2 CTA, nay Doc bỏ
//     chủ đích đó, làm đúng theo Doc.
//   - Câu kết section lên Vai 2 (weight 500, KHÔNG italic — bảng 5 vai chỉ
//     đánh dấu italic cho quote ④, không áp cho câu kết ⑤).
export default function TwoStates() {
  return (
    <section className="relative bg-e26-cream px-6 py-16 md:py-32">
      {/* SỬA 20/07/2026 (Light System) — thay bg-hero-light.webp bằng light-03
          "Window Shadow" (bg-light-hai-cua.webp). Chữ lộ trực tiếp trên ảnh
          chỉ có nhãn "Ở đây có hai cánh cửa." + câu kết (2 thẻ card có nền
          đặc riêng, không bị ảnh hưởng). Đo contrast thật: câu kết (Vai 2,
          đen) dư dả (11+); nhãn (Vai 5, 12px, màu phụ) là điểm nghẽn — cần
          overlay kem 60% mới đạt 4.5:1 ở cả desktop (4.6) lẫn mobile (pass
          từ 50%). z-auto: content bên dưới nâng "relative z-10" để nổi trên
          (2 thẻ card vốn đã có z-10/z-20 riêng, không ảnh hưởng). */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/home/bg-light-hai-cua.webp)" }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[color-mix(in_srgb,var(--essence-cream-2026)_60%,transparent)]"
        aria-hidden="true"
      />
      <div className="relative z-10 max-w-[1120px] mx-auto">
        <div className="max-w-2xl mb-16 md:mb-20">
          <p className="e26-reveal font-sans text-xs font-medium tracking-[0.18em] uppercase text-e26-text-2">
            Ở đây có hai cánh cửa.
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
              <p className="font-sans text-xs font-medium tracking-[0.18em] uppercase text-e26-text-2 mb-4">
                Bản Sắc Của Bạn
              </p>
              <p className="font-serif text-2xl leading-snug text-e26-text-2 mb-5">
                Có một kiểu mệt
                <br />
                không nằm ở công việc.
                <br />
                Mà nằm ở việc
                <br />
                phải trở thành một phiên bản nào đó
                <br />
                để tiếp tục sống.
              </p>
              <Link
                href="/ban-sac-cua-ban"
                className="font-sans text-[15px] text-e26-text hover:text-e26-gold-deep transition-colors duration-300"
              >
                Mời bạn vào →
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
              <p className="font-sans text-xs font-medium tracking-[0.18em] uppercase text-e26-text-2 mb-4">
                Bản Sắc Của Con
              </p>
              <p className="font-serif text-2xl leading-snug text-e26-text mb-5">
                Có những tối
                <br />
                bạn đứng trước cửa phòng con.
                <br />
                Thương con.
                <br />
                Nhưng sao khoảng cách ngày càng xa.
              </p>
              <Link
                href="/ban-sac-cua-con"
                className="font-sans text-[15px] text-e26-text hover:text-e26-gold-deep transition-colors duration-300"
              >
                Mời bạn vào →
              </Link>
            </div>
          </div>
        </div>

        {/* Câu chốt cảnh — câu neo Vai 2 của section (bảng 5 vai V9-FINAL:
            42px desktop / 30px mobile, serif weight 500, KHÔNG italic — chỉ
            quote ④ được đánh dấu ngoại lệ italic). */}
        <p className="e26-reveal font-serif font-medium text-[30px] md:text-[42px] leading-[1.25] text-e26-text mt-16 md:mt-20 max-w-lg">
          Bạn biết mình đang đứng gần bên nào hơn.
        </p>
      </div>
    </section>
  );
}

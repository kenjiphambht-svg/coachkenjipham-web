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
// SỬA 21/07/2026 (brief dọn cuối trang chủ, Việc C — rà font 5 vai) — đoạn
// "chuyện" bên trong 2 thẻ (font-serif text-2xl leading-snug) không khớp bất
// kỳ vai nào trong 5 vai chuẩn (Vai 2 = 30/42px, Vai 4 = 17-18px) VÀ thiếu
// biến thể mobile-responsive (24px cố định cả 2 breakpoint) — đúng 2 dấu
// hiệu brief liệt kê cần sửa. Thêm mobile 22px (md:text-2xl giữ nguyên 24px
// desktop, không đổi) — mức tối thiểu để có biến thể responsive, không đụng
// tới cỡ desktop đã ổn định qua nhiều lần đo contrast/layout trước đó.
// Đồng thời phát hiện (đo computed style thật, không chỉ đọc class): đoạn
// này + 2 link CTA "Mời bạn vào →" thiếu font-normal nên kế thừa nhầm
// body{font-weight:300} di sản (xem globals.css) thay vì 400 — đã thêm
// font-normal rõ ràng cho cả 3.
// SỬA 21/07/2026 (brief tinh gọn câu chữ) — card 1: "phiên bản nào đó" →
// "phiên bản khác". Card 2: thêm dấu phẩy sau "Có những tối", bỏ chữ "sao"
// trong "Nhưng sao khoảng cách...". Nút "Mời bạn vào →" cả 2 thẻ giữ nguyên
// (brief xác nhận không đổi).
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
          (2 thẻ card vốn đã có z-10/z-20 riêng, không ảnh hưởng).
          SỬA 20/07/2026 (brief nền mờ chi tiết) — sàn gạch của ảnh hiện rõ
          (đường ron gạch) ở khoảng 65-100% chiều cao section (đo trên ảnh
          chụp thật, không đoán). Phần trên (0-60%, nơi nhãn + 2 card đứng)
          KHÔNG đổi — vẫn overlay 60% đã đo. Chuyển sang GRADIENT: giữ 60% ở
          trên, tăng dần lên 92% từ 65% xuống đáy để nhấn chìm đường ron gạch
          — đồng thời gradient này cũng giúp giảm sàn gạch lộ qua đáy 2 khối
          card đã làm trong suốt ở Việc B (color-mix 35%, xem bên dưới).
          SỬA 21/07/2026 (brief Việc F) — thay bg-light-hai-cua.webp bằng
          haicua-hanhlang.webp: ảnh hành lang villa có ĐÚNG 2 CÁNH CỬA hai bên
          + cửa sổ sáng cuối hành lang (khớp nghĩa "Hai Cửa"). Convert q90,
          không banding. ĐO LẠI contrast TỪ ĐẦU trên nền mới (không giả định %
          cũ còn đúng — đúng yêu cầu brief): worst-case ĐÚNG CHIỀU (pixel TỐI
          nhất, vì chữ tối/nền sáng — xem BAI-HOC-KY-THUAT.md mục 7) rơi vào
          chữ trong card: 60%→3.13, 70%→3.64, 78%→4.09, 85%→4.50 ⇒ nâng đáy
          gradient 60%→87% (và 92%→93% ở đáy) cho dư biên. Mobile đo lại
          riêng: 4.64. Giữ nguyên cấu trúc "đậm dần về đáy" đã có. ĐÁNH ĐỔI:
          ở 87% hành lang chỉ còn cảm giác sáng — xem mục 8 file bài học.
          SỬA 22/07/2026 (brief thay nền ⑤, Việc C) — thay haicua-hanhlang.webp
          (hành lang 2 cửa, bị đánh giá "rất rối") bằng haicua-hanhlang1.webp:
          không gian trắng tối giản, khe sáng hẹp trái nhìn ra biển + cửa mở
          phải có nắng hắt vào, sàn phản chiếu mờ KHÔNG có vân gạch rõ (khác
          hẳn ảnh cũ) — không banding (đã zoom 2x vùng trời/biển, mượt nhất
          trong ảnh), giữ nguyên webp gốc Kenji thả (88KB, chất lượng đã đủ).
          ĐO LẠI overlay TỪ ĐẦU (không tái dùng gradient 87%→93% cũ — ảnh khác
          hẳn, không còn vân gạch cần nhấn chìm nên KHÔNG cần gradient, dùng
          overlay PHẲNG): nhãn "Ở đây có hai cánh cửa." là điểm nghẽn (câu kết
          + cả 2 card đều dư dả hơn nhiều, xem số đo dưới) — desktop 32% là
          ngưỡng thấp nhất đạt ≥4.5 (đo 32%→4.51), chọn 35% cho dư biên. Mobile
          đo lại riêng (bg-cover phóng đại khác — mục 1, ở section này scale
          lại theo CHIỀU RỘNG do section rất cao): ngưỡng thấp nhất 40% (đo
          40%→4.50), chọn 45% cho dư biên. Contrast tại mức chọn (desktop 35%
          / mobile 45%): nhãn 4.55/4.59+, câu kết 10.9+/10+, card1 body/label
          4.8+/5.3+, card2 body/label 11+/5+ — toàn bộ dư dả. Đã xem ảnh chụp
          thật: ở 35%, không gian vẫn đọc "sạch, tối giản" đúng tinh thần ảnh
          mới — KHÔNG mờ đục lại như ảnh cũ (87-93%), khe sáng trái + cửa mở
          phải vẫn rõ ràng là 2 điểm sáng phân biệt (khớp nghĩa "Hai Cửa" của
          section này). Đã kiểm 2 biên: nối ④ (Kenji) phía trên và ⑥ Essence
          phía dưới — không lộ ranh giới đột ngột (xem báo cáo PR). */}
      {/* SỬA 23/07/2026 (brief thống nhất tông toàn tuyến) — ảnh gốc là 1 trong
          2 outlier ẤM-OLIVE nhất tuyến (composite warm +21, pink −5 — ngả beige/
          khaki ngả lục so với gam kem chuẩn +11..+14). saturate(0.6) kéo về warm
          +14, khớp họ kem của ④⑧⑨. Đặt filter ở LỚP ẢNH (không phải lớp overlay
          gradient bên dưới) nên chỉ đổi tông ảnh, không đụng độ mờ/contrast của
          các gradient kem đã tuned. Đo tại tầng hiển thị, không đụng file gốc. */}
      {/* SỬA 23/07/2026 (brief HỆ MÀU CHUNG) — filter saturate(0.6)→sepia(0.4):
          dùng CÙNG grade tông với ④⑥⑧⑨ (1 công thức duy nhất toàn dải). */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/home/haicua-hanhlang1.webp)", filter: "sepia(0.4)" }}
        aria-hidden="true"
      />
      {/* SỬA 23/07/2026 (hệ màu chung) — GỘP 2 lớp overlay gradient (mobile 45%
          / desktop 35%, mỗi breakpoint 1 div) thành 1 div DÙNG CHUNG: giảm số
          lớp toàn trang. Đỉnh 72% (khớp mức làm-rõ chung của ④⑧), ramp về 90%
          ở 15% cuối để khớp đỉnh ⑥ (⑥ tạm giữ 92% chờ ảnh mới) — giữ liền seam
          ⑤→⑥. Không cần tách breakpoint vì 72% đủ đọc cho cả 2 (đo live ≥5.3). */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, color-mix(in srgb, var(--essence-cream-2026) 72%, transparent) 0%, color-mix(in srgb, var(--essence-cream-2026) 72%, transparent) 85%, color-mix(in srgb, var(--essence-cream-2026) 90%, transparent) 100%)",
        }}
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
            (chờm chéo sang card kia) — nay ảnh chờm mép trên của chính card.
            SỬA 20/07/2026 (brief khung trong) — nền card đổi từ cream-deep ĐẶC
            sang color-mix(...,35%,transparent) để ảnh nền bg-light-hai-cua
            hiện qua khối card. Đo contrast thật (canvas, WCAG): nhãn (Vai 5,
            màu phụ e26-text-2) là điểm nghẽn nhưng dư dả bất thường — nền
            section đã có overlay kem 60% riêng (dòng trên) nên dù card GIẢM
            xuống 0% (trong suốt hoàn toàn) contrast vẫn không dưới 5.0:1, xa
            trên trần 4.5:1. Vì WCAG không phải nút thắt ở section này, chọn
            35% theo tiêu chí thẩm mỹ (Bước 3 fable mode — nhìn bằng mắt):
            đủ trong để ảnh sáng lộ rõ, vẫn đủ đặc để đọc được là một khối
            card riêng biệt (không biến mất hẳn, giữ hệ khối-lớp). */}
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
            <div className="relative z-10 -mt-10 bg-[color-mix(in_srgb,var(--essence-cream-deep-2026)_35%,transparent)] border border-transparent group-hover:border-e26-gold focus-within:border-e26-gold transition-colors duration-300 px-6 pt-16 pb-8">
              <p className="font-sans text-xs font-medium tracking-[0.18em] uppercase text-e26-text-2 mb-4">
                Bản Sắc Của Bạn
              </p>
              <p className="font-serif font-normal text-[22px] md:text-2xl leading-snug text-e26-text-2 mb-5">
                Có một kiểu mệt
                <br />
                không nằm ở công việc.
                <br />
                Mà nằm ở việc
                <br />
                phải trở thành một phiên bản khác
                <br />
                để tiếp tục sống.
              </p>
              <Link
                href="/ban-sac-cua-ban"
                className="font-sans font-normal text-[15px] text-e26-text hover:text-e26-gold-deep transition-colors duration-300"
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
            <div className="relative z-10 -mt-10 bg-[color-mix(in_srgb,var(--essence-cream-deep-2026)_35%,transparent)] border border-transparent group-hover:border-e26-gold focus-within:border-e26-gold transition-colors duration-300 px-6 pt-16 pb-8">
              <p className="font-sans text-xs font-medium tracking-[0.18em] uppercase text-e26-text-2 mb-4">
                Bản Sắc Của Con
              </p>
              <p className="font-serif font-normal text-[22px] md:text-2xl leading-snug text-e26-text mb-5">
                Có những tối,
                <br />
                bạn đứng trước cửa phòng con.
                <br />
                Thương con.
                <br />
                Nhưng khoảng cách ngày càng xa.
              </p>
              <Link
                href="/ban-sac-cua-con"
                className="font-sans font-normal text-[15px] text-e26-text hover:text-e26-gold-deep transition-colors duration-300"
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

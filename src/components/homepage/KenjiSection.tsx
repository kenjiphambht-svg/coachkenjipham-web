import ImageSlot from "./ImageSlot";
import ComingLink from "./ComingLink";

// Section KENJI LÀ AI — sau khi ĐẢO MẠCH (19/07/2026) đứng ở vị trí ④, NGAY SAU
// Kiệt Tác (nền đen).
// SỬA 20/07/2026 (brief tinh chỉnh ④ — hết "dán ghép") — DỰNG LẠI TOÀN BỘ bố
// cục. Bản trước có 3 mảnh rời trông dán ghép: ảnh chân dung to + ảnh rót trà
// nhỏ + khối kem đậm (bg-e26-cream-deep) bọc chữ với padding bù trừ (pt-32/
// pl-24) chỉ để né phần ảnh chờm mép — viền cứng, thẻ nổi lơ lửng. Nay:
//   - BỎ HẲN ảnh rót trà (kenji-pouring-tea.webp) khỏi section này — để dành
//     /ve-kenji, KHÔNG xoá file khỏi thư mục.
//   - GỠ khối nền đặc bg-e26-cream-deep — chữ đứng TRỰC TIẾP trên ảnh nền
//     light-kenji (đã đo contrast thật, xem overlay bên dưới).
//   - Bố cục tự nhiên: ảnh chân dung ~40% một bên, chữ một bên, canh giữa
//     theo trục dọc (items-center), gap thoáng — KHÔNG còn chờm mép/ăn vào
//     nhau (-mr-16/-mt-28 cũ đã bỏ).
// Nhãn "Tôi là Kenji Phạm." (Vai 5), body (Vai 3, đúng Doc V9-FINAL — đã đối
// chiếu lại, bản "Tám năm qua, tôi ngồi cùng người lớn..." đúng, không sót
// bản cũ), quote "Tôi không sửa..." (Vai 2, 42px, giữ border-l), nhãn ICF
// (Vai 5), link "chưa mở" → /ve-kenji giữ nguyên toàn bộ.
export default function KenjiSection() {
  return (
    <section className="relative bg-e26-white px-6 py-16 md:py-28">
      {/* Ảnh light-02 "Floating Light". SỬA 20/07/2026 — chữ giờ đứng trực
          tiếp trên ảnh (không còn khối kem che) nên đo contrast thật (canvas,
          WCAG, dò tăng dần 5%/nấc): body/nhãn (màu phụ e26-text-2) đạt 4.5:1
          ở overlay trắng 35% desktop, nhưng mobile cần cao hơn — 45% (đo
          minRatio 4.66). Dùng chung 45% cho cả 2 breakpoint — thấp hơn nhiều
          so với ⑥⑨ (60-80%) vì ảnh light-kenji có vùng tối/trung tính rộng
          hơn ở khu vực đặt chữ. Quote (Vai 2, đen, 42px) dư dả ngay cả không
          overlay.
          SỬA 20/07/2026 (brief nền mờ chi tiết) — ở 45%, góc dưới-phải ảnh
          (nơi không có chữ/ảnh chân dung che) vẫn còn thấy hình khối khung
          cửa/ngưỡng cửa khá rõ (xem ảnh gốc: cùng vùng lộ chi tiết như raw
          image). Tăng 45%→58% (Bước 3) — khung cửa chìm gần hết, chỉ còn
          cảm giác sáng, không phá bố cục ảnh chân dung/chữ đã dựng ở Việc A.
          Contrast tăng theo: desktop 5.03/5.13 (nhãn/body), mobile
          5.61/5.69 — dư dả so với 4.5. */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/home/bg-light-kenji.webp)" }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[color-mix(in_srgb,var(--essence-white-2026)_58%,transparent)]"
        aria-hidden="true"
      />
      <div className="relative z-10 max-w-[1120px] mx-auto flex flex-col md:flex-row md:items-center gap-10 md:gap-16">
        <figure className="e26-reveal w-full max-w-[360px] mx-auto md:mx-0 md:w-[40%] md:max-w-none shrink-0">
          <ImageSlot
            ratio="4/5"
            src="/images/home/kenji-portrait.webp"
            alt="Kenji Phạm — chân dung"
          />
        </figure>

        <div className="w-full md:flex-1">
          <p className="e26-reveal font-sans text-xs font-medium tracking-[0.18em] uppercase text-e26-text-2 mb-6">
            Tôi là Kenji Phạm.
          </p>
          <div className="e26-reveal space-y-5 font-sans text-[18px] leading-[1.9] text-e26-text-2 max-w-xl">
            <p>
              Tám năm qua, tôi ngồi cùng người lớn, lắng nghe những điều họ không nói được với
              ai. Và ngồi cùng ba mẹ, khi họ yêu con nhưng không biết bắt đầu từ đâu.
            </p>
            <p>Tôi không giúp ai đi nhanh hơn.</p>
            <p>
              Tôi chỉ giữ cho căn phòng đủ yên,
              <br />
              để họ nghe được chính mình.
            </p>
          </div>

          <blockquote className="e26-reveal border-l border-e26-black pl-6 mt-10">
            <p className="font-serif italic font-medium text-[30px] md:text-[42px] leading-[1.25] text-e26-text max-w-lg">
              &quot;Tôi không sửa. Tôi tạo sự An định.&quot;
            </p>
          </blockquote>

          <p className="e26-reveal font-sans text-xs font-medium tracking-[0.18em] uppercase text-e26-text-2 mt-8">
            Huấn luyện viên Tâm lý Chiều sâu · Thực hành theo tiêu chuẩn ICF
          </p>

          <p className="e26-reveal mt-6">
            <ComingLink href="/ve-kenji" className="font-sans text-[17px] underline decoration-e26-black underline-offset-4">
              Hành trình và nền tảng của Kenji →
            </ComingLink>
          </p>
        </div>
      </div>
    </section>
  );
}

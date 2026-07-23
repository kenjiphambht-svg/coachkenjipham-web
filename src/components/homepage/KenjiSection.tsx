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
// SỬA 21/07/2026 (brief dọn cuối trang chủ, Việc C) — body + link thiếu
// font-normal nên kế thừa nhầm body{font-weight:300} (di sản, xem
// globals.css) thay vì 400 luật thương hiệu — đã thêm font-normal rõ ràng.
// SỬA 21/07/2026 (brief tinh gọn câu chữ, Quyết định 1) — BỎ HẲN nhãn ICF
// ("· Thực hành theo tiêu chuẩn ICF") theo yêu cầu Kenji — ICF sẽ nhắc kỹ ở
// /ve-kenji và /phuong-phap, không ở trang chủ. Body cũng tinh gọn lại chữ
// theo bản Kenji sửa (đổi "họ không nói được với ai" → "họ chưa từng nói với
// ai", đổi "khi họ yêu con nhưng không biết bắt đầu từ đâu" → "nghe những
// nỗi lo họ chưa biết gọi tên…", đổi "căn phòng" → "không gian").
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
          5.61/5.69 — dư dả so với 4.5.
          SỬA 21/07/2026 (brief Việc E) — thay bg-light-kenji.webp (Light
          System trừu tượng) bằng kenji-phong-doc.webp: ảnh phòng đọc villa
          thật (kệ sách, ghế bành, cửa vòm). Convert q90, không banding.
          Overlay trắng 58% → 85%: ảnh mới có nhiều vùng TỐI thật (kệ sách,
          gỗ) ngay dưới cột chữ nên 58% không còn đủ. Dò từ thấp lên theo
          worst-case ĐÚNG CHIỀU cho chữ tối/nền sáng = pixel TỐI nhất (xem
          BAI-HOC-KY-THUAT.md mục 7 — lần đầu đo nhầm chiều): 58%→2.33,
          72%→3.43, 78%→3.98, 85%→4.59 ⇒ 85% là mức thấp nhất đạt ≥4.5.
          Mobile đo lại riêng: 4.75. Đã thử dò background-position (0/20/35/
          50/70%) — chênh không đáng kể (2.13-2.22 ở cùng mức) vì ảnh có đốm
          tối rải khắp, nên giữ bg-center. ĐÁNH ĐỔI ĐÃ BIẾT: ở 85% phòng đọc
          chỉ còn "cảm giác sáng", không còn nhận ra rõ cảnh — xem
          BAI-HOC-KY-THUAT.md mục 8, cần Kenji quyết nếu muốn ảnh rõ hơn.
          SỬA 22/07/2026 (brief dọn Hero + thay nền ④, Việc C) — thay
          kenji-phong-doc.webp (phòng đọc villa, kệ sách + ghế bành + cửa
          vòm, đánh đổi contrast ở mục 8 trên) bằng kenji-phong-doc1.webp:
          ảnh Draw Things AI THẬT SỰ trừu tượng (prompt gốc đọc trong EXIF:
          "almost empty frame, only subtle gradations of white ivory and
          cream light... no objects, no furniture... no texture", negative
          prompt loại trừ đúng "brown, sepia, amber") — chỉ còn 1 góc tường
          + trần hắt sáng mềm, sàn phản chiếu mờ, KHÔNG còn kệ sách/ghế/cửa
          vòm nào để cạnh tranh với chữ.
          PHÁT HIỆN + SỬA THÊM (ngoài yêu cầu gốc của brief, nhưng cần thiết):
          ảnh gốc Kenji thả có 1 vệt CHÉO màu nâu đậm (RGB~78,58,40, lum~61)
          ở góc trên-phải — rõ ràng là lỗi render AI (mâu thuẫn chính prompt
          gốc "no room details, no texture"), KHÔNG phải chi tiết kiến trúc
          cố ý (đã zoom xem trực tiếp: không khớp bất kỳ đường nét hợp lý nào,
          chỉ là 1 vết nứt/seam ngẫu nhiên). Vệt này rơi ĐÚNG vào cột chữ body
          (đo được: đè lên đúng dòng đầu đoạn 1) nên MỘT MÌNH nó kéo overlay
          cần thiết lên tới ~80-85% (tính bằng công thức blend ngược) — quay
          lại đúng mức nặng của ảnh cũ, PHẢN LẠI mục đích chọn ảnh nhẹ hơn.
          Đã RETOUCH: blur cục bộ (sigma 120) trong đúng bbox thật của vệt
          (đo qua scan toàn ảnh, lum<90: bbox x1397-1780/y0-268), feather vào
          vùng xung quanh (vốn chỉ là gradient trơn nên inpaint an toàn, rủi
          ro thấp) — đã xem lại ảnh sau retouch phóng to 2x: vệt biến mất
          hoàn toàn (lum<90 count: 0 sau sửa, so với ~2282 trước), góc phải
          giờ đối xứng tự nhiên với góc trái (vốn có đường nối kiến trúc mờ
          tương tự). File gốc CHƯA sửa được giữ tại
          kenji-phong-doc1-original.png (không xoá) để đối chiếu/rollback nếu
          Kenji muốn xem lại. Convert webp q90 (28KB) — đã zoom 2x lại vùng
          gradient mượt nhất sau retouch: không banding.
          LƯU Ý THẬT (không tô hồng): ảnh vẫn còn 1 dải sàn gạch mờ với vệt
          kẻ ngang rất nhạt — không "tuyệt đối không texture" như prompt gốc
          yêu cầu, nhưng khác hẳn mức độ so với kệ sách/ghế bành cũ (không
          phải vật thể nhận diện được).
          OVERLAY ĐO LẠI TỪ ĐẦU sau retouch (không tái dùng 85% cũ — ảnh khác
          hẳn, số cũ không còn nghĩa lý): dò từ 10% tăng dần, worst-case đúng
          chiều (pixel TỐI nhất, mục 7) tại vị trí thật của label/body/quote/
          link. Label (nhãn) + quote + link đều dư dả ngay từ 10-15%. Body
          (màu phụ e26-text-2, ràng buộc chặt nhất) là mức quyết định: desktop
          47% là ngưỡng thấp nhất đạt ≥4.5 (đo 47%→4.51), chọn 48% cho dư biên
          nhỏ. MOBILE đo lại riêng (bg-cover phóng đại khác — mục 1): nhãn thứ
          2 ("Huấn luyện viên...") là ràng buộc chặt nhất trên mobile (không
          phải body như desktop), ngưỡng thấp nhất 53% (đo 53%→4.51), chọn 55%
          cho dư biên. TÁCH overlay theo breakpoint (mobile 55% / desktop 48%)
          — cách biệt nhỏ hơn nhiều so với ảnh cũ (58%→85%, cách 27 điểm %)
          vì ảnh mới đã sạch chi tiết tối sẵn, không cần bù nhiều theo
          breakpoint.
          SỬA 22/07/2026 (brief tăng mờ ④, chỉ giữ vệt nắng, Việc B) — Kenji
          muốn TĂNG overlay để chỉ còn "cảm giác vệt nắng", không còn "cảm
          giác căn phòng". PHÁT HIỆN QUA ĐO PIXEL (không chỉ dò bằng mắt):
          quét luminance dọc theo mép hộp-niche (x≈420-520 tại y=300/500) cho
          bước nhảy ~204→251 (~47 đơn vị) — GẦN NHƯ CÙNG ĐỘ LỚN với bước nhảy
          của chính vệt nắng tại mép nó (~200→247, ~47 đơn vị, quét dọc x≈
          1350-1900 tại y=500/700/900). Hai chi tiết này vốn CÙNG BẬC tương
          phản trong ảnh gốc → về mặt toán học, MỌI overlay giữ được vệt nắng
          cũng sẽ giữ luôn mép hộp/góc tường ở cùng mức độ (không có điểm dừng
          nào tách biệt được 2 thứ). Xem ảnh so sánh 63/68/72/75/80/82/85/88/90%
          (canvas render, không phải screenshot): 63-72% vẫn RÕ hộp/lưới sàn —
          chưa đạt. Từ 80% trở lên viền hộp mới đủ mềm để đọc là "quầng sáng"
          thay vì "kiến trúc"; lưới sàn (vốn chỉ là gợn nhẹ vài đơn vị, KHÁC
          hẳn mép hộp) đã mờ hẳn từ 75%. Chọn 85%: viền hộp chỉ còn quầng mờ
          (không còn đọc là góc phòng), lưới sàn biến mất, vệt nắng vẫn còn là
          1 dải sáng chéo nhận ra được (yếu hơn ở mức thấp nhưng còn hiện diện
          — không tự triệt tiêu, đã xem ảnh xác nhận không rơi vào trường hợp
          "quá tay" brief cảnh báo). MOBILE: đo lại bg-cover thấy vùng hiển thị
          THỰC TẾ trên khung dọc hẹp chỉ là phần GIỮA ảnh gốc (natural x≈771-
          1148/1920) — vệt nắng (nằm ở x≈1750-1920) NẰM NGOÀI khung hình mobile
          hoàn toàn, không có gì để giữ. Vì vậy overlay mobile chỉ cần đạt mục
          tiêu "không còn kiến trúc" (không có ràng buộc giữ vệt nắng) — dùng
          chung 85% cho cả 2 breakpoint (đã xem ảnh mobile ở 85%: phẳng gần
          như tuyệt đối, không còn dấu vết phòng). Contrast đo lại tại 85%
          (desktop): body 5.89, label1 6.14, label2 5.98, quote 15.96, link
          18.48 — dư dả rất nhiều so với 4.5 (mobile vốn đã dư dả từ 55% nên
          không cần đo lại ở 85%, chắc chắn còn cao hơn). */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/home/kenji-phong-doc1.webp)" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[color-mix(in_srgb,var(--essence-white-2026)_85%,transparent)]" aria-hidden="true" />
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
          <div className="e26-reveal space-y-5 font-sans font-normal text-[18px] leading-[1.9] text-e26-text-2 max-w-xl">
            <p>
              Tám năm qua, tôi ngồi cùng người lớn, lắng nghe những điều họ chưa từng nói với
              ai. Và ngồi cùng ba mẹ, nghe những nỗi lo họ chưa biết gọi tên…
            </p>
            <p>Tôi không giúp ai đi nhanh hơn.</p>
            <p>
              Tôi chỉ giữ cho không gian đủ yên,
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
            Huấn luyện viên Tâm lý Chiều sâu
          </p>

          {/* SỬA 22/07/2026 (brief hover vàng cho link, Việc D) — thêm
              hover:text-e26-gold-deep + transition-colors duration-300, đúng
              pattern đã có ở TwoStates.tsx ("Mời bạn vào →"). Hover-only,
              KHÔNG tính vào 3 điểm vàng thường trực (luật đã có từ trước). */}
          <p className="e26-reveal mt-6">
            <ComingLink href="/ve-kenji" className="font-sans font-normal text-[17px] text-e26-text underline decoration-e26-black underline-offset-4 hover:text-e26-gold-deep transition-colors duration-300">
              Hành trình và nền tảng của Kenji →
            </ComingLink>
          </p>
        </div>
      </div>
    </section>
  );
}

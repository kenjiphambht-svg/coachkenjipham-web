import Link from "next/link";

// Section 8 — Điều Essence không hứa (teaser). Nền KEM (không còn đen — luật
// nhịp sáng-tối chỉ còn đúng 2 khối tối là ④ và ⑦). 1 câu + 1 link — nội
// dung đầy đủ đã có ở /dieu-essence-khong-hua.
// SỬA 20/07/2026 (brief V9-FINAL) — DỰNG LẠI TỐI GIẢN theo Google Doc
// "HOMEPAGE V9-FINAL": bỏ hẳn card/khoảng đệm cũ, chỉ còn 1 câu H2 serif
// căn giữa + link sống, nhiều khoảng trắng trên/dưới (khoảng trắng LÀ hình
// ảnh). Câu đổi nguyên văn: "...và Essence chọn không nói." (bỏ dấu "...",
// dùng dấu chấm hết câu — đúng Doc). Hover link ĐỔI kỹ thuật: CHỈ đậm chữ +
// mũi tên nhích phải, KHÔNG gạch chân, KHÔNG đổi màu gold (tránh vượt trần
// 3 điểm vàng toàn trang — xem AnDinhAnThinh.tsx).
// SỬA 21/07/2026 (brief dọn cuối trang chủ, Việc C) — link thiếu font-normal
// ở trạng thái nghỉ nên kế thừa nhầm body{font-weight:300} di sản (xem
// globals.css) thay vì 400 — đã thêm font-normal, giữ nguyên hover:font-medium
// cho hiệu ứng "đậm chữ khi hover" đã có.
export default function NotPromised() {
  return (
    <section className="relative bg-e26-cream px-6 py-28 md:py-40">
      {/* SỬA 22/07/2026 (brief thay nền ⑧⑨, Việc C) — thay bg-light-evening.webp
          (Light System trừu tượng, dùng CHUNG với ⑨) bằng essence-khong-hua.webp:
          ảnh THẬT Kenji thả riêng cho ⑧ — phòng trắng tối giản, 2 khung vòm
          (1 nhỏ trái, 1 lớn giữa), ánh sáng ấm hắt qua, sàn phản chiếu sạch
          (không vân đá/baseboard rõ như ảnh cũ). ⑧ và ⑨ từ nay dùng 2 ảnh
          RIÊNG, không chung 1 file nữa. Không banding (webp gốc Kenji thả,
          77KB, đã zoom 2x vùng vòm sáng nhất: mượt).
          ĐO LẠI overlay TỪ ĐẦU (không giữ 82% cũ — ảnh khác hẳn, số cũ vô
          nghĩa): ảnh mới đã rất sáng/sạch sẵn (không còn vấn đề "chân tường
          nhận diện được" của ảnh cũ) nên H2 + link đạt ≥4.5:1 NGAY CẢ Ở 0%
          overlay (H2 4.74 ở mobile — điểm chặt nhất, link 16+ ở mọi mức).
          Chọn 20% (không phải mức tối thiểu 0%) THUẦN VÌ THẨM MỸ — dư biên
          contrast rất nhiều (H2 6.21 ở 20%) và tạo cảm giác gắn kết nhẹ với
          tông cream của section, không phải yêu cầu kỹ thuật. Đã xem ảnh
          chụp thật ở 20%: vẫn giữ trọn "khoảng trắng LÀ hình ảnh" — 2 khung
          vòm rõ ràng, không có chi tiết nào cần che. */}
      {/* SỬA 23/07/2026 (brief thống nhất tông toàn tuyến) — 2 sửa ở lớp ảnh này:
          (1) CROP: bg-center cắt cụt ĐỈNH VÒM lớn ở giữa trên desktop (section
          rất ngang 1425×488 / ảnh 1920×1088 → cover tràn dọc ~319px, center cắt
          ~160px trên nên đỉnh vòm bị phẳng — đã render đúng crop thật xác nhận).
          Đổi sang bg-[center_15%] (dịch khung xuống, lộ thêm phần trên) → đỉnh
          vòm hiện TRỌN, còn khoảng thở phía trên, không lộ trần. MOBILE (375×362)
          cover khớp ĐÚNG chiều cao (không tràn dọc) nên position-Y vô hiệu ở
          mobile — vòm mobile vẫn trọn như cũ, không hồi quy (đã render xác nhận).
          (2) TÔNG: ảnh gốc là outlier ẤM-OLIVE nhất tuyến (composite warm +28,
          pink −5 — ngả cam/olive so với gam kem chuẩn +11..+14). saturate(0.5)
          kéo về warm +15, khớp họ kem của ④⑤⑨ mà KHÔNG cần tăng overlay (giữ
          vòm sáng rõ). Đo tại tầng hiển thị, không đụng file gốc. */}
      {/* SỬA 23/07/2026 (brief chậm hiệu ứng + kéo tông ấm, MT3+MT4) — 2 sửa tiếp:
          (1) CROP: bg-[center_15%] của PR#64 chỉ được tune ở width 1425 — giải
          hình học với toạ độ đỉnh vòm THẬT (y=82/1088, quét pixel xác định):
          ở width 1920 cut-top = 15%×600px = 90px > 82px → đỉnh vòm VẪN bị cắt
          trên màn rộng (đúng điều Kenji thấy; đúng bài học PR#57 mục 6 — "2
          biên" gồm cả viewport rộng hơn mốc thiết kế). Fix bất biến: bg-top →
          cut-top = 0 ở MỌI width, đỉnh vòm + dải trần luôn hiện trọn. Mobile
          cover khớp đúng chiều cao nên bg-top ≡ hành vi cũ, không hồi quy.
          (2) TÔNG: Kenji nhận xét ⑧ "nhạt và lạnh" so với ảnh cầu nối phía
          trên — saturate(0.5) của PR#64 là khử SAI HƯỚNG (làm nhạt thay vì
          làm ấm; "olive" là suy diễn của phiên trước, không phải nhận xét của
          Kenji). Đổi sang sepia(0.3): kéo hue về vàng-gỗ, composite
          (215,203,178) có tỉ lệ nhiệt R/B = 1.208 — TRÙNG tỉ lệ R/B của ảnh
          cầu nối (1.206, đo vùng sàn gỗ + ghế) → cuộn từ ghế xuống ⑧ là một
          dòng màu liên tục. sepia chỉ làm SÁNG pixel sáng (ma trận tổng >1)
          nên contrast chữ tối/nền sáng không giảm (đã đo lại live). */}
      <div
        className="absolute inset-0 bg-cover bg-top"
        style={{ backgroundImage: "url(/images/home/essence-khong-hua.webp)", filter: "sepia(0.3)" }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[color-mix(in_srgb,var(--essence-cream-2026)_20%,transparent)]"
        aria-hidden="true"
      />
      <div className="relative z-10 max-w-[640px] mx-auto text-center">
        {/* SỬA 20/07/2026 (brief sửa lặp từ) — "Có những lời..." (lặp cấu
            trúc "Có những" với ⑦/⑨) → "Nhiều lời...". Kenji đã duyệt, sẽ
            đồng bộ vào Doc V9-FINAL sau. */}
        <h2 className="e26-reveal font-serif font-medium text-[30px] md:text-[42px] leading-[1.25] text-e26-text">
          Nhiều lời rất dễ nói. Essence chọn không nói.
        </h2>
        {/* SỬA 22/07/2026 (brief hover vàng cho link, Việc D) — thêm
            hover:text-e26-gold-deep + transition-colors duration-300, đúng
            pattern đã có ở TwoStates.tsx. Giữ nguyên hover:font-medium + mũi
            tên dịch phải đã có. Hover-only, KHÔNG tính vào 3 điểm vàng
            thường trực. */}
        <Link
          href="/dieu-essence-khong-hua"
          className="group e26-reveal mt-10 inline-flex items-center gap-1.5 font-sans font-normal text-[15px] text-e26-text hover:font-medium hover:text-e26-gold-deep transition-colors duration-300"
        >
          <span>Đọc đầy đủ</span>
          <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
    </section>
  );
}

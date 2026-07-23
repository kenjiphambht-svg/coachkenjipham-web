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
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/home/essence-khong-hua.webp)" }}
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

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
export default function NotPromised() {
  return (
    <section className="relative bg-e26-cream px-6 py-28 md:py-40">
      {/* SỬA 20/07/2026 (Light System) — thay bg-hero-light.webp (opacity
          0.11) bằng light-05 "Evening Calm" (bg-light-evening.webp), dùng
          chung với ⑨ NotesTeaser ngay sau (liền mạch cuối trang). */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/home/bg-light-evening.webp)" }}
        aria-hidden="true"
      />
      {/* SỬA 20/07/2026 (brief nền mờ chi tiết) — trước đây KHÔNG có overlay
          (0%, H2/link tự đạt contrast). Nhưng ở 0% ảnh lộ rất rõ góc
          tường/chân tường vân đá cẩm thạch (baseboard) + cạnh cột — đúng
          kiểu "góc phòng nhận diện được" brief muốn tránh. Chi tiết rải khắp
          ảnh (không riêng đáy) nên tăng overlay tổng thể theo Bước 3, dò từ
          0%: 45% (vẫn rõ chân tường) → 65% (đỡ hơn nhưng còn viền cột) → 75%
          (đạt trên desktop, mobile còn hơi rõ do crop cao hơn) → 82% (đạt cả
          2 breakpoint bằng mắt: chỉ còn "cảm giác sáng", vệt nắng chéo vẫn
          đẹp). Contrast chỉ tăng khi overlay tăng (không cần đo lại từ đầu)
          — xác nhận nhanh: H2 11.61, link 14.99 ở overlay này (desktop). */}
      <div
        className="absolute inset-0 bg-[color-mix(in_srgb,var(--essence-cream-2026)_82%,transparent)]"
        aria-hidden="true"
      />
      <div className="relative z-10 max-w-[640px] mx-auto text-center">
        {/* SỬA 20/07/2026 (brief sửa lặp từ) — "Có những lời..." (lặp cấu
            trúc "Có những" với ⑦/⑨) → "Nhiều lời...". Kenji đã duyệt, sẽ
            đồng bộ vào Doc V9-FINAL sau. */}
        <h2 className="e26-reveal font-serif font-medium text-[30px] md:text-[42px] leading-[1.25] text-e26-text">
          Nhiều lời rất dễ nói. Essence chọn không nói.
        </h2>
        <Link
          href="/dieu-essence-khong-hua"
          className="group e26-reveal mt-10 inline-flex items-center gap-1.5 font-sans text-[15px] text-e26-text hover:font-medium"
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

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
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.11]"
        style={{ backgroundImage: "url(/images/home/bg-hero-light.webp)" }}
        aria-hidden="true"
      />
      <div className="relative z-10 max-w-[640px] mx-auto text-center">
        <h2 className="e26-reveal font-serif font-medium text-[30px] md:text-[42px] leading-[1.25] text-e26-text">
          Có những lời rất dễ nói, và Essence chọn không nói.
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

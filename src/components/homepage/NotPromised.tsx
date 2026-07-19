import Link from "next/link";

// Section 8 — Điều Essence không hứa (teaser). BAN-CHOT: nền KEM (không còn
// đen — luật nhịp sáng-tối chỉ còn đúng 2 khối tối là ④ và ⑦). 1 câu + 1
// link, không phải danh sách 5 dòng "không" của bản trước (nội dung đầy đủ
// đó đã có ở /dieu-essence-khong-hua). Gạch chân ĐEN khi hover — KHÔNG dùng
// vàng ở link này (không tính vào đếm 3 điểm vàng của trang).
export default function NotPromised() {
  return (
    <section className="relative bg-e26-cream px-6 py-20 md:py-28">
      {/* VIỆC 3 (19/07/2026) — vật liệu nền dùng chung "vệt nắng" (bg-hero-light),
          opacity rất thấp trên nền cream gốc — cùng kỹ thuật KietTac. z-auto:
          content bên dưới nâng "relative z-10" (không có block bọc riêng —
          chữ + link nằm trực tiếp trên nền section). */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.05]"
        style={{ backgroundImage: "url(/images/home/bg-hero-light.webp)" }}
        aria-hidden="true"
      />
      <div className="relative z-10 max-w-[640px] mx-auto text-center">
        <p className="e26-reveal font-serif text-2xl md:text-3xl leading-snug text-e26-text">
          Có những lời rất dễ nói, và Essence chọn không nói...
        </p>
        <Link
          href="/dieu-essence-khong-hua"
          className="e26-reveal inline-block font-sans text-[15px] text-e26-text underline-offset-4 decoration-e26-text hover:underline mt-8"
        >
          → Đọc đầy đủ
        </Link>
      </div>
    </section>
  );
}

// Section 2b — Signature Moment (MỚI, brief V9-FINAL 20/07/2026). Một khối
// khoảng lặng giữa Hero (②, cảm xúc con người) và Kiệt Tác (③, H1 đen) — một
// câu duy nhất, serif italic, căn giữa, KHÔNG ảnh KHÔNG nút.
// PR NÀY chỉ dựng khối tĩnh + fade-in cơ bản (.e26-reveal có sẵn). KHÔNG
// scroll-lock, KHÔNG animation đặc biệt — tinh chỉnh Signature Moment thật
// (khoá cuộn) để dành PR Light System sau, theo đúng brief.
// Nền cream (nối tiếp Hero, trước khi rơi vào khối đen Kiệt Tác).
export default function SignatureMoment() {
  return (
    <section className="bg-e26-cream px-6 py-16 md:py-20">
      <p className="e26-reveal font-serif italic font-normal text-[22px] md:text-[28px] leading-snug text-e26-text-2 text-center max-w-2xl mx-auto">
        Có lẽ đây là lần đầu sau rất lâu, bạn ngồi xuống chỉ để ở cùng chính mình.
      </p>
    </section>
  );
}

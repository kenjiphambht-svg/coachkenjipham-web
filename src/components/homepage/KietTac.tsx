// Section 4 — Kiệt Tác. H1 DUY NHẤT của trang chủ (theo BAN-CHOT — hero ở
// section 2 KHÔNG được gắn heading, chỉ section này). Nền đen, đứng một mình.
// Nền ảnh /images/home/bg-wall-dark.webp (16:9) — dùng CSS background-image
// (không phải <Image>) để nếu ảnh chưa có, không hiện icon vỡ: nền vẫn là
// khối đen thuần cho tới khi Kenji cung cấp ảnh thật.
// TINH CHỈNH 19/07/2026: độ phủ đen 94% (opacity 0.06) gần như không thấy vân
// tường → giảm còn phủ đen ~87% (opacity 0.13) để vân tường/góc phòng thấp
// thoáng lộ ra, vẫn đủ tối giữ vai "khối tối" (nền vẫn bg-e26-black solid,
// chỉ lớp ảnh trang trí tăng độ hiện — đã đo tương phản chữ trắng vẫn đọc rõ).
// Vệt vàng dưới "kiệt tác" là phần tử thật (span + i), animate scaleX qua
// class .e26-reveal có sẵn — KHÔNG dùng ::after (GSAP/CSS không animate được
// pseudo-element theo lỗi đã biết ghi trong brief).
// SỬA 19/07/2026 — đối chiếu toàn diện với BAN-CHOT-v8.md theo yêu cầu Kenji:
// đoạn dưới H1 đang có "— kể cả bạn." (di sản từ BAN-CHOT.md cũ trước v8),
// nhưng v8 (dòng 72-73) đã đổi kết câu bằng dấu "…", KHÔNG có cụm "kể cả
// bạn." — trả về đúng nguyên văn v8.
// SỬA 20/07/2026 (brief phân cấp chữ ⑥⑦) — đoạn chữ phụ dưới H1 tăng 1 nấc
// trên mobile (18px → md:17px, đảo hướng so với thường lệ) cho dễ đọc trên
// điện thoại buổi tối. H1 và bố cục giữ nguyên, KHÔNG đụng lớp nền.
export default function KietTac() {
  return (
    <section className="relative bg-e26-black px-6 py-24 md:py-32 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.13]"
        style={{ backgroundImage: "url(/images/home/bg-wall-dark.webp)" }}
        aria-hidden="true"
      />
      <div className="relative max-w-[880px] mx-auto text-center">
        <h1 className="e26-reveal font-serif font-light text-[32px] md:text-[52px] leading-[1.2] text-e26-text-dark">
          Câu chuyện cuộc sống của bạn là một{" "}
          <span className="relative inline-block whitespace-nowrap">
            kiệt tác
            <i aria-hidden="true" className="gold-brush-line e26-reveal" />
          </span>
          .
        </h1>
        <p className="e26-reveal font-sans text-[18px] md:text-[17px] leading-[1.65] text-e26-text-dark-2 mt-8 max-w-lg mx-auto">
          Không phải vì mọi chương đều đẹp. Mà vì chưa ai đọc nó đủ chậm…
        </p>
      </div>
    </section>
  );
}

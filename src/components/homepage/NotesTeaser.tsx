import ComingLink from "./ComingLink";

// Section 9 — Một Góc Để Quay Lại. Nền ivory.
// SỬA 20/07/2026 (brief V9-FINAL) — nguồn chữ duy nhất: Google Doc "HOMEPAGE
// V9-FINAL". Đổi so với bản trước:
//   - Tiêu đề đổi "Ghi chép Essence." → "Một góc để quay lại." (H2, Vai 2).
//   - Body MỚI, dùng đúng "Những cánh cửa này đang được viết dần." (KHÔNG
//     phải "Hai cánh cửa" — Doc đổi số lượng cửa từ 2 lên 3).
//   - Bố cục đổi từ 2 CỬA song song → 3 CARD (Ghi chép Essence / Ebook /
//     Khởi đầu). Cả 3 đều "chưa mở" — dùng <ComingLink> (không href), KHÔNG
//     còn nhãn "(sắp mở)" (luật mới, Kenji 20/07/2026).
// KHÔNG có nút vàng — đúng 3 điểm vàng toàn trang (vệt ③, viền hover ⑤, "An
// Thịnh" ⑦), không phát sinh vàng thứ 4 ở đây.
const CARDS = [
  {
    title: "Ghi chép Essence",
    lines: ["Những bài viết nhỏ.", "Không để dạy.", "Chỉ để bạn thấy mình", "ở đâu đó trong từng dòng chữ."],
  },
  {
    title: "Ebook",
    lines: [
      "“Bắt đầu từ đâu? Bản Sắc Nhân Hiệu”",
      "Một cuốn sách nhỏ",
      "để bắt đầu hành trình.",
      "→ Mời bạn đọc",
    ],
  },
  {
    title: "Khởi đầu",
    lines: ["Một vài câu hỏi nhỏ.", "Không để chấm điểm.", "Chỉ để biết", "mình đang đứng ở đâu."],
  },
];

export default function NotesTeaser() {
  return (
    <section className="relative bg-e26-ivory px-6 py-16 md:py-28">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.11]"
        style={{ backgroundImage: "url(/images/home/bg-hero-light.webp)" }}
        aria-hidden="true"
      />
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h2 className="e26-reveal font-serif font-medium text-[30px] md:text-[42px] leading-[1.25] text-e26-text mb-8">
          Một góc để quay lại.
        </h2>
        <p className="e26-reveal font-sans text-[17px] md:text-[18px] leading-[1.9] text-e26-text-2 max-w-xl mx-auto">
          Có những ngày,
          <br />
          chỉ cần đọc một đoạn ngắn.
          <br />
          Có những ngày,
          <br />
          chỉ cần hiểu mình thêm một chút.
          <br />
          Những cánh cửa này đang được viết dần.
          <br />
          Khi mở, sẽ luôn có một chỗ để bạn quay về.
        </p>

        {/* 3 CARD chưa mở — mỗi card là 1 <ComingLink> không href (span mờ),
            xếp dọc trên mobile, 3 cột trên desktop. */}
        <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8 md:divide-x md:divide-e26-border">
          {CARDS.map((card) => (
            <ComingLink key={card.title} className="block md:px-8 md:first:pl-0 md:last:pr-0">
              <p className="font-serif text-xl text-e26-text mb-3">{card.title}</p>
              <p className="font-sans text-[15px] leading-[1.7] text-e26-text-2">
                {card.lines.map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < card.lines.length - 1 && <br />}
                  </span>
                ))}
              </p>
            </ComingLink>
          ))}
        </div>
      </div>
    </section>
  );
}

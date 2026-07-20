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
// SỬA 21/07/2026 (brief dọn cuối trang chủ, Việc C) — đoạn intro + tiêu đề
// card + mô tả card thiếu font-normal nên kế thừa nhầm body{font-weight:300}
// di sản (xem globals.css) thay vì 400 — đã thêm font-normal rõ ràng.
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
      {/* SỬA 20/07/2026 (Light System) — thay bg-hero-light.webp (opacity
          0.11) bằng light-05 "Evening Calm" (bg-light-evening.webp), dùng
          chung với ⑧ NotPromised ngay trước (liền mạch cuối trang). Đo
          contrast thật: H2 + đoạn intro (Vai 3) cần overlay kem tới 80% mới
          đạt 4.5:1 ở mobile (desktop chỉ cần 70%, dùng chung 80% cho an
          toàn cả 2). RIÊNG 3 card "chưa mở" (title + mô tả, opacity-45 qua
          ComingLink): đã đo — dù overlay 100% (ảnh gần như vô hình) vẫn chỉ
          đạt ~1.9-2.8:1, KHÔNG BAO GIỜ chạm 4.5:1. Xác nhận đây là đặc tính
          có sẵn của opacity-45 (đo cả trên nền ivory phẳng gốc, không ảnh:
          vẫn chỉ 2.81:1) — không phải do ảnh nền mới, KHÔNG tự ý sửa (ngoài
          phạm vi brief này, cần quyết định riêng của Kenji nếu muốn đổi mức
          mờ của trạng thái "chưa mở").
          SỬA 20/07/2026 (brief nền mờ chi tiết) — ở crop riêng của section
          này (cao hơn ⑧, khung hình khác), 80% vẫn còn thấy rõ cạnh cột +
          chân tường ở góc dưới trái/phải (đã xem ảnh chụp thật). Tăng
          80%→88% (Bước 3) — đạt cả 2 breakpoint: chỉ còn cảm giác sáng.
          Contrast tăng theo (luôn tăng khi overlay tăng): H2 14.42, đoạn
          intro 5.47 ở mobile — dư dả so với 4.5. */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/home/bg-light-evening.webp)" }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[color-mix(in_srgb,var(--essence-ivory-2026)_88%,transparent)]"
        aria-hidden="true"
      />
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h2 className="e26-reveal font-serif font-medium text-[30px] md:text-[42px] leading-[1.25] text-e26-text mb-8">
          Một góc để quay lại.
        </h2>
        <p className="e26-reveal font-sans font-normal text-[17px] md:text-[18px] leading-[1.9] text-e26-text-2 max-w-xl mx-auto">
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
            xếp dọc trên mobile, 3 cột trên desktop.
            SỬA 21/07/2026 (brief dọn cuối trang chủ, Việc B) — khung "kính mờ"
            theo spec Doc V9: radius 28px, viền 1px rgba(0,0,0,.06), nền
            rgba(255,255,255,.72), backdrop-blur 18px, padding 40px (p-10).
            Bỏ md:divide-x cũ (đường kẻ dọc giữa cột) — dư thừa khi mỗi card
            đã có viền riêng, 2 viền cạnh nhau sẽ đá nhau. Giữ nguyên trạng
            thái "chưa mở" (opacity-45 qua ComingLink không href) — CHỈ thêm
            khung, không thêm href/hover. Backdrop-blur cần nền phía sau CÓ gì
            để mờ — card giờ nằm ngay trên ảnh nền + overlay kem 88% của chính
            section này nên hiệu ứng kính mờ có tác dụng thấy được. */}
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {CARDS.map((card) => (
            <ComingLink
              key={card.title}
              className="block rounded-[28px] border border-[rgba(0,0,0,0.06)] bg-[rgba(255,255,255,0.72)] p-10 backdrop-blur-[18px]"
            >
              <p className="font-serif font-normal text-xl text-e26-text mb-3">{card.title}</p>
              <p className="font-sans font-normal text-[15px] leading-[1.7] text-e26-text-2">
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

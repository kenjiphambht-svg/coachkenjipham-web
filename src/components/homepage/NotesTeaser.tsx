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
// SỬA 21/07/2026 (brief tinh gọn câu chữ) — đoạn intro tinh gọn ("những
// ngày"→"ngày", bỏ "Khi mở," trước câu cuối); card 1 bỏ chữ "ở" thừa
// ("ở đâu đó"→"đâu đó"). Card Ebook GIỮ NGUYÊN mô tả + CTA "→ Mời bạn đọc"
// (Quyết định 2). Card Khởi đầu KHÔNG đổi.
// KHÔNG có nút vàng — đúng 3 điểm vàng toàn trang (vệt ③, viền hover ⑤, "An
// Thịnh" ⑦), không phát sinh vàng thứ 4 ở đây.
const CARDS = [
  {
    title: "Ghi chép Essence",
    lines: ["Những bài viết nhỏ.", "Không để dạy.", "Chỉ để bạn thấy mình", "đâu đó trong từng dòng chữ."],
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
      {/* SỬA 22/07/2026 (brief thay nền ⑧⑨, Việc C) — thay bg-light-evening.webp
          (dùng CHUNG với ⑧) bằng ghi-chep-essence.webp: ảnh THẬT Kenji thả
          riêng cho ⑨ — bàn gỗ có tách trà + sổ tay, rèm lụa bay, nhìn ra vườn
          qua khung cửa kính — đúng cảm giác "một góc để quay lại". ⑧ và ⑨ từ
          nay dùng 2 ảnh RIÊNG. Convert PNG gốc Kenji thả → webp q90 (184KB,
          đã zoom 2x vùng tường bên phải — gradient mượt nhất, có texture vữa
          tự nhiên che rủi ro banding: không banding).
          ĐO LẠI overlay TỪ ĐẦU (không giữ 88% cũ — ảnh khác hẳn): đoạn intro
          (Vai 3, màu phụ e26-text-2) là điểm nghẽn chặt nhất — desktop đạt
          4.5 ở 72%, mobile ở 75% (đo riêng, phóng đại khác — mục 1). Chọn
          78% dùng chung cho dư biên cả 2 (desktop 4.85, mobile 4.76). H2 dư
          dả rất nhiều ở mọi mức (11-14). Đã xem ảnh chụp thật ở 78%: bàn +
          tách trà + sổ tay + rèm + vườn vẫn nhận ra mờ mờ đúng cảm giác "góc
          viết/đọc", không mờ đục hoàn toàn.
          SỬA 23/07/2026 (brief thống nhất tông) — nâng 78%→82%: filter hue-rotate
          mới thêm (xem khối dưới) không bảo toàn luma tuyệt đối như saturate, làm
          intro tụt 4.85→4.67 (vẫn đạt nhưng HỒI QUY nhẹ so mốc cũ). +4% overlay
          bù lại: đo live sau đổi intro về ~4.9 cả 2 breakpoint (không hồi quy).
          RIÊNG 3 card "chưa mở" (title + mô tả, opacity-45 qua ComingLink):
          đã đo lại trên ảnh MỚI — vẫn cùng giới hạn đã ghi nhận trước đây (dù
          overlay 100%, chỉ đạt ~1.9-2.8:1, KHÔNG BAO GIỜ chạm 4.5:1). Đây là
          đặc tính có sẵn của chính opacity-45 (đo trên nền phẳng không ảnh
          cũng chỉ ~2.81:1) — không phải do ảnh nền, KHÔNG tự ý sửa (quyết
          định riêng của Kenji nếu muốn đổi mức mờ trạng thái "chưa mở", ngoài
          phạm vi brief này). */}
      {/* SỬA 23/07/2026 (brief thống nhất tông toàn tuyến) — khử ÁM HỒNG/ĐÀO của
          tường vữa (đã phóng ảnh thô xác nhận: tường ngả rosy/peach ở vùng bóng,
          R trội hơn G — "hồng" chứ không phải "vàng-gold" R≈G). hue-rotate(10deg)
          nghiêng sắc từ hồng-đỏ về vàng-gold; saturate(0.8) làm dịu để không còn
          đọc là "ám hồng". Kết quả composite vùng tường về pink âm (ngả gold) +
          warm ~+11, khớp gam chuẩn toàn tuyến. Filter ở tầng hiển thị, không đụng
          file gốc. Vườn xanh (góc trái, nhỏ + phủ ivory 78%) gần như không đổi
          cảm nhận qua hue-rotate nhẹ này (đã xem ảnh xác nhận). */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/home/ghi-chep-essence.webp)", filter: "saturate(0.8) hue-rotate(10deg)" }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[color-mix(in_srgb,var(--essence-ivory-2026)_82%,transparent)]"
        aria-hidden="true"
      />
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h2 className="e26-reveal font-serif font-medium text-[30px] md:text-[42px] leading-[1.25] text-e26-text mb-8">
          Một góc để quay lại.
        </h2>
        <p className="e26-reveal font-sans font-normal text-[17px] md:text-[18px] leading-[1.9] text-e26-text-2 max-w-xl mx-auto">
          Có ngày,
          <br />
          chỉ cần đọc một đoạn ngắn.
          <br />
          Có ngày,
          <br />
          chỉ cần hiểu mình thêm một chút.
          <br />
          Những cánh cửa này đang được viết dần.
          <br />
          Sẽ luôn có một chỗ để bạn quay về.
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

// SỬA 23/07/2026 (brief card ⑨ nổi bật, MT5) — bỏ import ComingLink: Kenji
// QUYẾT ĐỊNH ĐẢO luật "chưa mở = mờ 45%" (20/07) cho RIÊNG 3 card section này
// (section quan trọng, mờ tới mức khó đọc). Card giờ là <div> tĩnh rõ 100%,
// KHÔNG bấm được (không <a>/không href — không tạo link chết), tín hiệu
// "chưa mở" chuyển vào nhãn "sắp mở" mờ nhỏ trong từng card. ComingLink vẫn
// giữ nguyên cho các chỗ khác (④⑥) — không đổi luật toàn cục.

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
// MT5: `note` = nhãn trạng thái mờ ("sắp mở"). RIÊNG card Ebook: đã có sẵn
// dòng CTA "→ Mời bạn đọc" — theo brief, LÀM MỜ dòng đó (tách ra field `cta`)
// thay vì thêm nhãn "sắp mở" thứ hai (tránh 2 tín hiệu chồng nhau).
const CARDS: { title: string; lines: string[]; cta?: string; note?: string }[] = [
  {
    title: "Ghi chép Essence",
    lines: ["Những bài viết nhỏ.", "Không để dạy.", "Chỉ để bạn thấy mình", "đâu đó trong từng dòng chữ."],
    note: "sắp mở",
  },
  {
    title: "Ebook",
    lines: ["“Bắt đầu từ đâu? Bản Sắc Nhân Hiệu”", "Một cuốn sách nhỏ", "để bắt đầu hành trình."],
    cta: "→ Mời bạn đọc",
  },
  {
    title: "Khởi đầu",
    lines: ["Một vài câu hỏi nhỏ.", "Không để chấm điểm.", "Chỉ để biết", "mình đang đứng ở đâu."],
    note: "sắp mở",
  },
];

export default function NotesTeaser() {
  // id để mục menu "Một góc để quay lại" (HomeHeader) cuộn tới được — xem MT4.
  // scroll-mt-24 chừa chỗ cho header dính khi anchor nhảy tới.
  return (
    <section id="mot-goc-de-quay-lai" className="relative scroll-mt-24 bg-e26-ivory px-6 py-16 md:py-28">
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
          [LỖI THỜI 23/07/2026] Đoạn ghi chú cũ về giới hạn contrast của 3 card
          opacity-45 đã HẾT hiệu lực: Kenji quyết định (brief MT5) đảo luật mờ
          cho riêng 3 card này — card giờ rõ 100%, contrast đạt chuẩn thật,
          xem ghi chú tại khối card bên dưới. */}
      {/* SỬA 23/07/2026 (brief kéo tông ấm + quét ám màu, MT2+MT4) — Kenji xem
          màn thật: ⑨ VẪN còn ám hồng sau saturate(0.8) hue-rotate(10deg) của
          PR#64, và cả ⑧⑨ "nhạt, lạnh" so với tông vàng-gỗ của ảnh cầu nối.
          Đổi chiến thuật 2 tầng:
          (1) ẢNH: sepia(0.4) thay cho cặp cũ — sepia ÉP mọi hue về vàng-gỗ
          (~40°) theo cấu trúc ma trận, hồng không thể sống sót (khác hue-rotate
          10° chỉ xoay nhẹ), đồng thời CHÍNH NÓ là filter tạo ấm (cùng họ
          sepia(0.18) đã dùng cho ảnh Kenji ở Hero).
          (2) VEIL: ivory (250,249,247 — gần trắng trung tính, warm +3) là
          nguyên nhân "lạnh" thứ hai: phủ 82% màu gần-trắng thì ảnh có ấm mấy
          composite vẫn bạc. Đổi veil sang CREAM (241,239,232, warm +9) 80%.
          Kết quả composite vùng tường: (220,214,203) warm +17 (cũ +10), cả
          khung warm +17 — cùng chiều nhiệt với cầu nối (R/B > 1), hết hồng
          (pink −2.3). MỨC VEIL CHỐT 88% (dò 80→84→86→88 bằng canvas live):
          veil cream TỐI hơn ivory ~12 đơn vị ở pixel tối nên 80% làm intro
          tụt 4.46 (< mốc 4.90 cũ = hồi quy, không nhận); 88% cream ≈
          ivory82 cũ về luminance pixel tối → intro đo được 4.92 ≥ 4.90,
          KHÔNG hồi quy, trong khi composite vẫn warm ~+13 hue gold (ấm hơn
          hẳn +10 trung tính cũ). */}
      {/* SỬA 23/07/2026 (brief ⑨ TRONG hơn + ẤM hơn, MT2+MT3) — Kenji xem thật:
          veil 88% "quá ĐẶC, nuốt mất cảnh phòng đọc (bàn, tách trà, sổ tay, rèm,
          cây)", màu "xám lạnh + còn ám hồng". [88% ở khối trên GIỜ LỖI THỜI.]
          Đảo hướng: GIẢM veil để lộ cảnh + kéo tông ấm. Đo composite khi giảm
          veil: veil càng NHẸ thì R/B càng tiến về cầu nối (55%→1.155 vs 70%→
          1.110) VÀ càng ấm — tức "trong hơn" phục vụ luôn "ấm hơn" + "liền dòng
          màu" (MT3). Ràng buộc là contrast intro (Vai 3, chữ phụ, yếu nhất):
          dò live 88→70→62% — 62% cho intro vẫn ≥4.5 mà cảnh phòng hiện rõ.
          sepia 0.4→0.5: ép hue vàng-gỗ mạnh hơn, khử sạch hồng (pink −3.4→−3.8),
          R/B gần như không đổi. Kết quả: cảnh đọc được, tông vàng ấm khớp ⑧ +
          cầu nối, hết hồng/xám lạnh. Contrast đo live cả 2 breakpoint (xem báo
          cáo). bg-center giữ nguyên.
          VEIL GRADIENT (không phẳng) — mấu chốt MT2: flat mà đủ trong để thấy
          cảnh thì intro (Vai 3, chữ phụ yếu nhất) tụt <4.5 (62%→3.63, cả 78%
          →4.41 vẫn thiếu). Giải bằng gradient dọc (lesson mục 8): NẶNG 84% ở
          nửa TRÊN (0–47% chiều cao — nơi H2+intro nằm, đo thật intro desktop
          0.24–0.47 / mobile 0.11–0.27, đều trong vùng nặng) → NHẸ 48% ở ĐÁY
          (nơi bàn+tách trà+ghế+rèm nằm, không có chữ nền) để lộ rõ cảnh. Card
          nằm trên kính trắng .72 nên vẫn đọc tốt dù veil đáy nhẹ. Đo live cả 2
          breakpoint: intro 4.73/4.75, H2 12.4, card min 4.66/4.76 — đều ≥4.5,
          KHÔNG hồi quy chuẩn đọc. Vùng chữ vẫn kín (84%≈mức cũ) nên "trong hơn"
          đến từ nửa dưới lộ cảnh — đúng ý Kenji (thấy phòng đọc). */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/home/ghi-chep-essence.webp)", filter: "sepia(0.5)" }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, color-mix(in srgb, var(--essence-cream-2026) 84%, transparent) 0%, color-mix(in srgb, var(--essence-cream-2026) 84%, transparent) 47%, color-mix(in srgb, var(--essence-cream-2026) 52%, transparent) 60%, color-mix(in srgb, var(--essence-cream-2026) 48%, transparent) 100%)",
        }}
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

        {/* 3 CARD — SỬA 23/07/2026 (brief card ⑨ nổi bật, MT5): Kenji đảo luật
            20/07 cho riêng section này — card NỔI BẬT HOÀN TOÀN (bỏ opacity-45
            của ComingLink; contrast chữ card giờ phải ĐẠT CHUẨN thật, không
            còn ngoại lệ "chấp nhận thấp vì đang mờ" — đã đo lại live). Vẫn
            KHÔNG bấm được: <div> tĩnh, không <a>, không href, không hover.
            Tín hiệu "chưa mở" = nhãn "sắp mở" MỜ (opacity-50, thuần trạng
            thái trang trí — chủ ý mờ theo brief, không tính chuẩn WCAG) ở
            card 1+3; card Ebook làm mờ dòng CTA "→ Mời bạn đọc" sẵn có thay
            vì thêm nhãn (tránh 2 tín hiệu chồng nhau).
            SO LE (MT5): 3 card lệch dọc bậc thang md:mt-0/-12/-5 — chỉ ở
            desktop (md+); mobile xếp dọc 1 cột nên so le vô nghĩa, giữ đều.
            Khung "kính mờ" giữ nguyên spec Doc V9 (radius 28, viền .06, nền
            trắng .72, blur 18px, p-10). */}
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {CARDS.map((card, idx) => (
            <div
              key={card.title}
              className={`rounded-[28px] border border-[rgba(0,0,0,0.06)] bg-[rgba(255,255,255,0.72)] p-10 backdrop-blur-[18px] cursor-default select-none ${
                ["md:mt-0", "md:mt-12", "md:mt-5"][idx]
              }`}
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
              {card.cta && (
                <p className="mt-3 font-sans font-normal text-[15px] leading-[1.7] text-e26-text-2 opacity-50">
                  {card.cta}
                </p>
              )}
              {card.note && (
                <p className="mt-4 font-sans font-normal text-[11px] tracking-[0.14em] uppercase text-e26-text-2 opacity-50">
                  {card.note}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

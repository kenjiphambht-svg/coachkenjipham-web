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
      {/* SỬA 23/07/2026 (brief thay ảnh ⑨ vòng 2) — thay ghi-chep-essence.webp
          (ảnh cũ, nửa trên lạnh: vườn xanh + rèm trắng) bằng
          ghi-chep-essence-v2.webp: ảnh FLUX MỚI Kenji tạo (cozy japandi
          reading nook, bàn gỗ + tách trà + sổ mở + ghế GIỮ NGUYÊN, rèm giờ
          vàng ấm bao quanh cửa sổ thay vì trắng-lạnh — raw R/B 1.57, ấm hơn cả
          mốc ⑧ 1.2-1.3).
          ĐÃ ĐO LẠI: ảnh mới vẫn còn 1 điểm tối cục bộ ở nếp gấp rèm (RGB
          54,39,20 tại x56%,y39% — trong vùng H2/intro) dù nền tổng thể ấm hơn
          nhiều. Với overlay PHẲNG cần 88% mới đạt contrast ≥4.5 (tệ hơn mức cũ
          84% ở gradient). GIỮ CƠ CHẾ GRADIENT (lesson mục 8, không đổi kỹ
          thuật): nâng vùng NẶNG 84%→90% (bù điểm tối cục bộ mới), giữ NHẸ 48%
          ở đáy (bàn+tách trà+ghế đã ấm đúng tông, không cần che thêm). Đo live
          cả 2 breakpoint với gradient mới: xem báo cáo. sepia(0.4) giữ nguyên
          (grade chung, không cần sepia(0.5) như bản trước vì ảnh mới đã đủ ấm
          sẵn). Kenji xác nhận muốn merge để xem trực tiếp dù chưa đạt mục tiêu
          "hạ veil dễ dàng" (đã báo đúng mẫu CẦN ẢNH MỚI trước khi merge). */}
      {/* SỬA 23/07/2026 (brief "⑥⑨ trong hơn 20%") — 90%→88% trên bản v2, Kenji
          chọn AN TOÀN TỐI ĐA. Xem lịch sử đầy đủ ở BAI-HOC-KY-THUAT.md mục 11.
          SỬA 24/07/2026 (brief thay ảnh ⑨ vòng 3) — thay ghi-chep-essence-v2
          bằng ghi-chep-essence-v3.webp: ảnh FLUX MỚI Kenji tạo, cùng bố cục
          (bàn gỗ + sổ mở + tách trà + rèm + cửa sổ nhìn ra vườn) nhưng tường
          phải SÁNG ĐỀU, rèm hết nếp gấp tối cục bộ (RGB 54,39,20 của bản v2).
          PHÁT HIỆN (giống ⑥): dù ảnh mới sáng hơn nhiều (điểm tối nhất giờ
          (71,55,36) so với (54,39,20) bản v2), ngưỡng vùng nặng cần vẫn
          ~86.6-87.8% (gần như không đổi so với v2's 87.8%) — vì gốc rễ là
          MÀU CHỮ text-e26-text-2 yếu (xem giải thích đầy đủ ở WhatIsEssence.tsx
          + sổ tay mục 11), không phải bản thân ảnh. Vẫn cải thiện thị giác rõ
          rệt cùng % (đã xem render). Chốt vùng nặng 87% (an toàn cả 2 breakpoint
          — mobile chỉ cần 79.9% do crop hẹp hơn, desktop cần 86.6%, dùng mốc
          cao hơn + dư biên nhỏ), giữ mid 58%/light 48% (chưa từng là điểm
          nghẽn).
          SỬA 24/07/2026 (brief "thử bỏ veil, đổi màu chữ") — THÍ NGHIỆM: đoạn
          intro (Vai 3, duy nhất dùng text-e26-text-2 gắn với nền section — 3
          card có nền kính riêng, không phụ thuộc veil này) đổi sang
          text-e26-text đặc (luminance 0.112→0.0104, xem lý do đầy đủ ở
          WhatIsEssence.tsx + sổ tay mục 11). KHÁC ⑥: ⑨ không có "Sub/chữ ký"
          nào khác còn giữ màu yếu gắn với nền này → không bị kẹt sàn, GOM
          GRADIENT 3 mốc về 1 VEIL PHẲNG. Đo lại từ đầu: intro cần 39.8%
          desktop / 17.6% mobile ở màu mới — chốt 45% (dư biên +5.2pp desktop,
          rất dư ở mobile). Thấp hơn cả ⑧ (55%). H2 luôn dư dả (không đổi).
          THÍ NGHIỆM — CHƯA MERGE, xem PR. */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/home/ghi-chep-essence-v3.webp)", filter: "sepia(0.4)" }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[color-mix(in_srgb,var(--essence-cream-2026)_45%,transparent)]"
        aria-hidden="true"
      />
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h2 className="e26-reveal font-serif font-medium text-[30px] md:text-[42px] leading-[1.25] text-e26-text mb-8">
          Một góc để quay lại.
        </h2>
        {/* SỬA 24/07/2026 (brief "thử bỏ veil, đổi màu chữ") — text-e26-text-2
            → text-e26-text: xem lý do đầy đủ tại khối overlay veil phía trên. */}
        <p className="e26-reveal font-sans font-normal text-[17px] md:text-[18px] leading-[1.9] text-e26-text max-w-xl mx-auto">
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

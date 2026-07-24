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
      {/* SỬA 25/07/2026 (brief "Essence Lightscape" v04) — thay hẳn
          ghi-chep-essence-v3.webp (bàn gỗ + tách trà + sổ tay + rèm + cửa sổ
          vườn, cần gradient veil 87%→58%→48% vì nếp rèm tối cục bộ — xem
          BAI-HOC-KY-THUAT.md mục 11 nếu cần bối cảnh lịch sử) bằng
          ghi-chep-essence-v4.webp: ảnh FLUX.2 [klein] 9B MỚI — tường + ánh
          sáng qua rèm mỏng, gần như trống, KHÔNG còn bàn/tách trà/sổ tay nên
          không còn điểm tối cục bộ nào cần gradient bù riêng. 1728×960.
          Banding: plateau midtone dài nhất 11px, không đáng kể.
          Bỏ hẳn cặp div desktop/mobile riêng (position 27% top từng dò cho
          khung cửa sổ ảnh cũ) — ảnh mới không có chi tiết cụ thể cần canh,
          dùng 1 bg-cover bg-center chung cho cả 2 breakpoint, đơn giản hoá
          tối đa (cùng cách đã làm ở ⑥).
          OVERLAY: đo lại từ đầu qua canvas live — H2/intro (text-e26-text đậm,
          giữ từ PR#75) đạt 4.5:1 ở mức thấp hơn hẳn 45-52% cũ vì ảnh sáng đều
          hơn nhiều. Điểm nghẽn là H2 desktop (cần 15.9%). Chọn 24% CHUNG cho
          cả 2 breakpoint (desktop 5.18, mobile 10.6+ — mobile dư rất nhiều vì
          crop cover ở đó rơi vào vùng sáng hơn). Không còn gradient — 1 VEIL
          PHẲNG duy nhất, đủ vì ảnh không có vùng tối cục bộ cần che riêng. 3
          card (nền rgba trắng 0.18 + section veil) vẫn dư contrast rất nhiều
          (10-17) ở mức mới, không cần đổi độ trong suốt của card. */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/home/ghi-chep-essence-v4.webp)", filter: "sepia(0.4)" }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[color-mix(in_srgb,var(--essence-cream-2026)_24%,transparent)]"
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
        {/* SỬA 24/07/2026 (brief "bỏ nền trắng 3 card") — Kenji xem thật muốn
            card TRONG SUỐT, thấy được ảnh bàn/cửa sổ phía sau, bỏ khối "kính
            mờ" đục cũ (nền trắng .72). ĐO TRƯỚC KHI SỬA (không đoán): nếu bỏ
            hẳn nền + giữ màu mô tả cũ (text-e26-text-2, yếu) → contrast rớt
            còn 1.39-1.78 (test trực tiếp bằng canvas live) — không đọc được.
            2 THAY ĐỔI cần đi cùng nhau:
            (1) Đậm màu mô tả text-e26-text-2 → text-e26-text (giống pattern
            đã dùng cho thân bài ⑥⑨ ở PR#72) — cùng lý luận: luminance
            0.112→0.0104 đủ tự đạt chuẩn ở veil nhẹ hơn nhiều.
            (2) Nền trắng hạ .72 → .18 (không bỏ hẳn 0%): đo được sau khi đậm
            màu, 2/3 card đã đạt 4.5:1 ngay ở 0% (chỉ nhờ section veil 45%/52%
            có sẵn), riêng card Ebook (nền tối hơn 2 card kia) cần thêm ~10%
            phủ trắng mới đạt — chọn 18% cho cả 3 card (đồng nhất, dư biên).
            KHÔNG còn backdrop-blur (nền gần như trong suốt nên blur không còn
            tác dụng thị giác đáng kể, bỏ luôn cho card thật sự "mỏng"). CTA
            "Mời bạn đọc" + nhãn "sắp mở" GIỮ opacity-50 mờ trang trí (chủ ý,
            không tính chuẩn WCAG — đã ghi rõ từ MT5, không đổi). */}
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {CARDS.map((card, idx) => (
            <div
              key={card.title}
              className={`rounded-[28px] border border-[rgba(0,0,0,0.06)] bg-[rgba(255,255,255,0.18)] p-10 cursor-default select-none ${
                ["md:mt-0", "md:mt-12", "md:mt-5"][idx]
              }`}
            >
              <p className="font-serif font-normal text-xl text-e26-text mb-3">{card.title}</p>
              <p className="font-sans font-normal text-[15px] leading-[1.7] text-e26-text">
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

import Image from "next/image";

// Ảnh trang trí (alt rỗng, aria-hidden) — phủ lớp cream ~90% lên trên để chữ
// hero giữ nguyên độ tương phản đọc được (không đổi màu chữ hiện tại).
//
// SỬA 20/07/2026 (Light System) — thay bg-hero-open.webp bằng light-01
// "Morning Soft" (bg-light-hero.webp), theo brief map ảnh→section chính
// thức. Overlay cream bên dưới đo lại từ đầu cho ảnh mới (xem ghi chú tại
// thẻ div overlay).
const HERO_BG_SRC: string | undefined = "/images/home/bg-light-hero.webp";

// SỬA 21/07/2026 (brief thay ảnh cutout) — ảnh cũ kenji-hero-window.webp có
// NỀN PHÒNG riêng, phải bọc khung chữ nhật (aspect-[4/5] + object-cover +
// overflow-hidden + shadow + ring) để 2 nền (nền ảnh + nền Hero) không đá
// nhau lộ liễu → vẫn là "dán ghép". Kenji thả ảnh CUTOUT nền trong suốt thật
// (kenji-hero-cutout.png, đã kiểm alpha channel thật: 68.7% trong suốt hoàn
// toàn, 28.9% đặc, 2.3% viền anti-alias — không phải nền đen/trắng giả).
// Phóng to 300% kiểm viền tóc/vai/tay cầm cốc: mượt, không lởm chởm, không
// viền đen/trắng sót. Đã CROP KHÍT theo bbox alpha thật (896×1152 gốc còn
// nhiều khoảng trống trong suốt phía trên đầu 26.7% + phải 19.6% → cắt còn
// 720×844, đúng khít người+ghế, đáy ghế chạm đúng mép dưới ảnh) rồi mới
// convert webp giữ alpha (sharp, alphaQuality 100) — 44KB. Đặt
// HERO_IMAGE_SRC = null để hiện panel kem-đậm phẳng cùng tỉ lệ 720/844,
// layout không nhảy.
const HERO_IMAGE_SRC: string | null = "/images/home/kenji-hero-cutout.webp";

// SỬA 20/07/2026 (brief V9-FINAL) — chữ + cỡ giữ NGUYÊN (brief xác nhận "đã
// đúng"), chỉ sửa ngắt dòng thơ ở body cho khớp từng dòng trong Google Doc
// V9-FINAL (trước đây 2 câu ngắn bị gộp chung 1 dòng ở 2 đoạn).
// Section 2 — Hero: trạng thái con người, dựng theo hệ KHỐI-LỚP.
// Nền CREAM (không phải ivory — luật #2). Chữ lớn nhất mắt nhìn thấy nhưng
// KHÔNG phải heading (H1 duy nhất ở section Kiệt Tác) — dùng <p>, không <h1>.
//   Lớp 1 (dưới): ảnh bg-hero-open phủ TRỌN section + lớp cream ~90% → chữ
//                 nổi trên nền nắng (kỹ thuật A), không đứng trên nền trơn.
//   Lớp 2: khối chữ hero (trái ~40%, cột 2/5).
//   Lớp 3 (trên): ảnh Kenji (phải ~60%, cột 3/5). CHỜM XUỐNG ranh giới ②→③ —
//                 mà ③ (sau khi đảo mạch 19/07) là Kiệt Tác NỀN ĐEN.
//   Lớp 4 (MỚI 21/07/2026, brief "Kenji hoà vào đen + vệt sơn sáng"): vùng tối
//                 mở rộng sau hàng lưới — xem ghi chú đầy đủ tại khối JSX bên
//                 dưới grid row.
//
// SỬA 21/07/2026 (brief Kenji hoà vào đen) — BỐI CẢNH: ảnh cutout
// kenji-hero-cutout.webp bị crop khít bbox alpha thật (PR#44) nên đáy ảnh
// (chân ghế) là MỘT HÀNG PIXEL ĐẶC 100%, không có gì để "tan" — dù nền phía
// sau có tối đến đâu, mép dưới ảnh vẫn là đường cắt cứng vì bản thân ảnh
// KHÔNG có alpha giảm dần ở đáy (đã kiểm bbox alpha lúc convert: bottom
// margin = 0px, tức nội dung chạm đúng mép dưới, không dư biên trong suốt).
// Ảnh chụp thật xác nhận: mảnh đệm ghế màu sáng + gấu quần cắt ngang lộ rõ,
// dù đã ở trong dải gradient-đen cũ (h-64, đã che ~83% tối). Overlay/gradient
// phía sau không giải quyết được vì nó nằm SAU ảnh (z-10) trong stacking —
// chỉ che được NỀN xung quanh người, không che được RÌA của ảnh.
// FIX ĐÚNG CHỖ: thêm mask-image (CSS mask, không phải overlay) NGAY TRÊN ảnh
// Kenji — mờ dần alpha của chính ảnh từ ~68% chiều cao xuống 0 ở đáy, để rìa
// ảnh tự tan biến (không còn "đường cắt" vì không còn rìa cứng nào để lộ).
// Kèm 1 vệt bóng elip mờ (radial-gradient blur) đặt dưới ghế để mắt đọc
// "bóng đổ" thay vì thấy ảnh biến mất đột ngột — mẹo kinh điển ghép cutout.
export default function HomeHero() {
  return (
    <section className="bg-e26-cream px-6 pt-24 md:pt-[120px] relative overflow-visible">
      {/* LỚP 1 — ảnh nền phủ trọn section (inset-0), cream ~90% giữ tương phản
          chữ. Đã đo thật ở PR trước: chữ hero vẫn đọc rõ trên nền này. */}
      {/* SỬA BUG PHÁT HIỆN 19/07/2026 (nằm ngay trong file này, sửa kèm để
          Việc 1/2 hoạt động đúng): overlay từng viết "bg-e26-cream/90" —
          KHÔNG BAO GIỜ thực sự render (đã đo computed style: backgroundColor
          = rgba(0,0,0,0), hoàn toàn trong suốt) vì token màu định nghĩa bằng
          chuỗi hex thô (var(--essence-*-2026)) khiến Tailwind không generate
          được modifier "/opacity". Đổi sang color-mix() — kỹ thuật đã kiểm
          chứng hoạt động (dùng cho màu chữ body bên dưới). Chữ hero trước giờ
          vẫn đọc được là NHỜ ảnh gốc bg-hero-light vốn đã rất sáng, không phải
          nhờ overlay này. NGOÀI SCOPE hôm nay (không sửa): ImageBridge (⑦→⑧)
          dùng đúng pattern lỗi này ở 2 chỗ — đã flag riêng trong báo cáo. */}
      {HERO_BG_SRC && (
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <Image src={HERO_BG_SRC} alt="" fill className="object-cover" priority />
          {/* SỬA 20/07/2026 (Light System) — đo lại contrast cho ảnh mới
              (canvas, WCAG): dò tăng dần từ 0% → 70% mới đạt ≥4.5:1 cho toàn
              bộ đoạn thân (desktop 4.56, mobile pass từ 60%). Giảm từ 90%
              (mức cũ, chưa từng đo thật) xuống 70% — mức thấp nhất đạt được,
              ảnh hiện rõ hơn trước. */}
          <div className="absolute inset-0 bg-[color-mix(in_srgb,var(--essence-cream-2026)_70%,transparent)]" />
        </div>
      )}
      {/* SỬA 21/07/2026 — dải gradient tan-đen CŨ (h-40/h-64, chỉ che phần nền
          quanh người) đã BỎ, gộp vào khối LỚP 4 (dark zone) rộng hơn nhiều ở
          dưới grid row — xem ghi chú đầy đủ tại đó. Lý do gộp: dải cũ quá
          ngắn để vừa che nền VÀ chứa câu Signature Moment; tách thành 1 khối
          liền mạch dễ kiểm soát điểm nối hơn là 2 lớp gradient chồng nhau. */}
      <div className="relative z-10 max-w-[1440px] mx-auto">
        <div className="grid md:grid-cols-12 gap-12 md:gap-16 items-end">
          {/* LỚP 2 — khối chữ (cột 7/12 ≈ 58%). Headline là HÌNH ẢNH: serif rất
              lớn (72/56/42), tương phản mạnh với body nhỏ. leading 1.18 để dấu
              tiếng Việt dòng dưới không chạm chữ dòng trên. Ngắt 2 dòng cố ý
              (md+) theo brief.
              LƯU Ý (19/07): brief muốn chữ 40% / ảnh 60%, nhưng đo thật ở 72px
              dòng 1 "Lâu rồi, chưa ai hỏi" cần 622px — cột 40% (≤576px kể cả
              container 1440) KHÔNG chứa nổi → headline vỡ 4 dòng. Ưu tiên QA#4
              (≥72px + ngắt 2 dòng đúng chỗ) nên nới cột chữ lên 58% (712px), ảnh
              còn 42% (504px) — vẫn lớn, vẫn chờm sang nền đen. */}
          <div className="md:col-span-7 md:pb-24">
            <p className="e26-reveal font-serif font-normal text-[42px] md:text-[56px] lg:text-[72px] leading-[1.18] text-e26-text max-w-[680px]">
              Lâu rồi, chưa ai hỏi
              <br className="hidden md:block" /> bạn đang thế nào.
            </p>
            {/* Body: sans WEIGHT 400 (không 300 — luật khoá, chữ Việt có dấu nét
                300 vỡ). Màu đen token @65% (color-mix, không mã xám #555, không
                màu mới). Headline→body 48px (mt-12). */}
            <div className="e26-reveal mt-12 space-y-6 font-sans font-normal text-[18px] md:text-[20px] lg:text-[22px] leading-[1.8] max-w-[540px] text-[color-mix(in_srgb,var(--essence-text-primary-2026)_65%,transparent)]">
              <p>
                Bạn vẫn đi làm.
                <br />
                Mọi thứ vẫn ổn.
              </p>
              <p>
                Chỉ là đã lâu rồi,
                <br />
                bạn chưa thật sự ngồi xuống với chính mình.
              </p>
              <p>Ở đây, không ai hối thúc bạn phải khá hơn.</p>
              <p>
                Chỉ có một khoảng lặng,
                <br />
                để bạn nghe lại chính mình.
              </p>
            </div>
          </div>

          {/* LỚP 3 — ảnh Kenji cutout (cột 3/5 ≈ 60%). SỬA 21/07/2026 (brief
              thay ảnh cutout, Phương án A) — BỎ HẲN khung ảnh chữ nhật cũ:
              không còn overflow-hidden (không cắt vuông người), không còn
              shadow-[...] (không đổ bóng tấm ảnh), không còn ring-1
              ring-white/10 (không viền), không còn aspect-[4/5]+object-cover
              (ép khung vuông). Ảnh cutout đã crop khít bbox alpha thật
              (720×844 — xem ghi chú tại HERO_IMAGE_SRC) nên chỉ cần hiển thị
              đúng width/height gốc (w-full h-auto) là người hiện nguyên hình
              dạng, không mép chữ nhật nào để lộ "dán ghép". items-end (grid
              cha) tự canh đáy — chân/ghế "ngồi" ngay trên đường nền. -mb âm
              GIỮ NGUYÊN để chân ghế chờm vào khối LỚP 4 (dark zone) bên dưới.
              SỬA 21/07/2026 (brief Kenji hoà vào đen) — THÊM 2 THỨ:
              (1) bóng elip mềm (radial-gradient + blur) đặt SAU ảnh trong
                  DOM (nên vẽ trước, nằm dưới), mô phỏng bóng đổ dưới ghế;
              (2) mask-image trên chính ảnh — mờ dần alpha từ 66% chiều cao
                  xuống 0 ở 94% (đáy ảnh hoàn toàn trong suốt ở 6% cuối). Đây
                  là chỗ SỬA THẬT của vấn đề "cắt phựt": ảnh cutout vốn không
                  có alpha giảm dần ở đáy (đã kiểm khi convert — bbox alpha
                  chạm đúng mép dưới, 0px biên trong suốt), nên overlay/gradient
                  phía SAU ảnh không thể che được RÌA của chính ảnh — phải làm
                  mờ chính ảnh. Điểm cắt 66% nằm dưới toàn bộ mặt+thân trên
                  (đầu~0-18%, thân trên+tay~18-65% theo tỉ lệ ảnh đã crop) nên
                  mặt/thân trên KHÔNG bị ảnh hưởng (ràng buộc b) — chỉ vùng
                  ghế/chân (65-100%) mờ dần (ràng buộc a). WebkitMaskImage kèm
                  theo cho Safari. */}
          <div className="e26-reveal md:col-span-5 relative z-10 w-[70%] max-w-[340px] mx-auto md:mx-0 md:w-full md:max-w-none md:ml-auto -mb-16 md:-mb-24">
            <div
              className="absolute left-1/2 -translate-x-1/2 bottom-[10%] w-[135%] h-[16%]"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.25) 45%, transparent 75%)",
                filter: "blur(18px)",
              }}
              aria-hidden="true"
            />
            {HERO_IMAGE_SRC ? (
              <Image
                src={HERO_IMAGE_SRC}
                alt="Kenji Phạm cầm ly trà, nhìn ra cửa sổ"
                width={720}
                height={844}
                sizes="(max-width: 768px) 70vw, 32vw"
                className="relative w-full h-auto object-contain"
                style={{
                  maskImage: "linear-gradient(to bottom, black 0%, black 66%, transparent 94%)",
                  WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 66%, transparent 94%)",
                }}
                priority
              />
            ) : (
              <div className="w-full aspect-[720/844] bg-e26-cream-deep" aria-hidden="true" />
            )}
          </div>
        </div>
      </div>

      {/* LỚP 4 (MỚI 21/07/2026, brief "Kenji hoà vào đen + vệt sơn sáng") —
          khối tối mở rộng thay cho dải gradient h-64 cũ. Gồm 2 việc gộp lại:
          (A) tiếp tục nền TAN từ cream/ảnh sáng (Lớp 1, vẫn phủ full section)
              sang ĐEN ĐẶC — đủ cao để vừa che chân ghế Kenji (đã mờ qua mask
              ở Lớp 3) vừa còn dư mảng đen thật cho vệt sơn sáng "nổi" lên.
          (B) câu Signature Moment (trước là section ②b riêng, nền kem — ĐÃ GỠ
              khỏi trang-chu-v2.tsx) — nay đứng ngay trong khối tối này, trên
              1 vệt sáng dạng nhát cọ (radial-gradient bầu dục rất nhoè, KHÔNG
              phải khối chữ nhật cứng). Chữ giữ NGUYÊN cỡ/kiểu cũ (Vai giữa
              serif italic 22/28px) — brief chỉ đổi CHỖ ĐỨNG, không đổi cỡ.
              Màu chữ đổi từ text-2 (xám phụ, dùng trên nền kem) sang e26-text
              (đen #1A1A1A, theo yêu cầu — trên nền sáng cần chữ đủ đậm).
          Không z-index: mặc định nằm DƯỚI khối grid-row phía trên (z-10 tường
          minh) trong cùng stacking context của section — Kenji (đã bleed
          xuống qua -mb âm) luôn đè lên đúng phần trên của khối này. */}
      <div className="relative pt-28 pb-24 md:pt-36 md:pb-32 px-6">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, transparent, var(--essence-black-2026) 50%, var(--essence-black-2026))",
          }}
          aria-hidden="true"
        />
        <div className="relative max-w-4xl mx-auto text-center">
          {/* Vệt sơn sáng — nhát cọ nhoè, không chữ nhật. SỬA (đo contrast thật
              lần 1) — bản đầu dùng "max-w-2xl" cho CẢ khối bọc lẫn vệt sáng
              nên vệt sáng bị kẹp về ĐÚNG bằng bề rộng khối chữ (không rộng
              hơn như "w-[110%]" định làm) — đo canvas thật phát hiện contrast
              tụt còn 1.13:1 ở đúng đầu mút dòng dài nhất (chữ cuối dòng rơi
              vào vùng rìa gần-tắt của gradient). SỬA: tách 2 khối — khối bọc
              ngoài rộng hơn (max-w-4xl = 896px) để vệt sáng có chỗ lớn hơn
              chữ thật, còn <p> giữ max-w-2xl riêng (672px, không đổi cách
              ngắt dòng). Nới ellipse "75% 90%" + đẩy điểm dừng đặc ra xa hơn
              (giữ ≥0.95 alpha tới 45% bán kính) để cả 2 đầu dòng dài nhất
              (609px, đo qua Range.getClientRects() — không đoán) đều nằm
              trong vùng đặc. Đo lại bằng canvas thật (không đoán): minRatio
              desktop 13.3:1 (tại đúng điểm từng fail trước đó — rìa dòng dài
              nhất), mobile 10.84:1 — cả 2 dư dả rất nhiều so với 4.5:1. */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            aria-hidden="true"
          >
            <div
              className="w-full h-[260px] md:h-[300px]"
              style={{
                background:
                  "radial-gradient(ellipse 75% 90% at center, rgba(241,239,232,0.98) 0%, rgba(241,239,232,0.95) 45%, rgba(241,239,232,0.75) 60%, rgba(241,239,232,0.3) 80%, transparent 100%)",
                filter: "blur(24px)",
              }}
            />
          </div>
          <p className="relative e26-reveal font-serif italic font-normal text-[22px] md:text-[28px] leading-snug text-e26-text max-w-2xl mx-auto px-6">
            Có lẽ đây là lần đầu sau rất lâu, bạn ngồi xuống chỉ để ở cùng chính mình.
          </p>
        </div>
      </div>
    </section>
  );
}

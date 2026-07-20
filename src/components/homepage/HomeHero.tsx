import Image from "next/image";

// Ảnh trang trí (alt rỗng, aria-hidden) — phủ lớp cream ~90% lên trên để chữ
// hero giữ nguyên độ tương phản đọc được (không đổi màu chữ hiện tại).
//
// SỬA 20/07/2026 (Light System) — thay bg-hero-open.webp bằng light-01
// "Morning Soft" (bg-light-hero.webp), theo brief map ảnh→section chính
// thức. Overlay cream bên dưới đo lại từ đầu cho ảnh mới (xem ghi chú tại
// thẻ div overlay).
const HERO_BG_SRC: string | undefined = "/images/home/bg-light-hero.webp";

// Ảnh hero (19/07/2026): Kenji cầm ly trà nhìn ra cửa sổ, KHÔNG nhìn máy.
// Kenji thả `kenji-hero-window.png.png` (896×1152 ≈ 4:5), đã convert sang webp
// (30.6KB, q82) như quy trình quen. Ô ảnh giữ khung aspect-[4/5] cố định: nếu
// đổi/gỡ ảnh, đặt HERO_IMAGE_SRC = null để hiện panel kem-đậm phẳng — layout
// không nhảy (cùng khung 4/5).
const HERO_IMAGE_SRC: string | null = "/images/home/kenji-hero-window.webp";

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
//                 mà ③ (sau khi đảo mạch 19/07) là Kiệt Tác NỀN ĐEN. Ảnh sáng
//                 vắt qua kem→đen: để ảnh không bị nuốt vào bóng tối, thêm bóng
//                 đổ mềm phía dưới + viền sáng 1px rất mảnh tách mép ảnh khỏi đen.
export default function HomeHero() {
  return (
    <section className="bg-e26-cream px-6 pt-24 pb-24 md:pt-[120px] md:pb-[140px] relative overflow-visible">
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
      {/* VIỆC 2 (19/07/2026) — nền hero TAN xuống đen của Kiệt Tác (③) ngay sau.
          Tinh thần giống dải gradient ở ImageBridge (cầu nối ⑦→⑧), chỉ ĐẢO
          CHIỀU: trong suốt ở trên → tan hẳn vào e26-black ở đáy. DÙNG INLINE
          STYLE (không dùng Tailwind "from-e26-black/0 to-e26-black") vì cùng
          lý do bug ở trên — modifier /opacity không generate được cho token
          màu này; "transparent → var(--essence-black-2026)" không cần alpha
          modifier nên né được bug hoàn toàn, vẫn dùng đúng token có sẵn,
          không thêm màu mới. z-auto (không set z-index) nên tự nằm TRÊN lớp
          ảnh nền/overlay (cũng z-auto, nhưng đứng sau trong DOM) và TRƯỚC lớp
          chữ/ảnh Kenji (z-10 tường minh — luôn thắng bất kể thứ tự DOM). Ảnh
          Kenji (LỚP 3) vẫn giữ bóng/ring riêng nên mép không bị nuốt dù nằm
          trên dải đen này. */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 md:h-64"
        style={{ backgroundImage: "linear-gradient(to bottom, transparent, var(--essence-black-2026))" }}
        aria-hidden="true"
      />
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

          {/* LỚP 3 — ảnh Kenji (cột 3/5 ≈ 60%). Ô ảnh giữ aspect-[4/5] cố định
              (khung không đổi dù ảnh chưa về). CHỜM XUỐNG ranh giới ②→③ (nền đen
              Kiệt Tác): -mb âm kéo section đen lên dưới đáy ảnh, ảnh (z-10,
              positioned) vắt lên nền đen. Bóng mềm + ring sáng mảnh giữ ảnh
              không chìm vào đen. */}
          <div className="e26-reveal md:col-span-5 relative z-10 w-[88%] ml-auto md:w-full md:ml-0 -mb-16 md:-mb-24">
            <div className="relative w-full aspect-[4/5] overflow-hidden shadow-[0_28px_70px_-24px_rgba(0,0,0,0.55)] ring-1 ring-white/10">
              {HERO_IMAGE_SRC ? (
                <Image
                  src={HERO_IMAGE_SRC}
                  alt="Kenji Phạm cầm ly trà, nhìn ra cửa sổ"
                  fill
                  sizes="(max-width: 768px) 88vw, 60vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="absolute inset-0 bg-e26-cream-deep" aria-hidden="true" />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

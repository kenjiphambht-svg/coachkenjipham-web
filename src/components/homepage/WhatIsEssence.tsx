import ComingLink from "./ComingLink";

// Section 6 — Essence là gì. Nền ivory, căn giữa. Không ảnh (theo BAN-CHOT —
// đã bỏ ImageSlot 3:2 cuối section của bản trước).
// SỬA 20/07/2026 (brief V9-FINAL) — nguồn chữ duy nhất: Google Doc "HOMEPAGE
// V9-FINAL", thay TOÀN BỘ body bằng bản "mái hiên rút gọn" (ngắn hơn nhiều
// bản trước — bản trước có đoạn "Khi bão trong lòng đang lớn..." + "Kenji
// xin phép không hứa", Doc mới KHÔNG còn 2 đoạn đó nữa). H2 "Essence là gì?"
// (có dấu hỏi, đúng nguyên văn) thay cho nhãn nhỏ "ESSENCE LÀ GÌ" viết hoa
// trước đây — nay [Sub] "Một mái hiên tĩnh lặng." mới là dòng phụ nhỏ hơn.
// Câu chữ ký cuối để riêng, chữ nghiêng — RANH GIỚI THƯƠNG HIỆU TUYỆT ĐỐI,
// giữ đúng "phân tích và viết", không hạ xuống "đọc/duyệt/rà soát".
// Link "Phương pháp Essence Coaching →" theo luật "chưa mở" MỚI (Kenji
// 20/07/2026): <ComingLink> không href → span mờ, KHÔNG còn nhãn "(sắp mở)".
// SỬA 21/07/2026 (brief dọn cuối trang chủ, Việc C) — 4 đoạn thân bài + link
// + chữ ký cuối thiếu font-normal nên kế thừa nhầm body{font-weight:300} di
// sản (xem globals.css) thay vì 400 — đã thêm font-normal rõ ràng. Riêng
// dòng [Sub] "Một mái hiên tĩnh lặng." đã có sẵn font-normal từ trước, không
// đổi.
// SỬA 21/07/2026 (brief tinh gọn câu chữ) — thay TOÀN BỘ body bằng bản tinh
// gọn hơn của Kenji (giữ nguyên 4 mốc ngắt đoạn cũ). Chữ ký cuối tinh gọn
// phần đầu/cuối câu, GIỮ NGUYÊN cụm ranh giới thương hiệu "Kenji phân tích
// và viết, từ dòng đầu đến dòng cuối" đúng như brief yêu cầu.
export default function WhatIsEssence() {
  return (
    <section className="relative bg-e26-ivory px-6 py-16 md:py-32">
      {/* SỬA 22/07/2026 (brief thay nền ⑥, Việc B) — thay bg-light-essence.webp
          (Light System trừu tượng, hành lang/cột phối cảnh) bằng
          essence-la-gi.webp: ảnh zen thật Kenji thả (cây nhỏ + đá cuội + bệ gỗ
          tròn + tường trắng + vách gỗ nan phải, 1000×800). Đổi tên file theo
          quy tắc mục 5 sổ tay (bỏ dấu/khoảng trắng: "essence la gì.webp" →
          "essence-la-gi.webp"). Không banding ở vùng tường phẳng dù chỉ
          1000×800 gốc (đã zoom đúng tỉ lệ cover thật 1.425x tại 1440 — vẫn nét,
          không cần convert lại).
          ĐO LẠI overlay TỪ ĐẦU (không giữ 85% cũ — ảnh khác hẳn): H2/Sub/Link
          dư dả ngay cả không overlay (13-17 ở mọi mức). Điểm nghẽn thật là
          THÂN BÀI + CHỮ KÝ (Vai 3/4, màu phụ e26-text-2) — và đây là ca lạ:
          đo darkest-pixel-in-rect cho RGB gần (0,0,0) (bóng gốc cây, không
          phải vách gỗ nan như đoán ban đầu — đã xác minh vị trí pixel thật,
          không đoán) khiến contrast KHÔNG tăng đơn điệu: 0%→1.64 giảm dần
          xuống ~1.0 quanh 20-30% (điểm bóng và màu chữ trùng độ sáng) rồi mới
          tăng lại khi overlay đủ mạnh kéo bóng sáng vượt qua chữ — 87% là
          ngưỡng thấp nhất đạt lại ≥4.5 (thân bài 4.58, chữ ký 4.58). Mobile đo
          riêng cho cùng kết quả (87%). Chọn 88% dùng CHUNG 1 mức cho cả 2
          breakpoint (dư biên nhỏ, không cần tách vì 2 số đo trùng nhau). Đã
          xem ảnh chụp ở 88%: cảnh zen vẫn đọc được rõ ràng (cây, đá, bệ gỗ,
          vách nan) — không mờ đục như ảnh Light System cũ, vì bản thân ảnh
          mới đã sáng/sạch sẵn, 88% chỉ đủ để dìm đúng 1 điểm bóng tối. */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/home/essence-la-gi.webp)" }}
        aria-hidden="true"
      />
      {/* KHÔNG dùng bg-e26-ivory/70 — bug đã biết (xem HomeHero.tsx): token
          màu định nghĩa bằng hex thô qua var() khiến Tailwind không generate
          được modifier "/opacity", lớp phủ sẽ trong suốt hoàn toàn (im lặng,
          không lỗi build). Dùng color-mix() — kỹ thuật đã kiểm chứng. */}
      <div
        className="absolute inset-0 bg-[color-mix(in_srgb,var(--essence-ivory-2026)_88%,transparent)]"
        aria-hidden="true"
      />
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <h2 className="e26-reveal font-serif font-medium text-[30px] md:text-[42px] leading-[1.25] text-e26-text mb-3">
          Essence là gì?
        </h2>
        <p className="e26-reveal font-serif font-normal text-[20px] md:text-[24px] leading-snug text-e26-text-2 mb-8">
          Một mái hiên tĩnh lặng.
        </p>
        <p className="e26-reveal font-sans font-normal text-[17px] md:text-[18px] leading-[1.9] text-e26-text-2 mb-6">
          Có những giai đoạn, điều ta cần không phải thêm một phương pháp. Chỉ là một nơi đủ
          yên để ngồi xuống, thở chậm lại, và nhìn rõ điều đang diễn ra bên trong mình. Essence
          được tạo ra cho khoảnh khắc ấy.
        </p>
        <p className="e26-reveal font-sans font-normal text-[17px] md:text-[18px] leading-[1.9] text-e26-text-2 mb-6">
          Ở đây, mọi thứ đều có thứ tự. Không vội sửa. Không hối thúc thay đổi. Chỉ từng bước
          đưa bạn trở về trạng thái An định, trước khi đi sâu hơn vào bản sắc thật của mình.
        </p>
        <p className="e26-reveal font-sans font-normal text-[17px] md:text-[18px] leading-[1.9] text-e26-text-2 mb-6">
          Phía sau là một hệ thống được xây dựng chỉn chu. Phía trước vẫn luôn là con người.
        </p>
        <p className="e26-reveal font-sans font-normal text-[17px] md:text-[18px] leading-[1.9] text-e26-text-2 mb-8">
          Cách Essence vận hành sẽ được kể trong một cánh cửa riêng.
        </p>
        <p className="e26-reveal mb-10">
          <ComingLink href="/phuong-phap" className="font-sans font-normal text-[17px] underline decoration-e26-black underline-offset-4">
            Phương pháp Essence Coaching →
          </ComingLink>
        </p>
        <p className="e26-reveal font-serif italic font-normal text-[17px] md:text-[18px] leading-[1.7] text-e26-text-2">
          Mỗi ấn phẩm chuyên sâu gửi đến bạn đều do Kenji phân tích và viết, từ dòng đầu đến
          dòng cuối.
        </p>
      </div>
    </section>
  );
}

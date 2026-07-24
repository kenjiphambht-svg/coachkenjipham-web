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
      {/* SỬA 25/07/2026 (brief "Essence Lightscape" v04) — thay hẳn
          essence-la-gi-v3.webp (japandi living room, cây phong + đá cuội +
          vách gỗ nan) bằng essence-la-gi-v4.webp: ảnh FLUX.2 [klein] 9B MỚI
          Kenji tạo theo chuẩn "ánh sáng là nhân vật chính" — tường phẳng gần
          trống + 1 vệt nắng chéo từ trái, KHÔNG còn cây/đá/bệ gỗ/vách gỗ nan
          (toàn bộ lịch sử "khung cửa sổ làm trọng tâm", "cháy sáng góc trên-
          trái", "sọc gỗ chiếm chỗ" ở các PR#69-76 KHÔNG còn áp dụng — ảnh mới
          không có các chi tiết đó nữa, xem BAI-HOC-KY-THUAT.md mục 1/6/11 cho
          bối cảnh lịch sử nếu cần). Ảnh 1728×960 (khác tỉ lệ 1920×1088 cũ).
          Kiểm banding vùng chuyển nắng→tường: plateau midtone dài nhất 7px,
          không đáng kể. Không cần position đặc biệt nữa (không còn chi tiết
          cần né/làm trọng tâm) — dùng bg-cover bg-center mặc định cho cả 2
          breakpoint, đơn giản hoá tối đa. Overlay/màu chữ đo lại từ đầu bên
          dưới — ảnh gần trống nên dự kiến hạ được nhiều so với mức 53-58% cũ. */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url(/images/home/essence-la-gi-v4.webp)",
          filter: "sepia(0.4)",
        }}
        aria-hidden="true"
      />
      {/* KHÔNG dùng bg-e26-ivory/70 — bug đã biết (xem HomeHero.tsx): token
          màu định nghĩa bằng hex thô qua var() khiến Tailwind không generate
          được modifier "/opacity", lớp phủ sẽ trong suốt hoàn toàn (im lặng,
          không lỗi build). Dùng color-mix() — kỹ thuật đã kiểm chứng.
          SỬA 25/07/2026 (brief "Essence Lightscape" v04) — ĐO LẠI TỪ ĐẦU cho
          ảnh v4 (gần trống, không còn bóng cây tối nên không còn nút thắt cục
          bộ ở Sub/chữ ký — lịch sử veil gradient 92%/50% của ảnh v3 cũ không
          còn áp dụng, xem BAI-HOC-KY-THUAT.md mục 11 nếu cần bối cảnh). Giữ
          nguyên màu chữ đậm text-e26-text (quyết định từ PR#76) — KHÔNG revert
          về màu nhạt gốc dù brief gợi ý cân nhắc, vì revert sẽ cần veil ~86%
          và che mất phần lớn ánh sáng, ngược tinh thần ảnh mới "ánh sáng là
          nhân vật chính". Đo raw pixel dưới cả 8 dòng chữ (H2→chữ ký) qua
          canvas: veil tối đa cần chỉ 38.6% (tại H2, desktop). Chọn 42% (dư
          biên nhỏ) — 1 VEIL PHẲNG duy nhất, không còn gradient (ảnh mới sáng
          đều, không có vùng tối cục bộ cần che riêng). Mobile đo riêng. */}
      <div
        className="absolute inset-0 bg-[color-mix(in_srgb,var(--essence-cream-2026)_42%,transparent)]"
        aria-hidden="true"
      />
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <h2 className="e26-reveal font-serif font-medium text-[30px] md:text-[42px] leading-[1.25] text-e26-text mb-3">
          Essence là gì?
        </h2>
        <p className="e26-reveal font-serif font-normal text-[20px] md:text-[24px] leading-snug text-e26-text mb-8">
          Một mái hiên tĩnh lặng.
        </p>
        <p className="e26-reveal font-sans font-normal text-[17px] md:text-[18px] leading-[1.9] text-e26-text mb-6">
          Có những giai đoạn, điều ta cần không phải thêm một phương pháp. Chỉ là một nơi đủ
          yên để ngồi xuống, thở chậm lại, và nhìn rõ điều đang diễn ra bên trong mình. Essence
          được tạo ra cho khoảnh khắc ấy.
        </p>
        <p className="e26-reveal font-sans font-normal text-[17px] md:text-[18px] leading-[1.9] text-e26-text mb-6">
          Ở đây, mọi thứ đều có thứ tự. Không vội sửa. Không hối thúc thay đổi. Chỉ từng bước
          đưa bạn trở về trạng thái An định, trước khi đi sâu hơn vào bản sắc thật của mình.
        </p>
        <p className="e26-reveal font-sans font-normal text-[17px] md:text-[18px] leading-[1.9] text-e26-text mb-6">
          Phía sau là một hệ thống được xây dựng chỉn chu. Phía trước vẫn luôn là con người.
        </p>
        <p className="e26-reveal font-sans font-normal text-[17px] md:text-[18px] leading-[1.9] text-e26-text mb-8">
          Cách Essence vận hành sẽ được kể trong một cánh cửa riêng.
        </p>
        {/* SỬA 22/07/2026 (brief hover vàng cho link, Việc D) — thêm
            hover:text-e26-gold-deep + transition-colors duration-300, đúng
            pattern đã có ở TwoStates.tsx. Hover-only, KHÔNG tính vào 3 điểm
            vàng thường trực. */}
        <p className="e26-reveal mb-10">
          <ComingLink href="/phuong-phap" className="font-sans font-normal text-[17px] text-e26-text underline decoration-e26-black underline-offset-4 hover:text-e26-gold-deep transition-colors duration-300">
            Phương pháp Essence Coaching →
          </ComingLink>
        </p>
        {/* SỬA 22/07/2026 (brief tăng cỡ chữ ký ⑥, Việc A) — 17px/18px →
            20px/22px (+20%), dễ đọc hơn cho câu chữ ký cuối section. Giữ
            nguyên font-serif italic, line-height. Màu text-e26-text (đậm,
            giữ từ PR#76) — lý do tại khối overlay veil phía trên. */}
        <p className="e26-reveal font-serif italic font-normal text-[20px] md:text-[22px] leading-[1.7] text-e26-text">
          Mỗi ấn phẩm chuyên sâu gửi đến bạn đều do Kenji phân tích và viết, từ dòng đầu đến
          dòng cuối.
        </p>
      </div>
    </section>
  );
}

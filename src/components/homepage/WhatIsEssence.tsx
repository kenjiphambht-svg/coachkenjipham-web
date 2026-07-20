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
export default function WhatIsEssence() {
  return (
    <section className="relative bg-e26-ivory px-6 py-16 md:py-32">
      {/* SỬA 20/07/2026 (Light System) — thay bg-hero-light.webp (wash mờ
          0.11) bằng ảnh light-04 "Silence" (bg-light-essence.webp). Đo
          contrast thật (canvas, WCAG): ảnh trực tiếp cho H2/Sub/Link đạt
          ngay (9.39 / 3.54 / 8.51, cần ≥3-4.5), nhưng 4 đoạn thân bài (Vai 3,
          màu e26-text-2) KHÔNG đạt 4.5:1 (2.55-4.03). Dò lớp phủ kem tăng
          dần 5%/nấc → 70% mới đạt cả desktop (4.56) lẫn mobile (4.75) —
          nặng hơn "rất nhẹ" kỳ vọng vì màu chữ phụ vốn có trần contrast thấp
          (chỉ 6.49:1 ngay cả trên nền trắng thuần), không phải lỗi vị trí.
          SỬA 20/07/2026 (brief nền mờ chi tiết) — ảnh light-essence lộ rõ
          hành lang/cột thu nhỏ theo phối cảnh SUỐT chiều dọc ảnh (không chỉ ở
          đáy), nên gradient theo vị trí không đủ — tăng overlay tổng thể
          70%→85% (Bước 3 của brief: tăng dần 5%/nấc tới khi chìm). Ở 85%,
          hành lang chỉ còn "cảm giác sáng", không còn nhận ra góc phòng/cột —
          xác nhận bằng mắt trên ảnh chụp thật cả 2 breakpoint. Contrast đo
          lại tăng theo (luôn tăng khi overlay tăng): desktop 5.49, mobile
          5.75 — dư dả so với 4.5. */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/home/bg-light-essence.webp)" }}
        aria-hidden="true"
      />
      {/* KHÔNG dùng bg-e26-ivory/70 — bug đã biết (xem HomeHero.tsx): token
          màu định nghĩa bằng hex thô qua var() khiến Tailwind không generate
          được modifier "/opacity", lớp phủ sẽ trong suốt hoàn toàn (im lặng,
          không lỗi build). Dùng color-mix() — kỹ thuật đã kiểm chứng. */}
      <div
        className="absolute inset-0 bg-[color-mix(in_srgb,var(--essence-ivory-2026)_85%,transparent)]"
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
          Có những giai đoạn, điều chúng ta cần không phải là thêm một phương pháp. Chỉ là một
          nơi đủ yên để ngồi xuống, thở chậm lại và nhìn rõ điều đang diễn ra bên trong mình.
          Essence được tạo ra cho khoảnh khắc ấy.
        </p>
        <p className="e26-reveal font-sans font-normal text-[17px] md:text-[18px] leading-[1.9] text-e26-text-2 mb-6">
          Mọi thứ ở đây đều có thứ tự. Không vội sửa. Không hối thúc thay đổi. Chỉ từng bước đưa
          bạn trở về trạng thái An định, trước khi đi sâu hơn vào bản sắc thật của mình.
        </p>
        <p className="e26-reveal font-sans font-normal text-[17px] md:text-[18px] leading-[1.9] text-e26-text-2 mb-6">
          Phía sau là một hệ thống được xây dựng chỉn chu. Phía trước vẫn luôn là con người.
        </p>
        <p className="e26-reveal font-sans font-normal text-[17px] md:text-[18px] leading-[1.9] text-e26-text-2 mb-8">
          Cách Essence vận hành trọn vẹn sẽ được kể trong một cánh cửa riêng, đang được viết
          dần.
        </p>
        <p className="e26-reveal mb-10">
          <ComingLink href="/phuong-phap" className="font-sans font-normal text-[17px] underline decoration-e26-black underline-offset-4">
            Phương pháp Essence Coaching →
          </ComingLink>
        </p>
        <p className="e26-reveal font-serif italic font-normal text-[17px] md:text-[18px] leading-[1.7] text-e26-text-2">
          Và mỗi ấn phẩm chuyên sâu gửi đến tay bạn, đều do Kenji phân tích và viết, từ dòng
          đầu đến dòng cuối.
        </p>
      </div>
    </section>
  );
}

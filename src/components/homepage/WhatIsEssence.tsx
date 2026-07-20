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
export default function WhatIsEssence() {
  return (
    <section className="relative bg-e26-ivory px-6 py-16 md:py-32">
      {/* SỬA 19/07/2026 — FINAL yêu cầu phủ kem ~88-90% (trước 93-95%/opacity
          0.05 — quá mờ, không thấy được bằng mắt, bài học từ PR trước). */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.11]"
        style={{ backgroundImage: "url(/images/home/bg-hero-light.webp)" }}
        aria-hidden="true"
      />
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <h2 className="e26-reveal font-serif font-medium text-[30px] md:text-[42px] leading-[1.25] text-e26-text mb-3">
          Essence là gì?
        </h2>
        <p className="e26-reveal font-serif font-normal text-[20px] md:text-[24px] leading-snug text-e26-text-2 mb-8">
          Một mái hiên tĩnh lặng.
        </p>
        <p className="e26-reveal font-sans text-[17px] md:text-[18px] leading-[1.9] text-e26-text-2 mb-6">
          Có những giai đoạn, điều chúng ta cần không phải là thêm một phương pháp. Chỉ là một
          nơi đủ yên để ngồi xuống, thở chậm lại và nhìn rõ điều đang diễn ra bên trong mình.
          Essence được tạo ra cho khoảnh khắc ấy.
        </p>
        <p className="e26-reveal font-sans text-[17px] md:text-[18px] leading-[1.9] text-e26-text-2 mb-6">
          Mọi thứ ở đây đều có thứ tự. Không vội sửa. Không hối thúc thay đổi. Chỉ từng bước đưa
          bạn trở về trạng thái An định, trước khi đi sâu hơn vào bản sắc thật của mình.
        </p>
        <p className="e26-reveal font-sans text-[17px] md:text-[18px] leading-[1.9] text-e26-text-2 mb-6">
          Phía sau là một hệ thống được xây dựng chỉn chu. Phía trước vẫn luôn là con người.
        </p>
        <p className="e26-reveal font-sans text-[17px] md:text-[18px] leading-[1.9] text-e26-text-2 mb-8">
          Cách Essence vận hành trọn vẹn sẽ được kể trong một cánh cửa riêng, đang được viết
          dần.
        </p>
        <p className="e26-reveal mb-10">
          <ComingLink href="/phuong-phap" className="font-sans text-[17px] underline decoration-e26-black underline-offset-4">
            Phương pháp Essence Coaching →
          </ComingLink>
        </p>
        <p className="e26-reveal font-serif italic text-[17px] md:text-[18px] leading-[1.7] text-e26-text-2">
          Và mỗi ấn phẩm chuyên sâu gửi đến tay bạn, đều do Kenji phân tích và viết, từ dòng
          đầu đến dòng cuối.
        </p>
      </div>
    </section>
  );
}

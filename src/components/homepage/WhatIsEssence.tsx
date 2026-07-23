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
      {/* SỬA 23/07/2026 (brief thay ảnh ⑥ vòng 2) — thay essence-la-gi.webp
          (ảnh cũ, có dải tối dọc quanh thân cây x20-45%/y30-91% đè lên thân bài
          + chữ ký, buộc veil 92%) bằng essence-la-gi-v2.webp: ảnh FLUX MỚI
          Kenji tạo (serene japandi living room, cây phong đỏ-cam trái, ánh nắng
          vàng ấm, bệ gỗ tròn giữa, vách gỗ nan phải, đá cuội trái dưới — GIỮ
          NGUYÊN bố cục, ấm hơn nhiều: raw R/B 1.54 so với ảnh cũ 1.10).
          ĐÃ ĐO LẠI: ảnh mới VẪN còn thân cây + bóng đổ chéo tối (RGB 16-51,
          8-29, 4-12) đúng cột x25-27%, kéo dài y25-80% — TRÙNG vị trí vấn đề
          ảnh cũ, dù nền xung quanh đã sáng/ấm hơn nhiều. Đã thử dịch
          background-position ngang: không cải thiện (quét cột ngang xác nhận
          vùng tối trải rộng x0-55% ảnh gốc, không có "hành lang sạch" đủ rộng
          để né). Veil cần để đạt contrast ≥4.5 vẫn là ~92% — Y HỆT mức cũ,
          KHÔNG hạ được như kỳ vọng ban đầu (brief đặt mục tiêu ngang ⑧⑨
          ~55-65%, không đạt — đã báo Kenji đúng mẫu "CẦN ẢNH MỚI", nhưng
          Kenji xác nhận muốn merge để xem trực tiếp, sẽ đánh giá bằng mắt sau
          khi lên production). Filter sepia(0.4) CÙNG grade tông với ④⑤⑧⑨. */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/home/essence-la-gi-v2.webp)", filter: "sepia(0.4)" }}
        aria-hidden="true"
      />
      {/* KHÔNG dùng bg-e26-ivory/70 — bug đã biết (xem HomeHero.tsx): token
          màu định nghĩa bằng hex thô qua var() khiến Tailwind không generate
          được modifier "/opacity", lớp phủ sẽ trong suốt hoàn toàn (im lặng,
          không lỗi build). Dùng color-mix() — kỹ thuật đã kiểm chứng. */}
      {/* SỬA 23/07/2026 (brief "⑥⑨ trong hơn 20%") — Kenji muốn thấy ảnh rõ hơn
          nữa. Đã THỬ 3 hướng trước khi chỉnh số:
          (1) Gradient NGANG (nặng trái/nhẹ phải, tận dụng chữ trải x23-77% mà
          cột bóng cây chỉ ở x25-27%): quét mịn 50 cột (2%/cột) cho thấy KHÔNG
          có "hành lang sạch" — hầu hết x0-58% đều có điểm cực tối (luminance
          4-28), và ngay cả x62-100% vẫn chỉ 27-47 (không đủ sáng). Vô hiệu.
          (2) `contrast(0.4)` (nén biên độ sáng-tối của ảnh, kéo bóng lên gần
          trung điểm): chỉ hạ được xuống ~85% veil (từ 92%), và làm ảnh mất
          hẳn chiều sâu nắng (nhìn phẳng/xám) — đổi không đáng.
          (3) Giảm alpha thẳng: nhị phân chính xác ngưỡng contrast=4.50 (canvas
          live) ra 89.4% — tức TỐI ĐA chỉ giảm được ~2.6 điểm % dù dùng cách gì,
          vì có 1 điểm chữ (đoạn thân bài, trùng đúng bóng cây) chạm RGB gần-đen
          tuyệt đối (6,5,4) mà không filter tầng hiển thị nào nâng nổi.
          Đã dựng ảnh so sánh CÓ CHỮ THẬT (canvas + SVG overlay, không chỉ số
          liệu) ở 3 mức 92/85/74% cho Kenji xem — Kenji CHỌN phương án AN TOÀN
          TỐI ĐA (giữ đúng chuẩn đọc 4.5:1, không đánh đổi), không chọn đẩy sâu
          tới ~74% (dù vẫn đọc được bằng mắt, sẽ có 1-2 dòng dưới chuẩn AA).
          92%→90% (dư biên nhỏ so với ngưỡng đo 89.4%) — cải thiện thật, đo
          live contrast: xem báo cáo. */}
      <div
        className="absolute inset-0 bg-[color-mix(in_srgb,var(--essence-cream-2026)_90%,transparent)]"
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
            nguyên font-serif italic, màu, line-height. */}
        <p className="e26-reveal font-serif italic font-normal text-[20px] md:text-[22px] leading-[1.7] text-e26-text-2">
          Mỗi ấn phẩm chuyên sâu gửi đến bạn đều do Kenji phân tích và viết, từ dòng đầu đến
          dòng cuối.
        </p>
      </div>
    </section>
  );
}

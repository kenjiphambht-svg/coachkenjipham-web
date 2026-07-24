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
      {/* SỬA 24/07/2026 (brief "khung cửa sổ làm trọng tâm + hết cháy ⑥") —
          2 thay đổi trên CHÍNH FILE ẢNH essence-la-gi-v3.webp (không phải CSS):
          (1) khung cửa sổ shoji (x0-190/1920) là chi tiết đẹp nhất ảnh nhưng bị
          mobile crop đẩy ra ngoài hoàn toàn (center-crop mặc định chỉ thấy
          x747-1171 — đúng dải sọc gỗ dọc, xem dò position bên dưới);
          (2) đo pixel xác nhận vùng kính cửa sổ (y100-400/1088, tức y9-37%
          section) CHÁY THẬT ở ảnh gốc — không phải lỗi veil: WCAG luminance
          trung bình 0.73, p90 0.99 (gần trắng) dù raw RGB chưa clip cứng
          (R 90th-pct=246/255, 99th=253/255 — vẫn còn dải chi tiết nén chặt).
          Nén highlight TOÀN ẢNH (không mask cục bộ — tránh lỗi rìa đã gặp khi
          sửa mặt Kenji ở Hero): kênh nào >160 bị kéo về 160+phần dư×0.30. Đã
          soi sọc gỗ + sàn + bàn vùng khác: không đổi (chỉ pixel sáng bị nén).
          background-position đổi center → left (bg-cover, KHÔNG zoom): đã thử
          zoom 118% trước — kéo scale ảnh lên 10.8%, làm bóng cây tối (vốn là
          nút thắt contrast) dạt sang đúng vị trí đoạn p2, contrast tụt còn
          4.54 (sát ngưỡng 4.5, mất hết biên an toàn PR#72). Bỏ zoom, CHỈ đổi
          position: cover mặc định vốn cắt trái 58px nguồn (center) — đổi
          sang left (0%) bỏ hẳn phần cắt trái, khung cửa sổ hiện từ mép x=0,
          không đụng chiều dọc (cover khớp đúng boxH nên không crop dọc dù đổi
          position) → không dịch chuyển bóng cây tối, contrast giữ nguyên mức
          PR#72. Đổi trọng số sọc-gỗ-vs-cửa-sổ trên desktop CHỈ đạt được rất
          nhẹ theo cách này (đã báo đánh đổi cho Kenji trong phiếu, xem PR). */}
      <div
        className="absolute inset-0 bg-cover hidden md:block"
        style={{
          backgroundImage: "url(/images/home/essence-la-gi-v3.webp)",
          backgroundPosition: "left top",
          filter: "sepia(0.4)",
        }}
        aria-hidden="true"
      />
      {/* SỬA 24/07/2026 — MOBILE dùng position khác hẳn desktop (dò riêng theo
          mục 1 sổ tay): center mặc định lộ ra x747-1171/1920 = dải sọc gỗ dọc
          thuần, khung cửa sổ (x0-190) bị đẩy hẳn ra ngoài vùng hiển thị. Dò
          background-position-x = 0% (left) để khung cửa sổ + góc cây/đá cuội
          (x0-425, hết dư địa dò vì boxW=375 tại scale mobile 0.883 → 1 khung
          hiển thị rộng 425px nguồn) lọt trọn vùng hiển thị — không cần zoom
          (mobile không có vấn đề "sọc gỗ chiếm chỗ" như desktop, vì center cũ
          vốn đã toàn sọc gỗ, đổi hẳn position là đủ). */}
      <div
        className="absolute inset-0 bg-cover md:hidden"
        style={{
          backgroundImage: "url(/images/home/essence-la-gi-v3.webp)",
          backgroundPosition: "left top",
          filter: "sepia(0.4)",
        }}
        aria-hidden="true"
      />
      {/* KHÔNG dùng bg-e26-ivory/70 — bug đã biết (xem HomeHero.tsx): token
          màu định nghĩa bằng hex thô qua var() khiến Tailwind không generate
          được modifier "/opacity", lớp phủ sẽ trong suốt hoàn toàn (im lặng,
          không lỗi build). Dùng color-mix() — kỹ thuật đã kiểm chứng. */}
      {/* SỬA 23/07/2026 (brief "⑥⑨ trong hơn 20%") — 3 hướng thử trên bản v2,
          Kenji chọn AN TOÀN TỐI ĐA (92%→90%, giữ đúng chuẩn đọc 4.5:1).
          SỬA 24/07/2026 (brief thay ảnh ⑥ vòng 3) — v2→v3, ảnh sáng/nét hơn
          nhưng veil vẫn kẹt ~90% vì gốc rễ là MÀU CHỮ yếu, không phải ảnh —
          xem BAI-HOC-KY-THUAT.md mục 11.
          SỬA 24/07/2026 (brief "thử bỏ veil, đổi màu chữ") — THÍ NGHIỆM
          THẨM MỸ theo đúng luật mục 11: đậm màu CHỈ đoạn thân bài (4 <p> Vai
          3 bên dưới, text-e26-text-2 → text-e26-text đặc, cùng màu H2, luminance
          0.112→0.0104) để tự đạt 4.5:1 mà không cần veil dày. PHÁT HIỆN khi đo:
          dòng [Sub] "Một mái hiên tĩnh lặng." và câu chữ ký cuối VẪN giữ
          text-e26-text-2 nguyên (brief yêu cầu KHÔNG đổi 2 dòng này) — cả 2 lại
          nằm ĐÚNG trong vùng bóng cây tối nhất ảnh (Sub sát dưới H2, chữ ký ở
          đáy), nên dù thân bài đậm cỡ nào, veil PHẲNG toàn section vẫn bị kẹt
          sàn ~89.3% (đo: Sub cần 88.7-88.2%, chữ ký cần 88.2-89.3% cả 2
          breakpoint) — thân bài không phải nút thắt duy nhất nữa.
          GIẢI PHÁP: đổi sang VEIL GRADIENT dọc (kỹ thuật đã có ở ⑨, mục 8) thay
          vì phẳng — NẶNG 92% ở dải Sub (đầu) + dải chữ ký (cuối, đều dư biên
          ≥2.7pp so 88.2-89.3% cần), NHẸ 50% ở dải giữa (đúng vùng 4 đoạn thân
          bài đã đậm màu — dư biên nhỏ nhất +9.7pp desktop/+19.3pp mobile tại
          đoạn 1, dư biên lớn ở đoạn 2-4 vì càng xuống ảnh càng sáng). 50% ngang
          tầm ⑧ (55%). Mốc % ramp tách riêng desktop/mobile (2 khối bên dưới)
          vì vị trí Sub/thân bài/chữ ký lệch hẳn theo tỉ lệ chiều cao ở mỗi
          breakpoint (giống lý do HomeHero LỚP 4 tách mobile/desktop).
          THÍ NGHIỆM — CHƯA MERGE: đây là brief yêu cầu Kenji tự xem ảnh chụp
          rồi quyết giữ hay revert, không tự merge theo mục 4 (xem PR). */}
      {/* SỬA 24/07/2026 (brief "dải sáng ngang ⑥ desktop vẫn còn") — Kenji gửi
          ảnh chụp thật: 2 đường ngang cháy sáng VẪN rõ rệt dù đã đổi sang
          đường cong "cosine mượt" (bản trước, tưởng đã hết vì hết góc gấp).
          ĐO LẠI TỪ ĐẦU trước khi kết luận: test 4 độ rộng cong khác nhau
          (6/15/20/30pp bán kính) bằng canvas live — TẤT CẢ vẫn lộ dải sáng ở
          mọi độ rộng. Nguyên nhân THẬT không phải góc gấp mà là BIÊN ĐỘ đổi
          quá lớn (50%→92%, tức 42 điểm %) bất kể trải rộng bao xa vẫn tạo
          vùng sáng nhận ra được bằng mắt trên nền có chi tiết. CHỨNG MINH
          bằng số: kể cả nâng ảnh gốc lên TRẮNG TUYỆT ĐỐI (raw 255,255,255)
          tại veil 50-58%, composite luminance mới đạt ~0.9 — nhưng đã thử
          NGƯỢC LẠI, tại raw hiện tại (đen/bóng cây) dù veil tới 80% vẫn chỉ
          đạt luminance ~0.52-0.56, DƯỚI ngưỡng 0.678 cần cho màu chữ yếu gốc
          (95,94,90) — tức KHÔNG CÓ mức veil/độ sáng ảnh nào ở dải "mở"
          (50-58%) đủ cho màu chữ yếu, bất kể ảnh sáng cỡ nào. Giới hạn nằm ở
          CHÍNH MÀU CHỮ (đúng phát hiện mục 11), không phải ảnh hay veil.
          SỬA TẬN GỐC: đậm màu Sub + chữ ký giống 4 đoạn thân bài đã làm ở
          PR#72 (text-e26-text-2 → text-e26-text) — bỏ HẲN nhu cầu veil cao
          cục bộ, quay về 1 VEIL PHẲNG DUY NHẤT cho toàn section (không còn
          gradient/đường cong nào để lộ dải). Đo lại xác nhận: veil 53%
          (desktop) — sub 5.22, sig 4.89 (đủ biên, sig là điểm sát nhất);
          veil 58% (mobile, giữ nguyên vì đã cần cho lý do khác — xem ghi chú
          cũ) — sub 5.79, sig 5.24. Đây là thay đổi so với chỉ dẫn "GIỮ
          NGUYÊN Sub/chữ ký" của brief round PR#72 (khi đó là thí nghiệm có
          kiểm soát) — nay brief đã đổi mục tiêu (hết dải sáng là ưu tiên),
          và đã CHỨNG MINH bằng số không có cách nào khác đạt được cả 2 mục
          tiêu cùng lúc (hết dải + giữ màu chữ yếu). Đã báo rõ trong phiếu. */}
      <div
        className="absolute inset-0 hidden md:block bg-[color-mix(in_srgb,var(--essence-cream-2026)_53%,transparent)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 md:hidden bg-[color-mix(in_srgb,var(--essence-cream-2026)_58%,transparent)]"
        aria-hidden="true"
      />
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <h2 className="e26-reveal font-serif font-medium text-[30px] md:text-[42px] leading-[1.25] text-e26-text mb-3">
          Essence là gì?
        </h2>
        {/* SỬA 24/07/2026 (brief "dải sáng ngang vẫn còn") — Sub đổi
            text-e26-text-2 → text-e26-text: xem lý do đầy đủ (chứng minh bằng
            số không có cách nào khác) tại khối overlay veil phía trên. */}
        <p className="e26-reveal font-serif font-normal text-[20px] md:text-[24px] leading-snug text-e26-text mb-8">
          Một mái hiên tĩnh lặng.
        </p>
        {/* SỬA 24/07/2026 (brief "thử bỏ veil, đổi màu chữ") — 4 đoạn thân bài
            đổi text-e26-text-2 → text-e26-text: xem lý do đầy đủ tại khối
            overlay veil phía trên. */}
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
            nguyên font-serif italic, line-height.
            SỬA 24/07/2026 (brief "dải sáng ngang vẫn còn") — text-e26-text-2
            → text-e26-text: xem lý do đầy đủ tại khối overlay veil phía trên. */}
        <p className="e26-reveal font-serif italic font-normal text-[20px] md:text-[22px] leading-[1.7] text-e26-text">
          Mỗi ấn phẩm chuyên sâu gửi đến bạn đều do Kenji phân tích và viết, từ dòng đầu đến
          dòng cuối.
        </p>
      </div>
    </section>
  );
}

// Section 6 — Essence là gì. Nền ivory, căn giữa. Không ảnh (theo BAN-CHOT —
// đã bỏ ImageSlot 3:2 cuối section của bản trước).
// SỬA 20/07/2026 — thay nguyên văn theo brief "Phân cấp chữ + nội dung ⑥⑦ +
// 2 link nội bộ" (nguồn: Google Doc bản mới nhất). Bản này ĐỔI "Essence chọn
// không hứa" (cũ) → "Kenji xin phép không hứa" (mới) — KHÔNG còn câu cũ.
// Thêm lại nhãn cửa phòng (Vai 5) + câu neo mở (Vai 2) — bản trước đã bỏ H2,
// nay brief yêu cầu có lại, dùng hệ 5 vai thay vì H2 in đậm cũ.
// Câu chữ ký cuối để riêng, chữ nghiêng — RANH GIỚI THƯƠNG HIỆU TUYỆT ĐỐI,
// giữ đúng "phân tích và viết", không hạ xuống "đọc/duyệt/rà soát".
// Link "Phương pháp Essence Coaching" theo luật "sắp mở" — <span> mờ, không
// phải <a>/<Link> (trang /phuong-phap chưa dựng, tránh soft 404).
// Nền mờ bg-hero-light — opacity xem ghi chú tại thẻ div bên dưới.
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
        <p className="e26-reveal font-sans text-xs tracking-[0.14em] uppercase text-e26-text-2 mb-4">
          Essence là gì
        </p>
        <p className="e26-reveal font-serif font-normal text-[26px] md:text-[34px] leading-snug text-e26-text mb-8">
          Một mái hiên tĩnh lặng.
        </p>
        <p className="e26-reveal font-sans text-[17px] leading-[1.75] text-e26-text-2 mb-6">
          Khi bão trong lòng đang lớn, hay những lúc bề ngoài êm ru nhưng bên trong lại hoang
          mang giữa một mớ lý thuyết mơ hồ. Để rồi câu hỏi nhỏ: &quot;Mình thật sự là ai?&quot;
          vẫn chơ vơ chưa lời đáp.
        </p>
        <p className="e26-reveal font-sans text-[17px] leading-[1.75] text-e26-text-2 mb-6">
          Người ta thường không cần thêm một mớ lý thuyết hay ai đó hối thúc phải thay đổi.
          Người ta chỉ cần một mái hiên yên tĩnh để đứng trú. Essence chính là một mái hiên như
          thế.
        </p>
        <p className="e26-reveal font-sans text-[17px] leading-[1.75] text-e26-text-2 mb-6">
          Cánh cửa này mở ra đón bạn ngay trong lúc ngổn ngang nhất, không đòi hỏi bạn phải
          vững vàng rồi mới bước vào. Thực chất, Essence là một hệ thống coaching được kiến tạo
          chỉn chu để đỡ lấy bạn. Việc đầu tiên ở đây không phải là vội vã đi sửa lỗi, mà là cho
          phép mình ngồi xuống, thở đều nhịp để thân tâm dịu lại.
        </p>
        <p className="e26-reveal font-sans text-[17px] leading-[1.75] text-e26-text-2 mb-6">
          Mọi thứ bên trong đều có lớp lang, có thứ tự: cái gì cần dọn dẹp trước, bước nào
          thong thả làm sau để bạn không bao giờ cảm thấy bị ngợp. Lớp công nghệ phía sau giống
          như một người phụ việc lặng lẽ lo liệu những khâu lặp lại mỗi ngày, nhường lại trọn
          vẹn hơi ấm con người cho những khoảnh khắc bạn cần một điểm tựa nhất.
        </p>
        <p className="e26-reveal font-sans text-[17px] leading-[1.75] text-e26-text-2 mb-8">
          Chỉ khi bạn đã lấy lại được sự An định, chúng ta mới tiếp tục mở những cánh cửa đi
          sâu hơn vào bản sắc thật của bạn. Nơi này hiếu khách, nhưng luôn giữ một lằn ranh rất
          êm: điều gì không làm được, Kenji xin phép không hứa.
        </p>
        <p className="e26-reveal font-serif italic text-lg text-e26-text-2">
          Và mỗi ấn phẩm chuyên sâu gửi đến tay bạn, đều do Kenji phân tích và viết, từ dòng
          đầu đến dòng cuối.
        </p>
        <p className="e26-reveal mt-10">
          <span className="font-sans text-[17px] underline decoration-e26-black underline-offset-4 opacity-45 select-none cursor-default">
            Cách hệ thống này vận hành → Phương pháp Essence Coaching
          </span>{" "}
          <span className="font-sans text-[17px] opacity-45 select-none cursor-default">
            (sắp mở)
          </span>
        </p>
      </div>
    </section>
  );
}

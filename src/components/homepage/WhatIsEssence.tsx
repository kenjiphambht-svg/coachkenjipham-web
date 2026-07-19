// Section 6 — Essence là gì. Nền ivory, căn giữa. Không ảnh (theo BAN-CHOT —
// đã bỏ ImageSlot 3:2 cuối section của bản trước).
// SỬA 19/07/2026 — theo BAN-CHOT-v8-FINAL.md (thay thế BAN-CHOT-v8.md cũ, có
// 3 lỗi đã sửa): bản v8 cũ ghi NHẦM "Essence không mở cửa nào..." — đây LÀ
// LỖI CỦA CHÍNH NGUỒN v8 cũ, không phải lỗi paraphrase. FINAL trả về đúng bản
// "nếp nhà" gốc từ Google Doc. COPY NGUYÊN VĂN, không gõ lại theo trí nhớ.
// FINAL KHÔNG còn câu mở in đậm (H2) — đoạn văn bắt đầu thẳng, không tiêu đề
// phụ. Câu chữ ký cuối để riêng, chữ nghiêng — RANH GIỚI THƯƠNG HIỆU TUYỆT
// ĐỐI, giữ đúng "phân tích và viết", không hạ xuống "đọc/duyệt/rà soát".
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
        <p className="e26-reveal font-sans text-[17px] leading-[1.75] text-e26-text-2 mb-6">
          Cánh cửa Essence luôn ở đó, không hối thúc. Chỉ là đôi khi, chúng tôi đợi bạn đứng
          đủ vững rồi mới mời bạn bước sang căn phòng kế tiếp.
        </p>
        <p className="e26-reveal font-sans text-[17px] leading-[1.75] text-e26-text-2 mb-8">
          Nơi này vận hành tĩnh lặng nhưng có một trật tự rõ ràng. Có việc nào cần làm trước,
          có bước nào thong thả làm sau, để bạn không bị ngợp. Hệ thống phía sau dù mạnh mẽ
          đến đâu, mọi điểm chạm cốt lõi vẫn luôn được giữ nhịp bởi con người. Ở đây có một
          ranh giới rất êm: điều gì không giữ được, Essence chọn không hứa.
        </p>
        <p className="e26-reveal font-serif italic text-lg text-e26-text-2">
          Và mỗi ấn phẩm chuyên sâu gửi đến tay bạn, đều do Kenji phân tích và viết, từ dòng
          đầu đến dòng cuối.
        </p>
      </div>
    </section>
  );
}

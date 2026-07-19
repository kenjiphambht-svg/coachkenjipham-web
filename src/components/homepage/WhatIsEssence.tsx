// Section 6 — Essence là gì. Nền ivory, căn giữa. Không ảnh (theo BAN-CHOT —
// đã bỏ ImageSlot 3:2 cuối section của bản trước).
// BAN-CHOT-v8 (19/07/2026): bỏ bố cục "3 trụ cụt" (Có hệ thống/Có thứ tự/Có
// ranh giới), thay bằng văn xuôi liền mạch — tinh thần "nếp nhà". Câu chữ ký
// cuối để riêng, chữ nghiêng — sự thật, không phải lời hứa quá tay: RANH GIỚI
// THƯƠNG HIỆU TUYỆT ĐỐI, không hạ xuống thành "đọc/duyệt/rà soát", giữ đúng
// "Kenji phân tích và viết, từ dòng đầu đến dòng cuối".
export default function WhatIsEssence() {
  return (
    <section className="relative bg-e26-ivory px-6 py-16 md:py-32">
      {/* VIỆC 3 (19/07/2026) — vật liệu nền dùng chung "vệt nắng" (bg-hero-light),
          opacity rất thấp trên nền ivory gốc — cùng kỹ thuật KietTac. z-auto:
          khối kem-đậm bên dưới được nâng "relative z-10" để không bị đè. */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.05]"
        style={{ backgroundImage: "url(/images/home/bg-hero-light.webp)" }}
        aria-hidden="true"
      />
      {/* Khối kem đậm ngang (họ khối ③) — bọc toàn nội dung ⑥. Không thêm ảnh
          (section vốn không ảnh theo BAN-CHOT). Bố cục 3 trụ + chữ ký GIỮ
          NGUYÊN, chỉ đổi từ nền trần sang khối có biên rõ. */}
      <div className="relative z-10 max-w-3xl mx-auto text-center bg-e26-cream-deep px-8 py-14 md:px-16 md:py-20">
        <h2 className="e26-reveal font-serif font-normal text-[26px] md:text-[36px] leading-snug text-e26-text mb-8">
          Essence không mở cửa nào khi người ta chưa đứng vững.
        </h2>
        <p className="e26-reveal font-sans text-[17px] leading-[1.75] text-e26-text-2 mb-8">
          Ở đây, việc gì cũng có thứ tự của nó — việc nào trước, việc nào sau, không nhảy cóc.
          Hệ thống phía sau dù mạnh mẽ đến đâu, mọi điểm chạm cốt lõi vẫn luôn được giữ nhịp
          bởi con người. Ở đây có một ranh giới rất êm: điều gì không giữ được, Essence chọn
          không hứa.
        </p>
        <p className="e26-reveal font-serif italic text-lg text-e26-text-2">
          Và mỗi ấn phẩm chuyên sâu gửi đến tay bạn, đều do Kenji phân tích và viết, từ dòng
          đầu đến dòng cuối.
        </p>
      </div>
    </section>
  );
}

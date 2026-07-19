// Section 6 — Essence là gì. Nền ivory, căn giữa. Không ảnh (theo BAN-CHOT —
// đã bỏ ImageSlot 3:2 cuối section của bản trước). Câu chữ ký AI cuối để
// riêng, chữ nghiêng — sự thật, không phải lời hứa quá tay: không hạ xuống
// thành "Kenji đọc", giữ nguyên "Kenji phân tích và viết từ đầu đến cuối".
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
        <h2 className="e26-reveal font-serif font-normal text-[26px] md:text-[36px] leading-snug text-e26-text mb-14">
          Essence không mở cửa nào khi người ta chưa đứng vững.
        </h2>
        <div className="e26-reveal grid md:grid-cols-3 gap-8 md:gap-6 text-center mb-14">
          <div>
            <p className="font-serif text-xl text-e26-text mb-2">Có hệ thống.</p>
            <p className="font-sans text-[15px] leading-[1.6] text-e26-text-2">
              Lớp vận hành AI hỗ trợ phía sau để quy trình nhịp nhàng, nhưng mọi điểm chạm cốt
              lõi đều do con người quyết định.
            </p>
          </div>
          <div>
            <p className="font-serif text-xl text-e26-text mb-2">Có thứ tự.</p>
            <p className="font-sans text-[15px] leading-[1.6] text-e26-text-2">
              Việc nào trước, việc nào sau.
            </p>
          </div>
          <div>
            <p className="font-serif text-xl text-e26-text mb-2">Có ranh giới.</p>
            <p className="font-sans text-[15px] leading-[1.6] text-e26-text-2">
              Không giữ được thì không hứa.
            </p>
          </div>
        </div>
        <p className="e26-reveal font-serif italic text-lg text-e26-text-2">
          Các ấn phẩm chuyên sâu gửi đến bạn, Kenji phân tích và viết từ đầu đến cuối.
        </p>
      </div>
    </section>
  );
}

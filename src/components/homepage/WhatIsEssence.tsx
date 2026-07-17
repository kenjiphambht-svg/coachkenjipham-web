// Section 6 — Essence là gì. Nền ivory, căn giữa. Không ảnh (theo BAN-CHOT —
// đã bỏ ImageSlot 3:2 cuối section của bản trước). Câu chữ ký AI cuối để
// riêng, chữ nghiêng — sự thật, không phải lời hứa quá tay: không hạ xuống
// thành "Kenji đọc", giữ nguyên "Kenji phân tích và viết từ đầu đến cuối".
export default function WhatIsEssence() {
  return (
    <section className="bg-e26-ivory px-6 py-16 md:py-32">
      <div className="max-w-3xl mx-auto text-center">
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

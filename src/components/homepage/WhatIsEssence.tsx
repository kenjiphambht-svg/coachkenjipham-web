import ImageSlot from "./ImageSlot";

// Section 4 — Essence là gì. Nền ivory. CĂN GIỮA — khoảnh khắc cân bằng duy nhất giữa trang.
// Mức public: có cấu trúc, có ranh giới, không hứa phép màu. AI chỉ đứng "phía sau".
// Cuối section: slot ảnh không khí 3:2 (fallback cream + hairline vàng khi chưa có ảnh).
export default function WhatIsEssence() {
  return (
    <section id="essence" className="bg-e26-ivory px-6 py-16 md:py-32 scroll-mt-10">
      <div className="max-w-[1120px] mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="e26-reveal font-serif font-normal text-[28px] md:text-[40px] text-e26-text mb-8">
            Essence là gì?
          </h2>
          <p className="e26-reveal font-sans text-[17px] leading-[1.65] text-e26-text-2 max-w-2xl mx-auto mb-12">
            Essence là một cách làm việc với nội tâm có cấu trúc: nhìn rõ trước, đi sâu sau,
            và luôn giữ ranh giới an toàn. Phía sau có công nghệ giúp mọi thứ chỉn chu —
            nhưng bản cuối cùng gửi đến bạn luôn do Kenji đọc và duyệt.
          </p>
          <div className="e26-reveal grid md:grid-cols-3 gap-8 md:gap-6 text-center">
            <div>
              <p className="font-serif text-xl text-e26-text mb-2">Có cấu trúc</p>
              <p className="font-sans text-[15px] leading-[1.6] text-e26-text-2">không mơ hồ.</p>
            </div>
            <div>
              <p className="font-serif text-xl text-e26-text mb-2">Có ranh giới</p>
              <p className="font-sans text-[15px] leading-[1.6] text-e26-text-2">
                không hứa điều không giữ được.
              </p>
            </div>
            <div>
              <p className="font-serif text-xl text-e26-text mb-2">Có con người</p>
              <p className="font-sans text-[15px] leading-[1.6] text-e26-text-2">
                bản cuối do Kenji duyệt.
              </p>
            </div>
          </div>
        </div>

        <div className="e26-reveal mt-16 md:mt-20">
          <ImageSlot ratio="3/2" />
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";

// Section 2 — Kenji như người thật. Nền white, editorial 2 cột: ảnh 5/12, chữ 7/12.
// Ảnh 4:5 object-cover + caption "Sài Gòn · 2026" + hairline.
// Pull-quote Cormorant italic ~24px với gạch vàng trái.
// SWAP SLOT: đổi src sang ảnh chân dung web-ready mới khi có (giữ tỉ lệ 4:5).
export default function KenjiSection() {
  return (
    <section className="bg-e26-white px-6 py-16 md:py-32">
      <div className="max-w-[1120px] mx-auto">
        <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-start">
          {/* --- Ảnh chân dung 5/12 (swap slot 4:5) --- */}
          {/* Cảnh riêng trên mobile cinema: chân dung full màn */}
          <figure className="cinema-scene e26-reveal md:col-span-5">
            <div className="relative w-full aspect-[4/5] overflow-hidden">
              <Image
                src="/klp.jpg"
                alt="Kenji Phạm — Essence Coach"
                fill
                sizes="(max-width: 768px) 100vw, 42vw"
                className="object-cover"
              />
            </div>
            <figcaption className="font-sans text-sm text-e26-text-2 pt-3 pb-3 border-b border-e26-border">
              Sài Gòn · 2026
            </figcaption>
          </figure>

          {/* --- Nội dung 7/12 --- */}
          {/* Cảnh riêng trên mobile cinema: lời Kenji + pull-quote */}
          <div className="cinema-scene e26-reveal md:col-span-7">
            <h2 className="font-serif font-normal text-[28px] md:text-[40px] text-e26-text mb-6">
              Tôi là Kenji Phạm.
            </h2>
            <p className="font-sans text-[17px] leading-[1.65] text-e26-text-2 max-w-xl mb-8">
              Tám năm qua, tôi ngồi cùng người lớn trong những đoạn họ muốn nhìn lại chính mình —
              và cùng ba mẹ, khi họ muốn hiểu con hơn.
            </p>
            <blockquote className="border-l border-e26-gold pl-6">
              <p className="font-serif italic text-2xl leading-snug text-e26-text max-w-lg">
                Tôi không tin ai đó cần được sửa. Phần lớn chúng ta chỉ cần được nhìn thấy đúng,
                rồi tự mình chọn bước tiếp theo.
              </p>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}

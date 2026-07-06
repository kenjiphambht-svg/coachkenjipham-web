import Image from "next/image";

// Section 2 — Kenji như người thật. Nền white, light editorial 2-column.
// Ảnh ~40% ngang, crop 4:5, ánh sáng ban ngày.
// SWAP SLOT: đổi src bên dưới sang ảnh chân dung web-ready mới khi có (giữ tỉ lệ 4:5).
export default function KenjiSection() {
  return (
    <section className="bg-e26-white px-6 py-24 md:py-32">
      <div className="max-w-[1120px] mx-auto">
        <div className="grid md:grid-cols-[2fr_3fr] gap-10 md:gap-16 items-center">
          {/* --- Ảnh chân dung (swap slot 4:5) --- */}
          <div className="fade-in-section">
            <div className="relative w-full aspect-[4/5] overflow-hidden">
              <Image
                src="/klp.jpg"
                alt="Kenji Phạm — Essence Coach"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* --- Nội dung --- */}
          <div className="fade-in-section">
            <h2 className="font-serif font-normal text-[28px] md:text-[40px] text-e26-text mb-6">
              Tôi là Kenji Phạm.
            </h2>
            <div className="space-y-4 font-sans text-[17px] leading-[1.65] text-e26-text-2 max-w-xl">
              <p>
                Tám năm qua, tôi ngồi cùng người lớn trong những đoạn họ muốn nhìn lại chính mình —
                và cùng ba mẹ, khi họ muốn hiểu con hơn.
              </p>
              <p>
                Tôi không tin ai đó cần được sửa. Phần lớn chúng ta chỉ cần được nhìn thấy đúng,
                rồi tự mình chọn bước tiếp theo.
              </p>
              <p className="text-sm">Sống và làm việc tại Sài Gòn.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";

// Section 2 — Kenji như người thật. Nền white, light editorial.
// Ảnh thật của Kenji (klp.jpg — chỉ tham chiếu, không sửa asset).
export default function KenjiSection() {
  return (
    <section className="bg-e26-white px-6 py-20 md:py-28">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-10 md:gap-14">
          <div className="fade-in-section w-[200px] h-[200px] md:w-[240px] md:h-[240px] flex-shrink-0 overflow-hidden">
            <Image
              src="/klp.jpg"
              alt="Kenji Phạm — Essence Coach"
              width={480}
              height={480}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="fade-in-section text-center md:text-left">
            <h2 className="font-serif font-normal text-3xl md:text-4xl text-e26-text mb-6">
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

import Link from "next/link";
import ImageSlot from "./ImageSlot";

export default function KenjiSection() {
  return (
    <section className="relative bg-e26-white px-6 py-16 md:py-28">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/home/kenji-phong-doc1.webp)", filter: "sepia(0.4)" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[color-mix(in_srgb,var(--essence-cream-2026)_72%,transparent)]" aria-hidden="true" />
      <div className="relative z-10 max-w-[1120px] mx-auto flex flex-col gap-10 md:flex-row md:items-center md:gap-16">
        <figure className="e26-reveal w-full max-w-[360px] mx-auto shrink-0 md:mx-0 md:w-[40%] md:max-w-none">
          <ImageSlot ratio="4/5" src="/images/home/kenji-portrait.webp" alt="Kenji Phạm — chân dung" />
        </figure>
        <div className="w-full md:flex-1">
          <p className="e26-reveal font-sans text-xs font-medium tracking-[0.18em] uppercase text-e26-text-2 mb-6">Tôi là Kenji Phạm.</p>
          <h2 className="e26-reveal font-serif font-medium text-[30px] md:text-[42px] leading-[1.25] text-e26-text mb-3">Kenji Phạm</h2>
          <p className="e26-reveal font-sans font-medium text-[16px] md:text-[17px] leading-[1.7] text-e26-text-2 mb-8">
            Kenji Phạm — Huấn luyện viên Tâm lý Chiều sâu, Essence Coach.<br />
            Người sáng lập Essence Coaching.
          </p>
          <div className="e26-reveal space-y-5 font-sans font-normal text-[18px] leading-[1.9] text-e26-text-2 max-w-xl">
            <p>Đằng sau một sự mệt mỏi không phải lúc nào cũng là thiếu nghỉ ngơi.</p>
            <p>Đằng sau một quyết định khó không phải lúc nào cũng là thiếu lựa chọn.</p>
            <p>Tôi giúp bạn nhìn ra những phản xạ, vai diễn và vòng lặp đang âm thầm dẫn cách bạn sống — để điều đang rối có cấu trúc, điều đang mơ hồ có tên gọi, và lựa chọn tiếp theo thật sự thuộc về bạn.</p>
            <p>Tôi không giúp ai đi nhanh hơn.</p>
            <p>Tôi giữ cho không gian đủ yên để họ nhìn rõ điều đang diễn ra và nghe được chính mình.</p>
          </div>
          <blockquote className="e26-reveal border-l border-e26-black pl-6 mt-10">
            <p className="font-serif italic font-medium text-[30px] md:text-[42px] leading-[1.25] text-e26-text max-w-lg">“Tôi không sửa. Tôi tạo sự An định.”</p>
          </blockquote>
          <p className="e26-reveal mt-7">
            <Link href="/ve-kenji" aria-label="Tìm hiểu hành trình và nền tảng của Kenji Phạm" className="font-sans font-normal text-[17px] text-e26-text underline decoration-e26-black underline-offset-4 hover:text-e26-gold-deep transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-e26-gold focus-visible:ring-offset-4 focus-visible:ring-offset-e26-cream">
              Hành trình và nền tảng của Kenji →
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";

export default function WhatIsEssence() {
  return (
    <section className="relative bg-e26-ivory px-6 py-16 md:py-32">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/home/essence-la-gi-v4.webp)", filter: "sepia(0.4)" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[color-mix(in_srgb,var(--essence-cream-2026)_42%,transparent)]" aria-hidden="true" />
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <h2 className="e26-reveal font-serif font-medium text-[30px] md:text-[42px] leading-[1.25] text-e26-text mb-3">
          Essence Coaching là gì?
        </h2>
        <p className="e26-reveal font-serif italic font-normal text-[20px] md:text-[24px] leading-snug text-e26-text mb-8">
          Một khoảng lặng để bạn nhận ra điều thật sự thuộc về mình.
        </p>
        <p className="e26-reveal font-sans font-medium text-[17px] md:text-[18px] leading-[1.9] text-e26-text mb-8">
          Essence Coaching là hành trình do Kenji Phạm kiến tạo, giúp bạn nhìn rõ điều đang vận hành bên trong, nhận ra bản sắc và sống đúng nhịp của mình — để An Thịnh trở thành kết quả tự nhiên, thay vì một điều phải mãi theo đuổi.
        </p>
        <div className="e26-reveal space-y-6 font-sans font-normal text-[17px] md:text-[18px] leading-[1.9] text-e26-text mb-10">
          <p>ESSENCE không bắt đầu bằng câu hỏi:<br />“Làm sao để bạn tốt hơn?”</p>
          <p>ESSENCE bắt đầu bằng một câu hỏi khác:<br />“Điều gì đang thật sự dẫn nhịp sống của bạn?”</p>
          <p>Có những phản xạ từng giúp ta an toàn.<br />Có những vai diễn từng giúp ta được công nhận.<br />Có những lựa chọn từng rất đúng — nhưng không còn vừa với hôm nay.</p>
          <p>Khi những phản xạ, vai diễn và lựa chọn cũ được nhìn rõ, bạn không còn phải ép mình sống theo một phiên bản không còn vừa nữa.</p>
          <p>Bạn bắt đầu nhận ra điều gì thật sự thuộc về mình — và điều gì đã đến lúc được chọn lại.</p>
        </div>
        <p className="e26-reveal mb-10">
          <Link href="/phuong-phap" aria-label="Tìm hiểu phương pháp Essence Coaching" className="font-sans font-normal text-[17px] text-e26-text underline decoration-e26-black underline-offset-4 hover:text-e26-gold-deep transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-e26-gold focus-visible:ring-offset-4 focus-visible:ring-offset-e26-ivory">
            Phương pháp Essence Coaching →
          </Link>
        </p>
        <p className="e26-reveal font-serif italic font-normal text-[20px] md:text-[22px] leading-[1.7] text-e26-text">
          Mỗi ấn phẩm chuyên sâu gửi đến bạn đều do Kenji phân tích chuyên môn và viết, từ dòng đầu đến dòng cuối.
        </p>
      </div>
    </section>
  );
}

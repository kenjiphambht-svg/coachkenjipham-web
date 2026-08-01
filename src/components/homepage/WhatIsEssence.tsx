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
      <div className="relative z-10 mx-auto max-w-6xl text-center">
        <h2 className="e26-reveal font-serif font-medium text-[34px] leading-[1.2] text-e26-text md:text-[46px]">
          Essence Coaching là gì?
        </h2>
        <p className="e26-reveal mx-auto mt-5 max-w-2xl font-serif text-[22px] font-normal italic leading-[1.4] text-e26-text md:mt-6 md:text-[28px]">
          Một khoảng lặng để bạn nhận ra điều thật sự thuộc về mình.
        </p>

        <p className="e26-reveal mx-auto mt-12 max-w-[900px] font-sans text-[22px] font-normal leading-[1.7] text-e26-text md:text-[27px] md:leading-[1.7]">
          <span className="font-medium">Essence Coaching là hành trình do Kenji Phạm kiến tạo</span>, giúp bạn nhìn rõ điều đang vận hành bên trong, nhận ra bản sắc và sống đúng nhịp của mình — <span className="font-medium">để An Thịnh trở thành kết quả tự nhiên</span>, thay vì một điều phải mãi theo đuổi.
        </p>

        <div className="mx-auto mt-16 max-w-[720px] text-center text-e26-text md:mt-20">
          <div className="e26-reveal">
            <p className="font-sans text-[14px] font-medium leading-[1.55] text-e26-text-2 md:text-[15px]">
              ESSENCE không bắt đầu bằng câu hỏi:
            </p>
            <p className="mt-4 font-serif text-[24px] font-normal leading-[1.35] md:text-[30px]">
              “Làm sao để bạn tốt hơn?”
            </p>
          </div>

          <div className="e26-reveal mt-14 md:mt-20">
            <p className="font-sans text-[14px] font-medium leading-[1.55] text-e26-text-2 md:text-[15px]">
              ESSENCE bắt đầu bằng một câu hỏi khác:
            </p>
            <p className="mx-auto mt-5 max-w-[620px] font-serif text-[31px] font-medium leading-[1.24] md:text-[42px]">
              “Điều gì đang thật sự dẫn nhịp sống của bạn?”
            </p>
          </div>

          <div className="e26-reveal mt-14 space-y-5 font-sans text-[17px] font-normal leading-[1.8] md:mt-20 md:text-[19px]">
            <p>Có những phản xạ từng giúp ta an toàn.</p>
            <p>Có những vai diễn từng giúp ta được công nhận.</p>
            <p>Có những lựa chọn từng rất đúng — nhưng không còn vừa với hôm nay.</p>
          </div>

          <p className="e26-reveal mx-auto mt-14 max-w-[680px] font-sans text-[17px] font-normal leading-[1.8] md:mt-20 md:text-[19px]">
            Khi những phản xạ, vai diễn và lựa chọn cũ được nhìn rõ, bạn không còn phải ép mình sống theo một phiên bản không còn vừa nữa.
          </p>
          <p className="e26-reveal mx-auto mt-9 max-w-[720px] font-serif text-[25px] font-normal leading-[1.42] text-e26-text md:text-[31px]">
            Bạn bắt đầu nhận ra điều gì thật sự thuộc về mình — và điều gì đã đến lúc được chọn lại.
          </p>
        </div>

        <p className="e26-reveal mt-14 md:mt-20">
          <Link href="/phuong-phap" aria-label="Tìm hiểu phương pháp Essence Coaching" className="inline-flex items-center whitespace-nowrap font-sans text-[17px] font-normal text-e26-text underline decoration-e26-black underline-offset-4 transition-colors duration-300 hover:text-e26-gold-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-e26-gold focus-visible:ring-offset-4 focus-visible:ring-offset-e26-ivory">
            Phương pháp Essence Coaching →
          </Link>
        </p>
        <p className="e26-reveal mx-auto mt-12 max-w-3xl font-serif text-[20px] font-normal italic leading-[1.65] text-e26-text md:mt-16 md:text-[23px]">
          Mỗi ấn phẩm chuyên sâu gửi đến bạn đều do Kenji phân tích và viết, từ dòng đầu đến dòng cuối.
        </p>
      </div>
    </section>
  );
}

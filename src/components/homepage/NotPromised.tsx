import Link from "next/link";
import Image from "next/image";

export default function NotPromised() {
  return (
    <section className="relative overflow-hidden bg-e26-cream px-6 py-28 md:py-40">
      <Image
        src="/images/home/not-promised-plaster-field.webp"
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-center opacity-65"
        style={{ filter: "saturate(0.82) contrast(0.92) brightness(1.06)" }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 md:hidden"
        style={{ background: "radial-gradient(ellipse at center, color-mix(in srgb, var(--essence-cream-2026) 94%, transparent) 0%, color-mix(in srgb, var(--essence-cream-2026) 88%, transparent) 100%)" }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 hidden md:block"
        style={{ background: "radial-gradient(ellipse at center, color-mix(in srgb, var(--essence-cream-2026) 90%, transparent) 0%, color-mix(in srgb, var(--essence-cream-2026) 76%, transparent) 100%)" }}
        aria-hidden="true"
      />
      <div className="relative z-10 mx-auto max-w-[760px] text-center text-e26-text">
        <h2 className="e26-reveal font-serif text-[34px] font-medium leading-[1.2] md:text-[46px]">Điều Essence không hứa.</h2>

        <div className="mt-12 md:mt-16">
          <p className="e26-reveal mx-auto max-w-[600px] font-serif text-[27px] font-normal leading-[1.35] md:text-[36px]">
            Essence không hứa trao cho bạn một đáp án đúng sẵn.
          </p>
          <p className="e26-reveal mx-auto mt-12 max-w-[720px] font-sans text-[17px] font-normal leading-[1.8] md:mt-16 md:text-[19px]">
            Điều Essence làm là giúp bạn nhìn đúng điều đang vận hành bên trong, hiểu nó đủ sâu, và <span className="font-medium">trở lại với quyền lựa chọn của chính mình</span>.
          </p>
          <p className="e26-reveal mx-auto mt-14 max-w-[720px] font-serif text-[26px] font-normal leading-[1.38] md:mt-20 md:text-[34px]">
            Bởi một lựa chọn chỉ thật sự là của bạn khi nó không còn được sinh ra từ nỗi sợ và phản xạ cũ.
          </p>
        </div>

        <Link href="/dieu-essence-khong-hua" aria-label="Mời bạn đọc đầy đủ những điều Essence không hứa" className="e26-reveal mt-14 inline-flex items-center whitespace-nowrap font-sans text-[15px] font-normal text-e26-text underline decoration-e26-black underline-offset-4 transition-colors duration-300 hover:text-e26-gold-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-e26-gold focus-visible:ring-offset-4 focus-visible:ring-offset-e26-cream md:mt-20">
          Mời bạn đọc đầy đủ →
        </Link>
      </div>
    </section>
  );
}

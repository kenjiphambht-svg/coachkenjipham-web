import Link from "next/link";

export default function NotPromised() {
  return (
    <section className="relative overflow-hidden bg-e26-cream px-6 py-28 md:py-40">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 20% 25%, var(--essence-ivory-2026) 0%, transparent 40%), linear-gradient(145deg, var(--essence-cream-2026), var(--essence-cream-deep-2026))",
        }}
        aria-hidden="true"
      />
      <div className="relative z-10 max-w-[720px] mx-auto text-center">
        <h2 className="e26-reveal font-serif font-medium text-[30px] md:text-[42px] leading-[1.25] text-e26-text">Điều Essence không hứa.</h2>
        <div className="e26-reveal mt-10 space-y-6 font-sans font-normal text-[17px] md:text-[18px] leading-[1.9] text-e26-text">
          <p>Essence không hứa trao cho bạn một đáp án đúng sẵn.</p>
          <p>Điều Essence làm là giúp bạn nhìn đúng điều đang vận hành bên trong, hiểu nó đủ sâu, và trở lại với quyền lựa chọn của chính mình.</p>
          <p>Bởi một lựa chọn chỉ thật sự là của bạn khi nó không còn được sinh ra từ nỗi sợ và phản xạ cũ.</p>
        </div>
        <Link href="/dieu-essence-khong-hua" aria-label="Đọc đầy đủ những điều Essence không hứa" className="group e26-reveal mt-10 inline-flex items-center gap-1.5 font-sans font-normal text-[15px] text-e26-text underline decoration-e26-black underline-offset-4 hover:text-e26-gold-deep transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-e26-gold focus-visible:ring-offset-4 focus-visible:ring-offset-e26-cream">
          Đọc đầy đủ <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </Link>
      </div>
    </section>
  );
}

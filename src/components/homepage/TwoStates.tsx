import Link from "next/link";
import ImageSlot from "./ImageSlot";

const cardLinkClass =
  "font-sans font-normal text-[15px] leading-[1.6] text-e26-text underline decoration-e26-black underline-offset-4 hover:text-e26-gold-deep transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-e26-gold focus-visible:ring-offset-4 focus-visible:ring-offset-e26-cream";

export default function TwoStates() {
  return (
    <section className="relative overflow-hidden bg-e26-cream px-6 py-16 md:py-32">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, var(--essence-cream-2026) 0%, var(--essence-ivory-2026) 52%, var(--essence-cream-2026) 100%)",
        }}
        aria-hidden="true"
      />
      <div className="relative max-w-[1120px] mx-auto">
        <h2 className="sr-only">Hai cánh cửa để bắt đầu</h2>
        <p className="e26-reveal font-sans text-xs font-medium tracking-[0.18em] uppercase text-e26-text-2 mb-16 md:mb-20">
          Ở đây có hai cánh cửa.
        </p>

        <div className="grid md:grid-cols-2 gap-14 md:gap-10">
          <article className="e26-reveal group">
            <figure className="relative z-20 mx-auto w-[88%] overflow-hidden">
              <ImageSlot
                ratio="4/5"
                src="/images/home/ban-sac-cua-ban-quiet-pause.webp"
                alt="Chiếc bàn gỗ và hai chiếc ghế trong một khoảng sáng yên tĩnh"
              />
            </figure>
            <div className="relative z-10 -mt-10 border border-transparent bg-e26-cream-deep px-6 pt-16 pb-9 transition-colors duration-300 group-hover:border-e26-gold focus-within:border-e26-gold">
              <h3 className="font-sans text-xs font-medium tracking-[0.18em] uppercase text-e26-text-2 mb-4">
                Bản Sắc Của Bạn
              </h3>
              <div className="space-y-5 font-serif font-normal text-[22px] md:text-2xl leading-snug text-e26-text-2 mb-7">
                <p>Có một kiểu mệt không đến từ việc làm quá nhiều.</p>
                <p>Nó đến từ việc sống quá lâu trong một phiên bản phải luôn đúng, luôn ổn, luôn gánh.</p>
                <p>Đến một lúc, bạn vẫn làm được mọi việc. Chỉ là không còn thấy mình trong đó.</p>
              </div>
              <Link href="/ban-sac-cua-ban" aria-label="Mời bạn vào không gian Bản Sắc Của Bạn" className={cardLinkClass}>
                Mời bạn vào không gian Bản Sắc Của Bạn →
              </Link>
            </div>
          </article>

          <article className="e26-reveal group md:mt-20">
            <figure className="relative z-20 mx-auto w-[88%] overflow-hidden">
              <ImageSlot
                ratio="4/5"
                src="/images/home/child-door-dusk.webp"
                alt="Hành lang tối nhìn qua khung cửa, đèn ngủ ấm — không có mặt người"
              />
            </figure>
            <div className="relative z-10 -mt-10 border border-transparent bg-e26-cream-deep px-6 pt-16 pb-9 transition-colors duration-300 group-hover:border-e26-gold focus-within:border-e26-gold">
              <h3 className="font-sans text-xs font-medium tracking-[0.18em] uppercase text-e26-text-2 mb-4">
                Bản Sắc Của Con
              </h3>
              <div className="space-y-5 font-serif font-normal text-[22px] md:text-2xl leading-snug text-e26-text mb-7">
                <p>Bạn thương con.</p>
                <p>Nhưng càng thương, càng sợ mình đang nhìn con bằng nỗi lo của chính mình.</p>
                <p>Bạn muốn hiểu điều đang diễn ra, trước khi vội sửa, vội gọi tên hay quyết định con nên trở thành ai.</p>
              </div>
              <Link href="/ban-sac-cua-con" aria-label="Mời bạn vào không gian Bản Sắc Của Con" className={cardLinkClass}>
                Mời bạn vào không gian Bản Sắc Của Con →
              </Link>
            </div>
          </article>
        </div>

        <p className="e26-reveal font-serif font-medium text-[30px] md:text-[42px] leading-[1.25] text-e26-text mt-16 md:mt-20 max-w-lg">
          Bạn biết mình đang đứng gần bên nào hơn.
        </p>
      </div>
    </section>
  );
}

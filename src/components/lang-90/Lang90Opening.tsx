import {
  bodyClass,
  darkSectionLabelClass,
  headingClass,
  whisperClass,
} from "./Lang90Frame";
import Lang90Reveal from "./Lang90Reveal";
import StoryboardSlot from "./StoryboardSlot";
import { lang90Cormorant, lang90Newsreader } from "./Lang90Typography";

export function Lang90Hero() {
  return (
    <section className="relative flex min-h-[92svh] overflow-hidden bg-e26-black px-6 py-16 md:min-h-[94svh] md:py-24">
      <StoryboardSlot id="SB-HERO" tone="hero" className="absolute inset-0" />
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(26,26,26,0.08),rgba(26,26,26,0.18)_52%,rgba(26,26,26,0.72))]" />
      <div className="relative mx-auto flex w-full max-w-[1080px] flex-col justify-end pb-3 md:pb-10">
        <Lang90Reveal>
          <p className={darkSectionLabelClass}>Lặng</p>
        </Lang90Reveal>
        <Lang90Reveal delay="short" className="mt-8 max-w-[880px]">
          <h1 className={`max-w-[820px] ${lang90Cormorant.className} text-[27px] font-medium leading-[1.08] tracking-[-0.02em] text-e26-text-dark sm:text-[52px] md:text-[56px] lg:text-[72px]`}>
            <span className="block whitespace-nowrap">Khi đầu óc đã tính đủ mọi đường,</span>
            <span className="block whitespace-nowrap">nhưng bạn vẫn không biết</span>
            <span className="block italic">đâu là bước của mình.</span>
          </h1>
        </Lang90Reveal>
        <Lang90Reveal delay="long" className="mt-12 max-w-[620px]">
          <p className={`${lang90Newsreader.className} max-w-[620px] text-[17px] font-normal leading-[1.8] text-e26-text-dark-2 md:text-[19px] md:leading-[1.85]`}>
            Một lần ngồi xuống đủ lâu để tiếng ồn bớt đi — và điều bạn thật sự nghĩ bắt đầu hiện ra.
          </p>
          <p className={`mt-9 ${darkSectionLabelClass} text-[11px] md:text-[12px]`}>
            90 phút · 1:1 cùng Kenji Phạm · Trực tuyến hoặc tại Sài Gòn
          </p>
        </Lang90Reveal>
      </div>
    </section>
  );
}

export function Lang90Recognition() {
  return (
    <section className="bg-e26-black px-6 py-24 md:py-36">
      <div className="mx-auto max-w-[680px]">
        <Lang90Reveal>
          <p className={darkSectionLabelClass}>Bạn có đang ở đây không</p>
          <h2 className={`mt-7 ${headingClass} text-e26-text-dark`}>
            Bên ngoài, mọi thứ vẫn đang vận hành.
          </h2>
        </Lang90Reveal>
        <Lang90Reveal delay="short" className="mt-12">
          <div className={`${bodyClass} space-y-8 text-e26-text-dark-2`}>
            <p>
              Công việc vẫn chạy. Bạn vẫn trả lời những câu hỏi cần trả lời.
              Người khác vẫn thấy bạn ổn.
            </p>
            <p>Chỉ là ở bên trong...</p>
            <p>
              có một điều gì đó đã lệch nhịp từ lâu,
              và bạn vẫn chưa gọi được tên nó.
            </p>
            <p>
              Bạn đã đọc. Đã nghe.
              Đã tự phân tích câu chuyện ấy rất nhiều lần.
            </p>
            <p>Nhưng có những điều rất khó nhìn khi ta đang đứng bên trong nó.</p>
            <p>Không phải vì bạn chưa đủ hiểu mình.</p>
            <p>Chỉ là người đang đứng trong một căn phòng thì rất khó nhìn thấy toàn bộ hình dáng của căn phòng ấy.</p>
          </div>
        </Lang90Reveal>
      </div>
      <picture data-storyboard-slot="SB-01" className="mt-20 block aspect-[4/5] w-full overflow-hidden md:mt-28 md:aspect-[16/9]">
        <source media="(min-width: 768px)" srcSet="/images/lang-90/sb-01-signal-moment-desktop-v01.webp" type="image/webp" />
        <source media="(min-width: 768px)" srcSet="/images/lang-90/sb-01-signal-moment-desktop-v01.png" type="image/png" />
        <source srcSet="/images/lang-90/sb-01-signal-moment-mobile-v01.webp" type="image/webp" />
        <img
          src="/images/lang-90/sb-01-signal-moment-mobile-v01.png"
          alt="Một chiếc ghế đơn trống trong căn phòng tối giản, được chạm nhẹ bởi ánh sáng tự nhiên."
          width={1024}
          height={1280}
          sizes="100vw"
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-center"
        />
      </picture>
      <div className="mx-auto max-w-[1040px]">
        <Lang90Reveal delay="long" className="mt-20 md:mt-28">
          <p className={`${lang90Cormorant.className} max-w-[1040px] text-[36px] font-normal leading-[1.16] tracking-[-0.015em] text-e26-text-dark md:text-[52px] lg:text-[66px]`}>
            <span className="block">Có thể điều bạn cần lúc này<br />không phải thêm một câu trả lời.</span>
            <span className="mt-8 block text-[1.18em] italic leading-[1.05]">Mà là một khoảng đủ yên</span>
            <span className="mt-8 block">để nghe rõ câu hỏi nào<br />thật sự cần được trả lời.</span>
          </p>
        </Lang90Reveal>
      </div>
    </section>
  );
}

export function Lang90Definition() {
  return (
    <section className="bg-e26-cream-deep px-6 py-24 md:py-36">
      <div className="mx-auto max-w-[680px]">
        <Lang90Reveal>
          <h2 className={`${headingClass} text-e26-text`}>Lặng không phải một cuộc trò chuyện để thấy nhẹ đi rồi thôi</h2>
        </Lang90Reveal>
        <Lang90Reveal delay="short" className={`mt-12 ${bodyClass} space-y-8`}>
          <p>Bạn sẽ được lắng nghe.</p>
          <p>Nhưng Lặng không chỉ là nơi để bạn kể hết mọi chuyện, thấy nhẹ đi một lúc, rồi quay lại đúng vòng lặp cũ.</p>
          <p>Đây cũng không phải nơi tôi đưa cho bạn một lời khuyên mà có thể bạn đã tự nói với mình mười lần rồi.</p>
          <p>Trong 90 phút ấy, tôi làm ba việc:</p>
          <p className={`${whisperClass} text-e26-text`}>
            nghe kỹ,<br />
            hỏi thẳng,<br />
            và nói lại điều tôi đang nhìn thấy — kể cả khi điều đó khác với cách bạn đang hiểu câu chuyện của mình.
          </p>
          <p>Bạn không cần phải đồng ý với tôi ngay.</p>
          <p>Bạn chỉ cần cùng tôi nhìn nó một lần, cho đủ rõ.</p>
          <p>
            Bởi đôi khi, chỉ cần một điều được gọi đúng tên...<br />
            cách ta đứng trước nó đã bắt đầu khác đi.
          </p>
        </Lang90Reveal>
      </div>
    </section>
  );
}

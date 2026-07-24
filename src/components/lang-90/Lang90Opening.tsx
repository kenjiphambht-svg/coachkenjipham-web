import {
  bodyClass,
  darkSectionLabelClass,
  sectionLabelClass,
  whisperClass,
} from "./Lang90Frame";
import Lang90Reveal from "./Lang90Reveal";
import StoryboardSlot from "./StoryboardSlot";

export function Lang90Hero() {
  return (
    <section className="relative overflow-hidden bg-e26-black px-6 pb-20 pt-20 md:pb-32 md:pt-28">
      <div aria-hidden="true" className="absolute inset-0 opacity-70">
        <div className="absolute inset-x-0 bottom-0 h-[58%] bg-[linear-gradient(180deg,transparent,rgba(241,239,232,0.16))]" />
      </div>
      <div className="relative mx-auto max-w-[920px]">
        <Lang90Reveal>
          <p className={darkSectionLabelClass}>Lặng</p>
        </Lang90Reveal>
        <Lang90Reveal delay="short" className="mt-8 max-w-4xl">
          <h1 className="font-serif text-[40px] font-medium leading-[1.15] text-e26-text-dark md:text-[64px]">
            Khi đầu óc đã tính đủ mọi đường,<br />
            nhưng bạn vẫn không biết đâu là bước của mình.
          </h1>
        </Lang90Reveal>
        <Lang90Reveal delay="long" className="mt-10 max-w-2xl">
          <p className="font-sans text-[17px] font-normal leading-[1.9] text-e26-text-dark-2 md:text-[18px]">
            Một lần ngồi xuống đủ lâu để tiếng ồn bớt đi —<br />
            và điều bạn thật sự nghĩ bắt đầu hiện ra.
          </p>
          <p className="mt-8 font-sans text-[12px] font-medium uppercase tracking-[0.18em] text-e26-text-dark-2">
            90 phút · 1:1 cùng Kenji Phạm · Trực tuyến hoặc tại Sài Gòn
          </p>
        </Lang90Reveal>
      </div>
    </section>
  );
}

export function Lang90Recognition() {
  return (
    <section className="bg-e26-black px-6 py-20 md:py-32">
      <div className="mx-auto max-w-[720px]">
        <Lang90Reveal>
          <p className={darkSectionLabelClass}>Bạn có đang ở đây không</p>
          <h2 className="mt-7 font-serif text-[30px] font-medium italic leading-[1.25] text-e26-text-dark md:text-[42px]">
            Bên ngoài, mọi thứ vẫn đang vận hành.
          </h2>
        </Lang90Reveal>
        <Lang90Reveal delay="short" className="mt-12">
          <div className="space-y-8 font-sans text-[17px] font-normal leading-[1.9] text-e26-text-dark-2 md:text-[18px]">
            <p>
              Công việc vẫn chạy.<br />
              Bạn vẫn trả lời những câu hỏi cần trả lời.<br />
              Người khác vẫn thấy bạn ổn.
            </p>
            <p>Chỉ là ở bên trong...</p>
            <p>
              có một điều gì đó đã lệch nhịp từ lâu,<br />
              và bạn vẫn chưa gọi được tên nó.
            </p>
            <p>
              Bạn đã đọc.<br />
              Đã nghe.<br />
              Đã tự phân tích câu chuyện ấy rất nhiều lần.
            </p>
            <p>Nhưng có những điều rất khó nhìn khi ta đang đứng bên trong nó.</p>
            <p>Không phải vì bạn chưa đủ hiểu mình.</p>
            <p>Chỉ là người đang đứng trong một căn phòng thì rất khó nhìn thấy toàn bộ hình dáng của căn phòng ấy.</p>
          </div>
        </Lang90Reveal>
      </div>
      <StoryboardSlot id="SB-01" className="mt-16 min-h-[34vh] w-full md:mt-24 md:min-h-[54vh]" />
      <div className="mx-auto max-w-[720px]">
        <Lang90Reveal delay="long" className="mt-16 md:mt-24">
          <p className="font-serif text-[30px] font-medium italic leading-[1.25] text-e26-text-dark md:text-[42px]">
            Điều bạn cần lúc này có thể không phải thêm một câu trả lời.<br />
            Mà là một khoảng đủ yên<br />
            để nghe rõ câu hỏi nào đang thật sự cần được trả lời.
          </p>
        </Lang90Reveal>
      </div>
    </section>
  );
}

export function Lang90Definition() {
  return (
    <section className="bg-e26-white px-6 py-20 md:py-32">
      <div className="mx-auto max-w-[720px]">
        <Lang90Reveal>
          <h2 className={sectionLabelClass}>Lặng không phải một cuộc trò chuyện để thấy nhẹ đi rồi thôi</h2>
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

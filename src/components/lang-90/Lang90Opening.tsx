import {
  bodyClass,
  headingClass,
  Lang90ImagePlaceholder,
  sectionLabelClass,
  whisperClass,
} from "./Lang90Frame";
import Lang90Reveal from "./Lang90Reveal";

export function Lang90Hero() {
  return (
    <section className="relative overflow-hidden bg-e26-black px-6 pb-20 pt-20 md:pb-32 md:pt-28">
      {/* TODO: Replace this quiet visual field with hero-before-dawn.webp. */}
      <div aria-hidden="true" className="absolute inset-0 opacity-70">
        <div className="absolute inset-x-0 bottom-0 h-[58%] bg-[linear-gradient(180deg,transparent,rgba(241,239,232,0.16))]" />
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-e26-cream/10 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-[920px]">
        <Lang90Reveal>
          <p className="font-sans text-[12px] font-medium uppercase tracking-[0.18em] text-e26-text-dark-2">
            Lặng 90’
          </p>
        </Lang90Reveal>
        <Lang90Reveal delay="short" className="mt-8 max-w-4xl">
          <h1 className="font-serif text-[40px] font-medium leading-[1.15] text-e26-text-dark md:text-[64px]">
            Khi đầu óc đã tính đủ mọi đường, nhưng bạn vẫn không biết đâu là bước của mình.
          </h1>
        </Lang90Reveal>
        <Lang90Reveal delay="long" className="mt-10 max-w-2xl">
          <p className="font-sans text-[17px] font-normal leading-[1.9] text-e26-text-dark-2 md:text-[18px]">
            Một phiên 1:1 cùng Kenji để hạ bớt tiếng ồn, nhìn rõ điều đang kéo bạn và chọn một
            bước có thể thực hiện trong 48 giờ tới.
          </p>
          <p className="mt-8 font-sans text-[12px] font-medium uppercase tracking-[0.18em] text-e26-text-dark-2">
            90 phút · Online hoặc trực tiếp tại Sài Gòn
          </p>
        </Lang90Reveal>
        <Lang90Reveal delay="long" className="mt-20 max-w-[520px] border-l border-e26-gold pl-6 md:mt-28">
          <div className={`${whisperClass} space-y-1 text-e26-text-dark`}>
            <p>Có những đêm, bạn không ngủ vì quá nhiều việc.</p>
            <p>Bạn không ngủ...</p>
            <p>vì cuối cùng cũng không còn việc gì để làm nữa.</p>
            <p className="pt-5">Email đã trả lời.</p>
            <p>Các cuộc gọi đã kết thúc.</p>
            <p>Con đã ngủ.</p>
            <p>Nhà đã yên.</p>
            <p>Điện thoại không còn rung.</p>
            <p className="pt-5">Chỉ có đầu óc của bạn...</p>
            <p>vẫn chưa.</p>
          </div>
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
          <p className={sectionLabelClass.replace("text-e26-text-2", "text-e26-text-dark-2")}>Điều chỉ mình bạn biết</p>
          <h2 className="mt-7 font-serif text-[30px] font-medium italic leading-[1.25] text-e26-text-dark md:text-[42px]">
            Bên ngoài, mọi thứ có thể vẫn đang vận hành.
          </h2>
        </Lang90Reveal>
        <Lang90Reveal delay="short" className="mt-12">
          <div className="space-y-8 font-sans text-[17px] font-normal leading-[1.9] text-e26-text-dark-2 md:text-[18px]">
            <p>
              Bạn vẫn đi làm.<br />
              Vẫn trả lời khi người khác cần.<br />
              Vẫn đưa ra quyết định.<br />
              Vẫn là người mà gia đình, đồng nghiệp hoặc cộng sự tin rằng sẽ biết phải làm gì.
            </p>
            <p>
              Nếu nhìn từ bên ngoài...<br />
              có lẽ không ai thấy có điều gì quá bất thường.
            </p>
            <p>
              Nhưng chỉ mình bạn biết...<br />
              mỗi ngày đang cần nhiều sức hơn ngày hôm trước.<br />
              Không chỉ để làm việc.<br />
              Mà để giữ cho mọi thứ trông vẫn bình thường.
            </p>
            <p>
              Ba giờ sáng, mắt vẫn mở.<br />
              Đầu tính đủ mọi đường...<br />
              nhưng không đường nào khiến bạn thấy mình thật sự muốn bước vào.
            </p>
            <p>
              Có lúc bạn nghĩ mình đang sợ.<br />
              Có lúc bạn thấy mình đang giận.<br />
              Có lúc bạn chỉ muốn bỏ mặc tất cả.<br />
              Rồi sáng hôm sau...<br />
              bạn lại tiếp tục như chưa có chuyện gì xảy ra.
            </p>
            <p>
              Bạn đã đọc.<br />
              Đã nghe.<br />
              Đã thử tự phân tích.<br />
              Có thể bạn còn hiểu rất rõ điều mình “nên” làm.
            </p>
            <p>
              Nhưng khi tình huống thật xuất hiện...<br />
              một phản ứng quen thuộc vẫn quay lại.<br />
              Đúng người đó.<br />
              Đúng cảm giác đó.<br />
              Đúng cách im lặng, trì hoãn, nổi giận hoặc rút lui đó.
            </p>
            <p>
              Như thể một phần trong bạn đã quyết định trước...<br />
              khi bạn còn chưa kịp lựa chọn.
            </p>
            <p>
              Bạn không thiếu thông minh.<br />
              Cũng không phải vì bạn chưa cố đủ nhiều.<br />
              Có thể chỉ là...<br />
              đã quá lâu rồi, bạn đang cố nhìn câu chuyện từ chính nơi mình đang mắc ở bên trong nó.
            </p>
          </div>
        </Lang90Reveal>
      </div>
    </section>
  );
}

export function Lang90WhyHardToSee() {
  return (
    <section className="bg-e26-ivory px-6 py-20 md:py-32">
      <div className="mx-auto max-w-[720px]">
        <Lang90Reveal>
          <p className={sectionLabelClass}>Vì sao ta khó tự nhìn thấy</p>
          <h2 className={`${headingClass} mt-7`}>
            Có những điều rất khó nhìn khi ta đang đứng bên trong nó.
          </h2>
        </Lang90Reveal>
        <Lang90Reveal delay="short" className={`mt-12 ${bodyClass} space-y-8`}>
          <p>
            Khi một chuyện chạm đúng vào nỗi sợ của mình...<br />
            ta thường không chỉ nhìn thấy chuyện đang xảy ra.<br />
            Ta còn nhìn thấy tất cả những điều mình sợ nó có thể dẫn tới.
          </p>
          <p>
            Một cuộc trò chuyện chưa diễn ra...<br />
            đã trở thành một cuộc chia tay trong đầu.<br />
            Một khoản thua lỗ...<br />
            đã trở thành bằng chứng rằng mình thất bại.<br />
            Một lần bị từ chối...<br />
            đã trở thành cảm giác rằng mình không còn giá trị.<br />
            Một quyết định công việc...<br />
            đã bị phủ kín bởi tiếng nói của gia đình, trách nhiệm và hình ảnh mà mình đã giữ quá lâu.
          </p>
          <p>
            Lúc ấy, rất khó để phân biệt:<br />
            Điều gì đang thật sự xảy ra.<br />
            Điều gì chỉ đang được nỗi sợ phóng lớn.<br />
            Điều gì là mong muốn của bạn.<br />
            Và điều gì là phản xạ cũ đang cố bảo vệ bạn.
          </p>
          <p>
            Đó là lý do một người có thể hiểu rất nhiều về mình...<br />
            nhưng vẫn không thể tự đi ra khỏi cùng một vòng lặp.<br />
            Không phải vì họ chưa biết đủ.<br />
            Mà vì có những góc nhìn...<br />
            chỉ xuất hiện khi có một người đủ gần để nghe rõ,<br />
            và đủ xa để không bị cuốn vào câu chuyện cùng mình.
          </p>
        </Lang90Reveal>
      </div>
    </section>
  );
}

export function Lang90Definition() {
  return (
    <section className="bg-e26-white px-6 py-20 md:py-32">
      <div className="mx-auto grid max-w-[1040px] gap-14 md:grid-cols-[minmax(0,1fr)_0.72fr] md:items-center">
        <div>
          <Lang90Reveal>
            <p className={sectionLabelClass}>Lặng 90 là gì</p>
            <h2 className={`${headingClass} mt-7`}>Lặng 90 không chỉ là một nơi để nói.</h2>
          </Lang90Reveal>
          <Lang90Reveal delay="short" className={`mt-12 ${bodyClass} space-y-8`}>
            <p>
              Dĩ nhiên, bạn sẽ được lắng nghe.<br />
              Nhưng nếu điều bạn cần chỉ là một người ngồi im và đồng ý với mọi điều mình nói...<br />
              Lặng 90 có thể không phải cuộc gặp bạn đang tìm.
            </p>
            <p>
              Trong 90 phút đó, tôi sẽ không quyết định thay bạn.<br />
              Tôi cũng không đến với một kết luận đã có sẵn về con người bạn.<br />
              Nhưng khi có một điều cần được nhìn thẳng...<br />
              tôi sẽ không né tránh nó.
            </p>
            <p>
              Chúng ta tập trung vào một điều đang thực sự kéo bạn lúc này.<br />
              Có thể là một quyết định chưa thể đưa ra.<br />
              Một mối quan hệ đang khiến bạn kiệt sức.<br />
              Một vòng lặp trong tiền bạc hoặc công việc.<br />
              Một cách phản ứng mà bạn biết không còn phù hợp...<br />
              nhưng vẫn chưa dừng được.
            </p>
            <p>
              Mục tiêu không phải xử lý toàn bộ cuộc đời trong một buổi.<br />
              Mục tiêu là làm đủ rõ một điều...<br />
              để bạn không phải tiếp tục phản ứng trong bóng tối.
            </p>
          </Lang90Reveal>
        </div>
        {/* TODO: Replace with quiet-chairs.webp. */}
        <Lang90ImagePlaceholder label="Không gian cho một cuộc trò chuyện" className="aspect-[4/5]" />
      </div>
    </section>
  );
}

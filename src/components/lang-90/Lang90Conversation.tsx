import {
  bodyClass,
  headingClass,
  Lang90ImagePlaceholder,
  sectionLabelClass,
  whisperClass,
} from "./Lang90Frame";
import Lang90Reveal from "./Lang90Reveal";

export function Lang90Kenji() {
  return (
    <section className="bg-e26-cream px-6 py-20 md:py-32">
      <div className="mx-auto grid max-w-[1040px] gap-14 md:grid-cols-[0.72fr_minmax(0,1fr)] md:items-start">
        {/* TODO: Replace with kenji-by-window.webp. */}
        <Lang90ImagePlaceholder label="Kenji trong đời sống thật" className="aspect-[4/5] md:sticky md:top-10" />
        <div>
          <Lang90Reveal>
            <p className={sectionLabelClass}>Người sẽ ngồi cùng bạn</p>
            <h2 className={`${headingClass} mt-7`}>
              Có lẽ đến đây, bạn muốn biết người sẽ ngồi phía đối diện là ai.
            </h2>
          </Lang90Reveal>
          <Lang90Reveal delay="short" className={`mt-12 ${bodyClass} space-y-8`}>
            <p>
              Tên tôi là Kenji Phạm.<br />
              Tôi là Essence Coach và là người xây dựng Essence Coaching System.
            </p>
            <p>
              Công việc của tôi là giúp một người nhìn ra cấu trúc đang nằm bên dưới câu chuyện họ kể:<br />
              vòng lặp nào đang quay lại,<br />
              kiểu gồng nào đang bật lên,<br />
              điều gì họ đang cố bảo vệ,<br />
              và điều gì đang khiến họ không còn nghe rõ lựa chọn của chính mình.
            </p>
            <p>
              Tôi không nhìn một con người như một vấn đề cần sửa.<br />
              Tôi cũng không tin rằng chỉ cần nói một câu đủ hay...<br />
              mọi thứ trong họ sẽ thay đổi.
            </p>
            <p>
              Đã có một giai đoạn trong đời...<br />
              tôi một mình nuôi hai con,<br />
              và trong tài khoản chỉ còn 2,5 USD.
            </p>
            <p>
              Tôi không kể điều đó để nói rằng câu chuyện của tôi giống câu chuyện của bạn.<br />
              Hay vì đã đi qua khó khăn của mình...<br />
              tôi sẽ tự động hiểu được khó khăn của người khác.
            </p>
            <p>
              Điều giai đoạn ấy dạy tôi là:<br />
              khi một người đang đứng bên trong cơn bão,<br />
              lời khuyên từ bên ngoài thường không chạm được tới điều đang thật sự giữ họ lại.
            </p>
            <p>
              Họ cần một nơi đủ vững để tiếng ồn hạ xuống.<br />
              Một người không hoảng cùng họ.<br />
              Và một cách nhìn giúp điều tưởng như hỗn loạn...<br />
              bắt đầu hiện ra thành cấu trúc.
            </p>
            <p>
              Đó là điều tôi mang vào Lặng 90.<br />
              Không phải câu trả lời cho cuộc đời bạn.<br />
              Mà là toàn bộ sự hiện diện, khả năng quan sát và sự thẳng thắn của tôi...<br />
              để chúng ta cùng nhìn điều bạn đang khó nhìn một mình.
            </p>
            <p>
              Tôi không mong bạn tin tôi ngay.<br />
              Bạn cũng không cần.<br />
              Chỉ cần sau khi đọc đến đây...<br />
              bạn cảm thấy mình có thể ngồi xuống và nói thật một chút.<br />
              Như vậy đã đủ để bắt đầu.
            </p>
          </Lang90Reveal>
        </div>
      </div>
    </section>
  );
}

const journeySteps = [
  {
    title: "Bắt đầu từ nơi đang nặng nhất",
    copy: (
      <>
        Bạn không cần kể toàn bộ cuộc đời.<br />
        Không cần sắp xếp mọi chuyện theo một trình tự hoàn hảo.<br />
        Không cần biết đâu mới là nguyên nhân thật sự.<br />
        Chúng ta bắt đầu từ điều đang khiến bạn phải có mặt ở đây lúc này.<br />
        Có thể là một quyết định.<br />
        Một mối quan hệ.<br />
        Một vòng lặp trong công việc hoặc tiền bạc.<br />
        Hoặc chỉ là một cảm giác rất rõ rằng...<br />
        mình không thể tiếp tục theo cách cũ mãi.
      </>
    ),
  },
  {
    title: "Làm chậm phần đang muốn phản ứng ngay",
    copy: (
      <>
        Khi một người đang quá nhiễu...<br />
        họ có thể đưa ra quyết định chỉ để thoát khỏi cảm giác hiện tại.<br />
        Rời đi thật nhanh.<br />
        Đồng ý để mọi chuyện kết thúc.<br />
        Nói một điều mình chưa thật sự muốn nói.<br />
        Hoặc tiếp tục chịu đựng...<br />
        chỉ vì chưa biết mình còn lựa chọn nào khác.<br /><br />
        Chúng ta sẽ không vội tìm câu trả lời.<br />
        Trước hết, cần có đủ khoảng để phân biệt:<br />
        điều gì đang thật sự xảy ra,<br />
        và điều gì đang được nỗi sợ, áp lực hoặc quán tính đẩy lên.<br /><br />
        Chậm lại không phải để trì hoãn cuộc sống.<br />
        Mà để bạn không trao quyền quyết định cho phản ứng đầu tiên của mình.
      </>
    ),
  },
  {
    title: "Nhìn ra điều đang nằm bên dưới câu chuyện",
    copy: (
      <>
        Khi tiếng ồn đã bớt...<br />
        một vòng lặp, một kiểu gồng hoặc một mâu thuẫn chính có thể bắt đầu hiện ra.<br />
        Có thể bạn luôn cố trở thành người hiểu chuyện.<br />
        Luôn nhận phần khó về mình.<br />
        Luôn tìm cách rời đi trước khi bị từ chối.<br />
        Hoặc luôn trì hoãn điều mình thật sự muốn...<br />
        để không làm ai thất vọng.<br /><br />
        Chúng ta không cần tìm ra mười vấn đề.<br />
        Chỉ cần nhìn đủ rõ một điều đang thực sự dẫn cách bạn phản ứng lúc này.<br />
        Khi điều đó được gọi đúng tên...<br />
        bạn bắt đầu có một khoảng để lựa chọn khác đi.
      </>
    ),
  },
  {
    title: "Đưa điều vừa thấy trở lại đời sống",
    copy: (
      <>
        Một cuộc trò chuyện sâu có thể giúp bạn hiểu ra nhiều điều.<br />
        Nhưng nếu mọi thứ chỉ ở lại trong căn phòng...<br />
        chúng sẽ dần trở thành thêm một điều bạn đã biết.<br /><br />
        Vì vậy, trước khi kết thúc, chúng ta sẽ cùng chọn một bước cụ thể để bạn thực hiện hoặc quan sát trong 48 giờ tiếp theo.<br />
        Không phải thay đổi toàn bộ cuộc đời.<br />
        Có thể chỉ là:<br />
        một cuộc trò chuyện cần được bắt đầu,<br />
        một ranh giới cần được nói rõ,<br />
        một quyết định cần thêm thời gian,<br />
        hoặc một khoảnh khắc bạn nhận ra phản ứng cũ đang chuẩn bị xuất hiện...<br />
        và dừng lại trước khi để nó quyết định thay mình.<br /><br />
        Bạn không cần rời phiên với mọi câu trả lời.<br />
        Chỉ cần một điều đã rõ hơn.<br />
        Một phản ứng đã được nhìn thấy.<br />
        Và một bước đủ thật để mang theo khi quay lại cuộc sống của mình.
      </>
    ),
  },
];

export function Lang90Journey() {
  return (
    <section className="bg-e26-ivory px-6 py-20 md:py-32">
      <div className="mx-auto max-w-[720px]">
        <Lang90Reveal>
          <p className={sectionLabelClass}>Trong 90 phút, điều gì có thể diễn ra</p>
          <h2 className={`${headingClass} mt-7`}>
            Trong 90 phút, chúng ta sẽ đi từ điều đang rối đến một bước đủ rõ.
          </h2>
          <p className={`mt-8 ${bodyClass}`}>
            Không có một kịch bản cố định cho tất cả mọi người.<br />
            Mỗi người bước vào với một câu chuyện khác nhau.<br />
            Nhưng cuộc trò chuyện thường đi qua một nhịp tự nhiên:<br />
            đặt xuống điều đang đầy,<br />
            làm chậm phần đang vội,<br />
            nhìn rõ điều đang thực sự kéo mình,<br />
            và đưa điều vừa thấy trở lại đời sống.
          </p>
        </Lang90Reveal>
        <div className="mt-16 space-y-16 md:mt-20 md:space-y-20">
          {journeySteps.map((step, index) => (
            <Lang90Reveal key={step.title} delay={index % 2 === 0 ? "none" : "short"}>
              <div className="border-t border-e26-border pt-7">
                <p className={sectionLabelClass}>0{index + 1}</p>
                <h3 className="mt-4 font-serif text-[28px] font-medium italic leading-[1.25] text-e26-text md:text-[34px]">
                  {step.title}
                </h3>
                <p className={`mt-7 ${bodyClass}`}>{step.copy}</p>
              </div>
            </Lang90Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Lang90Outcomes() {
  return (
    <section className="bg-e26-white px-6 py-20 md:py-32">
      <div className="mx-auto max-w-[720px]">
        <Lang90Reveal>
          <p className={sectionLabelClass}>Bạn gặp Kenji để mang về điều gì</p>
          <h2 className={`${headingClass} mt-7`}>Bạn không dành 10 triệu để nghe thêm một lời khuyên.</h2>
          <p className={`${whisperClass} mt-8`}>Bạn dành 90 phút... để nhìn thấy điều rất khó nhìn khi đang sống bên trong nó.</p>
        </Lang90Reveal>
        <Lang90Reveal delay="short" className={`mt-12 ${bodyClass} space-y-8`}>
          <p>
            Mỗi người bước vào Lặng 90 với một câu chuyện khác nhau.<br />
            Vì vậy, tôi không hứa mọi người sẽ rời phiên với cùng một kết quả.<br />
            Nhưng cuộc gặp sẽ hướng tới một vài điều đủ cụ thể.
          </p>
          <div className="space-y-10 border-l border-e26-gold pl-6">
            <div>
              <h3 className="font-serif text-[24px] font-medium italic text-e26-text">Một vấn đề được gọi đúng tên hơn</h3>
              <p className="mt-4">Bạn có thể đến với cảm giác: Tôi đang rối. Tôi không biết mình muốn gì. Tôi không hiểu vì sao mình cứ như vậy.<br />Chúng ta sẽ cố đi gần hơn tới điều thực sự đang xảy ra.<br />Không phải để dán nhãn bạn.<br />Mà để vấn đề không còn là một đám mây phủ lên toàn bộ cuộc sống.</p>
            </div>
            <div>
              <h3 className="font-serif text-[24px] font-medium italic text-e26-text">Một vòng lặp chính được nhìn thấy</h3>
              <p className="mt-4">Điều gì thường kích hoạt nó.<br />Bạn phản ứng ra sao.<br />Phản ứng ấy đang cố bảo vệ điều gì.<br />Và nó đang khiến bạn phải trả giá ở đâu.</p>
            </div>
            <div>
              <h3 className="font-serif text-[24px] font-medium italic text-e26-text">Một khoảng phân biệt rõ hơn</h3>
              <p className="mt-4">Đâu là dữ kiện.<br />Đâu là nỗi sợ.<br />Đâu là mong muốn thật.<br />Đâu là một lựa chọn phù hợp.<br />Và đâu chỉ là cách nhanh nhất để thoát khỏi cảm giác khó chịu lúc này.</p>
            </div>
            <div>
              <h3 className="font-serif text-[24px] font-medium italic text-e26-text">Một bước cụ thể trong 48 giờ</h3>
              <p className="mt-4">Có thể đó là một cuộc trò chuyện cần được bắt đầu.<br />Một ranh giới cần được nói rõ.<br />Một quyết định cần thêm hai ngày trước khi đưa ra.<br />Hoặc chỉ là nhận ra khoảnh khắc phản xạ cũ sắp bật lên...<br />và dừng lại trước khi để nó quyết định thay.</p>
            </div>
          </div>
          <p>
            Cuộc gặp không kết thúc khi 90 phút kết thúc.<br />
            Trong 1–2 ngày sau phiên, bạn sẽ nhận một bản tóm tắt cá nhân từ 1–2 trang.<br />
            Không phải bản đánh giá về con người bạn.<br />
            Không phải một kết luận đóng kín.<br />
            Đó là nơi tôi ghi lại những điều quan trọng nhất đã hiện ra:<br />
            Vấn đề chúng ta đang thật sự nhìn vào.<br />
            Vòng lặp hoặc kiểu gồng chính.<br />
            Điều bạn có thể tiếp tục quan sát.<br />
            Bước thực hành trong 48 giờ mà bạn đã chọn.<br />
            Một vài câu hỏi để mang theo sau cuộc gặp.
          </p>
          <p>
            Vào ngày thứ 7, tôi sẽ gửi một email hỏi thăm.<br />
            Không phải để kiểm tra bạn đã làm đúng hay chưa.<br />
            Mà để nhìn xem điều đã thấy vận hành như thế nào...<br />
            khi bạn quay lại đời sống thật.
          </p>
          <p>
            Vào ngày thứ 30, bạn sẽ nhận thêm một email follow-up.<br />
            Có những điều không hiện rõ ngay trong ngày đầu tiên.<br />
            Đôi khi phải đi qua vài tình huống thật...<br />
            ta mới biết mình đã thực sự nhìn thấy điều gì.<br />
            Ngày 30 là một điểm dừng để bạn đọc lại nhịp vừa qua:<br />
            điều gì đã đổi,<br />
            điều gì vẫn đang quay lại,<br />
            và điều gì đang cần một khoảng sâu hơn.
          </p>
        </Lang90Reveal>
      </div>
    </section>
  );
}

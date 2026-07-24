import { bodyClass, headingClass, sectionLabelClass } from "./Lang90Frame";
import Lang90Reveal from "./Lang90Reveal";
import StoryboardSlot from "./StoryboardSlot";

export function Lang90Kenji() {
  return (
    <section className="bg-e26-cream px-6 py-20 md:py-32">
      <div className="mx-auto grid max-w-[1040px] gap-14 md:grid-cols-[0.72fr_minmax(0,1fr)] md:items-start">
        <div className="md:col-start-2 md:row-start-1">
          <Lang90Reveal>
            <p className={sectionLabelClass}>Người ngồi phía đối diện</p>
          </Lang90Reveal>
          <Lang90Reveal delay="short" className={`mt-12 ${bodyClass} space-y-8`}>
            <p>Tôi là Kenji Phạm.</p>
            <p>Trong tám năm qua, tôi đã ngồi nghe người lớn nói về những điều họ hiếm khi nói ở nơi khác.</p>
            <p>
              Không phải để sửa họ.<br />
              Không phải để quyết định thay họ.<br />
              Mà để cùng họ nhìn vào điều đang thật sự diễn ra bên dưới những gì được kể ra.
            </p>
            <p>Đã có một giai đoạn trong đời...</p>
          </Lang90Reveal>
        </div>
        <StoryboardSlot id="SB-02" className="-mt-2 aspect-[4/5] md:sticky md:top-10 md:col-start-1 md:row-span-2 md:row-start-1" />
        <Lang90Reveal delay="short" className={`${bodyClass} md:col-start-2 md:row-start-2 space-y-8`}>
          <p>
            tôi một mình nuôi hai con,<br />
            và trong tài khoản chỉ còn 2,5 USD.
          </p>
          <p>Tôi không kể điều đó để chứng minh điều gì.</p>
          <p>Chỉ để nói rằng có những thứ tôi không học bằng lý thuyết.</p>
          <p>Tôi đã phải sống qua mới hiểu cách ngồi cùng một người khi mọi thứ bên trong họ đang rất rối — mà không vội cứu, không vội phán xét, cũng không né điều cần được nhìn.</p>
          <p>Điều tôi mang vào Lặng không phải một câu trả lời có sẵn.</p>
          <p>Đó là sự hiện diện, khả năng quan sát và sự thành thật cần thiết để cuộc trò chuyện không dừng lại ở những gì dễ nói nhất.</p>
        </Lang90Reveal>
      </div>
    </section>
  );
}

const journeySteps = [
  {
    title: "Một — Bắt đầu từ nơi đang rối nhất",
    copy: (
      <>
        Bạn không cần chuẩn bị một phiên bản gọn gàng của câu chuyện.<br />
        Không cần biết đâu mới là nguyên nhân thật sự.<br />
        Không cần kể mọi thứ theo đúng trình tự.<br />
        Chúng ta bắt đầu từ điều đang khiến bạn phải có mặt ở đây lúc này.<br /><br />
        Có thể là một quyết định.<br />
        Một mối quan hệ.<br />
        Một phản ứng cứ lặp lại.<br />
        Hoặc chỉ là cảm giác rất rõ rằng...<br />
        mình không thể tiếp tục theo cách cũ mãi.<br /><br />
        Chúng ta bắt đầu từ nơi đang thật nhất,<br />
        rồi để mọi thứ chậm lại đủ để nhìn.
      </>
    ),
  },
  {
    title: "Hai — Nhìn ra điều đang nằm bên dưới",
    copy: (
      <>
        Điều đang kéo bạn đôi khi không phải câu chuyện trên bề mặt.<br />
        Một cuộc trò chuyện có thể chạm vào nỗi sợ bị rời bỏ.<br />
        Một quyết định công việc có thể bị che phủ bởi trách nhiệm, hình ảnh hoặc cảm giác mắc nợ.<br />
        Một lần bị từ chối có thể khiến bạn nghi ngờ giá trị của chính mình.<br /><br />
        Khi tiếng ồn bớt đi, một vòng lặp, một kiểu phản ứng hoặc một mâu thuẫn chính bắt đầu hiện ra.<br />
        Chúng ta không cần tìm ra mười vấn đề.<br />
        Chỉ cần nhìn đủ rõ một điều đang thật sự dẫn cách bạn phản ứng lúc này.
      </>
    ),
  },
  {
    title: "Ba — Đưa điều vừa thấy trở lại đời sống",
    copy: (
      <>
        Bạn không rời phiên chỉ với một cảm giác dễ chịu.<br />
        Trước khi kết thúc, chúng ta sẽ cùng chọn một việc có thể thực hiện hoặc quan sát trong 48 giờ tiếp theo.<br />
        Không phải thay đổi toàn bộ cuộc đời.<br />
        Có thể chỉ là:<br />
        một cuộc trò chuyện cần được bắt đầu,<br />
        một ranh giới cần được nói rõ,<br />
        một quyết định cần thêm thời gian,<br />
        hoặc một khoảnh khắc bạn nhận ra phản ứng cũ đang chuẩn bị xuất hiện...<br />
        và dừng lại trước khi để nó quyết định thay mình.<br /><br />
        Một bước đủ nhỏ để thực hiện.<br />
        Và đủ thật để bạn nhận ra mình đang bắt đầu lựa chọn khác đi.
      </>
    ),
  },
];

export function Lang90Journey() {
  return (
    <section className="bg-e26-ivory px-6 py-20 md:py-32">
      <div className="mx-auto max-w-[720px]">
        <Lang90Reveal>
          <p className={sectionLabelClass}>Trong 90 phút, chúng ta đi từ đâu đến đâu</p>
          <h2 className={`${headingClass} mt-7`}>Không có một kịch bản cố định cho tất cả mọi người.</h2>
          <p className={`mt-8 ${bodyClass}`}>Nhưng cuộc trò chuyện thường đi qua ba nhịp tự nhiên.</p>
        </Lang90Reveal>
        <div className="mt-16 space-y-16 md:mt-20 md:space-y-20">
          {journeySteps.map((step, index) => (
            <Lang90Reveal key={step.title} delay={index % 2 === 0 ? "none" : "short"}>
              <div className="border-t border-e26-border pt-7">
                <h3 className="font-serif text-[28px] font-medium italic leading-[1.25] text-e26-text md:text-[34px]">
                  {step.title}
                </h3>
                <p className={`mt-7 ${bodyClass}`}>{step.copy}</p>
              </div>
            </Lang90Reveal>
          ))}
        </div>
      </div>
      <StoryboardSlot id="SB-03" className="mt-16 min-h-[32vh] w-full md:mt-24 md:min-h-[50vh]" />
    </section>
  );
}

import Link from "next/link";

import {
  bodyClass,
  headingClass,
  Lang90Footer,
  sectionLabelClass,
  whisperClass,
} from "./Lang90Frame";
import Lang90Faq from "./Lang90Faq";
import Lang90Reveal from "./Lang90Reveal";

export function Lang90Fit() {
  return (
    <section className="bg-e26-cream px-6 py-20 md:py-32">
      <div className="mx-auto max-w-[720px]">
        <Lang90Reveal>
          <p className={sectionLabelClass}>Lặng 90 có thể phù hợp khi nào</p>
          <h2 className={`${headingClass} mt-7`}>Lặng 90 có thể phù hợp với bạn khi...</h2>
        </Lang90Reveal>
        <Lang90Reveal delay="short" className={`mt-12 ${bodyClass} space-y-8`}>
          <p>
            Bạn đang đứng trước một quyết định quan trọng...<br />
            nhưng càng nghĩ càng nhiễu.
          </p>
          <p>
            Bên ngoài cuộc sống vẫn đang vận hành...<br />
            nhưng bên trong bạn biết mình không thể tiếp tục theo cách cũ mãi.
          </p>
          <p>
            Bạn đã nhận ra một kiểu phản ứng cứ quay lại trong công việc, tiền bạc hoặc một mối quan hệ...<br />
            nhưng chưa thấy rõ điều gì đang giữ nó.
          </p>
          <p>
            Bạn đã đọc, đã học và đã thử nhiều cách để hiểu mình...<br />
            nhưng khi tình huống thật xuất hiện, mình vẫn trở về phản xạ quen thuộc.
          </p>
          <p>
            Bạn không tìm một người quyết định thay.<br />
            Bạn cần một người đủ vững để cùng nhìn điều bạn đang khó nhìn một mình.
          </p>
          <p>
            Và bạn sẵn sàng có mặt thật trong 90 phút đó.<br />
            Không cần phải biết nói hay.<br />
            Nhưng sẵn sàng thành thật với điều đang xảy ra.
          </p>
        </Lang90Reveal>
      </div>
    </section>
  );
}

export function Lang90Scope() {
  return (
    <section className="bg-e26-black px-6 py-20 md:py-32">
      <div className="mx-auto max-w-[720px]">
        <Lang90Reveal>
          <p className={sectionLabelClass.replace("text-e26-text-2", "text-e26-text-dark-2")}>Phạm vi của Lặng 90</p>
          <h2 className="mt-7 font-serif text-[30px] font-medium italic leading-[1.25] text-e26-text-dark md:text-[42px]">
            Có những lúc, cách tôn trọng một người nhất là không nhận họ vào sai cánh cửa.
          </h2>
        </Lang90Reveal>
        <Lang90Reveal delay="short" className="mt-12 space-y-8 font-sans text-[17px] font-normal leading-[1.9] text-e26-text-dark-2 md:text-[18px]">
          <p>
            Lặng 90 là một phiên coaching giúp bạn làm chậm điều đang quá nhiễu, nhìn rõ một phản ứng hoặc vòng lặp chính và mở lại khoảng để tự lựa chọn.
          </p>
          <p>Phiên không thay thế hỗ trợ y tế hoặc chuyên môn sức khỏe tâm thần.</p>
          <p>
            Nếu qua sáu câu hỏi tôi nhận thấy điều bạn đang trải qua nằm ngoài phạm vi của Lặng 90...<br />
            tôi sẽ nói rõ.<br />
            Không phải vì câu chuyện của bạn chưa đủ quan trọng.<br />
            Mà vì tôi không muốn bạn nhận sai loại hỗ trợ vào lúc mình cần một điều khác.
          </p>
          <p className="border-l border-e26-gold pl-6 text-e26-text-dark">
            Nếu bạn đang ở trong tình trạng khẩn cấp hoặc có nguy cơ làm tổn thương bản thân hay người khác, hãy ưu tiên liên hệ ngay với một người thân đáng tin, cơ sở y tế hoặc dịch vụ khẩn cấp tại nơi bạn đang sống.
          </p>
        </Lang90Reveal>
      </div>
    </section>
  );
}

export function Lang90BeforeSession() {
  return (
    <section className="bg-e26-white px-6 py-20 md:py-32">
      <div className="mx-auto max-w-[720px]">
        <Lang90Reveal>
          <p className={sectionLabelClass}>Trước khi chúng ta ngồi xuống</p>
          <h2 className={`${headingClass} mt-7`}>Bước tiếp theo chưa phải đặt lịch.</h2>
          <p className={`${whisperClass} mt-4`}>Và cũng chưa phải thanh toán.</p>
        </Lang90Reveal>
        <Lang90Reveal delay="short" className={`mt-12 ${bodyClass} space-y-8`}>
          <p>
            Khi bấm nút ở cuối trang, bạn sẽ được chuyển đến một biểu mẫu gồm sáu câu hỏi.<br />
            Mất khoảng 5–10 phút để hoàn thành.<br />
            Không có câu trả lời đúng hay sai.<br />
            Bạn không cần viết hay.<br />
            Không cần làm cho câu chuyện của mình trở nên nghiêm trọng hơn.<br />
            Và cũng không cần kể nhiều hơn điều mình sẵn sàng chia sẻ.
          </p>
          <div>
            <p>Sáu câu hỏi giúp tôi hiểu:</p>
            <ul className="mt-5 space-y-3 border-l border-e26-gold pl-6">
              <li>Điều gì đang đưa bạn đến Lặng 90.</li>
              <li>Bạn đang ở trạng thái nào lúc này.</li>
              <li>Bạn đang mong muốn điều gì từ cuộc gặp.</li>
              <li>Liệu phạm vi và cách làm việc của phiên có phù hợp với bạn hay không.</li>
            </ul>
          </div>
          <p>
            Tôi sẽ trực tiếp đọc phần bạn gửi.<br />
            Nếu thấy Lặng 90 phù hợp, bạn sẽ nhận một đường dẫn để chọn lịch.<br />
            Sau khi chọn lịch, bạn mới đi đến bước thanh toán.<br />
            Nếu tôi nhận thấy một hướng khác phù hợp hơn...<br />
            tôi cũng sẽ phản hồi rõ với bạn.
          </p>
          <p>
            Bạn chưa cần chuẩn bị một phiên bản hoàn chỉnh của câu chuyện.<br />
            Chỉ cần bắt đầu từ điều đang thật nhất lúc này.
          </p>
        </Lang90Reveal>
      </div>
    </section>
  );
}

export function Lang90Offer() {
  const details = [
    ["Thời lượng", "90 phút."],
    ["Hình thức", "Online hoặc gặp trực tiếp tại Sài Gòn."],
    ["Người giữ phiên", "Kenji Phạm."],
    ["Phí phiên", "10.000.000 đồng."],
    ["Sau phiên", "Bản tóm tắt cá nhân 1–2 trang, gửi trong 1–2 ngày. Email follow-up vào ngày 7 và ngày 30."],
    ["Số lượng", "Tối đa 5 phiên mỗi tháng."],
  ];

  return (
    <section className="relative overflow-hidden bg-e26-cream px-6 py-20 md:py-32">
      {/* TODO: Replace the visual field with morning-veranda.webp. */}
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(160deg,transparent_0%,rgba(255,255,255,0.72)_48%,transparent_100%)]" />
      <div className="relative mx-auto max-w-[720px]">
        <Lang90Reveal>
          <p className={sectionLabelClass}>Thông tin phiên</p>
          <h2 className={`${headingClass} mt-7`}>Phiên Lặng 90</h2>
        </Lang90Reveal>
        <Lang90Reveal delay="short" className="mt-12 border-y border-e26-border">
          {details.map(([label, value]) => (
            <div key={label} className="grid gap-2 border-b border-e26-border py-6 last:border-b-0 md:grid-cols-[150px_1fr] md:gap-8">
              <p className={sectionLabelClass}>{label}</p>
              <p className={bodyClass}>{value}</p>
            </div>
          ))}
        </Lang90Reveal>
        <Lang90Reveal delay="short" className={`mt-10 ${bodyClass} space-y-5`}>
          <p>Tôi giữ giới hạn này để mỗi phiên có đủ thời gian chuẩn bị, sự tập trung và khoảng chăm sóc sau cuộc gặp.</p>
          <p>Đây là giới hạn vận hành...<br />không phải lời thúc bạn phải quyết định vội.</p>
        </Lang90Reveal>
        <Lang90Reveal delay="long" className="mt-20 text-center md:mt-24">
          <p className="font-serif text-[30px] font-medium italic leading-[1.25] text-e26-text md:text-[42px]">
            Nếu sau khi đọc đến đây, bạn vẫn cảm thấy đây là cuộc trò chuyện mình đang tìm...
          </p>
          <p className={`${whisperClass} mt-7`}>Hãy bắt đầu bằng sáu câu hỏi.</p>
          <Link
            href="/lang-90/dat-phien"
            className="mt-10 inline-flex min-h-14 items-center justify-center bg-e26-gold px-8 py-4 font-sans text-[12px] font-medium uppercase tracking-[0.18em] text-e26-black transition-colors hover:bg-e26-gold-deep hover:text-e26-ivory focus:outline-none focus-visible:ring-2 focus-visible:ring-e26-gold-deep focus-visible:ring-offset-4 focus-visible:ring-offset-e26-cream"
          >
            Bắt đầu 6 câu hỏi
          </Link>
          <p className="mt-5 font-sans text-[12px] font-medium uppercase tracking-[0.18em] text-e26-text-2">
            Chưa đặt lịch. Chưa phát sinh thanh toán.
          </p>
        </Lang90Reveal>
      </div>
    </section>
  );
}

export function Lang90Closing() {
  return (
    <>
      <Lang90Faq />
      <Lang90Footer>
        <Lang90Reveal>
          <p className="font-serif text-[30px] font-medium italic leading-[1.25] text-e26-text-dark md:text-[42px]">
            Cảm ơn bạn đã dành thời gian ngồi lại cùng chính mình...
          </p>
          <p className="mt-2 font-serif text-[21px] font-normal italic leading-[1.5] text-e26-text-dark/75 md:text-[23px]">
            dù mới chỉ qua những dòng chữ này.
          </p>
          <div className="mt-14 border-t border-e26-border-dark pt-8 font-sans text-[12px] font-medium uppercase tracking-[0.18em] text-e26-text-dark-2">
            <p>Kenji Phạm · Essence Coach · Sài Gòn</p>
            <a
              href="mailto:contact@coachkenjipham.com"
              className="mt-5 inline-block text-e26-text-dark transition-colors hover:text-e26-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-e26-gold"
            >
              contact@coachkenjipham.com
            </a>
            <p className="mt-5">© 2026 Essence Coaching System</p>
          </div>
        </Lang90Reveal>
      </Lang90Footer>
    </>
  );
}

import Link from "next/link";
import type { ReactNode } from "react";

import {
  bodyClass,
  darkSectionLabelClass,
  headingClass,
  Lang90Footer,
  sectionLabelClass,
  whisperClass,
} from "./Lang90Frame";
import Lang90Faq from "./Lang90Faq";
import Lang90Reveal from "./Lang90Reveal";
import StoryboardSlot from "./StoryboardSlot";

export function Lang90Scope() {
  return (
    <section className="bg-e26-cream-deep px-6 py-24 md:py-36">
      <div className="mx-auto max-w-[680px]">
        <Lang90Reveal>
          <p className={sectionLabelClass}>Phạm vi của Lặng</p>
          <h2 className={`${headingClass} mt-7`}>
            Có những lúc, cách tôn trọng một người nhất<br />
            là không nhận họ vào sai cánh cửa.
          </h2>
        </Lang90Reveal>
        <Lang90Reveal delay="short" className={`mt-12 ${bodyClass} space-y-8`}>
          <p>Lặng dành cho những lúc bạn cần làm chậm điều đang quá nhiều, nhìn rõ một phản ứng hoặc vòng lặp chính và mở lại khoảng để tự lựa chọn.</p>
          <p>Phiên không thay thế hỗ trợ y tế hoặc chuyên môn sức khỏe tâm thần.</p>
          <p>
            Nếu qua sáu câu hỏi tôi nhận thấy điều bạn đang trải qua nằm ngoài phạm vi của Lặng, tôi sẽ nói rõ.<br />
            Không phải vì câu chuyện của bạn chưa đủ quan trọng.<br />
            Mà vì tôi không muốn bạn nhận sai loại hỗ trợ vào lúc đang cần một điều khác.
          </p>
          <p className="border-l border-e26-border pl-6 text-e26-text">
            Nếu bạn đang ở trong tình trạng khẩn cấp hoặc có nguy cơ làm tổn thương bản thân hay người khác, hãy ưu tiên liên hệ ngay với một người thân đáng tin, cơ sở y tế hoặc dịch vụ khẩn cấp tại nơi bạn đang sống.
          </p>
        </Lang90Reveal>
      </div>
    </section>
  );
}

export function Lang90Value() {
  return (
    <section className="bg-e26-ivory px-6 py-24 md:py-36">
      <div className="mx-auto max-w-[680px]">
        <Lang90Reveal>
          <p className={sectionLabelClass}>Giá trị của Lặng</p>
        </Lang90Reveal>
        <Lang90Reveal delay="short" className={`mt-12 ${bodyClass} space-y-8`}>
          <p>Giá trị của Lặng không nằm ở 90 phút trò chuyện.</p>
          <p>Nó nằm ở độ chính xác của không gian được tạo ra.</p>
          <p>
            Ở những câu hỏi không vội vàng.<br />
            Ở điều được nhìn thấy khi câu chuyện không còn bị kéo đi bởi phản ứng đầu tiên.<br />
            Và ở cách điều vừa thấy được mang trở lại đời sống sau cuộc gặp.
          </p>
          <p>
            Bạn không cần rời phiên với mọi câu trả lời.<br />
            Chỉ cần một điều đã rõ hơn.<br />
            Một phản ứng đã được nhận ra.<br />
            Và một bước đủ thật để mang theo khi quay lại cuộc sống của mình.
          </p>
        </Lang90Reveal>
      </div>
    </section>
  );
}

const sessionDetails: Array<{ label: string; value: ReactNode }> = [
  { label: "Thời lượng", value: "90 phút" },
  { label: "Hình thức", value: "Trực tuyến hoặc gặp trực tiếp tại Sài Gòn" },
  { label: "Người giữ phiên", value: "Kenji Phạm" },
  { label: "Phí phiên", value: "10.000.000 đồng" },
  {
    label: "Sau phiên",
    value: "Một bản tóm tắt riêng dài 1–2 trang, gửi trong vòng 1–2 ngày.",
  },
  { label: "Số lượng", value: "Tối đa 5 phiên mỗi tháng" },
];

export function Lang90Offer() {
  return (
    <section className="bg-e26-cream px-6 py-24 md:py-36">
      <div className="mx-auto max-w-[1040px]">
        <Lang90Reveal>
          <p className={sectionLabelClass}>Thông tin phiên</p>
          <h2 className={`${headingClass} mt-7`}>Phiên Lặng</h2>
        </Lang90Reveal>
        <div className="mt-14 grid gap-16 md:grid-cols-[minmax(0,1fr)_0.72fr] md:gap-20 md:items-start">
          <div>
            <Lang90Reveal delay="short" className="border-y border-e26-border">
              {sessionDetails.map(({ label, value }) => (
                <div key={label} className="grid gap-2 border-b border-e26-border py-6 last:border-b-0 md:grid-cols-[150px_1fr] md:gap-8">
                  <p className={sectionLabelClass}>{label}</p>
                  <div className={bodyClass}>{value}</div>
                </div>
              ))}
            </Lang90Reveal>
            <Lang90Reveal delay="short" className={`mt-10 ${bodyClass} space-y-5`}>
              <p>Trong đó có:</p>
              <ul className="space-y-3 border-l border-e26-border pl-6">
                <li>vấn đề chính đã được nhìn rõ</li>
                <li>phản ứng hoặc vòng lặp cần tiếp tục quan sát</li>
                <li>điều cần ghi nhớ sau phiên</li>
                <li>bước thực hành đã chọn trong 48 giờ</li>
                <li>những câu hỏi bạn có thể mang theo</li>
              </ul>
              <p>
                Bạn cũng sẽ nhận một email vào ngày 7 và một email vào ngày 30 để có dịp nhìn lại:<br />
                điều gì đã thay đổi,<br />
                điều gì vẫn đang lặp lại,<br />
                và điều gì có thể cần thêm một không gian sâu hơn để tiếp tục nhìn.
              </p>
              <p>Tôi giữ giới hạn này để mỗi cuộc gặp có đủ thời gian chuẩn bị, sự tập trung và khoảng chăm sóc sau phiên.</p>
              <p>
                Đây là giới hạn vận hành.<br />
                Không phải một lý do để bạn phải quyết định vội.
              </p>
            </Lang90Reveal>
          </div>
          <StoryboardSlot id="SB-04" tone="paper" className="aspect-[5/4]" />
        </div>
      </div>
    </section>
  );
}

export function Lang90NextStep() {
  return (
    <section className="bg-e26-white px-6 py-24 md:py-36">
      <div className="mx-auto max-w-[680px]">
        <Lang90Reveal>
          <p className={sectionLabelClass}>Bước tiếp theo</p>
          <h2 className={`${headingClass} mt-7`}>Bước tiếp theo chưa phải đặt lịch.</h2>
          <p className={`${whisperClass} mt-4`}>Và cũng chưa phải thanh toán.</p>
        </Lang90Reveal>
        <Lang90Reveal delay="short" className={`mt-12 ${bodyClass} space-y-8`}>
          <p>Khi bấm nút bên dưới, bạn sẽ được chuyển đến một biểu mẫu gồm sáu câu hỏi.</p>
          <p>
            Thời gian hoàn thành khoảng 5–10 phút.<br />
            Không có câu trả lời đúng hay sai.<br />
            Bạn cũng không cần phải viết hay, kể đủ hoặc làm câu chuyện của mình trở nên nghiêm trọng hơn.
          </p>
          <div>
            <p>Sáu câu hỏi giúp tôi hiểu:</p>
            <ul className="mt-5 space-y-3 border-l border-e26-border pl-6">
              <li>điều gì đang đưa bạn đến đây</li>
              <li>bạn đang ở trạng thái nào</li>
              <li>bạn mong điều gì từ cuộc gặp</li>
              <li>cách làm việc của Lặng có phù hợp với bạn hay không</li>
            </ul>
          </div>
          <p>
            Tôi trực tiếp đọc phần bạn gửi.<br />
            Bạn sẽ nhận phản hồi của tôi trong vòng một ngày làm việc.<br />
            Nếu phù hợp, bạn sẽ nhận một đường dẫn để chọn lịch.<br />
            Sau khi chọn được thời gian, bạn mới đến bước thanh toán.<br />
            Nếu tôi nhận thấy một hướng khác có thể phù hợp hơn, tôi cũng sẽ nói rõ với bạn.
          </p>
          <p>
            Bạn chưa cần chuẩn bị một phiên bản hoàn chỉnh của câu chuyện.<br />
            Chỉ cần bắt đầu từ điều đang thật nhất lúc này.
          </p>
        </Lang90Reveal>
        <Lang90Reveal delay="long" className="mt-16 text-center md:mt-20">
          <Link
            href="/lang-90/dat-phien"
            className="inline-flex min-h-14 items-center justify-center bg-e26-gold px-8 py-4 font-sans text-[12px] font-medium uppercase tracking-[0.18em] text-e26-black transition-colors hover:bg-e26-gold-deep hover:text-e26-ivory focus:outline-none focus-visible:ring-2 focus-visible:ring-e26-gold-deep focus-visible:ring-offset-4 focus-visible:ring-offset-e26-ivory"
          >
            BẮT ĐẦU 6 CÂU HỎI
          </Link>
          <p className="mt-5 font-sans text-[12px] font-medium tracking-[0.08em] text-e26-text-2">
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
      <StoryboardSlot id="SB-05" tone="closing" className="min-h-[30svh] w-full md:min-h-[48svh]" />
      <Lang90Footer>
        <Lang90Reveal>
          <p className={darkSectionLabelClass}>Đóng thư</p>
          <p className="mt-7 font-serif text-[30px] font-medium italic leading-[1.25] text-e26-text-dark md:text-[42px]">
            Cảm ơn bạn đã dành thời gian<br />
            ngồi lại cùng chính mình.
          </p>
          <div className="mt-10 font-sans text-[17px] font-normal leading-[1.9] text-e26-text-dark-2 md:text-[18px]">
            <p>Bạn không cần bước qua cánh cửa này vì đang bị thúc giục.</p>
            <p className="mt-6">
              Chỉ khi bạn cảm thấy mình đã sẵn sàng ngồi xuống...<br />
              và nhìn một điều cho đủ rõ.
            </p>
          </div>
          <div className="mt-14 border-t border-e26-border-dark pt-8 font-sans text-[12px] font-medium uppercase tracking-[0.18em] text-e26-text-dark-2">
            <p>Có câu hỏi trước khi bắt đầu?</p>
            <a
              href="mailto:contact@coachkenjipham.com"
              className="mt-5 inline-block text-e26-text-dark transition-colors hover:text-e26-text-dark-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-e26-text-dark-2"
            >
              contact@coachkenjipham.com
            </a>
            <p className="mt-8">Kenji Phạm · Essence Coach · Sài Gòn</p>
            <p className="mt-5">© 2026 Essence Coaching System</p>
          </div>
        </Lang90Reveal>
      </Lang90Footer>
    </>
  );
}

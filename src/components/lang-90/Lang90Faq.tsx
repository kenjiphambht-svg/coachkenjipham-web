import { useId, useState } from "react";

import { bodyClass, headingClass } from "./Lang90Frame";

const faqItems = [
  {
    question: "Tôi không biết phải bắt đầu nói từ đâu thì sao?",
    answer: [
      "Bạn không cần biết.",
      "Chúng ta có thể bắt đầu bằng một sự việc cụ thể, một cảm giác, một câu hỏi... hoặc chỉ bằng câu:",
      "Tôi không biết phải bắt đầu từ đâu.",
      "Đó vẫn là một nơi để bắt đầu.",
    ],
  },
  {
    question: "Tôi có phải kể hết mọi chuyện không?",
    answer: [
      "Không.",
      "Bạn luôn có quyền giữ lại điều mình chưa sẵn sàng chia sẻ.",
      "Một cuộc trò chuyện có chiều sâu không được đo bằng số lượng bí mật bạn kể ra.",
    ],
  },
  {
    question: "Kenji có nói tôi nên làm gì không?",
    answer: [
      "Tôi có thể phản chiếu điều tôi đang nhìn thấy, đặt câu hỏi trực diện và chỉ ra những điểm đang mâu thuẫn.",
      "Nhưng tôi không đưa ra quyết định thay bạn.",
      "Mục tiêu của phiên là giúp bạn lựa chọn rõ hơn... không phải giao quyền lựa chọn cho tôi.",
    ],
  },
  {
    question: "Vì sao phải trả lời sáu câu hỏi trước khi được chọn lịch?",
    answer: [
      "Vì không phải mọi trạng thái đều phù hợp với cùng một loại hỗ trợ.",
      "Sáu câu hỏi giúp cả bạn và tôi không bước vào một cuộc gặp sai phạm vi hoặc sai kỳ vọng.",
    ],
  },
  {
    question: "Những gì tôi chia sẻ có được giữ riêng tư không?",
    answer: [
      "Thông tin bạn gửi chỉ được sử dụng để xem xét mức phù hợp, chuẩn bị cho phiên và thực hiện các bước chăm sóc đã được thông báo.",
      "Những điều riêng tư của bạn không được dùng làm nội dung công khai nếu chưa có sự đồng ý rõ ràng.",
    ],
  },
  {
    question: "Nếu Lặng 90 chưa phù hợp thì sao?",
    answer: [
      "Tôi sẽ nói rõ.",
      "Khi có một cánh cửa khác trong hệ Essence phù hợp hơn, tôi có thể gợi ý để bạn tự cân nhắc.",
      "Bạn không có nghĩa vụ phải tiếp tục.",
    ],
  },
];

export default function Lang90Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  return (
    <section className="bg-e26-ivory px-6 py-20 md:py-32">
      <div className="mx-auto max-w-[720px]">
        <h2 className={headingClass}>Trước khi bạn đi</h2>
        <div className="mt-12 border-t border-e26-border">
          {faqItems.map((item, index) => {
            const open = openIndex === index;
            const panelId = `${baseId}-panel-${index}`;
            return (
              <div key={item.question} className="border-b border-e26-border">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(open ? null : index)}
                    aria-expanded={open}
                    aria-controls={panelId}
                    className="flex min-h-16 w-full items-center justify-between gap-6 py-6 text-left font-serif text-[22px] font-medium leading-snug text-e26-text transition-colors hover:text-e26-gold-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-e26-gold-deep focus-visible:ring-offset-4 focus-visible:ring-offset-e26-ivory"
                  >
                    <span>{item.question}</span>
                    <span aria-hidden="true" className="font-sans text-xl font-normal">
                      {open ? "−" : "+"}
                    </span>
                  </button>
                </h3>
                <div id={panelId} hidden={!open} className="pb-7 pr-8">
                  <div className={`${bodyClass} space-y-4`}>
                    {item.answer.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import { useId, useState } from "react";

import { bodyClass, headingClass } from "./Lang90Frame";

const faqItems = [
  {
    question: "Tôi không biết phải bắt đầu nói từ đâu thì sao?",
    answer: [
      "Bạn không cần biết.",
      "Có thể bắt đầu bằng một sự việc, một cảm giác, một câu hỏi...",
      "hoặc chỉ bằng câu:",
      "“Tôi không biết phải bắt đầu từ đâu.”",
      "Đó vẫn là một nơi để bắt đầu.",
    ],
  },
  {
    question: "Tôi có phải kể hết mọi chuyện không?",
    answer: [
      "Không.",
      "Bạn kể đến đâu, chúng ta làm việc đến đó.",
      "Tôi không cần biết toàn bộ cuộc đời bạn để cùng bạn nhìn rõ điều đang diễn ra lúc này.",
    ],
  },
  {
    question: "Kenji có nói tôi nên làm gì không?",
    answer: [
      "Tôi sẽ nói điều tôi đang nhìn thấy.",
      "Tôi có thể hỏi thẳng, đưa ra một góc nhìn khác hoặc chỉ ra nơi bạn đang né tránh.",
      "Nhưng việc quyết định vẫn là của bạn.",
      "Tôi không lấy quyền đó khỏi tay bạn.",
    ],
  },
  {
    question: "Những gì tôi chia sẻ có được giữ riêng tư không?",
    answer: [
      "Tôi trực tiếp đọc phần bạn gửi.",
      "Nội dung trong biểu mẫu và trong phiên được giữ trong phạm vi riêng tư của quá trình làm việc.",
      "Nếu xuất hiện một nguy cơ an toàn nghiêm trọng, tôi sẽ nói rõ cách chúng ta cần xử lý trước khi tiếp tục.",
    ],
  },
];

export default function Lang90Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  return (
    <section className="bg-e26-cream-deep px-6 py-24 md:py-36">
      <div className="mx-auto max-w-[680px]">
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
                    className="flex min-h-16 w-full items-center justify-between gap-6 py-7 text-left font-serif text-[22px] font-medium leading-snug text-e26-text transition-colors hover:text-e26-text-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-e26-text-2 focus-visible:ring-offset-4 focus-visible:ring-offset-e26-cream-deep"
                  >
                    <span>{item.question}</span>
                    <span aria-hidden="true" className="font-sans text-xl font-normal">
                      {open ? "−" : "+"}
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out motion-reduce:transition-none ${
                    open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className={`${bodyClass} space-y-4 pb-8 pr-8`}>
                    {item.answer.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                    </div>
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

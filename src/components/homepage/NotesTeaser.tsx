const PANELS = [
  {
    key: "ebook",
    number: "01",
    marker: "Ấn phẩm",
    title: "Ebook",
    body: "Một cuốn sách nhỏ cho người đang tự hỏi:",
    quote: "“Tôi nên bắt đầu nhìn lại bản sắc của mình từ đâu?”",
    status: "Sắp hoàn thành",
    className: "md:col-span-7 md:row-span-2 md:py-16",
  },
  {
    key: "notes",
    number: "02",
    marker: "Ghi chép",
    title: "Ghi chép Essence",
    body: "Những bài viết ngắn về phản xạ, bản sắc, khoảng dừng và những điều thường đi qua đời sống trước khi ta kịp gọi tên.",
    status: "Đang được viết",
    className: "md:col-span-5",
  },
  {
    key: "start",
    number: "03",
    marker: "Khởi đầu",
    title: "Khởi đầu",
    body: "Một vài câu hỏi để bạn nhận ra mình đang đứng ở đâu.",
    detail: "Không chấm điểm. Không gắn nhãn. Không nói thay bạn.",
    status: "Đang chuẩn bị",
    className: "md:col-span-5 md:mt-8",
  },
] as const;

export default function NotesTeaser() {
  return (
    <section id="mot-goc-de-quay-lai" className="relative scroll-mt-24 overflow-hidden bg-e26-ivory px-6 py-20 md:py-32">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(/images/home/ghi-chep-essence-v4.webp)", filter: "sepia(0.25)" }} aria-hidden="true" />
      <div className="absolute inset-0 bg-[color-mix(in_srgb,var(--essence-ivory-2026)_72%,transparent)]" aria-hidden="true" />
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="e26-reveal max-w-xl md:ml-[8%]">
          <h2 className="font-serif font-medium text-[30px] md:text-[42px] leading-[1.25] text-e26-text mb-8">Một góc để quay lại.</h2>
          <div className="space-y-6 font-sans font-normal text-[17px] md:text-[18px] leading-[1.9] text-e26-text">
            <p>Có ngày, bạn cần một cuộc đối thoại sâu.</p>
            <p>Có ngày, một đoạn ngắn đã đủ để nhìn rõ thêm một điều.</p>
            <p>Những cánh cửa này đang được viết dần.</p>
            <p>Khi mở, chúng sẽ ở đây — để bạn quay lại đúng lúc mình cần.</p>
          </div>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-12 md:items-start">
          {PANELS.map((panel) => (
            <article key={panel.key} className={`e26-reveal border border-[color-mix(in_srgb,var(--essence-black-2026)_10%,transparent)] bg-[color-mix(in_srgb,var(--essence-ivory-2026)_90%,transparent)] p-7 md:p-10 ${panel.className}`}>
              <p className="flex items-baseline gap-3">
                <span className="font-serif text-[19px] font-normal leading-none tracking-[0.02em] text-e26-text">{panel.number}</span>
                <span className="font-sans text-[11px] font-medium tracking-[0.16em] uppercase text-e26-text-2">{panel.marker}</span>
              </p>
              <div className={panel.key === "ebook" ? "mt-16 md:mt-20 max-w-md" : "mt-8"}>
                <h3 className={panel.key === "ebook" ? "font-serif font-medium text-[36px] md:text-[54px] leading-[1.1] text-e26-text" : "font-serif font-medium text-[26px] md:text-[32px] leading-[1.2] text-e26-text"}>{panel.title}</h3>
                <p className="mt-5 font-sans font-normal text-[16px] md:text-[17px] leading-[1.8] text-e26-text">{panel.body}</p>
                {"quote" in panel && <p className="mt-8 font-serif italic font-normal text-[24px] md:text-[30px] leading-[1.35] text-e26-text">{panel.quote}</p>}
                {"detail" in panel && <p className="mt-5 font-sans font-normal text-[15px] leading-[1.75] text-e26-text-2">{panel.detail}</p>}
              </div>
              <p className="mt-10 border-t border-[color-mix(in_srgb,var(--essence-black-2026)_14%,transparent)] pt-4 font-sans text-[12px] font-medium tracking-[0.12em] uppercase text-e26-text-2">{panel.status}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

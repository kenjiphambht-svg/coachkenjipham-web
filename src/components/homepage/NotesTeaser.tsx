const PANELS = [
  {
    key: "ebook",
    number: "01",
    marker: "Ấn phẩm",
    title: "Ebook",
    body: "Một cuốn sách nhỏ cho người đang tự hỏi:",
    quote: "“Tôi nên bắt đầu nhìn lại bản sắc của mình từ đâu?”",
    status: "Sắp hoàn thành",
    className: "md:col-span-6 lg:col-span-1",
  },
  {
    key: "notes",
    number: "02",
    marker: "Ghi chép",
    title: "Ghi chép Essence",
    body: "Những bài viết ngắn về phản xạ, bản sắc, khoảng dừng và những điều thường đi qua đời sống trước khi ta kịp gọi tên.",
    status: "Đang được viết",
    className: "",
  },
  {
    key: "start",
    number: "03",
    marker: "Khởi đầu",
    title: "Khởi đầu",
    body: "Một vài câu hỏi để bạn nhận ra mình đang đứng ở đâu.",
    detail: "Không chấm điểm. Không gắn nhãn. Không nói thay bạn.",
    status: "Đang chuẩn bị",
    className: "",
  },
] as const;

export default function NotesTeaser() {
  return (
    <section id="mot-goc-de-quay-lai" className="relative scroll-mt-24 overflow-hidden bg-e26-ivory px-6 py-20 md:py-32">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(/images/home/ghi-chep-essence-v4.webp)", filter: "sepia(0.25)" }} aria-hidden="true" />
      <div className="absolute inset-0 bg-[color-mix(in_srgb,var(--essence-ivory-2026)_62%,transparent)]" aria-hidden="true" />
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="e26-reveal max-w-[580px] md:ml-[8%]">
          <h2 className="font-serif font-medium text-[30px] md:text-[42px] leading-[1.25] text-e26-text mb-8">Một góc để quay lại.</h2>
          <div className="space-y-6 font-sans font-normal text-[17px] md:text-[18px] leading-[1.9] text-e26-text">
            <p>Có ngày, bạn cần một cuộc đối thoại sâu.</p>
            <p>Có ngày, một đoạn ngắn đã đủ để nhìn rõ thêm một điều.</p>
            <p>Những cánh cửa này đang được viết dần.</p>
            <p>Khi mở, chúng sẽ ở đây — để bạn quay lại đúng lúc mình cần.</p>
          </div>
        </div>
        <div className="mt-16 grid gap-10 md:grid-cols-12 md:items-start md:gap-x-12 md:gap-y-0 lg:grid-cols-[minmax(0,1.22fr)_minmax(0,0.9fr)] lg:gap-x-16">
          {PANELS.slice(0, 1).map((panel) => (
            <article key={panel.key} className={`e26-reveal flex flex-col bg-[color-mix(in_srgb,var(--essence-ivory-2026)_90%,transparent)] px-8 py-10 md:px-14 md:py-16 ${panel.className}`}>
              <p className="flex items-baseline gap-4">
                <span className="font-serif text-[34px] font-normal leading-none tracking-[0.02em] text-e26-text md:text-[42px]">{panel.number}</span>
                <span className="font-sans text-[11px] font-medium tracking-[0.16em] uppercase text-e26-text-2">{panel.marker}</span>
              </p>
              <div className="mt-16 max-w-md md:mt-24">
                <h3 className="font-serif font-medium text-[40px] leading-[1.1] text-e26-text md:text-[56px]">{panel.title}</h3>
                <p className="mt-6 font-sans font-normal text-[16px] leading-[1.8] text-e26-text md:text-[17px]">{panel.body}</p>
                {"quote" in panel && <p className="mt-9 font-serif italic font-normal text-[25px] leading-[1.35] text-e26-text md:text-[31px]">{panel.quote}</p>}
              </div>
              <p className="mt-14 border-t border-[color-mix(in_srgb,var(--essence-black-2026)_14%,transparent)] pt-4 font-sans text-[12px] font-medium tracking-[0.12em] uppercase text-e26-text-2 md:mt-auto">{panel.status}</p>
            </article>
          ))}
          <div className="space-y-0 border-t border-[color-mix(in_srgb,var(--essence-black-2026)_14%,transparent)] md:col-span-6 md:border-t-0 md:border-l md:pl-6 lg:col-span-1 lg:pl-0">
            {PANELS.slice(1).map((panel) => (
              <article key={panel.key} className={`e26-reveal flex flex-col bg-[color-mix(in_srgb,var(--essence-ivory-2026)_82%,transparent)] px-6 py-12 first:pt-12 last:border-t last:border-[color-mix(in_srgb,var(--essence-black-2026)_14%,transparent)] md:px-6 md:py-14 md:first:pt-4 lg:px-8 ${panel.className}`}>
                <p className="flex items-baseline gap-4">
                  <span className="font-serif text-[30px] font-normal leading-none tracking-[0.02em] text-e26-text md:text-[36px]">{panel.number}</span>
                  <span className="font-sans text-[11px] font-medium tracking-[0.16em] uppercase text-e26-text-2">{panel.marker}</span>
                </p>
                <div className="mt-10 md:mt-11">
                  <h3 className="font-serif font-medium text-[28px] leading-[1.2] text-e26-text md:text-[34px]">{panel.title}</h3>
                  <p className="mt-6 font-sans font-normal text-[16px] leading-[1.9] text-e26-text md:text-[17px]">{panel.body}</p>
                  {"detail" in panel && <p className="mt-6 font-sans font-normal text-[15px] leading-[1.8] text-e26-text-2">{panel.detail}</p>}
                </div>
                <p className="mt-12 border-t border-[color-mix(in_srgb,var(--essence-black-2026)_14%,transparent)] pt-5 font-sans text-[12px] font-medium tracking-[0.12em] uppercase text-e26-text-2 md:mt-auto">{panel.status}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";

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
    status: "Đi tới Khởi đầu",
    href: "/khoi-dau",
    className: "",
  },
] as const;

export default function NotesTeaser() {
  return (
    <div id="goc-doc" className="relative scroll-mt-28">
      <div className="e26-reveal max-w-[650px]">
        <div className="mb-7 flex items-center gap-4">
          <span className="h-px w-10 bg-[#E0C068]" aria-hidden="true" />
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-e26-text-2">Góc đọc & quay lại</p>
        </div>
        <h2 className="font-serif text-[40px] font-medium leading-[1.08] tracking-[-0.014em] text-e26-text md:text-[58px]">Một góc để quay lại.</h2>
        <div className="mt-8 max-w-[590px] space-y-5 font-sans text-[17px] font-normal leading-[1.85] text-e26-text md:text-[18px]">
          <p>Có ngày, bạn cần một cuộc đối thoại sâu.</p>
          <p>Có ngày, một đoạn ngắn đã đủ để nhìn rõ thêm một điều.</p>
          <p>Những cánh cửa này đang được viết dần.</p>
          <p>Khi mở, chúng sẽ ở đây — để bạn quay lại đúng lúc mình cần.</p>
        </div>
      </div>

      <div className="mt-14 grid gap-8 md:mt-20 md:grid-cols-12 md:items-start md:gap-x-10 md:gap-y-0 lg:grid-cols-[minmax(0,1.18fr)_minmax(0,0.92fr)] lg:gap-x-12">
        {PANELS.slice(0, 1).map((panel) => (
          <article key={panel.key} className={`e26-reveal flex min-h-[430px] flex-col bg-[color-mix(in_srgb,var(--essence-white-2026)_72%,transparent)] px-8 py-10 backdrop-blur-[2px] md:min-h-[520px] md:px-12 md:py-14 ${panel.className}`}>
            <p className="flex items-baseline gap-4">
              <span className="font-serif text-[34px] font-normal leading-none tracking-[0.02em] text-e26-text md:text-[42px]">{panel.number}</span>
              <span className="font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-e26-text-2">{panel.marker}</span>
            </p>
            <div className="mt-16 max-w-md md:mt-24">
              <h3 className="font-serif text-[40px] font-medium leading-[1.1] text-e26-text md:text-[56px]">{panel.title}</h3>
              <p className="mt-6 font-sans text-[16px] font-normal leading-[1.8] text-e26-text md:text-[17px]">{panel.body}</p>
              {"quote" in panel && <p className="mt-9 font-serif text-[25px] font-normal italic leading-[1.35] text-e26-text md:text-[31px]">{panel.quote}</p>}
            </div>
            <p className="mt-14 border-t border-[color-mix(in_srgb,var(--essence-black-2026)_14%,transparent)] pt-4 font-sans text-[12px] font-medium uppercase tracking-[0.12em] text-e26-text-2 md:mt-auto">{panel.status}</p>
          </article>
        ))}

        <div className="space-y-0 border-t border-[color-mix(in_srgb,var(--essence-black-2026)_14%,transparent)] md:col-span-6 md:border-l md:border-t-0 md:pl-5 lg:col-span-1 lg:pl-0">
          {PANELS.slice(1).map((panel) => {
            const content = (
              <>
                <p className="flex items-baseline gap-4">
                  <span className="font-serif text-[30px] font-normal leading-none tracking-[0.02em] text-e26-text md:text-[36px]">{panel.number}</span>
                  <span className="font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-e26-text-2">{panel.marker}</span>
                </p>
                <div className="mt-10 md:mt-11">
                  <h3 className="font-serif text-[28px] font-medium leading-[1.2] text-e26-text md:text-[34px]">{panel.title}</h3>
                  <p className="mt-6 font-sans text-[16px] font-normal leading-[1.9] text-e26-text md:text-[17px]">{panel.body}</p>
                </div>
                <p className="mt-12 border-t border-[color-mix(in_srgb,var(--essence-black-2026)_14%,transparent)] pt-5 font-sans text-[12px] font-medium uppercase tracking-[0.12em] text-e26-text-2 md:mt-auto">
                  {panel.status}{"href" in panel ? <span className="ml-2 text-[#E0C068] transition-transform duration-300 group-hover:translate-x-1">→</span> : null}
                </p>
              </>
            );

            const className = `group e26-reveal flex min-h-[250px] flex-col bg-[color-mix(in_srgb,var(--essence-white-2026)_60%,transparent)] px-6 py-12 first:pt-12 last:border-t last:border-[color-mix(in_srgb,var(--essence-black-2026)_14%,transparent)] md:min-h-[260px] md:px-7 md:py-12 md:first:pt-4 lg:px-8 ${panel.className}`;

            return "href" in panel ? (
              <Link key={panel.key} href={panel.href} className={`${className} transition-colors duration-300 hover:bg-[color-mix(in_srgb,var(--essence-white-2026)_78%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-e26-gold focus-visible:ring-offset-4 focus-visible:ring-offset-e26-ivory`}>
                {content}
              </Link>
            ) : (
              <article key={panel.key} className={className}>
                {content}
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}

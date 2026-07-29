import Head from "next/head";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import BanSacSignal from "@/components/ban-sac-cua-con/BanSacSignal";
import { BanSacAccent, BanSacAnchor, BanSacBody, BanSacDisplay, BanSacUtility } from "@/components/ban-sac-cua-con/BanSacTypography";
import HomeFooter from "@/components/homepage/HomeFooter";
import HomeHeader from "@/components/homepage/HomeHeader";
import Lang90Reveal from "@/components/lang-90/Lang90Reveal";

const publications = [
  { age: "0–7 tuổi", status: "Đang mở", title: "Bản Sắc Hạt Mầm", description: ["Dành cho những năm đầu đời, khi con đang hình thành nhịp cảm xúc, cảm giác an toàn, ý chí ban đầu và cách con bước vào thế giới.", "Ấn phẩm giúp ba mẹ quan sát điều gì làm con dễ quá tải, con cần nhịp sinh hoạt thế nào, con biểu đạt cảm xúc ra sao và những nét riêng nào đang bắt đầu mở ra."], cta: "Xem Bản Sắc Hạt Mầm", href: "/an-pham-ban-sac-hat-mam", open: true },
  { age: "7–14 tuổi", status: "Sắp mở", title: "Bản Sắc Khám Phá", description: ["Dành cho giai đoạn con bước vào học đường, bạn bè và những lần đầu tự nhìn mình qua khả năng, kết quả và ánh mắt của người khác.", "Ấn phẩm giúp ba mẹ hiểu hơn cách con học, điều gì nâng đỡ hoặc làm con mất tự tin, con đang tìm vị trí của mình trong nhóm như thế nào và khi nào mình nên hướng dẫn, khi nào nên để con tự thử."], cta: "Tìm hiểu Bản Sắc Khám Phá", href: "/an-pham-ban-sac-kham-pha", open: false },
  { age: "14–21 tuổi", status: "Sắp mở", title: "Bản Sắc Giao Mùa", description: ["Dành cho giai đoạn con không còn là một đứa trẻ nhỏ, nhưng cũng chưa hoàn toàn bước vào đời người lớn.", "Ấn phẩm giúp ba mẹ nhìn rõ hơn cách con đang tách khỏi gia đình, điều gì khiến con khép lại, khi nào con cần một người đứng cạnh và khi nào con cần thêm khoảng riêng để tự tìm câu trả lời."], cta: "Tìm hiểu Bản Sắc Giao Mùa", href: "/an-pham-ban-sac-giao-mua", open: false },
];

export default function BanSacCuaConPage() {
  return <>
    <SEO title="Bản Sắc Của Con — Chọn ấn phẩm theo tuổi | Kenji Phạm" description="Dòng ấn phẩm cá nhân hóa giúp ba mẹ quan sát con dịu hơn theo ba giai đoạn 0–7, 7–14 và 14–21 tuổi." url="https://coachkenjipham.com/ban-sac-cua-con" type="article" />
    <Head><meta name="robots" content="noindex" /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Article", headline: "Bản Sắc Của Con — Chọn ấn phẩm theo tuổi", description: "Dòng ấn phẩm cá nhân hóa giúp ba mẹ quan sát con dịu hơn theo ba giai đoạn 0–7, 7–14 và 14–21 tuổi.", author: { "@type": "Person", name: "Kenji Phạm" }, publisher: { "@type": "Organization", name: "Essence Coaching System" }, url: "https://coachkenjipham.com/ban-sac-cua-con" }) }} /></Head>
    <HomeHeader />
    <main className="overflow-hidden bg-e26-ivory">
      <section className="relative isolate overflow-hidden px-6 pb-24 pt-16 md:pb-36 md:pt-28">
        <div aria-hidden="true" className="pointer-events-none absolute -right-[18%] top-[7%] h-[540px] w-[540px] rounded-full bg-e26-cream opacity-75 blur-3xl md:h-[720px] md:w-[720px]" />
        <Lang90Reveal className="relative mx-auto max-w-[1120px]"><div className="max-w-[720px]">
          <BanSacUtility>Bản Sắc Của Con</BanSacUtility>
          <BanSacDisplay className="mt-6 max-w-[790px]">Con không cần được sửa ngay.<br />Con cần được nhìn thấy trước đã.</BanSacDisplay>
          <div className="mt-10 space-y-6">
            <BanSacBody>Có những lúc con phản ứng theo một cách mà ba mẹ chưa hiểu. Con khóc lâu hơn mình nghĩ, nhất quyết không chịu hợp tác, hoặc im lặng đúng lúc mình muốn con nói ra.</BanSacBody>
            <BanSacBody>Mình thương con. Nhưng vì mệt, vì vội, đôi khi mình chỉ muốn mọi chuyện ổn lại thật nhanh.</BanSacBody>
            <BanSacBody>Bản Sắc Của Con là dòng ấn phẩm cá nhân hóa giúp ba mẹ chậm lại một nhịp để nhìn điều đang diễn ra phía sau hành vi của con. Mỗi ấn phẩm được viết theo đúng giai đoạn con đang lớn lên, từ những năm đầu đời đến tuổi bước vào thế giới riêng của mình.</BanSacBody>
            <div className="space-y-2 pt-3"><BanSacBody>Không để dự đoán con sẽ trở thành ai.</BanSacBody><BanSacBody>Không để đóng con vào một vài nét tính cách.</BanSacBody><BanSacBody>Chỉ để ba mẹ có thêm một cách nhìn, gần hơn với đứa trẻ thật đang ở trước mặt mình.</BanSacBody></div>
          </div>
          <a href="#chon-theo-tuoi" className="mt-10 inline-flex min-h-11 items-center border-b border-e26-text pb-1 font-sans text-[13px] font-medium uppercase tracking-[0.08em] text-e26-text transition-colors hover:border-e26-gold-deep hover:text-e26-gold-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-e26-gold focus-visible:ring-offset-4 focus-visible:ring-offset-e26-ivory">Chọn theo tuổi của con</a>
        </div></Lang90Reveal>
      </section>

      <section className="bg-e26-white px-6 py-20 md:py-32"><Lang90Reveal className="mx-auto max-w-[1120px]"><div className="max-w-[660px]">
        <BanSacAnchor>Có những hôm, làm ba mẹ cũng hơi khó</BanSacAnchor>
        <div className="mt-10 space-y-7">
          <BanSacBody>Mình đã đọc sách, nghe nhiều lời khuyên và cố kiên nhẫn hơn. Nhưng vẫn có những lúc con phản ứng mạnh, còn mình thì không biết nên nghiêm lại hay nên ôm con vào.</BanSacBody>
          <BanSacBody>Có khi con không chịu rời khỏi một trò chơi dù mình đã gọi nhiều lần. Có khi con đi học về, đóng cửa phòng rồi trả lời câu nào cũng chỉ có một chữ. Có khi mình hỏi han rất nhiều, nhưng càng hỏi con càng tránh xa.</BanSacBody>
          <BanSacBody>Những lúc như vậy, ba mẹ thường nghĩ mình đang thiếu một cách dạy đúng hơn.</BanSacBody>
          <BanSacBody>Nhưng đôi khi, điều mình đang thiếu không phải là một kỹ thuật mới. Mình chỉ chưa nhìn thấy điều con đang cố nói bằng cách riêng của con.</BanSacBody>
          <BanSacBody>Có đứa trẻ cần được báo trước khi một việc sắp thay đổi. Có con cần thêm thời gian để sắp lại cảm xúc trước khi nói. Có con cảm được bầu không khí trong nhà rất nhanh, dù người lớn vẫn nghĩ mình đang giấu khá khéo.</BanSacBody>
          <BanSacBody>Bản Sắc Của Con không đưa cho ba mẹ một công thức để áp dụng cho mọi tình huống. Nó giúp mình đặt những câu hỏi gần với con hơn: Điều gì làm con mềm ra? Điều gì khiến con co lại? Con cần nhịp sống thế nào để cảm thấy an toàn? Và phía sau điều mình đang gọi là bướng, nhạy cảm hay xa cách, con đang thật sự cần gì?</BanSacBody>
        </div>
        <BanSacAccent className="mt-14 max-w-[510px]">Đây là một bản đồ quan sát. Không phải chiếc nhãn dán.</BanSacAccent>
      </div></Lang90Reveal></section>

      <section className="bg-e26-cream px-6 py-20 md:py-32"><Lang90Reveal className="mx-auto max-w-[1120px]"><div className="max-w-[700px]">
        <BanSacAnchor>Con lớn lên.<span className="block">Cách mình hiểu con cũng cần lớn theo.</span></BanSacAnchor>
        <div className="mt-10 space-y-7">
          <BanSacBody>Một em bé 5 tuổi đang học cách nhận biết cảm xúc, thử ranh giới và tìm cảm giác an toàn trong căn nhà của mình.</BanSacBody>
          <BanSacBody>Một đứa trẻ 11 tuổi đã bắt đầu bước ra thế giới bên ngoài. Con có trường lớp, bạn bè, những điều làm mình tự hào và cả những lần đầu thấy mình không bằng người khác.</BanSacBody>
          <BanSacBody>Đến tuổi 17, con lại đứng ở một nơi khác. Con muốn tự quyết nhiều hơn, cần khoảng riêng rõ hơn, nhưng sâu bên trong vẫn cần biết mình có một gia đình đủ an toàn để quay về.</BanSacBody>
          <BanSacBody>Ba giai đoạn ấy không thể được đọc bằng cùng một ngôn ngữ.</BanSacBody>
          <BanSacBody>Vì vậy, Bản Sắc Của Con được viết thành ba ấn phẩm riêng. Không phải ba cấp độ phải đi lần lượt. Chỉ là ba cánh cửa dành cho ba chặng tuổi khác nhau.</BanSacBody>
          <BanSacBody>Ba mẹ chọn theo nơi con đang đứng lúc này.</BanSacBody>
        </div>
        <div aria-hidden="true" className="mt-14 flex flex-wrap gap-x-7 gap-y-3 border-t border-e26-border pt-5"><BanSacUtility as="span">0–7 tuổi</BanSacUtility><BanSacUtility as="span">7–14 tuổi</BanSacUtility><BanSacUtility as="span">14–21 tuổi</BanSacUtility></div>
      </div></Lang90Reveal></section>

      <section id="chon-theo-tuoi" className="scroll-mt-8 bg-e26-ivory px-6 py-20 md:py-32"><Lang90Reveal className="mx-auto max-w-[1120px]">
        <BanSacAnchor>Chọn theo tuổi con đang đi qua</BanSacAnchor>
        <div className="mt-12 grid gap-5 md:grid-cols-3 md:gap-6">{publications.map((publication) => <article key={publication.href} className="h-full"><Link href={publication.href} className={`group flex h-full min-h-[420px] flex-col border bg-e26-white p-7 transition-colors duration-300 hover:border-e26-gold-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-e26-gold focus-visible:ring-offset-4 focus-visible:ring-offset-e26-ivory md:p-8 ${publication.open ? "border-e26-gold" : "border-e26-border"}`}>
          <BanSacUtility className={publication.open ? "text-e26-gold-deep" : undefined}>{publication.age} · {publication.status}</BanSacUtility>
          <BanSacAnchor as="h3" level="h3" className="mt-6">{publication.title}</BanSacAnchor>
          <div className="mt-6 space-y-5">{publication.description.map((paragraph) => <BanSacBody key={paragraph} className="text-[16px] leading-[1.7] md:text-[17px]">{paragraph}</BanSacBody>)}</div>
          <span className="mt-auto pt-8 font-sans text-[13px] font-medium tracking-[0.04em] text-e26-text underline decoration-e26-border underline-offset-8 transition-colors group-hover:text-e26-gold-deep group-hover:decoration-e26-gold-deep">{publication.cta}</span>
        </Link></article>)}</div>
      </Lang90Reveal></section>

      <Lang90Reveal><BanSacSignal /></Lang90Reveal>

      <section className="bg-e26-cream px-6 py-20 md:py-32"><Lang90Reveal className="mx-auto max-w-[1120px]"><div className="max-w-[700px]">
        <BanSacAnchor>Hiểu con không có nghĩa là đóng khung con</BanSacAnchor>
        <div className="mt-10 space-y-7">
          <BanSacBody>Mỗi ấn phẩm được viết để mở thêm góc nhìn, không phải để tạo ra một định nghĩa cố định về con.</BanSacBody>
          <BanSacBody className="border-y border-e26-border py-7">Bản Sắc Của Con sẽ không dán nhãn con bằng một vài nét tính cách, không dự đoán nghề nghiệp hoặc tương lai, không chẩn đoán những vấn đề thuộc lĩnh vực y khoa hay tâm lý, và không nói con sinh ra để mang một trách nhiệm nào đó cho gia đình.</BanSacBody>
          <BanSacBody className="border-l border-e26-gold pl-6">Con có thể cảm được bầu không khí trong nhà rất nhanh. Nhưng con không có trách nhiệm gánh điều mình cảm được. Ba mẹ mới là người giữ khung và giữ nhịp cho con.</BanSacBody>
          <BanSacBody>Ấn phẩm cũng không dùng để biến con thành một dự án mà ba mẹ cần hoàn thiện. Con vẫn được quyền lớn lên, thay đổi, thử, sai và có những phần chưa thể hiểu ngay.</BanSacBody>
          <BanSacBody>Mình đọc Bản Sắc để quan sát con dịu hơn.</BanSacBody><BanSacBody>Không phải để biết trước mọi điều về con.</BanSacBody>
        </div>
      </div></Lang90Reveal></section>

      <section className="bg-e26-white px-6 py-20 md:py-32"><Lang90Reveal className="mx-auto max-w-[1120px]"><div className="max-w-[700px]">
        <BanSacAnchor>Ba mẹ không cần hiểu hết con trong một lần</BanSacAnchor>
        <div className="mt-10 space-y-7">
          <BanSacBody>Có những điều hôm nay mình chưa nhìn thấy, vài tháng sau mới dần hiện ra. Có những phản ứng lúc này còn làm mình bối rối, nhưng khi đặt chúng cạnh nhau đủ lâu, mình bắt đầu thấy một nhu cầu đang lặp lại phía sau.</BanSacBody>
          <BanSacBody>Hiểu con không bắt đầu bằng việc biết thật nhiều.</BanSacBody>
          <BanSacBody>Nó bắt đầu khi mình chịu chậm lại đủ lâu để nhìn con như con đang là, thay vì chỉ nhìn vào điều mình muốn con thay đổi.</BanSacBody>
          <BanSacBody>Khi ba mẹ sẵn sàng, hãy bắt đầu từ chặng tuổi con đang đi qua.</BanSacBody>
        </div>
        <a href="#chon-theo-tuoi" className="mt-12 inline-flex min-h-11 items-center bg-e26-gold px-7 py-3 font-sans text-[13px] font-medium uppercase tracking-[0.08em] text-e26-black transition-colors hover:bg-e26-gold-deep hover:text-e26-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-e26-gold focus-visible:ring-offset-4 focus-visible:ring-offset-e26-white">Chọn ấn phẩm dành cho con</a>
      </div></Lang90Reveal></section>
    </main>
    <HomeFooter />
  </>;
}

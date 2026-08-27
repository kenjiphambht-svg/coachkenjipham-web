import Head from "next/head";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import HomeFooter from "@/components/homepage/HomeFooter";
import HomeHeader from "@/components/homepage/HomeHeader";
import Lang90Reveal from "@/components/lang-90/Lang90Reveal";
import {
  BanSacAccent,
  BanSacAnchor,
  BanSacBody,
  BanSacDisplay,
  BanSacUtility,
} from "@/components/ban-sac-cua-con/BanSacTypography";

const CANONICAL_URL = "https://coachkenjipham.com/khoi-dau";

const focusClass =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-e26-gold focus-visible:ring-offset-4";

const doorClass =
  "group flex h-full min-h-[330px] flex-col border border-e26-border bg-e26-white p-7 transition-colors duration-300 hover:border-e26-gold-deep md:p-10";

export default function KhoiDauPage() {
  return (
    <>
      <SEO
        title="Khởi đầu — Nhìn rõ mình đang đứng ở đâu | ESSENCE"
        description="Khởi đầu giúp bạn chọn đúng bối cảnh Cá nhân hoặc Công việc và nhận một kết quả để nhìn rõ hơn mình đang ở đâu — không chấm điểm, không gắn nhãn."
        image="https://coachkenjipham.com/essence-og-1200x630.png"
        url={CANONICAL_URL}
        type="article"
      />
      <Head>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={CANONICAL_URL} />
      </Head>

      <HomeHeader />

      <main className="overflow-hidden bg-e26-ivory text-e26-text">
        <section className="relative isolate overflow-hidden px-6 pb-24 pt-16 md:px-8 md:pb-36 md:pt-28">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-[22%] top-[4%] h-[560px] w-[560px] rounded-full bg-e26-cream opacity-80 blur-3xl md:h-[760px] md:w-[760px]"
          />
          <Lang90Reveal className="relative mx-auto max-w-[1120px]">
            <div className="max-w-[790px]">
              <BanSacUtility>Khởi đầu</BanSacUtility>
              <BanSacDisplay className="mt-7 max-w-[830px]">
                Có những lúc mình biết chuyện này có liên quan tới mình.
                <span className="mt-2 block">Chỉ là vẫn chưa rõ nên bắt đầu từ đâu.</span>
              </BanSacDisplay>

              <div className="mt-12 space-y-6 md:mt-16">
                <BanSacBody>
                  Có thể điều làm bạn dừng lại nằm ở đời sống riêng, một mối quan hệ hoặc gia đình.
                </BanSacBody>
                <BanSacBody>
                  Cũng có thể nó nằm ở công việc — một quyết định, một vai trò, một đội ngũ hay cách mọi thứ đang vận hành.
                </BanSacBody>
                <BanSacBody>
                  Bạn chưa cần gọi đúng tên vấn đề ngay từ đầu. Khởi đầu dành cho khoảng ở giữa đó: đã nhận ra có điều cần nhìn lại, nhưng vẫn cần thêm một chút rõ ràng trước khi chọn bước tiếp theo.
                </BanSacBody>
              </div>

              <a
                href="#hai-boi-canh"
                className={`mt-10 inline-flex min-h-11 items-center border-b border-e26-text pb-1 font-sans text-[13px] font-medium uppercase tracking-[0.08em] text-e26-text transition-colors hover:border-e26-gold-deep hover:text-e26-gold-deep ${focusClass} focus-visible:ring-offset-e26-ivory`}
              >
                Xem hai bối cảnh
              </a>
            </div>
          </Lang90Reveal>
        </section>

        <section className="bg-e26-white px-6 py-20 md:px-8 md:py-32">
          <Lang90Reveal className="mx-auto max-w-[1120px]">
            <div className="max-w-[700px]">
              <BanSacAnchor>Khởi đầu không yêu cầu bạn phải biết câu trả lời trước.</BanSacAnchor>
              <div className="mt-10 space-y-6">
                <BanSacBody>
                  Bạn chọn bối cảnh gần nhất với điều mình đang mang tới, trả lời một số câu hỏi trong bối cảnh đó và nhận lại một kết quả giúp mình nhìn rõ hơn nơi đang đứng.
                </BanSacBody>
                <div className="space-y-2 border-l border-e26-border pl-6 md:pl-8">
                  <BanSacBody>Không chấm điểm.</BanSacBody>
                  <BanSacBody>Không gắn nhãn.</BanSacBody>
                  <BanSacBody>Không chẩn đoán.</BanSacBody>
                  <BanSacBody>Không dùng một kết quả để nói thay bạn phải làm gì tiếp theo.</BanSacBody>
                </div>
              </div>
            </div>
          </Lang90Reveal>
        </section>

        <section id="hai-boi-canh" className="scroll-mt-8 bg-e26-cream px-6 py-20 md:px-8 md:py-32">
          <Lang90Reveal className="mx-auto max-w-[1120px]">
            <div className="max-w-[700px]">
              <BanSacUtility>Hai cửa</BanSacUtility>
              <BanSacAnchor className="mt-5">Điều bạn đang muốn nhìn lại nằm ở đâu?</BanSacAnchor>
              <BanSacBody className="mt-7">
                Không có cửa nào cao hơn cửa nào. Chỉ cần chọn bối cảnh gần nhất với chuyện đang có mặt.
              </BanSacBody>
            </div>

            <div className="mt-12 grid items-stretch gap-5 md:grid-cols-2 md:gap-6">
              <a
                href="#ca-nhan"
                className={`${doorClass} ${focusClass} focus-visible:ring-offset-e26-cream`}
              >
                <BanSacUtility>Cá nhân · Đời sống cá nhân / gia đình</BanSacUtility>
                <BanSacAnchor as="h3" level="h3" className="mt-6">
                  Cá nhân
                </BanSacAnchor>
                <BanSacAccent className="mt-6 max-w-[470px] not-italic">
                  Khi điều làm bạn dừng lại nằm ở chính mình, một mối quan hệ, gia đình hoặc nhịp sống đang không còn dễ hiểu như trước.
                </BanSacAccent>
                <span className="mt-auto pt-10 font-sans text-[13px] font-medium tracking-[0.04em] text-e26-text underline decoration-e26-border underline-offset-8 transition-colors group-hover:text-e26-gold-deep group-hover:decoration-e26-gold-deep">
                  Xem bối cảnh Cá nhân
                </span>
              </a>

              <a
                href="#cong-viec"
                className={`${doorClass} ${focusClass} focus-visible:ring-offset-e26-cream`}
              >
                <BanSacUtility>Công việc · Lãnh đạo / kinh doanh / tổ chức</BanSacUtility>
                <BanSacAnchor as="h3" level="h3" className="mt-6">
                  Công việc
                </BanSacAnchor>
                <BanSacAccent className="mt-6 max-w-[470px] not-italic">
                  Khi có một quyết định, một vai trò, một đội ngũ hoặc cách vận hành khiến bạn biết mình cần nhìn lại kỹ hơn.
                </BanSacAccent>
                <span className="mt-auto pt-10 font-sans text-[13px] font-medium tracking-[0.04em] text-e26-text underline decoration-e26-border underline-offset-8 transition-colors group-hover:text-e26-gold-deep group-hover:decoration-e26-gold-deep">
                  Xem bối cảnh Công việc
                </span>
              </a>
            </div>
          </Lang90Reveal>
        </section>

        <section className="bg-e26-ivory px-6 py-20 md:px-8 md:py-32">
          <div className="mx-auto max-w-[1120px] space-y-20 md:space-y-28">
            <div id="ca-nhan" className="scroll-mt-24">
              <Lang90Reveal>
                <div className="max-w-[700px]">
                  <BanSacUtility>Cá nhân</BanSacUtility>
                  <BanSacAnchor className="mt-5">Khi chuyện nằm ở đời sống riêng hoặc gia đình.</BanSacAnchor>
                  <div className="mt-9 space-y-6">
                    <BanSacBody>
                      Bạn không cần biết ngay đây là “chuyện của mình” hay “chuyện của mối quan hệ”. Chỉ cần chọn Cá nhân nếu điều bạn muốn nhìn lại thuộc đời sống riêng hoặc gia đình.
                    </BanSacBody>
                    <BanSacBody>
                      Phần Khởi đầu này được thiết kế để giúp bạn nhận ra mình đang đứng ở đâu trong bối cảnh đó trước khi tự chọn có cần đi tiếp hay không.
                    </BanSacBody>
                  </div>
                  <BanSacUtility className="mt-8 text-e26-gold-deep">Đang chuẩn bị</BanSacUtility>
                </div>
              </Lang90Reveal>
            </div>

            <div id="cong-viec" className="scroll-mt-24 md:ml-[16%]">
              <Lang90Reveal>
                <div className="max-w-[700px]">
                  <BanSacUtility>Công việc</BanSacUtility>
                  <BanSacAnchor className="mt-5">Khi điều cần làm rõ nằm ở công việc.</BanSacAnchor>
                  <div className="mt-9 space-y-6">
                    <BanSacBody>
                      Chọn Công việc khi điều bạn muốn nhìn lại thuộc vai trò lãnh đạo, kinh doanh, đội ngũ, tổ chức hoặc một quyết định có hệ quả.
                    </BanSacBody>
                    <BanSacBody>
                      Đây không phải bài kiểm tra tâm lý cho người làm việc. Mục đích vẫn là giúp một bối cảnh còn mơ hồ trở nên rõ hơn trước khi bạn quyết định bước tiếp theo.
                    </BanSacBody>
                  </div>
                  <BanSacUtility className="mt-8 text-e26-gold-deep">Đang chuẩn bị</BanSacUtility>
                </div>
              </Lang90Reveal>
            </div>
          </div>
        </section>

        <section className="bg-e26-white px-6 py-20 md:px-8 md:py-32">
          <Lang90Reveal className="mx-auto max-w-[1120px]">
            <div className="max-w-[700px]">
              <BanSacAnchor>Một kết quả đủ để bạn nhìn rõ hơn mình đang ở đâu.</BanSacAnchor>
              <div className="mt-10 space-y-6">
                <BanSacBody>Khởi đầu không cố đưa ra một câu trả lời thay bạn.</BanSacBody>
                <BanSacBody>
                  Điều nó cần làm là giúp những gì còn mơ hồ trở nên có hình hơn một chút — để bạn biết mình đang nhìn vào bối cảnh nào và có thêm cơ sở để tự chọn điều nên làm tiếp.
                </BanSacBody>
              </div>
            </div>
          </Lang90Reveal>
        </section>

        <section className="bg-e26-text px-6 py-24 md:px-8 md:py-36">
          <Lang90Reveal className="mx-auto max-w-[1120px]">
            <div className="max-w-[760px]">
              <BanSacUtility className="text-e26-ivory/55">Một nhịp trước khi chọn</BanSacUtility>
              <BanSacAccent className="mt-8 max-w-[760px] text-[30px] leading-[1.35] text-e26-ivory md:text-[42px]">
                Bạn không cần biết sẵn câu trả lời để bắt đầu.
              </BanSacAccent>
              <BanSacAccent className="mt-5 max-w-[700px] text-e26-ivory/80">
                Chỉ cần đủ thành thật với điều đang có mặt — rồi nhìn xem nó đang đưa mình tới đâu.
              </BanSacAccent>
            </div>
          </Lang90Reveal>
        </section>

        <section className="bg-e26-cream px-6 py-20 md:px-8 md:py-32">
          <Lang90Reveal className="mx-auto max-w-[1120px]">
            <div className="max-w-[720px]">
              <BanSacAnchor>Sau đó, bạn vẫn là người chọn bước tiếp theo.</BanSacAnchor>
              <div className="mt-10 space-y-4">
                <BanSacBody>Có thể bạn muốn tiếp tục đọc.</BanSacBody>
                <BanSacBody>Có thể bạn muốn hiểu thêm về người đứng sau ESSENCE.</BanSacBody>
                <BanSacBody>Có thể một cuộc trao đổi bắt đầu trở nên phù hợp.</BanSacBody>
                <BanSacBody>Và cũng có thể hôm nay chưa cần làm gì thêm.</BanSacBody>
              </div>

              <div className="mt-12 flex flex-col items-start gap-5 sm:flex-row sm:gap-8">
                <Link
                  href="/#mot-goc-de-quay-lai"
                  className={`inline-flex min-h-11 items-center border-b border-e26-text pb-1 font-sans text-[14px] font-medium text-e26-text transition-colors hover:border-e26-gold-deep hover:text-e26-gold-deep ${focusClass} focus-visible:ring-offset-e26-cream`}
                >
                  Tiếp tục đọc
                </Link>
                <Link
                  href="/ve-kenji"
                  className={`inline-flex min-h-11 items-center border-b border-e26-border pb-1 font-sans text-[14px] font-medium text-e26-text transition-colors hover:border-e26-gold-deep hover:text-e26-gold-deep ${focusClass} focus-visible:ring-offset-e26-cream`}
                >
                  Về Kenji
                </Link>
              </div>

              <BanSacBody className="mt-14 border-t border-e26-border pt-8 text-[15px] leading-[1.75] text-e26-text/70 md:text-[16px]">
                Khởi đầu không phải một cánh cổng bắt buộc dẫn tới mua hàng. Bạn có thể dừng lại, tiếp tục quan sát hoặc quay lại khi thấy phù hợp.
              </BanSacBody>
            </div>
          </Lang90Reveal>
        </section>
      </main>

      <HomeFooter />
    </>
  );
}

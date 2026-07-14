import Head from "next/head";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import HomeHeader from "@/components/homepage/HomeHeader";
import HomeFooter from "@/components/homepage/HomeFooter";

// ============================================================
// /ban-sac-cua-ban — HUB dòng người lớn (noindex, chờ Kenji duyệt).
// Đối xứng /ban-sac-cua-con. Copy nguyên văn theo task — KHÔNG nhắc
// FCP/Casting/Gateway hay tên kỹ thuật nội bộ nào. Không hiển thị giá
// sản phẩm ở hub (để trong trang sản phẩm riêng, vd /lang-90).
// Schema: Article (không Product — đây là hub, không phải trang bán).
// Chỉ 1 nút vàng duy nhất (Section 5). 2/3 thẻ "Sắp mở", không link.
// LƯU Ý: trang này chưa có brief riêng trong File 03 — mô tả 2 sản phẩm
// "Dấu Ấn Của Bạn" / "Bạn Là Duy Nhất" là diễn giải do Claude (chat) dựng
// theo M3+M8+Brand Book — Kenji cần duyệt kỹ phần này trước khi bỏ noindex.
// ============================================================
export default function BanSacCuaBanPage() {
  return (
    <>
      <SEO
        title="Bản Sắc Của Bạn — cửa dành cho người lớn (Bản nháp)"
        description="Ba cách để ngồi lại với chính mình, tùy vào chỗ bạn đang đứng hôm nay. Không đường tắt. Không phán."
        url="https://coachkenjipham.com/ban-sac-cua-ban"
      />
      <Head>
        <meta name="robots" content="noindex" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: "Bản Sắc Của Bạn — cửa dành cho người lớn",
              description:
                "Ba cách để ngồi lại với chính mình, tùy vào chỗ bạn đang đứng hôm nay. Không đường tắt. Không phán.",
              author: { "@type": "Person", name: "Kenji Phạm" },
              publisher: { "@type": "Organization", name: "Essence Coaching System" },
              url: "https://coachkenjipham.com/ban-sac-cua-ban",
            }),
          }}
        />
      </Head>

      <HomeHeader />
      <main className="bg-e26-ivory">
        {/* 1 — HERO */}
        <section className="max-w-[720px] mx-auto px-6 pt-16 pb-16 md:pt-24 md:pb-20">
          <p className="font-sans text-sm text-e26-text-2">Cho chính bạn</p>
          <h1 className="font-serif font-light text-[34px] md:text-[48px] leading-[1.15] text-e26-text mt-4">
            Có những người lớn lên rất sớm —
            <br />
            vì ngày đó không có nhiều chỗ để yếu.
          </h1>
          <p className="font-sans text-[17px] leading-[1.65] text-e26-text-2 mt-8 max-w-xl">
            Ba cách để ngồi lại với chính mình, tùy vào chỗ bạn đang đứng hôm nay. Không đường
            tắt. Không phán. Chỉ một khoảng đủ yên để nhìn cho rõ.
          </p>
        </section>

        {/* 2 — MỘT ĐOẠN DẪN */}
        <section className="bg-e26-white">
          <div className="max-w-[720px] mx-auto px-6 py-16 md:py-24">
            <div className="space-y-5 font-sans text-[17px] leading-[1.7] text-e26-text-2 max-w-xl">
              <p>
                Bạn có thể rất giỏi. Rất có trách nhiệm. Rất đáng tin. Nhưng bên trong, một phần
                nào đó vẫn chưa thật sự được nghỉ.
              </p>
              <p>
                Essence bắt đầu từ chỗ đó — không phải để sửa bạn, mà để tạo một khoảng đủ An
                định cho phần đã gồng quá lâu được quyền thở lại.
              </p>
            </div>
          </div>
        </section>

        {/* 3 — BA PHÒNG */}
        <section className="bg-e26-cream px-6 py-16 md:py-24">
          <div className="max-w-[1120px] mx-auto">
            <h2 className="font-serif font-normal text-[26px] md:text-[34px] text-e26-text mb-12">
              Chọn theo chỗ bạn đang đứng
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Thẻ 1 — Lặng 90', ĐANG MỞ */}
              <div className="bg-e26-white border border-e26-border p-8 flex flex-col">
                <p className="font-sans text-xs tracking-[0.08em] uppercase text-e26-text-2 mb-3">
                  Đang mở
                </p>
                <h3 className="font-serif text-xl text-e26-text mb-4">Lặng 90&apos;</h3>
                <p className="font-sans text-[15px] leading-[1.6] text-e26-text-2 mb-6 flex-1">
                  90 phút ngồi xuống cùng nhau, khi bạn đang ở một điểm gãy và cần nhìn thẳng
                  vào thứ đang giữ mình lại.
                </p>
                <Link
                  href="/lang-90"
                  className="font-sans text-[14px] text-e26-text underline underline-offset-4 decoration-e26-border hover:text-e26-gold-deep hover:decoration-e26-gold transition-colors duration-300"
                >
                  Tìm hiểu Lặng 90&apos;
                </Link>
              </div>

              {/* Thẻ 2 — Dấu Ấn Của Bạn, PREVIEW (link thật, chưa mở bán) */}
              <div className="bg-e26-white border border-e26-border p-8 flex flex-col">
                <p className="font-sans text-xs tracking-[0.08em] uppercase text-e26-text-2 mb-3">
                  Xem trước
                </p>
                <h3 className="font-serif text-xl text-e26-text mb-4">Dấu Ấn Của Bạn</h3>
                <p className="font-sans text-[15px] leading-[1.6] text-e26-text-2 mb-6 flex-1">
                  Một bản đồ sâu hơn về cách bạn được định hình — dành cho lúc bạn muốn hiểu
                  mình kỹ, không phải lúc đang gấp.
                </p>
                <Link
                  href="/dau-an-cua-ban"
                  className="font-sans text-[14px] text-e26-text underline underline-offset-4 decoration-e26-border hover:text-e26-gold-deep hover:decoration-e26-gold transition-colors duration-300"
                >
                  Xem trước ấn phẩm
                </Link>
              </div>

              {/* Thẻ 3 — Bạn Là Duy Nhất, PREVIEW (link thật, chưa mở bán) */}
              <div className="bg-e26-white border border-e26-border p-8 flex flex-col">
                <p className="font-sans text-xs tracking-[0.08em] uppercase text-e26-text-2 mb-3">
                  Xem trước
                </p>
                <h3 className="font-serif text-xl text-e26-text mb-4">Bạn Là Duy Nhất</h3>
                <p className="font-sans text-[15px] leading-[1.6] text-e26-text-2 mb-6 flex-1">
                  Bước khởi đầu nhẹ để bắt đầu nhìn lại chính mình.
                </p>
                <Link
                  href="/ban-la-duy-nhat"
                  className="font-sans text-[14px] text-e26-text underline underline-offset-4 decoration-e26-border hover:text-e26-gold-deep hover:decoration-e26-gold transition-colors duration-300"
                >
                  Xem trước ấn phẩm
                </Link>
              </div>
            </div>

            <p className="font-sans text-sm text-e26-text-2 mt-10 max-w-2xl">
              Mỗi cửa mở ra một độ sâu khác nhau. Bạn không cần đi hết — chỉ cần đúng cửa cho
              hôm nay.
            </p>
          </div>
        </section>

        {/* 4 — RANH GIỚI (dark silence section duy nhất) */}
        <section className="bg-e26-black px-6 py-24 md:py-[180px]">
          <div className="max-w-[640px] mx-auto text-center">
            <div className="w-12 h-px bg-e26-gold mx-auto mb-14" aria-hidden="true" />
            <h2 className="font-serif font-normal text-[28px] md:text-[40px] text-e26-text-dark mb-14">
              Điều Essence không làm
            </h2>
            <div className="space-y-7 font-sans text-[17px] leading-[1.8] text-e26-text-dark text-left md:text-center max-w-xl mx-auto">
              <p>
                Essence là coaching — không phải chăm sóc sức khỏe tinh thần chuyên môn, không
                chẩn đoán, không hứa thay đổi nhanh, không đoán trước tương lai.
              </p>
              <p>
                Nếu bạn đang trong khủng hoảng cấp tính, điều cần trước tiên là chuyên gia tâm
                lý lâm sàng — và tôi sẽ nói thẳng điều đó.
              </p>
            </div>
          </div>
        </section>

        {/* 5 — CTA (đúng 1 nút vàng) */}
        <section className="max-w-[720px] mx-auto px-6 py-16 md:py-24 text-center">
          <h2 className="font-serif font-normal text-[26px] md:text-[32px] text-e26-text mb-10">
            Nếu hôm nay bạn đang ở một điểm gãy
          </h2>
          <div className="flex flex-col items-center gap-6">
            <Link
              href="/lang-90"
              className="inline-block bg-e26-gold text-e26-black rounded-none font-sans font-medium text-[13px] tracking-[0.08em] uppercase px-10 py-4 hover:bg-e26-gold-deep hover:text-e26-ivory transition-colors duration-300"
            >
              Ngồi xuống cùng tôi — Lặng 90&apos;
            </Link>
            <Link
              href="/phuong-phap"
              className="font-sans text-[15px] text-e26-text-2 underline underline-offset-4 decoration-e26-border hover:text-e26-gold-deep hover:decoration-e26-gold transition-colors duration-300"
            >
              Chưa chắc cửa nào? Đọc về phương pháp
            </Link>
          </div>
        </section>
      </main>
      <HomeFooter />
    </>
  );
}

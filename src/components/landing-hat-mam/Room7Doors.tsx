// ============================================================
// PHÒNG 7 — CỬA RA (Section 16 trên 7 tuổi + Section 17 CTA cuối
// + Section 18 cánh cửa sau này + Footer signature)
// Nhịp màu: S16 ivory → S17 cream → S18 ivory → Footer đen.
// S17: nút vàng thứ 3/3 (tối đa 3 toàn trang, mỗi viewport một).
// S18: "Phân Tích 2 Lớp" chưa có route — render text nhẹ, KHÔNG link mạnh
// tới route chưa tồn tại (đổi thành Link khi trang mở).
// Footer signature: câu kiệt tác màu gold-accent fade-in chậm 1.2s.
// Copy nguyên văn docs/product/landing-hat-mam-v3-copy.md.
// ============================================================

const STAGES = [
  {
    stage: "0–7 tuổi",
    name: "Bản Sắc Hạt Mầm",
    focus: "Nhịp điệu riêng, cảm xúc đầu đời, cảm giác an toàn",
  },
  {
    stage: "7–14 tuổi",
    name: "Bản Sắc Khám Phá",
    focus: "Học tập, bạn bè, tự tin, thói quen, bước vào thế giới học đường",
  },
  {
    stage: "14–21 tuổi",
    name: "Bản Sắc Giao Mùa",
    focus: "Bản sắc riêng, tự do, định hướng, khoảng cách với ba mẹ, bước vào đời",
  },
];

export default function Room7Doors() {
  return (
    <>
      {/* --- SECTION 16 — NẾU CON BẠN ĐÃ LỚN HƠN 7 TUỔI --- */}
      <section className="bg-e26-ivory px-6 py-16 md:py-32">
        <div className="max-w-[720px] mx-auto">
          <h2 className="hm-reveal font-serif font-normal text-[28px] md:text-[38px] leading-tight text-e26-text mb-10">
            Mỗi giai đoạn cần một cách đọc khác nhau
          </h2>
          <div className="font-sans text-[17px] leading-[1.75] text-e26-text-2 space-y-5 mb-10">
            <p className="hm-reveal">
              Phiên bản trên trang này được viết sâu cho giai đoạn 0–7 tuổi — những năm đầu đời,
              khi con hình thành Nhịp điệu riêng, cảm giác an toàn và cách phản ứng cảm xúc đầu
              tiên.
            </p>
            <p className="hm-reveal">Nhưng Bản Sắc không dùng một khuôn cho mọi đứa trẻ.</p>
            <p className="hm-reveal">
              Mỗi bảy năm trong đời con mở ra một câu hỏi phát triển khác — nên được đọc bằng một
              ngôn ngữ khác.
            </p>
          </div>

          {/* Bảng 3 giai đoạn — hairline, không trang trí */}
          <div className="hm-reveal overflow-x-auto mb-10">
            <table className="w-full text-left font-sans text-[15px] leading-[1.6]">
              <thead>
                <tr className="border-b border-e26-border">
                  <th className="font-medium text-e26-text py-3 pr-4">Giai đoạn</th>
                  <th className="font-medium text-e26-text py-3 pr-4">Tên phiên bản</th>
                  <th className="font-medium text-e26-text py-3">Trọng tâm</th>
                </tr>
              </thead>
              <tbody className="text-e26-text-2">
                {STAGES.map((s, i) => (
                  <tr key={i} className="border-b border-e26-border">
                    <td className="py-3 pr-4 whitespace-nowrap">{s.stage}</td>
                    <td className="py-3 pr-4 whitespace-nowrap font-medium text-e26-text">
                      {s.name}
                    </td>
                    <td className="py-3">{s.focus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="font-sans text-[17px] leading-[1.75] text-e26-text-2 space-y-5 mb-10">
            <p className="hm-reveal">
              Nếu con bạn đã lớn hơn 7 tuổi, Kenji vẫn viết Bản Sắc theo đúng giai đoạn hiện tại
              của con.
            </p>
            <p className="hm-reveal text-e26-text">
              Không có giai đoạn nào là quá muộn để bắt đầu hiểu con.
            </p>
            <p className="hm-reveal">
              Đôi khi, chỉ một lần ba mẹ nhìn con khác đi, cả mối quan hệ đã bắt đầu thở lại.
            </p>
          </div>

          <div className="hm-reveal">
            <a
              href="mailto:contact@coachkenjipham.com?subject=B%E1%BA%A3n%20S%E1%BA%AFc%20cho%20con%20tr%C3%AAn%207%20tu%E1%BB%95i"
              className="inline-block border border-e26-text text-e26-text rounded-none font-sans font-medium text-[13px] tracking-[0.08em] uppercase px-9 py-4 hover:border-e26-gold-deep hover:text-e26-gold-deep transition-colors duration-300"
            >
              Tôi muốn hỏi về Bản Sắc cho con trên 7 tuổi
            </a>
          </div>
        </div>
      </section>

      {/* --- SECTION 17 — CTA CUỐI --- */}
      <section className="bg-e26-cream px-6 py-20 md:py-36">
        <div className="max-w-[620px] mx-auto text-center">
          <h2 className="hm-reveal font-serif font-normal text-[28px] md:text-[42px] leading-tight text-e26-text mb-8">
            Hãy bắt đầu bằng việc nhìn thấy con
          </h2>
          <div className="font-sans text-[17px] leading-[1.75] text-e26-text-2 space-y-4 mb-12">
            <p className="hm-reveal">
              Nếu con đang ở những năm đầu đời, đây là lúc rất đẹp để bắt đầu nhìn con rõ hơn.
            </p>
            <p className="hm-reveal">Đừng vội sửa con.</p>
            <p className="hm-reveal text-e26-text">Hãy bắt đầu bằng việc nhìn thấy con.</p>
          </div>
          <div className="hm-reveal">
            <a
              href="#hai-goi"
              className="inline-block bg-e26-gold text-e26-black rounded-none font-sans font-medium text-[13px] tracking-[0.08em] uppercase px-9 py-4 hover:bg-e26-gold-deep hover:text-e26-ivory transition-colors duration-300"
            >
              Mở cuốn sách của con
            </a>
          </div>
        </div>
      </section>

      {/* --- SECTION 18 — CÁNH CỬA SAU NÀY --- */}
      <section className="bg-e26-ivory px-6 py-16 md:py-32">
        <div className="max-w-[620px] mx-auto">
          <h2 className="hm-reveal font-serif font-normal text-[28px] md:text-[38px] leading-tight text-e26-text mb-10">
            Khi ba mẹ bắt gặp chính mình trong câu chuyện của con
          </h2>
          <div className="font-sans text-[17px] leading-[1.75] text-e26-text-2 space-y-5">
            <p className="hm-reveal">Một điều nhỏ tôi hay thấy:</p>
            <p className="hm-reveal">
              Nhiều ba mẹ đọc Bản Sắc của con xong, lại lặng đi một lúc — vì bắt gặp chính mình
              trong đó.
            </p>
            <div className="hm-reveal border-l border-e26-border pl-6 space-y-3 font-serif italic text-lg text-e26-text">
              <p>&ldquo;Sao mình lại khó chịu với đúng tính này của con?&rdquo;</p>
              <p>&ldquo;Sao mình sợ con thất bại đến vậy?&rdquo;</p>
              <p>
                &ldquo;Sao mình cứ muốn con mạnh mẽ, trong khi thật ra mình đang sợ con tổn
                thương?&rdquo;
              </p>
            </div>
            <p className="hm-reveal">
              Khi ngày đó đến, có một cánh cửa khác đang chờ:
              <br />
              đọc lại bản sắc của chính mình.
            </p>
            <p className="hm-reveal">Nhưng đó là chuyện của sau này.</p>
            <p className="hm-reveal text-e26-text">Bây giờ, hãy cứ bắt đầu từ con.</p>
            {/* Route Phân Tích 2 Lớp chưa tồn tại — giữ dạng text nhẹ, đổi thành Link khi trang mở */}
            <p className="hm-reveal font-sans text-[15px] text-e26-text-2 pt-2">
              Tìm hiểu Phân Tích 2 Lớp — Bản Sắc của chính ba mẹ &rarr;
            </p>
          </div>
        </div>
      </section>

      {/* --- FOOTER SIGNATURE --- */}
      <footer className="bg-e26-black px-6 py-20 md:py-28">
        <div className="max-w-[720px] mx-auto text-center">
          <p className="hm-reveal hm-reveal-slow font-serif italic text-2xl md:text-3xl leading-relaxed text-e26-gold mb-10">
            Câu chuyện cuộc sống của bạn là một kiệt tác.
          </p>
          <p className="hm-reveal hm-d1 font-sans text-sm text-e26-text-dark">— Kenji Phạm</p>
          <p className="hm-reveal hm-d1 font-sans text-sm text-e26-text-dark-2 mb-8">
            Essence Coach
          </p>
          <p className="hm-reveal hm-d2 font-sans text-xs text-e26-text-dark-2">
            Liên hệ:{" "}
            <a
              href="mailto:contact@coachkenjipham.com"
              className="text-e26-text-dark hover:text-e26-gold transition-colors duration-300"
            >
              contact@coachkenjipham.com
            </a>
          </p>
        </div>
      </footer>
    </>
  );
}

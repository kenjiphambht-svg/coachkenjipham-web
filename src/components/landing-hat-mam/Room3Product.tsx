import { IconSeedling, IconMagnifier, IconLeafSeason } from "./icons";

// ============================================================
// PHÒNG 3 — HIỂU SẢN PHẨM (Section 4 là gì + Section 5 ba mùa + Section 6 vì sao 0–7)
// Nhịp màu: S4 cream → S5 ivory → S6 cream. KHÔNG section đen nào nữa.
// S5: 3 card hairline, card Hạt Mầm nổi nhất, 2 card kia "Sắp mở";
// icon line-art 1.5px gold-accent tự vẽ (mầm cây / kính lúp / lá chuyển mùa).
// Copy nguyên văn docs/product/landing-hat-mam-v3-copy.md.
// ============================================================
export default function Room3Product() {
  return (
    <>
      {/* --- SECTION 4 — BẢN SẮC HẠT MẦM LÀ GÌ --- */}
      <section className="bg-e26-cream px-6 py-16 md:py-32">
        <div className="max-w-[620px] mx-auto">
          <h2 className="hm-reveal font-serif font-normal text-[28px] md:text-[38px] leading-tight text-e26-text mb-10">
            Một cuốn sách. Chỉ viết về một đứa trẻ.
          </h2>
          <div className="font-sans text-[17px] leading-[1.75] text-e26-text-2 space-y-5">
            <p className="hm-reveal">
              Bản Sắc Hạt Mầm là một ấn phẩm khoảng 30 trang, gồm 5 chương, được viết riêng cho
              con bạn — từ ngày sinh, giờ sinh và bối cảnh đời sống thật của con.
            </p>
            <p className="hm-reveal text-e26-text">
              Không có cuốn nào giống cuốn nào.
              <br />
              Vì không có đứa trẻ nào giống đứa trẻ nào.
            </p>
            <p className="hm-reveal">Tôi không viết để kết luận con là ai.</p>
            <p className="hm-reveal">
              Tôi viết để ba mẹ bắt đầu lắng nghe con đang trở thành ai.
            </p>
            <p className="hm-reveal">Bản Sắc không dạy ba mẹ cách làm cha mẹ.</p>
            <p className="hm-reveal text-e26-text">
              Nó giúp ba mẹ đọc được cuốn sách quý nhất đời mình:
              <br />
              chính là con.
            </p>
          </div>
        </div>
      </section>

      {/* --- SECTION 5 — BA MÙA PHÁT TRIỂN CỦA CON --- */}
      <section className="bg-e26-ivory px-6 py-16 md:py-32">
        <div className="max-w-[1040px] mx-auto">
          <div className="max-w-[620px] mb-14">
            <h2 className="hm-reveal font-serif font-normal text-[28px] md:text-[38px] leading-tight text-e26-text mb-8">
              Mỗi bảy năm, con mở ra một câu hỏi mới
            </h2>
            <div className="font-sans text-[17px] leading-[1.75] text-e26-text-2 space-y-5">
              <p className="hm-reveal">Bản Sắc Của Con được viết theo nhịp phát triển 7 năm.</p>
              <p className="hm-reveal">
                Vì một em bé 5 tuổi không cần được hiểu giống một đứa trẻ 12 tuổi.
                <br />
                Và một người trẻ 16 tuổi không thể được thương bằng cùng cách của một đứa trẻ lên 3.
              </p>
              <p className="hm-reveal text-e26-text">
                Mỗi giai đoạn trong đời con có một ngôn ngữ riêng.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-10 md:gap-8">
            {/* Card Hạt Mầm — nổi nhất */}
            <div className="hm-reveal border-t border-e26-gold pt-8">
              <span className="text-e26-gold">
                <IconSeedling />
              </span>
              <p className="font-sans text-xs tracking-[0.08em] uppercase text-e26-gold-deep mt-6 mb-3">
                Đang mở
              </p>
              <h3 className="font-serif text-2xl text-e26-text mb-1">Bản Sắc Hạt Mầm</h3>
              <p className="font-sans text-[15px] font-medium text-e26-text mb-4">0–7 tuổi</p>
              <p className="font-sans text-[15px] leading-[1.65] text-e26-text-2">
                Giai đoạn của Nhịp điệu riêng, cảm xúc đầu đời, cảm giác an toàn và những hạt mầm
                tài năng đầu tiên.
              </p>
            </div>

            {/* Card Khám Phá — "Sắp mở" */}
            <div className="hm-reveal hm-d1 border-t border-e26-border pt-8">
              <span className="text-e26-gold">
                <IconMagnifier />
              </span>
              <p className="font-sans text-xs text-e26-text-2 mt-6 mb-3">Sắp mở</p>
              <h3 className="font-serif text-2xl text-e26-text-2 mb-1">Bản Sắc Khám Phá</h3>
              <p className="font-sans text-[15px] text-e26-text-2 mb-4">7–14 tuổi</p>
              <p className="font-sans text-[15px] leading-[1.65] text-e26-text-2">
                Học tập, bạn bè, tự tin, thói quen, bước vào thế giới học đường.
              </p>
            </div>

            {/* Card Giao Mùa — "Sắp mở" */}
            <div className="hm-reveal hm-d2 border-t border-e26-border pt-8">
              <span className="text-e26-gold">
                <IconLeafSeason />
              </span>
              <p className="font-sans text-xs text-e26-text-2 mt-6 mb-3">Sắp mở</p>
              <h3 className="font-serif text-2xl text-e26-text-2 mb-1">Bản Sắc Giao Mùa</h3>
              <p className="font-sans text-[15px] text-e26-text-2 mb-4">14–21 tuổi</p>
              <p className="font-sans text-[15px] leading-[1.65] text-e26-text-2">
                Bản sắc riêng, tự do, định hướng, khoảng cách với ba mẹ, bước vào đời.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 6 — VÌ SAO 0–7 LÀ HẠT MẦM --- */}
      <section className="bg-e26-cream px-6 py-16 md:py-32">
        <div className="max-w-[620px] mx-auto">
          <h2 className="hm-reveal font-serif font-normal text-[28px] md:text-[38px] leading-tight text-e26-text mb-10">
            Bảy năm đầu đời chỉ đi qua một lần
          </h2>
          <div className="font-sans text-[17px] leading-[1.75] text-e26-text-2 space-y-5">
            <p className="hm-reveal">Bảy năm đầu đời, con chưa biết gọi tên cảm xúc của mình.</p>
            <p className="hm-reveal font-serif italic text-xl leading-[1.7] text-e26-text">
              Con nói bằng tiếng khóc,
              <br />
              bằng cái nhăn mặt,
              <br />
              bằng sự bướng bỉnh,
              <br />
              bằng những im lặng rất nhỏ.
            </p>
            <p className="hm-reveal">
              Đây là giai đoạn con hình thành cảm giác an toàn, Cá tính nguyên bản, và cách con
              cảm nhận thế giới — trước cả khi con bước vào lớp 1.
            </p>
            <p className="hm-reveal">
              Hiểu con ở giai đoạn này không phải để đi trước con một bước.
            </p>
            <p className="hm-reveal text-e26-text">Mà để đi cùng con.</p>
            <p className="hm-reveal">
              Bớt đoán.
              <br />
              Bớt lo.
              <br />
              Bớt phản ứng từ sợ hãi.
            </p>
            <p className="hm-reveal">
              Con chỉ đi qua bảy năm đầu đời một lần.
              <br />
              Không có nút tua lại.
            </p>
            <p className="hm-reveal">Nhưng cũng không cần hoảng.</p>
            <p className="hm-reveal">
              Chỉ cần hôm nay, ba mẹ bắt đầu nhìn con chậm hơn một chút, dịu hơn một chút, thật
              hơn một chút.
            </p>
            <p className="hm-reveal text-e26-text">Đó đã là một khởi đầu rất đẹp.</p>
          </div>
        </div>
      </section>
    </>
  );
}

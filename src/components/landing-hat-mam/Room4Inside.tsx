import MockupSlot from "./MockupSlot";
import { IconSeed, IconWaves, IconFlag, IconFlower, IconLetter } from "./icons";

// ============================================================
// PHÒNG 4 — BÊN TRONG ẤN PHẨM (Section 7 năm chương + Section 8 preview + Section 9 cách đọc)
// Nhịp màu: S7 ivory → S8 cream → S9 ivory. 5 icon chương line-art gold.
// S8: 3 slot mockup so le, placeholder cream + hairline vàng chờ bản DUMMY web-ready —
// TUYỆT ĐỐI không dùng ảnh trang thật của khách.
// Copy nguyên văn docs/product/landing-hat-mam-v3-copy.md.
// ============================================================

const CHAPTERS = [
  {
    icon: IconSeed,
    title: "Chương 1 — Hạt mầm",
    body: "Nhịp điệu riêng bẩm sinh và cá tính riêng của con.",
    after:
      "Sau chương này, ba mẹ sẽ hiểu con cần được tiếp cận bằng sự dịu dàng, nhịp điệu, tự do hay cấu trúc nhiều hơn.",
  },
  {
    icon: IconWaves,
    title: "Chương 2 — 0–2 tuổi: Thế giới qua lăng kính của con",
    body: "“Ăng-ten cảm xúc” của con và những cơn quấy khóc tưởng như vô lý.",
    after:
      "Sau chương này, ba mẹ sẽ biết điều gì dễ làm con quá tải, điều gì giúp con thấy an toàn, và cách ôm giữ cảm xúc của con mà không hoảng.",
  },
  {
    icon: IconFlag,
    title: "Chương 3 — 2–4 tuổi: Ý chí độc lập của con",
    body: "Giai đoạn con bắt đầu khẳng định mình, thử ranh giới, nói “không”, đòi tự làm và muốn được công nhận.",
    after:
      "Sau chương này, ba mẹ sẽ phân biệt đâu là bướng bỉnh cần được uốn nắn, đâu là cá tính cần được tôn trọng.",
  },
  {
    icon: IconFlower,
    title: "Chương 4 — 4–7 tuổi: Đóa hoa của con và khu vườn xã hội",
    body: "Tài năng chớm nở, cách con bước ra thế giới ngoài gia đình, cách con chơi, học, kết nối và chuẩn bị vào lớp 1.",
    after:
      "Sau chương này, ba mẹ sẽ thấy hạt mầm của con dễ tỏa sáng qua điều gì — ngôn ngữ, vận động, quan sát, cảm xúc, tưởng tượng, kết nối hay dẫn dắt.",
  },
  {
    icon: IconLetter,
    title: "Chương 5 — Lời hồi đáp từ tương lai",
    body: "Một bức thư từ con của tương lai, khi con bước qua tuổi thứ bảy.",
    after:
      "Đây là chương để đọc thật chậm.\nCó thể sẽ có một khoảnh khắc ba mẹ lặng đi.\nVì chương này không nói về kỹ thuật nuôi dạy.\nNó nhắc ba mẹ nhớ vì sao mình bắt đầu hành trình làm cha mẹ.",
  },
];

export default function Room4Inside() {
  return (
    <>
      {/* --- SECTION 7 — NĂM CHƯƠNG TRONG ẤN PHẨM --- */}
      <section className="bg-e26-ivory px-6 py-16 md:py-32">
        <div className="max-w-[720px] mx-auto">
          <h2 className="hm-reveal font-serif font-normal text-[28px] md:text-[38px] leading-tight text-e26-text mb-14">
            Năm chương — một hành trình nhìn con
          </h2>
          <div className="space-y-12">
            {CHAPTERS.map((c, i) => {
              const Icon = c.icon;
              return (
                <div key={i} className="hm-reveal border-t border-e26-border pt-8 md:flex md:gap-8">
                  <span className="text-e26-gold flex-shrink-0 block mb-4 md:mb-0">
                    <Icon />
                  </span>
                  <div>
                    <h3 className="font-serif text-xl md:text-2xl text-e26-text mb-3">{c.title}</h3>
                    <p className="font-sans text-[17px] leading-[1.65] text-e26-text-2 mb-3">
                      {c.body}
                    </p>
                    <p className="font-sans text-[15px] leading-[1.7] text-e26-text-2 whitespace-pre-line">
                      {c.after}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- SECTION 8 — XEM TRƯỚC VÀI TRANG --- */}
      <section className="bg-e26-cream px-6 py-16 md:py-32">
        <div className="max-w-[1040px] mx-auto">
          <div className="max-w-[620px] mb-12">
            <h2 className="hm-reveal font-serif font-normal text-[28px] md:text-[38px] leading-tight text-e26-text mb-8">
              Nhìn thử trước khi tin
            </h2>
            <p className="hm-reveal font-sans text-[17px] leading-[1.65] text-e26-text-2 mb-6">
              Một cuốn sách viết riêng cho con thì nên được nhìn thấy, không chỉ được kể lại.
            </p>
            <p className="hm-reveal font-sans text-[17px] leading-[1.65] text-e26-text-2">
              Dưới đây là vài trang mẫu đã ẩn thông tin riêng của bé:
            </p>
            <ul className="hm-reveal font-sans text-[15px] leading-[1.8] text-e26-text-2 mt-4 space-y-1">
              <li>Trang bìa</li>
              <li>Trang mục lục</li>
              <li>Một đoạn phân tích mẫu</li>
              <li>Một trang &ldquo;Gợi ý cho ba mẹ&rdquo;</li>
              <li>Một trang &ldquo;Lời hồi đáp từ tương lai&rdquo;</li>
            </ul>
          </div>

          {/* 3 slot mockup so le — chờ bản dummy web-ready */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-10 items-start mb-12">
            <div className="hm-reveal max-w-[240px] mx-auto sm:mx-0 w-full">
              <MockupSlot />
            </div>
            <div className="hm-reveal hm-d1 max-w-[240px] mx-auto sm:mx-0 w-full sm:translate-y-10">
              <MockupSlot />
            </div>
            <div className="hm-reveal hm-d2 max-w-[240px] mx-auto sm:mx-0 w-full sm:translate-y-4">
              <MockupSlot />
            </div>
          </div>

          <div className="max-w-[620px]">
            <p className="hm-reveal font-sans text-[17px] leading-[1.65] text-e26-text-2 mb-4">
              Mỗi trang chỉ là một phần nhỏ.
            </p>
            <p className="hm-reveal font-sans text-[17px] leading-[1.65] text-e26-text">
              Nhưng đủ để ba mẹ cảm được tinh thần của ấn phẩm:
              <br />
              riêng tư, chậm, sâu và được viết cho một đứa trẻ thật.
            </p>
          </div>
        </div>
      </section>

      {/* --- SECTION 9 — CÁCH ĐỌC BẢN SẮC CÙNG CON --- */}
      <section className="bg-e26-ivory px-6 py-16 md:py-32">
        <div className="max-w-[620px] mx-auto">
          <h2 className="hm-reveal font-serif font-normal text-[28px] md:text-[38px] leading-tight text-e26-text mb-10">
            Đọc chậm — như một buổi tối yên bên con
          </h2>
          <div className="font-sans text-[17px] leading-[1.75] text-e26-text-2 space-y-5">
            <p className="hm-reveal">Bản Sắc không phải một file để lướt qua.</p>
            <p className="hm-reveal">
              Tôi mong ba mẹ mở nó ra như mở một buổi tối dành riêng cho con — không vội, không ồn.
            </p>
            <p className="hm-reveal font-serif italic text-xl leading-[1.7] text-e26-text">
              Pha một tách trà.
              <br />
              Chờ con ngủ.
              <br />
              Đọc từng chương một.
            </p>
            <p className="hm-reveal text-e26-text">Đón nhận, thay vì kỳ vọng.</p>
            <p className="hm-reveal">
              Đọc để hiểu con đang là ai — không phải để xác nhận con có giống hình ảnh mình từng
              mong hay không.
            </p>
            <p className="hm-reveal">Sau mỗi chương, ba mẹ có thể viết lại đôi dòng:</p>
            <div className="hm-reveal border-l border-e26-border pl-6 space-y-2">
              <p>&ldquo;Mình vừa hiểu thêm điều gì về con?&rdquo;</p>
              <p>&ldquo;Mình đã từng hiểu lầm con ở đâu?&rdquo;</p>
              <p>&ldquo;Mình muốn thử thay đổi một điều nhỏ nào trong cách đồng hành?&rdquo;</p>
            </div>
            <p className="hm-reveal">Một file PDF thì người ta đọc lướt rồi quên.</p>
            <p className="hm-reveal text-e26-text">
              Còn Bản Sắc — nếu được mở ra đúng cách — là một khoảnh khắc ba mẹ thật sự trở về
              bên con.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

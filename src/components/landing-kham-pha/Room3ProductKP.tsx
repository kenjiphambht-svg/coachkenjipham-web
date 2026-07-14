import { IconSeed, IconWaves, IconFlower, IconFlag, IconLetter } from "@/components/landing-hat-mam/icons";

// ============================================================
// PHÒNG 4 — SẢN PHẨM (Là / Không là / 5 chương). Tái dùng pattern
// Room3Product.tsx ("là gì", nền cream) + Room4Inside.tsx (danh sách
// chương có icon, nền ivory) của Hạt Mầm. Copy NGUYÊN VĂN theo task.
// ============================================================

const CHAPTERS = [
  {
    icon: IconSeed,
    title: "1. Khí chất của con ở mùa khám phá",
    body: "Con đang hiểu và cảm thế giới bằng cách nào.",
  },
  {
    icon: IconWaves,
    title: "2. Cách con học",
    body:
      "Con vào bài bằng lời kể, hình ảnh, vận động hay quan sát; vì sao con “lười” môn này mà quên giờ với môn kia.",
  },
  {
    icon: IconFlower,
    title: "3. Điều làm trái tim con mở ra",
    body: "Sở thích, cái đẹp, người mà con âm thầm ngưỡng mộ; thứ nuôi động lực thật của con.",
  },
  {
    icon: IconFlag,
    title: "4. Khi con va vấp",
    body:
      "Điểm kém, bị bạn bỏ rơi, thua cuộc: con thường phản ứng ra sao, và con cần gì từ ba mẹ trong 10 phút đầu tiên.",
  },
  {
    icon: IconLetter,
    title: "5. Lá thư mùa khám phá",
    body:
      "Những lời nhắc dịu để ba mẹ đọc lại vào những hôm khó, và vài câu hỏi để hỏi con thay vì hỏi điểm.",
  },
];

export default function Room3ProductKP() {
  return (
    <>
      {/* --- BẢN SẮC KHÁM PHÁ LÀ GÌ / KHÔNG LÀ GÌ --- */}
      <section id="san-pham" className="bg-e26-cream px-6 py-16 md:py-32 scroll-mt-10">
        <div className="max-w-[620px] mx-auto">
          <h2 className="hm-reveal font-serif font-normal text-[28px] md:text-[38px] leading-tight text-e26-text mb-10">
            Bản Sắc Khám Phá là gì
          </h2>
          <p className="hm-reveal font-sans text-[17px] leading-[1.75] text-e26-text-2 mb-14">
            Một ấn phẩm viết riêng cho con anh chị — bản đồ quan sát về cách con học, cách con
            cảm, điều làm trái tim con mở ra, và điều con cần khi va vấp. Viết từ thông tin ba mẹ
            cung cấp, qua khung quan sát khí chất mà Kenji dùng trong 10 năm làm nghề. Mỗi bản do
            Kenji đích thân đọc và duyệt trước khi gửi.
          </p>

          <h3 className="hm-reveal font-serif text-xl text-e26-text mb-5">
            Bản Sắc Khám Phá KHÔNG phải là:
          </h3>
          <ul className="hm-reveal space-y-3 font-sans text-[16px] leading-[1.7] text-e26-text-2 border-l border-e26-border pl-6">
            <li>Không phải bài trắc nghiệm xếp con vào một ô tính cách.</li>
            <li>Không chấm điểm con, không xếp hạng con với bất kỳ đứa trẻ nào.</li>
            <li>Không dự đoán tương lai, không phán con &ldquo;sau này sẽ thế nào&rdquo;.</li>
            <li>Không phải công cụ để uốn con theo hình ba mẹ muốn.</li>
            <li>Không thay thế chuyên môn tâm lý khi con thật sự cần hỗ trợ chuyên sâu.</li>
          </ul>
        </div>
      </section>

      {/* --- BÊN TRONG ẤN PHẨM — 5 CHƯƠNG --- */}
      <section className="bg-e26-ivory px-6 py-16 md:py-32">
        <div className="max-w-[720px] mx-auto">
          <h2 className="hm-reveal font-serif font-normal text-[28px] md:text-[38px] leading-tight text-e26-text mb-14">
            Bên trong ấn phẩm — 5 chương
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
                    <p className="font-sans text-[17px] leading-[1.65] text-e26-text-2">{c.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

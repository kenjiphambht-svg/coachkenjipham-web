import { IconSeed, IconFlower, IconFlag, IconWaves, IconLetter } from "@/components/landing-hat-mam/icons";

// ============================================================
// PHÒNG 4 — SẢN PHẨM (Là / Không là / 5 chương). Tái dùng pattern
// Room3Product.tsx + Room4Inside.tsx (Hạt Mầm), cùng cách đã dùng cho
// Room3ProductKP.tsx (Khám Phá). Copy NGUYÊN VĂN theo task.
//
// ⚠️ 2 CHỐT ĐẠO ĐỨC bắt buộc giữ nguyên, không rút gọn:
// - "Không đứng về phía ba mẹ để 'xử' con — ấn phẩm đứng về phía mối
//   quan hệ." (bullet Không phải là, thứ 4)
// - Phòng 5 + FAQ #3: khuyến khích ba mẹ nói với con, mời con tham gia
//   tự nguyện từ 15 tuổi.
// ============================================================

const CHAPTERS = [
  {
    icon: IconSeed,
    title: "1. Con đang trở thành ai",
    body: "Khí chất của con trong mùa giao: phần nào đang lớn nhanh, phần nào đang cần thời gian.",
  },
  {
    icon: IconFlower,
    title: "2. Điều con yêu và điều con muốn",
    body:
      "Giá trị đang hình thành phía sau những lựa chọn làm ba mẹ khó hiểu: gu ăn mặc, bạn bè, đam mê, thần tượng.",
  },
  {
    icon: IconFlag,
    title: "3. Ý chí và ranh giới",
    body:
      "Vì sao con phản kháng, con đang tập nói “không” với đời như thế nào, và làm sao để sức bật ấy không phải bật vào ba mẹ.",
  },
  {
    icon: IconWaves,
    title: "4. Khoảng cách đúng",
    body:
      "Gần đủ để con biết có chỗ quay về, xa đủ để con tự tìm mình: những tình huống cụ thể (chọn ngành, tình cảm đầu, giờ giấc) và cách vào chuyện không làm cửa đóng thêm.",
  },
  {
    icon: IconLetter,
    title: "5. Lá thư mùa giao",
    body:
      "Một phần cho ba mẹ, và một trang viết riêng để ba mẹ có thể trao cho con khi cả hai sẵn sàng — như một lời mời trò chuyện, không phải một bài giảng.",
  },
];

export default function Room3ProductGM() {
  return (
    <>
      {/* --- BẢN SẮC GIAO MÙA LÀ GÌ / KHÔNG LÀ GÌ --- */}
      <section id="san-pham" className="bg-e26-cream px-6 py-16 md:py-32 scroll-mt-10">
        <div className="max-w-[620px] mx-auto">
          <h2 className="hm-reveal font-serif font-normal text-[28px] md:text-[38px] leading-tight text-e26-text mb-10">
            Bản Sắc Giao Mùa là gì
          </h2>
          <p className="hm-reveal font-sans text-[17px] leading-[1.75] text-e26-text-2 mb-14">
            Một ấn phẩm viết riêng về người trẻ trong nhà anh chị — bản đồ quan sát về điều con
            đang yêu, điều con đang muốn, cách ý chí và ranh giới của con đang hình thành, và
            khoảng cách mà con thật sự cần từ ba mẹ. Viết từ thông tin ba mẹ (và chính con, nếu
            con muốn) cung cấp. Mỗi bản do Kenji đích thân đọc và duyệt trước khi gửi.
          </p>

          <h3 className="hm-reveal font-serif text-xl text-e26-text mb-5">
            Bản Sắc Giao Mùa KHÔNG phải là:
          </h3>
          <ul className="hm-reveal space-y-3 font-sans text-[16px] leading-[1.7] text-e26-text-2 border-l border-e26-border pl-6">
            <li>Không phải công cụ theo dõi, quản lý hay &ldquo;đọc vị&rdquo; con.</li>
            <li>Không dán nhãn &ldquo;tuổi nổi loạn&rdquo;, không xếp con vào ô tính cách nào.</li>
            <li>Không đoán tương lai, không chọn ngành hộ, không phán con hợp nghề gì.</li>
            <li className="text-e26-text font-medium">
              Không đứng về phía ba mẹ để &ldquo;xử&rdquo; con — ấn phẩm đứng về phía mối quan
              hệ.
            </li>
            <li>
              Không thay thế hỗ trợ chuyên môn nếu con đang trong giai đoạn khủng hoảng thật sự.
            </li>
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

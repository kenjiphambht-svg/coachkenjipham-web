import Image from "next/image";

// ============================================================
// PHÒNG 5 — CON NGƯỜI & QUY TRÌNH (Section 10 Kenji + Section 11 quy trình)
// Nhịp màu: S10 cream → S11 ivory.
// S11: 3 bước timeline ngang desktop / dọc mobile + box bảo mật hairline.
// Dòng "chỉ nhận tối đa 10 ấn phẩm mỗi tháng" nằm trong copy S10 (nguyên văn) —
// cấm mọi biến thể đếm ngược/còn X suất.
// Copy nguyên văn docs/product/landing-hat-mam-v3-copy.md.
// ============================================================
export default function Room5KenjiProcess() {
  return (
    <>
      {/* --- SECTION 10 — KENJI LÀ AI --- */}
      <section className="bg-e26-cream px-6 py-16 md:py-32">
        <div className="max-w-[1040px] mx-auto">
          <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-start">
            <figure className="hm-reveal md:col-span-4">
              <div className="relative w-full aspect-[4/5] overflow-hidden">
                <Image
                  src="/klp.jpg"
                  alt="Kenji Phạm — Essence Coach"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="font-sans text-sm text-e26-text-2 pt-3 pb-3 border-b border-e26-border">
                Kenji Phạm — Essence Coach
              </figcaption>
            </figure>

            <div className="md:col-span-8 max-w-[620px]">
              <h2 className="hm-reveal font-serif font-normal text-[28px] md:text-[38px] leading-tight text-e26-text mb-10">
                Người viết cuốn sách của con
              </h2>
              <div className="font-sans text-[17px] leading-[1.75] text-e26-text-2 space-y-5">
                <p className="hm-reveal text-e26-text">Tôi là Kenji Phạm — Essence Coach.</p>
                <p className="hm-reveal text-e26-text">
                  Nhưng trước khi là một coach, tôi là một người cha.
                </p>
                <p className="hm-reveal">
                  Hơn 16 năm qua, tôi không học cách hiểu trẻ con chỉ từ sách vở.
                </p>
                <p className="hm-reveal">
                  Tôi học từ chính hai đứa con trai của mình — một đứa nay mười sáu, một đứa mười
                  hai tuổi.
                </p>
                <p className="hm-reveal">Tôi nuôi các con qua một chặng đường không dễ.</p>
                <p className="hm-reveal">
                  Chúng tôi đã chia tay từ lâu. Nhưng có một điều tôi và mẹ các con chưa từng
                  buông: dù không còn chung một nhà, chúng tôi vẫn chung một việc — để các con
                  lớn lên vẫn có đủ cả cha lẫn mẹ.
                </p>
                <p className="hm-reveal">Có những năm rất vất vả.</p>
                <p className="hm-reveal">
                  Có những lúc tôi nhìn con mà không hiểu con đang nghĩ gì, cần gì, giận gì.
                </p>
                <p className="hm-reveal">
                  Tôi từng đáp lại con bằng sự mệt mỏi của chính mình, rồi sau đó ngồi lặng vì
                  hối tiếc.
                </p>
                <p className="hm-reveal">
                  Chính những năm đó dạy tôi điều mà không lý thuyết nào dạy được:
                </p>
                <blockquote className="hm-reveal border-l border-e26-gold pl-6">
                  <p className="font-serif italic text-xl md:text-2xl leading-[1.6] text-e26-text">
                    Một đứa trẻ không cần cha mẹ hoàn hảo.
                    <br />
                    Con cần được nhìn thấy đúng như con là.
                  </p>
                </blockquote>
                <p className="hm-reveal">
                  Thế giới các con đang lớn lên cũng đã khác xa thời tôi còn nhỏ — công nghệ,
                  mạng, nhịp sống đổi từng năm.
                </p>
                <p className="hm-reveal">
                  Càng nhiều thứ thay đổi, tôi càng thấy rõ một điều không đổi:
                </p>
                <p className="hm-reveal text-e26-text">
                  Thứ một đứa trẻ cần nhất vẫn là được hiểu.
                </p>
                <p className="hm-reveal">
                  Bản Sắc là cách tôi mang những gì mình đã sống, đã sai, đã học được — đặt vào
                  tay những ba mẹ đang đi con đường tôi từng đi.
                </p>
                <p className="hm-reveal">
                  Tôi không viết từ tháp ngà.
                  <br />
                  Tôi viết từ những đêm thật.
                </p>
              </div>

              <div className="hm-reveal border-t border-e26-border mt-10 pt-8">
                <h3 className="font-serif text-xl text-e26-text mb-4">Nền tảng tôi dựa vào</h3>
                <ul className="font-sans text-[15px] leading-[1.7] text-e26-text-2 space-y-2">
                  <li>
                    Tâm lý học chiều sâu và các nguyên mẫu bẩm sinh — được đọc như một ngôn ngữ
                    tâm lý, không phải bói toán
                  </li>
                  <li>Quan sát phát triển cảm xúc theo từng giai đoạn 0–7 tuổi</li>
                  <li>
                    Hơn tám năm đồng hành cùng người trưởng thành trong vai trò coach bản sắc — và
                    làm cha mỗi ngày
                  </li>
                </ul>
              </div>

              <div className="hm-reveal border-t border-e26-border mt-8 pt-8">
                <h3 className="font-serif text-xl text-e26-text mb-4">Giới hạn tôi giữ rõ</h3>
                <div className="font-sans text-[15px] leading-[1.7] text-e26-text-2 space-y-4">
                  <p>
                    Tôi không chẩn đoán.
                    <br />
                    Không dán nhãn.
                    <br />
                    Không thay thế tư vấn y khoa, tâm lý hay trị liệu.
                  </p>
                  <p className="text-e26-text">
                    Bản Sắc là một bản đồ gợi mở, không phải một bản án cố định về con.
                  </p>
                  <p>
                    Vì mỗi ấn phẩm cần được đọc, phân tích, viết lại và biên tập như một bản chân
                    dung riêng, tôi chỉ nhận tối đa{" "}
                    <span className="font-medium text-e26-text">10 ấn phẩm mỗi tháng</span>.
                  </p>
                  <p>
                    Đây không phải sản phẩm tạo hàng loạt.
                    <br />
                    Đây là một bản chân dung cần sự hiện diện.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 11 — QUY TRÌNH NHẬN ẤN PHẨM --- */}
      <section className="bg-e26-ivory px-6 py-16 md:py-32">
        <div className="max-w-[1040px] mx-auto">
          <h2 className="hm-reveal font-serif font-normal text-[28px] md:text-[38px] leading-tight text-e26-text mb-14 max-w-[720px]">
            Ba bước, từ lúc ba mẹ gửi thông tin đến lúc cầm cuốn sách của con
          </h2>

          {/* Timeline: ngang desktop / dọc mobile */}
          <div className="grid md:grid-cols-3 gap-10 md:gap-8 mb-14">
            <div className="hm-reveal border-t border-e26-border pt-6">
              <span className="font-serif font-light text-5xl text-e26-gold leading-none" aria-hidden="true">
                1
              </span>
              <h3 className="font-serif text-xl text-e26-text mt-4 mb-3">Bước 1 — Gửi thông tin</h3>
              <div className="font-sans text-[15px] leading-[1.7] text-e26-text-2 space-y-3">
                <p>Ba mẹ gửi ngày sinh, giờ sinh, nơi sinh của bé.</p>
                <p>
                  Bối cảnh gia đình là phần không bắt buộc, nhưng nếu ba mẹ chia sẻ thêm vài dòng
                  về tính cách, thói quen, điều đang bối rối hoặc một tình huống gần đây của con,
                  ấn phẩm sẽ chạm đời sống thật hơn.
                </p>
                <p>
                  Nếu không nhớ chính xác giờ sinh, ba mẹ vẫn đặt được. Tôi sẽ ghi rõ mức độ chính
                  xác trong phần phân tích.
                </p>
              </div>
            </div>
            <div className="hm-reveal hm-d1 border-t border-e26-border pt-6">
              <span className="font-serif font-light text-5xl text-e26-gold leading-none" aria-hidden="true">
                2
              </span>
              <h3 className="font-serif text-xl text-e26-text mt-4 mb-3">Bước 2 — Tôi đọc và viết</h3>
              <div className="font-sans text-[15px] leading-[1.7] text-e26-text-2 space-y-3">
                <p>Tôi phân tích, chắt lọc và viết riêng từng chương cho con.</p>
                <p>
                  Không dùng mẫu chung.
                  <br />
                  Không tạo hàng loạt.
                  <br />
                  Không copy từ phần mềm.
                </p>
              </div>
            </div>
            <div className="hm-reveal hm-d2 border-t border-e26-border pt-6">
              <span className="font-serif font-light text-5xl text-e26-gold leading-none" aria-hidden="true">
                3
              </span>
              <h3 className="font-serif text-xl text-e26-text mt-4 mb-3">Bước 3 — Trao gửi</h3>
              <div className="font-sans text-[15px] leading-[1.7] text-e26-text-2 space-y-3">
                <p>
                  Ấn phẩm hoàn chỉnh được gửi dưới dạng PDF chất lượng cao qua Email và Zalo trong
                  3–5 ngày làm việc.
                </p>
                <p>Ba mẹ có thể lưu giữ lâu dài hoặc in ra như một kỷ vật của gia đình.</p>
              </div>
            </div>
          </div>

          {/* Box bảo mật */}
          <div className="hm-reveal border border-e26-border bg-e26-white p-8 max-w-[720px]">
            <h3 className="font-serif text-xl text-e26-text mb-3">Bảo mật</h3>
            <p className="font-sans text-[15px] leading-[1.7] text-e26-text-2">
              Thông tin ngày giờ sinh và bối cảnh của bé chỉ được dùng để viết ấn phẩm Bản Sắc —
              không công khai, không chia sẻ cho bên thứ ba.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

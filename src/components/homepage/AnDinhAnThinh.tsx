// Section 7 — An Định → An Thịnh. Dark silence section thứ hai của trang
// (đúng 2 khối tối toàn trang: ④ và ⑦).
// SỬA 20/07/2026 (brief V9-FINAL) — nguồn chữ duy nhất: Google Doc "HOMEPAGE
// V9-FINAL". THAY HẲN cấu trúc PR trước (nhãn "An định → An Thịnh" + câu neo
// tiêu đề "Thì ra thành công không cần đánh đổi bình an." là suy diễn riêng
// của PR trước, KHÔNG có trong Doc — Doc thắng, đã bỏ). Cấu trúc đúng theo
// Doc, một khối hai nhịp:
//   Nhịp 1 (AN ĐỊNH): câu mở → thì thầm (con kiến, Vai 4) → body (Vai 3) →
//     neo "Essence gọi đó là: An định." (nhấn giữa câu, "An định" ~Vai 1,
//     KHÔNG gold) → cầu "An định không phải đích đến..." (dòng nhỏ, Vai 4).
//   Nhịp 2 (AN THỊNH): body (Vai 3) → neo cuối "Essence gọi đó là: An
//     Thịnh." (nhấn giữa câu, "An Thịnh" TO NHẤT section + gold #E0C068 —
//     ĐIỂM VÀNG THỨ 3 toàn trang, Kenji đã duyệt) → câu kết khối, không nút.
// Chữ ma "AN" góc trái trên GIỮ NGUYÊN (quyết định cũ).
// SỬA 20/07/2026 (brief nền vân tường vô hình mobile) — xem ghi chú đầy đủ
// ở KietTac.tsx (③, cùng ảnh bg-wall-dark.webp, cùng vấn đề). Container ⑦
// mobile cao ~1460px (gấp ~3.4 lần ③ ~430px vì nhiều nội dung hơn) → cover
// buộc phóng đại ảnh 2.53x (so với ③ chỉ ~0.75x — gần như không phóng đại).
// Ở mức phóng đại này, opacity 0.13 + vị trí 10% vẫn cho vân tường quá mờ
// (đã chụp ảnh thật kiểm chứng, đúng tinh thần Bước 3 của brief — không chỉ
// tin số đo). Tăng opacity mobile lên 0.20 (dò tăng dần 0.13→0.20, đạt yêu
// cầu ở bước này nên dừng, không cần lên tới trần 0.25) — desktop giữ
// nguyên 0.13 qua md:opacity-[0.13], đã xác nhận computed style desktop
// không đổi so với trước.
export default function AnDinhAnThinh() {
  return (
    <section className="relative bg-e26-black px-6 py-24 md:py-40 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-[position:10%_center] md:bg-center opacity-[0.20] md:opacity-[0.13]"
        style={{ backgroundImage: "url(/images/home/bg-wall-dark.webp)" }}
        aria-hidden="true"
      />
      <span className="andinh-ghost-an absolute top-6 left-6 md:top-10 md:left-10 font-serif" aria-hidden="true">
        AN
      </span>
      <div className="relative max-w-[640px] mx-auto text-center">
        {/* Nhịp 1 — AN ĐỊNH: câu mở (Vai 3) */}
        <p className="e26-reveal font-sans text-[18px] leading-[1.9] text-e26-text-dark-2">
          Rồi một ngày,
          <br />
          bạn nhận ra mình thở khác.
        </p>

        {/* Thì thầm — Vai 4: serif italic nhỏ, opacity ~0.75 (dùng token phụ
            text-dark-2 sẵn có thay vì opacity rời để không xung đột với
            transition opacity của .e26-reveal). */}
        <p className="e26-reveal font-serif italic text-[17px] md:text-[18px] leading-[1.7] text-e26-text-dark-2 mt-8">
          Chỉ là tối đó, sau một quyết định lớn, bạn vẫn ngủ được ngon giấc. Bữa cơm nhà tự
          nhiên bớt căng. Con chạy vào kể một chuyện dài ngoằng về con kiến ngoài sân — lần này
          bạn nghe hết, mỉm cười, rồi mới gọi con đi rửa tay ăn cơm.
        </p>

        {/* Body — Vai 3 */}
        <p className="e26-reveal font-sans text-[18px] leading-[1.9] text-e26-text-dark-2 mt-10">
          Không phải vì cuộc sống dễ hơn.
          <br />
          Mà vì giữa điều xảy ra
          <br />
          và điều mình làm tiếp theo,
          <br />
          đã có một khoảng lặng.
        </p>

        {/* Neo — "An định" nhấn giữa câu: lead Vai 2, "An định" ~Vai 1. */}
        <p className="e26-reveal font-serif font-medium text-[30px] md:text-[42px] leading-[1.25] text-e26-text-dark mt-10">
          Essence gọi đó là:{" "}
          <span className="text-[40px] md:text-[64px] leading-[1.15]">An định.</span>
        </p>

        {/* Cầu — dòng nhỏ, Vai 4 */}
        <p className="e26-reveal font-serif italic text-[17px] md:text-[18px] leading-[1.7] text-e26-text-dark-2 mt-8">
          An định không phải đích đến. Nó là một nền đất.
        </p>

        {/* Nhịp 2 — AN THỊNH: body Vai 3 */}
        <p className="e26-reveal font-sans text-[18px] leading-[1.9] text-e26-text-dark-2 mt-16">
          Thành công,
          <br />
          khi bên trong chưa vững,
          <br />
          rất dễ trở thành gánh nặng.
        </p>
        <p className="e26-reveal font-sans text-[18px] leading-[1.9] text-e26-text-dark-2 mt-6">
          Khi nền đủ vững,
          <br />
          điều đến sau
          <br />
          mới ở lại.
        </p>

        {/* Neo cuối — "An Thịnh" TO NHẤT section + gold #E0C068 (điểm vàng
            thứ 3 toàn trang), thở rộng trên/dưới để câu đứng một mình như
            đích đến. */}
        <p className="e26-reveal font-serif font-medium text-[30px] md:text-[42px] leading-[1.25] text-e26-text-dark mt-16 md:mt-24">
          Essence gọi đó là:{" "}
          <span className="text-e26-gold text-[48px] md:text-[72px] leading-[1.1]">
            An Thịnh.
          </span>
        </p>

        {/* Câu kết khối — không nút, Vai 3. SỬA 20/07/2026 (brief sửa lặp
            từ): "Có những cánh cửa..." → "Không phải cánh cửa nào..." —
            Kenji đã duyệt, sẽ đồng bộ vào Doc V9-FINAL sau. */}
        <p className="e26-reveal font-sans text-[18px] leading-[1.9] text-e26-text-dark-2 mt-16 md:mt-20">
          Không phải cánh cửa nào cũng cần mở ngay.
          <br />
          Chỉ cần biết chúng luôn ở đó.
        </p>
      </div>
    </section>
  );
}

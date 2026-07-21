// Section 4 — Kiệt Tác. H1 DUY NHẤT của trang chủ (theo BAN-CHOT — hero ở
// section 2 KHÔNG được gắn heading, chỉ section này). Nền đen, đứng một mình.
// Nền ảnh /images/home/bg-wall-dark.webp (16:9) — dùng CSS background-image
// (không phải <Image>) để nếu ảnh chưa có, không hiện icon vỡ: nền vẫn là
// khối đen thuần cho tới khi Kenji cung cấp ảnh thật.
// TINH CHỈNH 19/07/2026: độ phủ đen 94% (opacity 0.06) gần như không thấy vân
// tường → giảm còn phủ đen ~87% (opacity 0.13) để vân tường/góc phòng thấp
// thoáng lộ ra, vẫn đủ tối giữ vai "khối tối" (nền vẫn bg-e26-black solid,
// chỉ lớp ảnh trang trí tăng độ hiện — đã đo tương phản chữ trắng vẫn đọc rõ).
// Vệt vàng dưới "kiệt tác" là phần tử thật (span + i), animate scaleX qua
// class .e26-reveal có sẵn — KHÔNG dùng ::after (GSAP/CSS không animate được
// pseudo-element theo lỗi đã biết ghi trong brief).
// SỬA 20/07/2026 (brief V9-FINAL — typography số hoá + nội dung) — nguồn chữ
// duy nhất: Google Doc "HOMEPAGE V9-FINAL". Body đổi từ "…kể cả bạn"/dấu "…"
// (di sản bản cũ) sang đúng nguyên văn Doc: 2 dòng thơ, kết bằng dấu chấm.
// SỬA 21/07/2026 (brief ghép nền hero villa, Bước 3) — đổi câu body theo bản
// Kenji gửi, NGUYÊN VĂN kể cả dấu "…" giữa câu 2 ("Mà vì…bạn đã chưa đọc nó
// đủ chậm."). Không đổi H1, không đổi nền/vệt vàng.
// H1 áp Vai 1 (hệ 5 vai chung toàn trang): 64px desktop / 40px mobile, serif
// weight 500, line-height 1.15 (trước: 52/32, weight 300/light). Body áp
// Vai 3 (18px, sans, lh 1.9) — ③ nằm trong nhóm tăng 1 nấc mobile (③④⑤) nên
// mobile = 18px luôn (không tụt xuống 17px như mặc định Vai 3 ở section khác).
// SỬA 20/07/2026 (brief nền vân tường vô hình mobile) — bg-wall-dark.webp
// (1024×576, 16:9) trên khung mobile dọc hẹp: cover luôn bị chiều CAO ép
// (container mobile hẹp hơn tỉ lệ ảnh rất nhiều), khiến bg-center (50%) rơi
// đúng vào vùng tường phẳng nhất giữa ảnh — gần như vô hình dù opacity đã
// đúng 0.13. Đã dò bằng script mô phỏng phép chiếu cover (sample lưới màu
// composite so với #1A1A1A) + xác nhận lại bằng canvas vẽ đúng ảnh thật
// trong browser: vùng trái ảnh (bright light-strip + nhiều vết nứt) cho độ
// lệch màu cao nhất, đỉnh ở background-position-x ≈ 0-15%. Chọn 10% (an
// toàn, tránh mép sáng ngay biên 0%). CHỈ áp cho mobile (md:bg-center giữ
// nguyên vị trí gốc) — desktop KHÔNG đổi gì, đã xác nhận computed style vẫn
// "50% 50%" / opacity 0.13 y hệt trước. Component AnDinhAnThinh.tsx (⑦)
// cùng ảnh, cùng vấn đề, cùng vị trí X — nhưng KHÁC opacity mobile (xem ghi
// chú ở đó) vì container ⑦ cao gấp ~3.4 lần ③, buộc cover phóng đại ảnh tới
// 2.53x (so với ③ chỉ ~0.75x, gần như không phóng đại) — độ phóng đại lớn
// làm mờ chi tiết vân tường, cần bù thêm opacity mới đạt ngưỡng nhìn thấy
// được bằng mắt (đã xác nhận qua ảnh chụp thật, không chỉ qua số đo).
export default function KietTac() {
  return (
    <section className="relative bg-e26-black px-6 py-24 md:py-32 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-[position:10%_center] md:bg-center opacity-[0.13]"
        style={{ backgroundImage: "url(/images/home/bg-wall-dark.webp)" }}
        aria-hidden="true"
      />
      <div className="relative max-w-[880px] mx-auto text-center">
        <h1 className="e26-reveal font-serif font-medium text-[40px] md:text-[64px] leading-[1.15] text-e26-text-dark">
          Câu chuyện cuộc sống của bạn là một{" "}
          <span className="relative inline-block whitespace-nowrap">
            kiệt tác
            <i aria-hidden="true" className="gold-brush-line e26-reveal" />
          </span>
          .
        </h1>
        <p className="e26-reveal font-sans font-normal text-[18px] leading-[1.9] text-e26-text-dark-2 mt-8 max-w-lg mx-auto">
          Không phải mọi chương đều đẹp.
          <br />
          Mà vì…bạn đã chưa đọc nó đủ chậm.
        </p>
      </div>
    </section>
  );
}

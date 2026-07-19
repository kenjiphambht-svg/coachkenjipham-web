// Section 9 — Ghi chép + Lối ra. Nền ivory.
// SỬA 19/07/2026 — BÀI HỌC TỪ PR #32: opacity nền cũ (0.05) không thấy được
// bằng mắt (đã chụp ảnh production xác nhận, giống lỗi ở ⑧) → tăng lên 0.20
// (cùng mức đã chọn cho ⑧, xem NotPromised.tsx). BỎ HẲN khung (bg-e26-cream +
// padding riêng tạo card/box rõ nét) — chữ đứng trực tiếp trên nền section,
// TRẦN như ⑧. Tổ chức lại 2 PHẦN TÁCH BẠCH bằng khoảng cách dọc lớn (mt-14)
// + divider nhẹ, để mắt phân biệt ngay "đây là Ghi chép, đây là Ebook" dù
// không còn card bao ngoài.
// Đổi chữ Phần B: "nhận cuốn Ebook" → "đọc online cuốn" (Kenji xác nhận nội
// dung sách CHƯA sẵn sàng, hướng tương lai là đọc trên web chứ không phải
// tải file) — bỏ hẳn dòng "Đọc Ebook (sắp mở)" tách biệt cuối cùng, gộp
// "(sắp mở)" ngay vào câu chính, nhất quán cách "Góc Đọc (sắp mở)" đã có.
// Đúng 2 chỗ "(sắp mở)" còn lại theo BAN-CHOT: (1) dòng mô tả Ghi chép, (2)
// "Góc Đọc" + hành động đọc online gộp chung 1 câu. Cả 2 là <span>, KHÔNG
// <Link>/<a>, không href — tránh soft 404 cho trạng thái chưa có nội dung
// thật. Câu kết KHÔNG chứa mệnh lệnh nào cho người đọc (không "hãy quay
// lại"/"bạn cứ về") — chủ đích giữ người đọc ở lại, không tiễn họ ra cửa.
// KHÔNG còn nút vàng (đã bỏ ở PR #32) — đúng 2 điểm vàng toàn trang (vệt ③,
// viền hover ⑤).
export default function NotesTeaser() {
  return (
    <section className="relative bg-e26-ivory px-6 py-16 md:py-28">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.20]"
        style={{ backgroundImage: "url(/images/home/bg-hero-light.webp)" }}
        aria-hidden="true"
      />
      <div className="relative z-10 max-w-2xl mx-auto text-center">
        {/* Phần A — Ghi chép Essence (sắp mở) */}
        <div>
          <p className="e26-reveal font-serif text-2xl text-e26-text mb-3">Ghi chép Essence.</p>
          <span className="e26-reveal block font-sans text-[15px] leading-[1.65] text-e26-text-2 opacity-45 select-none">
            Những bài viết nhỏ đang được ghi lại. (sắp mở)
          </span>
        </div>

        {/* Ranh giới tách bạch 2 phần — khoảng cách dọc lớn thay vai trò khung cũ */}
        <div className="w-10 h-px bg-e26-border mx-auto mt-14 mb-14" aria-hidden="true" />

        {/* Phần B — Ebook, đọc online (sắp mở) */}
        <div>
          <p className="e26-reveal font-sans text-[15px] leading-[1.65] text-e26-text-2">
            Nếu hôm nay bạn chỉ muốn tìm một góc tĩnh lặng, mời bạn ghé{" "}
            <span className="opacity-45 select-none">Góc Đọc (sắp mở)</span>, hoặc{" "}
            <span className="opacity-45 select-none">đọc online</span> cuốn &quot;Bắt Đầu Từ
            Đâu? Bản Sắc Nhân Hiệu&quot;{" "}
            <span className="opacity-45 select-none">(sắp mở)</span>.
          </p>

          <p className="e26-reveal font-sans text-[15px] leading-[1.65] text-e26-text-2 mt-6">
            Cánh cửa luôn mở, và bạn là người tự chọn nhịp đi của mình.
          </p>
        </div>
      </div>
    </section>
  );
}

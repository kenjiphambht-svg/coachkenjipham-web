// Section 9 — Ghi chép + Lối ra. Nền ivory.
// TINH CHỈNH 19/07/2026: tổ chức lại thành HAI PHẦN TÁCH BẠCH rõ ràng (Ghi
// chép Essence / Ebook), phân nhóm bằng khoảng cách + divider nhẹ. BỎ hẳn nút
// vàng "Đọc Ebook Miễn Phí" (bỏ điểm vàng #3 — sau thay đổi này trang còn
// đúng 2 điểm vàng: vệt ③, viền hover ⑤). Thay bằng LINK chữ "Đọc Ebook"
// (bỏ "Miễn Phí") ở trạng thái "sắp mở". Đúng 3 chỗ "(sắp mở)" hiện chữ rõ
// theo BAN-CHOT: (1) dòng mô tả Ghi chép, (2) "Góc Đọc", (3) "Đọc Ebook". Cả
// 3 là <span>, KHÔNG <Link>/<a>, không href — tránh soft 404 cho trạng thái
// chưa có nội dung thật. Câu kết KHÔNG chứa mệnh lệnh nào cho người đọc
// (không "hãy quay lại"/"bạn cứ về") — chủ đích giữ người đọc ở lại, không
// tiễn họ ra cửa.
export default function NotesTeaser() {
  return (
    <section className="relative bg-e26-ivory px-6 py-16 md:py-28">
      {/* Vật liệu nền dùng chung "vệt nắng" (bg-hero-light), opacity rất thấp
          trên nền ivory gốc — cùng kỹ thuật KietTac. z-auto: khối kem bên
          dưới nâng "relative z-10" để không bị lớp nền này phủ lên. */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.05]"
        style={{ backgroundImage: "url(/images/home/bg-hero-light.webp)" }}
        aria-hidden="true"
      />
      {/* Khối cuối trước footer đen — kem đậm NHẸ (e26-cream, nhẹ hơn cream-deep
          của ③⑥ một bậc) vì không cần tương phản mạnh bằng các khối trên. */}
      <div className="relative z-10 max-w-2xl mx-auto text-center bg-e26-cream px-8 py-14 md:px-16 md:py-16">
        {/* Phần 1 — Ghi chép Essence (sắp mở) */}
        <div>
          <p className="e26-reveal font-serif text-2xl text-e26-text mb-3">Ghi chép Essence.</p>
          <span className="e26-reveal block font-sans text-[15px] leading-[1.65] text-e26-text-2 opacity-45 select-none">
            Những bài viết nhỏ đang được ghi lại. (sắp mở)
          </span>
        </div>

        {/* Ranh giới tách bạch 2 phần */}
        <div className="w-10 h-px bg-e26-border mx-auto my-8" aria-hidden="true" />

        {/* Phần 2 — Ebook (sắp mở) */}
        <div>
          <p className="e26-reveal font-sans text-[15px] leading-[1.65] text-e26-text-2">
            Nếu hôm nay bạn chỉ muốn tìm một góc tĩnh lặng, mời bạn ghé{" "}
            <span className="opacity-45 select-none">Góc Đọc (sắp mở)</span>, hoặc nhận cuốn
            Ebook &quot;Bắt Đầu Từ Đâu? Bản Sắc Nhân Hiệu&quot;{" "}
            <span className="opacity-45 select-none">(sắp mở)</span>.
          </p>

          <p className="e26-reveal font-sans text-[15px] leading-[1.65] text-e26-text-2 mt-6">
            Cánh cửa luôn mở, và bạn là người tự chọn nhịp đi của mình.
          </p>

          <span
            className="e26-reveal inline-block mt-6 font-sans text-[15px] text-e26-text-2 opacity-45 select-none cursor-default underline-offset-4 decoration-e26-text-2"
            aria-hidden="true"
          >
            Đọc Ebook (sắp mở)
          </span>
        </div>
      </div>
    </section>
  );
}

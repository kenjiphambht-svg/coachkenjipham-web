// Section 9 — Ghi chép + Lối ra. Nền ivory. Đúng 3 chỗ "sắp mở" theo
// BAN-CHOT: (1) dòng mô tả Ghi chép, (2) cụm "Góc Đọc", (3) nút Ebook.
// Cả 3 là <span>, KHÔNG <Link>/<a>, không href — tránh soft 404 cho trạng
// thái chưa có nội dung thật. Câu kết KHÔNG chứa mệnh lệnh nào cho người
// đọc (không "hãy quay lại"/"bạn cứ về") — chủ đích giữ người đọc ở lại,
// không tiễn họ ra cửa.
export default function NotesTeaser() {
  return (
    <section className="bg-e26-ivory px-6 py-16 md:py-28">
      {/* Khối cuối trước footer đen — kem đậm NHẸ (e26-cream, nhẹ hơn cream-deep
          của ③⑥ một bậc) vì không cần tương phản mạnh bằng các khối trên. Giữ
          nguyên 3 chỗ "sắp mở", câu kết, vị trí nút. */}
      <div className="max-w-2xl mx-auto text-center bg-e26-cream px-8 py-14 md:px-16 md:py-16">
        <p className="e26-reveal font-serif text-2xl text-e26-text mb-3">Ghi chép Essence.</p>
        <span className="e26-reveal block font-sans text-[15px] leading-[1.65] text-e26-text-2 opacity-45 select-none">
          Những bài viết nhỏ đang được ghi lại.
        </span>

        <p className="e26-reveal font-sans text-[15px] leading-[1.65] text-e26-text-2 mt-8">
          Nếu hôm nay bạn chỉ muốn tìm một góc tĩnh lặng, mời bạn ghé{" "}
          <span className="opacity-45 select-none">Góc Đọc</span>, hoặc nhận miễn phí cuốn
          Ebook &quot;Bắt Đầu Từ Đâu? Bản Sắc Nhân Hiệu&quot;.
        </p>

        <p className="e26-reveal font-sans text-[15px] leading-[1.65] text-e26-text-2 mt-6">
          Cánh cửa luôn mở, và bạn là người tự chọn nhịp đi của mình.
        </p>

        <span
          className="e26-reveal inline-block mt-10 bg-e26-gold text-e26-black font-sans font-medium text-[13px] tracking-[0.08em] uppercase px-8 py-4 opacity-45 select-none cursor-default"
          aria-hidden="true"
        >
          Đọc Ebook Miễn Phí
        </span>
      </div>
    </section>
  );
}

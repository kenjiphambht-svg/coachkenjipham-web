// Section 9 — Ghi chép + Lối ra. Nền ivory.
// SỬA 19/07/2026 (v8-FINAL) — bố cục 2 CỬA SONG SONG (Góc Đọc / Ebook), thay
// bố cục "2 phần xếp dọc" ở PR trước (đã lỗi thời theo v8 cũ, chưa khớp
// FINAL). Vẫn BỎ khung (không viền/nền khối riêng) — nền mờ bg-hero-light
// trần, đồng bộ mức phủ với ⑥⑧ (opacity 0.11, phủ kem ~88-90% theo FINAL).
// Câu kết ĐỔI MỚI theo FINAL: bỏ "Cánh cửa luôn mở, và bạn là người tự chọn
// nhịp đi của mình." (giọng "đóng trang") → "Hai nơi này đang được viết dần.
// Khi mở, sẽ có chỗ cho bạn ngồi lại." (giọng mời vào). "(sắp mở)" ở cả 2
// cửa: <span> mờ, KHÔNG href/<a> — tránh soft 404, khi có trang thật sẽ
// thành link sống. Hai cửa phân tách bằng khoảng cách + đường kẻ dọc RẤT
// mảnh (divide-x, không phải khung đậm bo góc). Mobile xếp dọc.
// KHÔNG còn nút vàng (đã bỏ ở PR trước) — đúng 2 điểm vàng toàn trang (vệt
// ③, viền hover ⑤).
export default function NotesTeaser() {
  return (
    <section className="relative bg-e26-ivory px-6 py-16 md:py-28">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.11]"
        style={{ backgroundImage: "url(/images/home/bg-hero-light.webp)" }}
        aria-hidden="true"
      />
      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <p className="e26-reveal font-serif text-2xl text-e26-text mb-14">Ghi chép Essence.</p>

        {/* Hai CỬA song song, cân nhau — divide-x tạo đường kẻ dọc rất mảnh
            (1px, màu e26-border nhạt) ở desktop, KHÔNG phải khung đậm bo góc.
            Mobile: gap-10 xếp dọc, không có đường kẻ ngang (divide chỉ áp
            dụng theo trục chính của grid, tự động tắt khi 1 cột). */}
        <div className="grid md:grid-cols-2 gap-10 md:gap-0 md:divide-x md:divide-e26-border">
          <div className="md:pr-10">
            <p className="e26-reveal font-sans text-sm tracking-[0.08em] uppercase text-e26-text-2 mb-3">
              Góc Đọc
            </p>
            <p className="e26-reveal font-sans text-[15px] leading-[1.65] text-e26-text-2">
              Những bài viết nhỏ đang được ghi lại.{" "}
              <span className="opacity-45 select-none cursor-default">(sắp mở)</span>
            </p>
          </div>
          <div className="md:pl-10">
            <p className="e26-reveal font-sans text-sm tracking-[0.08em] uppercase text-e26-text-2 mb-3">
              Ebook
            </p>
            <p className="e26-reveal font-sans text-[15px] leading-[1.65] text-e26-text-2">
              &quot;Bắt Đầu Từ Đâu? Bản Sắc Nhân Hiệu&quot;{" "}
              <span className="opacity-45 select-none cursor-default">(sắp mở)</span>
            </p>
          </div>
        </div>

        <p className="e26-reveal font-sans text-[15px] leading-[1.65] text-e26-text-2 mt-14">
          Hai nơi này đang được viết dần. Khi mở, sẽ có chỗ cho bạn ngồi lại.
        </p>
      </div>
    </section>
  );
}

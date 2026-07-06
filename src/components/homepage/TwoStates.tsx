// Section 3 — Hai trạng thái tự nhận. Nền cream. Kicker + numeral Cormorant mờ.
// Card: bỏ viền hộp, dùng hairline trên + kicker. Card "Sắp mở" hạ độ đậm.
// Mô tả trạng thái, không mô tả dịch vụ. Không nút vàng ở đây (File 04 + color map).
export default function TwoStates() {
  return (
    <section className="bg-e26-cream px-6 py-20 md:py-28">
      <div className="max-w-[1120px] mx-auto">
        <div className="text-center mb-16">
          <span
            className="fade-in-section block font-serif font-light text-[80px] leading-none text-e26-border mb-2"
            aria-hidden="true"
          >
            03
          </span>
          <p className="fade-in-section font-sans text-sm tracking-[0.08em] uppercase text-e26-text-2 mb-4">
            Hai trạng thái
          </p>
          <h2 className="fade-in-section font-serif font-normal text-[28px] md:text-[40px] text-e26-text">
            Bạn đến đây vì điều gì?
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-10 md:gap-14">
          {/* Card "Sắp mở" — hạ độ đậm (chữ secondary, không lối vào active) */}
          <div className="fade-in-section border-t border-e26-border pt-8">
            <p className="font-sans text-sm tracking-[0.08em] uppercase text-e26-text-2 mb-5">
              Cho chính bạn
            </p>
            <p className="font-serif text-2xl leading-snug text-e26-text-2 mb-5">
              Có một kiểu mệt không nằm ở công việc, mà ở việc cứ phải là một phiên bản nào đó của mình.
            </p>
            <p className="font-sans text-[15px] leading-[1.65] text-e26-text-2 mb-6">
              Nếu bạn muốn ngồi lại và nhìn rõ vòng lặp ấy — cánh cửa này đang được xây, chậm và cẩn thận.
            </p>
            <p className="font-sans text-sm text-e26-text-2">Sắp mở</p>
          </div>

          {/* Card active — dẫn xuống Hạt Mầm */}
          <div className="fade-in-section border-t border-e26-border pt-8">
            <p className="font-sans text-sm tracking-[0.08em] uppercase text-e26-text-2 mb-5">
              Cho con của bạn
            </p>
            <p className="font-serif text-2xl leading-snug text-e26-text mb-5">
              Bạn nhìn con và có những điều chưa gọi được tên.
            </p>
            <p className="font-sans text-[15px] leading-[1.65] text-e26-text-2 mb-6">
              Không phải để sửa con — chỉ là một cửa sổ để hiểu con hơn, bắt đầu từ những gì
              ba mẹ có thể để ý mỗi ngày.
            </p>
            <a
              href="#hat-mam"
              className="font-sans text-[15px] text-e26-text underline underline-offset-4 decoration-e26-border hover:text-e26-gold-deep hover:decoration-e26-gold transition-colors duration-300"
            >
              Xem ấn phẩm Bản Sắc Hạt Mầm
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// Section 3 — Hai trạng thái tự nhận. Nền cream, khối white xen.
// Mô tả trạng thái, không mô tả dịch vụ. Không nút vàng ở đây (File 04 + color map).
export default function TwoStates() {
  return (
    <section className="bg-e26-cream px-6 py-20 md:py-28">
      <div className="max-w-4xl mx-auto">
        <h2 className="fade-in-section font-serif font-normal text-3xl md:text-4xl text-e26-text text-center mb-14">
          Bạn đến đây vì điều gì?
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="fade-in-section bg-e26-white border border-e26-border p-8 md:p-10">
            <p className="font-sans text-sm text-e26-text-2 mb-4">Cho chính bạn</p>
            <p className="font-serif text-2xl leading-snug text-e26-text mb-5">
              Có một kiểu mệt không nằm ở công việc, mà ở việc cứ phải là một phiên bản nào đó của mình.
            </p>
            <p className="font-sans text-[15px] leading-[1.65] text-e26-text-2 mb-6">
              Nếu bạn muốn ngồi lại và nhìn rõ vòng lặp ấy — cánh cửa này đang được xây, chậm và cẩn thận.
            </p>
            <p className="font-sans text-sm text-e26-text-2">Sắp mở</p>
          </div>
          <div className="fade-in-section bg-e26-white border border-e26-border p-8 md:p-10">
            <p className="font-sans text-sm text-e26-text-2 mb-4">Cho con của bạn</p>
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

import Link from "next/link";

// Section 3 — Hai trạng thái tự nhận. Nền cream. Heading + kicker căn trái.
// Số section ma "03": Cormorant ~200px, opacity 6%, neo góc trái trên, sau nội dung.
// Card: hairline trên + kicker, không viền hộp.
// Mô tả trạng thái, không mô tả dịch vụ. Không nút vàng ở đây (File 04 + color map).
// Cả 2 cửa giờ đều dẫn tới hub thật (/ban-sac-cua-ban, /ban-sac-cua-con) — Lặng 90'
// đã lên (không còn "sắp mở"), nên câu chữ card 1 được cập nhật tối thiểu cho đúng
// sự thật (không viết thêm copy marketing mới, chỉ sửa phần đã sai so với thực tế).
export default function TwoStates() {
  return (
    <section className="cinema-scene bg-e26-cream px-6 py-16 md:py-32">
      <div className="max-w-[1120px] mx-auto relative">
        <span
          className="hidden md:block absolute -top-10 left-0 font-serif font-light text-[200px] leading-none text-e26-black opacity-[0.06] select-none pointer-events-none"
          aria-hidden="true"
        >
          03
        </span>

        <div className="relative">
          <div className="mb-16">
            <p className="e26-reveal font-sans text-sm tracking-[0.08em] uppercase text-e26-text-2 mb-4">
              Hai trạng thái
            </p>
            <h2 className="e26-reveal font-serif font-normal text-[28px] md:text-[40px] text-e26-text">
              Bạn đến đây vì điều gì?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-10 md:gap-14">
            {/* Card 1 — dẫn tới hub /ban-sac-cua-ban */}
            <div className="e26-reveal border-t border-e26-border pt-8">
              <p className="font-sans text-sm tracking-[0.08em] uppercase text-e26-text-2 mb-5">
                Cho chính bạn
              </p>
              <p className="font-serif text-2xl leading-snug text-e26-text-2 mb-5">
                Có một kiểu mệt không nằm ở công việc, mà ở việc cứ phải là một phiên bản nào đó của mình.
              </p>
              <p className="font-sans text-[15px] leading-[1.65] text-e26-text-2 mb-6">
                Nếu bạn muốn ngồi lại và nhìn rõ vòng lặp ấy — đây là cửa dành cho bạn.
              </p>
              <Link
                href="/ban-sac-cua-ban"
                className="font-sans text-[15px] text-e26-text underline underline-offset-4 decoration-e26-border hover:text-e26-gold-deep hover:decoration-e26-gold transition-colors duration-300"
              >
                Xem cửa Cho chính bạn
              </Link>
            </div>

            {/* Card 2 — dẫn tới hub /ban-sac-cua-con */}
            <div className="e26-reveal border-t border-e26-border pt-8">
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
              <Link
                href="/ban-sac-cua-con"
                className="font-sans text-[15px] text-e26-text underline underline-offset-4 decoration-e26-border hover:text-e26-gold-deep hover:decoration-e26-gold transition-colors duration-300"
              >
                Khám phá Bản Sắc Của Con
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";

// ============================================================
// PHÒNG 5 — QUY TRÌNH & BẢO MẬT. Tái dùng pattern "S11 quy trình" của
// Room5KenjiProcess.tsx (Hạt Mầm): timeline 3 bước ngang desktop/dọc
// mobile + box bảo mật hairline. Copy NGUYÊN VĂN theo task.
// "[X] ngày": task để trống, chưa có số cụ thể — giữ nguyên placeholder,
// không tự đoán số (cùng nguyên tắc đã áp dụng ở /ban-la-duy-nhat).
// ============================================================
export default function Room4ProcessKP() {
  return (
    <section className="bg-e26-ivory px-6 py-16 md:py-32">
      <div className="max-w-[1040px] mx-auto">
        <h2 className="hm-reveal font-serif font-normal text-[28px] md:text-[38px] leading-tight text-e26-text mb-14 max-w-[720px]">
          Quy trình & riêng tư
        </h2>

        <div className="grid md:grid-cols-3 gap-10 md:gap-8 mb-14">
          <div className="hm-reveal border-t border-e26-border pt-6">
            <span className="font-serif font-light text-5xl text-e26-gold leading-none" aria-hidden="true">
              1
            </span>
            <h3 className="font-serif text-xl text-e26-text mt-4 mb-3">Ba mẹ kể về con</h3>
            <p className="font-sans text-[15px] leading-[1.7] text-e26-text-2">
              Qua phiếu hỏi (20–25 phút, có phần con tự trả lời vài câu nếu con muốn).
            </p>
          </div>
          <div className="hm-reveal hm-d1 border-t border-e26-border pt-6">
            <span className="font-serif font-light text-5xl text-e26-gold leading-none" aria-hidden="true">
              2
            </span>
            <h3 className="font-serif text-xl text-e26-text mt-4 mb-3">Kenji soạn và duyệt</h3>
            <p className="font-sans text-[15px] leading-[1.7] text-e26-text-2">
              Kenji đích thân soạn và duyệt từng trang.
            </p>
          </div>
          <div className="hm-reveal hm-d2 border-t border-e26-border pt-6">
            <span className="font-serif font-light text-5xl text-e26-gold leading-none" aria-hidden="true">
              3
            </span>
            <h3 className="font-serif text-xl text-e26-text mt-4 mb-3">Ba mẹ nhận ấn phẩm</h3>
            <p className="font-sans text-[15px] leading-[1.7] text-e26-text-2">
              Phòng đọc riêng + bản PDF A5, trong{" "}
              <span className="text-e26-text">[X ngày — Kenji điền số cụ thể]</span>.
            </p>
          </div>
        </div>

        <div className="hm-reveal border border-e26-border bg-e26-white p-8 max-w-[720px]">
          <h3 className="font-serif text-xl text-e26-text mb-3">Bảo mật</h3>
          <p className="font-sans text-[15px] leading-[1.7] text-e26-text-2 mb-4">
            Thông tin của con chỉ dùng để soạn ấn phẩm của chính con; không công khai, không dùng
            huấn luyện AI; ba mẹ có quyền yêu cầu xóa.
          </p>
          <Link
            href="/chinh-sach-rieng-tu"
            className="font-sans text-[14px] text-e26-text underline underline-offset-4 decoration-e26-border hover:text-e26-gold-deep hover:decoration-e26-gold transition-colors duration-300"
          >
            Xem chính sách riêng tư
          </Link>
        </div>
      </div>
    </section>
  );
}

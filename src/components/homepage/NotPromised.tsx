// Section 6 — Điều Essence không hứa. Dark silence section DUY NHẤT giữa trang.
// Chữ #FAF9F7 / #B4B2A9 trên nền #1A1A1A — contrast đầy đủ, không được làm mờ.
export default function NotPromised() {
  return (
    <section className="bg-e26-black px-6 py-20 md:py-28">
      <div className="max-w-2xl mx-auto text-center">
        {/* Hairline vàng mở đầu khoảng lặng (tùy chọn theo color map) */}
        <div className="fade-in-section w-10 h-px bg-e26-gold mx-auto mb-12" aria-hidden="true" />
        <h2 className="fade-in-section font-serif font-normal text-3xl md:text-4xl text-e26-text-dark mb-12">
          Điều Essence không hứa
        </h2>
        <ul className="fade-in-section space-y-6 font-sans text-[17px] leading-[1.65] text-e26-text-dark text-left md:text-center">
          <li>Không hứa kết quả sau một buổi, một ấn phẩm, hay một tháng.</li>
          <li>Không chẩn đoán, không thay thế chăm sóc sức khỏe tinh thần chuyên môn.</li>
          <li>Không đoán trước tương lai của bạn — càng không đoán tương lai của một đứa trẻ.</li>
          <li>Không dùng nỗi sợ để khiến bạn phải mua, hay phải chia sẻ nhiều hơn mức bạn muốn.</li>
          <li>Không để máy quyết định thay con người — bản cuối luôn có Kenji đọc và duyệt.</li>
        </ul>
        <p className="fade-in-section font-sans text-[15px] leading-[1.65] text-e26-text-dark-2 mt-12">
          Đổi lại, Essence giữ những điều giữ được: rõ ràng, riêng tư, đúng nhịp —
          và bạn luôn có quyền dừng.
        </p>
      </div>
    </section>
  );
}

// Section 6 — Điều Essence không hứa. Dark silence section DUY NHẤT giữa trang.
// Chữ #FAF9F7 / #B4B2A9 trên nền #1A1A1A — contrast đầy đủ, không được làm mờ.
// Padding dọc +50% so bản trước (khoảng lặng phải thở), giãn dòng, hairline vàng mở đầu.
export default function NotPromised() {
  return (
    <section className="bg-e26-black px-6 py-[120px] md:py-40">
      <div className="max-w-2xl mx-auto text-center">
        {/* Hairline vàng mở đầu khoảng lặng */}
        <div className="fade-in-section w-12 h-px bg-e26-gold mx-auto mb-14" aria-hidden="true" />
        <h2 className="fade-in-section font-serif font-normal text-[28px] md:text-[40px] text-e26-text-dark mb-14">
          Điều Essence không hứa
        </h2>
        <ul className="fade-in-section space-y-8 font-sans text-[17px] leading-[1.8] text-e26-text-dark text-left md:text-center">
          <li>Không hứa kết quả sau một buổi, một ấn phẩm, hay một tháng.</li>
          <li>Không chẩn đoán, không thay thế chăm sóc sức khỏe tinh thần chuyên môn.</li>
          <li>Không đoán trước tương lai của bạn — càng không đoán tương lai của một đứa trẻ.</li>
          <li>Không dùng nỗi sợ để khiến bạn phải mua, hay phải chia sẻ nhiều hơn mức bạn muốn.</li>
          <li>Không để máy quyết định thay con người — bản cuối luôn có Kenji đọc và duyệt.</li>
        </ul>
        <p className="fade-in-section font-sans text-[15px] leading-[1.8] text-e26-text-dark-2 mt-14">
          Đổi lại, Essence giữ những điều giữ được: rõ ràng, riêng tư, đúng nhịp —
          và bạn luôn có quyền dừng.
        </p>
      </div>
    </section>
  );
}

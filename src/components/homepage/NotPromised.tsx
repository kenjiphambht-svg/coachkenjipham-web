// Section 6 — Điều Essence không hứa. Dark silence section DUY NHẤT giữa trang.
// Chữ #FAF9F7 / #B4B2A9 trên nền #1A1A1A — contrast đầy đủ, không được làm mờ.
// Padding dọc ~180px desktop (khoảng lặng phải thở), 5 dòng "không" giãn 28px,
// max-width 640px, hairline vàng mở đầu.
// (Trước đây tách 2 div theo cảnh cho chế độ cuộn điện ảnh trên mobile — chế độ đó
// đã bỏ; giữ nguyên 2 div + mt-7 vì đã canh đúng nhịp space-y-7 cũ, tránh đụng thêm.)
export default function NotPromised() {
  return (
    <section className="bg-e26-black px-6 py-24 md:py-[180px]">
      <div className="max-w-[640px] mx-auto text-center">
        <div>
          {/* Hairline vàng mở đầu khoảng lặng */}
          <div className="e26-reveal w-12 h-px bg-e26-gold mx-auto mb-14" aria-hidden="true" />
          <h2 className="e26-reveal font-serif font-normal text-[28px] md:text-[40px] text-e26-text-dark mb-14">
            Điều Essence không hứa
          </h2>
          <ul className="e26-reveal space-y-7 font-sans text-[17px] leading-[1.8] text-e26-text-dark text-left md:text-center">
            <li>Không hứa kết quả sau một buổi, một ấn phẩm, hay một tháng.</li>
            <li>Không chẩn đoán, không thay thế chăm sóc sức khỏe tinh thần chuyên môn.</li>
            <li>Không đoán trước tương lai của bạn — càng không đoán tương lai của một đứa trẻ.</li>
          </ul>
        </div>
        <div>
          <ul className="e26-reveal space-y-7 mt-7 font-sans text-[17px] leading-[1.8] text-e26-text-dark text-left md:text-center">
            <li>Không dùng nỗi sợ để khiến bạn phải mua, hay phải chia sẻ nhiều hơn mức bạn muốn.</li>
            <li>Không để máy quyết định thay con người — bản cuối luôn có Kenji đọc và duyệt.</li>
          </ul>
          <p className="e26-reveal font-sans text-[15px] leading-[1.8] text-e26-text-dark-2 mt-14">
            Đổi lại, Essence giữ những điều giữ được: rõ ràng, riêng tư, đúng nhịp —
            và bạn luôn có quyền dừng.
          </p>
        </div>
      </div>
    </section>
  );
}

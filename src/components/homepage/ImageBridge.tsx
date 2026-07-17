// Cầu nối ảnh 5 — giữa section ⑦ (đen, An Định → An Thịnh) và ⑧ (kem, Điều
// Essence không hứa). Full-bleed, tối→sáng trên xuống dưới. Desktop 21:9,
// mobile 4:5 (đứng) — theo brief mở rộng ImageSlot, nhưng cầu nối này cần
// fallback riêng (gradient đen→kem) thay vì khối cream phẳng mặc định của
// ImageSlot, vì bản thân sự chuyển sắc chính là nội dung của section này,
// không phải chỉ là chỗ chờ ảnh.
export default function ImageBridge() {
  return (
    <div
      className="e26-reveal relative w-full aspect-[4/5] md:aspect-[21/9] overflow-hidden bg-gradient-to-b from-e26-black to-e26-cream"
      role="img"
      aria-label="Ánh sáng chuyển từ tối sang sáng, như cửa sổ đón bình minh"
    >
      {/* SWAP SLOT khi có ảnh thật (thay div gradient này bằng next/image):
          desktop 21:9 → /images/home/window-first-light.webp
          mobile 4:5  → /images/home/window-first-light-mobile.webp */}
    </div>
  );
}

// Cầu nối ảnh 5 — giữa section ⑦ (đen, An Định → An Thịnh) và ⑧ (kem, Điều
// Essence không hứa). Full-bleed, tối→sáng trên xuống dưới (đã đo thật bằng
// phân tích pixel: mép trên ảnh rất tối, mép dưới sáng hơn nhiều — đúng
// hướng, không phải trái-phải). <picture> đổi ảnh theo breakpoint: mobile
// dọc (< md), desktop ngang (≥ md) — không dùng next/image vì cần <source>
// art-direction thật (2 ảnh khác khung hình, không phải cùng ảnh resize).
export default function ImageBridge() {
  return (
    <div
      className="e26-reveal relative w-full aspect-[4/5] md:aspect-[21/9] overflow-hidden bg-e26-black"
      role="img"
      aria-label="Ánh sáng chuyển từ tối sang sáng — cửa sổ đón bình minh, ghế trống trong căn phòng lặng"
    >
      <picture>
        <source media="(min-width: 768px)" srcSet="/images/home/window-first-light.webp" />
        <img
          src="/images/home/window-first-light-mobile.webp"
          alt=""
          className="w-full h-full object-cover"
        />
      </picture>
    </div>
  );
}

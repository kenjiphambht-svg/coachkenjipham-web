// Cầu nối ảnh 5 — giữa section ⑦ (đen, An Định → An Thịnh) và ⑧ (kem, Điều
// Essence không hứa). Full-bleed, tối→sáng trên xuống dưới (đã đo thật bằng
// phân tích pixel: mép trên ảnh rất tối 11-13/255, mép dưới sáng hơn 73-91/255
// — đúng hướng trên-tối/dưới-sáng). <picture> đổi ảnh theo breakpoint: mobile
// dọc (< md), desktop ngang (≥ md) — cần <source> art-direction thật.
//
// FIX MÉP (18/07/2026): mép dưới ảnh (sàn gỗ ~73-91/255) trước đây tạo đường
// ranh cứng khi gặp nền kem ⑧ (#F1EFE8 ~237/255). Thêm dải gradient CSS
// từ cream/0 → cream ở mép dưới để ảnh TAN HẲN vào nền kem (không đụng file
// ảnh). Dùng cùng màu cream đổi opacity (không fade qua transparent) để
// tránh vệt xám giữa dải. Mép trên (11-13) gặp đen ⑦ (26) rất gần nhau —
// thêm dải đen mỏng làm insurance cho liền mạch tuyệt đối.
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
      {/* Dải tan mép trên → đen ⑦ */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[10%] bg-gradient-to-t from-e26-black/0 to-e26-black"
        aria-hidden="true"
      />
      {/* Dải tan mép dưới → kem ⑧ */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[22%] bg-gradient-to-b from-e26-cream/0 to-e26-cream"
        aria-hidden="true"
      />
    </div>
  );
}

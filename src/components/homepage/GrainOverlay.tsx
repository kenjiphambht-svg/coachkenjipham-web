// Lớp hạt phim rất nhẹ phủ toàn trang — Doc V9 Layer 4 ("nền không phẳng
// digital"). 1 phần tử duy nhất, position:fixed, style/kỹ thuật đầy đủ ở
// class .e26-grain trong globals.css (SVG feTurbulence base64 + soft-light).
// aria-hidden vì thuần trang trí, không mang thông tin.
export default function GrainOverlay() {
  return <div className="e26-grain" aria-hidden="true" />;
}

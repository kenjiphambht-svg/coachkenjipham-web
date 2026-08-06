import type { AppProps } from 'next/app';
import NavigationFeedback from '@/components/NavigationFeedback';
import FloatingZaloButton from '@/components/FloatingZaloButton';
import '@/styles/globals.css';
import '@/styles/ve-kenji-pass-a.css';

// SỬA 02/08/2026 (brief MODE 5 — phản hồi chuyển trang + thu gọn motion):
// (1) GỠ MistFadeProvider khỏi _app — hook useMistFadeIn (gsap+ScrollTrigger)
//     chỉ phục vụ 3 route legacy (.fade-in-section: /kidbook,
//     /thanh-toan-goi-1, /thanh-toan-goi-2) và CẢ 3 TRANG ĐÓ ĐÃ TỰ GỌI
//     useMistFadeIn() bên trong component từ trước (kidbook.tsx:11,
//     thanh-toan-goi-1.tsx:6, thanh-toan-goi-2.tsx:6 — grep xác nhận). Tức
//     provider toàn site vừa bắt 20 route khác tải gsap vô ích, vừa chạy
//     TRÙNG hook 2 lần trên chính 3 trang legacy. Gỡ provider = 3 trang
//     legacy giữ nguyên hành vi (tự hook của chúng lo, không đổi 1 dòng nào
//     trong 3 file đó — đúng C-03 bảo tồn nguyên trạng), 20 route còn lại
//     không còn tải gsap trong chunk _app.
// (2) THÊM NavigationFeedback — phản hồi chuyển trang toàn site (vạch gold
//     mép trên + dim link vừa bấm), CSS thuần không gsap. Xem ghi chú đầy đủ
//     trong NavigationFeedback.tsx.
// (Cũng bỏ useRouter không dùng — từng là lint warning có sẵn.)
export default function App({ Component, pageProps }: AppProps) {
  // TẠM ẨN toàn site theo yêu cầu Kenji 16/07/2026 — chưa xoá component,
  // chờ quyết định về kênh liên lạc (Zalo/Messenger/không dùng widget).
  const hideFloatingZalo = true;

  return (
    <>
      <NavigationFeedback />
      <Component {...pageProps} />
      {!hideFloatingZalo && <FloatingZaloButton />}
    </>
  );
}

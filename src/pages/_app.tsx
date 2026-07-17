import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import MistFadeProvider from '@/components/MistFadeProvider';
import FloatingZaloButton from '@/components/FloatingZaloButton';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  // TẠM ẨN toàn site theo yêu cầu Kenji 16/07/2026 — chưa xoá component,
  // chờ quyết định về kênh liên lạc (Zalo/Messenger/không dùng widget).
  const hideFloatingZalo = true;

  return (
    <MistFadeProvider>
      <Component {...pageProps} />
      {!hideFloatingZalo && <FloatingZaloButton />}
    </MistFadeProvider>
  );
}

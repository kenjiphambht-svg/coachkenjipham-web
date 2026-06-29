import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import MistFadeProvider from '@/components/MistFadeProvider';
import FloatingZaloButton from '@/components/FloatingZaloButton';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const hideFloatingZalo = router.pathname === '/ai-startup';

  return (
    <MistFadeProvider>
      <Component {...pageProps} />
      {!hideFloatingZalo && <FloatingZaloButton />}
    </MistFadeProvider>
  );
}

import type { AppProps } from 'next/app';
import MistFadeProvider from '@/components/MistFadeProvider';
import FloatingZaloButton from '@/components/FloatingZaloButton';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MistFadeProvider>
      <Component {...pageProps} />
      <FloatingZaloButton />
    </MistFadeProvider>
  );
}

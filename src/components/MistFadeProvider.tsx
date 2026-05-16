'use client';

import { useMistFadeIn } from '@/hooks/useMistFadeIn';

export default function MistFadeProvider({ children }: { children: React.ReactNode }) {
  useMistFadeIn();
  return <>{children}</>;
}
import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  test: {
    environment: 'node',
    include: [
      'tests/**/*.test.ts',
      'src/lib/wp3-5/**/*.test.ts',
      'src/components/founder-review/**/*.test.tsx',
    ],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});

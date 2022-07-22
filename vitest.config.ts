import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: './test/setup.ts',
    coverage: {
      reporter: ['text', 'lcov', 'clover'],
    },
    clearMocks: true,
    globals: true,
    environment: 'node',
  },
});

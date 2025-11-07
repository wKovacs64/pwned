import { defineConfig, configDefaults } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: './test/setup.ts',
    coverage: {
      reporter: ['text', 'lcov', 'clover'],
      include: ['src/**/*'],
      exclude: [...(configDefaults.coverage.exclude ?? []), 'src/commands/api-key.ts'],
    },
    clearMocks: true,
    globals: true,
    environment: 'node',
  },
});

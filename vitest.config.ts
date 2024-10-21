import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defaultExclude, defineConfig, mergeConfig } from 'vitest/config';

export default defineConfig(mergeConfig(
  {
    plugins: [react()],
    envPrefix: ["VITE_", "NEXT_PUBLIC_"],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        $lib: path.resolve(__dirname, './src/lib'),
        $components: path.resolve(__dirname, './src/components'),
        test: path.resolve(__dirname, './test'),
      },
    },
  },
  {
    test: {
      globals: true,
      setupFiles: [
        path.resolve(__dirname, './test/setup.ts'),
        path.resolve(__dirname, './test/utilities.tsx'),
      ],
      exclude: [...defaultExclude, '**/*.svelte**'],
      environmentMatchGlobs: [
        ['**/*.test.ts', 'jsdom'],
        ['**/*.test.tsx', 'jsdom'],
        ['**/*.component.test.ts', 'jsdom'],
      ],
      coverage: {
        provider: 'v8',
        statements: 54.92,
        thresholdAutoUpdate: true,
        include: ['src/**/*'],
        exclude: [
          'test/**',
          'src/interfaces/**',
          'src/constants/**',
          '**/lang/**',
          'vite.*.ts',
          '**/*.d.ts',
          '**/*.test.*',
          '**/*.config.*',
          '**/snapshot-tests/**',
          '**/*.solution.tsx',
          '**/coverage/**',
        ],
        all: true,
      },
    },
  },
));
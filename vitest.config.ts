import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  test: {
    globals: true,
    environment: 'node', // jsdomはUIコンポーネントのテスト時のみ個別に指定する
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
      '**/tests/**',
      '**/*.spec.ts',
      '**/*.spec.tsx',
      '**/e2e/**',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/utils/**', 'src/lib/**', 'src/hooks/**'],
      exclude: ['src/**/__tests__/**'],
    },
  },
});

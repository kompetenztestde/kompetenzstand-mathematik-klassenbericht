import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html'],
        include: ['src/**/*.{ts,vue}'],
        exclude: [
          'src/main.ts',
          'src/__tests__/**',
          'src/**/*.d.ts',
          'src/components/icons/*',
          'src/composables/useCompetences.ts',
          'src/composables/useGuidingIdeas.ts',
          'src/composables/useOverallResults.ts',
          'src/composables/useSpecialCases.ts',
          'src/composables/useSpecialCasesNew.ts',
        ],
      },
    },
  }),
)

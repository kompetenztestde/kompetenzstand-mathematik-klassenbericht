import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { apiConfiguration, inioApiConfiguration, inioAuthApiConfiguration } from '../queries/utils'

vi.mock('@tba3/api-resources', () => ({
  Configuration: vi.fn().mockImplementation(function (
    this: Record<string, unknown>,
    param: Record<string, unknown>,
  ) {
    Object.assign(this, param)
  }),
}))

vi.mock('@tba3/api-new', () => ({
  Configuration: vi.fn().mockImplementation(function (
    this: Record<string, unknown>,
    param: Record<string, unknown>,
  ) {
    Object.assign(this, param)
  }),
}))

vi.mock('@tba3/api-auth', () => ({
  Configuration: vi.fn().mockImplementation(function (
    this: Record<string, unknown>,
    param: Record<string, unknown>,
  ) {
    Object.assign(this, param)
  }),
}))

describe('API Configuration Utilities', () => {
  const originalWindowAppConfig = (window as unknown as { appConfig?: unknown }).appConfig

  beforeEach(() => {
    delete (window as unknown as { appConfig?: unknown }).appConfig
    vi.unstubAllEnvs()
  })

  afterEach(() => {
    ;(window as unknown as { appConfig?: unknown }).appConfig = originalWindowAppConfig
    vi.unstubAllEnvs()
  })

  describe('apiConfiguration', () => {
    it('uses baseUrl from window.appConfig if available', async () => {
      ;(window as unknown as { appConfig: unknown }).appConfig = {
        api: { baseUrl: 'https://api.example.com' },
      }

      const config = await apiConfiguration()
      expect(config.basePath).toBe('https://api.example.com')
    })

    it('falls back to empty string if window.appConfig is undefined', async () => {
      const config = await apiConfiguration()
      expect(config.basePath).toBe('')
    })
  })

  describe('inioApiConfiguration', () => {
    it('configures basePath from window.appConfig and uses VITE_X_API_KEY_SCHOOL env', async () => {
      vi.stubEnv('VITE_X_API_KEY_SCHOOL', 'custom-env-key-123')
      ;(window as unknown as { appConfig: unknown }).appConfig = {
        api: { inioApiUrl: 'https://inio.example.com' },
      }

      const config = await inioApiConfiguration()

      expect(config.basePath).toBe('https://inio.example.com')

      // Prüft die dynamische apiKey Funktion für 'X-API-KEY-SCHOOL'
      const apiKeyFn = (config as unknown as { apiKey: (name: string) => string }).apiKey
      expect(apiKeyFn('X-API-KEY-SCHOOL')).toBe('custom-env-key-123')
      expect(apiKeyFn('OTHER-HEADER')).toBe('')
    })

    it('falls back to default TEST key if VITE_X_API_KEY_SCHOOL is not defined', async () => {
      vi.stubEnv('VITE_X_API_KEY_SCHOOL', '')

      const config = await inioApiConfiguration()

      const apiKeyFn = (config as unknown as { apiKey: (name: string) => string }).apiKey
      expect(apiKeyFn('X-API-KEY-SCHOOL')).toBe('TEST')
    })

    it('falls back to empty string for basePath when window.appConfig is missing', async () => {
      const config = await inioApiConfiguration()
      expect(config.basePath).toBe('')
    })
  })

  describe('inioAuthApiConfiguration', () => {
    it('uses inioAuthApiUrl from window.appConfig', async () => {
      ;(window as unknown as { appConfig: unknown }).appConfig = {
        api: { inioAuthApiUrl: 'https://auth.example.com' },
      }

      const config = await inioAuthApiConfiguration()
      expect(config.basePath).toBe('https://auth.example.com')
    })

    it('falls back to empty string when window.appConfig is missing', async () => {
      const config = await inioAuthApiConfiguration()
      expect(config.basePath).toBe('')
    })
  })
})

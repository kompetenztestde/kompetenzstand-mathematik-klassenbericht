import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { apiConfiguration, inioApiConfiguration, inioAuthApiConfiguration } from '../queries/utils'
import { DEFAULT_DEMO_SCHOOL_NUMBER, useAuthStore } from '@/stores/auth'
import { ReportDataTba3Api } from '@tba3/api-new'

type ConfigWindow = Window & { appConfig?: { api?: { baseUrl?: string; inioApiUrl?: string; inioAuthApiUrl?: string } } }
const configWindow = window as ConfigWindow
const originalConfig = configWindow.appConfig

beforeEach(() => {
  sessionStorage.clear()
  setActivePinia(createPinia())
  delete configWindow.appConfig
})

afterEach(() => {
  configWindow.appConfig = originalConfig
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('API configuration', () => {
  it('uses the configured reference and authentication API paths', async () => {
    configWindow.appConfig = { api: { baseUrl: '/api-proxy', inioAuthApiUrl: '/api-auth' } }
    expect((await apiConfiguration()).basePath).toBe('/api-proxy')
    expect((await inioAuthApiConfiguration()).basePath).toBe('/api-auth')
  })

  it('retains empty paths when no runtime configuration is provided', async () => {
    expect((await apiConfiguration()).basePath).toBe('')
    expect((await inioAuthApiConfiguration()).basePath).toBe('')
  })

  it('uses the school token as a Bearer header without an API key', async () => {
    useAuthStore().login('12345', 'test-token', 28800)
    configWindow.appConfig = { api: { inioApiUrl: '/api-inio' } }
    const config = await inioApiConfiguration()
    expect(config.basePath).toBe('/api-inio')
    expect(config.headers).toEqual({ Authorization: 'Bearer test-token' })
    expect(config.apiKey).toBeUndefined()
  })

  it('uses only the demo API key for demo sessions', async () => {
    useAuthStore().loginDemo(DEFAULT_DEMO_SCHOOL_NUMBER, DEFAULT_DEMO_SCHOOL_NUMBER)
    const config = await inioApiConfiguration()
    expect(await config.apiKey?.('X-API-KEY-SCHOOL')).toBe(DEFAULT_DEMO_SCHOOL_NUMBER)
    expect(await config.apiKey?.('OTHER-HEADER')).toBe('')
    expect(config.headers).toBeUndefined()
  })

  it('sends the Bearer token on generated report API requests', async () => {
    useAuthStore().login('12345', 'test-token', 28800)
    configWindow.appConfig = { api: { inioApiUrl: '/api-inio' } }
    const fetchMock = vi.fn().mockResolvedValue(new Response('{}', {
      headers: { 'Content-Type': 'application/json' },
    }))
    vi.stubGlobal('fetch', fetchMock)
    const api = new ReportDataTba3Api(await inioApiConfiguration())
    await api.schoolInformationGetRaw({})
    expect(fetchMock).toHaveBeenCalledWith('/api-inio/school-information', expect.objectContaining({
      headers: expect.objectContaining({ Authorization: 'Bearer test-token' }),
    }))
    expect(fetchMock.mock.calls[0]?.[1].headers['X-API-KEY-SCHOOL']).toBeUndefined()
  })

  it('rejects report requests before login', async () => {
    await expect(inioApiConfiguration()).rejects.toThrow('Bitte melde dich erneut an.')
  })

  it('rejects report requests after token expiry', async () => {
    vi.useFakeTimers()
    useAuthStore().login('12345', 'test-token', 1)
    vi.advanceTimersByTime(1000)
    await expect(inioApiConfiguration()).rejects.toThrow('Bitte melde dich erneut an.')
  })
})

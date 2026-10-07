import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, afterEach, vi } from 'vitest'
import { useAuthStore } from '@/stores/auth'
import { queryClient } from '@/queryClient'

beforeEach(() => {
  sessionStorage.clear()
  setActivePinia(createPinia())
})

afterEach(() => {
  queryClient.clear()
  vi.useRealTimers()
})

describe('school authentication store', () => {
  it('does not accept legacy password-based sessions', () => {
    sessionStorage.setItem('school-number', '12345')
    sessionStorage.setItem('api-key-school', 'old-password')
    expect(useAuthStore().isAuthenticated).toBe(false)
  })

  it('persists a successful token login across store reloads', () => {
    useAuthStore().login('12345', 'test-token', 28800)
    setActivePinia(createPinia())
    expect(useAuthStore().isAuthenticated).toBe(true)
    expect(useAuthStore().token).toBe('test-token')
    expect(useAuthStore().demoAccess).toBe(false)
    expect(useAuthStore().isSessionExpired()).toBe(false)
  })

  it('expires sessions after the server-provided lifetime', () => {
    vi.useFakeTimers()
    useAuthStore().login('12345', 'test-token', 28800)
    vi.advanceTimersByTime(28799 * 1000)
    expect(useAuthStore().isSessionExpired()).toBe(false)
    vi.advanceTimersByTime(1000)
    expect(useAuthStore().isSessionExpired()).toBe(true)
  })

  it('clears credentials and cached data on logout', () => {
    const auth = useAuthStore()
    auth.login('12345', 'test-token', 28800)
    queryClient.setQueryData(['school-data'], ['private-data'])
    auth.logout()
    expect(auth.isAuthenticated).toBe(false)
    expect(auth.token).toBeNull()
    expect(sessionStorage.length).toBe(0)
    expect(queryClient.getQueryData(['school-data'])).toBeUndefined()
  })

  it('clears the previous school cache when logging in as another school', () => {
    useAuthStore().login('12345', 'first-token', 28800)
    queryClient.setQueryData(['school-data'], ['private-data'])
    useAuthStore().login('54321', 'second-token', 28800)
    expect(queryClient.getQueryData(['school-data'])).toBeUndefined()
    expect(useAuthStore().token).toBe('second-token')
  })
})

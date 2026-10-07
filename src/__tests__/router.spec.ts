import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

describe('Router Index', () => {
  beforeEach(async () => {
    sessionStorage.clear()
    setActivePinia(createPinia())
    useAuthStore().login('12345', 'test-token', 28800)
    await router.push('/')
    await router.isReady()
  })

  afterEach(() => vi.useRealTimers())

  it.each([1, 2, 3, 4, 5, 6, 7])('blocks step %s without authentication', async (step) => {
    useAuthStore().logout()
    await router.push(`/step-${step}?user=ABC`)
    expect(router.currentRoute.value.name).toBe('login')
    expect(router.currentRoute.value.query.redirect).toBe(`/step-${step}?user=ABC`)
  })

  it('blocks expired sessions and removes their credentials', async () => {
    vi.useFakeTimers()
    useAuthStore().login('12345', 'test-token', 1)
    vi.advanceTimersByTime(1000)
    await router.push('/step-2')
    expect(router.currentRoute.value.name).toBe('login')
    expect(useAuthStore().token).toBeNull()
  })

  it('redirects authenticated users away from login', async () => {
    await router.push('/login')
    expect(router.currentRoute.value.path).toBe('/step-1')
  })

  it('sollte von "/" nach "/step-1" weiterleiten', async () => {
    await router.push('/')
    await router.isReady()

    expect(router.currentRoute.value.path).toBe('/step-1')
    expect(router.currentRoute.value.name).toBe('home')
  })

  it.each([
    { path: '/step-1', expectedName: 'home' },
    { path: '/step-2', expectedName: 'step2' },
    { path: '/step-3', expectedName: 'step3' },
    { path: '/step-4', expectedName: 'step4' },
    { path: '/step-5', expectedName: 'step5' },
    { path: '/step-6', expectedName: 'step6' },
    { path: '/step-7', expectedName: 'step7' },
  ])('sollte die Route $path auflösen und den Namen $expectedName haben', async ({ path, expectedName }) => {
    await router.push(path)
    await router.isReady()

    expect(router.currentRoute.value.path).toBe(path)
    expect(router.currentRoute.value.name).toBe(expectedName)
  })

  it.each([
    { routeName: 'home', expectedPath: '/step-1' },
    { routeName: 'step2', expectedPath: '/step-2' },
    { routeName: 'step3', expectedPath: '/step-3' },
    { routeName: 'step4', expectedPath: '/step-4' },
    { routeName: 'step5', expectedPath: '/step-5' },
    { routeName: 'step6', expectedPath: '/step-6' },
    { routeName: 'step7', expectedPath: '/step-7' },
  ])('sollte über den Routennamen $routeName nach $expectedPath navigieren', async ({ routeName, expectedPath }) => {
    await router.push({ name: routeName })
    await router.isReady()

    expect(router.currentRoute.value.path).toBe(expectedPath)
  })
})
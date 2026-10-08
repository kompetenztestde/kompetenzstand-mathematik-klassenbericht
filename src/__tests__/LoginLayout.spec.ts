import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import LoginLayout from '@/layouts/LoginLayout.vue'
import { DEFAULT_DEMO_SCHOOL_NUMBER, useAuthStore } from '@/stores/auth'

const { replace, loadClasses } = vi.hoisted(() => ({ replace: vi.fn(), loadClasses: vi.fn() }))
vi.mock('@/queries/useClassSelectionQuery', async (importOriginal) => ({
  ...await importOriginal<typeof import('@/queries/useClassSelectionQuery')>(),
  loadSelectableClasses: loadClasses,
}))
vi.mock('vue-router', () => ({
  useRouter: () => ({ replace }),
  useRoute: () => ({ query: { redirect: '/step-3?user=ABC' } }),
}))

vi.mock('@/queries/utils', () => ({
  inioAuthApiConfiguration: async () => ({ basePath: '/api-auth' }),
}))

beforeEach(() => {
  sessionStorage.clear()
  vi.clearAllMocks()
  loadClasses.mockResolvedValue([
    { groupId: 5460, groupName: '8A', tests: [{ testId: 9522, name: 'Mathematik', booklet: 'A' }] },
    { groupId: 5462, groupName: '8B', tests: [{ testId: 9522, name: 'Mathematik', booklet: 'A' }] },
  ])
})

afterEach(() => vi.unstubAllGlobals())

function mountLogin() {
  const pinia = createPinia()
  setActivePinia(pinia)
  return mount(LoginLayout, {
    global: { plugins: [pinia, [VueQueryPlugin, { queryClient: new QueryClient() }]] },
  })
}

describe('LoginLayout', () => {
  it('disables credentials and password visibility until a country is selected', () => {
    const wrapper = mountLogin()

    expect(wrapper.get('#country').attributes('disabled')).toBeUndefined()
    expect(wrapper.get('#schoolNumber').attributes('disabled')).toBeDefined()
    expect(wrapper.get('#schoolPassword').attributes('disabled')).toBeDefined()
    expect(wrapper.get('.input-icon-button').attributes('disabled')).toBeDefined()
    expect(wrapper.get('[type="submit"]').attributes('disabled')).toBeDefined()
  })

  it.each(['sn', 'th'])('enables credentials after selecting %s', async (country) => {
    const wrapper = mountLogin()

    await wrapper.get('#country').setValue(country)

    expect(wrapper.get('#schoolNumber').attributes('disabled')).toBeUndefined()
    expect(wrapper.get('#schoolPassword').attributes('disabled')).toBeUndefined()
    expect(wrapper.get('.input-icon-button').attributes('disabled')).toBeUndefined()
    expect(wrapper.get('[type="submit"]').attributes('disabled')).toBeDefined()

    await wrapper.get('#schoolNumber').setValue('12345')
    await wrapper.get('#schoolPassword').setValue('test-password')

    expect(wrapper.get('[type="submit"]').attributes('disabled')).toBeUndefined()
    await wrapper.get('.input-icon-button').trigger('click')
    expect(wrapper.get('#schoolPassword').attributes('type')).toBe('text')
  })

  it('keeps demo access available and disables credentials when returning to normal login', async () => {
    const wrapper = mountLogin()

    await wrapper.get('#country').setValue('th')
    await wrapper.get('.demo-access-option:last-child').trigger('click')

    expect(wrapper.find('#country').exists()).toBe(false)
    expect(wrapper.find('#schoolPassword').exists()).toBe(false)
    expect(wrapper.get('#schoolNumber').attributes('disabled')).toBeUndefined()
    expect(wrapper.get<HTMLInputElement>('#schoolNumber').element.value).toBe(
      DEFAULT_DEMO_SCHOOL_NUMBER,
    )
    expect(wrapper.get('[type="submit"]').attributes('disabled')).toBeUndefined()

    await wrapper.get('.demo-access-option:first-child').trigger('click')

    expect(wrapper.get<HTMLSelectElement>('#country').element.value).toBe('')
    expect(wrapper.get('#schoolNumber').attributes('disabled')).toBeDefined()
    expect(wrapper.get('#schoolPassword').attributes('disabled')).toBeDefined()
    expect(wrapper.get('.input-icon-button').attributes('disabled')).toBeDefined()
  })

  async function fillLogin() {
    const wrapper = mountLogin()
    await wrapper.get('#country').setValue('th')
    await wrapper.get('#schoolNumber').setValue('12345')
    await wrapper.get('#schoolPassword').setValue('test-password')
    return wrapper
  }

  it('skips the class-selection route entirely for a single class and test', async () => {
    loadClasses.mockResolvedValue([
      { groupId: 5460, groupName: '8A', tests: [{ testId: 9522, name: 'Mathematik', booklet: 'A' }] },
    ])
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({
      success: true,
      data: { token: 'test-token', tokenExpiresIn: 28800, tokenExpiresAt: '2099-10-07 23:46:33' },
    }), { headers: { 'Content-Type': 'application/json' } })))
    const wrapper = await fillLogin()
    await wrapper.get('form').trigger('submit')
    await flushPromises()
    expect(replace).toHaveBeenCalledExactlyOnceWith('/step-3?user=ABC')
    wrapper.unmount()
  })

  it('authenticates and navigates only after a successful server response', async () => {
    let resolveResponse!: (response: Response) => void
    const fetchMock = vi.fn().mockReturnValue(new Promise<Response>((resolve) => {
      resolveResponse = resolve
    }))
    vi.stubGlobal('fetch', fetchMock)
    const wrapper = await fillLogin()
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(useAuthStore().isAuthenticated).toBe(false)
    expect(replace).not.toHaveBeenCalled()
    expect(wrapper.get('fieldset').attributes('disabled')).toBeDefined()
    expect(fetchMock).toHaveBeenCalledWith('/api-auth/school', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ region: 'TH', schulNr: '12345', passwort: 'test-password' }),
    }))

    resolveResponse(new Response(JSON.stringify({
      success: true,
      message: '',
      data: { token: 'test-token', tokenExpiresIn: 28800, tokenExpiresAt: '2099-10-07 23:46:33' },
    }), { headers: { 'Content-Type': 'application/json' } }))
    await flushPromises()

    expect(useAuthStore().token).toBe('test-token')
    expect(useAuthStore().apiKeySchool).toBeNull()
    expect(replace).toHaveBeenCalledWith({
      name: 'class-selection', query: { redirect: '/step-3?user=ABC' },
    })
    expect(sessionStorage.getItem('api-key-school')).toBeNull()
    wrapper.unmount()
  })

  it.each([
    { body: { success: false, message: 'Zugangsdaten ungültig.' }, status: 401, message: 'Zugangsdaten ungültig.' },
    { body: { success: true, data: {} }, status: 200, message: 'Ungültige Sitzungsdaten' },
    { body: { success: true }, status: 500, message: 'Anmeldung fehlgeschlagen.' },
  ])('does not navigate on invalid login: $message', async ({ body, status, message }) => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify(body), {
      status, headers: { 'Content-Type': 'application/json' },
    })))
    const wrapper = await fillLogin()
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(useAuthStore().isAuthenticated).toBe(false)
    expect(replace).not.toHaveBeenCalled()
    expect(wrapper.get('[role="alert"]').text()).toContain(message)
    wrapper.unmount()
  })

  it('shows network errors without authenticating', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network unavailable')))
    const wrapper = await fillLogin()
    await wrapper.get('form').trigger('submit')
    await flushPromises()
    expect(wrapper.get('[role="alert"]').text()).toContain('Network unavailable')
    expect(replace).not.toHaveBeenCalled()
    expect(useAuthStore().isAuthenticated).toBe(false)
    wrapper.unmount()
  })

  it('keeps demo login separate from the school authentication API', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    const wrapper = mountLogin()
    await wrapper.get('.demo-access-option:last-child').trigger('click')
    await wrapper.get('form').trigger('submit')
    expect(useAuthStore().demoAccess).toBe(true)
    expect(useAuthStore().isAuthenticated).toBe(true)
    expect(fetchMock).not.toHaveBeenCalled()
    wrapper.unmount()
  })
})

import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { describe, expect, it, vi } from 'vitest'
import LoginLayout from '@/layouts/LoginLayout.vue'
import { DEFAULT_DEMO_SCHOOL_NUMBER } from '@/stores/auth'

vi.mock('vue-router', () => ({
  useRouter: () => ({ replace: vi.fn() }),
}))

function mountLogin() {
  return mount(LoginLayout, {
    global: { plugins: [createPinia()] },
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
})

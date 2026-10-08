import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { computed } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import HomeView from '@/views/HomeView/HomeView.vue'
import i18n from '@/i18n'
import { useModalStore } from '@/stores/modalStore'
import texts from '@/assets/competence_guidingideas_texts.json'

vi.mock('vue-router', () => ({ useRouter: () => ({ push: vi.fn() }) }))
vi.mock('@/composables/useUserItems', () => ({
  useGroupInfo: () => ({ groupName: computed(() => '8A') }),
}))

describe('HomeView report information', () => {
  it('opens the existing report information when the question-mark button is clicked', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const wrapper = mount(HomeView, {
      global: { plugins: [pinia, i18n], stubs: { Speaker: true } },
    })
    const modal = useModalStore()
    expect(modal.isOpen).toBe(false)
    await wrapper.get('button[aria-label="Über diese Rückmeldung"]').trigger('click')
    expect(modal.isOpen).toBe(true)
    expect(modal.title).toBe(texts.start.title)
    expect(modal.content).toContain(texts.start.info.important)
    expect(modal.content).toContain('<br><br>')
    wrapper.unmount()
  })
})

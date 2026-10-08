import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ClassSelectionView from '@/views/ClassSelectionView.vue'
import { matchClasses } from '@/queries/useClassSelectionQuery'
import { useAuthStore } from '@/stores/auth'
import { useReportSelectionStore } from '@/stores/reportSelection'

const { replace } = vi.hoisted(() => ({ replace: vi.fn() }))
vi.mock('vue-router', () => ({
  useRouter: () => ({ replace }),
  useRoute: () => ({ query: { redirect: '/step-3?user=ABC' } }),
}))

const tests = [
  { testId: '9510', subject: 'Deutsch', gradeLevel: '6', nameDisplay: 'Deutsch Kl. 6', booklet: 'B' },
  { testId: '9516', subject: 'Deutsch', gradeLevel: '8', nameDisplay: 'Deutsch Kl. 8', booklet: 'A' },
  { testId: '9496', subject: 'Mathematik', gradeLevel: '6', nameDisplay: 'Mathematik Kl. 6', booklet: 'B' },
  { testId: '9522', subject: 'Mathematik', gradeLevel: '8', nameDisplay: 'Mathematik Kl. 8', booklet: 'A' },
  { testId: '9524', subject: 'Mathematik', gradeLevel: '8', nameDisplay: 'Mathematik Kl. 8', booklet: 'C' },
]
const groups = [
  { groupId: '5456', groupLevel: '6', groupName: '6A', participatedTests: [9510, 9496] },
  { groupId: '5460', groupLevel: '8', groupName: '8A', participatedTests: [9522, 9518, 9516] },
  { groupId: '5462', groupLevel: '8', groupName: '8B', participatedTests: [9522, 9516, 9518] },
  { groupId: '5464', groupLevel: '8', groupName: '8C', participatedTests: [9516] },
]

beforeEach(() => {
  sessionStorage.clear()
  setActivePinia(createPinia())
  useAuthStore().login('12345', 'test-token', 28800)
  vi.clearAllMocks()
  Object.assign(window, { appConfig: { api: { inioApiUrl: '/api-inio' } } })
})

afterEach(() => vi.unstubAllGlobals())

function mockLists(classList = groups) {
  const fetchMock = vi.fn(async (url: string) => new Response(JSON.stringify({
    success: true,
    message: '',
    data: url.endsWith('/participated-groups') ? classList : tests,
  }), { headers: { 'Content-Type': 'application/json' } }))
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

function mountSelection() {
  return mount(ClassSelectionView, {
    global: { plugins: [[VueQueryPlugin, { queryClient: new QueryClient() }]] },
  })
}

describe('class selection', () => {
  it('matches only grade-8 classes with participated grade-8 mathematics tests', () => {
    expect(matchClasses(groups, tests)).toEqual([
      { groupId: 5460, groupName: '8A', tests: [{ testId: 9522, name: 'Mathematik Kl. 8', booklet: 'A' }] },
      { groupId: 5462, groupName: '8B', tests: [{ testId: 9522, name: 'Mathematik Kl. 8', booklet: 'A' }] },
    ])
  })

  it('accepts numeric and string IDs and grade levels', () => {
    expect(matchClasses([
      { groupId: 5460, groupLevel: 8, groupName: '8A', participatedTests: ['9522'] },
    ], tests)[0]?.tests[0]?.testId).toBe(9522)
  })

  it('loads both authenticated endpoints and opens the selected report', async () => {
    const fetchMock = mockLists()
    const wrapper = mountSelection()
    await flushPromises()
    expect(wrapper.get('[aria-label="Verfügbare Klassen"]').text()).toBe('8A8B')
    expect(fetchMock).toHaveBeenCalledWith(
      '/api-inio/test-groups/270/participated-groups',
      expect.objectContaining({ headers: { Authorization: 'Bearer test-token' } }),
    )
    expect(fetchMock).toHaveBeenCalledWith('/api-inio/test-groups/270/tests', expect.anything())
    await wrapper.get('[aria-label="Verfügbare Klassen"] button').trigger('click')
    expect(useReportSelectionStore().groupId).toBe(5460)
    expect(useReportSelectionStore().testId).toBe(9522)
    expect(replace).toHaveBeenCalledWith('/step-3?user=ABC')
    wrapper.unmount()
  })

  it('asks for a test when the selected class has multiple mathematics tests', async () => {
    mockLists([{ groupId: '5460', groupLevel: '8', groupName: '8A', participatedTests: [9522, 9524] }])
    const wrapper = mountSelection()
    await flushPromises()
    await wrapper.get('[aria-label="Verfügbare Klassen"] button').trigger('click')
    expect(replace).not.toHaveBeenCalled()
    expect(useReportSelectionStore().hasSelection).toBe(false)
    const testButtons = wrapper.findAll('[aria-label="Teilgenommene Mathematiktests"] button')
    expect(testButtons).toHaveLength(2)
    await testButtons[1]!.trigger('click')
    expect(useReportSelectionStore().testId).toBe(9524)
    expect(useReportSelectionStore().groupId).toBe(5460)
    wrapper.unmount()
  })

  it('shows an explicit empty state when no matching classes exist', async () => {
    mockLists([])
    const wrapper = mountSelection()
    await flushPromises()
    expect(wrapper.get('[role="status"]').text()).toContain('keine Klassen')
    expect(replace).not.toHaveBeenCalled()
    wrapper.unmount()
  })

  it('displays server failures and supports retry', async () => {
    vi.stubGlobal('fetch', vi.fn().mockImplementation(async () => new Response(JSON.stringify({
      success: false, message: 'Sitzung abgelaufen.',
    }), { status: 401, headers: { 'Content-Type': 'application/json' } })))
    const wrapper = mountSelection()
    await flushPromises()
    expect(wrapper.get('[role="alert"]').text()).toContain('Sitzung abgelaufen.')
    mockLists()
    await wrapper.get('[role="alert"] button').trigger('click')
    await flushPromises()
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
    expect(wrapper.findAll('[aria-label="Verfügbare Klassen"] button')).toHaveLength(2)
    wrapper.unmount()
  })

  it('rejects invalid IDs instead of silently falling back to demo data', () => {
    expect(() => matchClasses([
      { groupId: 'invalid', groupLevel: '8', groupName: '8A', participatedTests: [9522] },
    ], tests)).toThrow('Ungültige Klassen- oder Test-ID')
  })

  it('persists selection across reloads and clears it on logout and school changes', () => {
    useReportSelectionStore().select(5460, 9522, '8A')
    setActivePinia(createPinia())
    expect(useReportSelectionStore().groupId).toBe(5460)
    expect(useReportSelectionStore().testId).toBe(9522)
    useAuthStore().login('54321', 'another-token', 28800)
    expect(useReportSelectionStore().hasSelection).toBe(false)
    useReportSelectionStore().select(5462, 9524, '8B')
    useAuthStore().logout()
    expect(useReportSelectionStore().hasSelection).toBe(false)
    expect(sessionStorage.getItem('report-group-id')).toBeNull()
  })
})

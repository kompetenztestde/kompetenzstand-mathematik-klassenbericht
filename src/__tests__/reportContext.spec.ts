import { flushPromises, mount } from '@vue/test-utils'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { createPinia, setActivePinia } from 'pinia'
import { computed, defineComponent, ref } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuthStore } from '@/stores/auth'
import { useReportSelectionStore } from '@/stores/reportSelection'
import { useAllUserItemsNew, useGroupInfo, useSchoolForm, useTestData, useUserItemsNew } from '@/composables/useUserItems'
import { useAllAggregations } from '@/composables/useAggregations'
import { useOverallResultsNew } from '@/composables/useOverallResultsNew'
import { useSpecialCasesNew, useUserProperties } from '@/composables/useSpecialCasesNew'

const { items, aggregations, tests } = vi.hoisted(() => ({
  items: vi.fn(), aggregations: vi.fn(), tests: vi.fn(),
}))

vi.mock('@/queries/utils', () => ({ inioApiConfiguration: async () => ({}) }))
vi.mock('@tba3/api-new', () => ({
  ReportDataTba3Api: class {
    testGroupsTgIdTestsTestIdGroupsGroupIdItemsGet = items
    testGroupsTgIdTestsTestIdGroupsGroupIdAggregationsGet = aggregations
    testGroupsTgIdTestsGet = tests
  },
}))

beforeEach(() => {
  sessionStorage.clear()
  setActivePinia(createPinia())
  useAuthStore().login('12345', 'test-token', 28800)
  vi.clearAllMocks()
  items.mockResolvedValue({ data: { studentsData: [], groupData: {} } })
  aggregations.mockResolvedValue({ data: { studentsData: [], groupData: {} } })
  tests.mockResolvedValue({ data: [] })
})

function mountReports() {
  const codeValue = ref('ABC')
  const code = computed(() => codeValue.value)
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const wrapper = mount(defineComponent({
    setup() {
      useAllUserItemsNew()
      useGroupInfo()
      useSchoolForm(code)
      useTestData(code)
      useUserItemsNew(code)
      useAllAggregations()
      useOverallResultsNew(code)
      useSpecialCasesNew(code)
      useUserProperties(code)
      return () => null
    },
  }), { global: { plugins: [[VueQueryPlugin, { queryClient: client }]] } })
  return { wrapper, client, codeValue }
}

describe('dynamic report requests', () => {
  it('does not fetch any report data before a class and test are selected', async () => {
    const { wrapper, client } = mountReports()
    await flushPromises()
    expect(items).not.toHaveBeenCalled()
    expect(aggregations).not.toHaveBeenCalled()
    expect(tests).not.toHaveBeenCalled()
    wrapper.unmount()
    client.clear()
  })

  it('uses selected IDs in every report request and reacts to class, test and student changes', async () => {
    const selection = useReportSelectionStore()
    selection.select(5460, 9522, '8A')
    const { wrapper, client, codeValue } = mountReports()
    await flushPromises()
    expect(items).toHaveBeenCalledTimes(5)
    expect(aggregations).toHaveBeenCalledTimes(2)
    expect(tests).toHaveBeenCalledWith({ tgId: 270, testIds: '9522' })
    for (const mock of [items, aggregations]) {
      for (const [params] of mock.mock.calls) {
        expect(params).toMatchObject({ tgId: 270, groupId: 5460, testId: 9522 })
      }
    }

    vi.clearAllMocks()
    selection.select(5462, 9524, '8B')
    await flushPromises()
    expect(items).toHaveBeenCalled()
    expect(aggregations).toHaveBeenCalled()
    expect(tests).toHaveBeenCalledWith({ tgId: 270, testIds: '9524' })
    for (const mock of [items, aggregations]) {
      for (const [params] of mock.mock.calls) {
        expect(params).toMatchObject({ groupId: 5462, testId: 9524 })
      }
    }

    vi.clearAllMocks()
    codeValue.value = 'DEF'
    await flushPromises()
    expect(items).toHaveBeenCalledWith(expect.objectContaining({ studentCode: 'DEF' }))
    expect(aggregations).toHaveBeenCalledWith(expect.objectContaining({ studentCode: 'DEF' }))
    wrapper.unmount()
    client.clear()
  })

  it('keeps fixed fixture IDs only for demo sessions', async () => {
    useAuthStore().loginDemo('DEMO-TBA3-2026', 'DEMO-TBA3-2026')
    const { wrapper, client } = mountReports()
    await flushPromises()
    for (const [params] of items.mock.calls) {
      expect(params).toMatchObject({ groupId: 1001, testId: 9524 })
    }
    wrapper.unmount()
    client.clear()
  })
})

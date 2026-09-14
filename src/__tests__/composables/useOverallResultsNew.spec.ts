import { describe, it, expect, vi, beforeEach } from 'vitest'
import { computed } from 'vue'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { mount, flushPromises } from '@vue/test-utils'
import { useOverallResultsNew } from '../../composables/useOverallResultsNew'

vi.mock('@/queries/utils', () => ({
  inioApiConfiguration: vi.fn().mockResolvedValue({}),
}))

const mockGetAggregationsGet = vi.fn()

vi.mock('@tba3/api-new', () => ({
  ReportDataTba3Api: vi.fn().mockImplementation(function () {
    return {
      testGroupsTgIdTestsTestIdGroupsGroupIdAggregationsGet: mockGetAggregationsGet,
    }
  }),
}))

vi.mock('../../assets/competence_guidingideas_texts.json', () => ({
  default: {
    overallResult: {
      K5: 'Text K5',
      K4: 'Text K4',
      K3: 'Text K3',
      K2: 'Text K2',
      K1B: 'Text K1B',
      K1A: 'Text K1A',
    },
  },
}))

function withVueQuery<T>(composableFn: () => T) {
  let result: T
  const TestComponent = {
    setup() {
      result = composableFn()
      return () => null
    },
  }

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  })

  mount(TestComponent, {
    global: {
      plugins: [[VueQueryPlugin, { queryClient }]],
    },
  })

  return result!
}

describe('useOverallResultsNew', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const setupMockAggregations = (aggregations: unknown[]) => {
    mockGetAggregationsGet.mockResolvedValue({
      data: {
        studentsData: [{ code: 'CODE_123', aggregations }],
      },
    })
  }

  it('sollte null zurückgeben, wenn keine Aggregations vorhanden sind', async () => {
    setupMockAggregations([])
    const code = computed(() => 'CODE_123')
    const { overallResult } = withVueQuery(() => useOverallResultsNew(code))

    await flushPromises()

    expect(overallResult.value).toBeNull()
  })

  it('sollte K5 zurückgeben bei einem Score >= 35', async () => {
    setupMockAggregations([
      { descriptiveStatistics: { frequency: 35, total: 1 } },
    ])
    const code = computed(() => 'CODE_123')
    const { overallResult } = withVueQuery(() => useOverallResultsNew(code))

    await flushPromises()

    expect(overallResult.value).toEqual({
      score: 35,
      key: 'K5',
      text: 'Text K5',
    })
  })

  it('sollte K4 zurückgeben bei einem Score von 29 bis 34', async () => {
    setupMockAggregations([
      { descriptiveStatistics: { frequency: 29, total: 1 } },
    ])
    const code = computed(() => 'CODE_123')
    const { overallResult } = withVueQuery(() => useOverallResultsNew(code))

    await flushPromises()

    expect(overallResult.value?.key).toBe('K4')
    expect(overallResult.value?.score).toBe(29)
    expect(overallResult.value?.text).toBe('Text K4')
  })

  it('sollte K3 zurückgeben bei einem Score von 22 bis 28', async () => {
    setupMockAggregations([
      { descriptiveStatistics: { frequency: 22, total: 1 } },
    ])
    const code = computed(() => 'CODE_123')
    const { overallResult } = withVueQuery(() => useOverallResultsNew(code))

    await flushPromises()

    expect(overallResult.value?.key).toBe('K3')
  })

  it('sollte K2 zurückgeben bei einem Score von 15 bis 21', async () => {
    setupMockAggregations([
      { descriptiveStatistics: { frequency: 15, total: 1 } },
    ])
    const code = computed(() => 'CODE_123')
    const { overallResult } = withVueQuery(() => useOverallResultsNew(code))

    await flushPromises()

    expect(overallResult.value?.key).toBe('K2')
  })

  it('sollte K1B zurückgeben bei einem Score von 9 bis 14', async () => {
    setupMockAggregations([
      { descriptiveStatistics: { frequency: 9, total: 1 } },
    ])
    const code = computed(() => 'CODE_123')
    const { overallResult } = withVueQuery(() => useOverallResultsNew(code))

    await flushPromises()

    expect(overallResult.value?.key).toBe('K1B')
  })

  it('sollte K1A zurückgeben bei einem Score unter 9', async () => {
    setupMockAggregations([
      { descriptiveStatistics: { frequency: 8, total: 1 } },
    ])
    const code = computed(() => 'CODE_123')
    const { overallResult } = withVueQuery(() => useOverallResultsNew(code))

    await flushPromises()

    expect(overallResult.value?.key).toBe('K1A')
  })

  it('sollte die API mit den korrekten Parametern aufrufen', async () => {
    setupMockAggregations([])
    const code = computed(() => 'CODE_123')
    withVueQuery(() => useOverallResultsNew(code))

    await flushPromises()

    expect(mockGetAggregationsGet).toHaveBeenCalledWith({
      tgId: 270,
      groupId: 1001,
      testId: 9524,
      type: 'students',
      studentCode: 'CODE_123',
      aggregation: 'generalMathematicalCompetence',
    })
  })
})
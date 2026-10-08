import { describe, it, expect, vi, beforeEach } from 'vitest'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import {
  useAllAggregations,
  useCoreIdeaAggregations,
  useCompetencesAggregations,
  useCompetenceLevelsAggregations,
  useCognitiveDemandLevelAggregations,
  useTotalResultAggregations,
  useHomogeneityAggregation,
} from '../../composables/useAggregations'

vi.mock('@/types', () => ({
  GUIDE_MAP: {
    L1: 'Zahl und Zahlbereiche',
    L2: 'Messen und Größen',
  },
  COMPETENCE_MAP: {
    K1: 'Mathematisch argumentieren',
    K2: 'Probleme mathematisch lösen',
  },
}))

vi.mock('@/queries/utils', () => ({
  inioApiConfiguration: vi.fn().mockResolvedValue({}),
}))

const mockGetAggregations = vi.fn()
vi.mock('@tba3/api-new', () => ({
  ReportDataTba3Api: vi.fn().mockImplementation(function () {
    return {
      testGroupsTgIdTestsTestIdGroupsGroupIdAggregationsGet: mockGetAggregations,
    }
  }),
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

const mockAggregationsData = [
  {
    type: 'coreIdea',
    value: '1',
    descriptiveStatistics: { frequency: 10 },
  },
  {
    type: 'coreIdea',
    value: '99',
    descriptiveStatistics: { frequency: 5 },
  },
  {
    type: 'generalMathematicalCompetence',
    value: '1',
    descriptiveStatistics: { frequency: 8 },
  },
  {
    type: 'competenceLevel',
    value: 'Level 1',
  },
  {
    type: 'cognitiveDemandLevel',
    value: 'Anforderungsbereich I',
  },
  {
    type: 'total',
    value: 'total',
    descriptiveStatistics: {
      standardDeviation: 12.5,
    },
  },
]

describe('useAggregations Module', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    sessionStorage.clear()
    setActivePinia(createPinia())
    useAuthStore().loginDemo('DEMO-TBA3-2026', 'DEMO-TBA3-2026')
  })

  describe('useAllAggregations', () => {
    it('sollte Aggregationsdaten erfolgreich von der API abrufen', async () => {
      mockGetAggregations.mockResolvedValue({
        data: {
          groupData: {
            aggregations: mockAggregationsData,
          },
        },
      })

      const query = withVueQuery(() => useAllAggregations())
      const result = await query.refetch()

      expect(result.data).toEqual(mockAggregationsData)
      expect(mockGetAggregations).toHaveBeenCalledWith({
        tgId: 270,
        groupId: 1001,
        testId: 9524,
      })
    })

    it('sollte ein leeres Array zurückgeben, wenn aggregations undefined/null ist', async () => {
      mockGetAggregations.mockResolvedValue({
        data: { groupData: {} },
      })

      const query = withVueQuery(() => useAllAggregations())
      const result = await query.refetch()

      expect(result.data).toEqual([])
    })
  })

  describe('useCoreIdeaAggregations', () => {
    it('sollte nur coreIdea-Items filtern und displayTitle aus GUIDE_MAP mappen', async () => {
      mockGetAggregations.mockResolvedValue({
        data: { groupData: { aggregations: mockAggregationsData } },
      })

      const query = withVueQuery(() => useCoreIdeaAggregations())
      const result = await query.refetch()

      expect(result.data).toEqual([
        {
          type: 'coreIdea',
          value: '1',
          descriptiveStatistics: { frequency: 10 },
          displayTitle: 'Zahl und Zahlbereiche',
        },
        {
          type: 'coreIdea',
          value: '99',
          descriptiveStatistics: { frequency: 5 },
          displayTitle: '99',
        },
      ])
    })
  })

  describe('useCompetencesAggregations', () => {
    it('sollte nur generalMathematicalCompetence filtern und displayTitle aus COMPETENCE_MAP mappen', async () => {
      mockGetAggregations.mockResolvedValue({
        data: { groupData: { aggregations: mockAggregationsData } },
      })

      const query = withVueQuery(() => useCompetencesAggregations())
      const result = await query.refetch()

      expect(result.data).toEqual([
        {
          type: 'generalMathematicalCompetence',
          value: '1',
          descriptiveStatistics: { frequency: 8 },
          displayTitle: 'Mathematisch argumentieren',
        },
      ])
    })
  })

  describe('useCompetenceLevelsAggregations', () => {
    it('sollte nur competenceLevel Items filtern', async () => {
      mockGetAggregations.mockResolvedValue({
        data: { groupData: { aggregations: mockAggregationsData } },
      })

      const query = withVueQuery(() => useCompetenceLevelsAggregations())
      const result = await query.refetch()

      expect(result.data).toEqual([
        {
          type: 'competenceLevel',
          value: 'Level 1',
        },
      ])
    })
  })

  describe('useCognitiveDemandLevelAggregations', () => {
    it('sollte nur cognitiveDemandLevel Items filtern', async () => {
      mockGetAggregations.mockResolvedValue({
        data: { groupData: { aggregations: mockAggregationsData } },
      })

      const query = withVueQuery(() => useCognitiveDemandLevelAggregations())
      const result = await query.refetch()

      expect(result.data).toEqual([
        {
          type: 'cognitiveDemandLevel',
          value: 'Anforderungsbereich I',
        },
      ])
    })
  })

  describe('useTotalResultAggregations', () => {
    it('sollte nur total Items filtern', async () => {
      mockGetAggregations.mockResolvedValue({
        data: { groupData: { aggregations: mockAggregationsData } },
      })

      const query = withVueQuery(() => useTotalResultAggregations())
      const result = await query.refetch()

      expect(result.data).toEqual([
        {
          type: 'total',
          value: 'total',
          descriptiveStatistics: {
            standardDeviation: 12.5,
          },
        },
      ])
    })
  })

  describe('useHomogeneityAggregation', () => {
    it('sollte die Homogenitätswerte korrekt berechnen (sdClass = 12.5 -> 50%)', async () => {
      mockGetAggregations.mockResolvedValue({
        data: { groupData: { aggregations: mockAggregationsData } },
      })

      const query = withVueQuery(() => useHomogeneityAggregation())
      const result = await query.refetch()

      expect(result.data).toEqual({
        totalItem: mockAggregationsData[5],
        sdClass: 12.5,
        classPercent: 50,
      })
    })

    it('sollte classPercent bei 100% deckeln, wenn SD > MAX_SD', async () => {
      const highSdData = [
        {
          type: 'total',
          descriptiveStatistics: { standardDeviation: 50 },
        },
      ]

      mockGetAggregations.mockResolvedValue({
        data: { groupData: { aggregations: highSdData } },
      })

      const query = withVueQuery(() => useHomogeneityAggregation())
      const result = await query.refetch()

      expect(result.data?.classPercent).toBe(100)
    })

    it('sollte null zurückgeben, wenn kein total-Item oder keine descriptiveStatistics vorhanden sind', async () => {
      mockGetAggregations.mockResolvedValue({
        data: {
          groupData: {
            aggregations: [{ type: 'total' }],
          },
        },
      })

      const query = withVueQuery(() => useHomogeneityAggregation())
      const result = await query.refetch()

      expect(result.data).toBeNull()
    })
  })
})

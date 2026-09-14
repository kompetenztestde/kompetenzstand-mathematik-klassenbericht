import { describe, it, expect, vi, beforeEach } from 'vitest'
import { computed } from 'vue'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { mount, flushPromises } from '@vue/test-utils'
import {
  useUserItems,
  useUserItemsNew,
  calculateUserStats,
  useSchoolForm,
  useTestData,
  useAllUserItemsNew,
  getBestAndWorstExercises,
  useGroupInfo,
} from '../../composables/useUserItems'

vi.mock('@/queries/utils', () => ({
  apiConfiguration: vi.fn().mockResolvedValue({}),
  inioApiConfiguration: vi.fn().mockResolvedValue({}),
}))

const mockGetGroupItems = vi.fn()
const mockGetItemsGet = vi.fn()
const mockGetTestsGet = vi.fn()

vi.mock('@tba3/api-resources', () => ({
  GroupsApi: vi.fn().mockImplementation(function () {
    return { getGroupItems: mockGetGroupItems }
  }),
}))

vi.mock('@tba3/api-new', () => ({
  ReportDataTba3Api: vi.fn().mockImplementation(function () {
    return {
      testGroupsTgIdTestsTestIdGroupsGroupIdItemsGet: mockGetItemsGet,
      testGroupsTgIdTestsGet: mockGetTestsGet,
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

describe('useUserItems Module', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('calculateUserStats', () => {
    it('sollte 0-Werte zurückgeben, wenn keine Items übergeben werden', () => {
      expect(calculateUserStats(undefined)).toEqual({ correct: 0, total: 0, percentage: 0 })
      expect(calculateUserStats([])).toEqual({ correct: 0, total: 0, percentage: 0 })
    })

    it('sollte die Richtig-Quote und Prozentzahl korrekt berechnen', () => {
      const items = [
        { descriptiveStatistics: { frequency: 1 } },
        { descriptiveStatistics: { frequency: 0 } },
        { descriptiveStatistics: { frequency: 1 } },
        { descriptiveStatistics: { frequency: -1 } },
      ]

      const stats = calculateUserStats(items)
      expect(stats).toEqual({
        correct: 2,
        total: 4,
        percentage: 50,
      })
    })
  })

  describe('useUserItems', () => {
    it('sollte Items für den angegebenen User abrufen', async () => {
      const mockUsers = [
        { name: 'user1', items: [{ id: 1 }, { id: 2 }] },
        { name: 'user2', items: [{ id: 3 }] },
      ]
      mockGetGroupItems.mockResolvedValue(mockUsers)

      const userName = computed(() => 'user1')
      const query = withVueQuery(() => useUserItems(userName))

      const items = await query.refetch()
      expect(items.data).toEqual([{ id: 1 }, { id: 2 }])
      expect(mockGetGroupItems).toHaveBeenCalledWith({ id: '8b-mathe', type: 'students' })
    })

    it('sollte deaktiviert sein, wenn kein userName gesetzt ist', () => {
      const userName = computed(() => undefined)
      const query = withVueQuery(() => useUserItems(userName))

      expect(query.isEnabled.value).toBe(false)
    })
  })

  describe('useUserItemsNew', () => {
    it('sollte User-Items, Matrix und Stats abrufen', async () => {
      mockGetItemsGet.mockResolvedValue({
        data: {
          studentsData: [
            {
              code: 'CODE_123',
              items: [
                { descriptiveStatistics: { frequency: 1 } },
                { descriptiveStatistics: { frequency: 0 } },
              ],
            },
            {
              code: 'CODE_456',
              items: [{ descriptiveStatistics: { frequency: 1 } }],
            },
          ],
        },
      })

      const code = computed(() => 'CODE_123')
      const result = withVueQuery(() => useUserItemsNew(code))

      await result.refetch()

      expect(result.data.value).toEqual([
        { descriptiveStatistics: { frequency: 1 } },
        { descriptiveStatistics: { frequency: 0 } },
      ])
      expect(result.classItemsMatrix.value).toHaveLength(2)
      expect(result.stats.value).toEqual({
        correct: 1,
        total: 2,
        percentage: 50,
      })
    })
  })

  describe('useSchoolForm', () => {
    it('sollte die Schulform aus den Gruppendaten zurückgeben', async () => {
      mockGetItemsGet.mockResolvedValue({
        data: {
          groupData: { schoolForm: 'Gymnasium' },
        },
      })

      const code = computed(() => 'CODE_123')
      const query = withVueQuery(() => useSchoolForm(code))

      const response = await query.refetch()
      expect(response.data).toBe('Gymnasium')
    })

    it('sollte null zurückgeben, wenn keine Daten vorhanden sind', async () => {
      mockGetItemsGet.mockResolvedValue({ data: {} })

      const code = computed(() => 'CODE_123')
      const query = withVueQuery(() => useSchoolForm(code))

      const response = await query.refetch()
      expect(response.data).toBeNull()
    })
  })

  describe('useTestData', () => {
    it('sollte Testdaten abrufen', async () => {
      const mockTestResponse = [{ id: 9524, subject: 'Mathematik' }]
      mockGetTestsGet.mockResolvedValue({ data: mockTestResponse })

      const code = computed(() => 'CODE_123')
      const query = withVueQuery(() => useTestData(code))

      const response = await query.refetch()
      expect(response.data).toEqual(mockTestResponse)
      expect(mockGetTestsGet).toHaveBeenCalledWith({
        tgId: 270,
        testIds: '9524',
      })
    })
  })

  describe('useAllUserItemsNew', () => {
    it('sollte alle Schülerdaten abrufen und Gesamt-Stats berechnen', async () => {
      const mockStudents = [
        { code: 'S1', items: [{ descriptiveStatistics: { frequency: 1 } }] },
        { code: 'S2', items: [{ descriptiveStatistics: { frequency: 0 } }] },
      ]
      mockGetItemsGet.mockResolvedValue({
        data: { studentsData: mockStudents },
      })

      const result = withVueQuery(() => useAllUserItemsNew())
      await result.refetch()

      expect(result.data.value).toEqual(mockStudents)
      expect(mockGetItemsGet).toHaveBeenCalledWith({
        tgId: 270,
        groupId: 1001,
        testId: 9524,
        type: 'students',
      })
    })
  })

  describe('getBestAndWorstExercises', () => {
    it('sollte die besten und schlechtesten Aufgaben basierend auf Abweichung sortieren', async () => {
      mockGetItemsGet.mockResolvedValue({
        data: {
          studentsData: [
            {
              code: 'S1',
              items: [
                {
                  iqbId: 'task-1',
                  descriptiveStatistics: { frequency: 1 },
                  parameters: { solutionFrequencyGymnasium: 50 },
                },
                {
                  iqbId: 'task-2',
                  descriptiveStatistics: { frequency: 0 },
                  parameters: { solutionFrequencyGymnasium: 80 },
                },
              ],
            },
          ],
        },
      })

      const exercisesComputed = withVueQuery(() => getBestAndWorstExercises())
      await flushPromises()

      const result = exercisesComputed.value
      expect(result.bestThreeGlobal.length).toBeGreaterThan(0)
      expect(result.worstThreeGlobal.length).toBeGreaterThan(0)

      expect(result.bestThreeGlobal[0]?.iqbId).toBe('task-1')
      expect(result.worstThreeGlobal[0]?.iqbId).toBe('task-2')
    })
  })

  describe('useGroupInfo', () => {
    it('sollte Gruppeninformationen abrufen', async () => {
      mockGetItemsGet.mockResolvedValue({
        data: {
          groupData: {
            groupName: 'Klasse 8b',
            items: [{ id: 'item1' }],
          },
          studentsData: [{ code: 'S1' }],
        },
      })

      const result = withVueQuery(() => useGroupInfo())
      await result.refetch()

      expect(result.groupName.value).toBe('Klasse 8b')
      expect(result.items.value).toEqual([{ id: 'item1' }])
      expect(mockGetItemsGet).toHaveBeenCalledWith({
        tgId: 270,
        groupId: 1001,
        testId: 9524,
        type: 'group',
      })
    })
  })
})

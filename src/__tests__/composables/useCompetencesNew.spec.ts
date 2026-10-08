import { describe, it, expect, vi } from 'vitest'
import { ref, computed } from 'vue'
import { useCompetencesNew } from '../../composables/useCompetencesNew'

vi.mock('@/services/configService', () => ({
  configJson: {
    competence_texts: {
      K1: { text: { excellent: 'K1 Text' }, description: { text: 'K1 Desc' } },
      K2: { text: { excellent: 'K2 Text' }, description: { text: 'K2 Desc' } },
      K3: { text: { excellent: 'K3 Text' }, description: { text: 'K3 Desc' } },
      K4: { text: { excellent: 'K4 Text' }, description: { text: 'K4 Desc' } },
      K5: { text: { excellent: 'K5 Text' }, description: { text: 'K5 Desc' } },
      K6: { text: { excellent: 'K6 Text' }, description: { text: 'K6 Desc' } },
    },
  },
}))

const mockData = ref<any[]>([])
vi.mock('@/composables/useUserItems', () => ({
  useUserItemsNew: () => ({
    data: mockData,
  }),
}))

describe('useCompetencesNew', () => {
  it('sollte leere Standardwerte liefern, wenn keine Daten vorhanden sind', () => {
    mockData.value = []
    const userCode = computed(() => 'TEST_CODE')
    const { competenceStats, topPerformers, badPerformers } = useCompetencesNew(userCode)

    expect(competenceStats.value['K1']?.hits).toBe(0)
    expect(competenceStats.value['K1']?.total).toBe(0)
    expect(topPerformers.value).toEqual([])
    expect(badPerformers.value).toHaveLength(6)
  })

  it('sollte Prozentsätze und Treffer für Kompetenzen korrekt berechnen', () => {
    mockData.value = [
      {
        parameters: {
          generalMathematicalCompetence: [{ nameShort: '1' }],
          solutionFrequencyGymnasium: 0.8,
          solutionFrequencyNonGymnasium: 0.6,
        },
        descriptiveStatistics: { frequency: 1 },
      },
      {
        parameters: {
          generalMathematicalCompetence: [{ nameShort: '1' }],
          solutionFrequencyGymnasium: 0.8,
          solutionFrequencyNonGymnasium: 0.6,
        },
        descriptiveStatistics: { frequency: 0 },
      },
    ]

    const userCode = computed(() => 'TEST_CODE')
    const { competenceStats } = useCompetencesNew(userCode)

    const k1 = competenceStats.value['K1']

    expect(k1).toBeDefined()
    if (k1) {
      expect(k1.total).toBe(2)
      expect(k1.hits).toBe(1)
      expect(k1.percentage).toBe(50)
    }
  })

  it('sollte badPerformers filtern (Prozentsatz < 80%)', () => {
    mockData.value = [
      {
        parameters: { generalMathematicalCompetence: [{ nameShort: '1' }] },
        descriptiveStatistics: { frequency: 1 },
      },
    ]

    const userCode = computed(() => 'TEST_CODE')
    const { badPerformers } = useCompetencesNew(userCode)

    const k1InBad = badPerformers.value.find((b) => b.label === 'K1' || b.label === 'Modellieren')
    expect(k1InBad).toBeUndefined()
  })
})

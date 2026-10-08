import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { useClassStatsNew } from '../../composables/useClassStats'

describe('useClassStatsNew', () => {
  const createItem = (freq: number, coreIdeaShort?: string, compShort?: string) => ({
    descriptiveStatistics: { frequency: freq },
    parameters: {
      ...(coreIdeaShort && { coreIdea: { nameShort: coreIdeaShort } }),
      ...(compShort && {
        generalMathematicalCompetence: [{ nameShort: compShort }],
      }),
    },
  })

  it('sollte 0-Werte liefern, wenn die Schülerliste leer oder undefined ist', () => {
    const allStudentsItems = ref<any[][]>([])
    const hiddenLabels = ref(new Set<string>())

    const { liveClassStats } = useClassStatsNew(allStudentsItems, hiddenLabels)

    expect(liveClassStats.value).toEqual({
      total: { hits: 0, total: 0, percentage: 0 },
      coreIdeas: {},
      competences: {},
    })
  })

  it('sollte Treffer, Gesamtanzahl und Prozentwerte für Total, CoreIdeas und Competences korrekt berechnen', () => {
    const allStudentsItems = ref([
      [createItem(1, '1', '1'), createItem(0, '1', '2')],
      [createItem(1, '2', '1'), createItem(-1, '2', '2')],
    ])
    const hiddenLabels = ref(new Set<string>())

    const { liveClassStats } = useClassStatsNew(allStudentsItems, hiddenLabels)
    const stats = liveClassStats.value

    expect(stats.total).toEqual({ hits: 2, total: 4, percentage: 50 })

    expect(stats.coreIdeas['L1']).toEqual({ hits: 1, total: 2, percentage: 50 })
    expect(stats.coreIdeas['L2']).toEqual({ hits: 1, total: 2, percentage: 50 })

    expect(stats.competences['K1']).toEqual({ hits: 2, total: 2, percentage: 100 })
    expect(stats.competences['K2']).toEqual({ hits: 0, total: 2, percentage: 0 })
  })

  it('sollte Items mit unvollständigen/ungültigen Frequenzen ignorieren', () => {
    const allStudentsItems = ref([
      [
        createItem(1, '1', '1'),
        { descriptiveStatistics: { frequency: 99 } },
        { descriptiveStatistics: {} },
        { parameters: {} },
      ],
    ])
    const hiddenLabels = ref(new Set<string>())

    const { liveClassStats } = useClassStatsNew(allStudentsItems, hiddenLabels)

    expect(liveClassStats.value.total).toEqual({ hits: 1, total: 1, percentage: 100 })
  })

  it('sollte gefilterte Items (aus hiddenLabels) aus den Stats ausschließen', () => {
    const allStudentsItems = ref([
      [createItem(1, '1', '1'), createItem(1, '2', '2'), createItem(1, '3', '3')],
    ])
    const hiddenLabels = ref(new Set<string>(['L1', 'K2']))

    const { liveClassStats } = useClassStatsNew(allStudentsItems, hiddenLabels)
    const stats = liveClassStats.value

    expect(stats.total).toEqual({ hits: 1, total: 1, percentage: 100 })
    expect(stats.coreIdeas['L1']).toBeUndefined()
    expect(stats.competences['K2']).toBeUndefined()
    expect(stats.coreIdeas['L3']).toBeDefined()
  })

  it('sollte dynamisch auf Änderungen an allStudentsItems und hiddenLabels reagieren', () => {
    const allStudentsItems = ref<any[][]>([[createItem(1, '1', '1')]])
    const hiddenLabels = ref(new Set<string>())

    const { liveClassStats } = useClassStatsNew(allStudentsItems, hiddenLabels)

    expect(liveClassStats.value.total.total).toBe(1)

    allStudentsItems.value.push([createItem(0, '1', '1')])
    expect(liveClassStats.value.total).toEqual({ hits: 1, total: 2, percentage: 50 })

    hiddenLabels.value.add('L1')
    expect(liveClassStats.value.total).toEqual({ hits: 0, total: 0, percentage: 0 })
  })
})

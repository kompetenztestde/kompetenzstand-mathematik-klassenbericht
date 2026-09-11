import { describe, it, expect } from 'vitest'
import { computed } from 'vue'
import { useNavigation } from '../../composables/useNavigation'

interface Performer {
  label: string
  hits: number
  total: number
  percentage: number
}

describe('useNavigation', () => {
  it('sollte immer die statische Liste der Schritte 1 bis 7 zurückgeben', () => {
    const competenceTopPerformers = computed<Performer[]>(() => [])
    const guidingIdeaTopPerformers = computed<Performer[]>(() => [])
    const badPerformers = computed<Performer[]>(() => [])

    const { allSteps } = useNavigation(
      competenceTopPerformers,
      guidingIdeaTopPerformers,
      badPerformers,
    )

    expect(allSteps.value).toEqual([
      { path: '/step-1', sub: null },
      { path: '/step-2', sub: null },
      { path: '/step-3', sub: null },
      { path: '/step-4', sub: null },
      { path: '/step-5', sub: null },
      { path: '/step-6', sub: null },
      { path: '/step-7', sub: null },
    ])
  })

  it('sollte exakt 7 Elemente in allSteps enthalten', () => {
    const competenceTopPerformers = computed<Performer[]>(() => [])
    const guidingIdeaTopPerformers = computed<Performer[]>(() => [])
    const badPerformers = computed<Performer[]>(() => [])

    const { allSteps } = useNavigation(
      competenceTopPerformers,
      guidingIdeaTopPerformers,
      badPerformers,
    )

    expect(allSteps.value).toHaveLength(7)
  })
})

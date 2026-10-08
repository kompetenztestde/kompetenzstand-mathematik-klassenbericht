import { computed, ref, type Ref } from 'vue'

const getCoreIdeaKey = (item: any): string => {
  const guide = item?.parameters?.coreIdea
  return guide?.nameShort ? `L${guide.nameShort}` : ''
}

const getCompetenceKey = (item: any): string => {
  const comp = item?.parameters?.generalMathematicalCompetence?.[0]
  return comp?.nameShort ? `K${comp.nameShort}` : ''
}

export function useClassStatsNew(allStudentsItems: Ref<any[][]>, hiddenLabels: Ref<Set<string>>) {
  const filteredClassItems = computed(() => {
    const flatItems: any[] = []

    if (!allStudentsItems.value) return flatItems

    allStudentsItems.value.forEach((studentItems) => {
      if (!Array.isArray(studentItems)) return

      studentItems.forEach((item) => {
        const coreIdeaKey = getCoreIdeaKey(item)
        const compKey = getCompetenceKey(item)

        if (hiddenLabels.value.has(coreIdeaKey) || hiddenLabels.value.has(compKey)) {
          return
        }

        flatItems.push(item)
      })
    })

    return flatItems
  })

  const liveClassStats = computed(() => {
    const items = filteredClassItems.value

    const stats = {
      total: { hits: 0, total: 0, percentage: 0 },
      coreIdeas: {} as Record<string, { hits: number; total: number; percentage: number }>,
      competences: {} as Record<string, { hits: number; total: number; percentage: number }>,
    }

    items.forEach((item) => {
      const freq = item.descriptiveStatistics?.frequency
      if (freq !== 1 && freq !== 0 && freq !== -1) return

      const isHit = freq === 1
      const coreIdeaKey = getCoreIdeaKey(item)
      const compKey = getCompetenceKey(item)

      stats.total.total++
      if (isHit) stats.total.hits++

      if (coreIdeaKey) {
        if (!stats.coreIdeas[coreIdeaKey])
          stats.coreIdeas[coreIdeaKey] = { hits: 0, total: 0, percentage: 0 }
        stats.coreIdeas[coreIdeaKey].total++
        if (isHit) stats.coreIdeas[coreIdeaKey].hits++
      }

      if (compKey) {
        if (!stats.competences[compKey])
          stats.competences[compKey] = { hits: 0, total: 0, percentage: 0 }
        stats.competences[compKey].total++
        if (isHit) stats.competences[compKey].hits++
      }
    })

    stats.total.percentage =
      stats.total.total > 0 ? Math.round((stats.total.hits / stats.total.total) * 100) : 0

    Object.values(stats.coreIdeas).forEach((s) => {
      s.percentage = s.total > 0 ? Math.round((s.hits / s.total) * 100) : 0
    })
    Object.values(stats.competences).forEach((s) => {
      s.percentage = s.total > 0 ? Math.round((s.hits / s.total) * 100) : 0
    })

    return stats
  })

  return {
    liveClassStats,
  }
}

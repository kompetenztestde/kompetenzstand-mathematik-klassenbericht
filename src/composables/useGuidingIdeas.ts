import { computed, ref, type ComputedRef } from 'vue'
import { GUIDE_MAP, type GuideKey } from '@/types'
import guidingIdeaTexts from '../assets/competence_guidingideas_texts.json'
import { useUserItems } from './useUserItems'

const activeSubStep = ref(0)

export function useGuidingIdeas(userName: ComputedRef<string | undefined>) {
  const { data: data } = useUserItems(userName)

  const guidingIdeaStats = computed(() => {
    const stats: Record<
      string,
      {
        label: string
        text: string
        description: string
        hits: number
        total: number
        percentage: number
      }
    > = {}

    ;(Object.keys(GUIDE_MAP) as GuideKey[]).forEach((key) => {
      stats[key] = {
        label: GUIDE_MAP[key],
        text: guidingIdeaTexts.guiding_ideas_texts[key].text.excellent,
        description: guidingIdeaTexts.guiding_ideas_texts[key].description,
        hits: 0,
        total: 0,
        percentage: 0,
      }
    })

    if (!data.value) return stats

    data.value.forEach((item) => {
      const guide = item.parameters?.competences?.find((c) => c.type === 'Leitidee')
      const freq = item.descriptiveStatistics?.frequency
      const key = guide?.name as GuideKey

      if (key && stats[key]) {
        if (freq === 1 || freq === 0 || freq === -1) {
          stats[key].total++
          if (freq === 1) stats[key].hits++
        }
      }
    })

    Object.values(stats).forEach((s) => {
      s.percentage = s.total > 0 ? Math.round((s.hits / s.total) * 100) : 0
    })
    return stats
  })

  const topPerformers = computed(() => {
    if (!guidingIdeaStats.value) return []
    return Object.values(guidingIdeaStats.value).filter((s) => s.percentage >= 80)
  })

  const badPerformers = computed(() => {
    if (!data.value || data.value.length === 0) return []
    return Object.values(guidingIdeaStats.value).filter((s) => s.percentage <= 60)
  })

  const extraStepsCount = computed(() => {
    return topPerformers.value.length > 0 ? topPerformers.value.length - 1 : 0
  })

  const areas: number[][] = guidingIdeaTexts.areas.middleCertificate

  const calculatedAreas = computed(() => {
    const rawAreas = guidingIdeaTexts.areas.middleCertificate

    if (!rawAreas || rawAreas.length === 0) {
      return [33, 66, 100]
    }

    const lastElement = rawAreas[rawAreas.length - 1]
    const maxVal = (lastElement && lastElement[1]) ?? 100

    return rawAreas.map((range) => {
      const val = range[1] ?? 0

      return maxVal > 0 ? Math.round((val / maxVal) * 100) : 0
    })
  })
  return {
    topPerformers,
    badPerformers,
    extraStepsCount,
    activeSubStep,
    guidingIdeaStats,
    calculatedAreas,
  }
}

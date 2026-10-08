import { computed, ref, type ComputedRef } from 'vue'
import { GUIDE_MAP, type GuideKey } from '@/types'
import guidingIdeaTexts from '../assets/competence_guidingideas_texts.json'
import { useSchoolForm, useTestData, useUserItemsNew } from './useUserItems'

const activeSubStep = ref(0)

interface CoreIdeaObject {
  description?: string
  name?: string
  nameShort?: string
}

interface CutOffLevels {
  lower: number[]
  middle: number[]
  upper: number[]
}

interface CutOffs {
  gym: CutOffLevels
  nonGym: CutOffLevels
}

export function useGuidingIdeasNew(code: ComputedRef<string | undefined>) {
  const { data: items, isLoading } = useUserItemsNew(code)
  const { data: schoolForm } = useSchoolForm(code)
  const { data: testInfo } = useTestData(code)

  const isGymMode = computed(() => {
    const testSubject = guidingIdeaTexts.testInfo.subject
    const currentTest = testInfo.value?.filter((test) => testSubject.includes(test.subject ?? ''))
    const currentBooklet = currentTest?.[0]?.booklet

    const isGymBooklet = currentBooklet
      ? guidingIdeaTexts.testInfo.booklet.gym.includes(currentBooklet)
      : null
    const isNonGymBooklet = currentBooklet
      ? guidingIdeaTexts.testInfo.booklet.nonGym?.includes(currentBooklet)
      : null

    if (isGymBooklet) return true
    if (isNonGymBooklet) return false

    return schoolForm.value === 'Gymnasium'
  })

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
        cutOffs: CutOffs
        areas: number[]
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
        cutOffs: guidingIdeaTexts.guiding_ideas_texts[key].cutOffs,
        areas: [33, 66, 100],
      }
    })

    if (!items.value || items.value.length === 0) return stats

    items.value.forEach((item) => {
      const parameters = item.parameters
      const guide = parameters?.coreIdea as CoreIdeaObject

      const freq = item.descriptiveStatistics?.frequency
      const key = `L${guide.nameShort as GuideKey}`

      if (key && stats[key]) {
        if (freq === 1 || freq === 0 || freq === -1) {
          stats[key].total++
          if (freq === 1) stats[key].hits++
        }
      }
    })

    const useGymSpecs = isGymMode.value

    Object.entries(stats).forEach(([k, s]) => {
      const key = k as keyof typeof guidingIdeaTexts.guiding_ideas_texts
      s.percentage = s.total > 0 ? Math.round((s.hits / s.total) * 100) : 0
      if (s.total > 0 && s.cutOffs?.gym) {
        const gym = useGymSpecs ? s.cutOffs.gym : s.cutOffs.nonGym

        const reference = s.total > 0 ? s.total : 1

        const lowerMax = gym.lower?.[gym.lower.length - 1] ?? Math.round(reference * 0.33)
        const middleMax = gym.middle?.[gym.middle.length - 1] ?? Math.round(reference * 0.66)
        const upperMax = gym.upper?.[gym.upper.length - 1] ?? reference

        s.areas = [
          Math.round((lowerMax / reference) * 100),
          Math.round((middleMax / reference) * 100),
          Math.round((upperMax / reference) * 100),
        ]

        const percentage = (s.hits / s.total) * 100
        if (percentage >= (s.areas[1] ?? 66)) {
          s.text = guidingIdeaTexts.guiding_ideas_texts[key].text.good
        }
        if ((s.areas[1] ?? 66) > percentage && percentage > (s.areas[0] ?? 33)) {
          s.text = guidingIdeaTexts.guiding_ideas_texts[key].text.normal
        }
        if (percentage <= (s.areas[0] ?? 33)) {
          s.text = guidingIdeaTexts.guiding_ideas_texts[key].text.bad
        }
      } else {
        s.areas = [33, 66, 100]
      }
    })
    console.log('STATS', stats)
    return stats
  })

  const topPerformers = computed(() => {
    const allGuides = Object.values(guidingIdeaStats.value)
    const qualified = allGuides.filter((s) => {
      if (s.total < 5) return false

      const upperThreshold = s.cutOffs?.gym?.middle?.[0] ?? Infinity

      return s.hits >= upperThreshold
    })
    const sortedTopPerformers = qualified.sort((a, b) => b.percentage - a.percentage)
    if (sortedTopPerformers.length > 0 && sortedTopPerformers[0]) {
      const bestPerformer = sortedTopPerformers[0]

      const guideKey = (Object.keys(GUIDE_MAP) as GuideKey[]).find(
        (key) => GUIDE_MAP[key] === bestPerformer.label,
      )

      if (guideKey) {
        bestPerformer.text = guidingIdeaTexts.guiding_ideas_texts[guideKey].text.excellent
      }
    }
    return qualified.sort((a, b) => b.percentage - a.percentage)
  })

  const badPerformers = computed(() => {
    if (!items.value || items.value.length === 0) return []
    return Object.values(guidingIdeaStats.value).filter((s) => {
      const lowerThreshold = s.cutOffs?.gym?.lower?.[s.cutOffs.gym.lower.length - 1] ?? -1
      return s.hits <= lowerThreshold && s.total > 0
    })
  })

  const extraStepsCount = computed(() => {
    return topPerformers.value.length > 0 ? topPerformers.value.length - 1 : 0
  })

  const calculatedAreas = computed(() => {
    const useGymSpecs = isGymMode.value
    const rawAreas = useGymSpecs
      ? guidingIdeaTexts?.areas?.middleCertificate
      : guidingIdeaTexts?.areas?.defaultCertificate

    if (!Array.isArray(rawAreas) || rawAreas.length === 0) {
      return [33, 66, 100]
    }

    const lastElement = rawAreas[rawAreas.length - 1]
    const maxVal = (lastElement && lastElement[1]) ?? 100

    return rawAreas.map((range) => {
      const val = range[1] ?? 0
      return maxVal > 0 ? Math.round((val / maxVal) * 100) : 0
    })
  })

  console.log('Topperformer', topPerformers.value)
  console.log('badPerformers', badPerformers.value)
  console.log('AllGuides', Object.values(guidingIdeaStats.value))

  return {
    topPerformers,
    badPerformers,
    extraStepsCount,
    activeSubStep,
    guidingIdeaStats,
    calculatedAreas,
    isLoading,
  }
}

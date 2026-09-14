import { computed, ref, type ComputedRef } from 'vue'
import { COMPETENCE_MAP, type CompetenceKey } from '@/types'
import competenceTexts from '../assets/competence_guidingideas_texts.json'
import { useUserItems } from './useUserItems'

const activeSubStep = ref(0)

export function useCompetences(userName: ComputedRef<string | undefined>) {
    const { data: data } = useUserItems(userName)
    const competenceStats = computed(() => {
        if (!data.value) return {}
        const stats: Record<string, { label: string; text: string; hits: number; total: number; percentage: number; description: string }> =
            {}

        ;(Object.keys(COMPETENCE_MAP) as CompetenceKey[]).forEach((key) => {
            stats[key] = {
                label: COMPETENCE_MAP[key],
                text: competenceTexts.competence_texts[key].text.excellent,
                description: competenceTexts.competence_texts[key].description.text,
                hits: 0,
                total: 0,
                percentage: 0,
            }
        })

        if (!data.value) return stats

        data.value.forEach((item) => {
            const competence = item.parameters?.competences?.find((c) => c.type === 'Allgemeine Kompetenz')
            const freq = item.descriptiveStatistics?.frequency
            const key = competence?.name as CompetenceKey

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
        if (!competenceStats.value) return []
        const candidates = Object.values(competenceStats.value).filter((s) => s.percentage > 80)
        return candidates.filter((item, index, self) => index === self.findIndex((t) => t.label === item.label))
    })

    const badPerformers = computed(() => {
        if (!competenceStats.value) return []
        const candidates = Object.values(competenceStats.value).filter((s) => s.percentage < 80)
        return candidates.filter((item, index, self) => index === self.findIndex((t) => t.label === item.label))
    })
    const extraStepsCount = computed(() => {
        return topPerformers.value.length > 0 ? topPerformers.value.length - 1 : 0
    })

    return {
        topPerformers,
        badPerformers,
        extraStepsCount,
        activeSubStep,
        competenceStats,
    }
}

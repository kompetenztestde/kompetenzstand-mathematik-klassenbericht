import { computed, type ComputedRef } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { apiConfiguration } from '@/queries/utils'
import { GroupsApi } from '@tba3/api-resources'
import competenceTexts from '../assets/competence_guidingideas_texts.json'

export function useSpecialCases(userName: ComputedRef<string | undefined>) {
    const { data: aggregations } = useUserAggregations(userName)
    const specialCaseResult = computed(() => {
        if (!aggregations.value || aggregations.value.length === 0) return null

        console.log(aggregations.value)
        const totalScore = aggregations.value.reduce((acc, curr) => {
            const val = curr.descriptiveStatistics?.frequency ?? 0
            const max = curr.descriptiveStatistics?.total
            const res = Math.round(val / max)
            return acc + res
        }, 0)

        let key = ''
        if (totalScore >= 35) key = 'K5'
        else if (totalScore >= 29) key = 'K4'
        else if (totalScore >= 22) key = 'K3'
        else if (totalScore >= 15) key = 'K2'
        else if (totalScore >= 9) key = 'K1B'
        else key = 'K1A'

        return {
            score: totalScore,
            key: key,
            text: competenceTexts.specialCases[key as keyof typeof competenceTexts.specialCases],
            resultAndAdvice: competenceTexts.specialCasesAdvices[key as keyof typeof competenceTexts.specialCases],
        }
    })

    return {
        specialCaseResult,
    }
}

function useUserAggregations(userName: ComputedRef<string | undefined>) {
    return useQuery({
        queryKey: ['user-aggregations-base', userName.value],
        queryFn: async () => {
            if (!userName.value) return []
            const config = await apiConfiguration()
            const api = new GroupsApi(config)
            const response = await api.getGroupAggregations({
                id: '8b-mathe',
                type: 'students',

                aggregation: 'competence',
            })

            const targetUser = response.find((u) => u.name === userName.value)
            return targetUser?.aggregations ?? []
        },
        enabled: computed(() => !!userName.value),
        staleTime: 1000 * 60 * 60,
    })
}

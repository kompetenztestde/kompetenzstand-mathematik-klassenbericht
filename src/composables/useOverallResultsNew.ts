import { computed, type ComputedRef } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { inioApiConfiguration } from '@/queries/utils'
import competenceTexts from '../assets/competence_guidingideas_texts.json'
import { ReportDataTba3Api } from '@tba3/api-new'
import { useReportContext } from './useReportContext'

export function useOverallResultsNew(code: ComputedRef<string | undefined>) {
    const { data: aggregations } = useUserAggregations(code)
    const overallResult = computed(() => {
        if (!aggregations.value || aggregations.value.length === 0) return null

        console.log(aggregations.value)
        const totalScore = aggregations.value.reduce((acc, curr) => {
            const val = curr.descriptiveStatistics?.frequency ?? 0
            const max = curr.descriptiveStatistics?.total ?? 1
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
            text: competenceTexts.overallResult[key as keyof typeof competenceTexts.specialCases],
        }
    })

    return {
        overallResult,
    }
}

function useUserAggregations(code: ComputedRef<string | undefined>) {
    const report = useReportContext()
    return useQuery({
        queryKey: computed(() => ['user-aggregations-base', ...report.queryScope.value, code.value]),
        queryFn: async () => {
            if (!code.value) return []
            const params = report.getParams()
            const studentCode = code.value
            const config = await inioApiConfiguration()
            const api = new ReportDataTba3Api(config)
            const response = await api.testGroupsTgIdTestsTestIdGroupsGroupIdAggregationsGet({
                ...params,
                type: 'students',
                studentCode,
                aggregation: 'generalMathematicalCompetence',
            })

            const students = response.data?.studentsData ?? []

            const targetUser = students.find((u) => u.code === studentCode)
            return targetUser?.aggregations ?? []
        },
        enabled: computed(() => report.isReady.value && !!code.value),
        staleTime: 1000 * 60 * 60,
    })
}

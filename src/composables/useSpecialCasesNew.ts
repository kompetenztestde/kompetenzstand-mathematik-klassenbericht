import { computed, type ComputedRef } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { inioApiConfiguration } from '@/queries/utils'
import competenceTexts from '../assets/competence_guidingideas_texts.json'
import { ReportDataTba3Api } from '@tba3/api-new'
import dayjs from 'dayjs'
import { useUserItemsNew } from './useUserItems'

export function useSpecialCasesNew(code: ComputedRef<string | undefined>) {
    const { properties } = useUserProperties(code)
    const { data: aggregations } = useUserAggregations(code)
    const { data: items } = useUserItemsNew(code)
    const processingDuration = computed(() => {
        const startProp = properties.value.find((p) => p.key === 'startTime')
        const endProp = properties.value.find((p) => p.key === 'endTime')

        if (!startProp?.value || !endProp?.value) return null

        const start = dayjs(startProp.value)
        const end = dayjs(endProp.value)

        const durationInMinutes = end.diff(start, 'minute')

        return durationInMinutes
    })
    const specialCaseResult = computed(() => {
        if (!aggregations.value || aggregations.value.length === 0) return null

        const mean = aggregations.value[aggregations.value.length - 1]?.descriptiveStatistics.mean ?? 0

        console.log('ProcessingDuration in Minutes', processingDuration.value)

        const duration = processingDuration.value
        const totalScore = aggregations.value.reduce((acc, curr) => {
            const val = curr.descriptiveStatistics?.frequency ?? 0
            const max = curr.descriptiveStatistics?.total ?? 1
            const res = Math.round(val / max)
            return acc + res
        }, 0)

        const currentItems = items.value ?? []

        const totalItemsCount = currentItems.length
        const notWorkedOnCount = currentItems.filter((item) => item.descriptiveStatistics?.frequency === -1).length
        const correctCount = currentItems.filter((item) => item.descriptiveStatistics?.frequency === 1).length
        const workedOnCount = totalItemsCount - notWorkedOnCount
        const notWorkedOnRatio = totalItemsCount > 0 ? notWorkedOnCount / totalItemsCount : 0
        const correctRatioOfWorkedOn = workedOnCount > 0 ? correctCount / workedOnCount : 0

        // let key = ''
        // if (totalScore >= 35) key = 'K5'
        // else if (totalScore >= 29) key = 'K4'
        // else if (totalScore >= 22) key = 'K3'
        // else if (totalScore >= 15) key = 'K2'
        // else if (totalScore >= 9) key = 'K1B'
        // else key = 'K1A'

        let key: keyof typeof competenceTexts.specialCases = 'K4'
        if (mean >= 90) {
            key = 'K5'
        } else if (mean <= 10) {
            key = 'K3'
        } else if (totalScore === 0) {
            key = 'K2'
        } else if (duration !== null && duration < 60 && duration > 40) {
            key = 'K1A'
        } else if (duration !== null && duration > 70) {
            if (notWorkedOnRatio < 0.5 && correctRatioOfWorkedOn >= 2 / 3) {
                key = 'K1B'
            } else {
                key = 'K4'
            }
        } else {
            key = 'K4'
        }

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

function useUserAggregations(code: ComputedRef<string | undefined>) {
    return useQuery({
        queryKey: ['user-aggregations-base', code.value],
        queryFn: async () => {
            if (!code.value) return []
            const config = await inioApiConfiguration()
            const api = new ReportDataTba3Api(config)
            const response = await api.testGroupsTgIdTestsTestIdGroupsGroupIdAggregationsGet({
                tgId: 270,
                groupId: 1001,
                testId: 9524,
                type: 'students',
                studentCode: code.value,
                aggregation: 'generalMathematicalCompetence',
            })

            const students = response.data?.studentsData ?? []

            const targetUser = students.find((u) => u.code === code.value)
            return targetUser?.aggregations ?? []
        },
        enabled: computed(() => !!code.value),
        staleTime: 1000 * 60 * 60,
    })
}

export function useUserProperties(code: ComputedRef<string | undefined>) {
    const query = useQuery({
        queryKey: ['user-properties-base', code.value],
        queryFn: async () => {
            if (!code.value) return null
            const config = await inioApiConfiguration()
            const api = new ReportDataTba3Api(config)
            const response = await api.testGroupsTgIdTestsTestIdGroupsGroupIdItemsGet({
                tgId: 270,
                groupId: 1001,
                testId: 9524,
                type: 'students',
                studentCode: code.value,
            })
            const students = response.data?.studentsData ?? []
            return students.find((u) => u.code === code.value) || null
        },
        enabled: computed(() => !!code.value),
        staleTime: 1000 * 60 * 60,
    })

    const properties = computed(() => query.data.value?.properties ?? [])

    return {
        ...query,
        properties,
    }
}

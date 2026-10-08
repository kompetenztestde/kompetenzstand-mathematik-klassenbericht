import { inioApiConfiguration } from '@/queries/utils'
import { GUIDE_MAP, type GuideKey, COMPETENCE_MAP, type CompetenceKey } from '@/types'
import { useQuery, type UseQueryOptions } from '@tanstack/vue-query'
import { ReportDataTba3Api, type AggregationItemsInner } from '@tba3/api-new'
import { computed } from 'vue'
import { useReportContext } from './useReportContext'

export function useAllAggregations<TData = AggregationItemsInner[]>(
  options?: Omit<UseQueryOptions<AggregationItemsInner[], Error, TData>, 'queryKey' | 'queryFn'>,
) {
  const report = useReportContext()
  return useQuery({
    queryKey: computed(() => ['user-aggregations-all', ...report.queryScope.value]),
    queryFn: async () => {
      const params = report.getParams()
      const config = await inioApiConfiguration()
      const api = new ReportDataTba3Api(config)
      const response = await api.testGroupsTgIdTestsTestIdGroupsGroupIdAggregationsGet({
        ...params,
      })
      return (response.data?.groupData?.aggregations ?? []) as AggregationItemsInner[]
    },
    staleTime: 1000 * 60 * 60,
    ...options,
    enabled: report.isReady,
  })
}

export function useCoreIdeaAggregations() {
  return useAllAggregations({
    select: (allAggregations:AggregationItemsInner[]) =>
      allAggregations
        .filter((item: AggregationItemsInner) => item.type === 'coreIdea')
        .map((item:AggregationItemsInner) => {
          const key: GuideKey = ('L' + item.value) as GuideKey
          return {
            ...item,
            displayTitle: GUIDE_MAP[key] || item.value,
          }
        }),
  })
}

export function useCompetencesAggregations() {
  return useAllAggregations({
    select: (allAggregations: AggregationItemsInner[]) => 
      allAggregations
        .filter((item) => item.type === 'generalMathematicalCompetence')
        .map((item) => {
          const key = ('K' + item.value) as CompetenceKey
          return {
            ...item,
            displayTitle: COMPETENCE_MAP[key] || item.value,
          }
        })
  })
}

export function useCompetenceLevelsAggregations() {
  return useAllAggregations({
    select: (allAggregations: AggregationItemsInner[]) => 
      allAggregations.filter((item) => item.type === 'competenceLevel')
  })
}

export function useCognitiveDemandLevelAggregations() {
  return useAllAggregations({
    select: (allAggregations: AggregationItemsInner[]) => 
      allAggregations.filter((item) => item.type === 'cognitiveDemandLevel')
  })
}

export function useTotalResultAggregations() {
  return useAllAggregations({
    select: (allAggregations: AggregationItemsInner[]) => 
      allAggregations.filter((item) => item.type === 'total')
  })
}

export function useHomogeneityAggregation() {
  return useAllAggregations({
    select: (allAggregations: AggregationItemsInner[]) => {
      const totalItem = allAggregations.find((item) => item.type === 'total')
      if (!totalItem || !totalItem.descriptiveStatistics) return null

      const sdClass = totalItem.descriptiveStatistics.standardDeviation || 0

      const MAX_SD = 25

      return {
        totalItem,
        sdClass,
        classPercent: Math.min(100, Math.max(0, (sdClass / MAX_SD) * 100)),
      }
    },
  })
}

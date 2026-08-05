<script setup lang="ts">
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
} from 'echarts/components'
import {
  useCoreIdeaAggregations,
  useAllAggregations,
  useCognitiveDemandLevelAggregations,
  useCompetenceLevelsAggregations,
  useCompetencesAggregations,
  useTotalResultAggregations,
} from '@/composables/useAggregations'
import styles from './styles.module.css'
import { watch, computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useClassStatsNew } from '@/composables/useClassStats'
import { useUserItemsNew } from '@/composables/useUserItems'
const { t } = useI18n()

use([CanvasRenderer, BarChart, GridComponent, TooltipComponent, TitleComponent, LegendComponent])
const { data } = useAllAggregations()
const { data: coreIdeas } = useCoreIdeaAggregations()
const { data: competences } = useCompetencesAggregations()
const { data: cognitiveDemandLevels } = useCognitiveDemandLevelAggregations()
const { data: competenceLevels } = useCompetenceLevelsAggregations()
const { data: total } = useTotalResultAggregations()
const { classItemsMatrix } = useUserItemsNew()

const showMean = ref(true)
const showMeanComparison = ref(true)
const showDeko = ref(false)

const hiddenIndices = ref<Set<number>>(new Set())

const hiddenLabels = ref<Set<string>>(new Set())

const { liveClassStats } = useClassStatsNew(classItemsMatrix, hiddenLabels)

const toggleIndexVisibility = (index: number) => {
  if (hiddenIndices.value.has(index)) {
    hiddenIndices.value.delete(index)
  } else {
    hiddenIndices.value.add(index)
  }
}

const processBlock = (dataArray: any[] | undefined, groupName: string, color: string) => {
  const extractValue = (item: any, key: 'mean' | 'meanComparison') => {
    const raw = item?.descriptiveStatistics?.[key]
    return Number(raw?.value ?? raw) || 0
  }

  if (!dataArray || !Array.isArray(dataArray)) {
    if (dataArray && typeof dataArray === 'object') {
      const item = dataArray as any
      return [
        {
          label: item.value || groupName,
          groupName: groupName,
          mean: extractValue(item, 'mean'),
          meanComparison: extractValue(item, 'meanComparison'),
          itemStyle: { color },
          isSpacer: false,
        },
      ]
    }
    return []
  }

  return dataArray.map((item: any) => ({
    label: item.value || '',
    groupName: groupName,
    mean: extractValue(item, 'mean'),
    meanComparison: extractValue(item, 'meanComparison'),
    itemStyle: { color },
    isSpacer: false,
  }))
}

const combinedChartData = computed(() => {
  const blocks = [
    processBlock(total.value, t('classResultsInSubTopics.total'), '#2ecc71'),
    processBlock(coreIdeas.value, t('classResultsInSubTopics.coreIdea'), '#3498db'),
    processBlock(competences.value, t('classResultsInSubTopics.competence'), '#9b59b6'),
    processBlock(cognitiveDemandLevels.value, t('classResultsInSubTopics.cognitive'), '#e67e22'),
    processBlock(competenceLevels.value, t('classResultsInSubTopics.competenceLevel'), '#e74c3c'),
  ]

  const result: any[] = []

  blocks.forEach((block, index) => {
    if (block.length > 0) {
      result.push(...block)

      if (index < blocks.length - 1) {
        result.push({
          label: '',
          groupName: 'Spacer',
          mean: null,
          meanComparison: null,
          isSpacer: true,
        })
      }
    }
  })

  return result
})

const chartOptions = computed(() => {
  const dataPoints = combinedChartData.value

  const xAxisLabels = dataPoints.map((item, index) => {
    if (item.isSpacer) return ''

    const isHidden = hiddenIndices.value.has(index)
    return {
      value: item.label,
      textStyle: {
        color: isHidden ? '#bbb' : '#495057',
        backgroundColor: isHidden ? '#f1f3f5' : '#e9ecef',
        borderColor: isHidden ? '#dee2e6' : '#ced4da',
        borderWidth: 1,
        borderRadius: 4,
        padding: [2, 4],
        fontFamily: 'sans-serif',
        fontSize: 10,
        fontWeight: isHidden ? 'normal' : 'bold',
      },
    }
  })

  const groupAxisData = dataPoints.map((item, index) => {
    if (item.isSpacer) return ''
    const currentGroup = item.groupName
    const firstIndex = dataPoints.findIndex((d) => d.groupName === currentGroup)
    const lastIndex = dataPoints.map((d) => d.groupName).lastIndexOf(currentGroup)
    const middleIndex = Math.floor((firstIndex + lastIndex) / 2)

    return index === middleIndex ? currentGroup : ''
  })

  const activeSeries = []

  if (showMean.value) {
    activeSeries.push({
      name: t('classResultsInSubTopics.mean'),
      type: 'bar',
      data: dataPoints.map((item, index) => {
        if (item.isSpacer || hiddenIndices.value.has(index)) return null
        return {
          value: item.mean,
          itemStyle: {
            color: item.itemStyle.color,
            borderRadius: [4, 4, 0, 0],
          },
        }
      }),
      barMaxWidth: 15,
    })
  }

  if (showMeanComparison.value) {
    activeSeries.push({
      name: t('classResultsInSubTopics.meanComp'),
      type: 'bar',
      data: dataPoints.map((item, index) => {
        if (item.isSpacer || hiddenIndices.value.has(index)) return null
        return item.meanComparison
      }),
      barMaxWidth: 15,
      itemStyle: {
        color: '#1a365d',
        borderRadius: [4, 4, 0, 0],
      },
    })
  }

  return {
    legend: {
      data: [t('classResultsInSubTopics.meanComp')],
      bottom: 0,
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        if (!params || params.length === 0 || params[0].name === '') return ''
        if (params.every((p: any) => p.value === null || p.value === undefined)) return ''
        let res = `<strong>${params[0].name}</strong>`
        params.forEach((p: any) => {
          if (p.value !== null && p.value !== undefined) {
            res += `<br/>${p.marker} ${p.seriesName}: ${p.value}%`
          }
        })
        return res
      },
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '20%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        data: xAxisLabels,
        triggerEvent: true,
        axisLabel: {
          interval: 0,
          hideOverlap: true,
        },
        axisTick: {
          show: true,
        },
      },
      {
        type: 'category',
        data: groupAxisData,
        position: 'bottom',
        offset: 50,
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          interval: 0,
          fontSize: 12,
          fontWeight: 'bold',
          color: '#555',
        },
      },
    ],
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      interval: 10,
      axisLabel: {
        formatter: '{value}',
      },
    },
    series: activeSeries,
  }
})

const onChartClick = (params: any) => {
  if (params.componentType === 'xAxis' && params.xAxisIndex === 0) {
    const targetIndex = params.dataIndex

    if (combinedChartData.value[targetIndex]?.isSpacer) return

    toggleIndexVisibility(targetIndex)
  }
}

const handleLegendClick = () => {
  alert('Legende wurde geklickt!')
}

watch(
  () => data.value,
  (newData) => {
    console.log('Daten sind da:', newData)
  },
)
watch(
  () => coreIdeas.value,
  (newData) => {
    console.log('Leitideen sind da:', newData)
  },
)
watch(
  () => competences.value,
  (newData) => {
    console.log('Kompetenzstärken sind da:', newData)
  },
)

watch(
  () => competenceLevels.value,
  (newData) => {
    console.log('Kompetenzstufen sind da:', newData)
  },
)
</script>

<template>
  <div :class="styles.pageContainer">
    <div :class="styles.chartWrapper">
      <div :class="styles.chartHeader">
        <h2 :class="styles.chartTitle">
          {{ t('classResultsInSubTopics.title') }}
        </h2>

        <div :class="styles.controlsContainer">
          <div :class="styles.checkboxGroup">
            <label :class="styles.checkboxLabel">
              <input disabled="true" type="checkbox" v-model="showMean" />

              {{ t('classResultsInSubTopics.mean') }}
            </label>
            <label :class="styles.checkboxLabel">
              <input type="checkbox" v-model="showMeanComparison" />
              {{ t('classResultsInSubTopics.meanComp') }}
            </label>
            <label :class="styles.checkboxLabel">
              <input type="checkbox" v-model="showDeko" />
              {{ t('classResultsInSubTopics.meanSchool') }}
            </label>
          </div>

          <button :class="styles.legendButton" @click="handleLegendClick">
            {{ t('classResultsInSubTopics.legend') }}
          </button>
        </div>
      </div>

      <v-chart :option="chartOptions" class="chart" @click="onChartClick" />
    </div>
  </div>
</template>
<style scoped>
.chart {
  height: 500px;
  width: 100%;
}
</style>

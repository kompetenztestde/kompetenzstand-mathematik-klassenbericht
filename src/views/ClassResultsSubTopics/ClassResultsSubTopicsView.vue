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
import CheckIcon from './icons/CheckIcon.svg?component'
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

const processBlock = (
  dataArray: any[] | undefined,
  groupName: string,
  color: string,
  comparisonColor?: string,
) => {
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
    label: item.value || '1',
    groupName: groupName,
    mean: extractValue(item, 'mean'),
    meanComparison: extractValue(item, 'meanComparison'),
    itemStyle: { color },
    isSpacer: false,
  }))
}

const AREA_COLORS = {
  total: '#008574',
  coreIdea: '#27E586',
  competence: '#868686',
  cognitive: '#D433D0',
  competenceLevel: '#008DEB',
}

const MEAN_COMPARISON_COLOR = '#B3D3FF'

const combinedChartData = computed(() => {
  const blocks = [
    processBlock(total.value, t('classResultsInSubTopics.total'), AREA_COLORS.total),
    processBlock(coreIdeas.value, t('classResultsInSubTopics.coreIdea'), AREA_COLORS.coreIdea),
    processBlock(
      competences.value,
      t('classResultsInSubTopics.competence'),
      AREA_COLORS.competence,
    ),
    processBlock(
      cognitiveDemandLevels.value,
      t('classResultsInSubTopics.cognitive'),
      AREA_COLORS.cognitive,
    ),
    processBlock(
      competenceLevels.value,
      t('classResultsInSubTopics.competenceLevel'),
      AREA_COLORS.competenceLevel,
    ),
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
        borderWidth: 1,
        borderRadius: 4,
        padding: [2, 4],
        fontSize: 14,
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
            borderRadius: [0, 0, 0, 0],
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
        color: MEAN_COMPARISON_COLOR,
        borderRadius: [0, 0, 0, 0],
      },
    })
  }

  return {
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
          fontSize: 18,
          fontWeight: 'bold',
          color: '#000',
        },
      },
    ],
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      interval: 10,
      name: 'Klassendurchschnitt\nerreichter Punkte (%)',
      nameLocation: 'end',
      nameAlign: 'left',
      nameGap: 15,
      nameTextStyle: {
        color: 'var(--color-black, #000)',
        fontFamily: 'League Spartan, sans-serif',
        fontSize: 14,
        fontStyle: 'normal',
        fontWeight: 400,
        lineHeight: 16,
        align: 'left', 
        padding: [0, 0, 0, -40],
      },
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
    <div :class="styles.chartHeader">
      <h2 :class="styles.chartTitle">
        {{ t('classResultsInSubTopics.title') }}
      </h2>

      <div :class="styles.controlsContainer">
        <div :class="styles.checkboxGroup">
          <label :class="[styles.checkboxLabel, showMean && styles.isDisabled]">
            <input type="checkbox" disabled v-model="showMean" :class="styles.visuallyHidden" />
            <span :class="[styles.classCheckbox, showMean && styles.checked]">
              <CheckIcon v-if="showMean" :class="styles.checkIcon" />
            </span>
            {{ t('classResultsInSubTopics.mean') }}
          </label>

          <label :class="styles.checkboxLabel">
            <input type="checkbox" v-model="showMeanComparison" :class="styles.visuallyHidden" />
            <span :class="[styles.countryCheckbox, showMeanComparison && styles.checked]">
              <CheckIcon v-if="showMeanComparison" :class="styles.checkIcon" />
            </span>
            {{ t('classResultsInSubTopics.meanComp') }}
          </label>

          <label :class="styles.checkboxLabel">
            <input type="checkbox" v-model="showDeko" :class="styles.visuallyHidden" />
            <span :class="[styles.schoolCheckbox, showDeko && styles.checked]">
              <CheckIcon v-if="showDeko" :class="styles.checkIcon" />
            </span>
            {{ t('classResultsInSubTopics.meanSchool') }}
          </label>
        </div>

        <button :class="styles.legendButton" @click="handleLegendClick">
          <span :class="styles.buttonLabel"> {{ t('classResultsInSubTopics.legend') }}</span>
          <div :class="styles.buttonIcon">
            <span :class="styles.buttonIconSpan">?</span>
          </div>
        </button>
      </div>
    </div>

    <v-chart :option="chartOptions" class="chart" @click="onChartClick" />
  </div>
</template>
<style scoped>
.chart {
  height: 500px;
  width: 100%;
  grid-column: 1 / -1;
}
</style>

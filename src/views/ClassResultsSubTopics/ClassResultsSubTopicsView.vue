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
import { useUserItemsNew, useGroupInfo } from '@/composables/useUserItems'
import CheckIcon from './icons/CheckIcon.svg?component'
import { useModalStore } from '@/stores/modalStore'
const { t } = useI18n()
const modalStore = useModalStore()
use([CanvasRenderer, BarChart, GridComponent, TooltipComponent, TitleComponent, LegendComponent])
const { data } = useAllAggregations()
const { data: coreIdeas } = useCoreIdeaAggregations()
const { data: competences } = useCompetencesAggregations()
const { data: cognitiveDemandLevels } = useCognitiveDemandLevelAggregations()
const { data: competenceLevels } = useCompetenceLevelsAggregations()
const { data: total } = useTotalResultAggregations()
const { classItemsMatrix } = useUserItemsNew()
const { items: groupItems } = useGroupInfo()

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

const ROMAN_MAP: Record<string, string> = {
  '1': 'I',
  '2': 'II',
  '3': 'III',
}

const processBlock = (dataArray: any[] | undefined, groupName: string, color: string) => {
  const extractValue = (item: any, key: 'mean' | 'meanComparison') => {
    const raw = item?.descriptiveStatistics?.[key]
    return Number(raw?.value ?? raw) || 0
  }

  const mapItem = (item: any) => {
    let rawLabel = String(item.value || groupName || '1')

    if (groupName === t('classResultsInSubTopics.cognitive')) {
      rawLabel = ROMAN_MAP[rawLabel] || rawLabel
    }

    return {
      label: rawLabel,
      groupName: groupName,
      originalMean: extractValue(item, 'mean'),
      originalMeanComparison: extractValue(item, 'meanComparison'),
      includedIqbIds: item?.includedIqbIds || [],
      itemStyle: { color },
      isSpacer: false,
    }
  }

  if (!dataArray || !Array.isArray(dataArray)) {
    if (dataArray && typeof dataArray === 'object') {
      return [mapItem(dataArray)]
    }
    return []
  }

  return dataArray.map(mapItem)
}

const combinedChartDataRaw = computed(() => {
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
          isSpacer: true,
        })
      }
    }
  })

  return result
})

const AREA_COLORS = {
  total: '#B00FBF',
  coreIdea: '#76E62B',
  competence: '#AAA',
  cognitive: '#EF74FB',
  competenceLevel: '#01ABE9',
}

const MEAN_COMPARISON_COLOR = '#001DAB'

function createColorBadge(color: string): string {
  return `<span style="display:inline-block; width:12px; height:12px; border-radius:3px; background-color:${color}; margin-right:8px; vertical-align:middle;"></span>`
}

// Erstellt das HTML für den Hilfetext im SideModal
function getLegendHelpHtml(): string {
  return `
  <br/>
    <p>${t('subTopicsHelp.description')}</p>
    <ul style="list-style: none; padding-left: 0;">
    <br/>
      <li style="margin-bottom: 8px;">
        ${createColorBadge(AREA_COLORS.total)}
        <strong>${t('classResultsInSubTopics.total')}:</strong> ${t('subTopicsHelp.total')}
      </li>
      <li style="margin-bottom: 8px;">
        ${createColorBadge(AREA_COLORS.coreIdea)}
        <strong>${t('classResultsInSubTopics.coreIdea')}:</strong> ${t('subTopicsHelp.coreIdea')}
      </li>
      <li style="margin-bottom: 8px;">
        ${createColorBadge(AREA_COLORS.competence)}
        <strong>${t('classResultsInSubTopics.competence')}:</strong> ${t('subTopicsHelp.competence')}
      </li>
      <li style="margin-bottom: 8px;">
        ${createColorBadge(AREA_COLORS.cognitive)}
        <strong>${t('classResultsInSubTopics.cognitive')}:</strong> ${t('subTopicsHelp.cognitive')}
      </li>
      <li style="margin-bottom: 8px;">
        ${createColorBadge(AREA_COLORS.competenceLevel)}
        <strong>${t('classResultsInSubTopics.competenceLevel')}:</strong> ${t('subTopicsHelp.competenceLevel')}
      </li>
      <li style="margin-top: 16px; padding-top: 8px; border-top: 1px solid #e9ecef;">
        ${createColorBadge(MEAN_COMPARISON_COLOR)}
        <strong>${t('classResultsInSubTopics.meanComp')}:</strong> ${t('subTopicsHelp.meanComp')}
      </li>
    </ul>
  `
}

const combinedChartData = computed(() => {
  const hasExclusions = excludedIqbIds.value.size > 0

  return combinedChartDataRaw.value.map((item) => {
    if (item.isSpacer) return item

    if (!hasExclusions) {
      return {
        ...item,
        mean: item.originalMean,
        meanComparison: item.originalMeanComparison,
      }
    }

    const filtered = calculateFilteredValues(item.includedIqbIds)
    return {
      ...item,
      mean: filtered.mean,
      meanComparison: filtered.meanComparison,
    }
  })
})

const itemsStatsMap = computed(() => {
  const map = new Map<string, { mean: number; meanComparison: number }>()

  groupItems.value.forEach((item: any) => {
    if (item.iqbId) {
      map.set(item.iqbId, {
        mean: Number(item.descriptiveStatistics?.mean) || 0,
        meanComparison: Number(item.descriptiveStatistics?.meanComparison) || 0,
      })
    }
  })
  return map
})

const excludedIqbIds = computed(() => {
  const excluded = new Set<string>()
  const rawBlocks = combinedChartDataRaw.value

  hiddenIndices.value.forEach((index) => {
    const item = rawBlocks[index]
    if (item && item.includedIqbIds && Array.isArray(item.includedIqbIds)) {
      item.includedIqbIds.forEach((id: string) => excluded.add(id))
    }
  })

  return excluded
})

const calculateFilteredValues = (includedIqbIds: string[]) => {
  if (!includedIqbIds || includedIqbIds.length === 0) {
    return { mean: 0, meanComparison: 0 }
  }

  const validIds = includedIqbIds.filter((id) => !excludedIqbIds.value.has(id))

  if (validIds.length === 0) {
    return { mean: 0, meanComparison: 0 }
  }

  let sumMean = 0
  let sumMeanComp = 0
  let count = 0

  validIds.forEach((id) => {
    const stat = itemsStatsMap.value.get(id)
    if (stat) {
      sumMean += stat.mean
      sumMeanComp += stat.meanComparison
      count++
    }
  })

  return {
    mean: Number((sumMean / count).toFixed(3)),
    meanComparison: Number((sumMeanComp / count).toFixed(3)),
  }
}

const chartOptions = computed(() => {
  const dataPoints = combinedChartData.value

  const xAxisLabels = dataPoints.map((item, index) => {
    if (item.isSpacer) return ''

    const isTotalGroup = item.groupName === t('classResultsInSubTopics.total')

    if (isTotalGroup) {
      return ''
    }

    const isHidden = hiddenIndices.value.has(index)
    return {
      value: item.label,
      textStyle: {
        color: isHidden ? '#bbb' : '#000000',
        backgroundColor: '#DCDCDC',
        fontFamily: 'League Spartan, sans-serif',
        fontSize: 14,
        fontWeight: 400,
        lineHeight: 16,
        align: 'center',
        verticalAlign: 'middle',
        borderRadius: 2,
        width: 20,
        height: 20,
        padding: [3, 0, 3, 0],
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
      barGap: '0%',
      barWidth: 14,
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
      barMaxWidth: 14,
    })
  }

  if (showMeanComparison.value) {
    activeSeries.push({
      name: t('classResultsInSubTopics.meanComp'),
      type: 'bar',
      barWidth: 8,
      barGap: '0%',
      data: dataPoints.map((item, index) => {
        if (item.isSpacer || hiddenIndices.value.has(index)) return null
        return item.meanComparison
      }),
      barMaxWidth: 8,
      itemStyle: {
        color: MEAN_COMPARISON_COLOR,
        borderRadius: [0, 0, 0, 0],
      },
    })
  }

  return {
    aria: {
      enabled: true,
      label: {
        description: t('classResultsInSubTopics.chartA11yLabel'),
      },
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
      // right: '5%',
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
          margin: 24,
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
          width: 200,
          overflow: 'break',
          color: '#000',
          align: 'center',
        },
      },
    ],
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      interval: 10,
      name: t('classResultsInSubTopics.yAxisName'),
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
  modalStore.openModal(t('subTopicsHelp.title'), getLegendHelpHtml())
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
      <button
        type="button"
        :class="styles.legendButton"
        @click="handleLegendClick"
        :aria-label="t('classResultsInSubTopics.legend')"
      >
        <span :class="styles.buttonLabel"> {{ t('classResultsInSubTopics.legend') }}</span>
        <div :class="styles.buttonIcon">
          <span :class="styles.buttonIconSpan">?</span>
        </div>
      </button>
    </div>
    <div :class="styles.controlsContainerNew" :aria-label="t('classResultsInSubTopics.title')">
      <div :class="[styles.classCheckButton, !showMean && styles.inactiveButton]">
        <label :class="styles.checkboxLabel">
          <input
            type="checkbox"
            disabled
            v-model="showMean"
            :class="styles.visuallyHidden"
            :aria-label="t('classResultsInSubTopics.ariaShowMean')"
          />
          <span :class="[styles.classCheckbox, showMean && styles.checked]">
            <CheckIcon v-if="showMean" :class="styles.checkIcon" />
          </span>
          {{ t('classResultsInSubTopics.mean') }}
        </label>
      </div>
      <div :class="[styles.countryCheckButton, !showMeanComparison && styles.inactiveButton]">
        <label :class="styles.checkboxLabel"
          ><input
            type="checkbox"
            v-model="showMeanComparison"
            :class="styles.visuallyHidden"
            :aria-label="t('classResultsInSubTopics.ariaShowMeanComp')"
          />
          <span :class="[styles.countryCheckbox, showMeanComparison && styles.checked]">
            <CheckIcon v-if="showMeanComparison" :class="styles.checkIcon" />
          </span>
          {{ t('classResultsInSubTopics.meanComp') }}
        </label>
      </div>
      <div :class="[styles.schoolCheckButton, !showDeko && styles.inactiveButton]">
        <label :class="styles.checkboxLabel">
          <input
            type="checkbox"
            v-model="showDeko"
            :class="styles.visuallyHidden"
            :aria-label="t('classResultsInSubTopics.ariaShowMeanSchool')"
          />
          <span :class="[styles.schoolCheckbox, showDeko && styles.checked]">
            <CheckIcon v-if="showDeko" :class="styles.checkIcon" />
          </span>
          {{ t('classResultsInSubTopics.meanSchool') }}
        </label>
      </div>
    </div>

    <div
      :class="styles.echartContainer"
      role="img"
      :aria-label="t('classResultsInSubTopics.chartA11yLabel')"
    >
      <v-chart :option="chartOptions" class="chart" @click="onChartClick" />
    </div>
  </div>
</template>
<style scoped>
.chart {
  height: 500px;
  width: 100%;
  grid-column: 1 / -1;
}
</style>

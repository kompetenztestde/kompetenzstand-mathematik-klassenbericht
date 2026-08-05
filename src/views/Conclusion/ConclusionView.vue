<script setup>
import {
  useCoreIdeaAggregations,
  useHomogeneityAggregation,
} from '@/composables/useAggregations'
import styles from './styles.module.css'
import RaumUndForm from './icons/raum_und_form.png'
import GroessenUndMessen from './icons/groessen_messen.png'
import Strukturen from './icons/strukturen.png'
import ZahlUndOperationen from './icons/zahl_und_operationen.png'
import DatenUndZufall from './icons/Daten_und_Zufall.png'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import ArrowUpIcon from './icons/ArrowUpIcon.svg?component'
import ArrowDownIcon from './icons/ArrowDownIcon.svg?component'
const { data } = useCoreIdeaAggregations()
const { t } = useI18n()
const imageMap = {
  'Raum und Form': {
    src: RaumUndForm,
    mobile: { width: '247px', height: '206px', aspectRatio: '241/201' },
    desktop: { width: '348px', height: '289px', aspectRatio: '59/49' },
  },
  'Größen und Messen': {
    src: GroessenUndMessen,
    mobile: { width: '276px', height: '200px', aspectRatio: '69/50' },
    desktop: { width: '350px', height: '253px', aspectRatio: '83/60' },
  },
  'Strukturen und funktionaler Zusammenhang': {
    src: Strukturen,
    mobile: { width: '219px', height: '158px', aspectRatio: '140/101' },
    desktop: { width: '350px', height: '253px', aspectRatio: '83/60' },
  },
  'Zahl und Operation': {
    src: ZahlUndOperationen,
    mobile: { width: '280px', height: '280px', aspectRatio: '1/1' },
    desktop: { width: '280px', height: '280px', aspectRatio: '1/1' },
  },
  'Daten und Zufall': {
    src: DatenUndZufall,
    mobile: { width: '320px', height: '240px', aspectRatio: '4/3' },
    desktop: { width: '320px', height: '240px', aspectRatio: '4/3' },
  },
}

// const overallClassMean = computed(() => {
//   if (!data.value || data.value.length === 0) return 0
//   const sum = data.value.reduce((acc, item) => acc + (item.descriptiveStatistics?.mean || 0), 0)
//   return Math.round(sum / data.value.length)
// })

// const overallCountryMean = computed(() => {
//   if (!data.value || data.value.length === 0) return 0
//   const sum = data.value.reduce(
//     (acc, item) => acc + (item.descriptiveStatistics?.meanComparison || 0),
//     0,
//   )
//   return Math.round(sum / data.value.length)
// })

const { data: homogeneityData } = useHomogeneityAggregation()

const overallClassMean = computed(() => {
  return Math.round(homogeneityData.value?.totalItem?.descriptiveStatistics?.mean) ?? 0
})

const overallCountryMean = computed(() => {
  return Math.round(homogeneityData.value?.totalItem?.descriptiveStatistics?.meanComparison) ?? 0
})
</script>
<template>
  <div :class="styles.conclusionContainer">
    <h1 :class="styles.title">
      {{ t('conclusion.title') }}
    </h1>
    <div :class="styles.headRow">
      <div :class="styles.results">
        <div :class="styles.summaryRow">
          <span :class="styles.summaryLabel">{{ t('conclusion.classResult') }}</span>
          <div :class="styles.statRow">
            <div :class="styles.barContainerClassComplete">
              <div
                :class="styles.barFillClass"
                :style="{ width: `${Math.min(100, Math.max(0, overallClassMean))}%` }"
              ></div>
            </div>
            <span
              :class="[
                styles.statValue,
                styles.statValueClass,
                { [styles.isHigher]: overallClassMean > overallCountryMean },
              ]"
            >
              {{ overallClassMean }}%
            </span>
          </div>
        </div>

        <div :class="styles.summaryRow">
          <span :class="styles.summaryLabel">{{ t('conclusion.countryResult') }}</span>
          <div :class="styles.statRow">
            <div :class="styles.barContainerCountryComplete">
              <div
                :class="styles.barFillCountry"
                :style="{ width: `${Math.min(100, Math.max(0, overallCountryMean))}%` }"
              ></div>
            </div>
            <span
              :class="[
                styles.statValue,
                styles.statValueCountry,
                { [styles.isHigher]: overallCountryMean > overallClassMean },
              ]"
            >
              {{ overallCountryMean }}%
            </span>
          </div>
        </div>
      </div>

      <div :class="styles.homogeneity">
        <h3 :class="styles.homogeneityTitle">{{ t('conclusion.homogenity') }}</h3>
        <div v-if="homogeneityData" :class="styles.homogeneityWrapper">
          <span :class="styles.homogeneityLabels">{{ t('conclusion.homogeneous') }}</span>

          <div :class="styles.homogeneityTrack">
            <div
              :class="[styles.marker, styles.markerClass]"
              :style="{ left: `${homogeneityData.classPercent}%` }"
            >
              <span :class="styles.markerTooltip">Klasse</span>
            </div>
          </div>
          <span :class="styles.homogeneityLabels">{{ t('conclusion.heterogeneous') }}</span>
        </div>
      </div>
    </div>
    <div :class="styles.cards">
      <h3 :class="styles.resultCardsTitle">{{ t('conclusion.resultGuidingIdeas') }}</h3>
      <div :class="styles.container">
        <div v-for="item in data" :key="item.ktColumnName" :class="styles.card">
          <div :class="styles.header">
            <h2>{{ item.value }}</h2>
            <span :class="styles.valueTitle">{{ item.displayTitle }}</span>
          </div>

          <div :class="styles.imageContainer">
            <img
              v-if="imageMap[item.displayTitle]"
              :src="imageMap[item.displayTitle].src"
              :alt="item.displayTitle"
              :class="styles.illustration"
            />
            <div v-else :class="styles.imagePlaceholder">Kein Bild für {{ item.displayTitle }}</div>
          </div>

          <div :class="styles.content">
            <div :class="styles.statRow">
              <div :class="styles.barContainerClass">
                <div
                  :class="styles.barFillClass"
                  :style="{
                    width: `${Math.min(100, Math.max(0, Math.round(item.descriptiveStatistics?.mean || 0)))}%`,
                  }"
                ></div>
              </div>
              <span
                :class="[
                  styles.statValue,
                  styles.statValueClass,
                  {
                    [styles.isHigher]:
                      (item.descriptiveStatistics?.mean || 0) >
                      (item.descriptiveStatistics?.meanComparison || 0),
                  },
                ]"
              >
                {{ Math.round(item.descriptiveStatistics?.mean || 0) }}%
              </span>
              <ArrowUpIcon
                v-if="
                  (item.descriptiveStatistics?.mean || 0) > 40 &&
                  (item.descriptiveStatistics?.meanComparison || 0) > 40 &&
                  (item.descriptiveStatistics?.mean || 0) >
                    (item.descriptiveStatistics?.meanComparison || 0)
                "
                :class="[styles.statIcon, styles.iconUp]"
                aria-hidden="true"
              />
              <ArrowDownIcon
                v-else-if="
                  (Math.round(item.descriptiveStatistics?.mean) || 0) <= 40 &&
                  (Math.round(item.descriptiveStatistics?.meanComparison) || 0) <= 40 &&
                  (item.descriptiveStatistics?.mean || 0) <
                    (item.descriptiveStatistics?.meanComparison || 0)
                "
                :class="[styles.statIcon, styles.iconDown]"
                aria-hidden="true"
              />
            </div>
            <div :class="styles.statRow">
              <div :class="styles.barContainerCountry">
                <div
                  :class="styles.barFillCountry"
                  :style="{
                    width: `${Math.min(100, Math.max(0, Math.round(item.descriptiveStatistics?.meanComparison || 0)))}%`,
                  }"
                ></div>
              </div>
              <span
                :class="[
                  styles.statValue,
                  styles.statValueCountry,
                  {
                    [styles.isHigher]:
                      (item.descriptiveStatistics?.meanComparison || 0) >
                      (item.descriptiveStatistics?.mean || 0),
                  },
                ]"
              >
                {{ Math.round(item.descriptiveStatistics?.meanComparison || 0) }}%
              </span>
              <ArrowUpIcon
                v-if="
                  (item.descriptiveStatistics?.mean || 0) > 40 &&
                  (item.descriptiveStatistics?.meanComparison || 0) > 40 &&
                  (item.descriptiveStatistics?.meanComparison || 0) >
                    (item.descriptiveStatistics?.mean || 0)
                "
                :class="[styles.statIcon, styles.iconUp]"
                aria-hidden="true"
              />
              <ArrowDownIcon
                v-else-if="
                  (Math.round(item.descriptiveStatistics?.mean) || 0) <= 40 &&
                  (Math.round(item.descriptiveStatistics?.meanComparison) || 0) <= 40 &&
                  (item.descriptiveStatistics?.meanComparison || 0) <
                    (item.descriptiveStatistics?.mean || 0)
                "
                :class="[styles.statIcon, styles.iconDown]"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

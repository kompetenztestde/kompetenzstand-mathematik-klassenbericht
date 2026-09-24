<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import styles from './styles.module.css'
const { t } = useI18n()
import { getBestAndWorstExercises } from '@/composables/useUserItems'
import ArrowDownIcon from './icons/ArrowDown.svg?component'
const exercisesAnalysis = getBestAndWorstExercises()
</script>
<template>
  <div :class="styles.page">
    <div :class="styles.headRow">
      <h1 :class="styles.title">
        {{ t('worstExercises.title') }}
      </h1>
      <span class="text-body-big">{{ t('worstExercises.text') }}</span>
    </div>

    <div :class="styles.quadratContainer">
      <div
        v-for="task in exercisesAnalysis.worstThreeGlobal"
        :key="task.iqbId"
        :class="styles.quadrat"
      >
        <div :class="styles.exerciseContainer">
          <span class="text-label" :class="styles.exerciseTitle">
            {{ task.name }}
          </span>
        </div>

        <div :class="styles.taskStatsWrapper">
          <div :class="styles.statsContentRow">
            <div :class="styles.taskStats">
              <div :class="styles.summaryRow">
                <div :class="styles.statRow">
                  <div :class="styles.barContainerClass">
                    <div
                      :class="styles.barFillClass"
                      :style="{
                        width: `${Math.min(100, Math.max(0, Math.round((task.currentMean || 0) * 100)))}%`,
                      }"
                    ></div>
                  </div>
                  <span
                    :class="[
                      styles.statValue,
                      styles.statValueClass,
                      { [`${styles.isHigher}`]: task.currentMean >= task.referenceValue },
                    ]"
                    :aria-label="
                      t('worstExercises.classResult', { percent: (task.currentMean * 100).toFixed(1) })
                    "
                  >
                    {{ (task.currentMean * 100).toFixed(1) }}%
                  </span>
                </div>
              </div>

              <div :class="styles.summaryRow">
                <div :class="styles.statRow">
                  <div :class="styles.barContainerCountry">
                    <div
                      :class="styles.barFillCountry"
                      :style="{
                        width: `${Math.min(100, Math.max(0, Math.round((task.referenceValue || 0) * 100)))}%`,
                      }"
                    ></div>
                  </div>
                  <span
                    :class="[
                      styles.statValue,
                      styles.statValueCountry,
                      { [`${styles.isHigher}`]: task.referenceValue > task.currentMean },
                    ]"
                    :aria-label="
                      t('worstExercises.countryResult', {
                        percent: (task.referenceValue * 100).toFixed(1),
                      })
                    "
                  >
                    {{ (task.referenceValue * 100).toFixed(1) }}%
                  </span>
                </div>
              </div>
            </div>

            <ArrowDownIcon aria-hidden="true" :class="styles.arrowIcon" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
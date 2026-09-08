<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import styles from './styles.module.css'
import { getBestAndWorstExercises } from '@/composables/useUserItems'
const exercisesAnalysis = getBestAndWorstExercises()

const { t } = useI18n()
</script>
<template>
  <div :class="styles.page">
    <div :class="styles.headRow">
      <h1 :class="styles.title">
        {{ t('bestExercises.title') }}
      </h1>
      <span class="text-body-big">{{ t('bestExercises.text') }}</span>
    </div>

    <div :class="styles.quadratContainer">
      <div
        v-for="task in exercisesAnalysis.bestThreeGlobal"
        :key="task.iqbId"
        :class="styles.quadrat"
      >
        <div :class="styles.exerciseContainer">
          <span class="text-label" :class="styles.exerciseTitle">
            {{ task.name }}
          </span>
        </div>

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
                  { [`${styles.isHigher}`]: task.currentMean >= task.currentMean - task.deviation },
                ]"
                :aria-label="
                  t('bestExercises.classResult', { percent: (task.currentMean * 100).toFixed(1) })
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
                    width: `${Math.min(100, Math.max(0, Math.round((task.deviation || 0) * 100)))}%`,
                  }"
                ></div>
              </div>
              <span
                :class="[
                  styles.statValue,
                  styles.statValueCountry,
                  { [`${styles.isHigher}`]: task.currentMean >= task.currentMean - task.deviation },
                ]"
                :aria-label="
                  t('bestExercises.countryResult', { percent: (task.deviation * 100).toFixed(1) })
                "
              >
                {{ (task.deviation * 100).toFixed(1) }}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

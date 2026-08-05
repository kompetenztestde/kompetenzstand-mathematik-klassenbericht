<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import styles from './styles.module.css'
import Celebrate from './icons/celebrate.png'
import { getBestAndWorstExercises } from '@/composables/useUserItems'
const exercisesAnalysis = getBestAndWorstExercises()

const { t } = useI18n()
</script>
<template>
  <div :class="styles.page">
    <div :class="styles.headRow">
      <img :class="styles.celebrate" :src="Celebrate" alt="Celebrate Icon" />
      <h2>
        {{ t('bestExercises.title') }}
      </h2>
    </div>
    <span :class="styles.resultText">{{ t('bestExercises.text') }}</span>
    <div :class="styles.quadratContainer">
      <div
        v-for="task in exercisesAnalysis.bestThreeGlobal"
        :key="task.iqbId"
        :class="styles.quadrat"
      >
        <span>
          {{ task.name }}
        </span>
        <div :class="styles.taskStatsMini">
           <div>
            <strong>{{t("bestExercises.mean")}}:</strong> 
            {{ (task.currentMean * 100).toFixed(1) }}%
          </div>          
          <div :class="styles.deviationText">
            <strong>{{t("bestExercises.meanComp")}}:</strong> 
            {{ (task.deviation * 100).toFixed(1) }}%
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

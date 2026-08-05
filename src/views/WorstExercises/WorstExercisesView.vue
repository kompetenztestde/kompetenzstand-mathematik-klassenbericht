<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import styles from './styles.module.css'
import Contemplative from './icons/contemplative.png'
const { t } = useI18n()
import { getBestAndWorstExercises } from '@/composables/useUserItems'
const exercisesAnalysis = getBestAndWorstExercises()
</script>
<template>
  <div :class="styles.page">
    <div :class="styles.headRow">
      <img :class="styles.contemplative" :src="Contemplative" alt="Contemplative Icon" />
      <h2>
        {{ t('worstExercises.title') }}
      </h2>
    </div>
    <span :class="styles.resultText">{{ t('worstExercises.text') }}</span>
    <div :class="styles.quadratContainer">
      <div
        v-for="task in exercisesAnalysis.worstThreeGlobal"
        :key="task.iqbId"
        :class="styles.quadrat"
      >
        <span>
          {{ task.name }}
        </span>
        <!-- <div :class="styles.taskStatsMini">
          <div>
            <strong>{{t("worstExercises.mean")}}:</strong> 
            {{ (task.currentMean * 100).toFixed(1) }}%
          </div>          
          <div :class="styles.deviationText">
            <strong>{{t("worstExercises.meanComp")}}:</strong> 
            {{ (task.deviation * 100).toFixed(1) }}%
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

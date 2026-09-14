<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import styles from './styles.module.css'
const router = useRouter()
const { t } = useI18n()
const selectedUserCode = ref('')

const startAppWithCode = () => {
  router.push({
    path: '/step-2',
    query: { user: selectedUserCode.value },
  })
}
</script>

<template>
  <div :class="styles.page" class="noPaddingPage">
    <div :class="styles.container">
      <h1 :class="styles.title">{{ t('home.title') }}</h1>
      <div :class="styles.question">
        <span class="text-body-big">{{ t('home.question') }}</span
        ><div :class="styles.questionIcon"><span :class="styles.questionIconFontstyles">?</span></div>
      </div>
      <button :class="styles.btn" class="startBtn" @click="startAppWithCode">
        <Speaker />
        <span>{{ t('home.start') }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.startBtn {
  display: inline-flex;
  height: 52px;
  padding: 12px 30px 10px 30px;
  align-items: center;
  gap: 5px;
  border-radius: 100px;
  background: var(--color-navigation-blue);
  color: var(--color-white);

  text-align: center;
  font-family: 'League Spartan';
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 18px;
  letter-spacing: 0.9px;
}
</style>

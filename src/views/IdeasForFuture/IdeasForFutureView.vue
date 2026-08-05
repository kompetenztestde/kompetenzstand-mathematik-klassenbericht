<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import styles from './styles.module.css'
const { t } = useI18n()
</script>
<template>
  <div :class="styles.page">
    <div :class="styles.firstAdvice">
      <h1>
        {{ t('ideasForFuture.firstAdvice.title') }}
      </h1>
      <span
        ><strong> {{ t('ideasForFuture.firstAdvice.text') }}</strong>
      </span>
    </div>
    <div :class="styles.secondAdvice">
      <h1>
        {{ t('ideasForFuture.secondAdvice.title') }}
      </h1>
      <span>
        {{ t('ideasForFuture.secondAdvice.text') }}
      </span>
      <div :class="styles.secondAdviceSubMenu">
        <div>
          <h2>
            {{ t('ideasForFuture.secondAdvice.miniTitle1') }}
          </h2>
          <ul>
            <li>
              {{ t('ideasForFuture.secondAdvice.bulletPoints1.one') }}
            </li>
            <li>
              {{ t('ideasForFuture.secondAdvice.bulletPoints1.two') }}
            </li>
            <li>
              {{ t('ideasForFuture.secondAdvice.bulletPoints1.three') }}
            </li>
            <li>
              {{ t('ideasForFuture.secondAdvice.bulletPoints1.four') }}
            </li>
          </ul>
        </div>
        <div>
          <h2>
            {{ t('ideasForFuture.secondAdvice.miniTitle2') }}
          </h2>
           <ul>
            <li>
              {{ t('ideasForFuture.secondAdvice.bulletPoints1.one') }}
            </li>
            <li>
              {{ t('ideasForFuture.secondAdvice.bulletPoints1.two') }}
            </li>
            <li>
              {{ t('ideasForFuture.secondAdvice.bulletPoints1.three') }}
            </li>
            <li>
              {{ t('ideasForFuture.secondAdvice.bulletPoints1.four') }}
            </li>
          </ul>
        </div>
        <div>
          <h2>
            {{ t('ideasForFuture.secondAdvice.miniTitle3') }}
          </h2>
           <ul>
            <li>
              {{ t('ideasForFuture.secondAdvice.bulletPoints1.one') }}
            </li>
            <li>
              {{ t('ideasForFuture.secondAdvice.bulletPoints1.two') }}
            </li>
            <li>
              {{ t('ideasForFuture.secondAdvice.bulletPoints1.three') }}
            </li>
            <li>
              {{ t('ideasForFuture.secondAdvice.bulletPoints1.four') }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div :class="styles.thirdAdvice">
      <h1>
        {{ t('ideasForFuture.thirdAdvice.title') }}
      </h1>
      <h2>
        {{ t('ideasForFuture.thirdAdvice.miniTitle') }}
      </h2>
      <span>
        {{ t('ideasForFuture.thirdAdvice.text') }}
      </span>
    </div>
  </div>
</template>

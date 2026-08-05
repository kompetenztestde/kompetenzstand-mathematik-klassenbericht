<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useNavigation } from './composables/useNavigation'
import './themes/fonts.css'
import './themes/default.css'
import './assets/styles/base.css'
import { useI18n } from 'vue-i18n'
import SideModal from './components/SideModal/SideModal.vue'
import { useGuidingIdeasNew } from './composables/useGuidingIdeasNew'
import { useCompetencesNew } from './composables/useCompetencesNew'
import styles from './styles.module.css'
import IconPageLeft from '@/assets/svgs/page_left.svg?component'
import IconPageRight from '@/assets/svgs/page_right.svg?component'
import InfoIcon from '@/themes/icons/info.svg?component'
import competenceTexts from '@/assets/competence_guidingideas_texts.json'
import { useModalStore } from './stores/modalStore'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const currentUserCode = computed(() => route.query.user as string)

const { topPerformers: guidingIdeaTopPerformers, badPerformers } =
  useGuidingIdeasNew(currentUserCode)
const { topPerformers: competencesTopPerformers } = useCompetencesNew(currentUserCode)

const { allSteps } = useNavigation(
  competencesTopPerformers,
  guidingIdeaTopPerformers,
  badPerformers,
)

const currentIndex = computed(() => {
  const pathSegments = route.path.split('/').filter(Boolean)
  const currentBase = pathSegments[0]
  const currentSub = route.params.subId !== undefined ? Number(route.params.subId) : null

  return allSteps.value.findIndex((s) => {
    const stepBase = s.path.replace(/\//g, '')
    const pathMatches = currentBase === stepBase

    let subMatches = false
    if (s.sub === null && currentSub === null) subMatches = true
    if (s.sub !== null && currentSub !== null && Number(s.sub) === currentSub) subMatches = true

    if (pathMatches && s.sub === 0 && currentSub === null) subMatches = true
    if (pathMatches && s.sub === null && currentSub === 0) subMatches = true

    return pathMatches && subMatches
  })
})

const goNext = () => {
  const next = allSteps.value[currentIndex.value + 1]
  if (next) {
    const targetPath = next.sub !== null ? `${next.path}/${next.sub}` : next.path
    router.push({
      path: targetPath,
      query: { user: route.query.user },
    })
  }
}

const goBack = () => {
  const prev = allSteps.value[currentIndex.value - 1]
  if (prev) {
    const targetPath = prev.sub !== null ? `${prev.path}/${prev.sub}` : prev.path
    router.push({
      path: targetPath,
      query: { user: route.query.user },
    })
  }
}

const goTo = (newIndex: number) => {
  const newPath = allSteps.value[newIndex]
  if (!newPath) return
  const targetPath = newPath.sub !== null ? `${newPath.path}/${newPath.sub}` : newPath.path

  router.push({
    path: targetPath,
    query: { user: route.query.user },
  })
}

const isHome = computed(() => route.path === '/step-1' || route.path === '/')
const isSecond = computed(() => route.path === '/step-2')

// const appBackground = computed(() => {
//   if (isHome.value || isSecond.value) {
//     return { background: 'linear-gradient(180deg, #87F9F5 0%, #FFF 90.2%)' }
//   }
//   return { backgroundColor: 'var(--color-turquise)' }
// })
const modalStore = useModalStore()

const title = competenceTexts.start.title
const infoText = competenceTexts.start.info.text
const importantText = competenceTexts.start.info.important

const showDetails = () => {
  const formattedBody = infoText.replace(/\.($|\s+)/g, '.<br><br>').trim()
  const combinedContent = importantText
    ? `${formattedBody}<br><br><strong>${importantText}</strong>`
    : formattedBody

  modalStore.openModal(title, combinedContent)
}
</script>

<template>
   <div :class="styles.grid">
    <main :class="[styles.mainBody, styles.gridContent, { 'no-padding': isHome || isSecond }]">
      <RouterView :key="route.fullPath" />
    </main>

    <SideModal />

    <footer v-if="!isHome" role="contentinfo">
      <nav :aria-label="t('accessibility.pagination')" :class="styles.navigationBar">
        <div :class="styles.reportDiv">
          <h2 :class="styles.reportH1">{{ t('home.feedback') }}</h2>
          <button
            type="button"
            @click="showDetails"
            :class="styles.infoButton"
            :aria-label="t('competence.show_details_label')"
            title="Details anzeigen"
          >
            <InfoIcon :class="styles.infoIcon" aria-hidden="true" />
          </button>
        </div>

        <button
          :disabled="currentIndex <= 0"
          @click="goBack"
          :class="styles.navBtn"
          :aria-label="t('accessibility.prev_page')"
        >
          <IconPageLeft :class="styles.navIcon" aria-hidden="true" />
        </button>

        <ul :class="styles.pageIndicator" role="list">
          <li v-for="(step, index) in allSteps" :key="index">
            <button
              :class="`${styles.dot} ${index === currentIndex ? styles.active : ''}`"
              :aria-current="index === currentIndex ? 'page' : undefined"
              :aria-label="t('accessibility.go_to_page', { num: index + 1 })"
              @click="goTo(index)"
            ></button>
          </li>
        </ul>

        <button
          :disabled="currentIndex >= allSteps.length - 1 || currentIndex === -1"
          @click="goNext"
          :class="[styles.navBtn, styles.next]"
          :aria-label="t('accessibility.next_page')"
        >
          <IconPageRight :class="styles.navIcon" aria-hidden="true" />
        </button>
      </nav>
    </footer>
  </div>
</template>


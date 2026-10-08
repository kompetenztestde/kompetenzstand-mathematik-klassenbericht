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
import { useReportInfo } from './composables/useReportInfo'
import { useGroupInfo } from './composables/useUserItems.ts'
import { useAuthStore } from './stores/auth'
import { useReportSelectionStore } from './stores/reportSelection'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const reportSelection = useReportSelectionStore()
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

const { groupName } = useGroupInfo()

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
const isLogin = computed(() => route.name === 'login')
const isClassSelection = computed(() => route.name === 'class-selection')
const showReportFooter = computed(
  () => auth.isAuthenticated && /^\/step-[1-7](?:\/|$)/.test(route.path),
)

const { showReportInfo: showDetails } = useReportInfo()

const logout = () => {
  auth.logout()
  router.replace({ name: 'login' })
}
</script>

<template>
  <div :class="styles.grid">
    <main
      :class="[
        styles.mainBody,
        styles.gridContent,
        { 'no-padding': isHome || isSecond || isLogin || isClassSelection },
      ]"
    >
      <RouterView :key="route.fullPath" />
    </main>

    <SideModal />

    <footer v-if="showReportFooter" role="contentinfo" :class="styles.navbarFooter">
      <nav
        :aria-label="t('accessibility.pagination')"
        :class="[styles.navigationBar, { [styles.homeNavigationBar!]: isHome }]"
      >
        <div v-if="!isHome" :class="styles.reportDiv">
          <div :class="styles.titleContainer">
            <h1 :class="styles.reportH1">Klasse {{ groupName }}</h1>
            <h2 :class="styles.reportH2">{{ t('home.feedback') }}</h2>
          </div>

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

        <div :class="styles.navControls">
          <button
            v-if="!isHome"
            :disabled="currentIndex <= 0"
            @click="goBack"
            :class="styles.navBtn"
            :aria-label="t('accessibility.prev_page')"
          >
            <IconPageLeft :class="styles.navIcon" aria-hidden="true" />
          </button>

          <ul v-if="!isHome" :class="styles.pageIndicator" role="list">
            <li v-for="(step, index) in allSteps" :key="index" :class="styles.dotContainer">
              <button
                :class="[styles.dot, { [styles.active!]: index === currentIndex }]"
                :aria-current="index === currentIndex ? 'page' : undefined"
                :aria-label="t('accessibility.go_to_page', { num: index + 1 })"
                @click="goTo(index)"
              ></button>
            </li>
          </ul>

          <button
            v-if="!isHome"
            :disabled="currentIndex >= allSteps.length - 1 || currentIndex === -1"
            @click="goNext"
            :class="[styles.navBtn, styles.next]"
            :aria-label="t('accessibility.next_page')"
          >
            <IconPageRight :class="styles.navIcon" aria-hidden="true" />
          </button>
        </div>
      </nav>

      <div :class="styles.sessionActions">
        <button
          v-if="!auth.demoAccess && reportSelection.canChangeClass"
          type="button"
          @click="router.push({ name: 'class-selection' })"
          :class="styles.logoutBtn"
        >
          Klasse wechseln
        </button>
        <button
          type="button"
          @click="logout"
          :class="styles.logoutBtn"
          aria-label="Abmelden"
          title="Abmelden"
        >
          <svg
            :class="styles.logoutIcon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
          >
            <path
              fill="currentColor"
              d="M13 21q-.425 0-.712-.288T12 20t.288-.712T13 19h6V5h-6q-.425 0-.712-.288T12 4t.288-.712T13 3h6q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21zm-1.825-8H4q-.425 0-.712-.288T3 12t.288-.712T4 11h7.175L9.3 9.125q-.275-.275-.275-.675t.275-.7t.7-.313t.725.288L14.3 11.3q.3.3.3.7t-.3.7l-3.575 3.575q-.3.3-.712.288T9.3 16.25q-.275-.3-.262-.712t.287-.688z"
            />
          </svg>
          <span>Abmelden</span>
        </button>
      </div>
    </footer>
  </div>
</template>

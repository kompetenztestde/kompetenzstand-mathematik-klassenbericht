<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useReportSelectionStore } from '@/stores/reportSelection'
import { useClassSelectionQuery, type SelectableClass, type MathTest } from '@/queries/useClassSelectionQuery'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const selection = useReportSelectionStore()
const { data: classes, isPending, isFetching, error, refetch } = useClassSelectionQuery()
const activeGroupId = ref<number | null>(null)
const activeClass = computed(() => classes.value?.find(group => group.groupId === activeGroupId.value))
const hasSingleClass = computed(() => classes.value?.length === 1)
const isAutomaticSelection = computed(() => hasSingleClass.value && classes.value?.[0]?.tests.length === 1)

watch(classes, (availableClasses) => {
  if (!availableClasses) return
  selection.setClassCount(availableClasses.length)
  if (availableClasses.length === 1 && availableClasses[0]) {
    chooseClass(availableClasses[0])
  }
}, { immediate: true })

function openReport(group: SelectableClass, test: MathTest) {
  selection.select(group.groupId, test.testId, group.groupName)
  const redirect = typeof route.query.redirect === 'string' &&
    /^\/step-[1-7](?:[?#]|$)/.test(route.query.redirect) ? route.query.redirect : '/step-1'
  router.replace(redirect)
}

function chooseClass(group: SelectableClass) {
  if (group.tests.length === 1 && group.tests[0]) {
    openReport(group, group.tests[0])
  } else {
    activeGroupId.value = group.groupId
  }
}

function logout() {
  auth.logout()
  router.replace({ name: 'login' })
}
</script>

<template>
  <section class="class-selection" :aria-labelledby="!isPending && !isAutomaticSelection ? 'class-selection-title' : undefined">
    <h2 v-if="!isPending && !isAutomaticSelection" id="class-selection-title">{{ hasSingleClass ? 'Mathematiktest auswählen' : 'Klasse auswählen' }}</h2>
    <!-- <p>Bitte wählen Sie eine Klasse der Klassenstufe 8 aus.</p> -->
    <p v-if="isPending || isAutomaticSelection" role="status">Anmeldung wird abgeschlossen…</p>
    <div v-else-if="error" role="alert">
      <p>{{ error.message }}</p>
      <button type="button" :disabled="isFetching" @click="refetch()">Erneut versuchen</button>
    </div>
    <template v-else-if="!isAutomaticSelection">
      <p v-if="!classes?.length" role="status">
        Es wurden keine Klassen der Klassenstufe 8 mit einem teilgenommenen Mathematiktest gefunden.
      </p>
      <ul v-if="!hasSingleClass" class="class-list" aria-label="Verfügbare Klassen">
        <li v-for="group in classes" :key="group.groupId">
          <button type="button" :aria-pressed="activeGroupId === group.groupId" @click="chooseClass(group)">
            {{ group.groupName }}
          </button>
        </li>
      </ul>
      <div v-if="activeClass" class="test-selection">
        <h3>Mathematiktest für {{ activeClass.groupName }} auswählen</h3>
        <ul class="class-list" aria-label="Teilgenommene Mathematiktests">
          <li v-for="test in activeClass.tests" :key="test.testId">
            <button type="button" @click="openReport(activeClass, test)">
              {{ test.name }} – Heft {{ test.booklet }}
            </button>
          </li>
        </ul>
      </div>
    </template>
    <button type="button" class="logout" @click="logout">Abmelden</button>
  </section>
</template>

<style scoped>
.class-selection {
  width: 100%;
  color: var(--color-navigation-blue);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 0.5rem;
  box-sizing: border-box;
  line-height: 1.6;
}

.class-selection h2 {
  margin: 0;
  font-size: 1.6rem;
  line-height: 1.25;
}

.class-selection p,
.class-selection h3 {
  margin: 0;
}

.class-selection h3 {
  font-size: 1.15rem;
}

.class-selection > div[role='alert'],
.test-selection {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.class-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 0;
  list-style: none;
  margin: 0;
}

.class-list li {
  flex: 1 1 5rem;
}

.class-list button {
  width: 100%;
  height: 100%;
}

button {
  padding: 0.75rem 1.5rem;
  border: 1px solid var(--color-navigation-blue);
  border-radius: 4px;
  background: var(--color-white);
  color: var(--color-navigation-blue);
  font: inherit;
  cursor: pointer;
  min-height: 48px;
  line-height: 1.4;
  font-weight: 600;
}

button:hover,
button[aria-pressed='true'] {
  background: var(--color-navigation-blue);
  color: var(--color-white);
}

button:focus-visible {
  outline: 2px solid var(--color-waterblue);
  outline-offset: 3px;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.logout {
  margin-top: 0.5rem;
  align-self: flex-start;
}

.test-selection {
  padding-top: 1.5rem;
  border-top: 1px solid #d1d5db;
}
</style>

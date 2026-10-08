import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const TEST_GROUP_ID = 270
export const DEMO_GROUP_ID = 1001
export const DEMO_TEST_ID = 9524

function readId(key: string) {
  const value = Number(sessionStorage.getItem(key))
  return Number.isSafeInteger(value) && value > 0 ? value : null
}

export const useReportSelectionStore = defineStore('report-selection', () => {
  const groupId = ref(readId('report-group-id'))
  const testId = ref(readId('report-test-id'))
  const groupName = ref(sessionStorage.getItem('report-group-name') || '')
  const classCount = ref(readId('report-class-count'))
  const canChangeClass = computed(() => classCount.value !== null && classCount.value > 1)
  const hasSelection = computed(() => groupId.value !== null && testId.value !== null)

  function select(newGroupId: number, newTestId: number, newGroupName: string) {
    if (
      !Number.isSafeInteger(newGroupId) ||
      newGroupId <= 0 ||
      !Number.isSafeInteger(newTestId) ||
      newTestId <= 0 ||
      !newGroupName.trim()
    ) {
      throw new Error('Ungültige Klassen- oder Testauswahl.')
    }
    groupId.value = newGroupId
    testId.value = newTestId
    groupName.value = newGroupName
    sessionStorage.setItem('report-group-id', String(newGroupId))
    sessionStorage.setItem('report-test-id', String(newTestId))
    sessionStorage.setItem('report-group-name', newGroupName)
  }

  function clear() {
    groupId.value = null
    testId.value = null
    groupName.value = ''
    classCount.value = null
    sessionStorage.removeItem('report-group-id')
    sessionStorage.removeItem('report-test-id')
    sessionStorage.removeItem('report-group-name')
    sessionStorage.removeItem('report-class-count')
  }

  function setClassCount(count: number) {
    if (!Number.isSafeInteger(count) || count < 0) {
      throw new Error('Ungültige Anzahl verfügbarer Klassen.')
    }
    classCount.value = count
    sessionStorage.setItem('report-class-count', String(count))
  }

  return {
    groupId,
    testId,
    groupName,
    hasSelection,
    classCount,
    canChangeClass,
    setClassCount,
    select,
    clear,
  }
})

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
  const hasSelection = computed(() => groupId.value !== null && testId.value !== null)

  function select(newGroupId: number, newTestId: number, newGroupName: string) {
    if (!Number.isSafeInteger(newGroupId) || newGroupId <= 0 ||
        !Number.isSafeInteger(newTestId) || newTestId <= 0 || !newGroupName.trim()) {
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
    sessionStorage.removeItem('report-group-id')
    sessionStorage.removeItem('report-test-id')
    sessionStorage.removeItem('report-group-name')
  }

  return { groupId, testId, groupName, hasSelection, select, clear }
})

import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import {
  DEMO_GROUP_ID,
  DEMO_TEST_ID,
  TEST_GROUP_ID,
  useReportSelectionStore,
} from '@/stores/reportSelection'

export function useReportContext() {
  const auth = useAuthStore()
  const selection = useReportSelectionStore()
  const groupId = computed(() => (auth.demoAccess ? DEMO_GROUP_ID : selection.groupId))
  const testId = computed(() => (auth.demoAccess ? DEMO_TEST_ID : selection.testId))
  const isReady = computed(
    () => auth.isAuthenticated && (auth.demoAccess || selection.hasSelection),
  )
  const queryScope = computed(() => [
    auth.schoolNumber,
    auth.demoAccess,
    groupId.value,
    testId.value,
  ])

  function getParams() {
    if (!isReady.value || groupId.value === null || testId.value === null) {
      throw new Error('Bitte wähle zuerst eine Klasse und einen Mathematiktest aus.')
    }
    return { tgId: TEST_GROUP_ID, groupId: groupId.value, testId: testId.value }
  }

  return { groupId, testId, isReady, queryScope, getParams }
}

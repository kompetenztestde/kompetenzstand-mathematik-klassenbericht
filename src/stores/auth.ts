import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { queryClient } from '@/queryClient'
import { useReportSelectionStore } from './reportSelection'

export const DEFAULT_DEMO_SCHOOL_NUMBER = 'DEMO-TBA3-2026'

export const useAuthStore = defineStore('auth', () => {
  const schoolNumber = ref<string | null>(sessionStorage.getItem('school-number'))
  const apiKeySchool = ref<string | null>(sessionStorage.getItem('api-key-school'))
  const demoAccess = ref(sessionStorage.getItem('demo-access') === 'true')
  const token = ref<string | null>(sessionStorage.getItem('auth-token'))
  const expiresAt = ref(Number(sessionStorage.getItem('auth-expires-at')) || 0)

  const isAuthenticated = computed(
    () => !!schoolNumber.value && (demoAccess.value ? !!apiKeySchool.value : !!token.value && expiresAt.value > 0),
  )

  function isSessionExpired() {
    return !demoAccess.value && (!Number.isFinite(expiresAt.value) || Date.now() >= expiresAt.value)
  }

  function login(newSchoolNumber: string, newToken: string, tokenExpiresIn: number) {
    if (!newSchoolNumber.trim() || !newToken.trim() || !Number.isFinite(tokenExpiresIn) || tokenExpiresIn <= 0) {
      throw new Error('Ungültige Sitzungsdaten vom Anmeldeserver.')
    }
    logout()
    schoolNumber.value = newSchoolNumber
    token.value = newToken
    expiresAt.value = Date.now() + tokenExpiresIn * 1000
    sessionStorage.setItem('school-number', newSchoolNumber)
    sessionStorage.setItem('auth-token', newToken)
    sessionStorage.setItem('auth-expires-at', String(expiresAt.value))
  }

  function loginDemo(newSchoolNumber: string, newApiKeySchool: string) {
    if (!newSchoolNumber.trim() || !newApiKeySchool.trim()) {
      throw new Error('Der Demo-Zugang ist nicht konfiguriert.')
    }
    logout()
    schoolNumber.value = newSchoolNumber
    apiKeySchool.value = newApiKeySchool
    demoAccess.value = true
    sessionStorage.setItem('school-number', newSchoolNumber)
    sessionStorage.setItem('api-key-school', newApiKeySchool)
    sessionStorage.setItem('demo-access', 'true')
  }

  function logout() {
    useReportSelectionStore().clear()
    schoolNumber.value = null
    apiKeySchool.value = null
    demoAccess.value = false
    token.value = null
    expiresAt.value = 0

    sessionStorage.removeItem('school-number')
    sessionStorage.removeItem('api-key-school')
    sessionStorage.removeItem('demo-access')
    sessionStorage.removeItem('auth-token')
    sessionStorage.removeItem('auth-expires-at')
    queryClient.clear()
  }

  return {
    schoolNumber,
    apiKeySchool,
    demoAccess,
    isAuthenticated,
    token,
    isSessionExpired,
    login,
    loginDemo,
    logout,
  }
})
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const DEFAULT_DEMO_SCHOOL_NUMBER = 'DEMO-TBA3-2026'

export const useAuthStore = defineStore('auth', () => {
  const schoolNumber = ref<string | null>(sessionStorage.getItem('school-number'))
  const apiKeySchool = ref<string | null>(sessionStorage.getItem('api-key-school'))
  const demoAccess = ref(sessionStorage.getItem('demo-access') === 'true')

  const isAuthenticated = computed(() => !!schoolNumber.value && !!apiKeySchool.value)

  function login(newSchoolNumber: string, newApiKeySchool: string, isDemoAccess: boolean) {
    schoolNumber.value = newSchoolNumber
    apiKeySchool.value = newApiKeySchool
    demoAccess.value = isDemoAccess

    sessionStorage.setItem('school-number', newSchoolNumber)
    sessionStorage.setItem('api-key-school', newApiKeySchool)
    sessionStorage.setItem('demo-access', String(isDemoAccess))
  }

  function logout() {
    schoolNumber.value = null
    apiKeySchool.value = null
    demoAccess.value = false

    sessionStorage.removeItem('school-number')
    sessionStorage.removeItem('api-key-school')
    sessionStorage.removeItem('demo-access')
  }

  return {
    schoolNumber,
    apiKeySchool,
    demoAccess,
    isAuthenticated,
    login,
    logout,
  }
})
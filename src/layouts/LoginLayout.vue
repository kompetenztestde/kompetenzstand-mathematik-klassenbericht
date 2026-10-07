<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { DEFAULT_DEMO_SCHOOL_NUMBER, useAuthStore } from '@/stores/auth'

type CustomWindow = Window & {
  appConfig?: {
    api?: {
      xApiKeySchool?: string
    }
  }
}

const router = useRouter()
const auth = useAuthStore()
const showPassword = ref(false)

const form = reactive({
  country: '',
  schoolNumber: '',
  password: '',
})

const demoAccess = reactive({ enabled: false })

const errors = reactive({
  country: '',
  schoolNumber: '',
  password: '',
  apiKeySchool: '',
})

const demoApiKeySchool = computed(
  () =>
    (window as CustomWindow).appConfig?.api?.xApiKeySchool ||
    import.meta.env.VITE_X_API_KEY_SCHOOL ||
    DEFAULT_DEMO_SCHOOL_NUMBER,
)

const isFormValid = computed(() => {
  if (demoAccess.enabled) {
    return !!form.schoolNumber.trim()
  }

  return !!form.country && !!form.schoolNumber.trim() && !!form.password.trim()
})

watch(
  () => demoAccess.enabled,
  (enabled) => {
    errors.schoolNumber = ''
    errors.country = ''
    errors.password = ''
    errors.apiKeySchool = ''
    form.country = ''
    form.schoolNumber = enabled ? DEFAULT_DEMO_SCHOOL_NUMBER : ''
    form.password = enabled ? demoApiKeySchool.value : ''
  },
)

watch(
  () => form.country,
  () => {
    errors.country = ''
  },
)

watch(
  () => form.schoolNumber,
  () => {
    errors.schoolNumber = ''
  },
)

watch(
  () => form.password,
  () => {
    errors.password = ''
    errors.apiKeySchool = ''
  },
)

function login() {
  errors.country = ''
  errors.schoolNumber = ''
  errors.password = ''
  errors.apiKeySchool = ''

  if (!demoAccess.enabled && !form.country) {
    errors.country = 'Bitte wähle ein Bundesland aus.'
    return
  }

  if (!form.schoolNumber.trim()) {
    errors.schoolNumber = 'Bitte gib die Schulnummer ein.'
    return
  }

  const apiKeySchool = demoAccess.enabled ? demoApiKeySchool.value : form.password.trim()

  if (!apiKeySchool) {
    errors.apiKeySchool = 'Der Demo-Zugang ist nicht konfiguriert.'
    return
  }

  if (!demoAccess.enabled && !form.password.trim()) {
    errors.password = 'Bitte gib das Passwort ein.'
    return
  }

  auth.login(form.schoolNumber.trim(), apiKeySchool, demoAccess.enabled)
  router.replace('/step-1')
}
</script>

<template>
  <div class="login-container noPaddingPage">
    <div class="login-wrapper">
      <div class="login-content-wrapper">
        <div class="login-info-section">
          <h1 class="login-title">Kompetenzstand-Mathematik</h1>
          <p class="info-text-main">
            Prototypisches Rückmeldeportal im
            <a
              href="https://zepf.rptu.de/forschung/forschung-alleprojekte/tbaiii"
              target="_blank"
              class="info-link"
              >Verbundprojekt TBA III</a
            >, entwickelt vom
            <a href="https://www.kompetenztest.de" target="_blank" class="info-link"
              >Projekt <span class="info-italic">kompetenztest.de</span></a
            >
            der Friedrich-Schiller-Universität Jena.
          </p>

          <p class="info-text-secondary">
            Dieses Portal dient zu Evaluations- und Demonstrationszwecken. Wenn Sie nicht Teil der Evaluation sind, können Sie sich mit dem Demo-Zugang anmelden.
          </p>

          <div class="logos-section">
            <img
              src="@/assets/images/uni-jena-logo.jpg"
              alt="Logo der Universität Jena"
              class="logo-image"
            />
            <img
              src="@/assets/images/kt-logo.png"
              alt="Logo kompetenztest.de"
              class="logo-image"
            />
          </div>
        </div>

        <div class="login-form-wrapper">
          <div class="login-form-container">
            <form class="login-form" @submit.prevent="login">
              <fieldset class="form-fieldset">
                <div class="form-group demo-access-group">
                  <label id="demo-access-label" class="form-label">Demo-Zugang</label>
                  <div class="demo-access-options" role="group" aria-labelledby="demo-access-label">
                    <button
                      type="button"
                      class="demo-access-option"
                      :class="{ 'demo-access-option-active': !demoAccess.enabled }"
                      :aria-pressed="!demoAccess.enabled"
                      @click="demoAccess.enabled = false"
                    >
                      Nein
                    </button>
                    <button
                      type="button"
                      class="demo-access-option"
                      :class="{ 'demo-access-option-active': demoAccess.enabled }"
                      :aria-pressed="demoAccess.enabled"
                      @click="demoAccess.enabled = true"
                    >
                      Ja
                    </button>
                  </div>
                </div>

                <div v-if="!demoAccess.enabled" class="form-group">
                  <label for="country" class="form-label">Bundesland</label>
                  <select
                    id="country"
                    v-model="form.country"
                    name="country"
                    class="form-input"
                    :class="{ 'input-error': errors.country }"
                  >
                    <option value="" disabled hidden>Auswählen</option>
                    <option value="sn">Sachsen</option>
                    <option value="th">Thüringen</option>
                  </select>
                  <p v-if="errors.country" class="error-message">{{ errors.country }}</p>
                </div>

                <div class="form-group">
                  <label for="schoolNumber" class="form-label">Schulnummer</label>
                  <input
                    id="schoolNumber"
                    v-model="form.schoolNumber"
                    type="text"
                    name="schoolNumber"
                    class="form-input"
                    :disabled="!demoAccess.enabled && !form.country"
                    :class="{ 'input-error': errors.schoolNumber }"
                    autocomplete="username"
                  />
                  <p v-if="errors.schoolNumber" class="error-message">{{ errors.schoolNumber }}</p>
                </div>

                <div v-if="!demoAccess.enabled" class="form-group">
                  <label for="schoolPassword" class="form-label">Passwort</label>
                  <div class="input-with-icon">
                    <input
                      id="schoolPassword"
                      v-model="form.password"
                      :type="showPassword ? 'text' : 'password'"
                      name="schoolPassword"
                      class="form-input"
                      :class="{ 'input-error': errors.password }"
                      autocomplete="current-password"
                    />
                    <button
                      type="button"
                      class="input-icon-button"
                      :aria-label="showPassword ? 'Passwort verbergen' : 'Passwort anzeigen'"
                      :title="showPassword ? 'Passwort verbergen' : 'Passwort anzeigen'"
                      @click="showPassword = !showPassword"
                    >
                      <svg
                        v-if="!showPassword"
                        class="input-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path
                          fill="currentColor"
                          d="M12 5c-5.2 0-9.3 4.2-10.5 6.3a1.3 1.3 0 0 0 0 1.4C2.7 14.8 6.8 19 12 19s9.3-4.2 10.5-6.3a1.3 1.3 0 0 0 0-1.4C21.3 9.2 17.2 5 12 5Zm0 11.5A4.5 4.5 0 1 1 12 7a4.5 4.5 0 0 1 0 9.5Zm0-2A2.5 2.5 0 1 0 12 9a2.5 2.5 0 0 0 0 5.5Z"
                        />
                      </svg>
                      <svg
                        v-else
                        class="input-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path
                          fill="currentColor"
                          d="m3.3 2.6 18.1 18.1-1.4 1.4-3.1-3.1A11.5 11.5 0 0 1 12 20C6.8 20 2.7 15.8 1.5 13.7a1.3 1.3 0 0 1 0-1.4 17.5 17.5 0 0 1 4.1-4.6L1.9 4l1.4-1.4Zm5 6.4 6.7 6.7A4.5 4.5 0 0 0 8.3 9Zm-2.1-2.1A11.7 11.7 0 0 1 12 4c5.2 0 9.3 4.2 10.5 6.3a1.3 1.3 0 0 1 0 1.4 17.4 17.4 0 0 1-3 3.6l-1.4-1.4a15.4 15.4 0 0 0 2.1-2.9C19.7 9.3 16.2 6 12 6c-1.6 0-3.1.4-4.4 1.1L6.2 6.9Z"
                        />
                      </svg>
                    </button>
                  </div>
                  <p v-if="errors.password" class="error-message">{{ errors.password }}</p>
                </div>

                <p v-if="errors.apiKeySchool" class="error-message" role="alert">{{ errors.apiKeySchool }}</p>

                <button type="submit" :disabled="!isFormValid" class="submit-button">
                  <span>Anmelden</span>
                  <svg
                    class="submit-button-icon"
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
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  grid-column: 1 / -1;
  height: 100dvh;
  min-height: 100dvh;
  width: 100%;
  min-width: 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 10px clamp(1rem, 2.5vw, 2rem) clamp(1rem, 2.5vw, 2rem);
  box-sizing: border-box;
  overflow-x: auto;
  overflow-y: auto;
}

.login-wrapper {
  width: 100%;
  max-width: 1120px;
  margin-top: 0;
}

.login-content-wrapper {
  width: 100%;
  min-width: 365px;
  max-width: 640px;
  margin: 0 auto;
  background: transparent;
  border: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 5rem;
  border-radius: 0;
  padding: 0;
  box-shadow: none;
}

.login-info-section {
  width: 100%;
  color: var(--color-navigation-blue);
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 0;
}

.info-text-main {
  text-align: left;
  font-size: clamp(1.125rem, 2vw, 1.35rem);
  letter-spacing: 0.025em;
  color: var(--color-navigation-blue);
  line-height: 1.7;
  margin: 0;
}

.login-title {
  margin: 0 0 1.25rem;
  color: var(--color-navigation-blue);
  font-family: 'League Spartan', sans-serif;
  font-size: clamp(2.5rem, 2.8vw, 2.75rem);
  font-weight: 600;
  line-height: 1.05;
  letter-spacing: 0.01em;
}

.info-link {
  color: var(--color-navigation-blue);
  font-weight: 700;
  text-decoration: none;
  transition: opacity 0.2s ease;
}

.info-link:hover,
.info-link:focus-visible {
  text-decoration: underline;
  opacity: 0.9;
}

.info-italic {
  font-style: italic;
}

.info-text-secondary {
  margin-top: 1.25rem;
  font-size: 1rem;
  line-height: 1.6;
  color: rgba(19, 63, 120, 0.84);
}

.logos-section {
  margin-top: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
}

.logo-image {
  width: auto;
  flex: 1 1 0;
  min-width: 0;
  max-width: 205px;
  height: auto;
  justify-self: center;
  object-fit: contain;
  opacity: 0.97;
  mix-blend-mode: multiply;
}

.logo-image:nth-child(2) {
  max-width: 270px;
}

.login-form-wrapper {
  width: 100%;
  display: flex;
  align-items: stretch;
}

.login-form-container {
  width: 100%;
  background: linear-gradient(180deg, #ffffff 0%, #f7fbff 100%);
  border: 1px solid oklch(87.2% 0.01 258.338);
  border-radius: 4px;
  padding: clamp(1rem, 2vw, 1.5rem);
}

.login-form,
.form-input {
  width: 100%;
}

.form-fieldset {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  border: none;
  padding: 0;
  margin: 0;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.demo-access-group {
  gap: 0.5rem;
}

.demo-access-options {
  display: flex;
  width: fit-content;
}

.demo-access-option {
  min-width: 3.5rem;
  min-height: 2.25rem;
  padding: 0.25rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0;
  background: var(--color-white);
  color: #4b5563;
  font-family: sans-serif;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;
}

.demo-access-option:hover,
.demo-access-option:focus-visible {
  position: relative;
  z-index: 1;
  border-color: #9ca3af;
  background: #f3f4f6;
}

.demo-access-option-active {
  border-color: #d1d5db;
  background: #e5e7eb;
  color: #374151;
}

.demo-access-option + .demo-access-option {
  margin-left: -1px;
}

.demo-access-option:first-child {
  border-radius: 0.375rem 0 0 0.375rem;
}

.demo-access-option:last-child {
  border-radius: 0 0.375rem 0.375rem 0;
}

.form-label {
  font-family: sans-serif;
  font-weight: 700;
  font-size: 1rem;
  line-height: 1.3;
  letter-spacing: 0.02em;
  color: var(--color-navigation-blue);
}

.form-input {
  min-height: 3.15rem;
  padding: 0.9rem 1rem;
  border: 1px solid rgba(19, 63, 120, 0.18);
  border-radius: 4px;
  background: var(--color-white);
  font-family: sans-serif;
  font-size: 1.05rem;
  line-height: 1.3;
  color: var(--color-navigation-blue);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-waterblue);
  box-shadow: 0 0 0 4px rgba(92, 124, 253, 0.12);
}

.form-input.input-error {
  border-color: #b42318;
  background: #fff5f5;
}

.form-input::placeholder {
  color: rgba(19, 63, 120, 0.48);
}

.input-with-icon {
  position: relative;
}

.input-with-icon .form-input {
  padding-right: 3.25rem;
}

.input-icon-button {
  position: absolute;
  top: 50%;
  right: 0.75rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0;
  transform: translateY(-50%);
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: rgba(19, 63, 120, 0.65);
  cursor: pointer;
}

.input-icon-button:hover {
  background: rgba(19, 63, 120, 0.08);
  color: var(--color-navigation-blue);
}

.input-icon-button:focus-visible {
  outline: 2px solid var(--color-waterblue);
  outline-offset: 2px;
}

.input-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.error-message {
  font-size: 0.8rem;
  color: #b42318;
  margin: 0;
  line-height: 1.4;
  font-weight: 600;
}

.submit-button {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  padding: 0.55rem 1.25rem;
  background: #003b44;
  color: #ffffff;
  border: none;
  border-radius: 7px;
  font-weight: 700;
  font-size: 1.15rem;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    opacity 0.2s ease;
  font-family: inherit;
  margin-top: 0.25rem;
  box-shadow: 0 8px 18px rgba(7, 54, 61, 0.15);
  letter-spacing: 0.025em;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 14px 22px rgba(15, 46, 126, 0.22);
}

.submit-button:focus-visible {
  outline: none;
  box-shadow: 0 0 0 4px rgba(92, 124, 253, 0.18), 0 14px 22px rgba(15, 46, 126, 0.18);
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  box-shadow: none;
}

.submit-button-icon {
  width: 1.6rem;
  height: 1.6rem;
  flex-shrink: 0;
}

@media (min-width: 1024px) {
  .login-wrapper {
    margin-top: 5rem;
  }

  .login-content-wrapper {
    max-width: none;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 5.5rem;
    padding: 0;
  }

  .login-info-section {
    width: 100%;
    max-width: 40rem;
    flex: 1;
    min-height: 24rem;
  }

  .login-form-wrapper {
    flex: 0 1 23rem;
  }
}

@media (max-width: 540px) {
  .login-content-wrapper {
    min-width: 0;
    gap: 3rem;
  }
}
</style>
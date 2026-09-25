<script setup lang="ts">
import { useModalStore } from '@/stores/modalStore'
import { nextTick } from 'vue'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Speaker from './icons/speaker.svg?component'
import Stop2 from './icons/stopIcon2.svg?component'
import Start from './icons/startIcon.svg?component'
import CloseIcon from './icons/closeIcon.svg?component'
import styles from './styles.module.css'
const { t } = useI18n()
const modalStore = useModalStore()

const closeBtnRef = ref<HTMLButtonElement | null>(null)
let lastFocusedElement: HTMLElement | null = null
const isSpeaking = ref(false)

const speak = () => {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
        isSpeaking.value = false

        const elements = document.querySelectorAll('[data-tts], .text-body p, .text-body li, .text-body h3')

        const totalElements = elements.length
        elements.forEach((el, index) => {
            const node = el as HTMLElement
            const text = node.innerText.trim()

            if (text.length > 0) {
                const utterance = new SpeechSynthesisUtterance(text)

                utterance.lang = 'de-DE'
                utterance.pitch = 0.8
                utterance.rate = 0.7

                if (node.tagName.startsWith('H')) {
                    utterance.pitch = 1.1
                }
                utterance.onstart = () => {
                    isSpeaking.value = true
                }

                utterance.onend = () => {
                    if (index === totalElements - 1) {
                        isSpeaking.value = false
                    }
                }

                utterance.onerror = () => {
                    isSpeaking.value = false
                }

                window.speechSynthesis.speak(utterance)
            }
        })
        window.speechSynthesis.resume()
    }
}

const resumeSpeaking = () => {
    if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume()
    } else if (!window.speechSynthesis.speaking) {
        speak()
    }
}

const pauseSpeaking = () => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause()
    }
}

const stopSpeaking = () => {
    window.speechSynthesis.cancel()
    isSpeaking.value = false
}

watch(
    () => modalStore.isOpen,
    async (newVal) => {
        if (newVal) {
            lastFocusedElement = document.activeElement as HTMLElement
            await nextTick()
            closeBtnRef.value?.focus()
            window.addEventListener('keydown', handleKeyDown)
        } else {
            window.speechSynthesis.cancel()
            window.removeEventListener('keydown', handleKeyDown)
            nextTick(() => lastFocusedElement?.focus())
        }
    },
)

const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') modalStore.closeModal()

    if (e.key === 'Tab') {
        const focusable = document.querySelectorAll('.modalContainer button, .modalContainer [href], .modalContainer input')
        if (focusable.length === 0) return

        const first = focusable[0] as HTMLElement
        const last = focusable[focusable.length - 1] as HTMLElement

        if (e.shiftKey && document.activeElement === first) {
            last.focus()
            e.preventDefault()
        } else if (!e.shiftKey && document.activeElement === last) {
            first.focus()
            e.preventDefault()
        }
    }
}
</script>

<template>
    <Teleport to="body">
        <Transition name="slide">
            <div v-if="modalStore.isOpen" :class="styles.modalOverlay" @click.self="modalStore.closeModal">
                <div :class="styles.modalContainer" role="dialog" aria-modal="true" aria-labelledby="modal-title">
                    <div :class="styles.modalColumn">
                        <button ref="closeBtnRef" :class="styles.closeBtn" @click="modalStore.closeModal">
                            <CloseIcon aria-hidden="true" />
                        </button>
                        <div :class="styles.modalContent">
                            <div :class="styles.btnRow">
                                <button :class="styles.speakerBtn" @click="speak">
                                    <Speaker aria-hidden="true" />
                                    <span class="text-label">{{ t('sideModal.speaker') }}</span>
                                </button>
                                <button v-if="!isSpeaking" :class="styles.actionButton" @click="resumeSpeaking">
                                    <Start aria-hidden="true" />
                                </button>                                
                                <button v-else :class="styles.actionButton" @click="stopSpeaking">
                                    <Stop2 aria-hidden="true" />
                                </button>
                            </div>
                            <h2 :class="styles.title" data-tts>{{ modalStore.title }}</h2>

                            <div data-tts class="text-body" v-html="modalStore.content" role="document"></div>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
    transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
    transform: translateX(100%);
}

.text-label {
    color: var(--color-navigation-blue);
}
</style>

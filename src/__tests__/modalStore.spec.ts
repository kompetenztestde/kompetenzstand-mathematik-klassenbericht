import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useModalStore } from '@/stores/modalStore' 

describe('useModalStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    it('sollte mit Standardwerten initialisiert werden', () => {
        const store = useModalStore()

        expect(store.isOpen).toBe(false)
        expect(store.title).toBe('')
        expect(store.content).toBe('')
    })

    it('sollte das Modal mit Titel und Inhalt öffnen', () => {
        const store = useModalStore()

        store.openModal('Mein Titel', 'Das ist der Inhalt des Modals')

        expect(store.isOpen).toBe(true)
        expect(store.title).toBe('Mein Titel')
        expect(store.content).toBe('Das ist der Inhalt des Modals')
    })

    it('sollte das Modal schließen', () => {
        const store = useModalStore()

        store.openModal('Titel', 'Inhalt')
        expect(store.isOpen).toBe(true)

        store.closeModal()
        expect(store.isOpen).toBe(false)

        expect(store.title).toBe('Titel')
        expect(store.content).toBe('Inhalt')
    })
})
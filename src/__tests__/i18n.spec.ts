import { describe, it, expect } from 'vitest'
import i18n from '../i18n'

describe('i18n configuration', () => {
    it('should be initialized with correct settings', () => {
        expect(i18n.mode).toBe('composition')
        expect(i18n.global.locale.value).toBe('de')
        expect(i18n.global.fallbackLocale.value).toBe('de')
    })

    it('should load German messages and translate correctly', () => {
        expect(i18n.global.messages.value).toHaveProperty('de')

        const translation = i18n.global.t('home.feedback')
        expect(translation).not.toBe('welcome')
        expect(typeof translation).toBe('string')
    })
})

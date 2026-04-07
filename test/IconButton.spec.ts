/// <reference types="vite/client" />

import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import IconButton from '../components/IconButton.vue'
import iconButtonSource from '../components/IconButton.vue?raw'

const global = {
    directives: {
        tooltip: {
            mounted() {
                return undefined
            },
        },
    },
}

describe('TablerIconButton', () => {
    it('adds hover styling when no explicit color is provided', () => {
        const wrapper = mount(IconButton, {
            props: {
                title: 'Toggle Panel',
            },
            slots: {
                default: 'X',
            },
            global,
        })

        expect(wrapper.get('div').classes()).toContain('custom-hover')
    })

    it('skips hover styling when a custom color is provided', () => {
        const wrapper = mount(IconButton, {
            props: {
                title: 'Toggle Panel',
                color: '#123456',
            },
            slots: {
                default: 'X',
            },
            global,
        })

        expect(wrapper.get('div').classes()).not.toContain('custom-hover')
    })

    it('uses theme-derived hover colors and borders instead of fixed values', () => {
        expect(iconButtonSource).toContain('transition: background-color 0.15s ease, border-color 0.15s ease;')
        expect(iconButtonSource).toContain('border: 1px solid transparent;')

        expect(iconButtonSource).toContain("[data-bs-theme='light'] .custom-hover:not(.disabled):hover,")
        expect(iconButtonSource).toContain("[data-bs-theme='light'] .custom-hover:not(.disabled):focus-visible,")
        expect(iconButtonSource).toContain("[data-bs-theme='light'] .custom-hover:not(.disabled):focus-within {")
        expect(iconButtonSource).toContain('border-color: color-mix(in srgb, var(--tblr-body-color) 18%, transparent);')
        expect(iconButtonSource).toContain('background: color-mix(in srgb, var(--tblr-body-color) 8%, transparent);')

        expect(iconButtonSource).toContain("[data-bs-theme='dark'] .custom-hover:not(.disabled):hover,")
        expect(iconButtonSource).toContain("[data-bs-theme='dark'] .custom-hover:not(.disabled):focus-visible,")
        expect(iconButtonSource).toContain("[data-bs-theme='dark'] .custom-hover:not(.disabled):focus-within {")
        expect(iconButtonSource).toContain('border-color: color-mix(in srgb, var(--tblr-light) 30%, transparent);')
        expect(iconButtonSource).toContain('background: color-mix(in srgb, var(--tblr-light) 12%, transparent);')
    })
})

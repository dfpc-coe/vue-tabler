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

    it('uses CloudTAK light hover colors in light mode and inverted colors in dark mode', () => {
        expect(iconButtonSource).toContain("[data-bs-theme='light'] .custom-hover:not(.disabled):hover,")
        expect(iconButtonSource).toContain("[data-bs-theme='light'] .custom-hover:not(.disabled):focus-visible {")
        expect(iconButtonSource).toContain('background-color: var(--cloudtak-light, rgba(var(--tblr-primary-rgb), 0.08));')
        expect(iconButtonSource).toContain('color: var(--tblr-body-color);')

        expect(iconButtonSource).toContain("[data-bs-theme='dark'] .custom-hover:not(.disabled):hover,")
        expect(iconButtonSource).toContain("[data-bs-theme='dark'] .custom-hover:not(.disabled):focus-visible {")
        expect(iconButtonSource).toContain('background-color: var(--tblr-light);')
        expect(iconButtonSource).toContain('color: var(--tblr-dark);')
    })
})

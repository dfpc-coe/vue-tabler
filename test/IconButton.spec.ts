/// <reference types="vite/client" />

import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import IconButton from '../components/IconButton.vue'
import iconButtonSource from '../components/IconButton.vue?raw'

describe('TablerIconButton', () => {
    it('adds hover styling when no explicit color is provided', () => {
        const wrapper = mount(IconButton, {
            props: {
                title: 'Toggle Panel',
            },
            slots: {
                default: 'X',
            },
        })

        expect(wrapper.get('div').classes()).toContain('custom-hover')
    })

    it('exposes the title as a native tooltip and accessible name', () => {
        const wrapper = mount(IconButton, {
            props: {
                title: 'Toggle Panel',
            },
            slots: {
                default: 'X',
            },
        })

        expect(wrapper.get('div').attributes('title')).toBe('Toggle Panel')
        expect(wrapper.get('div').attributes('aria-label')).toBe('Toggle Panel')
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

    it('omits aria-pressed unless used as a toggle', () => {
        const plain = mount(IconButton, { props: { title: 'Toggle Panel' } })
        expect(plain.get('div').attributes('aria-pressed')).toBeUndefined()

        const off = mount(IconButton, { props: { title: 'Toggle Panel', active: false } })
        expect(off.get('div').attributes('aria-pressed')).toBe('false')
        expect(off.get('div').classes()).toContain('custom-hover')
        expect(off.get('div').classes()).not.toContain('icon-button-active')
    })

    it('fills with the primary color when active', () => {
        const wrapper = mount(IconButton, { props: { title: 'Toggle Panel', active: true } })

        expect(wrapper.get('div').attributes('aria-pressed')).toBe('true')
        expect(wrapper.get('div').classes()).toContain('icon-button-active')
        expect(wrapper.get('div').classes()).not.toContain('custom-hover')
        expect(iconButtonSource).toContain('background: var(--tblr-primary);')
    })

    it('draws a button outline when bordered', () => {
        const wrapper = mount(IconButton, { props: { title: 'Toggle Panel', bordered: true } })

        expect(wrapper.get('div').classes()).toContain('icon-button-bordered')
        expect(wrapper.get('div').classes()).toContain('custom-hover')
        expect(iconButtonSource).toContain('border: var(--tblr-border-width) solid var(--tblr-border-color);')
    })
})

describe('TablerIconButton disabled', () => {
    it('passes clicks and Enter through while enabled', async () => {
        let clicks = 0
        const wrapper = mount(IconButton, { props: { title: 'Go' }, attrs: { onClick: () => clicks++ } })

        await wrapper.trigger('click')
        await wrapper.trigger('keyup.enter')

        expect(clicks).toBe(2)
        expect(wrapper.attributes('tabindex')).toBe('0')
        expect(wrapper.attributes('aria-disabled')).toBeUndefined()
    })

    it('swallows clicks and Enter while disabled', async () => {
        let clicks = 0
        const wrapper = mount(IconButton, {
            props: { title: 'Go', disabled: true },
            attrs: { onClick: () => clicks++ },
            slots: { default: '<i class="inner" />' },
        })

        await wrapper.trigger('click')
        await wrapper.trigger('keyup.enter')
        await wrapper.find('.inner').trigger('click')

        expect(clicks).toBe(0)
        expect(wrapper.attributes('tabindex')).toBe('-1')
        expect(wrapper.attributes('aria-disabled')).toBe('true')
    })
})

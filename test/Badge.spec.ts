import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Badge from '../components/Badge.vue'

describe('TablerBadge', () => {
    it('renders the default slot content', () => {
        const wrapper = mount(Badge, {
            slots: {
                default: 'Allowed',
            },
        })

        expect(wrapper.get('span').text().trim()).toBe('Allowed')
    })

    it('applies the default badge colors', () => {
        const wrapper = mount(Badge)
        const badge = wrapper.get('span').element as HTMLSpanElement

        expect(badge.style.backgroundColor).toBe('rgba(34, 197, 94, 0.2)')
        expect(badge.style.borderColor).toBe('rgba(27, 158, 75, 0.2)')
        expect(badge.style.color).toBe('rgb(255, 255, 255)')
    })

    it('derives a darker border color from the provided background color', () => {
        const wrapper = mount(Badge, {
            props: {
                backgroundColor: '#336699',
            },
        })

        const badge = wrapper.get('span').element as HTMLSpanElement

        expect(badge.style.backgroundColor).toBe('rgb(51, 102, 153)')
        expect(badge.style.borderColor).toBe('rgb(41, 82, 122)')
    })

    it('prefers explicit border and text colors when provided', () => {
        const wrapper = mount(Badge, {
            props: {
                backgroundColor: 'rgba(1, 2, 3, 0.4)',
                borderColor: '#123456',
                textColor: '#abcdef',
            },
        })

        const badge = wrapper.get('span').element as HTMLSpanElement

        expect(badge.style.borderColor).toBe('rgb(18, 52, 86)')
        expect(badge.style.color).toBe('rgb(171, 205, 239)')
    })
})

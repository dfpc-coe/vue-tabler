import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from '../components/Button.vue'

describe('TablerButton', () => {
    it('renders the default slot content', () => {
        const wrapper = mount(Button, {
            slots: {
                default: 'Click Me',
            },
        })

        expect(wrapper.get('button').text().trim()).toBe('Click Me')
    })

    it('sets the disabled attribute when disabled is true', () => {
        const wrapper = mount(Button, {
            props: {
                disabled: true,
            },
        })

        expect(wrapper.get('button').attributes('disabled')).toBeDefined()
        expect((wrapper.get('button').element as HTMLButtonElement).disabled).toBe(true)
    })

    it('applies the provided background color', () => {
        const wrapper = mount(Button, {
            props: {
                color: 'red',
            },
        })

        expect((wrapper.get('button').element as HTMLButtonElement).style.backgroundColor).toBe('red')
    })

    it('does not apply a background color when color is omitted', () => {
        const wrapper = mount(Button)

        expect((wrapper.get('button').element as HTMLButtonElement).style.backgroundColor).toBe('')
    })
})
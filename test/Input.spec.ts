import { describe, expect, it } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import Input from '../components/input/Input.vue'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function bound(props: Record<string, unknown>): any {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const wrapper: any = mount(Input, {
        props: {
            ...props,
            'onUpdate:modelValue': (value: unknown) => wrapper.setProps({ modelValue: value }),
        },
    })

    return wrapper
}

const value = (wrapper: ReturnType<typeof mount>, selector = 'input') => {
    return (wrapper.find(selector).element as HTMLInputElement).value
}

describe('TablerInput', () => {
    it('renders a text input with the label as its placeholder', () => {
        const wrapper = mount(Input, { props: { modelValue: 'abc', label: 'Name' } })

        expect(value(wrapper)).toBe('abc')
        expect(wrapper.find('input').attributes('placeholder')).toBe('Name')
        expect(wrapper.text()).toContain('Name')
    })

    it('emits typed text and follows the model', async () => {
        const wrapper = mount(Input, { props: { modelValue: '' } })

        await wrapper.find('input').setValue('hello')
        expect(wrapper.emitted('update:modelValue')).toEqual([['hello']])

        await wrapper.setProps({ modelValue: 'changed' })
        expect(value(wrapper)).toBe('changed')
    })

    it('shows an empty field for a null or undefined model', () => {
        expect(value(mount(Input, { props: { modelValue: null } }))).toBe('')
        expect(value(mount(Input))).toBe('')
    })

    it('emits numbers from a number input', async () => {
        const wrapper = mount(Input, { props: { modelValue: 1, type: 'number' } })

        await wrapper.find('input').setValue('2.5')
        expect(wrapper.emitted('update:modelValue')).toEqual([[2.5]])
    })

    it('clears a number to undefined and leaves the field empty', async () => {
        const wrapper = bound({ modelValue: 12, type: 'number' })

        await wrapper.find('input').setValue('')
        await flushPromises()

        expect(wrapper.emitted('update:modelValue')).toEqual([[undefined]])
        expect(value(wrapper)).toBe('')
        expect(wrapper.find('.invalid-feedback').exists()).toBe(false)
    })

    it('clears an integer to undefined and rejects fractions', async () => {
        const wrapper = bound({ modelValue: 12, type: 'integer' })

        expect(wrapper.find('input').attributes('type')).toBe('number')

        await wrapper.find('input').setValue('1.5')
        expect(wrapper.find('.invalid-feedback').text()).toBe('Must be an integer!')
        expect(wrapper.emitted('update:modelValue')).toBeUndefined()

        await wrapper.find('input').setValue('3')
        expect(wrapper.emitted('update:modelValue')).toEqual([[3]])
        expect(wrapper.find('.invalid-feedback').exists()).toBe(false)

        await wrapper.find('input').setValue('')
        await flushPromises()
        expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([undefined])
    })

    it('emits submit on Enter for a single line input', async () => {
        const wrapper = mount(Input, { props: { modelValue: 'a' } })

        await wrapper.find('input').trigger('keyup.enter')
        expect(wrapper.emitted('submit')).toHaveLength(1)
    })

    it('keeps Enter as a line break in a textarea and submits on Ctrl or Cmd Enter', async () => {
        const wrapper = mount(Input, { props: { modelValue: 'a', rows: 3 } })
        const textarea = wrapper.find('textarea')

        expect(textarea.attributes('rows')).toBe('3')

        await textarea.trigger('keyup.enter')
        await textarea.trigger('keydown.enter')
        expect(wrapper.emitted('submit')).toBeUndefined()

        await textarea.trigger('keydown.enter', { ctrlKey: true })
        await textarea.trigger('keydown.enter', { metaKey: true })
        expect(wrapper.emitted('submit')).toHaveLength(2)
    })

    it('toggles password visibility without following the link', async () => {
        const wrapper = mount(Input, { props: { modelValue: 'secret', type: 'password' } })

        expect(wrapper.find('input').attributes('type')).toBe('password')

        const click = new MouseEvent('click', { bubbles: true, cancelable: true })
        wrapper.find('a').element.dispatchEvent(click)
        await flushPromises()

        expect(click.defaultPrevented).toBe(true)
        expect(wrapper.find('input').attributes('type')).toBe('text')
        expect(wrapper.find('a').attributes('aria-label')).toBe('Hide Password')
    })

    it('clears a search input without following the link', async () => {
        const wrapper = mount(Input, { props: { modelValue: 'query', icon: 'search' } })

        const click = new MouseEvent('click', { bubbles: true, cancelable: true })
        wrapper.find('a[aria-label="Clear"]').element.dispatchEvent(click)
        await flushPromises()

        expect(click.defaultPrevented).toBe(true)
        expect(wrapper.emitted('update:modelValue')).toEqual([['']])
    })

    it('shows the error prop and the loading spinner', () => {
        const wrapper = mount(Input, { props: { modelValue: '', error: 'Bad value', loading: true } })

        expect(wrapper.find('input').classes()).toContain('is-invalid')
        expect(wrapper.find('.invalid-feedback').text()).toBe('Bad value')
        expect(wrapper.find('.spinner-border').exists()).toBe(true)
    })

    it('renders the icon and end slots', () => {
        const wrapper = mount(Input, {
            props: { modelValue: '' },
            slots: { icon: '<i class="lead" />', end: '<i class="trail" />' },
        })

        expect(wrapper.find('.lead').exists()).toBe(true)
        expect(wrapper.find('.tabler-input-end .trail').exists()).toBe(true)
    })

    it('emits focus and blur and honours disabled', async () => {
        const wrapper = mount(Input, { props: { modelValue: '' } })

        await wrapper.find('input').trigger('focus')
        await wrapper.find('input').trigger('blur')

        expect(wrapper.emitted('focus')).toHaveLength(1)
        expect(wrapper.emitted('blur')).toHaveLength(1)

        await wrapper.setProps({ disabled: true })
        expect((wrapper.find('input').element as HTMLInputElement).disabled).toBe(true)
    })
})

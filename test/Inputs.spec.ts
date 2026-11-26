import { afterEach, describe, expect, it } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import Enum from '../components/input/Enum.vue'
import MultiEnum from '../components/input/MultiEnum.vue'
import Colour from '../components/input/Colour.vue'
import Range from '../components/input/Range.vue'
import Select from '../components/input/Select.vue'
import Toggle from '../components/input/Toggle.vue'
import FileInput from '../components/input/FileInput.vue'
import TimeZone from '../components/input/TimeZone.vue'
import Label from '../components/internal/Label.vue'

afterEach(() => {
    document.body.innerHTML = ''
})

describe('TablerEnum', () => {
    it('renders one option per value and selects the model value', () => {
        const wrapper = mount(Enum, { props: { modelValue: 'b', options: ['a', 'b', 'c'] } })

        expect(wrapper.findAll('option').map((o) => o.text())).toEqual(['a', 'b', 'c'])
        expect((wrapper.find('select').element as HTMLSelectElement).value).toBe('b')
        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    it('emits the selected option and follows the model', async () => {
        const wrapper = mount(Enum, { props: { modelValue: 'a', options: ['a', 'b'] } })

        await wrapper.find('select').setValue('b')
        expect(wrapper.emitted('update:modelValue')).toEqual([['b']])

        await wrapper.setProps({ modelValue: 'b' })
        await wrapper.setProps({ modelValue: 'a' })
        expect((wrapper.find('select').element as HTMLSelectElement).value).toBe('a')
    })

    it('emits the default it falls back to for an empty model', async () => {
        const wrapper = mount(Enum, { props: { modelValue: '', default: 'b', options: ['a', 'b'] } })
        await flushPromises()

        expect((wrapper.find('select').element as HTMLSelectElement).value).toBe('b')
        expect(wrapper.emitted('update:modelValue')).toEqual([['b']])
    })

    it('disables the select and emits blur', async () => {
        const wrapper = mount(Enum, { props: { modelValue: 'a', options: ['a'], label: 'Kind' } })

        await wrapper.find('select').trigger('blur')
        await wrapper.setProps({ disabled: true })

        expect((wrapper.find('select').element as HTMLSelectElement).disabled).toBe(true)
        expect(wrapper.emitted('blur')).toHaveLength(1)
        expect(wrapper.text()).toContain('Kind')
    })
})

describe('TablerMultiEnum', () => {
    it('checks the boxes in the model and follows it', async () => {
        const wrapper = mount(MultiEnum, { props: { modelValue: ['b'], options: ['a', 'b'] } })
        const checked = () => wrapper.findAll('input').map((i) => (i.element as HTMLInputElement).checked)

        expect(checked()).toEqual([false, true])

        await wrapper.setProps({ modelValue: ['a'] })
        expect(checked()).toEqual([true, false])
    })

    it('disables every box when disabled', () => {
        const wrapper = mount(MultiEnum, { props: { modelValue: [], options: ['a', 'b'], disabled: true } })

        expect(wrapper.findAll('input').every((i) => (i.element as HTMLInputElement).disabled)).toBe(true)
    })
})

describe('TablerColour', () => {
    const checked = (wrapper: ReturnType<typeof mount>) => {
        return wrapper.findAll('input').filter((i) => (i.element as HTMLInputElement).checked).map((i) => i.attributes('value'))
    }

    it('selects the swatch matching the model', async () => {
        const wrapper = mount(Colour, { props: { modelValue: '#d63939' } })
        await flushPromises()

        expect(wrapper.findAll('input')).toHaveLength(11)
        expect(checked(wrapper)).toEqual(['red'])
        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    it('emits the hex of a picked swatch', async () => {
        const wrapper = mount(Colour, { props: { modelValue: '#d63939' } })
        await flushPromises()

        await wrapper.find('input[value="blue"]').setValue(true)
        expect(wrapper.emitted('update:modelValue')).toEqual([['#206bc4']])
    })

    it('matches hex values of any case', async () => {
        const wrapper = mount(Colour, { props: { modelValue: '#FFFFFF' } })
        await flushPromises()

        expect(checked(wrapper)).toEqual(['white'])
        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    it('leaves a colour outside of the palette alone', async () => {
        const wrapper = mount(Colour, { props: { modelValue: '#ff0000' } })
        await flushPromises()

        expect(checked(wrapper)).toEqual([])
        expect(wrapper.emitted('update:modelValue')).toBeUndefined()

        await wrapper.setProps({ modelValue: '#123456' })
        await flushPromises()
        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    it('falls back to the default for an empty model', async () => {
        const wrapper = mount(Colour, { props: { modelValue: '', default: '#74b816' } })
        await flushPromises()

        expect(checked(wrapper)).toEqual(['lime'])
        expect(wrapper.emitted('update:modelValue')).toEqual([['#74b816']])
    })
})

describe('TablerRange', () => {
    it('renders the bounds and the model value', () => {
        const wrapper = mount(Range, { props: { modelValue: 3, min: 1, max: 9, step: 2 } })
        const input = wrapper.find('input')

        expect(input.attributes('min')).toBe('1')
        expect(input.attributes('max')).toBe('9')
        expect(input.attributes('step')).toBe('2')
        expect((input.element as HTMLInputElement).value).toBe('3')
    })

    it('emits numbers as the slider moves', async () => {
        const wrapper = mount(Range, { props: { modelValue: 0 } })

        await wrapper.find('input').setValue(5)
        expect(wrapper.emitted('update:modelValue')).toEqual([[5]])
    })

    it('emits again after the parent resets the value', async () => {
        const wrapper = mount(Range, { props: { modelValue: 0 } })
        const input = wrapper.find('input')

        await input.setValue(5)
        await wrapper.setProps({ modelValue: 0 })
        await input.setValue(5)

        expect(wrapper.emitted('update:modelValue')).toEqual([[5], [5]])
    })

    it('emits submit and blur', async () => {
        const wrapper = mount(Range, { props: { modelValue: 0 } })

        await wrapper.find('input').trigger('keyup.enter')
        await wrapper.find('input').trigger('blur')

        expect(wrapper.emitted('submit')).toHaveLength(1)
        expect(wrapper.emitted('blur')).toHaveLength(1)
    })
})

describe('TablerSelect', () => {
    it('shows the model value and marks it active', async () => {
        const wrapper = mount(Select, { props: { modelValue: 'b', options: ['a', 'b'] } })
        await flushPromises()

        expect(wrapper.find('.dropdown-toggle').text()).toBe('b')
        expect(wrapper.find('.dropdown-item.active').text()).toBe('b')
    })

    it('emits a picked option', async () => {
        const wrapper = mount(Select, { props: { modelValue: 'a', options: ['a', 'b'] } })
        await flushPromises()

        await wrapper.findAll('.dropdown-item')[1].trigger('click')
        expect(wrapper.emitted('update:modelValue')).toEqual([['b']])
    })

    it('emits the default for an empty model', async () => {
        const wrapper = mount(Select, { props: { modelValue: '', default: 'b', options: ['a', 'b'] } })
        await flushPromises()

        expect(wrapper.emitted('update:modelValue')).toEqual([['b']])
    })
})

describe('TablerToggle', () => {
    it('reflects the model and emits changes', async () => {
        const wrapper = mount(Toggle, { props: { modelValue: true, label: 'Enabled' } })
        const input = wrapper.find('input')

        expect((input.element as HTMLInputElement).checked).toBe(true)
        expect(wrapper.text()).toContain('Enabled')

        await input.setValue(false)
        expect(wrapper.emitted('update:modelValue')).toEqual([[false]])

        await wrapper.setProps({ modelValue: false })
        await wrapper.setProps({ modelValue: true })
        expect((input.element as HTMLInputElement).checked).toBe(true)
    })

    it('emits submit and blur and honours disabled', async () => {
        const wrapper = mount(Toggle, { props: { modelValue: false } })

        await wrapper.find('input').trigger('keyup.enter')
        await wrapper.find('input').trigger('blur')
        await wrapper.setProps({ disabled: true })

        expect(wrapper.emitted('submit')).toHaveLength(1)
        expect(wrapper.emitted('blur')).toHaveLength(1)
        expect((wrapper.find('input').element as HTMLInputElement).disabled).toBe(true)
    })
})

describe('TablerFileInput', () => {
    it('renders a file input limited to the accepted types', () => {
        const wrapper = mount(FileInput, { props: { accept: 'image/png', label: 'Logo' } })

        expect(wrapper.find('input').attributes('type')).toBe('file')
        expect(wrapper.find('input').attributes('accept')).toBe('image/png')
        expect(wrapper.text()).toContain('Logo')
    })

    it('emits the change event and blur', async () => {
        const wrapper = mount(FileInput)

        await wrapper.find('input').trigger('change')
        await wrapper.find('input').trigger('blur')

        expect(wrapper.emitted('change')![0][0]).toBeInstanceOf(Event)
        expect(wrapper.emitted('blur')).toHaveLength(1)
    })

    it('shows the error and the loading spinner', () => {
        const wrapper = mount(FileInput, { props: { error: 'Too large', loading: true } })

        expect(wrapper.find('input').classes()).toContain('is-invalid')
        expect(wrapper.find('.invalid-feedback').text()).toBe('Too large')
        expect(wrapper.find('.spinner-border').exists()).toBe(true)
    })
})

describe('TablerTimeZone', () => {
    const zones = (wrapper: ReturnType<typeof mount>) => {
        return wrapper.findAll('option').map((o) => o.text()).filter((label) => label !== 'No TimeZone')
    }

    it('only offers time zones the runtime accepts', () => {
        const wrapper = mount(TimeZone, { props: { modelValue: '' } })

        const invalid = zones(wrapper).map((label) => label.replace(/ \(GMT.*$/, '')).filter((tz) => {
            try {
                new Intl.DateTimeFormat('en', { timeZone: tz })
                return false
            } catch {
                return true
            }
        })

        expect(invalid).toEqual([])
    })

    it('shows the label of the stored zone, including UTC', async () => {
        const wrapper = mount(TimeZone, { props: { modelValue: 'America/Denver' } })
        const select = wrapper.find('select').element as HTMLSelectElement

        expect(select.value).toBe('America/Denver (GMT-07:00)')

        await wrapper.setProps({ modelValue: 'UTC' })
        expect(select.value).toBe('UTC (GMT+00:00)')

        await wrapper.setProps({ modelValue: '' })
        expect(select.value).toBe('No TimeZone')
    })

    it('emits the zone code of a picked label', async () => {
        const wrapper = mount(TimeZone, { props: { modelValue: '' } })

        await wrapper.find('select').setValue('Asia/Tokyo (GMT+09:00)')
        expect(wrapper.emitted('update:modelValue')).toEqual([['Asia/Tokyo']])

        await wrapper.setProps({ modelValue: 'Asia/Tokyo' })
        await wrapper.find('select').setValue('No TimeZone')
        expect(wrapper.emitted('update:modelValue')!.at(-1)).toEqual([''])
    })
})

describe('TablerLabel', () => {
    it('renders the label, the required marker and the slot', () => {
        const wrapper = mount(Label, {
            props: { label: 'Name', required: true },
            slots: { default: '<i class="extra" />' },
        })

        expect(wrapper.text()).toContain('Name')
        expect(wrapper.find('.text-red').exists()).toBe(true)
        expect(wrapper.find('.extra').exists()).toBe(true)
        expect(wrapper.find('.tabler-dropdown').exists()).toBe(false)
    })

    it('shows the description in a dropdown', async () => {
        const wrapper = mount(Label, {
            props: { label: 'Name', description: 'Shown to everyone' },
            attachTo: document.body,
        })

        await wrapper.find('.tabler-dropdown svg').trigger('click')
        await flushPromises()

        expect(document.body.querySelector('.tabler-dropdown__menu')?.textContent).toContain('Shown to everyone')

        wrapper.unmount()
    })
})

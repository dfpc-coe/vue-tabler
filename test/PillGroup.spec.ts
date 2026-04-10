import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PillGroup from '../components/PillGroup.vue'

const baseOptions = [
    { value: 'a', label: 'Alpha' },
    { value: 'b', label: 'Beta' },
    { value: 'c', label: 'Gamma' },
]

describe('TablerPillGroup', () => {
    it('renders all options as radio inputs with labels', () => {
        const wrapper = mount(PillGroup, {
            props: { modelValue: 'a', options: baseOptions },
        })

        const inputs = wrapper.findAll('input[type="radio"]')
        const labels = wrapper.findAll('label')

        expect(inputs).toHaveLength(3)
        expect(labels).toHaveLength(3)
        expect(labels[0].text()).toBe('Alpha')
        expect(labels[1].text()).toBe('Beta')
        expect(labels[2].text()).toBe('Gamma')
    })

    it('checks the input matching modelValue', () => {
        const wrapper = mount(PillGroup, {
            props: { modelValue: 'b', options: baseOptions },
        })

        const inputs = wrapper.findAll('input[type="radio"]')
        expect((inputs[0].element as HTMLInputElement).checked).toBe(false)
        expect((inputs[1].element as HTMLInputElement).checked).toBe(true)
        expect((inputs[2].element as HTMLInputElement).checked).toBe(false)
    })

    it('emits update:modelValue on click', async () => {
        const wrapper = mount(PillGroup, {
            props: { modelValue: 'a', options: baseOptions },
        })

        await wrapper.findAll('input[type="radio"]')[2].trigger('click')
        expect(wrapper.emitted('update:modelValue')).toEqual([['c']])
    })

    it('applies rounded and fullWidth classes by default', () => {
        const wrapper = mount(PillGroup, {
            props: { modelValue: 'a', options: baseOptions },
        })

        const group = wrapper.find('[role="group"]')
        expect(group.classes()).toContain('btn-group')
        expect(group.classes()).toContain('round')
        expect(group.classes()).toContain('w-100')
    })

    it('omits round and w-100 classes when disabled', () => {
        const wrapper = mount(PillGroup, {
            props: { modelValue: 'a', options: baseOptions, rounded: false, fullWidth: false },
        })

        const group = wrapper.find('[role="group"]')
        expect(group.classes()).toContain('btn-group')
        expect(group.classes()).not.toContain('round')
        expect(group.classes()).not.toContain('w-100')
    })

    it('applies btn-sm class when size is sm', () => {
        const wrapper = mount(PillGroup, {
            props: { modelValue: 'a', options: baseOptions, size: 'sm' },
        })

        const label = wrapper.find('label')
        expect(label.classes()).toContain('btn')
        expect(label.classes()).toContain('btn-sm')
    })

    it('does not apply btn-sm when size is default', () => {
        const wrapper = mount(PillGroup, {
            props: { modelValue: 'a', options: baseOptions, size: 'default' },
        })

        const label = wrapper.find('label')
        expect(label.classes()).toContain('btn')
        expect(label.classes()).not.toContain('btn-sm')
    })

    it('disables all inputs when disabled prop is true', () => {
        const wrapper = mount(PillGroup, {
            props: { modelValue: 'a', options: baseOptions, disabled: true },
        })

        wrapper.findAll('input[type="radio"]').forEach(input => {
            expect((input.element as HTMLInputElement).disabled).toBe(true)
        })
    })

    it('disables individual options', () => {
        const opts = [
            { value: 'a', label: 'A' },
            { value: 'b', label: 'B', disabled: true },
            { value: 'c', label: 'C' },
        ]
        const wrapper = mount(PillGroup, {
            props: { modelValue: 'a', options: opts },
        })

        const inputs = wrapper.findAll('input[type="radio"]')
        expect((inputs[0].element as HTMLInputElement).disabled).toBe(false)
        expect((inputs[1].element as HTMLInputElement).disabled).toBe(true)
        expect((inputs[2].element as HTMLInputElement).disabled).toBe(false)
    })

    it('uses custom name prop for radio group', () => {
        const wrapper = mount(PillGroup, {
            props: { modelValue: 'a', options: baseOptions, name: 'my-group' },
        })

        wrapper.findAll('input[type="radio"]').forEach(input => {
            expect(input.attributes('name')).toBe('my-group')
        })
    })

    it('applies custom padding', () => {
        const wrapper = mount(PillGroup, {
            props: { modelValue: 'a', options: baseOptions, padding: 'p-1' },
        })

        const group = wrapper.find('[role="group"]')
        expect(group.classes()).toContain('p-1')
        expect(group.classes()).not.toContain('px-2')
    })

    it('supports scoped option slot', () => {
        const wrapper = mount(PillGroup, {
            props: { modelValue: 'b', options: baseOptions },
            slots: {
                option: `<template #option="{ option, active }">
                    <span class="custom">{{ option.label }} {{ active ? 'ON' : 'OFF' }}</span>
                </template>`,
            },
        })

        const labels = wrapper.findAll('label')
        expect(labels[0].text()).toContain('Alpha OFF')
        expect(labels[1].text()).toContain('Beta ON')
    })
})

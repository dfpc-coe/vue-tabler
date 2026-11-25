import { afterEach, describe, expect, it } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import Confirm from '../components/Confirm.vue'

let wrapper: VueWrapper | undefined

const modal = () => document.body.querySelector('.modal')

describe('TablerConfirm', () => {
    afterEach(() => {
        wrapper?.unmount()
        wrapper = undefined
    })

    it('opens the confirmation from its own trigger', async () => {
        wrapper = mount(Confirm, { attachTo: document.body })

        expect(modal()).toBeNull()

        await wrapper.find('button').trigger('click')

        expect(modal()).not.toBeNull()
        expect(wrapper.emitted('update:open')).toEqual([[true]])
    })

    it('renders no trigger with displaytype none and follows v-model:open', async () => {
        wrapper = mount(Confirm, {
            props: { displaytype: 'none', open: false },
            attachTo: document.body,
        })

        expect(wrapper.find('button').exists()).toBe(false)
        expect(modal()).toBeNull()

        await wrapper.setProps({ open: true })
        expect(modal()).not.toBeNull()

        ;(modal()?.querySelector('.btn-primary') as HTMLElement).click()
        await nextTick()

        expect(wrapper.emitted('confirm')).toHaveLength(1)
        expect(modal()?.querySelector('.btn-primary svg')).toBeNull()

        await wrapper.setProps({ open: false })
        expect(modal()).toBeNull()

        await wrapper.setProps({ open: true })
        expect(modal()?.querySelector('.btn-primary svg')).not.toBeNull()
    })

    it('requests close from the dismiss button', async () => {
        wrapper = mount(Confirm, {
            props: { displaytype: 'none', open: true },
            attachTo: document.body,
        })

        ;(modal()?.querySelector('.btn-close') as HTMLElement).click()
        await nextTick()

        expect(wrapper.emitted('update:open')).toEqual([[false]])
    })

    it('renders the heading and description, or the default slot in its place', () => {
        wrapper = mount(Confirm, {
            props: { displaytype: 'none', open: true, heading: 'Load Plugin', description: 'Run it?' },
            attachTo: document.body,
        })

        expect(modal()?.querySelector('.modal-header')?.textContent).toBe('Load Plugin')
        expect(modal()?.querySelector('.modal-body')?.textContent).toBe('Run it?')

        wrapper.unmount()
        wrapper = mount(Confirm, {
            props: { displaytype: 'none', open: true },
            slots: { default: 'Slotted' },
            attachTo: document.body,
        })

        expect(modal()?.querySelector('.modal-body')?.textContent).toBe('Slotted')
    })
})

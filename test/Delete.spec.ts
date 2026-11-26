import { afterEach, describe, expect, it } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import Delete from '../components/Delete.vue'

let wrapper: VueWrapper | undefined

const modal = () => document.body.querySelector('.modal')

describe('TablerDelete', () => {
    afterEach(() => {
        wrapper?.unmount()
        wrapper = undefined
    })

    it('opens the confirmation from its own trigger', async () => {
        wrapper = mount(Delete, { attachTo: document.body })

        expect(modal()).toBeNull()

        await wrapper.find('button').trigger('click')

        expect(modal()).not.toBeNull()
        expect(wrapper.emitted('update:open')).toEqual([[true]])
    })

    it('renders no trigger with displaytype none and follows v-model:open', async () => {
        wrapper = mount(Delete, {
            props: { displaytype: 'none', open: false },
            attachTo: document.body,
        })

        expect(wrapper.find('button').exists()).toBe(false)
        expect(modal()).toBeNull()

        await wrapper.setProps({ open: true })
        expect(modal()).not.toBeNull()

        ;(modal()?.querySelector('.btn-danger') as HTMLElement).click()
        await nextTick()

        expect(wrapper.emitted('delete')).toHaveLength(1)
        expect(modal()?.querySelector('.btn-danger svg')).toBeNull()

        await wrapper.setProps({ open: false })
        expect(modal()).toBeNull()

        await wrapper.setProps({ open: true })
        expect(modal()?.querySelector('.btn-danger svg')).not.toBeNull()
    })

    it('requests close from the dismiss button', async () => {
        wrapper = mount(Delete, {
            props: { displaytype: 'none', open: true },
            attachTo: document.body,
        })

        ;(modal()?.querySelector('.btn-close') as HTMLElement).click()
        await nextTick()

        expect(wrapper.emitted('update:open')).toEqual([[false]])
    })
})

describe('TablerDelete confirmation', () => {
    const confirm = () => document.body.querySelector('.modal-footer .btn') as HTMLElement

    afterEach(() => {
        wrapper?.unmount()
        wrapper = undefined
    })

    it('emits delete once however often the button is clicked', async () => {
        wrapper = mount(Delete, { props: { open: true }, attachTo: document.body })

        confirm().click()
        confirm().click()
        await nextTick()

        expect(wrapper.emitted('delete')).toHaveLength(1)
        expect(confirm().querySelector('.spinner-border')).not.toBeNull()
    })

    it('waits for the match text before deleting', async () => {
        wrapper = mount(Delete, { props: { open: true, match: 'prod' }, attachTo: document.body })

        confirm().click()
        expect(wrapper.emitted('delete')).toBeUndefined()
        expect(confirm().classList.contains('disabled')).toBe(true)

        const input = document.body.querySelector('.modal-body input') as HTMLInputElement
        input.value = 'prod'
        input.dispatchEvent(new Event('input'))
        await nextTick()
        await nextTick()

        confirm().click()
        expect(wrapper.emitted('delete')).toHaveLength(1)
    })

    it('does not open while disabled', async () => {
        wrapper = mount(Delete, { props: { displaytype: 'icon', disabled: true }, attachTo: document.body })

        await wrapper.find('[role="button"]').trigger('click')

        expect(modal()).toBeNull()
        expect(wrapper.emitted('update:open')).toBeUndefined()
    })
})

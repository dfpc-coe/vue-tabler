import { afterEach, describe, expect, it } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import Dropdown from '../components/Dropdown.vue'

let wrapper: VueWrapper | undefined

const mountDropdown = async () => {
    wrapper = mount(Dropdown, {
        slots: {
            default: '<button class="trigger">Open</button>',
            dropdown: '<li><input class="search" /></li>',
        },
        attachTo: document.body,
    })

    await wrapper.find('.trigger').trigger('click')
    await nextTick()

    return wrapper
}

const menu = () => document.body.querySelector('.tabler-dropdown__menu')

describe('TablerDropdown', () => {
    afterEach(() => {
        wrapper?.unmount()
        wrapper = undefined
    })

    it('teleports the menu to body when opened', async () => {
        await mountDropdown()
        expect(menu()).not.toBeNull()
    })

    it('closes on Escape from inside the menu without the event reaching document', async () => {
        await mountDropdown()

        let reachedDocument = false
        const listener = () => { reachedDocument = true }
        document.addEventListener('keydown', listener)

        const input = menu()?.querySelector('.search') as HTMLInputElement
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
        await nextTick()

        document.removeEventListener('keydown', listener)

        expect(reachedDocument).toBe(false)
        expect(menu()).toBeNull()
    })

    it('keeps arrow keys inside the menu open and away from document', async () => {
        await mountDropdown()

        let reachedDocument = false
        const listener = () => { reachedDocument = true }
        document.addEventListener('keydown', listener)

        const input = menu()?.querySelector('.search') as HTMLInputElement
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
        await nextTick()

        document.removeEventListener('keydown', listener)

        expect(reachedDocument).toBe(false)
        expect(menu()).not.toBeNull()
    })

    it('still closes on Escape pressed outside the menu', async () => {
        await mountDropdown()

        document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
        await nextTick()

        expect(menu()).toBeNull()
    })
})

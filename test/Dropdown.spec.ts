import { afterEach, describe, expect, it, vi } from 'vitest'
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

describe('TablerDropdown listeners', () => {
    const types = (...spies: { mock: { calls: unknown[][] } }[]) => {
        return spies.flatMap((spy) => spy.mock.calls.map((call) => call[0]))
            .filter((type) => ['click', 'keydown', 'scroll', 'resize'].includes(String(type)))
            .sort()
    }

    afterEach(() => {
        vi.restoreAllMocks()
        wrapper?.unmount()
        wrapper = undefined
    })

    it('listens on the document only while it is open', async () => {
        const onDocument = vi.spyOn(document, 'addEventListener')
        const onWindow = vi.spyOn(window, 'addEventListener')

        wrapper = mount(Dropdown, {
            slots: { default: '<button class="trigger">Open</button>', dropdown: '<li>Item</li>' },
            attachTo: document.body,
        })

        expect(types(onDocument, onWindow)).toEqual([])

        await wrapper.find('.trigger').trigger('click')
        await nextTick()

        expect(types(onDocument, onWindow)).toEqual(['click', 'keydown', 'resize', 'scroll'])
    })

    it('closes on a click outside and stops listening', async () => {
        await mountDropdown()

        const offDocument = vi.spyOn(document, 'removeEventListener')
        const offWindow = vi.spyOn(window, 'removeEventListener')

        document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }))
        await nextTick()

        expect(menu()).toBeNull()
        expect(types(offDocument, offWindow)).toEqual(['click', 'keydown', 'resize', 'scroll'])
    })

    it('follows its trigger when the page scrolls or resizes', async () => {
        const frames: FrameRequestCallback[] = []
        vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => frames.push(cb))

        await mountDropdown()

        const trigger = wrapper!.find('.tabler-dropdown').element
        const rect = (top: number) => ({ top, bottom: top + 20, left: 100, right: 140, width: 40, height: 20 }) as DOMRect
        let top = 50
        trigger.getBoundingClientRect = () => rect(top)

        window.dispatchEvent(new Event('resize'))
        frames.splice(0).forEach((cb) => cb(0))
        await nextTick()
        expect((menu() as HTMLElement).style.top).toBe('74px')

        top = 200
        document.dispatchEvent(new Event('scroll'))
        frames.splice(0).forEach((cb) => cb(0))
        await nextTick()
        expect((menu() as HTMLElement).style.top).toBe('224px')

        menu()!.dispatchEvent(new Event('scroll'))
        expect(frames).toHaveLength(0)
    })

    it('keeps the menu open on a click inside when autoclose is off', async () => {
        wrapper = mount(Dropdown, {
            props: { autoclose: 'false' },
            slots: { default: '<button class="trigger">Open</button>', dropdown: '<li class="item">Item</li>' },
            attachTo: document.body,
        })

        await wrapper.find('.trigger').trigger('click')
        await nextTick()

        ;(menu()!.querySelector('.item') as HTMLElement).click()
        await nextTick()
        expect(menu()).not.toBeNull()

        await wrapper.find('.trigger').trigger('click')
        expect(menu()).toBeNull()
    })
})

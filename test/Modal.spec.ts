import { afterEach, describe, expect, it } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import Modal from '../components/Modal.vue'

let wrapper: VueWrapper | undefined

const mountModal = (props: Record<string, unknown> = {}) => {
    wrapper = mount(Modal, {
        props: { fade: false, ...props },
        slots: { default: '<div class="modal-body">Body</div>' },
        attachTo: document.body,
    })

    return wrapper
}

const click = (down: Element, up: Element = down) => {
    down.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    up.dispatchEvent(new MouseEvent('click', { bubbles: true }))
}

describe('TablerModal', () => {
    afterEach(() => {
        wrapper?.unmount()
        wrapper = undefined
    })

    it('does not emit close on a backdrop click by default', () => {
        const modal = mountModal()
        click(document.body.querySelector('.modal') as Element)

        expect(modal.emitted('close')).toBeUndefined()
    })

    it('emits close on a backdrop click when dismissable', () => {
        const modal = mountModal({ dismissable: true })
        click(document.body.querySelector('.modal') as Element)

        expect(modal.emitted('close')).toHaveLength(1)
    })

    it('does not emit close for a click inside of the dialog', () => {
        const modal = mountModal({ dismissable: true })
        click(document.body.querySelector('.modal-body') as Element)

        expect(modal.emitted('close')).toBeUndefined()
    })

    it('does not emit close for a drag from the dialog onto the backdrop', () => {
        const modal = mountModal({ dismissable: true })
        click(
            document.body.querySelector('.modal-body') as Element,
            document.body.querySelector('.modal') as Element,
        )

        expect(modal.emitted('close')).toBeUndefined()
    })
})

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
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

    describe('swipeable', () => {
        beforeEach(() => {
            vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance'] })
        })

        afterEach(() => {
            vi.useRealTimers()
        })

        // Drag a handle between two screen positions over a duration, then let any animation finish
        const drag = (handle: Element, from: number, to: number, ms = 1000) => {
            const content = document.body.querySelector('.modal-content') as HTMLElement
            content.setPointerCapture = () => undefined
            Object.defineProperty(content, 'offsetHeight', { configurable: true, value: 800 })

            handle.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, clientY: from }))

            const steps = 10
            for (let i = 1; i <= steps; i++) {
                vi.advanceTimersByTime(ms / steps)
                content.dispatchEvent(new MouseEvent('pointermove', { bubbles: true, clientY: from + (to - from) * i / steps }))
            }

            content.dispatchEvent(new MouseEvent('pointerup', { bubbles: true, clientY: to }))
            vi.advanceTimersByTime(3000)
        }

        const grabber = () => document.body.querySelector('.modal-grabber') as Element
        const last = (modal: VueWrapper) => (modal.emitted('update:height')?.at(-1) as number[])[0]

        const mountSheet = () => {
            const modal = mountModal({
                swipeable: true,
                'onUpdate:height': (height: number) => { void modal.setProps({ height }) },
            })

            return modal
        }

        it('renders no grabber by default', () => {
            mountModal()

            expect(document.body.querySelector('.modal-grabber')).toBeNull()
        })

        it('stays at the height a slow drag is released at', () => {
            const modal = mountSheet()
            drag(grabber(), 100, 300)

            expect(last(modal)).toBeCloseTo(0.75)
            expect(modal.emitted('close')).toBeUndefined()
        })

        it('carries a downward flick on to the minimum height', () => {
            const modal = mountSheet()
            drag(grabber(), 100, 250, 100)

            expect(last(modal)).toBe(0.5)
            expect(modal.emitted('close')).toBeUndefined()
        })

        it('carries an upward flick back to the full height', () => {
            const modal = mountSheet()
            drag(grabber(), 100, 400)
            drag(grabber(), 400, 300, 100)

            expect(last(modal)).toBe(1)
        })

        it('slides away and emits close when released below the minimum height', () => {
            const modal = mountSheet()
            drag(grabber(), 100, 600)

            expect(last(modal)).toBe(0)
            expect(modal.emitted('close')).toHaveLength(1)
        })

        it('fades out below the minimum height', async () => {
            const modal = mountModal({ swipeable: true, height: 0.75 })
            const root = document.body.querySelector('.modal') as HTMLElement

            expect(root.style.opacity).toBe('')

            await modal.setProps({ height: 0.25 })
            expect(root.style.opacity).toBe('0.5')
        })

        it('lets the page behind it through below the full height', async () => {
            const modal = mountModal({ swipeable: true })
            const root = document.body.querySelector('.modal') as HTMLElement

            expect(root.classList.contains('modal-sheet-partial')).toBe(false)

            await modal.setProps({ height: 0.75 })
            expect(root.classList.contains('modal-sheet-partial')).toBe(true)
        })

        it('ignores drags that start outside of a swipe handle', () => {
            const modal = mountSheet()
            drag(document.body.querySelector('.modal-body') as Element, 100, 600)

            expect(modal.emitted('update:height')).toBeUndefined()
            expect(modal.emitted('close')).toBeUndefined()
        })
    })
})

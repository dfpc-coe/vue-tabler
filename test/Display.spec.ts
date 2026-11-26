import { afterEach, describe, expect, it } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import Alert from '../components/Alert.vue'
import InlineAlert from '../components/InlineAlert.vue'
import Border from '../components/Border.vue'
import Bytes from '../components/Bytes.vue'
import Epoch from '../components/Epoch.vue'
import EpochRange from '../components/EpochRange.vue'
import Err from '../components/Err.vue'
import Help from '../components/Help.vue'
import Loading from '../components/Loading.vue'
import None from '../components/None.vue'
import Progress from '../components/Progress.vue'
import RefreshButton from '../components/RefreshButton.vue'
import Slidedown from '../components/Slidedown.vue'

afterEach(() => {
    document.body.innerHTML = ''
})

describe('TablerAlert', () => {
    it('shows the title and the error message', () => {
        const wrapper = mount(Alert, { props: { title: 'Failed', err: new Error('Boom') } })

        expect(wrapper.find('h3').text()).toBe('Failed')
        expect(wrapper.text()).toContain('Boom')
    })

    it('falls back to a generic error', () => {
        const wrapper = mount(Alert)

        expect(wrapper.find('h3').text()).toBe('Generic Error')
        expect(wrapper.text()).toContain('Something is amiss')
    })

    it('reveals the body of the error under Advanced', async () => {
        const err = Object.assign(new Error('Boom'), { body: { status: 400 } })
        const wrapper = mount(Alert, { props: { err } })

        expect(wrapper.find('pre').exists()).toBe(false)

        await wrapper.find('.subheader').trigger('click')
        expect(JSON.parse(wrapper.find('pre').text())).toEqual({ status: 400 })
    })

    it('hides Advanced when it is turned off', () => {
        const wrapper = mount(Alert, { props: { err: new Error('Boom'), advanced: false } })

        expect(wrapper.find('.subheader').exists()).toBe(false)
    })

    it('hands the body to the advanced slot', async () => {
        const err = Object.assign(new Error('Boom'), { body: 'raw body' })
        const wrapper = mount(Alert, {
            props: { err },
            slots: { advanced: `<template #advanced='{ body }'><b class='custom'>{{ body }}</b></template>` },
        })

        await wrapper.find('.subheader').trigger('click')
        expect(wrapper.find('.custom').text()).toBe('raw body')
    })
})

describe('TablerInlineAlert', () => {
    it('applies the severity and shows the title and description', () => {
        const wrapper = mount(InlineAlert, { props: { title: 'Heads up', description: 'Details', severity: 'warning' } })

        expect(wrapper.find('.alert').classes()).toContain('alert-warning')
        expect(wrapper.find('.alert-heading').text()).toBe('Heads up')
        expect(wrapper.find('.alert-description').text()).toBe('Details')
        expect(wrapper.find('.btn-close').exists()).toBe(false)
    })

    it('defaults to info and offers a close button when dismissable', () => {
        const wrapper = mount(InlineAlert, { props: { title: 'Note', dismissable: true } })

        expect(wrapper.find('.alert').classes()).toEqual(expect.arrayContaining(['alert-info', 'alert-dismissible']))
        expect(wrapper.find('.alert-description').exists()).toBe(false)
        expect(wrapper.find('.btn-close').exists()).toBe(true)
    })

    it('replaces the icon through its slot', () => {
        const wrapper = mount(InlineAlert, { props: { title: 'Note' }, slots: { icon: '<i class="mine" />' } })

        expect(wrapper.find('.alert-icon .mine').exists()).toBe(true)
        expect(wrapper.find('.alert-icon svg').exists()).toBe(false)
    })
})

describe('TablerBorder', () => {
    it('renders the label, content and default styling', () => {
        const wrapper = mount(Border, { props: { label: 'Section' }, slots: { default: '<p class="content">Body</p>' } })

        expect(wrapper.find('p.text-uppercase').text()).toBe('Section')
        expect(wrapper.find('.content').exists()).toBe(true)
        expect(wrapper.classes()).toEqual(expect.arrayContaining(['h-100', 'shadow-sm']))
        expect(wrapper.find('.card-body').classes()).toContain('gap-3')
    })

    it('applies the gap, background and layout options', () => {
        const wrapper = mount(Border, { props: { gap: 'lg', background: 'red', shadow: false, fillHeight: false } })

        expect(wrapper.find('.card-body').classes()).toContain('gap-4')
        expect((wrapper.element as HTMLElement).style.backgroundColor).toBe('red')
        expect(wrapper.classes()).not.toContain('h-100')
        expect(wrapper.classes()).not.toContain('shadow-sm')
    })

    it('renders the header and tools slots', () => {
        const wrapper = mount(Border, { slots: { header: '<i class="head" />', tools: '<i class="tool" />' } })

        expect(wrapper.find('.head').exists()).toBe(true)
        expect(wrapper.find('.tabler-border__tools .tool').exists()).toBe(true)
    })
})

describe('TablerBytes', () => {
    const text = (bytes: number) => mount(Bytes, { props: { bytes } }).text()

    it('formats sizes with the nearest unit', () => {
        expect(text(0)).toBe('0 B')
        expect(text(512)).toBe('512 B')
        expect(text(1024)).toBe('1 kB')
        expect(text(1536)).toBe('1.5 kB')
        expect(text(5 * 1024 ** 3)).toBe('5 GB')
    })

    it('always names a unit', () => {
        expect(text(0.5)).toBe('0.5 B')
        expect(text(2 ** 50)).toBe('1 PB')
        expect(text(2 ** 70)).toBe('1048576 PB')
        expect(text(-5)).toBe('0 B')
        expect(text(NaN)).toBe('0 B')
    })
})

describe('TablerEpoch', () => {
    const year = new Date().getFullYear()
    const text = (date: number | string, format?: string) => mount(Epoch, { props: { date, format } }).text()

    it('formats a date of this year without the year', () => {
        expect(text(new Date(year, 0, 1, 9, 5).getTime())).toBe('January 1st, 09:05')
        expect(text(new Date(year, 1, 2, 9, 5).getTime())).toBe('February 2nd, 09:05')
        expect(text(new Date(year, 2, 3, 9, 5).getTime())).toBe('March 3rd, 09:05')
        expect(text(new Date(year, 3, 11, 23, 59).getTime())).toBe('April 11th, 23:59')
        expect(text(new Date(year, 4, 22, 0, 0).getTime())).toBe('May 22nd, 00:00')
    })

    it('adds the year for any other year', () => {
        expect(text(new Date(2001, 11, 31, 12, 0).getTime())).toBe('December 31st 2001, 12:00')
    })

    it('formats ISO in UTC without seconds', () => {
        expect(text('2024-03-05T06:07:08.000Z', 'ISO')).toBe('2024-03-05 06:07')
    })

    it('reads a numeric string as milliseconds', () => {
        expect(text(String(Date.UTC(2024, 2, 5, 6, 7)), 'ISO')).toBe('2024-03-05 06:07')
    })

    it('reports an invalid date instead of throwing', () => {
        expect(text('garbage')).toBe('Invalid Date')
        expect(text('garbage', 'ISO')).toBe('Invalid Date')
    })
})

describe('TablerEpochRange', () => {
    const year = new Date().getFullYear()
    const text = (start: number | string, end: number | string, format?: string) => {
        return mount(EpochRange, { props: { start, end, format } }).text()
    }

    it('collapses a range inside of one day', () => {
        const start = new Date(year, 5, 1, 8, 0).getTime()
        const end = new Date(year, 5, 1, 17, 30).getTime()

        expect(text(start, end)).toBe('June 1st 08:00 - 17:30')
    })

    it('names both days of a longer range', () => {
        const start = new Date(year, 5, 1, 8, 0).getTime()
        const end = new Date(year, 5, 3, 17, 30).getTime()

        expect(text(start, end)).toBe('June 1st 08:00 - June 3rd 17:30')
    })

    it('adds the year outside of this year', () => {
        const start = new Date(2001, 5, 1, 8, 0).getTime()

        expect(text(start, new Date(2001, 5, 1, 9, 0).getTime())).toBe('June 1st, 2001 08:00 - 09:00')
        expect(text(start, new Date(2002, 0, 2, 9, 0).getTime())).toBe('June 1st 2001, 08:00 - January 2nd 2002, 09:00')
    })

    it('formats ISO ranges in UTC', () => {
        expect(text('2024-03-05T06:07:00Z', '2024-03-05T08:09:00Z', 'ISO')).toBe('2024-03-05 06:07 - 08:09')
        expect(text('2024-03-05T06:07:00Z', '2024-03-06T08:09:00Z', 'ISO')).toBe('2024-03-05 06:07 - 2024-03-06 08:09')
    })

    it('reports invalid dates and formats instead of throwing', () => {
        expect(text('garbage', 0)).toBe('Invalid Date')
        expect(text(0, 'garbage', 'ISO')).toBe('Invalid Date')
        expect(text(0, 1, 'Other')).toBe('Invalid Format')
    })
})

describe('TablerError', () => {
    it('shows the error in a modal and emits close from both buttons', async () => {
        const wrapper = mount(Err, { props: { err: new Error('Boom') }, attachTo: document.body })
        const modal = document.body.querySelector('.modal') as HTMLElement

        expect(modal.textContent).toContain('Website Error')
        expect(modal.textContent).toContain('Boom')

        ;(modal.querySelector('.btn-close') as HTMLElement).click()
        ;(modal.querySelector('.modal-footer a') as HTMLElement).click()

        expect(wrapper.emitted('close')).toHaveLength(2)
        wrapper.unmount()
    })
})

describe('TablerHelp', () => {
    it('shows the label and description and emits close', async () => {
        const wrapper = mount(Help, { props: { description: 'How it works' }, attachTo: document.body })
        const modal = document.body.querySelector('.modal') as HTMLElement

        expect(modal.querySelector('.modal-title')?.textContent).toBe('Help')
        expect(modal.querySelector('.modal-body')?.textContent).toContain('How it works')

        ;(modal.querySelector('.modal-footer a') as HTMLElement).click()

        expect(wrapper.emitted('close')).toHaveLength(1)
        wrapper.unmount()
    })
})

describe('TablerLoading', () => {
    it('shows a spinner with the default description', () => {
        const wrapper = mount(Loading)

        expect(wrapper.find('.spinner-border').exists()).toBe(true)
        expect(wrapper.text()).toBe('Loading...')
    })

    it('renders inline with a custom or empty description', () => {
        const wrapper = mount(Loading, { props: { inline: true, desc: 'Saving' } })

        expect(wrapper.classes()).toContain('d-flex')
        expect(wrapper.text()).toBe('Saving')
        expect(mount(Loading, { props: { desc: '' } }).text()).toBe('')
    })
})

describe('TablerNone', () => {
    it('shows the label and a create button', async () => {
        const wrapper = mount(None, { props: { label: 'No Users', create: 'User' } })

        expect(wrapper.text()).toContain('No Users')
        expect(wrapper.find('.btn').text()).toBe('Create User')

        await wrapper.find('.btn').trigger('click')
        expect(wrapper.emitted('create')).toHaveLength(1)
    })

    it('only creates from the button itself', async () => {
        const wrapper = mount(None)

        expect(wrapper.find('.btn').text()).toBe('Create Item')

        await wrapper.find('.btn').element.parentElement!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
        expect(wrapper.emitted('create')).toBeUndefined()
    })

    it('hides the create button when create is false', () => {
        const wrapper = mount(None, { props: { create: false, compact: true } })

        expect(wrapper.find('.btn').exists()).toBe(false)
        expect(wrapper.find('svg').attributes('width')).toBe('32')
    })
})

describe('TablerProgress', () => {
    it('sizes the bar from the fraction', () => {
        expect(mount(Progress, { props: { percent: 0.25 } }).find('.progress-bar').attributes('style')).toContain('width: 25%')
        expect(mount(Progress).find('.progress-bar').attributes('style')).toContain('width: 100%')
    })
})

describe('TablerRefreshButton', () => {
    it('shows the refresh icon and passes clicks through', async () => {
        let clicks = 0
        const wrapper = mount(RefreshButton, { attrs: { onClick: () => clicks++ } })

        expect(wrapper.attributes('title')).toBe('Refresh')
        expect(wrapper.find('svg').exists()).toBe(true)

        await wrapper.trigger('click')
        expect(clicks).toBe(1)
    })

    it('shows a spinner and ignores clicks while loading', async () => {
        let clicks = 0
        const wrapper = mount(RefreshButton, { props: { loading: true, size: 20 }, attrs: { onClick: () => clicks++ } })

        expect(wrapper.find('svg').exists()).toBe(false)
        expect(wrapper.find('.spinner-border').exists()).toBe(true)
        expect(wrapper.find('.spinner-border').element.parentElement!.style.width).toBe('20px')

        await wrapper.trigger('click')
        expect(clicks).toBe(0)
    })
})

describe('TablerSlidedown', () => {
    const slots = { default: '<span class="head">Head</span>', expanded: '<span class="body">Body</span>' }

    it('renders both slots collapsed with an arrow', () => {
        const wrapper = mount(Slidedown, { slots })

        expect(wrapper.find('.head').exists()).toBe(true)
        expect(wrapper.find('.expandable-content-wrapper .body').exists()).toBe(true)
        expect(wrapper.classes()).not.toContain('expanded')
        expect(wrapper.find('.arrow-container').exists()).toBe(true)
    })

    it('toggles from the arrow only by default', async () => {
        const wrapper = mount(Slidedown, { slots })

        await wrapper.find('.head').trigger('click')
        expect(wrapper.classes()).not.toContain('expanded')

        await wrapper.find('.arrow-container').trigger('click')
        expect(wrapper.classes()).toContain('expanded')
        expect(wrapper.find('.arrow').classes()).toContain('expanded')

        await wrapper.find('.arrow-container').trigger('click')
        expect(wrapper.classes()).not.toContain('expanded')
        expect((wrapper.find('.expandable-content-wrapper').element as HTMLElement).style.maxHeight).toBe('')
    })

    it('releases the measured height once the expansion has finished', async () => {
        const wrapper = mount(Slidedown, { slots })
        const content = wrapper.find('.expandable-content-wrapper').element as HTMLElement

        await wrapper.find('.arrow-container').trigger('click')
        expect(content.style.maxHeight).toBe('0px')

        content.dispatchEvent(new Event('transitionend'))
        expect(content.style.maxHeight).toBe('none')
    })

    it('expands and collapses from anywhere but the content when asked to', async () => {
        const wrapper = mount(Slidedown, { slots, props: { clickAnywhereExpand: true, clickAnywhereCollapse: true } })

        expect(wrapper.classes()).toContain('cursor-pointer')

        await wrapper.find('.head').trigger('click')
        expect(wrapper.classes()).toContain('expanded')

        await wrapper.find('.body').trigger('click')
        expect(wrapper.classes()).toContain('expanded')

        await wrapper.find('.head').trigger('click')
        expect(wrapper.classes()).not.toContain('expanded')
    })

    it('hides the arrow until expanded and drops the border when asked to', async () => {
        const wrapper = mount(Slidedown, { slots, props: { arrow: false, border: false, clickAnywhereExpand: true } })

        expect(wrapper.classes()).toContain('no-border')
        expect(wrapper.find('.arrow-container').exists()).toBe(false)

        await wrapper.find('.head').trigger('click')
        await flushPromises()
        expect(wrapper.find('.arrow-container').exists()).toBe(true)
    })
})

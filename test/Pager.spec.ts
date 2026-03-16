import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Pager from '../components/Pager.vue'

describe('TablerPager', () => {
    it('renders no pager controls when there is only one page', () => {
        const wrapper = mount(Pager, {
            props: {
                total: 10,
                page: 0,
                limit: 10,
            },
        })

        expect(wrapper.findAll('button')).toHaveLength(0)
        expect(wrapper.findAll('span')).toHaveLength(0)
    })

    it('shows all pages without ellipses when the page count is small', () => {
        const wrapper = mount(Pager, {
            props: {
                total: 60,
                page: 2,
                limit: 10,
            },
        })

        const buttons = wrapper.findAll('button').map((button) => button.text().replace(/\s+/g, ' ').trim())

        expect(buttons).toEqual(['Home', '2', '3', '4', '5', '6'])
        expect(wrapper.findAll('span')).toHaveLength(0)
        expect(wrapper.find('button.btn-primary').text().trim()).toBe('3')
    })

    it('shows the trailing page window when the last page is selected', () => {
        const wrapper = mount(Pager, {
            props: {
                total: 3320,
                page: 331,
                limit: 10,
            },
        })

        const buttons = wrapper.findAll('button').map((button) => button.text().replace(/\s+/g, ' ').trim())
        const ellipses = wrapper.findAll('span').map((span) => span.text().trim())

        expect(buttons).toEqual(['Home', '329', '330', '331', '332'])
        expect(ellipses).toEqual(['...'])
        expect(wrapper.findAll('button.btn-primary')).toHaveLength(1)
        expect(wrapper.find('button.btn-primary').text().trim()).toBe('332')
    })

    it('shows a centered window with ellipses on both sides for mid-range pages', () => {
        const wrapper = mount(Pager, {
            props: {
                total: 3320,
                page: 166,
                limit: 10,
            },
        })

        const buttons = wrapper.findAll('button').map((button) => button.text().replace(/\s+/g, ' ').trim())
        const ellipses = wrapper.findAll('span').map((span) => span.text().trim())

        expect(buttons).toEqual(['Home', '164', '165', '166', '167', '168', '332'])
        expect(ellipses).toEqual(['...', '...'])
        expect(wrapper.findAll('button.btn-primary')).toHaveLength(1)
        expect(wrapper.find('button.btn-primary').text().trim()).toBe('167')
    })

    it('clamps page values below zero to the first page', () => {
        const wrapper = mount(Pager, {
            props: {
                total: 3320,
                page: -5,
                limit: 10,
            },
        })

        expect(wrapper.find('button.btn-primary').text().trim()).toBe('Home')
    })

    it('clamps page values above the max to the last page', () => {
        const wrapper = mount(Pager, {
            props: {
                total: 3320,
                page: 999,
                limit: 10,
            },
        })

        expect(wrapper.find('button.btn-primary').text().trim()).toBe('332')
        expect(wrapper.findAll('span').map((span) => span.text().trim())).toEqual(['...'])
    })

    it('emits the selected page when a non-active page is clicked', async () => {
        const wrapper = mount(Pager, {
            props: {
                total: 3320,
                page: 331,
                limit: 10,
            },
        })

        await wrapper.get('button:not(.btn-primary)').trigger('click')

        expect(wrapper.emitted('page')).toEqual([[0]])
    })
})

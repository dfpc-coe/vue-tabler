import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Pager from '../components/Pager.vue'

describe('TablerPager', () => {
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

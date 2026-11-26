import { describe, expect, it } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import BreadCrumb from '../components/BreadCrumb.vue'

const page = { template: '<div />' }

async function mountAt(path: string, props: Record<string, unknown> = {}) {
    const router = createRouter({
        history: createMemoryHistory(),
        routes: [
            { path: '/', component: page },
            { path: '/connection', component: page },
            { path: '/connection/:id', component: page },
            { path: '/connection/:id/layer', component: page },
        ],
    })

    router.push(path)
    await router.isReady()

    const wrapper = mount(BreadCrumb, { props, global: { plugins: [router] } })
    return { wrapper, router }
}

describe('TablerBreadCrumb', () => {
    it('renders Home and one capitalized crumb per path segment', async () => {
        const { wrapper } = await mountAt('/connection/12/layer')

        expect(wrapper.findAll('.breadcrumb-item').map((item) => item.text())).toEqual(['Home', 'Connection', '12', 'Layer'])
        expect(wrapper.findAll('.breadcrumb-item.active').map((item) => item.text())).toEqual(['Layer'])
    })

    it('keeps the path as written when normalize is off', async () => {
        const { wrapper } = await mountAt('/connection', { normalize: false })

        expect(wrapper.findAll('.breadcrumb-item').map((item) => item.text())).toEqual(['Home', 'connection'])
    })

    it('navigates to a parent crumb and to Home', async () => {
        const { wrapper, router } = await mountAt('/connection/12/layer')

        await wrapper.findAll('.breadcrumb-item a')[2].trigger('click')
        await flushPromises()
        expect(router.currentRoute.value.path).toBe('/connection/12')

        await wrapper.findAll('.breadcrumb-item a')[0].trigger('click')
        await flushPromises()
        expect(router.currentRoute.value.path).toBe('/')
    })

    it('renders only Home at the root', async () => {
        const { wrapper } = await mountAt('/')

        expect(wrapper.findAll('.breadcrumb-item')).toHaveLength(1)
    })
})

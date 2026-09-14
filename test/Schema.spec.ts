import { describe, expect, it, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import Schema from '../components/Schema.vue'

const TABLE_SCHEMA = {
    type: 'object',
    required: ['Shares'],
    properties: {
        Shares: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    ShareId: { type: 'string' },
                    Password: { type: 'string' },
                },
            },
        },
    },
}

function lastEmitted(wrapper: ReturnType<typeof mount>): Record<string, unknown> {
    const events = wrapper.emitted('update:modelValue') || []
    return events[events.length - 1][0] as Record<string, unknown>
}

afterEach(() => {
    document.body.innerHTML = ''
})

describe('TablerSchema defaults', () => {
    it('seeds missing keys from the schema default and leaves numbers without one unset', async () => {
        const wrapper = mount(Schema, {
            props: {
                modelValue: {},
                schema: {
                    type: 'object',
                    properties: {
                        Name: { type: 'string', default: 'Fred' },
                        Count: { type: 'integer', default: 5 },
                        Ratio: { type: 'number' },
                        Flag: { type: 'boolean', default: true },
                        Tags: { type: 'array', items: { type: 'string' } },
                    },
                },
            },
        })

        await flushPromises()

        const data = lastEmitted(wrapper)
        expect(data).toEqual({ Name: 'Fred', Count: 5, Flag: true, Tags: [] })
        expect('Ratio' in data).toBe(false)
    })

    it('renders integers with a whole number step and numbers with any step', async () => {
        const wrapper = mount(Schema, {
            props: {
                modelValue: {},
                schema: {
                    type: 'object',
                    properties: {
                        Count: { type: 'integer' },
                        Ratio: { type: 'number' },
                    },
                },
            },
        })

        await flushPromises()

        const inputs = wrapper.findAll('input[type="number"]')
        expect(inputs.map((i) => i.attributes('step'))).toEqual(['1', 'any'])
    })
})

describe('TablerSchema object tables', () => {
    it('renders an array of objects as a table with one column per property', async () => {
        const wrapper = mount(Schema, {
            props: {
                modelValue: { Shares: [{ ShareId: 'a', Password: 'x' }, { ShareId: 'b', Password: '' }] },
                schema: TABLE_SCHEMA,
            },
        })

        await flushPromises()

        expect(wrapper.findAll('thead th').map((th) => th.text())).toEqual(['ShareId', 'Password'])
        expect(wrapper.findAll('tbody tr').length).toBe(2)
        expect(wrapper.find('[title="Add Row"]').exists()).toBe(true)
    })

    it('hides the editing controls when disabled', async () => {
        const wrapper = mount(Schema, {
            props: {
                modelValue: { Shares: [] },
                schema: TABLE_SCHEMA,
                disabled: true,
            },
        })

        await flushPromises()

        expect(wrapper.find('[title="Add Row"]').exists()).toBe(false)
        expect(wrapper.find('.btn-primary').exists()).toBe(false)
    })

    it('adds a row through the row editor modal', async () => {
        const wrapper = mount(Schema, {
            attachTo: document.body,
            props: {
                modelValue: { Shares: [] },
                schema: TABLE_SCHEMA,
            },
        })

        await flushPromises()
        await wrapper.find('[title="Add Row"]').trigger('click')
        await flushPromises()

        expect(document.body.querySelector('.modal-title')?.textContent).toBe('Row Editor')

        const input = document.body.querySelector('.modal-body input') as HTMLInputElement
        input.value = 'abc'
        input.dispatchEvent(new Event('input'))
        await flushPromises()

        ;(document.body.querySelector('.modal-body .btn-primary') as HTMLElement).click()
        await flushPromises()

        expect(lastEmitted(wrapper)).toEqual({ Shares: [{ ShareId: 'abc', Password: '' }] })
        expect(document.body.querySelector('.modal-title')).toBeNull()
    })

    it('imports comma or tab separated rows into the table', async () => {
        const wrapper = mount(Schema, {
            attachTo: document.body,
            props: {
                modelValue: { Shares: [{ ShareId: 'z', Password: '' }] },
                schema: TABLE_SCHEMA,
            },
        })

        await flushPromises()
        await wrapper.find('[title="Import CSV"]').trigger('click')
        await flushPromises()

        const textarea = document.body.querySelector('.modal-body textarea') as HTMLTextAreaElement
        textarea.value = 'a,1\nb, 2\n\n'
        textarea.dispatchEvent(new Event('input'))
        await flushPromises()

        ;(document.body.querySelector('.modal-body .btn-primary') as HTMLElement).click()
        await flushPromises()

        expect(lastEmitted(wrapper)).toEqual({
            Shares: [
                { ShareId: 'z', Password: '' },
                { ShareId: 'a', Password: '1' },
                { ShareId: 'b', Password: '2' },
            ],
        })
    })
})

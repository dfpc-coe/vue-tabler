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

const UNION_SCHEMA = {
    type: 'object',
    required: ['Source'],
    properties: {
        Source: {
            anyOf: [
                {
                    title: 'Single Map',
                    type: 'object',
                    required: ['Mode', 'MapId'],
                    properties: {
                        Mode: { const: 'Map', type: 'string' },
                        MapId: { type: 'string' },
                    },
                },
                {
                    title: 'Team Account',
                    type: 'object',
                    required: ['Mode', 'TeamId'],
                    properties: {
                        Mode: { const: 'Team', type: 'string' },
                        TeamId: { type: 'string' },
                        Verbose: { type: 'boolean', default: true },
                    },
                },
            ],
        },
    },
}

describe('TablerSchema nested objects', () => {
    it('renders an object property as a nested form and emits the nested value', async () => {
        const wrapper = mount(Schema, {
            props: {
                modelValue: {},
                schema: {
                    type: 'object',
                    properties: {
                        Auth: {
                            type: 'object',
                            properties: {
                                Username: { type: 'string' },
                                Remember: { type: 'boolean' },
                            },
                        },
                    },
                },
            },
        })

        await flushPromises()

        const input = wrapper.find('input[type="text"]')
        await input.setValue('fred')
        await flushPromises()

        expect(lastEmitted(wrapper)).toEqual({ Auth: { Username: 'fred', Remember: false } })
        expect(wrapper.find('textarea').exists()).toBe(false)
    })
})

describe('TablerSchema unions', () => {
    it('seeds the first variant and hides the const discriminator', async () => {
        const wrapper = mount(Schema, {
            props: { modelValue: {}, schema: UNION_SCHEMA },
        })

        await flushPromises()

        const select = wrapper.find('select')
        expect(select.findAll('option').map((o) => o.text())).toEqual(['Single Map', 'Team Account'])
        expect((select.element as HTMLSelectElement).value).toBe('Single Map')
        expect(wrapper.findAll('input[type="text"]').length).toBe(1)
        expect(lastEmitted(wrapper)).toEqual({ Source: { Mode: 'Map', MapId: '' } })
    })

    it('selects the variant matching a stored discriminator', async () => {
        const wrapper = mount(Schema, {
            props: {
                modelValue: { Source: { Mode: 'Team', TeamId: 'abc', Verbose: false } },
                schema: UNION_SCHEMA,
            },
        })

        await flushPromises()

        expect((wrapper.find('select').element as HTMLSelectElement).value).toBe('Team Account')
        expect((wrapper.find('input[type="text"]').element as HTMLInputElement).value).toBe('abc')
    })

    it('resets the value to the new variant when switched', async () => {
        const wrapper = mount(Schema, {
            props: {
                modelValue: { Source: { Mode: 'Map', MapId: 'xyz' } },
                schema: UNION_SCHEMA,
            },
        })

        await flushPromises()
        await wrapper.find('select').setValue('Team Account')
        await flushPromises()

        expect(lastEmitted(wrapper)).toEqual({ Source: { Mode: 'Team', TeamId: '', Verbose: true } })
        expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true)
    })

    it('does not treat a nullable anyOf as a union', async () => {
        const wrapper = mount(Schema, {
            props: {
                modelValue: {},
                schema: {
                    type: 'object',
                    properties: {
                        Note: { anyOf: [{ type: 'string' }, { type: 'null' }] },
                    },
                },
            },
        })

        await flushPromises()

        expect(wrapper.find('select').exists()).toBe(false)
    })
})

const PRIMITIVE_SCHEMA = {
    type: 'object',
    properties: {
        Name: { type: 'string' },
        Count: { type: 'integer' },
        Ratio: { type: 'number' },
        Flag: { type: 'boolean' },
        Level: { type: 'string', enum: ['low', 'high'] },
        Roles: { type: 'array', uniqueItems: true, items: { type: 'string', enum: ['admin', 'user'] } },
    },
}

describe('TablerSchema editing primitives', () => {
    it('emits typed values for string, integer, number and boolean inputs', async () => {
        const wrapper = mount(Schema, {
            props: { modelValue: {}, schema: PRIMITIVE_SCHEMA },
        })

        await flushPromises()

        await wrapper.find('input[type="text"]').setValue('Fred')
        const numbers = wrapper.findAll('input[type="number"]')
        await numbers[0].setValue('3')
        await numbers[1].setValue('1.5')
        await wrapper.find('.form-switch input').setValue(true)
        await flushPromises()

        const data = lastEmitted(wrapper)
        expect(data.Name).toBe('Fred')
        expect(data.Count).toBe(3)
        expect(data.Ratio).toBe(1.5)
        expect(data.Flag).toBe(true)
    })

    it('emits the selected enum option', async () => {
        const wrapper = mount(Schema, {
            props: { modelValue: {}, schema: PRIMITIVE_SCHEMA },
        })

        await flushPromises()
        await wrapper.find('select').setValue('high')
        await flushPromises()

        expect(lastEmitted(wrapper).Level).toBe('high')
    })

    it('toggles multi enum options in and out of the array', async () => {
        const wrapper = mount(Schema, {
            props: { modelValue: {}, schema: PRIMITIVE_SCHEMA },
        })

        await flushPromises()

        const boxes = wrapper.findAll('.form-check input[type="checkbox"]')
        expect(boxes.length).toBe(2)

        await boxes[0].trigger('change')
        await boxes[1].trigger('change')
        await flushPromises()
        expect(lastEmitted(wrapper).Roles).toEqual(['admin', 'user'])

        await boxes[0].trigger('change')
        await flushPromises()
        expect(lastEmitted(wrapper).Roles).toEqual(['user'])
    })

    it('renders a multi line string as a textarea and keeps newlines', async () => {
        const wrapper = mount(Schema, {
            props: {
                modelValue: { Name: 'one\ntwo' },
                schema: { type: 'object', properties: { Name: { type: 'string' } } },
            },
        })

        await flushPromises()

        const textarea = wrapper.find('textarea')
        expect(textarea.exists()).toBe(true)
        await textarea.setValue('one\ntwo\nthree')
        await flushPromises()

        expect(lastEmitted(wrapper).Name).toBe('one\ntwo\nthree')
    })

    it('disables every primitive input when disabled', async () => {
        const wrapper = mount(Schema, {
            props: { modelValue: {}, schema: PRIMITIVE_SCHEMA, disabled: true },
        })

        await flushPromises()

        const controls = wrapper.findAll('input, select')
        expect(controls.length).toBeGreaterThan(0)
        expect(controls.every((c) => (c.element as HTMLInputElement).disabled)).toBe(true)
    })
})

const DEFAULT_SCHEMA = {
    type: 'object',
    properties: {
        Name: { type: 'string', default: 'Fred' },
        Count: { type: 'integer', default: 5 },
        Level: { type: 'string', enum: ['low', 'high'], default: 'high' },
        Tags: { type: 'array', items: { type: 'string' }, default: ['a'] },
        Kind: { type: 'string', const: 'thing' },
        Auth: {
            type: 'object',
            properties: {
                Remember: { type: 'boolean', default: true },
                Username: { type: 'string' },
            },
        },
    },
}

describe('TablerSchema applying default values', () => {
    it('keeps existing values and only fills missing keys', async () => {
        const wrapper = mount(Schema, {
            props: {
                modelValue: { Name: 'Bob', Tags: [] },
                schema: DEFAULT_SCHEMA,
            },
        })

        await flushPromises()

        const data = lastEmitted(wrapper)
        expect(data.Name).toBe('Bob')
        expect(data.Tags).toEqual([])
        expect(data.Count).toBe(5)
        expect(data.Level).toBe('high')
    })

    it('seeds a root level const and hides it from the form', async () => {
        const wrapper = mount(Schema, {
            props: { modelValue: {}, schema: DEFAULT_SCHEMA },
        })

        await flushPromises()

        expect(lastEmitted(wrapper).Kind).toBe('thing')
        expect(wrapper.findAll('label').map((l) => l.text())).not.toContain('Kind')
    })

    it('seeds nested object defaults through the nested form', async () => {
        const wrapper = mount(Schema, {
            props: { modelValue: {}, schema: DEFAULT_SCHEMA },
        })

        await flushPromises()

        expect(lastEmitted(wrapper).Auth).toEqual({ Remember: true, Username: '' })
    })

    it('clones array defaults so edits do not leak back into the schema', async () => {
        const schema = JSON.parse(JSON.stringify(DEFAULT_SCHEMA))
        const wrapper = mount(Schema, {
            props: { modelValue: {}, schema },
        })

        await flushPromises()

        const tags = lastEmitted(wrapper).Tags as string[]
        expect(tags).toEqual(['a'])
        tags.push('b')
        expect(schema.properties.Tags.default).toEqual(['a'])
    })

    it('applies defaults again when the parent replaces the model value', async () => {
        const wrapper = mount(Schema, {
            props: { modelValue: { Name: 'Bob' }, schema: DEFAULT_SCHEMA },
        })

        await flushPromises()
        await wrapper.setProps({ modelValue: { Name: 'Zed' } })
        await flushPromises()

        const data = lastEmitted(wrapper)
        expect(data.Name).toBe('Zed')
        expect(data.Count).toBe(5)
        expect(data.Kind).toBe('thing')
    })

    it('applies defaults for properties added when the schema changes', async () => {
        const wrapper = mount(Schema, {
            props: {
                modelValue: {},
                schema: { type: 'object', properties: { Name: { type: 'string' } } },
            },
        })

        await flushPromises()
        expect(lastEmitted(wrapper)).toEqual({ Name: '' })

        await wrapper.setProps({
            schema: {
                type: 'object',
                required: ['Name'],
                properties: {
                    Name: { type: 'string' },
                    Count: { type: 'integer', default: 7 },
                },
            },
        })
        await flushPromises()

        expect(lastEmitted(wrapper)).toEqual({ Name: '', Count: 7 })
        expect(wrapper.find('.text-red').exists()).toBe(true)
    })

    it('re-detects the union variant when the parent replaces the model value', async () => {
        const wrapper = mount(Schema, {
            props: {
                modelValue: { Source: { Mode: 'Map', MapId: 'x' } },
                schema: UNION_SCHEMA,
            },
        })

        await flushPromises()
        expect((wrapper.find('select').element as HTMLSelectElement).value).toBe('Single Map')

        await wrapper.setProps({ modelValue: { Source: { Mode: 'Team', TeamId: 't' } } })
        await flushPromises()

        expect((wrapper.find('select').element as HTMLSelectElement).value).toBe('Team Account')
        expect(lastEmitted(wrapper)).toEqual({ Source: { Mode: 'Team', TeamId: 't', Verbose: true } })
    })
})

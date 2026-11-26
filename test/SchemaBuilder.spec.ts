import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SchemaBuilder from '../components/SchemaBuilder.vue'
import SchemaBuilderEdit from '../components/SchemaBuilderEdit.vue'
import MultiEnum from '../components/input/MultiEnum.vue'
import { schemaType, schemaTemplate, enumValues, SCHEMA_TYPES } from '../components/schema-types'

describe('schemaType', () => {
    it('maps JSON Schema types to human readable labels', () => {
        expect(schemaType({ type: 'string' }).label).toBe('Text')
        expect(schemaType({ type: 'string', enum: ['a'] }).label).toBe('Dropdown')
        expect(schemaType({ type: 'array', items: { type: 'string', enum: ['a'] } }).label).toBe('Multiple Choice')
        expect(schemaType({ type: 'boolean' }).label).toBe('Toggle')
        expect(schemaType({ type: 'number' }).label).toBe('Number')
        expect(schemaType({ type: 'integer' }).label).toBe('Whole Number')
    })

    it('falls back to a capitalized raw type for anything unrecognised', () => {
        expect(schemaType({ type: 'array' }).label).toBe('Array')
        expect(schemaType({ type: 'array', items: { type: 'object' } }).label).toBe('Array')
    })
})

describe('schemaTemplate', () => {
    it('builds a Multiple Choice element as an array of enum strings', () => {
        const option = SCHEMA_TYPES.find((o) => o.label === 'Multiple Choice')!

        expect(schemaTemplate(option)).toEqual({
            type: 'array',
            uniqueItems: true,
            items: { type: 'string', enum: [] },
        })
    })

    it('edits the option list in place for both enum shapes', () => {
        const single = { type: 'string', enum: ['a'] }
        const multiple = { type: 'array', items: { type: 'string', enum: ['a'] } }

        enumValues(single)!.push('b')
        enumValues(multiple)!.push('b')

        expect(single.enum).toEqual(['a', 'b'])
        expect(multiple.items.enum).toEqual(['a', 'b'])
        expect(enumValues({ type: 'string' })).toBeUndefined()
    })
})

describe('TablerSchemaBuilder', () => {
    it('offers every field type by its human readable name', () => {
        const wrapper = mount(SchemaBuilder, {
            props: {
                modelValue: { type: 'object', properties: {} },
            },
        })

        const labels = wrapper.findAll('.opt').map((opt) => opt.text().trim())

        expect(labels).toEqual(SCHEMA_TYPES.map((option) => option.label))
        expect(labels).not.toContain('string')
        expect(labels).not.toContain('String')
    })

    it('offers the option list for a Multiple Choice element', () => {
        const wrapper = mount(SchemaBuilderEdit, {
            attachTo: document.body,
            props: {
                prop: {
                    name: 'resources',
                    type: 'array',
                    required: false,
                    items: { type: 'string', enum: ['fire', 'police'] },
                },
            },
        })

        const body = document.body.textContent || ''

        expect(document.body.querySelector('.modal-header')?.textContent?.trim()).toBe('Multiple Choice')
        expect(body).toContain('Options')
        expect(body).toContain('fire')
        expect(body).toContain('police')

        wrapper.unmount()
    })

    it('titles the property editor with the human readable type', () => {
        const wrapper = mount(SchemaBuilderEdit, {
            attachTo: document.body,
            props: {
                prop: { name: 'priority', type: 'string', required: false, enum: ['low', 'high'] },
            },
        })

        const header = document.body.querySelector('.modal-header')

        expect(header?.textContent?.trim()).toBe('Dropdown')

        wrapper.unmount()
    })
})

describe('TablerMultiEnum', () => {
    it('emits the checked options in option order', async () => {
        const wrapper = mount(MultiEnum, {
            props: {
                modelValue: [],
                options: ['fire', 'police', 'medical'],
            },
        })

        const boxes = wrapper.findAll('input[type="checkbox"]')

        await boxes[2].setValue(true)
        await boxes[0].setValue(true)

        const emitted = wrapper.emitted('update:modelValue')!
        expect(emitted[emitted.length - 1][0]).toEqual(['fire', 'medical'])

        await boxes[2].setValue(false)
        expect(wrapper.emitted('update:modelValue')!.at(-1)![0]).toEqual(['fire'])
    })
})

describe('TablerSchemaBuilder model', () => {
    const names = (wrapper: ReturnType<typeof mount>) => {
        return wrapper.findAll('.hover-edit').map((field) => field.text().trim())
    }

    it('lists the fields of the schema it is given without emitting', () => {
        const wrapper = mount(SchemaBuilder, {
            props: {
                modelValue: {
                    type: 'object',
                    required: ['Name'],
                    properties: { Name: { type: 'string' }, Active: { type: 'boolean' } },
                },
            },
        })

        expect(wrapper.findAll('.hover-edit')).toHaveLength(2)
        expect(names(wrapper)[0]).toContain('Name')
        expect(wrapper.find('.hover-edit .text-red').exists()).toBe(true)
        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    it('picks up a schema that arrives after it mounted', async () => {
        const wrapper = mount(SchemaBuilder, {
            props: { modelValue: { type: 'object', properties: {} } },
        })

        expect(wrapper.findAll('.hover-edit')).toHaveLength(0)

        await wrapper.setProps({
            modelValue: { type: 'object', properties: { Loaded: { type: 'string' } } },
        })

        expect(wrapper.findAll('.hover-edit')).toHaveLength(1)
        expect(names(wrapper)[0]).toContain('Loaded')
        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    it('emits the schema without a removed field and keeps the other root keys', async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const wrapper: any = mount(SchemaBuilder, {
            attachTo: document.body,
            props: {
                modelValue: {
                    type: 'object',
                    title: 'Report',
                    required: ['Name'],
                    properties: { Name: { type: 'string' }, Old: { type: 'string' } },
                },
                'onUpdate:modelValue': (value: unknown) => wrapper.setProps({ modelValue: value }),
            },
        })

        await wrapper.findAll('.delete-btn [role="button"]')[1].trigger('click')
        ;(document.body.querySelector('.modal-footer .btn-danger') as HTMLElement).click()
        await wrapper.vm.$nextTick()

        expect(wrapper.emitted('update:modelValue')).toEqual([[{
            type: 'object',
            title: 'Report',
            required: ['Name'],
            additionalProperties: false,
            properties: { Name: { type: 'string' } },
        }]])
        expect(wrapper.findAll('.hover-edit')).toHaveLength(1)

        wrapper.unmount()
    })

    it('scopes its styles to the component', () => {
        const wrapper = mount(SchemaBuilder, {
            props: { modelValue: { type: 'object', properties: {} } },
        })

        expect(wrapper.find('.dropdown-toggle').attributes('id')).toBeTruthy()
        expect(Object.keys((SchemaBuilder as unknown as { __scopeId?: string })).includes('__scopeId')).toBe(true)
    })
})

describe('TablerSchemaBuilderEdit', () => {
    const save = () => document.body.querySelector('.modal-footer .btn-primary') as HTMLButtonElement

    it('refuses a name another field already has', async () => {
        const wrapper = mount(SchemaBuilderEdit, {
            attachTo: document.body,
            props: {
                prop: { name: 'Name', type: 'string', required: false },
                names: ['Name', 'Other'],
            },
        })

        expect(save().disabled).toBe(true)
        expect(document.body.querySelector('.invalid-feedback')?.textContent).toBe('A field with this name already exists')

        const input = document.body.querySelector('.modal-body input') as HTMLInputElement
        input.value = 'Unique'
        input.dispatchEvent(new Event('input'))
        await wrapper.vm.$nextTick()

        expect(save().disabled).toBe(false)

        save().click()
        expect(wrapper.emitted('done')![0][0]).toMatchObject({ name: 'Unique', type: 'string' })

        wrapper.unmount()
    })

    it('adds and removes options and emits close', async () => {
        const wrapper = mount(SchemaBuilderEdit, {
            attachTo: document.body,
            props: { prop: { name: 'Kind', type: 'string', required: false, enum: ['a'] } },
        })

        const inputs = document.body.querySelectorAll('.modal-body input')
        const option = inputs[inputs.length - 1] as HTMLInputElement
        option.value = ' b '
        option.dispatchEvent(new Event('input'))
        await wrapper.vm.$nextTick()

        ;(document.body.querySelector('.modal-body .btn-icon') as HTMLElement).click()
        await wrapper.vm.$nextTick()

        const items = () => Array.from(document.body.querySelectorAll('.list-group-item')).map((i) => i.textContent?.trim())
        expect(items()).toEqual(['a', 'b'])

        document.body.querySelector('.list-group-item svg')!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
        await wrapper.vm.$nextTick()
        expect(items()).toEqual(['b'])

        save().click()
        expect(wrapper.emitted('done')![0][0]).toMatchObject({ enum: ['b'] })

        ;(document.body.querySelector('.btn-close') as HTMLElement).click()
        expect(wrapper.emitted('close')).toHaveLength(1)

        wrapper.unmount()
    })
})

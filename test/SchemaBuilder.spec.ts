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

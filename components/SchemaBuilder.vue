<template>
    <div class='card'>
        <div class='card-header'>
            <h3
                class='card-title'
                v-text='title'
            />

            <div class='ms-auto btn-list'>
                <div class='dropdown'>
                    <div
                        :id='menuId'
                        class='dropdown-toggle'
                        type='button'
                        data-bs-toggle='dropdown'
                        aria-expanded='false'
                    >
                        <IconPlus
                            :size='32'
                            stroke='1'
                            class='cursor-pointer'
                        />
                    </div>
                    <ul
                        class='dropdown-menu'
                        :aria-labelledby='menuId'
                    >
                        <div class='m-1 text-center'>
                            <div
                                v-for='option in SCHEMA_TYPES'
                                :key='option.label'
                                class='opt cursor-pointer py-1 d-flex align-items-center justify-content-center'
                                @click='add(option)'
                            >
                                <component
                                    :is='option.icon'
                                    :size='20'
                                    stroke='1'
                                    class='me-2'
                                />
                                <span v-text='option.label' />
                            </div>
                        </div>
                    </ul>
                </div>
            </div>
        </div>
        <div class='card-body'>
            <TablerNone
                v-if='!schema.length'
                label='No Properties'
                :create='false'
                :compact='true'
            />
            <template v-else>
                <div
                    v-for='(prop, i) in schema'
                    :key='prop._id'
                    class='col-12 hover-edit cursor-pointer relative'
                    @click='editIdx = i; modal = prop'
                >
                    <div class='delete-btn'>
                        <TablerDelete
                            displaytype='icon'
                            :size='24'
                            @delete='remove(i)'
                        />
                    </div>
                    <div class='overlay' />
                    <TablerMultiEnum
                        v-if='isMultiEnum(prop)'
                        :model-value='input[prop.name] || []'
                        :label='prop.name'
                        :disabled='true'
                        :required='prop.required || false'
                        :description='prop.description || ""'
                        :options='enumValues(prop) || []'
                    />
                    <TablerEnum
                        v-else-if='prop.enum'
                        :model-value='input[prop.name]'
                        :label='prop.name'
                        :disabled='true'
                        :required='prop.required || false'
                        :description='prop.description || ""'
                        :options='prop.enum'
                    />
                    <TablerToggle
                        v-else-if='prop.type === "boolean"'
                        :model-value='input[prop.name]'
                        :label='prop.name'
                        :disabled='true'
                        :required='prop.required || false'
                        :description='prop.description || ""'
                    />
                    <TablerInput
                        v-else
                        :model-value='input[prop.name]'
                        :label='prop.name'
                        :disabled='true'
                        :required='prop.required || false'
                        :description='prop.description || ""'
                    />
                </div>
            </template>
        </div>

        <BuilderEdit
            v-if='modal'
            :prop='modal'
            :names='otherNames'
            @close='modal = null'
            @done='save($event)'
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, toRaw, useId } from 'vue';
import {
    IconPlus,
} from '@tabler/icons-vue';
import BuilderEdit from './SchemaBuilderEdit.vue';
import { SCHEMA_TYPES, isMultiEnum, enumValues, schemaTemplate } from './schema-types';
import type { SchemaTypeOption } from './schema-types';
import TablerNone from './None.vue';
import TablerInput from './input/Input.vue';
import TablerEnum from './input/Enum.vue';
import TablerMultiEnum from './input/MultiEnum.vue';
import TablerToggle from './input/Toggle.vue';
import TablerDelete from './Delete.vue';

interface SchemaProperty {
    name: string;
    type: string;
    required: boolean;
    description?: string;
    enum?: string[];
    _id?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

interface JSONSchema {
    type: string;
    required: string[];
    additionalProperties: boolean;
    properties: Record<string, SchemaProperty>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

const props = withDefaults(defineProps<{
    title?: string;
    modelValue: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        properties: Record<string, any>;
        required?: string[];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: any;
    };
}>(), {
    title: 'JSON Schema Builder'
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: JSONSchema): void;
}>();

const modal = ref<SchemaProperty | null>(null);
const editIdx = ref<number | null>(null);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const input = ref<Record<string, any>>({});
const schema = ref<SchemaProperty[]>([]);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const extra = ref<Record<string, any>>({});

const menuId = useId();

const otherNames = computed<string[]>(() => {
    return schema.value.filter((_, i) => i !== editIdx.value).map((prop) => prop.name);
});

const uid = (): string => Math.random().toString(36).substring(7);

function build(list: SchemaProperty[]): JSONSchema {
    const res: JSONSchema = {
        additionalProperties: false,
        ...JSON.parse(JSON.stringify(extra.value)),
        type: 'object',
        required: [],
        properties: {}
    }

    for (const prop of JSON.parse(JSON.stringify(list))) {
        const name = prop.name;
        delete prop.name;
        delete prop._id;

        if (prop.required) res.required.push(name);
        delete prop.required;
        res.properties[name] = prop;
    }

    return res;
}

const computedSchema = computed<JSONSchema>(() => build(schema.value));

let emitted: JSONSchema | undefined;
let loaded: JSONSchema | undefined;

watch(computedSchema, (val) => {
    if (val === loaded) return;

    emitted = val;
    emit('update:modelValue', val);
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function load(value: Record<string, any>) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { type, properties, required, ...rest } = value || {};
    const list: SchemaProperty[] = [];

    for (const prop in (properties || {})) {
        list.push({
            name: prop,
            required: (required || []).includes(prop),
            ...properties[prop],
            _id: uid()
        });
    }

    extra.value = rest;
    schema.value = list;
    loaded = computedSchema.value;
}

watch(() => props.modelValue, (value) => {
    if (emitted && toRaw(value) === emitted) return;

    load(JSON.parse(JSON.stringify(value || {})));
}, { deep: true, immediate: true });

function add(option: SchemaTypeOption) {
    create({
        name: '',
        required: false,
        ...schemaTemplate(option),
    } as SchemaProperty);
}

function create(prop: SchemaProperty) {
    prop._id = uid();
    editIdx.value = null;
    modal.value = prop;
}

function save(prop: SchemaProperty) {
    if (editIdx.value !== null) {
        schema.value[editIdx.value] = prop;
    } else {
        schema.value.push(prop);
    }
    modal.value = null;
    editIdx.value = null;
}

function remove(i: number) {
    schema.value.splice(i, 1);
}
</script>

<style scoped>
.opt:hover {
  font-weight: 900;
}

.hover-edit {
    position: relative;
    border: 1px solid transparent;
    border-radius: 4px;
    transition: all 0.2s;
    padding: 12px;
}

.hover-edit:hover {
    background-color: rgba(0, 0, 0, 0.02);
    border-color: #f0f0f0;
}

.hover-edit .delete-btn {
    opacity: 0;
    transition: opacity 0.2s;
    position: absolute;
    top: 5px;
    right: 5px;
    z-index: 20;
}

.hover-edit:hover .delete-btn {
    opacity: 1;
}

.hover-edit .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    cursor: pointer;
}
</style>

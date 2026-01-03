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
                        id='dropdownMenuButton1'
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
                        aria-labelledby='dropdownMenuButton1'
                    >
                        <div class='m-1 text-center'>
                            <div
                                class='opt cursor-pointer py-1'
                                @click='create({
                                    "name": "",
                                    "type": "string",
                                    "required": false,
                                })'
                            >
                                String
                            </div>
                            <div
                                class='opt cursor-pointer py-1'
                                @click='create({
                                    "name": "",
                                    "type": "string",
                                    "enum": [],
                                    "required": false,
                                })'
                            >
                                Enum
                            </div>
                            <div
                                class='opt cursor-pointer py-1'
                                @click='create({
                                    "name": "",
                                    "type": "boolean",
                                    "required": false,
                                })'
                            >
                                Boolean
                            </div>
                            <div
                                class='opt cursor-pointer py-1'
                                @click='create({
                                    "name": "",
                                    "type": "number",
                                    "required": false,
                                })'
                            >
                                Number
                            </div>
                            <div
                                class='opt cursor-pointer py-1'
                                @click='create({
                                    "name": "",
                                    "type": "integer",
                                    "required": false,
                                })'
                            >
                                Integer
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
                    <TablerEnum
                        v-if='prop.enum'
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
            @close='modal = null'
            @done='save($event)'
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import {
    IconPlus,
} from '@tabler/icons-vue';
import BuilderEdit from './SchemaBuilderEdit.vue';
import TablerNone from './None.vue';
import TablerInput from './input/Input.vue';
import TablerEnum from './input/Enum.vue';
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

const computedSchema = computed<JSONSchema>(() => {
    const res: JSONSchema = {
        type: 'object',
        required: [],
        additionalProperties: false,
        properties: {}
    }

    for (const prop of JSON.parse(JSON.stringify(schema.value))) {
        const name = prop.name;
        delete prop.name;
        delete prop._id;

        if (prop.required) res.required.push(name);
        delete prop.required;
        res.properties[name] = prop;
    }

    return res;
});

watch(computedSchema, (val) => {
    emit('update:modelValue', val);
});

onMounted(() => {
    for (const prop in props.modelValue.properties) {
        schema.value.push({
            name: prop,
            required: (props.modelValue.required || []).includes(prop),
            ...props.modelValue.properties[prop],
            _id: Math.random().toString(36).substring(7)
        });
    }
});

function create(prop: SchemaProperty) {
    prop._id = Math.random().toString(36).substring(7);
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

<style>
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

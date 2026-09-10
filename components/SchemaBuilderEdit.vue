<template>
    <TablerModal>
        <button
            type='button'
            class='btn-close'
            aria-label='Close'
            @click='$emit("close")'
        />
        <div class='modal-status bg-yellow' />
        <div class='modal-header'>
            <div class='d-flex align-items-center my-2'>
                <component
                    :is='schemaType(edit).icon'
                    :size='32'
                    stroke='1'
                />
                <span
                    class='my-1 mx-2 strong'
                    v-text='schemaType(edit).label'
                />
            </div>
        </div>
        <div class='modal-body text-center py-4'>
            <div class='row g-2 d-flex'>
                <TablerInput
                    v-model='edit.name'
                    label='Field Name'
                    :required='true'
                />
                <TablerToggle
                    v-model='edit.required'
                    label='Required'
                />
                <TablerInput
                    v-model='edit.description'
                    :rows='3'
                    label='Description'
                />

                <template v-if='options'>
                    <div class='subheader mt-2'>
                        Options
                    </div>
                    <div class='col-12 d-flex'>
                        <TablerInput
                            v-model='newEnum'
                            class='flex-grow-1'
                            placeholder='New Value'
                            @keyup.enter='addEnum'
                        />
                        <button
                            class='btn btn-icon ms-2'
                            @click='addEnum'
                        >
                            <IconPlus
                                :size='20'
                                stroke='1'
                            />
                        </button>
                    </div>
                    <div class='list-group list-group-flush mt-2'>
                        <div
                            v-for='(val, i) in options'
                            :key='i'
                            class='list-group-item d-flex justify-content-between align-items-center py-1'
                        >
                            <span v-text='val' />
                            <IconTrash
                                :size='16'
                                stroke='1'
                                class='cursor-pointer text-danger'
                                @click='options.splice(i, 1)'
                            />
                        </div>
                    </div>
                </template>
            </div>
        </div>
        <div class='modal-footer'>
            <button
                class='btn btn-primary'
                :disabled='!edit.name.length'
                @click='$emit("done", edit)'
            >
                Save
            </button>
        </div>
    </TablerModal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
    IconPlus,
    IconTrash
} from '@tabler/icons-vue';
import { schemaType, enumValues } from './schema-types';
import TablerModal from './Modal.vue';
import TablerInput from './input/Input.vue';
import TablerToggle from './input/Toggle.vue';

interface SchemaProperty {
    name: string;
    type: string;
    required: boolean;
    description?: string;
    enum?: string[];
    items?: { type: string; enum?: string[] };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

const props = defineProps<{
    prop: SchemaProperty
}>();

defineEmits<{
    (e: 'close'): void;
    (e: 'done', value: SchemaProperty): void;
}>();

const edit = ref<SchemaProperty>(JSON.parse(JSON.stringify(props.prop)));
const newEnum = ref('');

/** Live option list of a Dropdown or Multiple Choice element */
const options = computed<string[] | undefined>(() => enumValues(edit.value));

function addEnum() {
    const value = newEnum.value.trim();
    if (!value || !options.value || options.value.includes(value)) return;
    options.value.push(value);
    newEnum.value = '';
}
</script>

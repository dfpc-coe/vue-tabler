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
                <template v-if='edit.type === "string"'>
                    <IconAlphabetLatin
                        :size='32'
                        stroke='1'
                    />
                </template>
                <template v-else-if='edit.type === "number"'>
                    <DecimalIcon
                        :size='32'
                        stroke='1'
                    />
                </template>
                <template v-else-if='edit.type === "integer"'>
                    <Sort09Icon
                        :size='32'
                        stroke='1'
                    />
                </template>
                <template v-else>
                    <BinaryIcon
                        :size='32'
                        stroke='1'
                    />
                </template>
                <span
                    class='my-1 mx-2 strong'
                    v-text='edit.type'
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

                <template v-if='edit.type === "string" && edit.enum === undefined' />
                <template v-else-if='edit.type === "string" && Array.isArray(edit.enum)'>
                    <div class='subheader mt-2'>
                        Enum Values
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
                            v-for='(val, i) in edit.enum'
                            :key='i'
                            class='list-group-item d-flex justify-content-between align-items-center py-1'
                        >
                            <span v-text='val' />
                            <IconTrash
                                :size='16'
                                stroke='1'
                                class='cursor-pointer text-danger'
                                @click='edit.enum?.splice(i, 1)'
                            />
                        </div>
                    </div>
                </template>
                <template v-else-if='edit.type === "number"' />
                <template v-else-if='edit.type === "integer"' />
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
import { ref } from 'vue';
import {
    IconAlphabetLatin,
    IconPlus,
    IconTrash
} from '@tabler/icons-vue';
import TablerModal from './Modal.vue';
import TablerInput from './input/Input.vue';
import TablerToggle from './input/Toggle.vue';

interface SchemaProperty {
    name: string;
    type: string;
    required: boolean;
    description?: string;
    enum?: string[];
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

function addEnum() {
    if (!newEnum.value.trim()) return;
    if (!edit.value.enum) edit.value.enum = [];
    edit.value.enum.push(newEnum.value.trim());
    newEnum.value = '';
}
</script>

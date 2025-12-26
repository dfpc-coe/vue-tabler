<template>
    <div class='row'>
        <TablerLabel
            v-if='label'
            :label='label'
            :description='description'
            :required='required'
        >
            <slot />
        </TablerLabel>
        <div class='col-12'>
            <input
                ref='textInput'
                :disabled='disabled'
                :autofocus='autofocus'
                :accept='accept'
                type='file'
                :class='{
                    "is-invalid": errorstr
                }'
                class='form-control'
                :placeholder='placeholder||label||""'
                @change='$emit("change", $event)'
                @blur='$emit("blur")'
            >
            <span
                v-if='loading'
                class='input-icon-addon'
            >
                <div
                    class='spinner-border spinner-border-sm text-secondary'
                    role='status'
                />
            </span>
            <div
                v-if='errorstr'
                class='invalid-feedback'
                v-text='errorstr'
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import TablerLabel from '../internal/Label.vue'

export interface FileInputProps {
    modelValue: string | number;
    autofocus?: boolean;
    loading?: boolean;
    required?: boolean;
    disabled?: boolean;
    accept?: string;
    description?: string;
    label?: string;
    placeholder?: string;
    error?: string;
}

const props = withDefaults(defineProps<FileInputProps>(), {
    autofocus: false,
    loading: false,
    required: false,
    disabled: false,
    accept: '',
    description: '',
    label: '',
    placeholder: '',
    error: ''
});

defineEmits<{
    (e: 'blur'): void;
    (e: 'change', event: Event): void;
}>();

const textInput = ref<HTMLInputElement | null>(null)
const internal_error = ref('')

const errorstr = computed(() => {
    if (props.error) return props.error
    return internal_error.value
})

onMounted(() => {
    if (props.autofocus && textInput.value) {
        textInput.value.focus()
    }
})
</script>

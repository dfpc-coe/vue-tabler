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
            <label
                v-for='option in options'
                :key='option'
                class='form-check'
            >
                <input
                    class='form-check-input'
                    type='checkbox'
                    :value='option'
                    :checked='current.includes(option)'
                    :disabled='disabled'
                    @change='toggle(option)'
                    @blur='$emit("blur")'
                >
                <span
                    class='form-check-label'
                    v-text='option'
                />
            </label>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import TablerLabel from '../internal/Label.vue'

export interface MultiEnumProps {
    modelValue: string[];
    required?: boolean;
    description?: string;
    options: string[];
    disabled?: boolean;
    label?: string;
}

const props = withDefaults(defineProps<MultiEnumProps>(), {
    required: false,
    description: '',
    disabled: false,
    label: ''
});

const emit = defineEmits<{
    (e: 'blur'): void;
    (e: 'update:modelValue', value: string[]): void;
}>();

const current = ref<string[]>([...(props.modelValue || [])])

watch(() => props.modelValue, (newValue) => {
    current.value = [...(newValue || [])]
})

function toggle(option: string) {
    if (current.value.includes(option)) {
        current.value = current.value.filter((value) => value !== option)
    } else {
        // Preserve option order so the value is stable regardless of click order
        current.value = props.options.filter((value) => {
            return value === option || current.value.includes(value)
        })
    }

    emit('update:modelValue', current.value)
}
</script>

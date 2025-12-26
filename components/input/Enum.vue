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
            <select
                v-model='current'
                :autofocus='autofocus'
                :disabled='disabled'
                class='form-select'
                @blur='$emit("blur")'
            >
                <option
                    v-for='option in options'
                    :key='option'
                    :value='option'
                    v-text='option'
                />
            </select>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import TablerLabel from '../internal/Label.vue'

export interface EnumProps {
    modelValue: string;
    autofocus?: boolean;
    default?: string;
    required?: boolean;
    description?: string;
    options: string[];
    disabled?: boolean;
    label?: string;
}

const props = withDefaults(defineProps<EnumProps>(), {
    autofocus: false,
    default: '',
    required: false,
    description: '',
    disabled: false,
    label: ''
});

const emit = defineEmits<{
    (e: 'blur'): void;
    (e: 'update:modelValue', value: string): void;
}>();

// Initialize current value
const current = ref<string>('')
if (!props.modelValue && props.default) {
    current.value = props.default
} else {
    current.value = props.modelValue
}

watch(() => props.modelValue, (newValue) => {
    current.value = newValue
})

watch(current, (newValue) => {
    if (newValue === props.modelValue) return
    emit('update:modelValue', newValue)
})
</script>

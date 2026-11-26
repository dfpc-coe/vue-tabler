<template>
    <div class='row'>
        <TablerLabel
            :label='label'
            :description='description'
            :required='required'
        >
            <slot />
        </TablerLabel>
        <div class='col-12'>
            <input
                :disabled='disabled'
                :autofocus='autofocus'
                :value='modelValue'
                type='range'
                class='form-range'
                :min='min'
                :max='max'
                :step='step'
                @input='update'
                @keyup.enter='$emit("submit")'
                @blur='$emit("blur")'
            >
        </div>
    </div>
</template>

<script setup lang="ts">
import TablerLabel from '../internal/Label.vue'

export interface RangeProps {
    modelValue: number;
    autofocus?: boolean;
    min?: number;
    max?: number;
    step?: number;
    required?: boolean;
    disabled?: boolean;
    description?: string;
    label?: string;
}

const props = withDefaults(defineProps<RangeProps>(), {
    autofocus: false,
    min: 0,
    max: 10,
    step: 1,
    required: false,
    disabled: false,
    description: '',
    label: ''
});

const emit = defineEmits<{
    (e: 'blur'): void;
    (e: 'submit'): void;
    (e: 'update:modelValue', value: number): void;
}>();

const update = (event: Event) => {
    const value = Number((event.target as HTMLInputElement).value)
    if (value !== props.modelValue) emit('update:modelValue', value)
}
</script>

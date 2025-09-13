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
                @input='event => current = event.target.value'
                @keyup.enter='$emit("submit")'
                @blur='$emit("blur")'
            >
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import TablerLabel from '../internal/Label.vue'

const props = defineProps({
    modelValue: {
        type: Number,
        required: true
    },
    autofocus: {
        type: Boolean,
        default: false
    },
    min: {
        type: Number,
        default: 0
    },
    max: {
        type: Number,
        default: 10
    },
    step: {
        type: Number,
        default: 1
    },
    required: {
        type: Boolean,
        default: false,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    description: {
        type: String,
        default: '',
    },
    label: {
        type: String,
        default: ''
    },
})

const emit = defineEmits([
    'blur',
    'submit',
    'update:modelValue'
])

const current = ref(props.modelValue)

watch(current, (newValue) => {
    if (newValue === props.modelValue) return
    emit('update:modelValue', Number(newValue))
})
</script>

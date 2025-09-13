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

<script setup>
import { ref, watch } from 'vue'
import TablerLabel from '../internal/Label.vue'

const props = defineProps({
    modelValue: {
        type: String,
        required: true
    },
    autofocus: {
        type: Boolean,
        default: false
    },
    default: {
        type: String,
        default: ''
    },
    required: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        default: ''
    },
    options: {
        type: Array,
        required: true
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    label: {
        type: String,
        default: ''
    },
})

const emit = defineEmits([
    'blur',
    'update:modelValue'
])

// Initialize current value
const current = ref('')
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

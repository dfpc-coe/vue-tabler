<template>
    <div class='row'>
        <TablerLabel
            :label='label'
            :description='description'
            :required='required'
        >
            <slot />
        </TablerLabel>
        <div class='col-12 d-flex'>
            <div
                v-for='color in Object.keys(colours)'
                :key='color'
                class='border border-white rounded mx-1'
                style='height: 26px;'
            >
                <label class='form-colorinput'>
                    <input
                        v-model='current'
                        :disabled='disabled'
                        :autofocus='autofocus'
                        :value='color'
                        type='radio'
                        class='form-colorinput-input'
                        @blur='$emit("blur")'
                    >
                    <span
                        class='form-colorinput-color bg-dark rounded'
                        :class='[
                            `bg-${color}`
                        ]'
                    />
                </label>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
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
    'blur', 'update:modelValue'
])

const current = ref('')

const invertColours = {
    '#1d273b': 'dark',
    '#ffffff': 'white',
    '#206bc4': 'blue',
    '#4299e1': 'azure',
    '#4263eb': 'indigo',
    '#ae3ec9': 'purple',
    '#d6336c': 'pink',
    '#d63939': 'red',
    '#f76707': 'orange',
    '#f59f00': 'yellow',
    '#74b816': 'lime'
}

const colours = {
    dark: '#1d273b',
    white: '#ffffff',
    blue: '#206bc4',
    azure: '#4299e1',
    indigo: '#4263eb',
    purple: '#ae3ec9',
    pink: '#d6336c',
    red: '#d63939',
    orange: '#f76707',
    yellow: '#f59f00',
    lime: '#74b816'
}

watch(() => props.modelValue, (newValue) => {
    current.value = invertColours[newValue]
})

watch(current, (newValue) => {
    if (colours[newValue] === props.modelValue) return
    emit('update:modelValue', colours[newValue])
})

onMounted(() => {
    if (!props.modelValue && props.default) {
        current.value = invertColours[props.default]
    } else {
        current.value = invertColours[props.modelValue]
    }
})
</script>

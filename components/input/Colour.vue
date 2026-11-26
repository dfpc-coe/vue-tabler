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

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import TablerLabel from '../internal/Label.vue'

export interface ColourProps {
    modelValue: string;
    autofocus?: boolean;
    default?: string;
    required?: boolean;
    description?: string;
    disabled?: boolean;
    label?: string;
}

const props = withDefaults(defineProps<ColourProps>(), {
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

const current = ref<string>('')

const colours: Record<string, string> = {
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

const invertColours: Record<string, string> = Object.fromEntries(
    Object.entries(colours).map(([name, hex]) => [hex, name])
)

const nameOf = (hex?: string): string => {
    return invertColours[String(hex || '').toLowerCase()] || ''
}

watch(() => props.modelValue, (newValue) => {
    current.value = nameOf(newValue)
})

watch(current, (newValue) => {
    if (!colours[newValue] || colours[newValue] === String(props.modelValue || '').toLowerCase()) return
    emit('update:modelValue', colours[newValue])
})

onMounted(() => {
    if (!props.modelValue && props.default) {
        current.value = nameOf(props.default)
    } else {
        current.value = nameOf(props.modelValue)
    }
})
</script>

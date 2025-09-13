<template>
    <div>
        <TablerLabel
            :label='label'
            :required='required'
            :description='description'
        >
            <label class='form-switch'>
                <input
                    v-model='current'
                    :disabled='disabled'
                    :autofocus='autofocus'
                    class='form-check-input'
                    type='checkbox'
                    @keyup.enter='$emit("submit")'
                    @blur='$emit("blur")'
                >
            </label>
        </TablerLabel>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import TablerLabel from '../internal/Label.vue'

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true
    },
    autofocus: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    },
    required: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        default: ''
    },
    label: {
        type: String,
        default: ''
    }
})

const emit = defineEmits([
    'blur',
    'submit',
    'update:modelValue'
])

const current = ref(props.modelValue)

watch(() => props.modelValue, (newValue) => {
    current.value = newValue
})

watch(current, (newValue) => {
    if (newValue === props.modelValue) return
    emit('update:modelValue', newValue)
})

onMounted(() => {
    current.value = props.modelValue
})
</script>

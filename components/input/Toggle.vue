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

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import TablerLabel from '../internal/Label.vue'

export interface ToggleProps {
    modelValue: boolean;
    autofocus?: boolean;
    disabled?: boolean;
    required?: boolean;
    description?: string;
    label?: string;
}

const props = withDefaults(defineProps<ToggleProps>(), {
    autofocus: false,
    disabled: false,
    required: false,
    description: '',
    label: ''
});

const emit = defineEmits<{
    (e: 'blur'): void;
    (e: 'submit'): void;
    (e: 'update:modelValue', value: boolean): void;
}>();

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

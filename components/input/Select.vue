<template>
    <div class='dropdown'>
        <a
            class='dropdown-toggle text-muted'
            href='#'
            data-bs-toggle='dropdown'
            aria-haspopup='true'
            aria-expanded='false'
            v-text='current'
        />
        <div class='dropdown-menu dropdown-menu-end'>
            <a
                v-for='option in options'
                :key='option'
                class='dropdown-item'
                :class='{
                    active: option === current
                }'
                @click='current = option'
                v-text='option'
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

export interface SelectProps {
    modelValue: string;
    default?: string;
    options: string[];
}

const props = withDefaults(defineProps<SelectProps>(), {
    default: ''
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
}>();

const current = ref('')

watch(current, (newValue) => {
    if (props.modelValue !== newValue) {
        emit('update:modelValue', newValue)
    }
})

onMounted(() => {
    if (!props.modelValue && props.default) {
        current.value = props.default
    } else {
        current.value = props.modelValue
    }
})
</script>

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

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
    modelValue: {
        type: String,
        required: true,
    },
    default: {
        type: String,
        default: ''
    },
    options: {
        type: Array,
        required: true
    },
})

const emit = defineEmits([
    'update:modelValue'
])

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

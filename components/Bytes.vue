<template>
    <span v-text='display' />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    bytes: {
        type: Number,
        required: true
    }
})

const display = computed(() => {
    const i = props.bytes == 0 ? 0 : Math.floor(Math.log(props.bytes) / Math.log(1024))
    return (props.bytes / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i]
})
</script>

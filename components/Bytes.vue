<template>
    <span v-text='display' />
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface BytesProps {
    bytes: number;
}

const props = defineProps<BytesProps>();

const display = computed(() => {
    const i = props.bytes == 0 ? 0 : Math.floor(Math.log(props.bytes) / Math.log(1024))
    // @ts-expect-error: Type checking for array indexing
    return (props.bytes / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i]
})
</script>

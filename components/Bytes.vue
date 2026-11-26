<template>
    <span v-text='display' />
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface BytesProps {
    bytes: number;
}

const props = defineProps<BytesProps>();

const UNITS = ['B', 'kB', 'MB', 'GB', 'TB', 'PB'];

const display = computed(() => {
    const bytes = Number.isFinite(props.bytes) && props.bytes > 0 ? props.bytes : 0
    const i = bytes < 1 ? 0 : Math.min(UNITS.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)))
    return Number((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + UNITS[i]
})
</script>

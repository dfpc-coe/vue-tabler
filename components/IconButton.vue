<template>
    <div
        v-tooltip='title'
        tabindex='0'
        role='button'
        class='cursor-pointer rounded'
    >
        <slot />
    </div>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
    title: {
        type: String,
        required: true
    },
})
</script>

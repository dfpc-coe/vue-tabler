<template>
    <div
        :ref='iconid'
        v-tooltip='title'
        tabindex='0'
        role='button'
        class='cursor-pointer rounded'
        @keyup.enter='icon.click()'
    >
        <slot />
    </div>
</template>

<script setup>
import { useId, useTemplateRef } from 'vue'

const iconid = useId();

const icon = useTemplateRef(iconid);

defineProps({
    title: {
        type: String,
        required: true
    },
})
</script>

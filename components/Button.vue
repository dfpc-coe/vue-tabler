<template>
    <button
        tabindex='0'
        :disabled='props.disabled'
        class='btn'
    >
        <slot />
    </button>
</template>

<script setup>
const props = defineProps<{
    disabled: Boolean
}>()
</script>

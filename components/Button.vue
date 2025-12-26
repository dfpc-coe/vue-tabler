<template>
    <button
        tabindex='0'
        :disabled='props.disabled'
        class='btn'
    >
        <slot />
    </button>
</template>

<script setup lang="ts">
export interface ButtonProps {
    disabled?: boolean;
}

const props = defineProps<ButtonProps>();
</script>

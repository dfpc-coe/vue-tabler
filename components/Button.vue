<template>
    <button
        tabindex='0'
        :disabled='props.disabled'
        :style='buttonStyle'
        class='btn'
    >
        <slot />
    </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

export interface ButtonProps {
    color?: string;
    disabled?: boolean;
}

const props = defineProps<ButtonProps>();

const buttonStyle = computed(() => {
    return {
        backgroundColor: props.color
    };
});
</script>

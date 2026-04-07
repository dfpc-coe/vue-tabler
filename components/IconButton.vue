<template>
    <div
        :ref='iconid'
        v-tooltip='props.title'
        tabindex='0'
        role='button'
        :class='{
            "cursor-pointer": props.disabled === false,
            "cursor-default disabled": props.disabled === true,
            "custom-hover": props.hover && !props.color,
        }'
        :style='iconButtonStyle'
        class='rounded'
        @keyup.enter='icon?.click()'
    >
        <slot />
    </div>
</template>

<script setup lang="ts">
import { computed, useId, useTemplateRef } from 'vue'

const iconid = useId();

const icon = useTemplateRef<HTMLElement>(iconid);

export interface IconButtonProps {
    color?: string;
    title: string;
    hover?: boolean;
    disabled?: boolean;
}

const props = withDefaults(defineProps<IconButtonProps>(), {
    hover: true,
    disabled: false
});

const iconButtonStyle = computed(() => {
    return {
        backgroundColor: props.color
    };
});
</script>

<style scoped>
.disabled {
    color: var(--tblr-gray-500);
}

.custom-hover:not(.disabled) {
    border: 1px solid transparent;
    transition: background-color 0.15s ease, border-color 0.15s ease;
}

[data-bs-theme='light'] .custom-hover:not(.disabled):hover,
[data-bs-theme='light'] .custom-hover:not(.disabled):focus-visible,
[data-bs-theme='light'] .custom-hover:not(.disabled):focus-within {
    border-radius: 6px;
    border-color: color-mix(in srgb, var(--tblr-body-color) 18%, transparent);
    background: color-mix(in srgb, var(--tblr-body-color) 8%, transparent);
}

[data-bs-theme='dark'] .custom-hover:not(.disabled):hover,
[data-bs-theme='dark'] .custom-hover:not(.disabled):focus-visible,
[data-bs-theme='dark'] .custom-hover:not(.disabled):focus-within {
    border-radius: 6px;
    border-color: color-mix(in srgb, var(--tblr-light) 30%, transparent);
    background: color-mix(in srgb, var(--tblr-light) 12%, transparent);
}
</style>

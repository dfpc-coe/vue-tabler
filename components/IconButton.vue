<template>
    <div
        :ref='iconid'
        :title='props.title'
        :aria-label='props.title'
        :tabindex='props.disabled ? -1 : 0'
        role='button'
        :aria-disabled='props.disabled || undefined'
        :aria-pressed='props.active'
        :class='{
            "cursor-pointer": props.disabled === false,
            "cursor-default disabled": props.disabled === true,
            "custom-hover": props.hover && !props.color && !props.active,
            "icon-button-bordered": props.bordered,
            "icon-button-active": props.active === true,
        }'
        :style='iconButtonStyle'
        class='rounded'
        @click.capture='guard'
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
    bordered?: boolean;
    active?: boolean;
}

const props = withDefaults(defineProps<IconButtonProps>(), {
    hover: true,
    disabled: false,
    bordered: false,
    active: undefined
});

const guard = (event: MouseEvent) => {
    if (!props.disabled) return;
    event.stopImmediatePropagation();
    event.preventDefault();
}

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

.icon-button-bordered {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    border: var(--tblr-border-width) solid var(--tblr-border-color);
    border-radius: var(--tblr-border-radius);
    background: var(--tblr-bg-surface);
}

.icon-button-bordered.custom-hover:not(.disabled) {
    border-color: var(--tblr-border-color);
}

.icon-button-active {
    border: var(--tblr-border-width) solid var(--tblr-primary);
    border-radius: var(--tblr-border-radius);
    background: var(--tblr-primary);
    color: var(--tblr-primary-fg, #ffffff);
    transition: filter 0.15s ease;
}

.icon-button-active:not(.disabled):hover,
.icon-button-active:not(.disabled):focus-visible {
    filter: brightness(1.1);
}
</style>

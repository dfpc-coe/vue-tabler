<template>
    <div
        class='card tabler-border border border-light-subtle'
        :class='{
            "h-100": fillHeight,
            "shadow-sm": shadow,
        }'
        :style='backgroundStyle'
    >
        <div
            class='card-body d-flex flex-column position-relative'
            :class='{
                "gap-4": gap === "lg",
                "gap-3": gap === "md",
                "gap-2": gap === "sm",
            }'
        >
            <div
                v-if='label || $slots.label || $slots.header'
                class='d-flex align-items-center justify-content-between'
            >
                <slot name='label'>
                    <p
                        v-if='label'
                        class='text-uppercase small mb-0'
                        v-text='label'
                    />
                </slot>
                <slot name='header' />
            </div>

            <div
                v-if='$slots.tools'
                class='tabler-border__tools position-absolute'
            >
                <slot name='tools' />
            </div>

            <slot />
        </div>
    </div>
</template>

<script setup lang='ts'>
import { computed } from 'vue';

export interface BorderProps {
    label?: string;
    gap?: 'sm' | 'md' | 'lg';
    background?: string;
    shadow?: boolean;
    fillHeight?: boolean;
}

const props = withDefaults(defineProps<BorderProps>(), {
    label: '',
    gap: 'md',
    background: '',
    shadow: true,
    fillHeight: true,
});

const backgroundStyle = computed(() => {
    if (!props.background) return undefined;
    return { backgroundColor: props.background };
});
</script>

<style scoped>
.tabler-border__tools {
    top: 8px;
    right: 8px;
    z-index: 2;
    opacity: 0;
    transition: opacity 0.15s ease-in-out;
}

.tabler-border:hover > .card-body > .tabler-border__tools,
.tabler-border:focus-within > .card-body > .tabler-border__tools {
    opacity: 1;
}
</style>

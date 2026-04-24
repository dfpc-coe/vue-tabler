<template>
    <div class='card h-100 border border-light-subtle shadow-sm'>
        <div
            class='card-body d-flex flex-column'
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
            <slot />
        </div>
    </div>
</template>

<script setup lang='ts'>
export interface BorderProps {
    label?: string;
    gap?: 'sm' | 'md' | 'lg';
}

withDefaults(defineProps<BorderProps>(), {
    label: '',
    gap: 'md',
});
</script>

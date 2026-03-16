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

.custom-hover:not(.disabled):hover {
    background-color: var(--tblr-border-color);
}
</style>

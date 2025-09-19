<template>
    <div
        :ref='iconid'
        v-tooltip='props.title'
        tabindex='0'
        role='button'
        :class='{
            "cursor-pointer": props.disabled === false,
            "cursor-default disabled": props.disabled === true,
            "custom-hover": props.hover,
        }'
        class='rounded'
        @keyup.enter='icon.click()'
    >
        <slot />
    </div>
</template>

<script setup>
import { useId, useTemplateRef } from 'vue'

const iconid = useId();

const icon = useTemplateRef(iconid);

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    hover: {
        type: Boolean,
        default: true
    },
    disabled: {
        type: Boolean,
        default: false
    }
})
</script>

<style scoped>
.disabled {
    color: var(--tblr-gray-500);
}

.custom-hover:not(.disabled):hover {
    background-color: var(--tblr-border-color);
}
</style>

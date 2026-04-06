<template>
    <div :class='dropdownClasses'>
        <div
            :id='id'
            data-bs-toggle='dropdown'
            :data-bs-auto-close='props.autoclose'
            aria-expanded='false'
            @click.stop.prevent=''
        >
            <slot>
                <IconSettings
                    :size='32'
                    :stoke='1'
                    class='cursor-pointer'
                />
            </slot>
        </div>
        <ul
            :class='menuClasses'
            :style='{
                width
            }'
            :aria-labelledby='id'
        >
            <slot name='dropdown'>
                Dropdown Content
            </slot>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
    IconSettings
} from '@tabler/icons-vue';

export interface DropdownProps {
    width?: number | string;
    autoclose?: string;
    position?: 'bottom' | 'bottom-start' | 'bottom-end' | 'top' | 'top-start' | 'top-end' | 'left' | 'right';
}

const props = withDefaults(defineProps<DropdownProps>(), {
    width: 200,
    autoclose: 'true',
    position: 'bottom-end'
});

const id = ref('tabler-dropdown-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now().toString(36));

const dropdownClasses = computed(() => {
    const baseClass = 'dropdown tabler-dropdown';

    switch (props.position) {
        case 'top':
        case 'top-start':
        case 'top-end':
            return `${baseClass} dropup`;
        case 'left':
            return `${baseClass} dropstart`;
        case 'right':
            return `${baseClass} dropend`;
        default: // bottom, bottom-start, bottom-end
            return baseClass;
    }
});

const menuClasses = computed(() => {
    const baseClasses = 'dropdown-menu dropdown-menu-card tabler-dropdown__menu';

    switch (props.position) {
        case 'bottom-start':
        case 'top-start':
            return `${baseClasses} dropdown-menu-start`;
        case 'bottom-end':
        case 'top-end':
            return `${baseClasses} dropdown-menu-end dropdown-menu-arrow`;
        default: // bottom, top, left, right
            return baseClasses;
    }
});
</script>

<style scoped>
.tabler-dropdown__menu {
    --tblr-body-color: rgba(255, 255, 255, 0.92);
    --tblr-body-bg: rgba(20, 20, 25, 0.96);
    --tblr-border-color: rgba(255, 255, 255, 0.15);
    --tblr-dropdown-bg: rgba(20, 20, 25, 0.96);
    --tblr-dropdown-border-color: rgba(255, 255, 255, 0.25);
    --tblr-dropdown-link-hover-bg: rgba(255, 255, 255, 0.1);
    --tblr-dropdown-link-active-bg: rgba(var(--tblr-primary-rgb), 0.25);
    --tblr-dropdown-link-active-color: var(--tblr-primary);
    margin-block: 0.25rem;
    padding: 0.25rem 0;
    overflow: hidden;
    border-color: var(--tblr-dropdown-border-color);
    background: var(--tblr-dropdown-bg);
    backdrop-filter: blur(8px);
}

.tabler-dropdown__menu.dropdown-menu-arrow::before,
.tabler-dropdown__menu.dropdown-menu-arrow::after {
    display: none;
}

.tabler-dropdown__menu :deep(.dropdown-item),
.tabler-dropdown__menu :deep(.tabler-dropdown__item) {
    cursor: pointer;
    color: inherit;
    transition: background 0.1s ease;
}

.tabler-dropdown__menu :deep(.dropdown-item:hover),
.tabler-dropdown__menu :deep(.tabler-dropdown__item:hover) {
    background: rgba(255, 255, 255, 0.1);
}

.tabler-dropdown__menu :deep(.dropdown-item.active),
.tabler-dropdown__menu :deep(.dropdown-item:active),
.tabler-dropdown__menu :deep(.tabler-dropdown__item--active) {
    background: rgba(var(--tblr-primary-rgb), 0.25);
    color: var(--tblr-primary);
}

.tabler-dropdown__menu :deep(.dropdown-item.active .text-white-50),
.tabler-dropdown__menu :deep(.tabler-dropdown__item--active .text-white-50) {
    color: rgba(var(--tblr-primary-rgb), 0.7) !important;
}
</style>

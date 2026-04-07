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
    --tabler-dropdown-color: rgba(255, 255, 255, 0.92);
    --tabler-dropdown-bg: rgba(20, 20, 25, 0.96);
    --tabler-dropdown-border-color: rgba(255, 255, 255, 0.25);
    --tabler-dropdown-hover-bg: rgba(255, 255, 255, 0.1);
    --tabler-dropdown-active-bg: rgba(var(--tblr-primary-rgb), 0.25);
    --tabler-dropdown-active-color: var(--tblr-primary);
    --tabler-dropdown-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.35);
    margin-block: 0.25rem;
    padding: 0.25rem 0;
    overflow: hidden;
    color: var(--tabler-dropdown-color);
    border-color: var(--tabler-dropdown-border-color);
    background: var(--tabler-dropdown-bg);
    backdrop-filter: blur(8px);
    box-shadow: var(--tabler-dropdown-shadow);
}

[data-bs-theme='light'] .tabler-dropdown__menu {
    --tabler-dropdown-color: var(--tblr-body-color);
    --tabler-dropdown-bg: rgba(255, 255, 255, 0.96);
    --tabler-dropdown-border-color: rgba(var(--tblr-primary-rgb), 0.15);
    --tabler-dropdown-hover-bg: rgba(var(--tblr-primary-rgb), 0.08);
    --tabler-dropdown-active-bg: rgba(var(--tblr-primary-rgb), 0.16);
    --tabler-dropdown-shadow: 0 0.5rem 1rem rgba(15, 23, 42, 0.08);
}

[data-bs-theme='light'] .tabler-dropdown__menu :deep(.dropdown-item),
[data-bs-theme='light'] .tabler-dropdown__menu :deep(.tabler-dropdown__item),
[data-bs-theme='light'] .tabler-dropdown__menu :deep(.text-white) {
    color: var(--tblr-body-color) !important;
}

[data-bs-theme='light'] .tabler-dropdown__menu :deep(.text-white-50) {
    color: var(--tblr-secondary-color) !important;
}

.tabler-dropdown__menu.dropdown-menu-arrow::before,
.tabler-dropdown__menu.dropdown-menu-arrow::after {
    display: none;
}

.tabler-dropdown__menu :deep(.dropdown-item),
.tabler-dropdown__menu :deep(.tabler-dropdown__item) {
    cursor: pointer;
    color: inherit;
    transition: background 0.1s ease, color 0.1s ease;
}

.tabler-dropdown__menu :deep(.dropdown-item:hover),
.tabler-dropdown__menu :deep(.tabler-dropdown__item:hover) {
    background: var(--tabler-dropdown-hover-bg);
}

.tabler-dropdown__menu :deep(.dropdown-item.active),
.tabler-dropdown__menu :deep(.dropdown-item:active),
.tabler-dropdown__menu :deep(.tabler-dropdown__item--active) {
    background: var(--tabler-dropdown-active-bg);
    color: var(--tabler-dropdown-active-color);
}

.tabler-dropdown__menu :deep(.dropdown-item.active .text-white),
.tabler-dropdown__menu :deep(.dropdown-item:active .text-white),
.tabler-dropdown__menu :deep(.tabler-dropdown__item--active .text-white) {
    color: var(--tabler-dropdown-active-color) !important;
}

.tabler-dropdown__menu :deep(.dropdown-item.active .text-white-50),
.tabler-dropdown__menu :deep(.dropdown-item:active .text-white-50),
.tabler-dropdown__menu :deep(.tabler-dropdown__item--active .text-white-50) {
    color: rgba(var(--tblr-primary-rgb), 0.7) !important;
}
</style>

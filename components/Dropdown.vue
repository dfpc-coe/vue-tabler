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
                "width": width
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
    const baseClass = 'dropdown';
    
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
    const baseClasses = 'dropdown-menu dropdown-menu-card';
    
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

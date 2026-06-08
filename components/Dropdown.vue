<template>
    <div ref='triggerRef' class='tabler-dropdown d-inline-flex'>
        <div
            :id='id'
            :aria-expanded='String(isOpen)'
            aria-haspopup='true'
            @click.stop='toggle'
        >
            <slot>
                <IconSettings
                    :size='32'
                    :stroke='1'
                    class='cursor-pointer'
                />
            </slot>
        </div>
        <Teleport to='body'>
            <ul
                v-if='isOpen'
                ref='menuRef'
                :class='menuClasses'
                :style='floatingStyle'
                :aria-labelledby='id'
                @click='onMenuClick'
            >
                <slot name='dropdown'>
                    Dropdown Content
                </slot>
            </ul>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue';
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
    position: 'bottom-end',
});

const id = ref('tabler-dropdown-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now().toString(36));
const isOpen = ref(false);
const triggerRef = ref<HTMLElement | null>(null);
const menuRef = ref<HTMLElement | null>(null);
const floatingStyle = ref<Record<string, string>>({});

const menuWidth = computed(() =>
    typeof props.width === 'number' ? `${props.width}px` : String(props.width)
);

const menuClasses = computed(() => {
    const base = 'dropdown-menu dropdown-menu-card tabler-dropdown__menu show';
    switch (props.position) {
        case 'bottom-start':
        case 'top-start':
            return `${base} dropdown-menu-start`;
        case 'bottom-end':
        case 'top-end':
            return `${base} dropdown-menu-end`;
        default:
            return base;
    }
});

function calcPosition() {
    if (!triggerRef.value || !menuRef.value) return;

    const t = triggerRef.value.getBoundingClientRect();
    const m = menuRef.value.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const gap = 4;

    let top = 0;
    let left = 0;

    switch (props.position) {
        case 'bottom':
            top = t.bottom + gap;
            left = t.left + t.width / 2 - m.width / 2;
            break;
        case 'bottom-start':
            top = t.bottom + gap;
            left = t.left;
            break;
        case 'top':
            top = t.top - m.height - gap;
            left = t.left + t.width / 2 - m.width / 2;
            break;
        case 'top-start':
            top = t.top - m.height - gap;
            left = t.left;
            break;
        case 'top-end':
            top = t.top - m.height - gap;
            left = t.right - m.width;
            break;
        case 'left':
            top = t.top;
            left = t.left - m.width - gap;
            break;
        case 'right':
            top = t.top;
            left = t.right + gap;
            break;
        default: // bottom-end
            top = t.bottom + gap;
            left = t.right - m.width;
    }

    // Keep within viewport
    left = Math.max(gap, Math.min(left, vw - m.width - gap));
    top  = Math.max(gap, Math.min(top,  vh - gap));

    // Constrain height to available space below the computed top
    const maxHeight = Math.max(100, vh - top - gap);

    floatingStyle.value = {
        position:   'fixed',
        zIndex:     '9999',
        top:        `${top}px`,
        left:       `${left}px`,
        minWidth:   menuWidth.value,
        maxHeight:  `${maxHeight}px`,
        overflowY:  'auto',
        margin:     '0',
        visibility: 'visible',
    };
}

async function toggle() {
    if (isOpen.value) {
        isOpen.value = false;
        return;
    }
    // Render hidden first so we can measure before positioning
    floatingStyle.value = { position: 'fixed', zIndex: '9999', visibility: 'hidden', minWidth: menuWidth.value };
    isOpen.value = true;
    await nextTick();
    calcPosition();
}

function onMenuClick() {
    if (props.autoclose === 'true' || props.autoclose === true) {
        isOpen.value = false;
    }
}

function onOutsideClick(e: MouseEvent) {
    if (!isOpen.value) return;
    const target = e.target as Node;
    if (triggerRef.value?.contains(target) || menuRef.value?.contains(target)) return;
    isOpen.value = false;
}

function onEscape(e: KeyboardEvent) {
    if (e.key === 'Escape') isOpen.value = false;
}

onMounted(() => {
    document.addEventListener('click', onOutsideClick, true);
    document.addEventListener('keydown', onEscape);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', onOutsideClick, true);
    document.removeEventListener('keydown', onEscape);
    isOpen.value = false;
});
</script>

<style>
.dropdown-menu.tabler-dropdown__menu {
    --tabler-dropdown-color: rgba(255, 255, 255, 0.92);
    --tabler-dropdown-bg: rgba(20, 20, 25, 0.96);
    --tabler-dropdown-border-color: rgba(255, 255, 255, 0.25);
    --tabler-dropdown-hover-bg: rgba(255, 255, 255, 0.1);
    --tabler-dropdown-active-bg: rgba(var(--tblr-primary-rgb), 0.25);
    --tabler-dropdown-active-color: var(--tblr-primary);
    --tabler-dropdown-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.35);
    margin-block: 0.25rem;
    padding: 0.25rem 0;
    color: var(--tabler-dropdown-color);
    border-color: var(--tabler-dropdown-border-color);
    background: var(--tabler-dropdown-bg);
    backdrop-filter: blur(8px);
    box-shadow: var(--tabler-dropdown-shadow);
}

[data-bs-theme='light'] .dropdown-menu.tabler-dropdown__menu {
    --tabler-dropdown-color: var(--tblr-body-color);
    --tabler-dropdown-bg: rgba(255, 255, 255, 0.96);
    --tabler-dropdown-border-color: rgba(var(--tblr-primary-rgb), 0.15);
    --tabler-dropdown-hover-bg: rgba(var(--tblr-primary-rgb), 0.08);
    --tabler-dropdown-active-bg: rgba(var(--tblr-primary-rgb), 0.16);
    --tabler-dropdown-shadow: 0 0.5rem 1rem rgba(15, 23, 42, 0.08);
}

[data-bs-theme='light'] .tabler-dropdown__menu .dropdown-item,
[data-bs-theme='light'] .tabler-dropdown__menu .tabler-dropdown__item,
[data-bs-theme='light'] .tabler-dropdown__menu .text-white {
    color: var(--tblr-body-color) !important;
}

[data-bs-theme='light'] .tabler-dropdown__menu .text-white-50 {
    color: var(--tblr-secondary-color) !important;
}

.tabler-dropdown__menu .dropdown-item,
.tabler-dropdown__menu .tabler-dropdown__item {
    cursor: pointer;
    color: inherit;
    transition: background 0.1s ease, color 0.1s ease;
}

.tabler-dropdown__menu .dropdown-item:hover,
.tabler-dropdown__menu .tabler-dropdown__item:hover {
    background: var(--tabler-dropdown-hover-bg);
}

.tabler-dropdown__menu .dropdown-item.active,
.tabler-dropdown__menu .dropdown-item:active,
.tabler-dropdown__menu .tabler-dropdown__item--active {
    background: var(--tabler-dropdown-active-bg);
    color: var(--tabler-dropdown-active-color);
}

.tabler-dropdown__menu .dropdown-item.active .text-white,
.tabler-dropdown__menu .dropdown-item:active .text-white,
.tabler-dropdown__menu .tabler-dropdown__item--active .text-white {
    color: var(--tabler-dropdown-active-color) !important;
}

.tabler-dropdown__menu .dropdown-item.active .text-white-50,
.tabler-dropdown__menu .dropdown-item:active .text-white-50,
.tabler-dropdown__menu .tabler-dropdown__item--active .text-white-50 {
    color: rgba(var(--tblr-primary-rgb), 0.7) !important;
}
</style>

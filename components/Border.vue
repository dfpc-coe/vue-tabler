<template>
    <div
        class='card border border-light-subtle'
        :class='{
            "h-100": fillHeight,
            "shadow-sm": shadow,
            "tabler-border--clickable": clickable,
        }'
        :style='backgroundStyle'
        :role='clickable ? "button" : undefined'
        :tabindex='clickable ? 0 : undefined'
        @click='handleClick'
        @keyup.enter='handleClick'
        @keyup.space.prevent='handleClick'
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
                v-if='showActions'
                class='tabler-border__actions position-absolute'
            >
                <slot name='actions'>
                    <TablerIconButton
                        v-if='editable && !editing'
                        :title='resolvedEditAriaLabel'
                        @click.stop.prevent='emit("edit")'
                    >
                        <IconPencil
                            :size='24'
                            stroke='1'
                        />
                    </TablerIconButton>
                </slot>
            </div>

            <slot
                v-if='editing'
                name='editor'
            />
            <slot v-else />
        </div>
    </div>
</template>

<script setup lang='ts'>
import { computed, useSlots } from 'vue';
import TablerIconButton from './IconButton.vue';
import { IconPencil } from '@tabler/icons-vue';

export interface BorderProps {
    label?: string;
    gap?: 'sm' | 'md' | 'lg';
    background?: string;
    shadow?: boolean;
    fillHeight?: boolean;
    editable?: boolean;
    editing?: boolean;
    editAriaLabel?: string;
}

const props = withDefaults(defineProps<BorderProps>(), {
    label: '',
    gap: 'md',
    background: '',
    shadow: true,
    fillHeight: true,
    editable: false,
    editing: false,
    editAriaLabel: '',
});

const emit = defineEmits<{
    edit: [];
}>();

const slots = useSlots();

const backgroundStyle = computed(() => {
    if (!props.background) return undefined;
    return { backgroundColor: props.background };
});

const clickable = computed(() => props.editable && !props.editing);

const showActions = computed(() => {
    if (slots.actions) return true;
    return props.editable && !props.editing;
});

const resolvedEditAriaLabel = computed(() => {
    if (props.editAriaLabel) return props.editAriaLabel;
    if (props.label) return `Edit ${props.label.toLowerCase()}`;
    return 'Edit';
});

function handleClick(): void {
    if (!clickable.value) return;
    emit('edit');
}
</script>

<style scoped>
.tabler-border--clickable {
    cursor: pointer;
}

.tabler-border--clickable:focus-visible {
    outline: 2px solid rgba(var(--tblr-primary-rgb, 32, 107, 196), 0.7);
    outline-offset: 2px;
}

.tabler-border__actions {
    top: 8px;
    right: 8px;
    opacity: 1;
    transition: opacity 0.15s ease-in-out;
}

.tabler-border--clickable .tabler-border__actions {
    opacity: 0;
}

.tabler-border--clickable:hover .tabler-border__actions,
.tabler-border--clickable:focus-visible .tabler-border__actions,
.tabler-border__actions:focus-within {
    opacity: 1;
}
</style>

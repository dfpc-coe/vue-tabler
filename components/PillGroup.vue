<template>
    <div
        :class='groupClasses'
        role='group'
    >
        <template
            v-for='(option, i) in options'
            :key='option.value'
        >
            <input
                :id='inputId(option, i)'
                type='radio'
                class='btn-check'
                :name='name'
                autocomplete='off'
                :checked='modelValue === option.value'
                :disabled='disabled || option.disabled'
                @click='emit("update:modelValue", option.value)'
            >
            <label
                :for='inputId(option, i)'
                type='button'
                :class='buttonClasses'
            >
                <slot
                    name='option'
                    :option='option'
                    :index='i'
                    :active='modelValue === option.value'
                >
                    {{ option.label }}
                </slot>
            </label>
        </template>
    </div>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue';

const uid = useId();

export interface PillGroupOption {
    value: string;
    label: string;
    disabled?: boolean;
}

export interface PillGroupProps {
    modelValue: string;
    options: PillGroupOption[];
    name?: string;
    rounded?: boolean;
    fullWidth?: boolean;
    size?: 'sm' | 'default';
    disabled?: boolean;
    padding?: string;
}

const props = withDefaults(defineProps<PillGroupProps>(), {
    name: 'pill-group',
    rounded: true,
    fullWidth: true,
    size: 'sm',
    disabled: false,
    padding: 'px-2 py-2',
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
}>();

function inputId(option: PillGroupOption, index: number): string {
    return `${props.name}-${uid}-${option.value}-${index}`;
}

const groupClasses = computed(() => {
    const classes: string[] = ['btn-group'];
    if (props.rounded) classes.push('round');
    if (props.fullWidth) classes.push('w-100');
    if (props.padding) classes.push(props.padding);
    if (props.size === 'sm' && !props.rounded) classes.push('btn-group-sm');
    return classes;
});

const buttonClasses = computed(() => {
    const classes: string[] = ['btn'];
    if (props.size === 'sm') classes.push('btn-sm');
    return classes;
});
</script>

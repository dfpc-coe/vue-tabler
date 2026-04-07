<template>
    <div class='row'>
        <TablerLabel
            v-if='label'
            :label='label'
            :description='description'
            :required='required'
        >
            <slot />
        </TablerLabel>
        <div class='col-12'>
            <template v-if='!rows || rows <= 1'>
                <div
                    class='input-group input-group-flat'
                    :class='{
                        "tabler-input-group-invalid": errorstr && hasEndAdornment
                    }'
                >
                    <span
                        v-if='icon || $slots.icon'
                        class='input-group-text'
                    >
                        <IconSearch
                            v-if='icon === "search"'
                            :size='20'
                            stroke='1'
                        />
                        <IconLock
                            v-else-if='icon === "lock"'
                            :size='20'
                            stroke='1'
                        />
                        <IconUser
                            v-else-if='icon === "user"'
                            :size='20'
                            stroke='1'
                        />
                        <slot
                            v-else-if='$slots.icon'
                            name='icon'
                        />
                    </span>
                    <input
                        ref='textInput'
                        v-model='current'
                        :disabled='disabled'
                        :autocomplete='autocomplete'
                        :autofocus='autofocus'
                        :type='computed_type'
                        :class='{
                            "is-invalid": errorstr,
                            "tabler-input-with-end": hasEndAdornment
                        }'
                        class='form-control'
                        :placeholder='placeholder||label||""'
                        @keyup.enter='$emit("submit")'
                        @focus='$emit("focus")'
                        @blur='$emit("blur")'
                    >
                    <span
                        v-if='loading'
                        class='input-group-text'
                    >
                        <div
                            class='spinner-border spinner-border-sm text-secondary'
                            role='status'
                        />
                    </span>
                    <span
                        v-else-if='type === &apos;password&apos;'
                        class='input-group-text'
                        @click='passwordVisible = !passwordVisible'
                    >
                        <a
                            v-if='!passwordVisible'
                            href='#'
                            class='link-secondary'
                            data-bs-toggle='tooltip'
                            aria-label='Show Password'
                            data-bs-original-title='Show Password'
                        >
                            <IconEye
                                :size='20'
                                stroke='1'
                            />
                        </a>
                        <a
                            v-else
                            href='#'
                            class='link-secondary'
                            data-bs-toggle='tooltip'
                            aria-label='Hide Password'
                            data-bs-original-title='Hide Password'
                        >
                            <IconEyeOff
                                :size='20'
                                stroke='1'
                            />
                        </a>
                    </span>
                    <span
                        v-else-if='icon === "search" && current.length'
                        class='input-group-text'
                        @click='current = ""'
                    >
                        <a
                            href='#'
                            class='link-secondary'
                            data-bs-toggle='tooltip'
                            aria-label='Clear'
                            data-bs-original-title='Clear'
                        >
                            <IconCircleXFilled
                                :size='20'
                                stroke='1'
                            />
                        </a>
                    </span>
                    <span
                        v-if='hasEndAdornment'
                        :class='errorstr ? "tabler-input-error-end" : "tabler-input-end"'
                        class='input-group-text'
                    >
                        <IconAlertCircle
                            v-if='errorstr'
                            :size='20'
                            stroke='1.5'
                        />
                        <slot
                            v-else
                            name='end'
                        />
                    </span>
                </div>
                <div
                    v-if='errorstr'
                    class='invalid-feedback d-block'
                    v-text='errorstr'
                />
            </template>
            <template v-else>
                <div class='position-relative'>
                    <textarea
                        ref='textInput'
                        v-model='current'
                        :disabled='disabled'
                        :autofocus='autofocus'
                        :autocomplete='autocomplete'
                        :wrap='wrap'
                        :rows='rows'
                        :type='computed_type'
                        :class='{
                            "is-invalid": errorstr,
                            "tabler-input-with-end": hasEndAdornment
                        }'
                        class='form-control'
                        :placeholder='placeholder||label||""'
                        @keyup.enter='$emit("submit")'
                        @focus='$emit("focus")'
                        @blur='$emit("blur")'
                    />

                    <div
                        v-if='hasEndAdornment'
                        :class='errorstr ? "tabler-input-error-end" : "tabler-input-end"'
                        class='tabler-input-textarea-end'
                    >
                        <IconAlertCircle
                            v-if='errorstr'
                            :size='20'
                            stroke='1.5'
                        />
                        <slot
                            v-else
                            name='end'
                        />
                    </div>
                </div>
                <div
                    v-if='errorstr'
                    class='invalid-feedback d-block'
                    v-text='errorstr'
                />
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, useSlots } from 'vue'
import TablerLabel from '../internal/Label.vue'
import {
    IconAlertCircle,
    IconEye,
    IconEyeOff,
    IconCircleXFilled,
    IconSearch,
    IconLock,
    IconUser
} from '@tabler/icons-vue';

export interface InputProps {
    modelValue?: string | number;
    autofocus?: boolean;
    loading?: boolean;
    required?: boolean;
    disabled?: boolean;
    autocomplete?: string;
    description?: string;
    icon?: string;
    rows?: number;
    wrap?: string;
    type?: string;
    label?: string;
    placeholder?: string;
    error?: string;
}

const props = withDefaults(defineProps<InputProps>(), {
    autofocus: false,
    loading: false,
    required: false,
    disabled: false,
    autocomplete: 'off',
    description: '',
    icon: '',
    rows: 1,
    wrap: 'soft',
    type: 'text',
    label: '',
    placeholder: '',
    error: ''
});

const slots = useSlots();

const emit = defineEmits<{
    (e: 'blur'): void;
    (e: 'focus'): void;
    (e: 'submit'): void;
    (e: 'update:modelValue', value: string | number): void;
}>();

const textInput = ref<HTMLInputElement | HTMLTextAreaElement | null>(null)
const internal_error = ref('')
const current = ref<string>(props.modelValue === undefined ? '' : String(props.modelValue))

const passwordVisible = ref(false);

const errorstr = computed(() => {
    if (props.error) return props.error
    return internal_error.value
})

const hasEndAdornment = computed(() => {
    return Boolean(errorstr.value || !!slots.end)
})

const computed_type = computed(() => {
    if (props.type === 'password' && passwordVisible.value) return 'text';
    if (props.type === 'integer') return 'number'
    return props.type
})

watch(() => props.modelValue, (newValue) => {
    const n = newValue === undefined ? '' : String(newValue);
    if (current.value !== n) {
        current.value = n;
    }
})

watch(current, (newValue) => {
    if (typeof props.modelValue === 'number' || props.type === 'number') {
        const currentNum = Number(newValue)

        if (isNaN(currentNum)) {
            internal_error.value = 'Must be a number!'
        } else if (currentNum === props.modelValue) {
            internal_error.value = ''
            return
        } else {
            internal_error.value = ''
            emit('update:modelValue', currentNum)
        }
    } else if (props.type === 'integer') {
        const currentInt = parseInt(newValue)

        if (isNaN(currentInt)) {
            internal_error.value = 'Must be an integer!'
        } else if (currentInt === Number(props.modelValue)) {
            internal_error.value = ''
            return
        } else {
            internal_error.value = ''
            emit('update:modelValue', currentInt)
        }
    } else {
        internal_error.value = ''
        if (newValue === props.modelValue) return
        emit('update:modelValue', newValue)
    }
})

onMounted(() => {
    if (props.autofocus) {
        setTimeout(() => {
            if (textInput.value) textInput.value.focus()
        }, 50)
    }
})
</script>

<style scoped>
input:autofill {
    transition:
        background-color calc(infinity * 1s) step-end,
        background-image calc(infinity * 1s) step-end allow-discrete,
        color calc(infinity * 1s) step-end;
}

.input-group :deep(.form-control),
.position-relative > .form-control,
.input-group :deep(.input-group-text) {
    border-color: var(--tblr-border-color);
}

.input-group :deep(.form-control),
.position-relative > .form-control {
    color: var(--tblr-body-color);
    background-color: var(--tabler-input-bg, var(--tblr-bg-forms, var(--tblr-bg-surface, var(--tblr-body-bg))));
}

.input-group :deep(.form-control)::placeholder,
.position-relative > .form-control::placeholder {
    color: var(--tblr-secondary-color);
    opacity: 1;
}

.input-group :deep(.input-group-text) {
    color: var(--tblr-body-color);
    background-color: var(--tabler-input-bg, var(--tblr-bg-forms, var(--tblr-bg-surface, var(--tblr-body-bg))));
}

.tabler-input-with-end {
    padding-right: 3rem;
}

.tabler-input-with-end.is-invalid {
    background-image: none;
    padding-right: 3rem;
}

.tabler-input-group-invalid > .form-control.is-invalid {
    border-right: 0;
}

.tabler-input-group-invalid:focus-within {
    border-radius: var(--tblr-border-radius);
    box-shadow: var(--tblr-shadow-input), 0 0 0 0.25rem rgba(var(--tblr-danger-rgb), 0.25);
}

.tabler-input-group-invalid:focus-within > .form-control.is-invalid {
    border-color: var(--tblr-form-invalid-border-color, var(--tblr-danger));
    box-shadow: none;
}

.tabler-input-group-invalid > .form-control.is-invalid:focus {
    border-color: var(--tblr-form-invalid-border-color, var(--tblr-danger)) !important;
    box-shadow: none !important;
    outline: 0;
}

.tabler-input-group-invalid > .input-group-text:last-child {
    border-color: var(--tblr-form-invalid-border-color, var(--tblr-danger)) !important;
    border-left: 0;
}

.tabler-input-group-invalid:focus-within > .input-group-text:last-child {
    border-color: var(--tblr-form-invalid-border-color, var(--tblr-danger)) !important;
}

.tabler-input-end {
    color: var(--tblr-body-color);
    opacity: 1;
}

.tabler-input-error-end {
    color: var(--tblr-form-invalid-border-color, var(--tblr-danger)) !important;
    opacity: 1;
}

.tabler-input-end :deep(a),
.tabler-input-end :deep(svg),
.tabler-input-error-end :deep(a),
.tabler-input-error-end :deep(svg) {
    color: inherit;
    opacity: 1;
}

.tabler-input-textarea-end {
    position: absolute;
    right: 0.5rem;
    top: 0.5rem;
    z-index: 2;
    display: flex;
    align-items: center;
}
</style>

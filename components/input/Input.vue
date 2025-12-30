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
                <div class='input-group input-group-flat'>
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
                            "is-invalid": errorstr
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
                            aria-label='Show Password'
                            data-bs-original-title='Show Password'
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
                            v-if='!passwordVisible'
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
                    <div
                        v-if='errorstr'
                        class='invalid-feedback'
                        v-text='errorstr'
                    />
                </div>
            </template>
            <template v-else>
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
                        "is-invalid": errorstr
                    }'
                    class='form-control'
                    :placeholder='placeholder||label||""'
                    @keyup.enter='$emit("submit")'
                    @focus='$emit("focus")'
                    @blur='$emit("blur")'
                />
                <div
                    v-if='errorstr'
                    class='invalid-feedback'
                    v-text='errorstr'
                />
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import TablerLabel from '../internal/Label.vue'
import {
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

const computed_type = computed(() => {
    if (props.type === 'password' && passwordVisible.value) return 'text';
    if (props.type === 'integer') return 'number'
    return props.type
})

watch(() => props.modelValue, (newValue) => {
    if (current.value !== String(newValue)) {
        current.value = String(newValue)
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
</style>

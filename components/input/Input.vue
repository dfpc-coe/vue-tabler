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
                            :stroke='1'
                        />
                        <IconLock
                            v-else-if='icon === "lock"'
                            :size='20'
                            :stroke='1'
                        />
                        <IconUser
                            v-else-if='icon === "user"'
                            :size='20'
                            :stroke='1'
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
                                :stroke='1'
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
                                :stroke='1'
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
                                :stroke='1'
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

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import TablerLabel from '../internal/Label.vue'
import {
    IconUser,
    IconCircleXFilled,
    IconLock,
    IconSearch,
    IconEye,
    IconEyeOff
} from '@tabler/icons-vue'

const props = defineProps({
    modelValue: {
        type: [String, Number],
        required: true
    },
    autocomplete: {
        type: String,
        default: 'on'
    },
    autofocus: {
        type: Boolean,
        default: false
    },
    icon: {
        type: String,
        default: ''
    },
    loading: {
        type: Boolean,
        default: false
    },
    required: {
        type: Boolean,
        default: false,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    description: {
        type: String,
        default: '',
    },
    rows: {
        type: Number,
        default: 1
    },
    wrap: {
        type: String,
        default: 'soft'
    },
    type: {
        type: String,
        default: 'text'
    },
    label: {
        type: String,
        default: ''
    },
    placeholder: {
        type: String,
        default: ''
    },
    error: {
        type: String,
        default: ''
    },
})

const emit = defineEmits(['blur', 'focus', 'submit', 'update:modelValue'])

const textInput = ref(null)
const internal_error = ref('')
const current = ref(props.modelValue === undefined ? '' : props.modelValue)

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
        } else if (currentInt === props.modelValue) {
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

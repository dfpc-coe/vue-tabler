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
            <input
                ref='textInput'
                :disabled='disabled'
                :autofocus='autofocus'
                :accept='accept'
                type='file'
                :class='{
                    "is-invalid": errorstr
                }'
                class='form-control'
                :placeholder='placeholder||label||""'
                @change='$emit("change", $event)'
                @blur='$emit("blur")'
            >
            <span
                v-if='loading'
                class='input-icon-addon'
            >
                <div
                    class='spinner-border spinner-border-sm text-secondary'
                    role='status'
                />
            </span>
            <div
                v-if='errorstr'
                class='invalid-feedback'
                v-text='errorstr'
            />
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import TablerLabel from '../internal/Label.vue'

const props = defineProps({
    modelValue: {
        type: [String, Number],
        required: true
    },
    autofocus: {
        type: Boolean,
        default: false
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
    accept: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: '',
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

defineEmits(['blur', 'change'])

const textInput = ref(null)
const internal_error = ref('')

const errorstr = computed(() => {
    if (props.error) return props.error
    return internal_error.value
})

onMounted(() => {
    if (props.autofocus) {
        textInput.value.focus()
    }
})
</script>

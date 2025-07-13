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
                ref='text-input'
                @change='$emit("change", $event)'
                :disabled='disabled'
                :autofocus='autofocus'
                :accept='accept'
                type='file'
                :class='{
                    "is-invalid": errorstr
                }'
                class='form-control'
                :placeholder='placeholder||label||""'
                @blur='$emit("blur")'
            />
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

<script>
import TablerLabel from '../internal/Label.vue';

export default {
    name: 'TablerFileInput',
    components: {
        TablerLabel
    },
    props: {
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
        },
        description: {
            type: String,
            default: '',
        },
        label: String,
        placeholder: String,
        error: String,
    },
    emits: ['blur', 'change'],
    data: function() {
        return {
            help: false,
            internal_error: '',
        }
    },
    computed: {
        errorstr: function() {
            if (this.error) return this.error;
            return this.internal_error;
        },
    },
    mounted: function() {
        if (this.autofocus) {
            this.$refs['text-input'].focus();
        }
    }
}
</script>

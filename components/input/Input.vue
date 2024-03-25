<template>
<div class='row'>
    <TablerLabel :label='label' :description='description' :required='required'><slot/></TablerLabel>
    <div class='col-12'>
        <template v-if='!rows || rows <= 1'>
            <input :disabled='disabled' :value='modelValue' @input='event => current = event.target.value' :type='computed_type' :class='{
                "is-invalid": errorstr
            }' class="form-control" :placeholder='label||placeholder||""'/>
        </template>
        <template v-else>
            <textarea
                :disabled='disabled'
                :wrap='wrap'
                :rows='rows'
                :value='modelValue'
                @input='event => current = event.target.value'
                :type='computed_type'
                :class='{
                    "is-invalid": errorstr
                }'
                class="form-control"
                :placeholder='label||placeholder||""'
            />
        </template>
        <div v-if='errorstr' v-text='errorstr' class="invalid-feedback"></div>
    </div>
</div>
</template>

<script>
import TablerLabel from '../internal/Label.vue';

export default {
    name: 'TablerInput',
    props: {
        modelValue: {
            type: [String, Number],
            required: true
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
        label: String,
        placeholder: String,
        error: String,
    },
    data: function() {
        return {
            help: false,
            internal_error: '',
            current: ''
        }
    },
    computed: {
        errorstr: function() {
            if (this.error) return this.error;
            return this.internal_error;
        },
        computed_type: function() {
            if (this.type === 'integer') return 'number';
            return this.type;
        }
    },
    watch: {
        current: function() {
            if (typeof this.modelValue === 'number' || this.type === 'number') {
                const current = Number(this.current);

                if (isNaN(current)) {
                    this.internal_error = 'Must be a number!';
                } else if (current === this.modelValue) {
                    this.internal_error = '';
                    return;
                } else {
                    this.internal_error = '';
                    this.$emit('update:modelValue', current);
                }
            } else if (this.type === 'integer') {
                const current = parseInt(this.current);

                if (isNaN(current)) {
                    this.internal_error = 'Must be an integer!';
                } else if (current === this.modelValue) {
                    this.internal_error = '';
                    return;
                } else {
                    this.internal_error = '';
                    this.$emit('update:modelValue', current);
                }
            } else {
                this.internal_error = '';
                if (this.current === this.modelValue) return;
                this.$emit('update:modelValue', this.current);
            }
        }
    },
    components: {
        TablerLabel
    }
}
</script>

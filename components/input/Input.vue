<template>
<div class='row'>
    <TablerLabel :label='label || placeholder' :description='description' :required='required'><slot/></TablerLabel>
    <div class='col-12'>
        <template v-if='!rows || rows <= 1'>
            <input :disabled='disabled' :value='modelValue' @input='event => current = event.target.value' :type='type' :class='{
                "is-invalid": error
            }' class="form-control" :placeholder='label||placeholder||""'/>
        </template>
        <template v-else>
            <textarea style='white-space: pre;' :disabled='disabled' :rows='rows' :value='modelValue' @input='event => current = event.target.value' :type='type' :class='{
                "is-invalid": error
            }' class="form-control" :placeholder='label||placeholder||""'/>
        </template>
        <div v-if='error' v-text='error' class="invalid-feedback"></div>
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
            current: ''
        }
    },
    watch: {
        current: function() {
            if (typeof this.modelValue === 'number') {
                const current = Number(this.current);

                if (isNaN(current)) {
                    this.error = 'Must be a number!';
                } else if (current === this.modelValue) {
                    return;
                } else {
                    this.$emit('update:modelValue', current);
                }
            } else {
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

<template>
<div class='row'>
    <TablerLabel :label='label' :description='description' :required='required'><slot/></TablerLabel>
    <div class='col-12'>
        <select v-model='current' :disabled='disabled' class='form-select'>
            <option :key='option' v-for='option in options' :value="option" v-text='option'></option>
        </select>
    </div>
</div>
</template>

<script>
import TablerLabel from '../internal/Label.vue';

export default {
    name: 'TablerEnum',
    props: {
        modelValue: {
            type: String,
            required: true
        },
        default: {
            type: String,
            required: false
        },
        required: {
            type: Boolean,
            required: false
        },
        description: {
            type: String,
            required: false
        },
        options: {
            type: Array,
            required: true
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        label: String,
    },
    data: function() {
        const data = {
            current: ''
        }

        if (!this.modelValue && this.default) {
            data.current = this.default
        } else {
            data.current = this.modelValue;
        }

        return data;
    },
    watch: {
        modelValue: function() {
            this.current = this.modelValue;
        },
        current: function() {
            if (this.current === this.modelValue) return;
            this.$emit('update:modelValue', this.current);
        }
    },
    components: {
        TablerLabel
    }
}
</script>

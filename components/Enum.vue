<template>
<div>
    <label v-if='label' class="form-label" v-text='label'></label>

    <select v-model='current' :disabled='disabled' class='form-select'>
        <option v-for='option in options' :value="option" v-text='option'></option>
    </select>
</div>
</template>

<script>
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
        return {
            current: ''
        }
    },
    mounted: function() {
        if (!this.modelValue && this.default) this.current = this.default
        else this.current = this.modelValue;
    },
    watch: {
        modelValue: function() {
            this.current = this.modelValue;
        },
        current: function() {
            if (this.current === this.modelValue) return;
            this.$emit('update:modelValue', this.current);
        }
    }
}
</script>

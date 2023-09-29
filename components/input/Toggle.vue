<template>
<div>
    <TablerLabel :label='label' :required='required' :description='description'>
        <label class='form-switch'>
            <input v-model='current' :disabled='disabled' class="form-check-input" type="checkbox">
        </label>
    </TablerLabel>
</div>
</template>

<script>
import TablerLabel from '../internal/Label.vue';

export default {
    name: 'TablerToggle',
    props: {
        modelValue: {
            type: Boolean,
            required: true
        },
        disabled: {
            type: Boolean,
            default: false
        },
        required: {
            type: Boolean,
            default: false
        },
        description: {
            type: String,
            default: ''
        },
        label: {
            type: String,
            default: ''
        }
    },
    data: function() {
        return {
            current: this.modelValue
        }
    },
    mounted: function() {
        this.current = this.modelValue;
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

<template>
<div class='row'>
    <TablerLabel :label='label' :description='description' :required='required'><slot/></TablerLabel>
    <div class='col-12'>
        <input :disabled='disabled' v-model='current' type="range" class="form-range" :min="min" :max="max" :step="step">
    </div>
</div>
</template>

<script>
import TablerLabel from '../internal/Label.vue';

export default {
    name: 'TablerRange',
    props: {
        modelValue: {
            type: Number,
            required: true
        },
        min: {
            type: Number,
            default: 0
        },
        max: {
            type: Number,
            default: 10
        },
        step: {
            type: Number,
            default: 1
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
        label: String,
    },
    data: function() {
        return {
            help: false,
            current: this.modelValue
        }
    },
    watch: {
        current: function() {
            if (this.current === this.modelValue) return;
            this.$emit('update:modelValue', Number(this.current));
        }
    },
    components: {
        TablerLabel
    }
}
</script>

<template>
    <div class='row'>
        <TablerLabel
            :label='label'
            :description='description'
            :required='required'
        >
            <slot />
        </TablerLabel>
        <div class='col-12'>
            <input
                :disabled='disabled'
                :autofocus='autofocus'
                :value='modelValue'
                type='range'
                class='form-range'
                :min='min'
                :max='max'
                :step='step'
                @input='event => current = event.target.value'
            >
        </div>
    </div>
</template>

<script>
import TablerLabel from '../internal/Label.vue';

export default {
    name: 'TablerRange',
    components: {
        TablerLabel
    },
    props: {
        modelValue: {
            type: Number,
            required: true
        },
        autofocus: {
            type: Boolean,
            default: false
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
    emits: [
        'update:modelValue'
    ],
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
    }
}
</script>

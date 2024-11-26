<template>
    <div>
        <TablerLabel
            :label='label'
            :required='required'
            :description='description'
        >
            <label class='form-switch'>
                <input
                    v-model='current'
                    :disabled='disabled'
                    :autofocus='autofocus'
                    class='form-check-input'
                    type='checkbox'
                >
            </label>
        </TablerLabel>
    </div>
</template>

<script>
import TablerLabel from '../internal/Label.vue';

export default {
    name: 'TablerToggle',
    components: {
        TablerLabel
    },
    props: {
        modelValue: {
            type: Boolean,
            required: true
        },
        autofocus: {
            type: Boolean,
            default: false
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
    emits: [
        'update:modelValue'
    ],
    data: function() {
        return {
            current: this.modelValue
        }
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
    mounted: function() {
        this.current = this.modelValue;
    }
}
</script>

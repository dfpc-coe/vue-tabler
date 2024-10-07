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
            <select
                v-model='current'
                :disabled='disabled'
                class='form-select'
            >
                <option
                    v-for='option in options'
                    :key='option'
                    :value='option'
                    v-text='option'
                />
            </select>
        </div>
    </div>
</template>

<script>
import TablerLabel from '../internal/Label.vue';

export default {
    name: 'TablerEnum',
    components: {
        TablerLabel
    },
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
    emits: [
        'update:modelValue'
    ],
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
    }
}
</script>

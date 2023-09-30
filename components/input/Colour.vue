<template>
<div class='row'>
    <TablerLabel :label='label' :description='description' :required='required'><slot/></TablerLabel>
    <div class='col-12'>
        <div class="row g-2">
            <div :key='color' v-for='color in Object.keys(colours)' class='col-auto'>
                <label class="form-colorinput">
                    <input :disabled='disabled' v-model='current' :value='color' type="radio" class="form-colorinput-input">
                    <span class="form-colorinput-color bg-dark" :class='[
                        `bg-${color}`
                    ]'></span>
                </label>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import TablerLabel from '../internal/Label.vue';

export default {
    name: 'TablerColour',
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
        disabled: {
            type: Boolean,
            default: false,
        },
        label: String,
    },
    data: function() {
        return {
            current: '',
            invertColours: {
                '#1d273b': 'dark',
                '#ffffff': 'white',
                '#206bc4': 'blue',
                '#4299e1': 'azure',
                '#4263eb': 'indigo',
                '#ae3ec9': 'purple',
                '#d6336c': 'pink',
                '#d63939': 'red',
                '#f76707': 'orange',
                '#f59f00': 'yellow',
                '#74b816': 'lime'
            },
            colours: {
                dark: '#1d273b',
                white: '#ffffff',
                blue: '#206bc4',
                azure: '#4299e1',
                indigo: '#4263eb',
                purple: '#ae3ec9',
                pink: '#d6336c',
                red: '#d63939',
                orange: '#f76707',
                yellow: '#f59f00',
                lime: '#74b816'
            }
        }
    },
    mounted: function() {
        if (!this.modelValue && this.default) this.current = this.invertColours[this.default]
        else this.current = this.invertColours[this.modelValue];
    },
    watch: {
        modelValue: function() {
            this.current = this.invertColours[this.modelValue];
        },
        current: function() {
            if (this.colours[this.current] === this.modelValue) return;
            this.$emit('update:modelValue', this.colours[this.current]);
        }
    },
    components: {
        TablerLabel
    }
}
</script>

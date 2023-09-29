<template>
<div class='d-flex'>
    <span v-if='description' class='align-self-center' style='margin-right: 4px;'>
        <InfoSquareIcon @click='help = true' size='20' class='cursor-pointer'/>
        <Help v-if='help' @click='help = false' :label='label || placeholder' :description='description'/>
    </span>
    <div
        v-if='label'
        class='mx-2 align-self-center'
        :class='{
            "required": required
        }'
        v-text='label'
    ></div>
    <div class="align-self-center ms-auto">
        <label class='form-switch'>
            <input v-model='current' :disabled='disabled' class="form-check-input" type="checkbox">
        </label>
    </div>
</div>
</template>

<script>
import {
    InfoSquareIcon
} from 'vue-tabler-icons';
import Help from '../Help.vue';

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
        InfoSquareIcon,
        Help
    }
}
</script>

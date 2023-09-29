<template>
<div class='row'>
    <div class='col-12 d-flex'>
        <span v-if='description' style='margin-right: 4px;'>
            <InfoSquareIcon @click='help = true' size='20' class='cursor-pointer'/>
            <Help v-if='help' @click='help = false' :label='label' :description='description'/>
        </span>
        <label
            v-if='label'
            class="form-label"
            v-text='label'
            :class='{
                "required": required
            }'
        ></label>
    </div>
    <div class='col-12'>
        <input :disabled='disabled' v-model='current' type="range" class="form-range" :min="min" :max="max" :step="step">
    </div>
</div>
</template>

<script>
import {
    InfoSquareIcon
} from 'vue-tabler-icons';
import Help from './Help.vue';

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
            current: ''
        }
    },
    watch: {
        current: function() {
            if (this.current === this.modelValue) return;
            this.$emit('update:modelValue', this.current);
        }
    },
    components: {
        Help,
        InfoSquareIcon
    }
}
</script>

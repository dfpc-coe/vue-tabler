<template>
<div>
    <label v-if='label' class="form-label" v-text='label'></label>

    <template v-if='!rows || rows <= 1'>
        <input :disabled='disabled' :value='modelValue' @input='event => current = event.target.value' type="text" :class='{
            "is-invalid": error
        }' class="form-control" :placeholder='label||placeholder||""'/>
    </template>
    <template v-else>
        <textarea :disabled='disabled' :rows='rows' :value='modelValue' @input='event => current = event.target.value' type="text" :class='{
            "is-invalid": error
        }' class="form-control" :placeholder='label||placeholder||""'/>
    </template>
    <div v-if='error' v-text='error' class="invalid-feedback"></div>
</div>
</template>

<script>
export default {
    name: 'TablerInput',
    props: {
        modelValue: {
            type: String,
            default: '',
            required: true
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        rows: {
            type: Number,
            default: 1
        },
        label: String,
        placeholder: String,
        error: String,
    },
    data: function() {
        return {
            current: ''
        }
    },
    watch: {
        current: function() {
            if (this.current === this.modelValue) return;
            this.$emit('update:modelValue', this.current);
        }
    }
}
</script>

<template>
<div>
    <div class='d-flex align-items-center'>
        <label class='form-label my-1 mx-2' v-text='label'/>
        <label class="ms-auto form-check form-switch pt-2">
            <input v-model='current' :disabled='disabled' class="form-check-input" type="checkbox">
        </label>
    </div>
</div>
</template>

<script>
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
        label: String
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
        current: function() {
            if (this.current === this.modelValue) return;
            this.$emit('update:modelValue', this.current);
        }
    },
}
</script>

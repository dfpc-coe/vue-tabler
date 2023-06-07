<template>
<div class="dropdown">
    <a class="dropdown-toggle text-muted" href="#" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-text='current'></a>
    <div class="dropdown-menu dropdown-menu-end">
        <a
            :key='option'
            v-for='option in options'
            @click='current = option'
            class="dropdown-item"
            :class='{
                active: option === current
            }'
            v-text='option'
        ></a>
    </div>
</div>
</template>

<script>
export default {
    name: 'TablerSelect',
    props: {
        modelValue: {
            type: String,
            required: true,
        },
        default: {
            type: String,
            required: false
        },
        options: {
            type: Array,
            required: true
        },
    },
    data: function() {
        return {
            current: ''
        }
    },
    watch: {
        current: function() {
            if (this.modelValue !== this.current) {
                this.$emit('update:modelValue', this.current);
            }
        }
    },
    mounted: function() {
        if (!this.default) {
            this.current = this.options[0];
        } else {
            this.current = this.default;
        }
    },
}
</script>

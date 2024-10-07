<template>
    <div class='dropdown'>
        <a
            class='dropdown-toggle text-muted'
            href='#'
            data-bs-toggle='dropdown'
            aria-haspopup='true'
            aria-expanded='false'
            v-text='current'
        />
        <div class='dropdown-menu dropdown-menu-end'>
            <a
                v-for='option in options'
                :key='option'
                class='dropdown-item'
                :class='{
                    active: option === current
                }'
                @click='current = option'
                v-text='option'
            />
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
    emits: [
        'update:modelValue'
    ],
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
        if (!this.modelValue && this.default) this.current = this.default
        else this.current = this.modelValue;
    },
}
</script>

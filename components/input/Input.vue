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
            <template v-if='!rows || rows <= 1'>
                <div class='input-icon'>
                    <span
                        v-if='icon'
                        class='input-icon-addon'
                    >
                        <IconSearch
                            v-if='icon === "search"'
                            :size='20'
                            :stroke='1'
                        />
                        <IconLock
                            v-if='icon === "lock"'
                            :size='20'
                            :stroke='1'
                        />
                        <IconUser
                            v-if='icon === "user"'
                            :size='20'
                            :stroke='1'
                        />
                    </span>
                    <input
                        v-model='current'
                        :disabled='disabled'
                        :autocomplete='autocomplete'
                        :type='computed_type'
                        :class='{
                            "is-invalid": errorstr
                        }'
                        class='form-control'
                        :placeholder='placeholder||label||""'
                        @keyup.enter='$emit("submit")'
                    >
                    <span
                        v-if='loading'
                        class='input-icon-addon'
                    >
                        <div
                            class='spinner-border spinner-border-sm text-secondary'
                            role='status'
                        />
                    </span>
                    <div
                        v-if='errorstr'
                        class='invalid-feedback'
                        v-text='errorstr'
                    />
                </div>
            </template>
            <template v-else>
                <textarea
                    v-model='current'
                    :disabled='disabled'
                    :autocomplete='autocomplete'
                    :wrap='wrap'
                    :rows='rows'
                    :type='computed_type'
                    :class='{
                        "is-invalid": errorstr
                    }'
                    class='form-control'
                    :placeholder='placeholder||label||""'
                    @keyup.enter='$emit("submit")'
                />
                <div
                    v-if='errorstr'
                    class='invalid-feedback'
                    v-text='errorstr'
                />
            </template>
        </div>
    </div>
</template>

<script>
import TablerLabel from '../internal/Label.vue';
import {
    IconUser,
    IconLock,
    IconSearch
} from '@tabler/icons-vue';

export default {
    name: 'TablerInput',
    components: {
        IconUser,
        IconLock,
        IconSearch,
        TablerLabel
    },
    props: {
        modelValue: {
            type: [String, Number],
            required: true
        },
        autocomplete: {
            type: String,
            default: 'on'
        },
        icon: {
            type: String,
        },
        loading: {
            type: Boolean,
            default: false
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
        rows: {
            type: Number,
            default: 1
        },
        wrap: {
            type: String,
            default: 'soft'
        },
        type: {
            type: String,
            default: 'text'
        },
        label: String,
        placeholder: String,
        error: String,
    },
    emits: ['submit', 'update:modelValue'],
    data: function() {
        return {
            help: false,
            internal_error: '',
            current: this.modelValue === undefined ? '' : this.modelValue
        }
    },
    computed: {
        errorstr: function() {
            if (this.error) return this.error;
            return this.internal_error;
        },
        computed_type: function() {
            if (this.type === 'integer') return 'number';
            return this.type;
        }
    },
    watch: {
        modelValue: function() {
            if (this.current !== String(this.modelValue)) {
                this.current = String(this.modelValue);
            }
        },
        current: function() {
            if (typeof this.modelValue === 'number' || this.type === 'number') {
                const current = Number(this.current);

                if (isNaN(current)) {
                    this.internal_error = 'Must be a number!';
                } else if (current === this.modelValue) {
                    this.internal_error = '';
                    return;
                } else {
                    this.internal_error = '';
                    this.$emit('update:modelValue', current);
                }
            } else if (this.type === 'integer') {
                const current = parseInt(this.current);

                if (isNaN(current)) {
                    this.internal_error = 'Must be an integer!';
                } else if (current === this.modelValue) {
                    this.internal_error = '';
                    return;
                } else {
                    this.internal_error = '';
                    this.$emit('update:modelValue', current);
                }
            } else {
                this.internal_error = '';
                if (this.current === this.modelValue) return;
                this.$emit('update:modelValue', this.current);
            }
        }
    }
}
</script>

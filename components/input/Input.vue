<template>
<div class='row'>
    <TablerLabel
        v-if='label'
        :label='label'
        :description='description'
        :required='required'
    ><slot/></TablerLabel>
    <div class='col-12'>
        <template v-if='!rows || rows <= 1'>
            <div class='input-icon'>
                <span v-if='icon' class="input-icon-addon">
                    <IconSearch v-if='icon === "search"' :size='20' :stroke='1'/>
                    <IconLock v-if='icon === "lock"' :size='20' :stroke='1'/>
                    <IconUser v-if='icon === "user"' :size='20' :stroke='1'/>
                </span>
                <input
                    :disabled='disabled'
                    v-model='current'
                    @keyup.enter='$emit("submit")'
                    :type='computed_type'
                    :class='{
                        "is-invalid": errorstr
                    }'
                    class="form-control"
                    :placeholder='placeholder||label||""'
                />
                <span v-if='loading' class="input-icon-addon">
                    <div class="spinner-border spinner-border-sm text-secondary" role="status"></div>
                </span>
            </div>
        </template>
        <template v-else>
            <textarea
                :disabled='disabled'
                :wrap='wrap'
                :rows='rows'
                v-model='current'
                @keyup.enter='$emit("submit")'
                :type='computed_type'
                :class='{
                    "is-invalid": errorstr
                }'
                class="form-control"
                :placeholder='label||placeholder||""'
            />
        </template>
        <div v-if='errorstr' v-text='errorstr' class="invalid-feedback"></div>
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
    emits: ['submit', 'update:modelValue'],
    props: {
        modelValue: {
            type: [String, Number],
            required: true
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
    data: function() {
        return {
            help: false,
            internal_error: '',
            current: this.modelValue || ''
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
    },
    components: {
        IconUser,
        IconLock,
        IconSearch,
        TablerLabel
    }
}
</script>

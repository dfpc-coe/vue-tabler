<template>
    <div class='px-2 py-2'>
        <TablerLoading v-if='loading' />
        <template v-else>
            <div
                v-for='key in Object.keys(s.properties)'
                :key='key'
                class='py-2 floating-input'
            >
                <template v-if='s.properties[key].enum'>
                    <TablerEnum
                        v-model='data[key]'
                        :label='key'
                        :disabled='disabled'
                        :required='s.properties[key].required || false'
                        :description='s.properties[key].description || ""'
                        :options='s.properties[key].enum'
                        :default='s.properties[key].default'
                    />
                </template>
                <template v-else-if='s.properties[key].type === "string"'>
                    <TablerInput
                        v-model='data[key]'
                        :label='key'
                        :disabled='disabled'
                        :required='s.properties[key].required || false'
                        :rows='data[key] ? data[key].split("\n").length : 1'
                        :description='s.properties[key].description || ""'
                    />
                </template>
                <template v-else-if='s.properties[key].type === "number" || s.properties[key].type === "integer"'>
                    <TablerInput
                        v-model='data[key]'
                        :type='s.properties[key].type'
                        :label='key'
                        :disabled='disabled'
                        :required='s.properties[key].required || false'
                        :description='s.properties[key].description || ""'
                    />
                </template>
                <template v-else-if='s.properties[key].type === "boolean"'>
                    <TablerToggle
                        v-model='data[key]'
                        :label='key'
                        :disabled='disabled'
                        :required='s.properties[key].required || false'
                        :description='s.properties[key].description || ""'
                    />
                </template>
                <template v-else-if='s.properties[key].type === "array"'>
                    <div class='d-flex'>
                        <label
                            class='form-label'
                            v-text='key'
                        />
                        <div class='ms-auto'>
                            <IconPlus
                                v-if='!disabled'
                                :size='32'
                                :stroke='1'
                                class='cursor-pointer'
                                @click='push(key)'
                            />
                        </div>
                    </div>

                    <div
                        v-for='(arr, i) of data[key]'
                        :key='i'
                        class='border rounded my-2 py-2 mx-2 px-2'
                    >
                        <div class='d-flex'>
                            <div class='mx-2 my-2'>
                                Entry <span v-text='i + 1' />
                            </div>
                            <div class='ms-auto mx-2 my-2'>
                                <IconTrash
                                    v-if='!disabled'
                                    :size='32'
                                    :stroke='1'
                                    class='cursor-pointer'
                                    @click='data[key].splice(i, 1)'
                                />
                            </div>
                        </div>

                        <TablerSchema
                            v-model='data[key][i]'
                            :schema='s.properties[key].items'
                            :disabled='disabled'
                        />
                    </div>
                </template>
                <template v-else>
                    <div class='row'>
                        <TablerInput
                            v-model='data[key]'
                            :label='key'
                            :rows='3'
                            :disabled='disabled'
                        />
                    </div>
                </template>
            </div>
        </template>
    </div>
</template>

<script>
import TablerInput from './input/Input.vue';
import TablerToggle from './input/Toggle.vue';
import TablerEnum from './input/Enum.vue';
import TablerLoading from './Loading.vue';
import {
    IconPlus,
    IconTrash,
} from '@tabler/icons-vue';

export default {
    name: 'TablerSchema',
    components: {
        IconPlus,
        IconTrash,
        TablerInput,
        TablerToggle,
        TablerEnum,
        TablerLoading
    },
    props: {
        modelValue: {
            type: Object,
            required: true
        },
        schema: {
            type: Object,
            required: true
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    emits: [
        'update:modelValue'
    ],
    data: function() {
        return {
            loading: true,
            s: {},
            data: {},
        };
    },
    watch: {
        data: {
            deep: true,
            handler: function() {
                this.$emit('update:modelValue', this.data);
            }
        },
    },
    mounted: async function() {
        this.loading = true;
        this.data = JSON.parse(JSON.stringify(this.modelValue));
        this.s = JSON.parse(JSON.stringify(this.schema));

        if (this.s.type === 'object' && this.s.properties) {
            for (const req of (this.s.required || [])) {
                this.s.properties[req].required = true;
            }

            for (const key in this.s.properties) {
                if (!this.data[key] && this.s.properties[key].type === 'array') {
                    this.data[key] = [];
                }
            }
        }

        this.loading = false;
    },
    methods: {
        remove: function(key, arr, i) {
            this.data[key].splice(i, 1)
        },
        push: function(key) {
            if (!this.schema.properties[key].items) this.data[key].push('');
            if (this.schema.properties[key].items.type === 'object') {
                this.data[key].push({});
            } else if (this.schema.properties[key].items.type === 'array') {
                this.data[key].push([]);
            } else if (this.schema.properties[key].items.type === 'boolean') {
                this.data[key].push(false);
            } else {
                this.data[key].push('');
            }
        }
    }
}
</script>

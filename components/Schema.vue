<template>
<div class='px-2 py-2'>
    <div :key='key' v-for='key in Object.keys(schema.properties)' class='py-2 floating-input'>
        <template v-if='schema.properties[key].enum'>
            <TablerEnum
                :label='key'
                :disabled='disabled'
                :required='schema.properties[key].required || false'
                :description='schema.properties[key].description || ""'
                v-model='data[key]'
                :options='schema.properties[key].enum'
                :default='schema.properties[key].default'
            />
        </template>
        <template v-else-if='schema.properties[key].type === "string"'>
            <TablerInput
                :label='key'
                :disabled='disabled'
                :required='schema.properties[key].required || false'
                :description='schema.properties[key].description || ""'
                v-model='data[key]'
            />
        </template>
        <template v-else-if='schema.properties[key].type === "boolean"'>
            <TablerToggle
                :label='key'
                :disabled='disabled'
                :required='schema.properties[key].required || false'
                :description='schema.properties[key].description || ""'
                v-model='data[key]'
            />
        </template>
        <template v-else-if='schema.properties[key].type === "array"'>
            <div class='d-flex'>
                <label class='form-label' v-text='key'/>
                <div class='ms-auto'>
                    <PlusIcon v-if='!disabled' @click='push(key)' class='cursor-pointer'/>
                </div>
            </div>

            <div :key='i' v-for='(arr, i) of data[key]' class='border rounded my-2 py-2 mx-2 px-2'>
                <div class='d-flex'>
                    <div class='mx-2 my-2'>Entry <span v-text='i + 1'/></div>
                    <div class='ms-auto mx-2 my-2'>
                        <TrashIcon v-if='!disabled' @click='data[key].splice(i, 1)' class='cursor-pointer'/>
                    </div>
                </div>

                <GenericSchema :schema='schema.properties[key].items' :disabled='disabled' v-model='data[key][i]' />
            </div>
        </template>
        <template v-else>
            <div class='row'>
                <TablerInput
                    :label='key'
                    :rows='3'
                    :disabled='disabled'
                    v-model='data[key]'/>
            </div>
        </template>
    </div>
</div>
</template>

<script>
import TablerInput from './Input.vue';
import TablerToggle from './Toggle.vue';
import TablerEnum from './Enum.vue';
import {
    PlusIcon,
    TrashIcon,
} from 'vue-tabler-icons'

export default {
    name: 'TablerSchema',
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
    data: function() {
        return {
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
        this.data = JSON.parse(JSON.stringify(this.modelValue));

        for (const key of Object.keys(this.schema.properties)) {
            if (this.schema.properties[key].display === 'table') {
                this.edit[key] = new Map();
            }
        }

        if (this.schema.type === 'object' && this.schema.properties) {
            for (const key in this.schema.properties) {
                if (!this.data[key] && this.schema.properties[key].type === 'array') {
                    this.data[key] = [];
                }
            }
        }
    },
    methods: {
        remove: function(key, arr, i) {
            this.edit[key].delete(arr);
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
    },
    components: {
        PlusIcon,
        TrashIcon,
        TablerInput,
        TablerToggle,
        TablerEnum
    }
}
</script>
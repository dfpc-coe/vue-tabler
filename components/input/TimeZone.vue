<template>
<TablerEnum
    :label='label'
    :options='Array.from(timezones)'
    :description='description'
    :disabled='disabled'
    :required='required'
    :default='modelValue'
    v-on:change='$emit("update:modelValue", map.get($event.target.value).tzCode)'
/>
</template>

<script>
import TablerEnum from './Enum.vue'
import tzs from 'timezones-list'

export default {
    name: 'TablerTimeZone',
    props: {
        modelValue: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        required: {
            type: Boolean
        },
        disabled: {
            type: Boolean,
            default: false
        },
        label: {
            type: String,
            default: 'Default Timezone'
        },
    },
    data: function() {
        const map = new Map();

        map.set('No TimeZone', { tzCode: '' });
        for (const tz of tzs) {
            map.set(tz.label, tz);
        }

        const tzs = tzs.map((tz) => tz.label);

        return {
            map,
            internal: this.modelValue,
            timezones: ['No TimeZone'].concat(tzs.map((tz) => tz.label))
        }
    },
    components: {
        TablerEnum
    }
}
</script>

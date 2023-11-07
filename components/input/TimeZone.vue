<template>
<TablerEnum
    :label='label'
    :options='Array.from(timezones)'
    :description='description'
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

        for (const tz of tzs) {
            map.set(tz.label, tz);
        }

        return {
            map,
            internal: this.modelValue,
            timezones: tzs.map((tz) => tz.label)
        }
    },
    components: {
        TablerEnum
    }
}
</script>

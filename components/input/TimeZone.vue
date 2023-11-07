<template>
<TablerEnum
    :label='label'
    :options='Array.from(timezones)'
    :default='modelValue'
    v-on:change='$emit("update:modelValue", $event.target.value)'
/>
</template>

<script>
import {
    TablerEnum
} from '@tak-ps/vue-tabler'
import moment from 'moment-timezone';

export default {
    name: 'TimeZone',
    props: {
        modelValue: {
            type: String,
            required: true
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
        const timezones = new Set();

        for (const tz of moment.tz.names()
            .reduce((memo, tz) => {
                memo.push({
                  name: tz,
                  offset: moment.tz(tz).utcOffset()
                });

                return memo;
            }, [])
          .sort((a, b) => {
            return a.offset - b.offset
        })) {
            const timezone = tz.offset ? moment.tz(tz.name).format('Z') : '';

            timezones.add(`(GMT${timezone}) ${tz.name}`);
        }

        return {
            internal: this.modelValue,
            timezones
        }
    },
    components: {
        TablerEnum
    }
}
</script>
